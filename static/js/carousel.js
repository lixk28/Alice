/*
 * Carousel shortcode behaviour.
 *
 * No dependencies. Each root marked with `data-carousel` is one instance.
 * The script owns the active state, height measurement, autoplay, keyboard
 * navigation, indicators, and touch swipes. Without this script the carousel
 * still shows its first slide, and a <noscript> block stacks every slide.
 */
(() => {
    "use strict";

    const toBool = (value, fallback) => {
        if (value === null || value === undefined || value === "") return fallback;
        return !["false", "no", "0", "off"].includes(String(value).toLowerCase());
    };

    const isEditableTarget = (target) => {
        if (!(target instanceof Element)) return false;
        return Boolean(
            target.closest(
                "input, textarea, select, video, iframe, [contenteditable='true']"
            )
        );
    };

    class Carousel {
        constructor(root) {
            this.root = root;
            this.viewport = root.querySelector(".carousel-viewport");
            this.track = root.querySelector(".carousel-track");
            if (!this.viewport || !this.track) return;

            this.slides = Array.from(this.track.children).filter((element) =>
                element.classList.contains("carousel-item")
            );
            if (this.slides.length < 2) return;

            this.prevButton = root.querySelector(".carousel-control-prev");
            this.nextButton = root.querySelector(".carousel-control-next");
            this.indicators = Array.from(
                root.querySelectorAll("[data-carousel-goto]")
            );
            this.counter = root.querySelector(".carousel-counter-current");
            this.autoplayButton = root.querySelector(".carousel-autoplay");
            this.autoplayProgress = root.querySelector(
                ".carousel-autoplay-progress"
            );
            this.status = root.querySelector(".carousel-live");

            this.interval = Math.max(
                0,
                parseInt(root.dataset.interval || "0", 10) || 0
            );
            this.loop = toBool(root.dataset.loop, true);
            this.keyboard = toBool(root.dataset.keyboard, true);
            this.pauseOnInteraction = toBool(root.dataset.pause, true);
            this.effect = root.dataset.effect === "fade" ? "fade" : "slide";
            this.perView = this.readPerView();

            const start = parseInt(root.dataset.start || "0", 10) || 0;
            this.index = Math.min(Math.max(start, 0), this.maxIndex());

            this.timer = null;
            this.hovering = false;
            this.focusWithin = false;
            this.ignoreHover = false;
            this.ignoreFocus = false;
            this.visible = !("IntersectionObserver" in window);
            this.dragging = false;
            this.pointerDown = false;
            this.ignoreDrag = false;
            this.pointerId = null;
            this.suppressClickUntil = 0;
            this.userPaused = false;
            this.prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            this.init();
        }

        readPerView() {
            const raw = parseFloat(
                window
                    .getComputedStyle(this.root)
                    .getPropertyValue("--carousel-per-view")
            );
            const count = this.slides.length;
            const value = Number.isFinite(raw) ? Math.round(raw) : 1;
            return Math.min(Math.max(value, 1), count);
        }

        maxIndex() {
            return Math.max(0, this.slides.length - this.perView);
        }

        getStep() {
            if (this.slides.length < 2) return this.viewport.clientWidth;
            const first = this.slides[0].getBoundingClientRect();
            const second = this.slides[1].getBoundingClientRect();
            const step = second.left - first.left;
            return step > 0 ? step : this.viewport.clientWidth;
        }

        refreshLayout(immediate = false) {
            const perView = this.readPerView();
            const changed = perView !== this.perView;
            this.perView = perView;

            if (this.index > this.maxIndex()) this.index = this.maxIndex();

            this.activate(this.index);
            this.updateTransform(immediate || changed);
            this.updateHeight();
            this.updateControls();
            if (changed) this.updateStatus();
        }

        init() {
            if (this.interval > 0 && this.prefersReducedMotion) {
                this.userPaused = true;
            }

            this.bind();
            this.activate(this.index);
            this.updateTransform(true);
            this.updateHeight();
            this.updateControls();
            this.updateLiveMode();
            this.updateStatus();
            this.root.classList.add("is-ready");
            this.observe();

            if (this.interval > 0) {
                this.updateAutoplayButton();
                this.schedule();
            }
        }

        bind() {
            this.prevButton?.addEventListener("click", () =>
                this.userNavigate(() => this.prev())
            );
            this.nextButton?.addEventListener("click", () =>
                this.userNavigate(() => this.next())
            );

            this.indicators.forEach((button) => {
                button.addEventListener("click", () => {
                    const index = parseInt(button.dataset.carouselGoto, 10);
                    if (!Number.isNaN(index)) {
                        this.userNavigate(() => this.goTo(index));
                    }
                });
            });

            this.autoplayButton?.addEventListener("click", () =>
                this.toggleAutoplay()
            );

            if (this.keyboard) {
                this.root.addEventListener("keydown", (event) =>
                    this.onKeydown(event)
                );
            }

            this.root.addEventListener("pointerenter", (event) => {
                if (event.pointerType !== "mouse") return;
                if (!this.pauseOnInteraction) return;
                this.hovering = true;
                if (!this.ignoreHover) this.clearTimer();
            });
            this.root.addEventListener("pointerleave", (event) => {
                if (event.pointerType !== "mouse") return;
                if (!this.pauseOnInteraction) return;
                this.hovering = false;
                this.ignoreHover = false;
                this.schedule();
            });
            this.root.addEventListener("focusin", () => {
                if (!this.pauseOnInteraction) return;
                this.focusWithin = true;
                if (!this.ignoreFocus) this.clearTimer();
            });
            this.root.addEventListener("focusout", (event) => {
                if (!this.pauseOnInteraction) return;
                if (
                    event.relatedTarget &&
                    this.root.contains(event.relatedTarget)
                ) {
                    return;
                }
                this.focusWithin = false;
                this.ignoreFocus = false;
                this.schedule();
            });

            this.viewport.addEventListener("pointerdown", (event) =>
                this.onPointerDown(event)
            );
            this.viewport.addEventListener(
                "pointermove",
                (event) => this.onPointerMove(event),
                { passive: false }
            );
            this.viewport.addEventListener("pointerup", (event) =>
                this.onPointerUp(event)
            );
            this.viewport.addEventListener("pointercancel", () =>
                this.onPointerCancel()
            );
            this.viewport.addEventListener(
                "click",
                (event) => {
                    if (Date.now() >= this.suppressClickUntil) return;
                    this.suppressClickUntil = 0;
                    event.preventDefault();
                    event.stopPropagation();
                },
                true
            );

            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") this.schedule();
                else this.clearTimer();
            });
        }

        observe() {
            if ("ResizeObserver" in window) {
                this.resizeObserver = new ResizeObserver(() => {
                    if (this.dragging) return;
                    this.refreshLayout();
                });
                this.resizeObserver.observe(this.viewport);
                this.slides.forEach((slide) =>
                    this.resizeObserver.observe(slide)
                );
            }

            this.slides.forEach((slide) => {
                slide.querySelectorAll("img").forEach((image) => {
                    if (!image.complete) {
                        image.addEventListener(
                            "load",
                            () => this.updateHeight(),
                            { once: true }
                        );
                    }
                });
            });

            window.addEventListener("resize", () => {
                if (this.dragging) return;
                this.refreshLayout(true);
            });

            if ("IntersectionObserver" in window) {
                this.intersectionObserver = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            this.visible = entry.isIntersecting;
                            if (this.visible) this.schedule();
                            else this.clearTimer();
                        });
                    },
                    { threshold: 0 }
                );
                this.intersectionObserver.observe(this.root);
            }
        }

        onKeydown(event) {
            if (
                event.defaultPrevented ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey
            ) {
                return;
            }
            if (isEditableTarget(event.target)) return;

            let handled = true;
            switch (event.key) {
                case "ArrowLeft":
                    this.userNavigate(() => this.prev());
                    break;
                case "ArrowRight":
                    this.userNavigate(() => this.next());
                    break;
                case "Home":
                    this.userNavigate(() => this.goTo(0));
                    break;
                case "End":
                    this.userNavigate(() => this.goTo(this.maxIndex()));
                    break;
                default:
                    handled = false;
            }

            if (handled) event.preventDefault();
        }

        goTo(index, options = {}) {
            const { animate = true } = options;
            const maxIndex = this.maxIndex();
            const positions = maxIndex + 1;
            let next = index;

            if (this.loop) {
                next = ((next % positions) + positions) % positions;
            } else {
                next = Math.min(Math.max(next, 0), maxIndex);
            }

            if (next === this.index) {
                if (this.effect === "slide" && animate) {
                    this.updateTransform();
                }
                return false;
            }

            const previous = this.index;
            this.index = next;
            this.activate(next);
            this.updateTransform(!animate);
            this.updateHeight();
            this.updateControls();
            this.updateStatus();

            this.root.dispatchEvent(
                new CustomEvent("carousel:change", {
                    bubbles: true,
                    detail: {
                        index: next,
                        previous,
                        slide: this.slides[next],
                    },
                })
            );

            return true;
        }

        activate(index) {
            const last = Math.min(index + this.perView, this.slides.length);
            this.slides.forEach((slide, i) => {
                const active = i >= index && i < last;
                slide.classList.toggle("is-active", active);
                if (active) {
                    slide.removeAttribute("aria-hidden");
                    slide.removeAttribute("inert");
                } else {
                    slide.setAttribute("aria-hidden", "true");
                    slide.setAttribute("inert", "");
                }
            });
        }

        updateTransform(immediate = false) {
            if (this.effect !== "slide") return;
            if (immediate) this.track.style.transition = "none";
            this.track.style.transform = `translate3d(${
                -this.index * this.getStep()
            }px, 0, 0)`;
            if (immediate) {
                void this.track.offsetWidth;
                requestAnimationFrame(() => {
                    this.track.style.transition = "";
                });
            }
        }

        updateHeight() {
            const last = Math.min(
                this.index + this.perView,
                this.slides.length
            );
            let height = 0;
            for (let i = this.index; i < last; i += 1) {
                height = Math.max(height, this.slides[i].offsetHeight);
            }
            if (height > 0) {
                const next = `${height}px`;
                if (this.viewport.style.height !== next) {
                    this.viewport.style.height = next;
                }
            }
        }

        updateControls() {
            const maxIndex = this.maxIndex();
            const atStart = this.index <= 0;
            const atEnd = this.index >= maxIndex;

            if (this.prevButton) {
                this.prevButton.disabled =
                    maxIndex === 0 || (!this.loop && atStart);
            }
            if (this.nextButton) {
                this.nextButton.disabled =
                    maxIndex === 0 || (!this.loop && atEnd);
            }

            this.indicators.forEach((button) => {
                const index = parseInt(button.dataset.carouselGoto, 10);
                const item = button.closest("li");
                if (item) item.hidden = index > maxIndex;
                if (index === this.index) {
                    button.setAttribute("aria-current", "true");
                } else {
                    button.removeAttribute("aria-current");
                }
            });

            if (this.counter) {
                if (this.perView > 1) {
                    const last = Math.min(
                        this.index + this.perView,
                        this.slides.length
                    );
                    this.counter.textContent = `${
                        this.index + 1
                    }\u2013${last}`;
                } else {
                    this.counter.textContent = String(this.index + 1);
                }
            }
        }

        updateStatus() {
            if (!this.status) return;
            const first = this.index + 1;
            const last = Math.min(
                this.index + this.perView,
                this.slides.length
            );
            const range =
                this.perView > 1
                    ? `Slides ${first} to ${last}`
                    : `Slide ${first}`;
            this.status.textContent = `${range} of ${this.slides.length}`;
        }

        updateLiveMode() {
            if (!this.status) return;
            this.status.setAttribute(
                "aria-live",
                this.canAutoplay() ? "off" : "polite"
            );
        }

        updateAutoplayButton() {
            if (!this.autoplayButton) return;
            const playing = !this.userPaused;
            const label = playing ? "Pause autoplay" : "Start autoplay";
            this.autoplayButton.dataset.playing = String(playing);
            this.autoplayButton.dataset.tooltip = label;
            this.autoplayButton.setAttribute("aria-label", label);
        }

        toggleAutoplay() {
            if (this.interval <= 0) return;

            this.userPaused = !this.userPaused;
            this.updateAutoplayButton();
            this.updateLiveMode();

            if (this.userPaused) {
                this.ignoreHover = false;
                this.ignoreFocus = false;
                this.clearTimer();
                this.updateStatus();
                return;
            }

            /* Starting the autoplay is an explicit choice: do not let the
             * button's own hover/focus state stop it immediately. */
            this.ignoreHover = true;
            this.ignoreFocus = true;

            if (!this.loop && this.index >= this.maxIndex()) {
                this.goTo(0);
            }
            this.schedule();
        }

        canAutoplay() {
            const pausedByInteraction =
                this.pauseOnInteraction &&
                ((this.hovering && !this.ignoreHover) ||
                    (this.focusWithin && !this.ignoreFocus));

            return (
                this.interval > 0 &&
                !this.userPaused &&
                !pausedByInteraction &&
                !this.pointerDown &&
                !this.dragging &&
                this.visible &&
                document.visibilityState === "visible"
            );
        }

        startAutoplayProgress() {
            if (!this.autoplayProgress) return;
            this.autoplayProgress.classList.remove("is-running");
            /* Force a reflow so restarting the class restarts the animation. */
            void this.autoplayProgress.offsetWidth;
            this.autoplayProgress.classList.add("is-running");
        }

        stopAutoplayProgress() {
            this.autoplayProgress?.classList.remove("is-running");
        }

        schedule() {
            this.clearTimer();
            if (!this.canAutoplay()) return;

            this.startAutoplayProgress();
            this.timer = window.setTimeout(() => {
                this.timer = null;
                if (!this.canAutoplay()) {
                    this.stopAutoplayProgress();
                    return;
                }

                if (
                    !this.loop &&
                    this.index >= this.maxIndex()
                ) {
                    this.userPaused = true;
                    this.updateAutoplayButton();
                    this.updateLiveMode();
                    this.stopAutoplayProgress();
                    return;
                }

                this.next();
                this.schedule();
            }, this.interval);
        }

        clearTimer() {
            this.stopAutoplayProgress();
            if (this.timer !== null) {
                window.clearTimeout(this.timer);
                this.timer = null;
            }
            this.updateLiveMode();
        }

        userNavigate(action) {
            this.clearTimer();
            action();
            this.schedule();
        }

        next() {
            if (!this.loop && this.index >= this.maxIndex()) {
                return false;
            }
            return this.goTo(this.index + 1);
        }

        prev() {
            if (!this.loop && this.index <= 0) return false;
            return this.goTo(this.index - 1);
        }

        onPointerDown(event) {
            if (event.pointerType === "mouse" || event.button !== 0) return;
            if (
                event.target instanceof Element &&
                event.target.closest(".carousel-controls")
            ) {
                return;
            }

            this.pointerDown = true;
            this.pointerId = event.pointerId;
            this.startX = event.clientX;
            this.startY = event.clientY;
            this.startTime = Date.now();
            this.deltaX = 0;
            this.dragging = false;
            this.ignoreDrag =
                event.target instanceof Element &&
                Boolean(
                    event.target.closest(
                        "input, textarea, select, video, iframe, [contenteditable='true']"
                    )
                );
            this.clearTimer();
        }

        onPointerMove(event) {
            if (
                !this.pointerDown ||
                this.ignoreDrag ||
                event.pointerId !== this.pointerId
            ) {
                return;
            }

            const dx = event.clientX - this.startX;
            const dy = event.clientY - this.startY;

            if (!this.dragging) {
                if (Math.abs(dx) < 8) return;
                if (Math.abs(dy) > Math.abs(dx)) return;

                this.dragging = true;
                this.root.classList.add("is-dragging");
                try {
                    this.viewport.setPointerCapture?.(event.pointerId);
                } catch {
                    /* Synthetic pointers have no capture target. */
                }
                this.track.style.transition = "none";
            }

            if (event.cancelable) event.preventDefault();
            this.deltaX = dx;
            this.applyDrag(dx);
        }

        applyDrag(dx) {
            if (this.effect !== "slide") return;

            const atStart = this.index === 0;
            const atEnd = this.index >= this.maxIndex();
            const step = this.getStep();
            let offset = dx;

            if (!this.loop) {
                if ((atStart && dx > 0) || (atEnd && dx < 0)) {
                    offset = dx * 0.3;
                }
            }

            this.track.style.transform = `translate3d(${
                -this.index * step + offset
            }px, 0, 0)`;
        }

        onPointerUp(event) {
            if (!this.pointerDown || event.pointerId !== this.pointerId) {
                return;
            }

            this.pointerDown = false;
            this.ignoreDrag = false;

            if (!this.dragging) {
                this.pointerId = null;
                this.deltaX = 0;
                this.schedule();
                return;
            }

            this.dragging = false;
            this.root.classList.remove("is-dragging");
            this.track.style.transition = "";

            if (this.viewport.hasPointerCapture?.(event.pointerId)) {
                this.viewport.releasePointerCapture(event.pointerId);
            }

            const elapsed = Math.max(1, Date.now() - this.startTime);
            const velocity = this.deltaX / elapsed;
            const threshold = Math.max(
                36,
                this.viewport.clientWidth * 0.12
            );

            const forward = this.deltaX < -threshold || velocity < -0.45;
            const backward = this.deltaX > threshold || velocity > 0.45;

            let moved = false;
            if (forward) moved = this.next();
            else if (backward) moved = this.prev();

            if (!moved) this.updateTransform();
            if (Math.abs(this.deltaX) > 8) {
                this.suppressClickUntil = Date.now() + 350;
            }

            this.deltaX = 0;
            this.pointerId = null;
            this.schedule();
        }

        onPointerCancel() {
            this.pointerDown = false;
            this.ignoreDrag = false;
            this.pointerId = null;

            if (this.dragging) {
                this.dragging = false;
                this.root.classList.remove("is-dragging");
                this.track.style.transition = "";
                this.updateTransform();
            }

            this.deltaX = 0;
            this.schedule();
        }
    }

    const init = () => {
        document.querySelectorAll("[data-carousel]").forEach((root) => {
            if (root.dataset.carouselInitialized === "true") return;
            root.dataset.carouselInitialized = "true";
            new Carousel(root);
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

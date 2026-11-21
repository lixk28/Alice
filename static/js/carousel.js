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
            this.thumbnailStrip = root.querySelector(
                '.carousel-indicator-wrap[data-style="thumbnails"]'
            );
            this.autoplayButton = root.querySelector(".carousel-autoplay");
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
            this.circular =
                this.loop &&
                this.effect === "slide" &&
                this.perView < this.slides.length;
            this.looping = false;
            this.previewIndex = null;

            const start = parseInt(root.dataset.start || "0", 10) || 0;
            this.index = this.circular
                ? ((start % this.slides.length) + this.slides.length) %
                  this.slides.length
                : Math.min(Math.max(start, 0), this.maxIndex());
            if (this.circular && this.index > 0) {
                this.rotateToIndex(this.index);
            }

            this.timer = null;
            this.hovering = false;
            this.focusWithin = false;
            this.ignoreHover = false;
            this.ignoreFocus = false;
            this.visible = !("IntersectionObserver" in window);
            this.dragging = false;
            this.dragRotated = false;
            this.dragBase = 0;
            this.pointerDown = false;
            this.ignoreDrag = false;
            this.pointerId = null;
            this.suppressClickUntil = 0;
            this.wheelDelta = 0;
            this.wheelLockedUntil = 0;
            this.wheelResetTimer = null;
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
            if (this.circular) return Math.max(0, this.slides.length - 1);
            return Math.max(0, this.slides.length - this.perView);
        }

        domItems() {
            return Array.from(this.track.children).filter((element) =>
                element.classList.contains("carousel-item")
            );
        }

        getStep() {
            const items = this.domItems();
            if (items.length < 2) return this.viewport.clientWidth;
            const first = items[0].getBoundingClientRect();
            const second = items[1].getBoundingClientRect();
            const step = second.left - first.left;
            return step > 0 ? step : this.viewport.clientWidth;
        }

        refreshLayout(immediate = false) {
            if (this.looping) return;
            const perView = this.readPerView();
            const changed = perView !== this.perView;
            this.perView = perView;
            this.circular =
                this.loop &&
                this.effect === "slide" &&
                this.perView < this.slides.length;

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
            this.updateCaptionClearance();
            this.updateAutoplayCorner();
            this.revealActiveThumbnail();
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
                "wheel",
                (event) => this.onWheel(event),
                { passive: false }
            );
            this.viewport.addEventListener("dragstart", (event) => {
                if (
                    event.target instanceof Element &&
                    event.target.closest("img, a")
                ) {
                    event.preventDefault();
                }
            });
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
            if (this.looping) return false;

            if (this.circular) {
                const count = this.slides.length;
                const next = ((index % count) + count) % count;
                if (next === this.index) {
                    this.updateTransform();
                    return false;
                }

                const previous = this.index;
                this.rotateToIndex(next);
                this.activate(next);
                this.updateTransform();
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

        rotateToIndex(index) {
            const ordered = this.slides
                .slice(index)
                .concat(this.slides.slice(0, index));
            ordered.forEach((slide) => this.track.appendChild(slide));
            this.index = index;
            this.track.style.transform = "translate3d(0, 0, 0)";
        }

        activate(index) {
            if (this.circular) {
                const items = this.domItems();
                items.forEach((slide, i) => {
                    const active = i < this.perView;
                    slide.classList.toggle("is-active", active);
                    if (active) {
                        slide.removeAttribute("aria-hidden");
                        slide.removeAttribute("inert");
                    } else {
                        slide.setAttribute("aria-hidden", "true");
                        slide.setAttribute("inert", "");
                    }
                });
                return;
            }

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
            if (this.effect !== "slide" || this.looping) return;
            if (immediate) this.track.style.transition = "none";

            this.track.style.transform = this.circular
                ? "translate3d(0, 0, 0)"
                : `translate3d(${-this.index * this.getStep()}px, 0, 0)`;

            if (immediate) {
                void this.track.offsetWidth;
                requestAnimationFrame(() => {
                    this.track.style.transition = "";
                });
            }
        }

        circularGroupHeight(start) {
            const items = this.domItems();
            const count = items.length;
            let height = 0;
            for (let i = 0; i < this.perView; i += 1) {
                const item = items[(start + i) % count];
                if (item) height = Math.max(height, item.offsetHeight);
            }
            return height;
        }

        groupHeight(start) {
            if (this.circular) return this.circularGroupHeight(0);

            const last = Math.min(
                start + this.perView,
                this.slides.length
            );
            let height = 0;
            for (let i = start; i < last; i += 1) {
                height = Math.max(height, this.slides[i].offsetHeight);
            }
            return height;
        }

        updateHeight() {
            const height = this.groupHeight(this.index);
            if (height > 0) {
                const next = `${height}px`;
                if (this.viewport.style.height !== next) {
                    this.viewport.style.height = next;
                }
            }
            this.updateCaptionClearance();
            this.updateAutoplayCorner();
        }

        /* Keep the autoplay control in the first free corner. */
        updateAutoplayCorner() {
            const button = this.root.querySelector(".carousel-autoplay");
            if (!button) return;
            const occupied = new Set();
            this.root
                .querySelectorAll(".carousel-overlay-group")
                .forEach((group) => {
                    if (/^(top|bottom)-(left|right)$/.test(group.dataset.position)) {
                        occupied.add(group.dataset.position);
                    }
                });
            this.root
                .querySelectorAll(
                    ".carousel-item.is-active .carousel-slide-overlay"
                )
                .forEach((caption) => {
                    const position = caption.dataset.captionPosition;
                    if (/^(top|bottom)-(left|right)$/.test(position)) {
                        occupied.add(position);
                    }
                });
            const corners = [
                "top-right",
                "bottom-right",
                "top-left",
                "bottom-left",
            ];
            const corner =
                corners.find((position) => !occupied.has(position)) ||
                "top-right";
            button.dataset.position = corner;
        }

        /* Move a caption inward when an overlay group shares its position. */
        updateCaptionClearance() {
            const groups = this.root.querySelectorAll(
                ".carousel-overlay-group"
            );
            if (!groups.length) return;
            const groupHeights = new Map();
            groups.forEach((group) => {
                const position = group.dataset.position;
                groupHeights.set(
                    position,
                    Math.max(
                        groupHeights.get(position) || 0,
                        group.offsetHeight
                    )
                );
            });
            this.root
                .querySelectorAll(
                    ".carousel-item.is-active .carousel-slide-overlay"
                )
                .forEach((caption) => {
                    const height =
                        groupHeights.get(caption.dataset.captionPosition) ||
                        0;
                    caption.style.setProperty(
                        "--carousel-caption-clearance",
                        height ? `${height + 10}px` : "0px"
                    );
                });
        }

        updateControls() {
            const maxIndex = this.maxIndex();
            const atStart = this.index <= 0;
            const atEnd = this.index >= maxIndex;

            this.previewIndex = null;

            if (this.prevButton) {
                this.prevButton.disabled =
                    maxIndex === 0 || (!this.loop && atStart);
            }
            if (this.nextButton) {
                this.nextButton.disabled =
                    maxIndex === 0 || (!this.loop && atEnd);
            }

            this.updateIndicators(this.index);
        }

        updateIndicators(index) {
            const maxIndex = this.maxIndex();
            this.indicators.forEach((button) => {
                const buttonIndex = parseInt(
                    button.dataset.carouselGoto,
                    10
                );
                const item = button.closest("li");
                if (item) item.hidden = buttonIndex > maxIndex;
                if (buttonIndex === index) {
                    button.setAttribute("aria-current", "true");
                } else {
                    button.removeAttribute("aria-current");
                }
            });

            if (this.counter) {
                if (this.perView > 1) {
                    const last = this.circular
                        ? ((index + this.perView - 1) %
                              this.slides.length) +
                          1
                        : Math.min(
                              index + this.perView,
                              this.slides.length
                          );
                    this.counter.textContent = `${index + 1}\u2013${last}`;
                } else {
                    this.counter.textContent = String(index + 1);
                }
            }

            this.revealActiveThumbnail();
        }

        previewIndicator(index) {
            const target = index === this.index ? null : index;
            if (this.previewIndex === target) return;
            this.previewIndex = target;
            this.updateIndicators(index);
            this.updateStatus(index);
        }

        clearPreview() {
            if (this.previewIndex === null) return;
            this.previewIndex = null;
            this.updateIndicators(this.index);
            this.updateStatus(this.index);
        }

        /* Keep the active preview visible when the thumbnail strip scrolls. */
        revealActiveThumbnail() {
            const strip = this.thumbnailStrip;
            if (!strip || strip.scrollWidth <= strip.clientWidth) return;
            const active = strip.querySelector(
                '.carousel-thumbnail[aria-current="true"]'
            );
            if (!active) return;

            const stripRect = strip.getBoundingClientRect();
            const activeRect = active.getBoundingClientRect();
            const inset = 8;
            if (activeRect.left < stripRect.left + inset) {
                strip.scrollLeft -= stripRect.left + inset - activeRect.left;
            } else if (activeRect.right > stripRect.right - inset) {
                strip.scrollLeft += activeRect.right - stripRect.right + inset;
            }
        }

        updateStatus(index = this.index) {
            if (!this.status) return;
            const first = index + 1;
            const last = this.circular
                ? ((index + this.perView - 1) % this.slides.length) + 1
                : Math.min(index + this.perView, this.slides.length);
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
            this.root.classList.remove("is-autoplay-running");
            /* Force a reflow so restarting the class restarts both animations. */
            void this.root.offsetWidth;
            this.root.classList.add("is-autoplay-running");
        }

        stopAutoplayProgress() {
            this.root.classList.remove("is-autoplay-running");
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
            if (this.looping) return false;
            if (this.circular) return this.advance(1);
            if (!this.loop && this.index >= this.maxIndex()) {
                return false;
            }
            return this.goTo(this.index + 1);
        }

        prev() {
            if (this.looping) return false;
            if (this.circular) return this.advance(-1);
            if (!this.loop && this.index <= 0) return false;
            return this.goTo(this.index - 1);
        }

        /* Circular queue: the current group always sits at the front of the
         * track. Next/Prev animate one step, then rotate the first/last node
         * and snap the physical offset back to zero. */
        advance(direction) {
            if (this.looping) return false;
            const items = this.domItems();
            const count = items.length;
            if (count < 2 || this.perView >= count) return false;

            const previous = this.index;
            const step = this.getStep();
            const currentHeight = this.circularGroupHeight(0);
            const targetStart = direction > 0 ? 1 : count - 1;
            const targetHeight = this.circularGroupHeight(targetStart);
            this.looping = true;

            if (targetHeight > currentHeight) {
                this.viewport.style.height = `${targetHeight}px`;
            }

            if (direction < 0) {
                this.track.style.transition = "none";
                this.track.insertBefore(
                    items[count - 1],
                    this.track.firstElementChild
                );
                this.track.style.transform = `translate3d(${-step}px, 0, 0)`;
                void this.track.offsetWidth;
                this.track.style.transition = "";
                this.track.style.transform = "translate3d(0, 0, 0)";
            } else {
                this.track.style.transition = "";
                void this.track.offsetWidth;
                this.track.style.transform = `translate3d(${-step}px, 0, 0)`;
            }

            let timer = null;
            let previewTimer = null;
            const finish = () => {
                if (!this.looping) return;
                this.looping = false;
                this.track.removeEventListener("transitionend", onEnd);
                window.clearTimeout(timer);
                window.clearTimeout(previewTimer);

                this.track.style.transition = "none";
                if (direction > 0) {
                    this.track.appendChild(this.track.firstElementChild);
                }
                this.index =
                    (this.index + direction + count) % count;
                this.track.style.transform = "translate3d(0, 0, 0)";
                void this.track.offsetWidth;
                requestAnimationFrame(() => {
                    this.track.style.transition = "";
                });

                this.activate(this.index);
                this.updateHeight();
                this.updateControls();
                this.updateStatus();
                this.root.dispatchEvent(
                    new CustomEvent("carousel:change", {
                        bubbles: true,
                        detail: {
                            index: this.index,
                            previous,
                            slide: this.slides[this.index],
                        },
                    })
                );
            };
            const onEnd = (event) => {
                if (
                    event.target === this.track &&
                    event.propertyName === "transform"
                ) {
                    finish();
                }
            };

            this.track.addEventListener("transitionend", onEnd);
            const duration =
                parseFloat(
                    getComputedStyle(this.track).transitionDuration
                ) * 1000 || 0;
            timer = window.setTimeout(finish, duration + 120);
            if (duration > 0) {
                previewTimer = window.setTimeout(() => {
                    if (!this.looping) return;
                    this.previewIndicator(
                        (this.index + direction + count) % count
                    );
                }, duration * 0.5);
            }
            if (this.prefersReducedMotion || !duration) {
                requestAnimationFrame(finish);
            }

            return true;
        }

        onWheel(event) {
            if (event.ctrlKey || this.dragging || this.looping) return;
            if (
                event.target instanceof Element &&
                event.target.closest(
                    ".carousel-controls, .carousel-overlay-group, .carousel-autoplay"
                )
            ) {
                return;
            }

            let dx = event.deltaX;
            if (event.shiftKey && dx === 0) {
                dx = event.deltaY;
            } else if (Math.abs(dx) <= Math.abs(event.deltaY)) {
                return;
            }
            if (!dx) return;

            if (event.cancelable) event.preventDefault();

            let unit = 1;
            if (event.deltaMode === 1) unit = 16;
            else if (event.deltaMode === 2) unit = this.viewport.clientWidth;
            dx *= unit;

            const now = Date.now();
            if (now < this.wheelLockedUntil) return;

            if (this.wheelDelta && Math.sign(dx) !== Math.sign(this.wheelDelta)) {
                this.wheelDelta = 0;
            }
            this.wheelDelta += dx;

            window.clearTimeout(this.wheelResetTimer);
            this.wheelResetTimer = window.setTimeout(() => {
                this.wheelDelta = 0;
            }, 250);

            if (Math.abs(this.wheelDelta) < 40) return;

            const forward = this.wheelDelta > 0;
            this.wheelDelta = 0;
            this.wheelLockedUntil = now + 400;
            this.userNavigate(() => (forward ? this.next() : this.prev()));
        }

        onPointerDown(event) {
            if (event.button !== 0 || this.looping) return;
            if (
                event.target instanceof Element &&
                event.target.closest(
                    ".carousel-controls, .carousel-overlay-group, .carousel-edge, .carousel-autoplay"
                )
            ) {
                return;
            }

            this.pointerDown = true;
            this.pointerId = event.pointerId;
            this.startX = event.clientX;
            this.startY = event.clientY;
            this.deltaX = 0;
            this.dragging = false;
            this.dragRotated = false;
            this.dragBase = 0;
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
                if (this.circular && dx > 0) {
                    this.prepareBackwardDrag();
                }
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

            const base = this.dragRotated
                ? this.dragBase
                : this.circular
                  ? 0
                  : -this.index * step;
            this.track.style.transform = `translate3d(${
                base + offset
            }px, 0, 0)`;

            let destination = this.index;
            if (this.circular) {
                destination =
                    dx < 0
                        ? (this.index + 1) % this.slides.length
                        : (this.index - 1 + this.slides.length) %
                          this.slides.length;
            } else if (dx < 0) {
                destination = Math.min(
                    this.index + 1,
                    this.slides.length - 1
                );
            } else if (dx > 0) {
                destination = Math.max(this.index - 1, 0);
            }

            const progress = step > 0 ? Math.abs(dx) / step : 0;
            this.previewIndicator(
                progress > 0.5 ? destination : this.index
            );
        }

        prepareBackwardDrag() {
            if (this.dragRotated) return;
            const step = this.getStep();
            this.track.style.transition = "none";
            this.track.insertBefore(
                this.track.lastElementChild,
                this.track.firstElementChild
            );
            this.track.style.transform = `translate3d(${-step}px, 0, 0)`;
            this.dragBase = -step;
            this.dragRotated = true;
        }

        /* Animate the current drag position to a target, then run done(). */
        animateDragTo(target, done) {
            this.looping = true;
            this.track.style.transition = "";
            void this.track.offsetWidth;
            this.track.style.transform = `translate3d(${target}px, 0, 0)`;

            let timer = null;
            const finish = () => {
                if (!this.looping) return;
                this.looping = false;
                this.track.removeEventListener("transitionend", onEnd);
                window.clearTimeout(timer);
                done();
            };
            const onEnd = (event) => {
                if (
                    event.target === this.track &&
                    event.propertyName === "transform"
                ) {
                    finish();
                }
            };

            this.track.addEventListener("transitionend", onEnd);
            const duration =
                parseFloat(
                    getComputedStyle(this.track).transitionDuration
                ) * 1000 || 0;
            timer = window.setTimeout(finish, duration + 120);
            if (this.prefersReducedMotion || !duration) {
                requestAnimationFrame(finish);
            }
        }

        finishBackwardDrag(commit) {
            const count = this.slides.length;
            const previous = this.index;
            const targetHeight = commit
                ? this.circularGroupHeight(0)
                : this.circularGroupHeight(1);
            const currentHeight = this.circularGroupHeight(1);
            if (targetHeight > currentHeight) {
                this.viewport.style.height = `${targetHeight}px`;
            }

            const done = () => {
                this.track.style.transition = "none";
                if (commit) {
                    this.index = (this.index - 1 + count) % count;
                } else {
                    this.track.appendChild(this.track.firstElementChild);
                }
                this.track.style.transform = "translate3d(0, 0, 0)";
                void this.track.offsetWidth;
                requestAnimationFrame(() => {
                    this.track.style.transition = "";
                });

                this.dragRotated = false;
                this.dragBase = 0;
                this.activate(this.index);
                this.updateHeight();
                this.updateControls();
                this.updateStatus();

                if (commit) {
                    this.root.dispatchEvent(
                        new CustomEvent("carousel:change", {
                            bubbles: true,
                            detail: {
                                index: this.index,
                                previous,
                                slide: this.slides[this.index],
                            },
                        })
                    );
                }
            };

            this.animateDragTo(commit ? 0 : this.dragBase, done);
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

            const step = this.getStep();
            const halfway = step * 0.5;

            if (this.dragRotated) {
                this.finishBackwardDrag(this.deltaX > halfway);
                if (Math.abs(this.deltaX) > 8) {
                    this.suppressClickUntil = Date.now() + 350;
                }
                this.deltaX = 0;
                this.pointerId = null;
                this.schedule();
                return;
            }

            const forward = this.deltaX < -halfway;
            const backward = this.deltaX > halfway;

            let moved = false;
            if (forward) moved = this.next();
            else if (backward) moved = this.prev();

            if (!moved) {
                this.updateTransform();
                this.clearPreview();
            }
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
                if (this.dragRotated) {
                    this.track.style.transition = "none";
                    this.track.appendChild(this.track.firstElementChild);
                    this.track.style.transform = "translate3d(0, 0, 0)";
                    void this.track.offsetWidth;
                    requestAnimationFrame(() => {
                        this.track.style.transition = "";
                    });
                    this.dragRotated = false;
                    this.dragBase = 0;
                    this.activate(this.index);
                    this.updateHeight();
                } else {
                    this.updateTransform();
                }
                this.clearPreview();
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

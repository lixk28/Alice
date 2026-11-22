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
            this.status = root.querySelector(".carousel-live");

            this.interval = Math.max(
                0,
                parseInt(root.dataset.interval || "0", 10) || 0
            );
            this.loop = toBool(root.dataset.loop, true);
            this.keyboard = toBool(root.dataset.keyboard, true);
            this.pauseOnInteraction = toBool(root.dataset.pause, true);
            this.effect = root.dataset.effect === "fade" ? "fade" : "slide";
            this.scrollHint = root.classList.contains("has-scroll-hint");
            /* A fixed ratio lets CSS own the viewport height. */
            this.fixedFrame = root.classList.contains("has-aspect-ratio");
            this.autoFrame = root.hasAttribute("data-auto-frame");
            this.frameItem = null;
            this.frameImage = null;
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
            /* The frame follows the image shown first, so a carousel that
             * starts on a later slide does not wait for a lazy off-screen one. */
            this.frameItem = this.slides[this.index] || this.slides[0] || null;
            this.frameImage = this.frameItem
                ? this.frameItem.querySelector("img")
                : null;

            this.timer = null;
            this.hovering = false;
            this.focusWithin = false;
            this.ignoreHover = false;
            this.ignoreFocus = false;
            this.visible = !("IntersectionObserver" in window);
            this.dragging = false;
            this.dragStep = 0;
            this.dragRest = 0;
            this.moveHistory = [];
            this.slideShifts = [];
            this.slideOffsets = [];
            this.slideWidths = [];
            this.viewWidth = 0;
            this.step = 0;
            this.contentSize = 0;
            this.scrollPosition = 0;
            this.scrollTarget = 0;
            this.scrollVelocity = 0;
            this.scrollDuration = 25;
            this.scrollFriction = 0.68;
            this.scrollFrame = null;
            this.scrollSettled = null;
            this.scrolling = false;
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
            const step = items[1].offsetLeft - items[0].offsetLeft;
            return step > 0 ? step : this.viewport.clientWidth;
        }

        getGap() {
            const first = this.domItems()[0];
            if (!first) return 0;
            return Math.max(0, this.getStep() - first.offsetWidth);
        }

        scrollHintWidth() {
            const raw = getComputedStyle(this.root)
                .getPropertyValue("--carousel-scroll-hint")
                .trim();
            const value = parseFloat(raw);
            if (!Number.isFinite(value)) return 0;
            if (raw.endsWith("em")) {
                return value * parseFloat(getComputedStyle(this.root).fontSize);
            }
            return value;
        }

        updateLoopMetrics() {
            this.step = this.getStep();
            this.viewWidth = this.viewport.clientWidth;
            const trackLeft = this.track.offsetLeft;
            this.slideOffsets = this.slides.map((slide) =>
                slide.offsetParent === this.track
                    ? slide.offsetLeft
                    : slide.offsetLeft - trackLeft
            );
            this.slideWidths = this.slides.map(
                (slide) => slide.offsetWidth
            );
            this.contentSize = this.circular
                ? this.slides.length * this.step
                : 0;
            if (this.circular) {
                if (this.slideShifts.length !== this.slides.length) {
                    this.slideShifts = new Array(this.slides.length).fill(
                        null
                    );
                } else {
                    this.slideShifts.fill(null);
                }
            } else {
                this.slides.forEach((slide) => {
                    if (slide.style.transform) slide.style.transform = "";
                });
                this.slideShifts = [];
            }
        }

        loopBase() {
            if (!this.scrollHint) return 0;
            return this.scrollHintWidth() + this.getGap();
        }

        /* Keep the scroll coordinate in one content cycle. The per-slide
         * offsets (layoutLoopSlides) make this invisible. */
        normalizeLoop(position) {
            const size = this.contentSize;
            if (!this.circular || !size) return position;
            let value = position % size;
            if (value > 0) value -= size;
            return value;
        }

        nearestLoop(target, from = this.scrollPosition) {
            const size = this.contentSize;
            if (!this.circular || !size) return target;
            let value = target;
            while (value - from > size / 2) value -= size;
            while (from - value > size / 2) value += size;
            return value;
        }

        circularRest(index = this.index) {
            const step = this.step || this.getStep();
            return this.normalizeLoop(this.loopBase() - index * step);
        }

        /* Resting track offset, including the scrollHint window. */
        restTransform() {
            if (this.effect !== "slide") return 0;
            if (this.circular) return this.circularRest(this.index);
            const step = this.getStep();
            if (!this.scrollHint) {
                return -this.index * step;
            }
            const gap = this.getGap();
            const hint = this.scrollHintWidth();
            const groupWidth = this.perView * step - gap;
            if (this.index <= 0) return 0;
            if (this.index >= this.maxIndex()) {
                return (
                    this.viewport.clientWidth -
                    groupWidth -
                    this.index * step
                );
            }
            return hint + gap - this.index * step;
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
            this.applyAutoFrame();
            this.updateLoopMetrics();

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
            this.updateLoopMetrics();
            this.activate(this.index);
            this.updateTransform(true);
            this.updateHeight();
            this.applyAutoFrame();
            this.updateControls();
            this.updateLiveMode();
            this.updateStatus();
            this.root.classList.add("is-ready");
            this.updateCaptionClearance();
            this.updateAutoplayCorner();
            this.revealActiveIndicator();
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
            /* Track the pointer on the window: a fast flick can lift outside
             * the viewport, and the carousel still needs the pointerup. */
            window.addEventListener(
                "pointermove",
                (event) => this.onPointerMove(event),
                { passive: false }
            );
            window.addEventListener("pointerup", (event) =>
                this.onPointerUp(event)
            );
            window.addEventListener("pointercancel", (event) =>
                this.onPointerCancel(event)
            );
            /* Touch gets native touch events (Embla does the same): they are
             * delivered to the start target even when the finger leaves it,
             * and touchmove can prevent the browser pan. */
            this.viewport.addEventListener(
                "touchstart",
                (event) => this.onTouchStart(event),
                { passive: true }
            );
            window.addEventListener(
                "touchmove",
                (event) => this.onTouchMove(event),
                { passive: false }
            );
            window.addEventListener("touchend", (event) =>
                this.onTouchEnd(event)
            );
            window.addEventListener("touchcancel", () =>
                this.onTouchCancel()
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
                            () => {
                                this.updateHeight();
                                this.applyAutoFrame();
                            },
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
                    this.updateTransform(false, options);
                    return false;
                }

                const previous = this.index;
                this.index = next;
                this.activate(next);
                this.updateTransform(options.animate === false, options);
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

            const { animate = true, duration, friction } = options;
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
                    this.updateTransform(false, { duration, friction });
                }
                return false;
            }

            const previous = this.index;
            this.index = next;
            this.activate(next);
            this.updateTransform(!animate, { duration, friction });
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
            if (this.circular) {
                const count = this.slides.length;
                this.slides.forEach((slide, i) => {
                    const active =
                        (i - index + count) % count < this.perView;
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

        applyScrollPosition() {
            if (this.effect !== "slide") return;
            this.track.style.transform = `translate3d(${this.scrollPosition}px, 0, 0)`;
            if (this.circular) this.layoutLoopSlides();
        }

        /* Reposition real slides by ±contentSize when their copy leaves the
         * viewport. This is the SlideLooper equivalent: no DOM cloning. */
        layoutLoopSlides() {
            const size = this.contentSize;
            if (!size) return;
            const viewWidth = this.viewWidth;
            if (!viewWidth) return;
            const center = viewWidth / 2;

            this.slides.forEach((slide, index) => {
                const natural = this.slideOffsets[index] || 0;
                const raw = natural + this.scrollPosition;
                const width = this.slideWidths[index] || slide.offsetWidth;
                const anchor = center - width / 2;
                const startK = Math.round((anchor - raw) / size);
                let bestK = startK;
                let bestOverlap = -Infinity;
                let bestDistance = Infinity;

                for (let k = startK - 2; k <= startK + 2; k += 1) {
                    const start = raw + k * size;
                    const end = start + width;
                    const overlap =
                        Math.min(viewWidth, end) - Math.max(0, start);
                    const distance = Math.abs(
                        start + width / 2 - center
                    );
                    if (
                        overlap > bestOverlap + 0.5 ||
                        (Math.abs(overlap - bestOverlap) <= 0.5 &&
                            distance < bestDistance)
                    ) {
                        bestOverlap = overlap;
                        bestDistance = distance;
                        bestK = k;
                    }
                }

                const shift = bestK * size;
                if (this.slideShifts[index] !== shift) {
                    this.slideShifts[index] = shift;
                    slide.style.transform = shift
                        ? `translate3d(${shift}px, 0, 0)`
                        : "";
                }
            });
        }

        stopScroll() {
            if (this.scrollFrame) {
                cancelAnimationFrame(this.scrollFrame);
                this.scrollFrame = null;
            }
            this.scrollSettled = null;
            this.scrollVelocity = 0;
            this.scrolling = false;
            this.looping = false;
        }

        /* Embla-style scroll body: each frame adds displacement/duration to
         * the velocity, damps it by friction, and moves the track. No CSS
         * transition is involved, so a drag can hand over its exact position. */
        scrollTo(target, options = {}) {
            if (this.effect !== "slide") return;
            const {
                duration = 25,
                friction = 0.68,
                onSettled = null,
            } = options;

            this.scrollTarget = target;
            this.scrollDuration = duration;
            this.scrollFriction = friction;
            this.scrollSettled = onSettled;
            this.scrolling = true;
            this.looping = true;

            if (this.scrollFrame) {
                cancelAnimationFrame(this.scrollFrame);
                this.scrollFrame = null;
            }
            if (this.prefersReducedMotion || !duration) {
                this.scrollPosition = target;
                this.applyScrollPosition();
                this.finishScroll();
                return;
            }
            if (!this.scrollFrame) {
                this.scrollFrame = requestAnimationFrame(() =>
                    this.seekScroll()
                );
            }
        }

        /* While the finger is down the scroll body follows the pointer
         * target with a soft lag instead of pinning the track to it. */
        dragTo(target) {
            if (this.effect !== "slide") return;
            this.scrollTarget = target;
            this.scrollDuration = 0.75;
            this.scrollFriction = 0.3;
            this.scrollSettled = null;
            this.scrolling = true;
            if (!this.scrollFrame) {
                this.scrollFrame = requestAnimationFrame(() =>
                    this.seekScroll()
                );
            }
        }

        seekScroll() {
            this.scrollFrame = null;
            const displacement = this.scrollTarget - this.scrollPosition;
            this.scrollVelocity += displacement / this.scrollDuration;
            this.scrollVelocity *= this.scrollFriction;
            this.scrollPosition += this.scrollVelocity;
            this.applyScrollPosition();

            const remaining = Math.abs(
                this.scrollTarget - this.scrollPosition
            );
            if (remaining < 0.5 && Math.abs(this.scrollVelocity) < 0.05) {
                this.finishScroll();
                return;
            }
            this.scrollFrame = requestAnimationFrame(() =>
                this.seekScroll()
            );
        }

        finishScroll() {
            if (this.circular) {
                this.scrollPosition = this.normalizeLoop(this.scrollTarget);
                this.scrollTarget = this.scrollPosition;
            } else {
                this.scrollPosition = this.scrollTarget;
            }
            this.applyScrollPosition();
            const callback = this.scrollSettled;
            this.scrollSettled = null;
            this.scrollFrame = null;
            this.scrolling = false;
            this.looping = false;
            if (callback) callback();
        }

        updateTransform(immediate = false, options = {}) {
            if (this.effect !== "slide") return;

            if (this.circular) {
                const rest = this.circularRest(this.index);
                if (immediate) {
                    this.stopScroll();
                    this.scrollPosition = rest;
                    this.scrollTarget = rest;
                    this.applyScrollPosition();
                    return;
                }
                if (this.looping) return;
                this.scrollTo(
                    this.nearestLoop(rest, this.scrollPosition),
                    options
                );
                return;
            }

            const target = this.restTransform();
            if (immediate) {
                this.stopScroll();
                this.scrollPosition = target;
                this.scrollTarget = target;
                this.applyScrollPosition();
                return;
            }
            if (this.looping) return;
            this.scrollTo(target, options);
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
            if (this.circular) {
                return this.circularGroupHeight(start);
            }

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

        /* aspectFill/aspectFit need a frame to fill or fit into. Without an
         * explicit aspectRatio, use the image shown first so the frame stays
         * put instead of following the active image. */
        applyAutoFrame() {
            if (!this.autoFrame) return;
            const image = this.frameImage;
            const item = this.frameItem;
            if (!image || !item || !image.naturalWidth || !image.naturalHeight) {
                return;
            }
            const cellWidth = item.getBoundingClientRect().width;
            const viewportWidth = this.viewport.clientWidth;
            if (!cellWidth || !viewportWidth) return;
            const frameHeight =
                cellWidth / (image.naturalWidth / image.naturalHeight);
            if (!(frameHeight > 0)) return;
            this.root.style.setProperty(
                "--carousel-aspect-ratio",
                String(viewportWidth / frameHeight)
            );
            this.root.classList.add("has-aspect-ratio");
            this.fixedFrame = true;
            if (this.viewport.style.height) this.viewport.style.height = "";
            this.updateCaptionClearance();
            this.updateAutoplayCorner();
        }

        updateHeight() {
            if (!this.fixedFrame) {
                const height = this.groupHeight(this.index);
                if (height > 0) {
                    const next = `${height}px`;
                    if (this.viewport.style.height !== next) {
                        this.viewport.style.height = next;
                    }
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

            this.revealActiveIndicator();
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

        /* Keep the active indicator/preview visible in a scrollable strip. */
        revealActiveIndicator() {
            const active = this.root.querySelector(
                '.carousel-indicator[aria-current="true"], ' +
                    '.carousel-segment[aria-current="true"], ' +
                    '.carousel-thumbnail[aria-current="true"]'
            );
            if (!active) return;
            const strip = active.closest(".carousel-indicator-wrap");
            if (!strip) return;

            /* Measure the buttons, not the strip's scroll width: tooltips are
             * absolutely positioned and otherwise count as scroll overflow,
             * which made the strip scroll even when every dot fit. */
            const list = strip.querySelector(
                ".carousel-indicator-list, .carousel-thumbnails"
            );
            const contentWidth = list
                ? list.getBoundingClientRect().width
                : strip.scrollWidth;
            const behavior = this.prefersReducedMotion ? "auto" : "smooth";
            if (contentWidth <= strip.clientWidth + 1) {
                if (strip.scrollLeft !== 0) {
                    strip.scrollTo({ left: 0, behavior });
                }
                return;
            }

            const stripRect = strip.getBoundingClientRect();
            const activeRect = active.getBoundingClientRect();
            /* Thumbnails keep a small breathing room; dots/segments align to
             * the edge so the last one does not shift the whole row. */
            const inset = strip.dataset.style === "thumbnails" ? 8 : 0;
            let next = strip.scrollLeft;
            if (activeRect.left < stripRect.left + inset) {
                next -= stripRect.left + inset - activeRect.left;
            } else if (activeRect.right > stripRect.right - inset) {
                next += activeRect.right - stripRect.right + inset;
            }
            if (Math.abs(next - strip.scrollLeft) > 1) {
                strip.scrollTo({ left: next, behavior });
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

        next(options = {}) {
            if (this.looping) return false;
            if (!this.loop && this.index >= this.maxIndex()) {
                return false;
            }
            return this.goTo(this.index + 1, options);
        }

        prev(options = {}) {
            if (this.looping) return false;
            if (!this.loop && this.index <= 0) return false;
            return this.goTo(this.index - 1, options);
        }

        onWheel(event) {
            if (event.ctrlKey || this.dragging || this.looping) return;
            if (
                event.target instanceof Element &&
                event.target.closest(
                    ".carousel-navigator, .carousel-overlay-group, .carousel-autoplay"
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
            if (now < this.wheelLockedUntil) {
                /* Keep accumulating while the lock runs so a continuous
                 * trackpad gesture chains the next slide. */
                if (this.wheelDelta && Math.sign(dx) !== Math.sign(this.wheelDelta)) {
                    this.wheelDelta = 0;
                }
                this.wheelDelta += dx;
                window.clearTimeout(this.wheelResetTimer);
                this.wheelResetTimer = window.setTimeout(() => {
                    this.wheelDelta = 0;
                }, 250);
                return;
            }

            if (this.wheelDelta && Math.sign(dx) !== Math.sign(this.wheelDelta)) {
                this.wheelDelta = 0;
            }
            this.wheelDelta += dx;

            window.clearTimeout(this.wheelResetTimer);
            this.wheelResetTimer = window.setTimeout(() => {
                this.wheelDelta = 0;
            }, 250);

            if (Math.abs(this.wheelDelta) < 30) return;

            const forward = this.wheelDelta > 0;
            this.wheelDelta = 0;
            this.wheelLockedUntil = now + 320;
            this.userNavigate(() => (forward ? this.next() : this.prev()));
        }

        eventTime(event) {
            return event.timeStamp && event.timeStamp > 0
                ? event.timeStamp
                : Date.now();
        }

        onPointerDown(event, fromTouch = false) {
            if (event.pointerType === "touch" && !fromTouch) return;
            if (event.button !== 0 || this.pointerDown) {
                return;
            }
            if (
                event.target instanceof Element &&
                event.target.closest(
                    ".carousel-navigator, .carousel-overlay-group, .carousel-edge, .carousel-autoplay"
                )
            ) {
                return;
            }

            this.stopScroll();
            this.pointerDown = true;
            this.pointerId = event.pointerId;
            this.startX = event.clientX;
            this.startY = event.clientY;
            this.startTime = this.eventTime(event);
            this.deltaX = 0;
            this.dragging = false;
            this.dragStep = 0;
            this.dragRest = 0;
            this.moveHistory = [{ t: this.startTime, x: 0 }];
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
            const now = this.eventTime(event);

            if (!this.dragging) {
                /* A horizontal intention starts the drag; vertical movement
                 * is left to the browser (touch-action: pan-y). */
                if (Math.abs(dx) < 10) return;
                if (Math.abs(dy) > Math.abs(dx) * 0.6) return;

                this.dragging = true;
                this.dragStep = this.getStep();
                this.dragRest = this.scrollPosition;
                this.root.classList.add("is-dragging");
                if (event.pointerType !== "touch") {
                    try {
                        this.viewport.setPointerCapture?.(event.pointerId);
                    } catch {
                        /* Synthetic pointers have no capture target. */
                    }
                }
            }

            this.moveHistory.push({ t: now, x: dx });
            while (
                this.moveHistory.length > 2 &&
                now - this.moveHistory[0].t > 140
            ) {
                this.moveHistory.shift();
            }

            if (event.cancelable) event.preventDefault();
            this.deltaX = dx;
            this.applyDrag(dx);
        }

        applyDrag(dx) {
            if (this.effect !== "slide") return;

            const atStart = this.index === 0;
            const atEnd = this.index >= this.maxIndex();
            const step = this.dragStep || this.getStep();
            let offset = dx;

            if (!this.loop) {
                if ((atStart && dx > 0) || (atEnd && dx < 0)) {
                    offset = dx * 0.3;
                }
            }

            /* Rubber-band past one slide so the track resists a long drag,
             * except in the looping slide effect where slides wrap. */
            if (
                !this.circular &&
                step > 0 &&
                Math.abs(offset) > step
            ) {
                const over = Math.abs(offset) - step;
                offset = Math.sign(offset) * (step + over * 0.35);
            }

            const base = this.dragging
                ? this.dragRest
                : this.scrollPosition;
            this.dragTo(base + offset);

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

        /* A short, recent velocity window (px/ms) is more reliable than the
         * last pointermove pair, which can be a tiny lift sample. */
        dragSpeed() {
            const history = this.moveHistory;
            if (history.length < 2) return 0;
            const last = history[history.length - 1];
            let first = history[0];
            for (let i = history.length - 2; i >= 0; i -= 1) {
                if (last.t - history[i].t <= 120) first = history[i];
                else break;
            }
            const elapsed = last.t - first.t;
            return elapsed > 0 ? (last.x - first.x) / elapsed : 0;
        }

        onPointerUp(event) {
            if (!this.pointerDown || event.pointerId !== this.pointerId) {
                return;
            }

            this.pointerDown = false;
            const ignoredTarget = this.ignoreDrag;
            this.ignoreDrag = false;

            if (!this.dragging) {
                /* Swiper-style short swipe: a fast flick may never cross the
                 * drag threshold before the finger lifts. */
                const now = this.eventTime(event);
                const dx = Number.isFinite(event.clientX)
                    ? event.clientX - this.startX
                    : 0;
                const dy = Number.isFinite(event.clientY)
                    ? event.clientY - this.startY
                    : 0;
                const elapsed = now - this.startTime;
                const horizontal = Math.abs(dx) > Math.abs(dy);
                if (
                    !ignoredTarget &&
                    horizontal &&
                    Math.abs(dx) >= 10 &&
                    elapsed <= 300
                ) {
                    const settle = {
                        duration: 18,
                        friction: 0.68,
                    };
                    const moved =
                        dx < 0 ? this.next(settle) : this.prev(settle);
                    if (!moved) this.updateTransform(false, settle);
                    this.suppressClickUntil = Date.now() + 350;
                }
                this.pointerId = null;
                this.deltaX = 0;
                this.schedule();
                return;
            }

            this.dragging = false;
            this.root.classList.remove("is-dragging");

            if (
                event.pointerType !== "touch" &&
                this.viewport.hasPointerCapture?.(event.pointerId)
            ) {
                this.viewport.releasePointerCapture(event.pointerId);
            }

            const now = this.eventTime(event);
            const upDx = Number.isFinite(event.clientX)
                ? event.clientX - this.startX
                : this.deltaX;
            if (Math.abs(upDx) > Math.abs(this.deltaX)) {
                this.deltaX = upDx;
            }
            this.moveHistory.push({ t: now, x: this.deltaX });
            while (
                this.moveHistory.length > 2 &&
                now - this.moveHistory[0].t > 140
            ) {
                this.moveHistory.shift();
            }

            const step = this.dragStep || this.getStep();
            const speed = this.dragSpeed();
            const threshold = Math.min(225, Math.max(50, step * 0.2));
            /* Embla's release force: velocity is boosted into a distance,
             * then compared with the next-slide threshold. */
            const boost = event.pointerType === "mouse" ? 300 : 400;
            const projected = this.deltaX + speed * boost;
            const deliberate = Math.abs(this.deltaX) >= 8;

            const forceFactor = Math.min(
                1,
                Math.abs(projected) / Math.max(1, step)
            );
            const settle = {
                duration: 25 - 10 * forceFactor,
                friction: 0.68 + forceFactor / 50,
            };

            const forward = deliberate && projected < -threshold;
            const backward = deliberate && projected > threshold;

            let moved = false;
            if (forward) moved = this.next(settle);
            else if (backward) moved = this.prev(settle);

            if (!moved) {
                this.updateTransform(false, settle);
                this.clearPreview();
            }
            if (Math.abs(this.deltaX) > 8) {
                this.suppressClickUntil = Date.now() + 350;
            }

            this.deltaX = 0;
            this.pointerId = null;
            this.dragStep = 0;
            this.dragRest = 0;
            this.schedule();
        }

        touchEvent(touch, event, type) {
            return {
                pointerId: "touch",
                pointerType: "touch",
                isPrimary: true,
                button: type === "pointerdown" ? 0 : -1,
                buttons: type === "pointerup" ? 0 : 1,
                clientX: touch.clientX,
                clientY: touch.clientY,
                target: event.target,
                timeStamp: event.timeStamp,
                cancelable: event.cancelable,
                preventDefault() {},
            };
        }

        onTouchStart(event) {
            if (this.pointerDown || !event.touches.length) return;
            const touch = event.touches[0];
            this.onPointerDown(
                this.touchEvent(touch, event, "pointerdown"),
                true
            );
        }

        onTouchMove(event) {
            if (!this.pointerDown || this.pointerId !== "touch") return;
            if (event.touches.length > 1) {
                this.onPointerCancel();
                return;
            }
            const touch = event.touches[0];
            if (!touch) return;
            this.onPointerMove(
                this.touchEvent(touch, event, "pointermove")
            );
            const dx = touch.clientX - this.startX;
            const dy = touch.clientY - this.startY;
            if (
                this.dragging ||
                (Math.abs(dx) >= 10 &&
                    Math.abs(dy) <= Math.abs(dx) * 0.6)
            ) {
                if (event.cancelable) event.preventDefault();
            }
        }

        onTouchEnd(event) {
            if (this.pointerId !== "touch" || !event.changedTouches.length) {
                return;
            }
            this.onPointerUp(
                this.touchEvent(
                    event.changedTouches[0],
                    event,
                    "pointerup"
                )
            );
        }

        onTouchCancel() {
            if (this.pointerId === "touch") this.onPointerCancel();
        }

        onPointerCancel(event) {
            if (event && event.pointerType === "touch") {
                this.onTouchCancel();
                return;
            }
            this.pointerDown = false;
            this.ignoreDrag = false;
            this.pointerId = null;

            if (this.dragging) {
                this.dragging = false;
                this.root.classList.remove("is-dragging");
                this.updateTransform(true);
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

/*
 * Slider component — used by the `slider` shortcode.
 *
 * Keeps the tinted minimum track and the value readout in sync with each
 * native range input. The template already writes the initial fill and
 * readout, so the slider is usable before (and without) this file; only
 * live updates depend on it.
 */
(function () {
    "use strict";

    function sync(input) {
        var min = parseFloat(input.min);
        var max = parseFloat(input.max);
        if (!isFinite(min)) min = 0;
        if (!isFinite(max)) max = 100;

        var value = parseFloat(input.value);
        if (!isFinite(value)) value = min;

        var pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
        pct = Math.min(100, Math.max(0, pct));
        input.style.setProperty("--slider-fill", pct + "%");

        var root = input.closest(".slider");
        var readout = root ? root.querySelector(".slider-value") : null;
        if (!readout) return;

        var text = input.value + (input.getAttribute("data-unit") || "");
        readout.textContent = text;
        if (input.hasAttribute("aria-valuetext")) {
            input.setAttribute("aria-valuetext", text);
        }
    }

    function init() {
        var inputs = document.querySelectorAll(".slider-input");
        for (var i = 0; i < inputs.length; i++) {
            (function (input) {
                sync(input);
                input.addEventListener("input", function () {
                    sync(input);
                });
                input.addEventListener("change", function () {
                    sync(input);
                });
            })(inputs[i]);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

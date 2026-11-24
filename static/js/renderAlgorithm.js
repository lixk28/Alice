/*
    Renders every <pre class="algorithm"> through pseudocode.js.

    The options come from params.tex.pseudocode (see tex.html), serialized into
    window.ALICE_PSEUDOCODE_OPTIONS. They mirror the global options documented
    at https://github.com/SaswatPadhi/pseudocode.js#global-options; anything the
    site leaves out falls back to the library default.

    captionCount is a running counter inside the library, so it is only passed
    when the site pins it; passing undefined would be a no-op anyway but the
    omission keeps the default chain intact.
*/
async function renderAlgorithm() {
    var options = window.ALICE_PSEUDOCODE_OPTIONS || {};
    pseudocode.renderClass('algorithm', options);
}

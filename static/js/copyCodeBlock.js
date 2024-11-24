async function copyCodeBlock(copyBtn) {
    try {
        let copyIcon = copyBtn.querySelector('svg.code-block-copy-icon');
        let checkIcon = copyBtn.querySelector('svg.code-block-check-icon');
        // Make copy button unclickable during 2s timeout
        copyBtn.style.pointerEvents = "none";
        copyIcon.style.visibility = "hidden";
        checkIcon.style.visibility = "visible";

        const chroma = copyBtn.parentElement;
        const codeLines = chroma.querySelectorAll("span.cl");
        let code = "";
        for (const line of codeLines) {
            code += line.innerText;
        }
        await navigator.clipboard.writeText(code);

        setTimeout(() => {
            copyBtn.style.pointerEvents = "";
            checkIcon.style.visibility = "hidden";
            copyIcon.style.visibility = "visible";
        }, 2000);
    } catch (error) {
        console.log(error);
        alert("Oops! Failed to copy!");
    }
}

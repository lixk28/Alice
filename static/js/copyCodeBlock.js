async function copyCodeBlock(copyBtn) {
    if (!navigator.clipboard) {
        console.error('AsyncCopy: Browser does not support');
        alert("Seems like you are using a very old browser! Please use a decent one!");
        return;
    }
    if (!navigator.clipboard.writeText) {
        console.error('AsyncCopy: Browser clipboard does not privide the writeText() API!');
        alert("Seems like you are using a very old browser! Please use a decent one!");
        return;
    }

    const hasPermission = await checkClipboardPermission();
    if (!hasPermission) {
        console.error('AsyncCopy: No clipboard permission');
        alert("Don't have clipboard permission! Cannot copy!");
        return;
    }

    var copyIcon = copyBtn.querySelector('svg.code-block-copy-icon');
    var checkIcon = copyBtn.querySelector('svg.code-block-check-icon');
    var closeIcon = copyBtn.querySelector('svg.code-block-close-icon');
    var tooltip = copyBtn.querySelector('span.code-block-copy-tooltip');

    function setCopyState(state) {
        if (state === "default") {
            tooltip.innerText = tooltip.dataset.tipText;
            copyIcon.style.visibility = "visible";
            checkIcon.style.visibility = "hidden";
            closeIcon.style.visibility = "hidden";
            copyBtn.style.pointerEvents = "";
        } else if (state === "success") {
            copyBtn.style.pointerEvents = "none";
            copyIcon.style.visibility = "hidden";
            checkIcon.style.visibility = "visible";
            closeIcon.style.visibility = "hidden";
            tooltip.innerText = tooltip.dataset.successText;
        } else if (state === "failure") {
            copyBtn.style.pointerEvents = "none";
            copyIcon.style.visibility = "hidden";
            checkIcon.style.visibility = "hidden";
            closeIcon.style.visibility = "visible";
            tooltip.innerText = tooltip.dataset.failureText;
        }
    }

    function onTooltipDisappear() {
        setCopyState("default");
        tooltip.removeEventListener("transitionend", onTooltipDisappear, false);
    }

    const timeout = 2000;
    // const duration = parseFloat(getComputedStyle(tooltip).transitionDuration) * 1000;

    const onFail = (error) => {
        console.error('AsyncCopy: Could not copy text: ', error);
        // alert(`Oops! Failed to copy! ${error}`);

        setCopyState("failure");
        tooltip.classList.add("active");

        setTimeout(() => {
            // IMPORTANT: Wait for the hovering transition to finish
            tooltip.addEventListener("transitionend", onTooltipDisappear);
            tooltip.classList.remove("active");
        }, timeout);
    };

    return getCodeChroma(copyBtn).then((code) => {
        return navigator.clipboard.writeText(code).then(() => {
            setCopyState("success");
            tooltip.classList.add("active");

            setTimeout(() => {
                // IMPORTANT: Wait for the hovering transition to finish
                tooltip.addEventListener("transitionend", onTooltipDisappear);
                tooltip.classList.remove("active");
            }, timeout);
        }, onFail);
    }, onFail);
}

async function checkClipboardPermission() {
    const read = await navigator.permissions.query({ name: 'clipboard-read' });
    const write = await navigator.permissions.query({ name: 'clipboard-write' });
    return write.state === 'granted' && read.state !== 'denied';
}

async function getCodeChroma(copyBtn) {
    return new Promise((resolve, reject) => {
        try {
            // throw new Error("DEBUG");
            const chroma = copyBtn.parentElement;
            const codeLines = chroma.querySelectorAll("span.cl");
            var code = "";
            codeLines.forEach(function (line) {
                code += line.innerText;
            });
            resolve(code);
        } catch(error) {
            reject(error);
        }
    });
}

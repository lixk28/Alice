/* Taken from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API */
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

function getStorage(storageType) {
    if (storageType === "localStorage")
        return window.localStorage;
    else if (storageType === "sessionStorage")
        return window.sessionStorage;
    else
        return undefined;
}

function persistTabChoices(tabGroup, tabIndex, storageType) {
    if (!storageAvailable(storageType))
        return;

    const storage = getStorage(storageType);
    const key = window.location.origin + window.location.pathname + 'tab-choices';
    const val = storage.getItem(key) ?? "{}";

    const tabChoices = JSON.parse(val);
    tabChoices[tabGroup] = tabIndex;
    // console.log(key, tabChoices);

    storage.setItem(key, JSON.stringify(tabChoices));
}

function resumeTabChoices(storageType) {
    if (!storageAvailable(storageType))
        return;

    const storage = getStorage(storageType);
    const key = window.location.origin + window.location.pathname + 'tab-choices';
    const val = storage.getItem(key) ?? "{}";

    const tabChoices = JSON.parse(val);
    // console.log(key, tabChoices);

    for (const tabGroup in tabChoices) {
        const tabIndex = tabChoices[tabGroup];
        switchTab(tabGroup, tabIndex);
    }
}

/* Switch to tab at `tabIndex` among tab panels in the same `tabGroup` */
function switchTab(tabGroup, tabIndex) {
    const panels = Array.from(document.querySelectorAll(`div.tab-panel[data-tab-group="${tabGroup}"]`));

    panels.forEach((panel) => {
        const tabTitleRadios = panel.querySelectorAll(`input.tab-title-radio[data-tab-group="${tabGroup}"`);
        const tabContentRadios = panel.querySelectorAll(`input.tab-content-radio[data-tab-group="${tabGroup}"]`);

        tabTitleRadios.forEach((radio) => {
            if (radio.getAttribute("data-tab-index") === tabIndex)
                radio.checked = true;
        });

        tabContentRadios.forEach((radio) => {
            if (radio.getAttribute("data-tab-index") === tabIndex)
                radio.checked = true;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    resumeTabChoices("{{ site.Params.storage.type | default `sessionStorage` }}");
});

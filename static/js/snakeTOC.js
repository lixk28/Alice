// Taken from https://gist.github.com/lydell/47a3dd8caf394f4873abfe2139460599
function drawRect(rect) {
	const div = document.createElement("div");
	// Might be needed on crazy pages, but makes the console output for the div crazy large.
	// div.style.all = "unset";
	div.style.position = "absolute";
	div.style.zIndex = "2147483647";
	// At least _try_ to scroll along. Won’t work for inner scroll.
	div.style.left = `${window.scrollX + rect.left}px`;
	div.style.top = `${window.scrollY + rect.top}px`;
	div.style.width = `${rect.width}px`;
	div.style.height = `${rect.height}px`;
	div.style.boxSizing = "border-box";
	div.style.border = "1px solid green";
	div.style.pointerEvents = "none";
	document.documentElement.append(div);
	return div;
}

/* Some code of snakeTOC are adopted and modified from https://lab.hakim.se/progress-nav */
function drawSnake() {
    // TODO: It's stupid to perform queries every time drawSnake() is getting called,
    //       we can store these elements on DOMContentLoaded and use them in drawSnake()
    const droptoc = document.querySelector("aside#droptoc");
    const sidetoc = document.querySelector("aside#sidetoc");

    if (!droptoc || !sidetoc)
        return;

    const droptocStyle = window.getComputedStyle(droptoc);
    const sidetocStyle = window.getComputedStyle(sidetoc);

    if (droptocStyle.display == 'none' && sidetocStyle.display == 'none')
        return;

    var toc = droptocStyle.display == 'none' ? sidetoc : droptoc;

    const huntland = toc.querySelector("div#toc-hunting-land");
    const polyline = huntland.querySelector("svg#toc-snake > polyline");

    const items = huntland.querySelectorAll("li");

    const TOP_MARGIN = 0.1;
    const BOTTOM_MARGIN = 0.1;
    const windowHeight = window.innerHeight;

    const article = document.querySelector("article");
    const articleBottom = article.getBoundingClientRect().bottom;

    var polylinePoints = [];

    for (let i = 0; i < items.length; i++) {
        const item1 = items[i];
        const anchor1 = item1.querySelector("a");
        const href1 = anchor1.getAttribute("href");
        const headingId1 = href1.slice(1);
        // FIXME: Configurable heading levels
        const heading1 = article.querySelector(`h2#${headingId1}, h3#${headingId1}, h4#${headingId1}`);
        const sectionTop = heading1.getBoundingClientRect().top;

        var sectionBottom;
        if (i + 1 < items.length) {
            const item2 = items[i + 1];
            const anchor2 = item2.querySelector("a");
            const href2 = anchor2.getAttribute("href");
            const headingId2 = href2.slice(1);
            const heading2 = article.querySelector(`h2#${headingId2}, h3#${headingId2}, h4#${headingId2}`);
            sectionBottom = heading2.getBoundingClientRect().bottom;
        } else {
            sectionBottom = articleBottom;
        }

        if (sectionBottom >= windowHeight * TOP_MARGIN &&
            sectionTop <= windowHeight * (1 - BOTTOM_MARGIN)) {
            // heading visible in window
            item1.classList.add("visible");

            var x = anchor1.offsetLeft - 6,
                y = anchor1.offsetTop,
                h = anchor1.offsetHeight;

            // two left rect points
            polylinePoints.push({ 'x' : x, 'y' : y });
            polylinePoints.push({ 'x' : x, 'y' : y + h });
        } else {
            item1.classList.remove("visible");
        }
    }

    var pointsStr = "";
    for (const point of polylinePoints) {
        pointsStr += point['x'] + ',' + point['y'] + ' ';
    }
    polyline.setAttribute('points', pointsStr);
}

window.addEventListener('DOMContentLoaded', drawSnake);
window.addEventListener('resize', drawSnake);
window.addEventListener('scroll', drawSnake);

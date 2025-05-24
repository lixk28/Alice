/* Adopted and modified from https://lab.hakim.se/progress-nav */
window.addEventListener('DOMContentLoaded', function() {
    const TOP_MARGIN = 0.1;
    const BOTTOM_MARGIN = 0.1;
    const windowHeight = window.innerHeight;
    const article = document.querySelector("article");
    const articleBottom = article.getBoundingClientRect().bottom;

    var toc, huntland, snakePath;
    var tocItems = [];
    var tocItemDataArr = [];
    var pathLength, lastPathStart, lastPathEnd;

    window.addEventListener('resize', function () {
        // console.log('resize');
        updateTOC();
        drawPath();
    });
    window.addEventListener('scroll', syncState);

    updateTOC();
    drawPath();

    function updateTOC() {
        const droptoc = document.querySelector("aside#droptoc");
        const sidetoc = document.querySelector("aside#sidetoc");
        if (!droptoc || !sidetoc)
            return;

        const droptocStyle = window.getComputedStyle(droptoc);
        const sidetocStyle = window.getComputedStyle(sidetoc);
        if (droptocStyle.display == 'none' && sidetocStyle.display == 'none')
            return;

        toc = droptocStyle.display == 'none' ? sidetoc : droptoc;

        huntland = toc.querySelector("div#toc-hunting-land");
        snakePath = huntland.querySelector("svg#toc-snake > path");
        tocItems = Array.from(huntland.querySelectorAll("li"));

        // Cache toc item data
        tocItemDataArr = tocItems.map(function (item) {
            const anchor = item.querySelector('a');
            // .slice(1) to Remove the leading '#'
            const target = anchor.getAttribute("href").slice(1);
            // FIXME: Configurable heading levels
            const heading = article.querySelector(`h2#${target}, h3#${target}, h4#${target}`);

            return {
                listItem: item,
                anchor: anchor,
                heading: heading
            };
        });
    }

    function drawPath() {
        var path = [];
		// var pathIndent;

        tocItemDataArr.forEach((item, i) => {
            var x = item.anchor.offsetLeft - 6,
                y = item.anchor.offsetTop,
                h = item.anchor.offsetHeight;

            if (i === 0) {
                path.push('M', x, y, 'L', x, y + h);
                item.pathStart = 0;
            } else {
                // if (pathIndent !== x)
                //     path.push('L', pathIndent, y);

                path.push('L', x, y);

				snakePath.setAttribute('d', path.join(' '));
				item.pathStart = snakePath.getTotalLength() || 0;

				path.push('L', x, y + h);
            }

            // pathIndent = x;
            snakePath.setAttribute('d', path.join(' '));
            item.pathEnd = snakePath.getTotalLength();
        });

        pathLength = snakePath.getTotalLength();
        syncState();
    }

    function syncState() {
        var pathStart = pathLength,
            pathEnd = 0;
        var nVisibleItems = 0;

        tocItemDataArr.forEach((item, i) => {
            var headingBounds = item.heading.getBoundingClientRect();
            var sectionTop = headingBounds.top,
                sectionBot = i + 1 < tocItemDataArr.length
                           ? tocItemDataArr[i + 1].heading.getBoundingClientRect().bottom
                           : articleBottom;

            if (sectionBot >= windowHeight * TOP_MARGIN &&
                sectionTop <= windowHeight * (1 - BOTTOM_MARGIN)) {
                pathStart = Math.min(item.pathStart, pathStart);
                pathEnd = Math.max(item.pathEnd, pathEnd);
                nVisibleItems += 1;
                item.listItem.classList.add('visible');
            } else {
                item.listItem.classList.remove('visible');
            }
        });

        if (nVisibleItems > 0 && pathStart < pathEnd) {
			if (pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
				snakePath.setAttribute('stroke-dashoffset', '1');
				snakePath.setAttribute('stroke-dasharray', '1, ' + pathStart + ', ' + (pathEnd - pathStart) + ', ' + pathLength);
				snakePath.setAttribute('opacity', 1);
			}
		} else {
			snakePath.setAttribute('opacity', 0);
		}

        lastPathStart = pathStart;
		lastPathEnd = pathEnd;
    }
});

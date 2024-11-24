document.addEventListener('DOMContentLoaded', function () {
    const figures = document.querySelectorAll('figure');

    figures.forEach(function (figure) {
        const figureLink = figure.querySelector('a');
        const figureImage = figureLink.querySelector('img');
        const figureCaption = figure.querySelector('figcaption');

        figureLink.addEventListener('click', function (event) {
            event.preventDefault();

            const lightbox = document.createElement('span');
            lightbox.className = 'lightbox';

            const image = document.createElement('img');
            image.src = figureImage.getAttribute('src');
            image.alt = figureImage.getAttribute?.('alt');
            image.title = figureCaption?.textContent;

            lightbox.appendChild(image);

            // Current scroll position
            let scrollX = window.scrollX;
            let scrollY = window.scrollY;

            // Disable scrolling after opening the lightbox
            document.body.style.position = 'fixed';
            // The page goes to top after setting position: fixed... So we have to do the resett
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = `-${scrollX}px`;
            document.body.style.overflow = 'hidden';

            // Remove lightbox when pressing Escape
            const onKeyDown = function (event) {
                var isEscape = false;
                if ("key" in event)
                    isEscape = (event.key === "Escape" || event.key === "Esc");
                else
                    isEscape = (event.keyCode === 27);
                if (isEscape)
                    goBack();
            }

            const goBack = function () {
                document.body.removeChild(lightbox);
                // Also remove event listeners
                document.removeEventListener('keydown', onKeyDown);

                // Enable scrolling after closing the lightbox
                document.body.style.position = 'static';
                document.body.style.overflow = 'auto';
                // Scroll to previous position instantly
                window.scrollTo({ top: scrollY, left: scrollX, behavior: "instant" });
            }

            document.addEventListener('keydown', onKeyDown);

            // Remove lightbox when clicking outside of image
            lightbox.addEventListener('click', function (event) {
                if (!image.contains(event.target))
                    goBack();
            });

            document.body.appendChild(lightbox);
        });
    });
});

// Jump to top/bottom functionality
document.addEventListener('DOMContentLoaded', function() {
    const jumpTopBtn = document.getElementById('jump-top');
    const jumpBottomBtn = document.getElementById('jump-bottom');
    
    if (!jumpTopBtn || !jumpBottomBtn) return;
    
    // Throttle function to limit scroll event frequency
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Show/hide buttons based on scroll position
    function updateButtonVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
        
        // Show buttons when user has scrolled down more than 200px
        if (scrollTop > 200) {
            jumpTopBtn.classList.add('visible');
            jumpBottomBtn.classList.add('visible');
        } else {
            jumpTopBtn.classList.remove('visible');
            jumpBottomBtn.classList.remove('visible');
        }
        
        // Hide bottom button when near the bottom
        if (scrollPercentage > 0.95) {
            jumpBottomBtn.classList.remove('visible');
        }
        
        // Hide top button when at the top
        if (scrollTop < 100) {
            jumpTopBtn.classList.remove('visible');
        }
    }
    
    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Smooth scroll to bottom
    function scrollToBottom() {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    // Event listeners
    jumpTopBtn.addEventListener('click', scrollToTop);
    jumpBottomBtn.addEventListener('click', scrollToBottom);
    
    // Throttled scroll event listener
    window.addEventListener('scroll', throttle(updateButtonVisibility, 100));
    
    // Initial check
    updateButtonVisibility();
});

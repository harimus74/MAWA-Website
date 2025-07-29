/**
 * MAWA Prime Digital - Smooth Scroll JavaScript
 * Enhanced smooth scrolling functionality
 */

(function() {
    'use strict';
    
    // Configuration
    const config = {
        duration: 1000,
        easing: 'easeInOutCubic',
        offset: 80, // Header height
        updateURL: true,
        popstate: true,
        scrollOnLoad: true
    };
    
    // Easing functions
    const easings = {
        linear: (t) => t,
        easeInQuad: (t) => t * t,
        easeOutQuad: (t) => t * (2 - t),
        easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: (t) => t * t * t,
        easeOutCubic: (t) => (--t) * t * t + 1,
        easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: (t) => t * t * t * t,
        easeOutQuart: (t) => 1 - (--t) * t * t * t,
        easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInQuint: (t) => t * t * t * t * t,
        easeOutQuint: (t) => 1 + (--t) * t * t * t * t,
        easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    };
    
    /**
     * Calculate the document height
     */
    function getDocumentHeight() {
        return Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
    }
    
    /**
     * Get the top position of an element
     */
    function getElementY(element) {
        let y = element.offsetTop;
        let node = element;
        
        while (node.offsetParent && node.offsetParent !== document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
        }
        
        return y;
    }
    
    /**
     * Get current scroll position
     */
    function getCurrentY() {
        return window.pageYOffset !== undefined 
            ? window.pageYOffset 
            : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }
    
    /**
     * Smooth scroll to position
     */
    function smoothScrollTo(targetY, duration, easingFunction, callback) {
        const startY = getCurrentY();
        const distance = targetY - startY;
        const startTime = performance.now();
        
        function scroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easingFunction(progress);
            
            window.scrollTo(0, startY + distance * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(scroll);
            } else if (callback) {
                callback();
            }
        }
        
        requestAnimationFrame(scroll);
    }
    
    /**
     * Smooth scroll to element
     */
    function scrollToElement(element, options = {}) {
        const opts = Object.assign({}, config, options);
        const targetY = getElementY(element) - opts.offset;
        const maxY = getDocumentHeight() - window.innerHeight;
        const finalY = Math.min(targetY, maxY);
        
        smoothScrollTo(
            finalY,
            opts.duration,
            easings[opts.easing],
            opts.callback
        );
    }
    
    /**
     * Handle smooth scroll link clicks
     */
    function handleLinkClick(e) {
        // Check if it's an internal link
        const link = e.target.closest('a[href*="#"]');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Skip if it's just a hash
        if (href === '#') {
            e.preventDefault();
            smoothScrollTo(0, config.duration, easings[config.easing]);
            return;
        }
        
        // Check if it's an internal anchor link
        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) return;
        
        const hash = href.substring(hashIndex);
        const target = document.querySelector(hash);
        
        if (!target) return;
        
        e.preventDefault();
        
        // Update URL if enabled
        if (config.updateURL && history.pushState) {
            history.pushState(null, null, hash);
        }
        
        // Scroll to target
        scrollToElement(target, {
            callback: () => {
                // Set focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }
    
    /**
     * Handle back/forward button navigation
     */
    function handlePopstate(e) {
        if (!config.popstate) return;
        
        const hash = window.location.hash;
        if (!hash) {
            smoothScrollTo(0, config.duration, easings[config.easing]);
            return;
        }
        
        const target = document.querySelector(hash);
        if (target) {
            scrollToElement(target);
        }
    }
    
    /**
     * Scroll to hash on page load
     */
    function scrollToHashOnLoad() {
        if (!config.scrollOnLoad) return;
        
        const hash = window.location.hash;
        if (!hash || hash === '#') return;
        
        const target = document.querySelector(hash);
        if (!target) return;
        
        // Wait for page to load
        setTimeout(() => {
            window.scrollTo(0, 0);
            scrollToElement(target);
        }, 100);
    }
    
    /**
     * Initialize smooth scroll
     */
    function init() {
        // Add event listeners
        document.addEventListener('click', handleLinkClick);
        window.addEventListener('popstate', handlePopstate);
        
        // Handle initial hash
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', scrollToHashOnLoad);
        } else {
            scrollToHashOnLoad();
        }
        
        // Add smooth scroll to all internal links
        const links = document.querySelectorAll('a[href*="#"]:not([href="#"])');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Check if it's a same-page link
                if (href.startsWith('#') || 
                    (href.includes(window.location.pathname) && href.includes('#'))) {
                    handleLinkClick(e);
                }
            });
        });
        
        // Handle scroll-to-top button
        const scrollTopBtn = document.querySelector('.scroll-to-top');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                smoothScrollTo(0, config.duration, easings[config.easing]);
            });
            
            // Show/hide scroll-to-top button
            window.addEventListener('scroll', () => {
                if (getCurrentY() > 500) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            });
        }
    }
    
    // Public API
    window.SmoothScroll = {
        init,
        scrollTo: smoothScrollTo,
        scrollToElement,
        config
    };
    
    // Auto-initialize
    init();
    
    /**
     * Parallax scrolling effects
     */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
        
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrollY = getCurrentY();
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
                const offset = element.dataset.parallaxOffset || 0;
                const yPos = -(scrollY * speed) + parseInt(offset);
                
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    initParallax();
    
    /**
     * Reveal on scroll
     */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        
        if (revealElements.length === 0) return;
        
        const revealOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger counter animations if present
                    const counters = entry.target.querySelectorAll('[data-counter]');
                    counters.forEach(counter => {
                        animateCounter(counter);
                    });
                    
                    // Unobserve after revealing
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }
    
    initScrollReveal();
    
    /**
     * Animate counter
     */
    function animateCounter(counter) {
        const target = parseInt(counter.dataset.counter);
        const duration = parseInt(counter.dataset.duration) || 2000;
        const start = parseInt(counter.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            
            if ((increment > 0 && current < target) || (increment < 0 && current > target)) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                
                // Add suffix if present
                const suffix = counter.dataset.suffix;
                if (suffix) {
                    counter.textContent += suffix;
                }
            }
        };
        
        updateCounter();
    }
    
    /**
     * Progress indicator
     */
    function initProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 3px;
            background: var(--primary-gradient);
            z-index: 9999;
            transition: width 0.2s ease;
        `;
        document.body.appendChild(progressBar);
        
        function updateProgress() {
            const scrollY = getCurrentY();
            const docHeight = getDocumentHeight();
            const winHeight = window.innerHeight;
            const scrollPercent = scrollY / (docHeight - winHeight);
            const scrollPercentRounded = Math.round(scrollPercent * 100);
            
            progressBar.style.width = `${scrollPercentRounded}%`;
        }
        
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
        
        updateProgress();
    }
    
    initProgressIndicator();
    
})();
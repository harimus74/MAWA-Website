/**
 * MAWA Prime Digital - Animations JavaScript
 * Advanced animations and visual effects
 */

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initParticles();
    initCTAParticles(); // Neue Funktion für CTA-Section
    initGlitchEffects();
    initMorphingShapes();
    initMagicButtons();
    initScrollAnimations();
    initTextAnimations();
    initHoverEffects();
    initPageTransitions();
    initMagicalText();
});

/**
 * Particle system for hero background
 */
function initParticles() {
    const particleContainer = document.querySelector('#particles');
    if (!particleContainer) return;
    
    // Create stars background
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-background';
    particleContainer.appendChild(starsContainer);
    
    // Generate stars
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        const size = Math.random() < 0.5 ? 'small' : Math.random() < 0.8 ? 'medium' : 'large';
        star.className = `star ${size}`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
    }
    
    // Create shooting stars
    function createShootingStar() {
        const shootingStar = document.createElement('div');
        const isLarge = Math.random() > 0.7;
        const direction = Math.random();
        
        // Verschiedene Flugrichtungen
        let className = 'shooting-star';
        if (isLarge) className += ' large';
        
        if (direction < 0.33) {
            className += ' diagonal-right';
            // Start von links oben
            shootingStar.style.left = `${-50 + Math.random() * 200}px`;
            shootingStar.style.top = `${-50 + Math.random() * 100}px`;
        } else if (direction < 0.66) {
            className += ' diagonal-left';
            // Start von rechts oben
            shootingStar.style.right = `${-50 + Math.random() * 200}px`;
            shootingStar.style.left = 'auto';
            shootingStar.style.top = `${-50 + Math.random() * 100}px`;
        } else {
            className += ' vertical';
            // Start von oben
            shootingStar.style.left = `${Math.random() * 100}%`;
            shootingStar.style.top = '-50px';
        }
        
        shootingStar.className = className;
        
        // Random animation duration
        const duration = 2.5 + Math.random() * 1.5; // 2.5-4 seconds
        shootingStar.style.animationDuration = `${duration}s`;
        
        starsContainer.appendChild(shootingStar);
        
        // Remove after animation
        setTimeout(() => {
            shootingStar.remove();
        }, duration * 1000);
    }
    
    // Create shooting stars periodically
    setInterval(() => {
        if (Math.random() > 0.5) { // 50% chance every interval
            createShootingStar();
        }
    }, 2000); // Every 2 seconds
    
    // Create initial shooting stars
    setTimeout(() => createShootingStar(), 500);
    setTimeout(() => createShootingStar(), 1500);
    setTimeout(() => createShootingStar(), 3000);
    
    const particles = [];
    const particleCount = 30;
    
    // Create floating particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        
        particleContainer.appendChild(particle);
    }
}

/**
 * Glitch effects for text
 */
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(element => {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        
        // Random glitch trigger
        setInterval(() => {
            if (Math.random() < 0.1) {
                element.style.animation = 'glitch-skew 0.3s ease-in-out';
                setTimeout(() => {
                    element.style.animation = '';
                }, 300);
            }
        }, 3000);
    });
}

/**
 * Morphing background shapes
 */
function initMorphingShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        // Add mouse parallax effect
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 50;
            const y = (e.clientY / window.innerHeight - 0.5) * 50;
            
            shape.style.transform = `translate(${x * (index + 1) * 0.5}px, ${y * (index + 1) * 0.5}px)`;
        });
    });
}

/**
 * Magic button effects
 */
function initMagicButtons() {
    const magicButtons = document.querySelectorAll('.magic-button');
    
    magicButtons.forEach(button => {
        const particlesContainer = button.querySelector('.button-particles');
        if (!particlesContainer) return;
        
        button.addEventListener('mouseenter', function(e) {
            createButtonParticles(particlesContainer, e);
        });
        
        button.addEventListener('mousemove', function(e) {
            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            button.style.setProperty('--mouse-x', `${x}%`);
            button.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

/**
 * Create particles for button hover effect
 */
function createButtonParticles(container, event) {
    const colors = ['#6B46C1', '#00D9FF', '#FFD700'];
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('span');
        particle.className = 'button-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            animation: particle-burst 1s ease-out forwards;
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => particle.remove(), 1000);
    }
}

/**
 * Advanced scroll animations
 */
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Parallax scrolling for specific elements
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * Text animation effects
 */
function initTextAnimations() {
    // Typewriter effect
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let index = 0;
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }
        
        // Start typing when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
    
    // Split text animation
    const splitTextElements = document.querySelectorAll('.split-text');
    
    splitTextElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${index * 0.05}s`;
            span.className = 'split-char';
            element.appendChild(span);
        });
    });
}

/**
 * Advanced hover effects
 */
function initHoverEffects() {
    // 3D card tilt effect
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
    
    // Magnetic buttons
    const magneticButtons = document.querySelectorAll('.magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Page transition effects
 */
function initPageTransitions() {
    // Add transition overlay
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    transitionOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-gradient);
        transform: translateY(-100%);
        transition: transform 0.6s cubic-bezier(0.83, 0, 0.17, 1);
        z-index: 9999;
        pointer-events: none;
    `;
    document.body.appendChild(transitionOverlay);
    
    // Handle link clicks
    const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.target === '_blank' || e.ctrlKey || e.metaKey) return;
            
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Trigger transition
            transitionOverlay.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        });
    });
    
    // Handle browser back button
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            transitionOverlay.style.transform = 'translateY(-100%)';
        }
    });
}

/**
 * Custom cursor effect
 */
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        transition: transform 0.2s ease;
        z-index: 9999;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
    `;
    document.body.appendChild(cursorDot);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        cursorDot.style.left = mouseX - 2 + 'px';
        cursorDot.style.top = mouseY - 2 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.borderColor = 'var(--secondary-color)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'var(--primary-color)';
        });
    });
}

// Initialize custom cursor only on desktop
if (window.matchMedia('(min-width: 768px)').matches && window.matchMedia('(hover: hover)').matches) {
    initCustomCursor();
}

/**
 * CSS animation utility
 */
const animationEndEvents = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'OAnimation': 'oAnimationEnd',
    'msAnimation': 'MSAnimationEnd',
    'animation': 'animationend'
};

function whichAnimationEvent() {
    const el = document.createElement('fakeelement');
    for (let t in animationEndEvents) {
        if (el.style[t] !== undefined) {
            return animationEndEvents[t];
        }
    }
}

const animationEnd = whichAnimationEvent();

// Add animation end listener utility
Element.prototype.onAnimationEnd = function(callback) {
    this.addEventListener(animationEnd, callback);
};

// Export for use in other modules
window.AnimationUtils = {
    animationEnd,
    createParticles: createButtonParticles
};
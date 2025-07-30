/**
 * MAWA Prime Digital - Portfolio Page JavaScript
 * Enhanced portfolio functionality with Services-style animations
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize all portfolio features
    initPortfolioParticles();
    initPortfolioFilter();
    initProjectModals();
    initTestimonialSlider();
    initCounterAnimations();
    initScrollAnimations();
});

/**
 * Initialize particles for portfolio hero
 */
function initPortfolioParticles() {
    const particleContainer = document.querySelector('#particles');
    if (!particleContainer) return;
    
    // Create stars background
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-background';
    particleContainer.appendChild(starsContainer);
    
    // Generate stars
    const starCount = 150;
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
        
        let className = 'shooting-star';
        if (isLarge) className += ' large';
        
        if (direction < 0.33) {
            className += ' diagonal-right';
            shootingStar.style.left = `${-50 + Math.random() * 200}px`;
            shootingStar.style.top = `${-50 + Math.random() * 100}px`;
        } else if (direction < 0.66) {
            className += ' diagonal-left';
            shootingStar.style.right = `${-50 + Math.random() * 200}px`;
            shootingStar.style.left = 'auto';
            shootingStar.style.top = `${-50 + Math.random() * 100}px`;
        } else {
            className += ' vertical';
            shootingStar.style.left = `${Math.random() * 100}%`;
            shootingStar.style.top = '-50px';
        }
        
        shootingStar.className = className;
        
        const duration = 2.5 + Math.random() * 1.5;
        shootingStar.style.animationDuration = `${duration}s`;
        
        starsContainer.appendChild(shootingStar);
        
        setTimeout(() => {
            shootingStar.remove();
        }, duration * 1000);
    }
    
    // Create shooting stars periodically
    setInterval(() => {
        if (Math.random() > 0.5) {
            createShootingStar();
        }
    }, 2000);
    
    // Create initial shooting stars
    setTimeout(() => createShootingStar(), 500);
    setTimeout(() => createShootingStar(), 1500);
    setTimeout(() => createShootingStar(), 3000);
}

/**
 * Initialize CTA particles
 */
function initCTAParticles() {
    const ctaParticles = document.getElementById('cta-particles');
    if (!ctaParticles) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'cta-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${Math.random() > 0.5 ? '#FFD700' : '#00D9FF'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: float-cta ${Math.random() * 10 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            filter: blur(1px);
        `;
        ctaParticles.appendChild(particle);
    }
}

/**
 * Portfolio Filter Functionality
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-item');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (!filterButtons.length || !portfolioCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    // Re-trigger animation
                    card.style.animation = 'none';
                    void card.offsetHeight; // Trigger reflow
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.animation = 'fadeOutDown 0.3s ease forwards';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Project Modal Functionality
 */
function initProjectModals() {
    const viewProjectButtons = document.querySelectorAll('.view-project');
    
    viewProjectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href');
            const modal = document.querySelector(modalId);
            
            if (modal) {
                openModal(modal);
            }
        });
    });
    
    // Close modal functionality
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.project-modal');
            closeModal(modal);
        });
    });
    
    // Close on outside click
    document.querySelectorAll('.project-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.project-modal[style*="flex"]');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Animate modal content
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'modalSlideIn 0.5s ease forwards';
}

function closeModal(modal) {
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'modalSlideOut 0.3s ease forwards';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-nav .prev');
    const nextBtn = document.querySelector('.testimonial-nav .next');
    
    if (testimonials.length === 0) return;
    
    let currentIndex = 0;
    
    // Show only first 3 testimonials on desktop, 1 on mobile
    function updateTestimonialVisibility() {
        const isMobile = window.innerWidth <= 768;
        const visibleCount = isMobile ? 1 : 3;
        
        testimonials.forEach((testimonial, index) => {
            if (index >= currentIndex && index < currentIndex + visibleCount) {
                testimonial.style.display = 'block';
                testimonial.classList.add('active');
            } else {
                testimonial.style.display = 'none';
                testimonial.classList.remove('active');
            }
        });
        
        // Update navigation buttons
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= testimonials.length - visibleCount;
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateTestimonialVisibility();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            const visibleCount = isMobile ? 1 : 3;
            
            if (currentIndex < testimonials.length - visibleCount) {
                currentIndex++;
                updateTestimonialVisibility();
            }
        });
    }
    
    // Initial display
    updateTestimonialVisibility();
    
    // Update on window resize
    window.addEventListener('resize', updateTestimonialVisibility);
}

/**
 * Counter Animations
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current = Math.min(current + increment, target);
            counter.textContent = Math.floor(current);
            
            if (current < target) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    // Add parallax effect to hero elements
    const heroContent = document.querySelector('.portfolio-hero .hero-content');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (heroContent || scrollIndicator) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
            
            if (scrollIndicator) {
                scrollIndicator.style.opacity = 1 - (scrolled / 300);
            }
        });
    }
    
    // Initialize CTA particles when in view
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('particles-initialized')) {
                    entry.target.classList.add('particles-initialized');
                    initCTAParticles();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(ctaSection);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(30px);
        }
    }
    
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    @keyframes float-cta {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
        }
        25% {
            transform: translate(30px, -50px) scale(1.2);
            opacity: 0.6;
        }
        50% {
            transform: translate(-20px, -80px) scale(0.8);
            opacity: 0.4;
        }
        75% {
            transform: translate(-40px, -30px) scale(1.1);
            opacity: 0.5;
        }
    }
    
    @keyframes pulseGlow {
        0%, 100% {
            filter: brightness(1) drop-shadow(0 0 30px currentColor);
        }
        50% {
            filter: brightness(1.2) drop-shadow(0 0 50px currentColor);
        }
    }
    
    @keyframes pulseGlow2 {
        0%, 100% {
            filter: brightness(1) drop-shadow(0 0 30px currentColor);
        }
        50% {
            filter: brightness(1.3) drop-shadow(0 0 60px currentColor);
        }
    }
    
    /* Disable button styles */
    .nav-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .nav-btn:disabled:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: none;
    }
`;
document.head.appendChild(style);
/**
 * MAWA Prime Digital - About Page JavaScript
 * Enhanced interactions for about page
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize about page specific features
    initAboutNavigation();
    initAboutAnimations();
    initAboutParticles();
    initTeamInteractions();
    initTimelineAnimation();
    initCounterAnimations();
    initCTAParticles();
});

/**
 * Initialize particles for about hero
 */
function initAboutParticles() {
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
 * About Navigation - Smooth scroll and active state
 */
function initAboutNavigation() {
    const navItems = document.querySelectorAll('.about-nav .nav-item');
    const sections = document.querySelectorAll('.about-section');
    const navBar = document.querySelector('.about-nav');
    
    if (!navItems.length || !sections.length) return;
    
    // Click handler for navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = navBar ? navBar.offsetHeight + 100 : 100;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Scroll spy functionality
    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/**
 * Enhanced about page animations
 */
function initAboutAnimations() {
    // Animate stats on scroll
    const statValues = document.querySelectorAll('.stat-value');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const animateValue = (element) => {
        const value = element.textContent;
        const hasPercentage = value.includes('%');
        const hasPlus = value.includes('+');
        const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
        
        let current = 0;
        const increment = numericValue / 50;
        
        const updateValue = () => {
            current = Math.min(current + increment, numericValue);
            let displayValue = Math.floor(current).toString();
            
            if (hasPercentage) displayValue += '%';
            if (hasPlus && current >= numericValue) displayValue += '+';
            
            element.textContent = displayValue;
            
            if (current < numericValue) {
                requestAnimationFrame(updateValue);
            }
        };
        
        updateValue();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateValue(entry.target);
            }
        });
    }, observerOptions);
    
    statValues.forEach(stat => observer.observe(stat));
    
    // Card hover animations
    const cards = document.querySelectorAll('.story-card, .value-card, .member-card, .award-card');
    
    cards.forEach((card, index) => {
        // Add stagger effect on page load
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Mouse move parallax effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            // Move icon if present
            const icon = this.querySelector('.card-icon, .stat-icon');
            if (icon) {
                icon.style.transform = `translate(${deltaX * 10}px, ${deltaY * 10}px) scale(1.1)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon, .stat-icon');
            if (icon) {
                icon.style.transform = 'translate(0, 0) scale(1)';
            }
        });
    });
}

/**
 * Team member interactions
 */
function initTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const card = member.querySelector('.member-card');
        const image = member.querySelector('.member-image img');
        
        // 3D tilt effect on hover
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

/**
 * Timeline animation
 */
function initTimelineAnimation() {
    const timelinePoints = document.querySelectorAll('.timeline-point');
    
    if (!timelinePoints.length) return;
    
    // Animate timeline points on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.5 });
    
    timelinePoints.forEach(point => observer.observe(point));
    
    // Auto-scroll timeline on mobile
    const timelineTrack = document.querySelector('.timeline-track');
    if (timelineTrack && window.innerWidth <= 768) {
        let scrollPosition = 0;
        const scrollSpeed = 1;
        
        function autoScroll() {
            scrollPosition += scrollSpeed;
            if (scrollPosition >= timelineTrack.scrollWidth - timelineTrack.clientWidth) {
                scrollPosition = 0;
            }
            timelineTrack.scrollLeft = scrollPosition;
        }
        
        // Stop auto-scroll on user interaction
        let autoScrollInterval = setInterval(autoScroll, 50);
        
        timelineTrack.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });
        
        timelineTrack.addEventListener('touchstart', () => {
            clearInterval(autoScrollInterval);
        });
    }
}

/**
 * Counter animations for about stats
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
 * CTA Section Particles
 */
function initCTAParticles() {
    const ctaParticles = document.getElementById('cta-particles');
    if (!ctaParticles) return;
    
    // Create floating particles
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes shimmer {
        0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
        }
        100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
        }
    }
    
    @keyframes wave {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-1440px);
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
    
    /* Entry animations */
    .story-card,
    .value-card,
    .member-card,
    .award-card {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
/**
 * MAWA Prime Digital - Services Page JavaScript
 * Enhanced interactions for services page
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize services page specific features
    initServicesNavigation();
    initServiceAnimations();
    initCTAParticles();
    initIconAnimations();
    initServicesParticles();
    initServicesStars();
});

/**
 * Initialize particles for services hero
 */
function initServicesParticles() {
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
 * Services Navigation - Smooth scroll and active state
 */
function initServicesNavigation() {
    const navItems = document.querySelectorAll('.services-nav .nav-item');
    const sections = document.querySelectorAll('.service-section');
    const navBar = document.querySelector('.services-nav');
    
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
 * Enhanced service card animations
 */
function initServiceAnimations() {
    const serviceCards = document.querySelectorAll('.service-detail-card');
    
    serviceCards.forEach((card, index) => {
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
            
            // Move icon
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = `translate(${deltaX * 10}px, ${deltaY * 10}px) scale(1.1)`;
            }
            
            // Add subtle rotation
            this.style.transform = `translateY(-10px) scale(1.02) rotateX(${-deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'translate(0, 0) scale(1)';
            }
            this.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
        });
    });
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

/**
 * Icon Animations
 */
function initIconAnimations() {
    const iconWrappers = document.querySelectorAll('.icon-wrapper');
    
    iconWrappers.forEach(wrapper => {
        const animationClass = wrapper.className.split(' ').find(cls => 
            ['pulse', 'rotate', 'bounce', 'shake', 'flip', 'slide', 'spin', 
             'glow', 'wave', 'float', 'transform', 'perspective', 'morph',
             'sparkle', 'blink', 'ripple', 'typewriter', 'send', 'chart',
             'shield', 'server', 'speed', 'lock', 'support', 'gradient-move'].includes(cls)
        );
        
        if (animationClass) {
            // Restart animation on hover
            wrapper.addEventListener('mouseenter', function() {
                this.style.animation = 'none';
                void this.offsetHeight; // Trigger reflow
                this.style.animation = '';
            });
        }
    });
}

/**
 * Initialize floating shapes for services
 */
function initServicesStars() {
    const shapes = document.querySelectorAll('.floating-shapes .shape');
    
    shapes.forEach((shape, index) => {
        // Random floating animation
        shape.style.animationDelay = `${index * 2}s`;
        
        // Mouse parallax effect
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            
            shape.style.transform = `translate(${x * (index + 1) * 0.5}px, ${y * (index + 1) * 0.5}px)`;
        });
    });
}

// Add CSS for floating CTA particles
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
    
    .cta-particle {
        pointer-events: none;
        filter: blur(1px);
        will-change: transform;
    }
    
    /* Service cards enter animation */
    .service-detail-card {
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
    
    /* Icon animations */
    .icon-wrapper.pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .icon-wrapper.rotate {
        animation: rotate 2s linear infinite;
    }
    
    .icon-wrapper.bounce {
        animation: bounce 1s ease-in-out infinite;
    }
    
    .icon-wrapper.shake {
        animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) infinite;
    }
    
    .icon-wrapper.flip {
        animation: flip-vertical 2s ease-in-out infinite;
    }
    
    .icon-wrapper.slide {
        animation: slide-horizontal 2s ease-in-out infinite alternate;
    }
    
    .icon-wrapper.spin {
        animation: spin 1s linear infinite;
    }
    
    .icon-wrapper.glow {
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    .icon-wrapper.wave {
        animation: wave 2s ease-in-out infinite;
    }
    
    .icon-wrapper.float {
        animation: float 6s ease-in-out infinite;
    }
    
    .icon-wrapper.transform {
        animation: transform-3d 3s ease-in-out infinite;
    }
    
    .icon-wrapper.perspective {
        animation: perspective 3s ease-in-out infinite;
    }
    
    .icon-wrapper.morph {
        animation: morph-button 4s ease-in-out infinite;
    }
    
    /* Additional animations for marketing section */
    .icon-wrapper.sparkle {
        animation: sparkle 1.5s linear infinite;
    }
    
    .icon-wrapper.blink {
        animation: blink 1s ease-in-out infinite;
    }
    
    .icon-wrapper.ripple::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        animation: ripple-effect 2s ease-out infinite;
    }
    
    @keyframes ripple-effect {
        to {
            width: 200%;
            height: 200%;
            opacity: 0;
        }
    }
    
    .icon-wrapper.typewriter svg {
        animation: typewriter-icon 2s steps(3) infinite;
    }
    
    @keyframes typewriter-icon {
        0%, 100% { opacity: 1; }
        33% { opacity: 0.7; }
        66% { opacity: 0.4; }
    }
    
    .icon-wrapper.send {
        animation: send-icon 2s ease-out infinite;
    }
    
    @keyframes send-icon {
        0%, 100% {
            transform: translateX(0) rotate(0deg);
        }
        50% {
            transform: translateX(10px) rotate(45deg);
        }
    }
    
    .icon-wrapper.chart svg {
        animation: chart-grow 2s ease-out infinite;
    }
    
    @keyframes chart-grow {
        0%, 100% {
            transform: scaleY(1);
        }
        50% {
            transform: scaleY(1.2);
        }
    }
    
    /* Support section animations */
    .icon-wrapper.shield {
        animation: shield-pulse 2s ease-in-out infinite;
    }
    
    @keyframes shield-pulse {
        0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 10px rgba(107, 70, 193, 0.5));
        }
        50% {
            transform: scale(1.05);
            filter: drop-shadow(0 0 20px rgba(107, 70, 193, 0.8));
        }
    }
    
    .icon-wrapper.server::before,
    .icon-wrapper.server::after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background: #00ff00;
        border-radius: 50%;
        animation: server-blink 1s ease-in-out infinite;
    }
    
    .icon-wrapper.server::before {
        top: 25%;
        right: 20%;
    }
    
    .icon-wrapper.server::after {
        top: 45%;
        right: 20%;
        animation-delay: 0.5s;
    }
    
    @keyframes server-blink {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
    
    .icon-wrapper.speed::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, white, transparent);
        top: 50%;
        left: 0;
        animation: speed-lines 1.5s linear infinite;
    }
    
    @keyframes speed-lines {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }
    
    .icon-wrapper.lock {
        animation: lock-shake 2s ease-in-out infinite;
    }
    
    @keyframes lock-shake {
        0%, 100% {
            transform: translateX(0);
        }
        10%, 30%, 50%, 70% {
            transform: translateX(-2px);
        }
        20%, 40%, 60%, 80% {
            transform: translateX(2px);
        }
    }
    
    .icon-wrapper.support {
        animation: support-ring 2s ease-in-out infinite;
    }
    
    @keyframes support-ring {
        0%, 100% {
            transform: scale(1) rotate(0deg);
        }
        25% {
            transform: scale(1.1) rotate(90deg);
        }
        50% {
            transform: scale(1) rotate(180deg);
        }
        75% {
            transform: scale(1.1) rotate(270deg);
        }
    }
`;
document.head.appendChild(style);
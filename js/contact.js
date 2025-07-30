/**
 * MAWA Prime Digital - Contact Page JavaScript
 * Enhanced interactions for contact page
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize contact page specific features
    initContactParticles();
    initFAQAccordion();
    initMapInteraction();
    initPhoneNumberFormatting();
    initFormEnhancements();
    initCTAParticles();
});

/**
 * Initialize particles for contact hero
 */
function initContactParticles() {
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
 * FAQ Accordion functionality
 */
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    const otherAnswer = q.nextElementSibling;
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                }
            });
            
            // Toggle current FAQ
            this.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
        
        // Keyboard navigation
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Map interaction (placeholder for real map implementation)
 */
function initMapInteraction() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Here you would initialize Google Maps, Mapbox, or Leaflet
    // For now, we'll add a click handler to the placeholder
    mapContainer.addEventListener('click', function() {
        window.open('https://maps.google.com/?q=Musterstraße+123+Linz', '_blank');
    });
}

/**
 * Phone number formatting
 */
function initPhoneNumberFormatting() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Austrian phone number format
        if (value.startsWith('43')) {
            value = '+' + value;
        } else if (value.startsWith('0')) {
            value = '+43' + value.substring(1);
        }
        
        // Format the number
        if (value.length > 0) {
            let formatted = value;
            if (value.length > 3) {
                formatted = value.slice(0, 3) + ' ' + value.slice(3);
            }
            if (value.length > 6) {
                formatted = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
            }
            if (value.length > 10) {
                formatted = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10) + value.slice(10);
            }
            
            e.target.value = formatted;
        }
    });
}

/**
 * Form enhancements
 */
function initFormEnhancements() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Add floating label effect
    const formGroups = form.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('.form-input, .form-textarea, .form-select');
        const label = group.querySelector('.form-label');
        
        if (input && label) {
            // Check initial state
            if (input.value) {
                label.classList.add('active');
            }
            
            // Add focus/blur handlers
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('active');
                }
            });
        }
    });
    
    // Service selection enhancement
    const serviceSelect = document.getElementById('service');
    const budgetGroup = document.querySelector('#budget').closest('.form-group');
    
    if (serviceSelect && budgetGroup) {
        serviceSelect.addEventListener('change', function() {
            // Show/hide budget based on service selection
            if (this.value) {
                budgetGroup.style.display = 'block';
                budgetGroup.style.animation = 'fadeInUp 0.5s ease';
            } else {
                budgetGroup.style.display = 'none';
            }
        });
        
        // Initially hide budget field
        budgetGroup.style.display = 'none';
    }
    
    // Character counter for message
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = 1000;
        const counterElement = document.createElement('div');
        counterElement.className = 'character-counter';
        counterElement.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: #6c757d;
            margin-top: 0.25rem;
        `;
        messageTextarea.parentElement.appendChild(counterElement);
        
        function updateCounter() {
            const remaining = maxLength - messageTextarea.value.length;
            counterElement.textContent = `${remaining} Zeichen verbleibend`;
            
            if (remaining < 100) {
                counterElement.style.color = '#dc3545';
            } else if (remaining < 200) {
                counterElement.style.color = '#ffc107';
            } else {
                counterElement.style.color = '#6c757d';
            }
        }
        
        messageTextarea.addEventListener('input', updateCounter);
        updateCounter();
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
    
    .form-label.active {
        transform: translateY(-25px) scale(0.85);
        color: var(--primary-color);
    }
    
    .form-label {
        transition: all 0.3s ease;
        transform-origin: left top;
    }
    
    .character-counter {
        transition: color 0.3s ease;
    }
    
    /* Icon animations */
    .icon-wrapper.pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);
/**
 * MAWA Prime Digital - Cookie Consent JavaScript
 * GDPR compliant cookie consent management
 */

(function() {
    'use strict';
    
    // Cookie consent configuration
    const CookieConsent = {
        // Cookie categories
        categories: {
            necessary: {
                name: 'Notwendige Cookies',
                description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich.',
                required: true
            },
            analytics: {
                name: 'Analyse Cookies',
                description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
                required: false
            },
            marketing: {
                name: 'Marketing Cookies',
                description: 'Diese Cookies werden verwendet, um Werbung relevanter für Sie zu machen.',
                required: false
            },
            preferences: {
                name: 'Präferenz Cookies',
                description: 'Diese Cookies ermöglichen es der Website, sich an Ihre Einstellungen zu erinnern.',
                required: false
            }
        },
        
        // Cookie settings
        cookieName: 'mawa_cookie_consent',
        cookieDuration: 365, // days
        
        // Initialize cookie consent
        init: function() {
            this.loadSettings();
            this.checkConsent();
            this.bindEvents();
            this.initializeAnalytics();
        },
        
        // Load saved settings
        loadSettings: function() {
            const savedSettings = this.getCookie(this.cookieName);
            if (savedSettings) {
                try {
                    this.settings = JSON.parse(savedSettings);
                } catch (e) {
                    this.settings = null;
                }
            }
        },
        
        // Check if consent has been given
        checkConsent: function() {
            if (!this.settings) {
                this.showBanner();
            } else {
                this.applySettings();
            }
        },
        
        // Show cookie banner
        showBanner: function() {
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                setTimeout(() => {
                    banner.classList.add('show');
                }, 1000);
            }
        },
        
        // Hide cookie banner
        hideBanner: function() {
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.classList.remove('show');
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 300);
            }
        },
        
        // Bind event listeners
        bindEvents: function() {
            // Accept all cookies
            const acceptBtn = document.getElementById('accept-cookies');
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    this.acceptAll();
                });
            }
            
            // Reject non-necessary cookies
            const rejectBtn = document.getElementById('reject-cookies');
            if (rejectBtn) {
                rejectBtn.addEventListener('click', () => {
                    this.rejectAll();
                });
            }
            
            // Open settings
            const settingsBtn = document.getElementById('cookie-settings');
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => {
                    this.showSettings();
                });
            }
            
            // Bind settings modal events
            this.bindSettingsEvents();
        },
        
        // Accept all cookies
        acceptAll: function() {
            const settings = {};
            Object.keys(this.categories).forEach(key => {
                settings[key] = true;
            });
            
            this.saveSettings(settings);
            this.hideBanner();
            this.applySettings();
            this.trackConsent('accept_all');
        },
        
        // Reject all non-necessary cookies
        rejectAll: function() {
            const settings = {};
            Object.keys(this.categories).forEach(key => {
                settings[key] = this.categories[key].required;
            });
            
            this.saveSettings(settings);
            this.hideBanner();
            this.applySettings();
            this.trackConsent('reject_all');
        },
        
        // Show cookie settings modal
        showSettings: function() {
            const modal = this.createSettingsModal();
            document.body.appendChild(modal);
            
            // Animate in
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Trap focus
            this.trapFocus(modal);
        },
        
        // Create settings modal
        createSettingsModal: function() {
            const modal = document.createElement('div');
            modal.className = 'cookie-settings-modal';
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Cookie-Einstellungen</h2>
                        <button class="modal-close" aria-label="Schließen">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. Sie können Ihre Einstellungen jederzeit ändern.</p>
                        <div class="cookie-categories">
                            ${this.createCategoryToggles()}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" id="save-settings">Einstellungen speichern</button>
                        <button class="btn-primary" id="accept-all-settings">Alle akzeptieren</button>
                    </div>
                </div>
            `;
            
            // Add styles
            this.addModalStyles();
            
            return modal;
        },
        
        // Create category toggle switches
        createCategoryToggles: function() {
            let html = '';
            
            Object.keys(this.categories).forEach(key => {
                const category = this.categories[key];
                const isChecked = this.settings ? this.settings[key] : category.required;
                const isDisabled = category.required ? 'disabled' : '';
                
                html += `
                    <div class="cookie-category">
                        <div class="category-header">
                            <label class="toggle-switch">
                                <input type="checkbox" 
                                       name="${key}" 
                                       ${isChecked ? 'checked' : ''} 
                                       ${isDisabled}>
                                <span class="toggle-slider"></span>
                            </label>
                            <div class="category-info">
                                <h3>${category.name}</h3>
                                <p>${category.description}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            return html;
        },
        
        // Bind settings modal events
        bindSettingsEvents: function() {
            document.addEventListener('click', (e) => {
                // Close modal
                if (e.target.classList.contains('modal-close') || 
                    e.target.classList.contains('modal-backdrop')) {
                    this.closeSettingsModal();
                }
                
                // Save settings
                if (e.target.id === 'save-settings') {
                    this.saveCustomSettings();
                }
                
                // Accept all in settings
                if (e.target.id === 'accept-all-settings') {
                    this.acceptAllFromSettings();
                }
            });
        },
        
        // Close settings modal
        closeSettingsModal: function() {
            const modal = document.querySelector('.cookie-settings-modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        },
        
        // Save custom settings
        saveCustomSettings: function() {
            const settings = {};
            const checkboxes = document.querySelectorAll('.cookie-settings-modal input[type="checkbox"]');
            
            checkboxes.forEach(checkbox => {
                settings[checkbox.name] = checkbox.checked;
            });
            
            this.saveSettings(settings);
            this.closeSettingsModal();
            this.hideBanner();
            this.applySettings();
            this.trackConsent('custom');
        },
        
        // Accept all from settings modal
        acceptAllFromSettings: function() {
            const checkboxes = document.querySelectorAll('.cookie-settings-modal input[type="checkbox"]:not([disabled])');
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            
            this.saveCustomSettings();
        },
        
        // Save settings to cookie
        saveSettings: function(settings) {
            this.settings = settings;
            this.setCookie(this.cookieName, JSON.stringify(settings), this.cookieDuration);
        },
        
        // Apply cookie settings
        applySettings: function() {
            if (!this.settings) return;
            
            // Enable/disable analytics
            if (this.settings.analytics) {
                this.enableAnalytics();
            } else {
                this.disableAnalytics();
            }
            
            // Enable/disable marketing
            if (this.settings.marketing) {
                this.enableMarketing();
            } else {
                this.disableMarketing();
            }
            
            // Fire consent event
            window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
                detail: this.settings
            }));
        },
        
        // Initialize analytics if consented
        initializeAnalytics: function() {
            if (this.settings && this.settings.analytics) {
                this.enableAnalytics();
            }
        },
        
        // Enable analytics
        enableAnalytics: function() {
            // Google Analytics 4
            if (typeof gtag === 'undefined' && window.GA_MEASUREMENT_ID) {
                const script = document.createElement('script');
                script.src = `https://www.googletagmanager.com/gtag/js?id=${window.GA_MEASUREMENT_ID}`;
                script.async = true;
                document.head.appendChild(script);
                
                window.dataLayer = window.dataLayer || [];
                window.gtag = function() { dataLayer.push(arguments); };
                gtag('js', new Date());
                gtag('config', window.GA_MEASUREMENT_ID, {
                    'anonymize_ip': true,
                    'cookie_flags': 'SameSite=None;Secure'
                });
            }
            
            // Enable other analytics tools here
        },
        
        // Disable analytics
        disableAnalytics: function() {
            // Disable Google Analytics
            if (window.GA_MEASUREMENT_ID) {
                window[`ga-disable-${window.GA_MEASUREMENT_ID}`] = true;
            }
            
            // Delete analytics cookies
            this.deleteCookies(['_ga', '_gid', '_gat', '_gac_']);
        },
        
        // Enable marketing
        enableMarketing: function() {
            // Enable marketing scripts here
            // Facebook Pixel, Google Ads, etc.
        },
        
        // Disable marketing
        disableMarketing: function() {
            // Delete marketing cookies
            this.deleteCookies(['_fbp', 'fr', 'tr']);
        },
        
        // Track consent choice
        trackConsent: function(action) {
            // Track the consent action if analytics is enabled
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cookie_consent', {
                    'consent_action': action
                });
            }
        },
        
        // Cookie utility functions
        setCookie: function(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = `expires=${date.toUTCString()}`;
            document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax;Secure`;
        },
        
        getCookie: function(name) {
            const nameEQ = name + '=';
            const ca = document.cookie.split(';');
            
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            
            return null;
        },
        
        deleteCookies: function(names) {
            names.forEach(name => {
                // Delete cookie from all possible paths and domains
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname};`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
            });
        },
        
        // Focus trap for accessibility
        trapFocus: function(element) {
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
                
                if (e.key === 'Escape') {
                    this.closeSettingsModal();
                }
            });
            
            firstFocusable.focus();
        },
        
        // Add modal styles
        addModalStyles: function() {
            if (document.getElementById('cookie-modal-styles')) return;
            
            const styles = document.createElement('style');
            styles.id = 'cookie-modal-styles';
            styles.innerHTML = `
                .cookie-settings-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .cookie-settings-modal.show {
                    opacity: 1;
                }
                
                .modal-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                }
                
                .modal-content {
                    position: relative;
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }
                
                .cookie-settings-modal.show .modal-content {
                    transform: scale(1);
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                
                .modal-header h2 {
                    margin: 0;
                    color: var(--dark-color);
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: var(--text-light);
                    transition: color 0.3s ease;
                    padding: 0;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                
                .modal-close:hover {
                    color: var(--dark-color);
                    background: var(--light-color);
                }
                
                .modal-body {
                    margin-bottom: 2rem;
                }
                
                .cookie-categories {
                    margin-top: 2rem;
                }
                
                .cookie-category {
                    margin-bottom: 1.5rem;
                    padding: 1.5rem;
                    background: var(--light-color);
                    border-radius: 10px;
                }
                
                .category-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                }
                
                .category-info h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.125rem;
                    color: var(--dark-color);
                }
                
                .category-info p {
                    margin: 0;
                    font-size: 0.875rem;
                    color: var(--text-light);
                }
                
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                    flex-shrink: 0;
                }
                
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: 0.4s;
                    border-radius: 24px;
                }
                
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: 0.4s;
                    border-radius: 50%;
                }
                
                input:checked + .toggle-slider {
                    background-color: var(--primary-color);
                }
                
                input:checked + .toggle-slider:before {
                    transform: translateX(26px);
                }
                
                input:disabled + .toggle-slider {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }
                
                @media (max-width: 576px) {
                    .modal-content {
                        padding: 1.5rem;
                        width: 95%;
                        max-height: 90vh;
                    }
                    
                    .modal-footer {
                        flex-direction: column;
                    }
                    
                    .modal-footer button {
                        width: 100%;
                    }
                }
            `;
            
            document.head.appendChild(styles);
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            CookieConsent.init();
        });
    } else {
        CookieConsent.init();
    }
    
    // Expose API
    window.CookieConsent = CookieConsent;
    
})();
/**
 * MAWA Prime Digital - Form Handler JavaScript
 * Backend integration and form processing
 */

(function() {
    'use strict';
    
    // Configuration
    const config = {
        apiEndpoint: '/api/contact', // Change to your actual API endpoint
        recaptchaSiteKey: '', // Add your reCAPTCHA site key if using
        useRecaptcha: false,
        useHoneypot: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
        timeout: 30000, // 30 seconds
        retryAttempts: 3,
        retryDelay: 1000 // 1 second
    };
    
    // Form Handler Class
    class FormHandler {
        constructor(formElement) {
            this.form = formElement;
            this.submitButton = this.form.querySelector('[type="submit"]');
            this.successMessage = this.form.querySelector('.form-success');
            this.errorMessage = null;
            this.isSubmitting = false;
            this.honeypotField = null;
            
            this.init();
        }
        
        init() {
            // Add honeypot field if enabled
            if (config.useHoneypot) {
                this.addHoneypot();
            }
            
            // Initialize reCAPTCHA if enabled
            if (config.useRecaptcha && config.recaptchaSiteKey) {
                this.initRecaptcha();
            }
            
            // Bind form submission
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Add file input handlers if present
            const fileInputs = this.form.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
                input.addEventListener('change', this.validateFile.bind(this));
            });
            
            // Add real-time validation
            this.addRealtimeValidation();
        }
        
        /**
         * Add honeypot field for spam protection
         */
        addHoneypot() {
            const honeypot = document.createElement('div');
            honeypot.style.position = 'absolute';
            honeypot.style.left = '-9999px';
            honeypot.innerHTML = `
                <input type="text" 
                       name="website" 
                       tabindex="-1" 
                       autocomplete="off"
                       aria-hidden="true">
            `;
            this.form.appendChild(honeypot);
            this.honeypotField = honeypot.querySelector('input');
        }
        
        /**
         * Initialize Google reCAPTCHA
         */
        initRecaptcha() {
            if (typeof grecaptcha === 'undefined') {
                // Load reCAPTCHA script
                const script = document.createElement('script');
                script.src = `https://www.google.com/recaptcha/api.js?render=${config.recaptchaSiteKey}`;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }
        }
        
        /**
         * Add real-time validation to form fields
         */
        addRealtimeValidation() {
            const inputs = this.form.querySelectorAll('input:not([type="submit"]), textarea, select');
            
            inputs.forEach(input => {
                // Skip honeypot field
                if (input === this.honeypotField) return;
                
                // Validate on blur
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                // Clear error on input
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.clearFieldError(input);
                    }
                });
            });
        }
        
        /**
         * Handle form submission
         */
        async handleSubmit(e) {
            e.preventDefault();
            
            // Prevent double submission
            if (this.isSubmitting) return;
            
            // Check honeypot
            if (config.useHoneypot && this.honeypotField.value) {
                console.warn('Honeypot triggered - possible spam');
                return;
            }
            
            // Validate all fields
            if (!this.validateForm()) {
                this.focusFirstError();
                return;
            }
            
            // Start submission
            this.isSubmitting = true;
            this.setLoadingState(true);
            this.clearMessages();
            
            try {
                // Get reCAPTCHA token if enabled
                let recaptchaToken = null;
                if (config.useRecaptcha && typeof grecaptcha !== 'undefined') {
                    recaptchaToken = await this.getRecaptchaToken();
                }
                
                // Prepare form data
                const formData = this.prepareFormData(recaptchaToken);
                
                // Submit with retry logic
                const response = await this.submitWithRetry(formData);
                
                if (response.success) {
                    this.handleSuccess(response);
                } else {
                    this.handleError(response.message || 'Ein Fehler ist aufgetreten');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.handleError('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
            } finally {
                this.isSubmitting = false;
                this.setLoadingState(false);
            }
        }
        
        /**
         * Get reCAPTCHA token
         */
        async getRecaptchaToken() {
            return new Promise((resolve, reject) => {
                grecaptcha.ready(() => {
                    grecaptcha.execute(config.recaptchaSiteKey, { action: 'submit' })
                        .then(token => resolve(token))
                        .catch(error => reject(error));
                });
            });
        }
        
        /**
         * Prepare form data for submission
         */
        prepareFormData(recaptchaToken) {
            const formData = new FormData(this.form);
            
            // Remove honeypot field
            if (config.useHoneypot) {
                formData.delete('website');
            }
            
            // Add reCAPTCHA token
            if (recaptchaToken) {
                formData.append('recaptcha_token', recaptchaToken);
            }
            
            // Add timestamp
            formData.append('timestamp', new Date().toISOString());
            
            // Add page URL
            formData.append('page_url', window.location.href);
            
            // Convert to JSON if not using file uploads
            const hasFiles = Array.from(formData.entries()).some(([key, value]) => value instanceof File);
            
            if (!hasFiles) {
                const data = {};
                formData.forEach((value, key) => {
                    if (data[key]) {
                        // Handle multiple values (like checkboxes)
                        if (!Array.isArray(data[key])) {
                            data[key] = [data[key]];
                        }
                        data[key].push(value);
                    } else {
                        data[key] = value;
                    }
                });
                return JSON.stringify(data);
            }
            
            return formData;
        }
        
        /**
         * Submit with retry logic
         */
        async submitWithRetry(formData, attempt = 1) {
            try {
                const response = await this.sendRequest(formData);
                return response;
            } catch (error) {
                if (attempt < config.retryAttempts) {
                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, config.retryDelay * attempt));
                    return this.submitWithRetry(formData, attempt + 1);
                }
                throw error;
            }
        }
        
        /**
         * Send the actual request
         */
        async sendRequest(formData) {
            const isJSON = typeof formData === 'string';
            
            const options = {
                method: 'POST',
                headers: {},
                body: formData
            };
            
            if (isJSON) {
                options.headers['Content-Type'] = 'application/json';
            }
            
            // Add CSRF token if available
            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            if (csrfToken) {
                options.headers['X-CSRF-Token'] = csrfToken.content;
            }
            
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);
            options.signal = controller.signal;
            
            try {
                const response = await fetch(config.apiEndpoint, options);
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                return data;
            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout');
                }
                throw error;
            }
        }
        
        /**
         * Validate entire form
         */
        validateForm() {
            const inputs = this.form.querySelectorAll('input:not([type="submit"]), textarea, select');
            let isValid = true;
            
            inputs.forEach(input => {
                // Skip honeypot field
                if (input === this.honeypotField) return;
                
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }
        
        /**
         * Validate individual field
         */
        validateField(field) {
            let isValid = true;
            let errorMessage = '';
            
            // Clear previous error
            this.clearFieldError(field);
            
            // Required validation
            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                errorMessage = 'Dieses Feld ist erforderlich';
            }
            
            // Email validation
            else if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
                }
            }
            
            // Phone validation
            else if (field.type === 'tel' && field.value) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein';
                }
            }
            
            // URL validation
            else if (field.type === 'url' && field.value) {
                try {
                    new URL(field.value);
                } catch {
                    isValid = false;
                    errorMessage = 'Bitte geben Sie eine gültige URL ein';
                }
            }
            
            // Min length validation
            else if (field.hasAttribute('minlength')) {
                const minLength = parseInt(field.getAttribute('minlength'));
                if (field.value.length < minLength) {
                    isValid = false;
                    errorMessage = `Mindestens ${minLength} Zeichen erforderlich`;
                }
            }
            
            // Max length validation
            else if (field.hasAttribute('maxlength')) {
                const maxLength = parseInt(field.getAttribute('maxlength'));
                if (field.value.length > maxLength) {
                    isValid = false;
                    errorMessage = `Maximal ${maxLength} Zeichen erlaubt`;
                }
            }
            
            // Pattern validation
            else if (field.hasAttribute('pattern')) {
                const pattern = new RegExp(field.getAttribute('pattern'));
                if (!pattern.test(field.value)) {
                    isValid = false;
                    errorMessage = field.getAttribute('title') || 'Ungültiges Format';
                }
            }
            
            // Show error if invalid
            if (!isValid) {
                this.showFieldError(field, errorMessage);
            }
            
            return isValid;
        }
        
        /**
         * Validate file input
         */
        validateFile(e) {
            const input = e.target;
            const files = input.files;
            
            if (!files || files.length === 0) return true;
            
            let isValid = true;
            let errorMessage = '';
            
            for (let file of files) {
                // Check file size
                if (file.size > config.maxFileSize) {
                    isValid = false;
                    errorMessage = `Datei "${file.name}" ist zu groß. Maximal ${config.maxFileSize / 1024 / 1024}MB erlaubt.`;
                    break;
                }
                
                // Check file type
                const extension = file.name.split('.').pop().toLowerCase();
                if (!config.allowedFileTypes.includes(extension)) {
                    isValid = false;
                    errorMessage = `Dateityp "${extension}" nicht erlaubt. Erlaubte Typen: ${config.allowedFileTypes.join(', ')}`;
                    break;
                }
            }
            
            if (!isValid) {
                this.showFieldError(input, errorMessage);
                input.value = ''; // Clear the input
            } else {
                this.clearFieldError(input);
            }
            
            return isValid;
        }
        
        /**
         * Show field error
         */
        showFieldError(field, message) {
            field.classList.add('error');
            
            // Find or create error message element
            let errorElement = field.parentElement.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                errorElement.setAttribute('role', 'alert');
                field.parentElement.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Add ARIA attributes
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', errorElement.id || this.generateId());
            if (!errorElement.id) {
                errorElement.id = field.getAttribute('aria-describedby');
            }
        }
        
        /**
         * Clear field error
         */
        clearFieldError(field) {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
            
            const errorElement = field.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
                errorElement.textContent = '';
            }
        }
        
        /**
         * Focus first error field
         */
        focusFirstError() {
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        /**
         * Set loading state
         */
        setLoadingState(isLoading) {
            if (isLoading) {
                this.submitButton.classList.add('loading');
                this.submitButton.disabled = true;
                this.form.classList.add('form-loading');
            } else {
                this.submitButton.classList.remove('loading');
                this.submitButton.disabled = false;
                this.form.classList.remove('form-loading');
            }
        }
        
        /**
         * Handle successful submission
         */
        handleSuccess(response) {
            // Show success message
            if (this.successMessage) {
                this.successMessage.style.display = 'block';
                this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                this.showMessage('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success');
            }
            
            // Reset form
            this.form.reset();
            
            // Clear all field errors
            const fields = this.form.querySelectorAll('.error');
            fields.forEach(field => this.clearFieldError(field));
            
            // Track event if analytics available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'form_name': this.form.id || 'contact_form',
                    'form_destination': config.apiEndpoint
                });
            }
            
            // Call custom success callback if provided
            if (this.form.dataset.onSuccess) {
                try {
                    const callback = new Function('response', this.form.dataset.onSuccess);
                    callback(response);
                } catch (error) {
                    console.error('Error in success callback:', error);
                }
            }
            
            // Auto-hide success message after 10 seconds
            setTimeout(() => {
                if (this.successMessage) {
                    this.successMessage.style.display = 'none';
                }
            }, 10000);
        }
        
        /**
         * Handle submission error
         */
        handleError(message) {
            // Show error message
            this.showMessage(message, 'error');
            
            // Track event if analytics available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_error', {
                    'form_name': this.form.id || 'contact_form',
                    'error_message': message
                });
            }
            
            // Call custom error callback if provided
            if (this.form.dataset.onError) {
                try {
                    const callback = new Function('message', this.form.dataset.onError);
                    callback(message);
                } catch (error) {
                    console.error('Error in error callback:', error);
                }
            }
        }
        
        /**
         * Show message
         */
        showMessage(message, type) {
            // Remove existing message
            const existingMessage = this.form.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Create message element
            const messageElement = document.createElement('div');
            messageElement.className = `form-message form-message-${type}`;
            messageElement.setAttribute('role', 'alert');
            messageElement.innerHTML = `
                <div class="message-content">
                    ${type === 'success' ? '✓' : '⚠'} ${message}
                </div>
                <button type="button" class="message-close" aria-label="Nachricht schließen">&times;</button>
            `;
            
            // Insert message after submit button
            this.submitButton.parentElement.appendChild(messageElement);
            
            // Add close functionality
            const closeButton = messageElement.querySelector('.message-close');
            closeButton.addEventListener('click', () => messageElement.remove());
            
            // Auto-hide after 10 seconds for success, 30 seconds for error
            setTimeout(() => {
                if (messageElement.parentElement) {
                    messageElement.remove();
                }
            }, type === 'success' ? 10000 : 30000);
            
            // Scroll to message
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        /**
         * Clear all messages
         */
        clearMessages() {
            // Hide success message
            if (this.successMessage) {
                this.successMessage.style.display = 'none';
            }
            
            // Remove any form messages
            const messages = this.form.querySelectorAll('.form-message');
            messages.forEach(message => message.remove());
        }
        
        /**
         * Generate unique ID
         */
        generateId() {
            return 'error-' + Math.random().toString(36).substr(2, 9);
        }
    }
    
    // Initialize all forms with data-form-handler attribute
    document.addEventListener('DOMContentLoaded', () => {
        const forms = document.querySelectorAll('form[data-form-handler]');
        forms.forEach(form => {
            new FormHandler(form);
        });
        
        // Also initialize contact form by ID if exists
        const contactForm = document.getElementById('contact-form');
        if (contactForm && !contactForm.hasAttribute('data-form-handler')) {
            new FormHandler(contactForm);
        }
    });
    
    // Export for use in other modules
    window.FormHandler = FormHandler;
    
})();
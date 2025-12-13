// ============================================
// PAYMENT FORM VALIDATION - AFROSZN
// ============================================

// ===== VALIDATION HELPER FUNCTIONS =====
function validateCardholderName(name) {
    if (!name || name.trim().length < 3) {
        return 'Please enter a valid cardholder name';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name should only contain letters';
    }
    return null;
}

function validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (!cleaned) {
        return 'Card number is required';
    }
    
    if (cleaned.length < 13 || cleaned.length > 19) {
        return 'Card number must be 13-19 digits';
    }
    
    if (!/^\d+$/.test(cleaned)) {
        return 'Card number should only contain digits';
    }
    
    // Luhn algorithm check
    if (!luhnCheck(cleaned)) {
        return 'Invalid card number';
    }
    
    return null;
}

function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

function validateExpiryDate(expiry) {
    if (!expiry) {
        return 'Expiration date is required';
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return 'Format should be MM/YY';
    }
    
    const [month, year] = expiry.split('/').map(num => parseInt(num));
    
    if (month < 1 || month > 12) {
        return 'Invalid month (01-12)';
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return 'Card has expired';
    }
    
    return null;
}

function validateCVC(cvc) {
    if (!cvc) {
        return 'CVC is required';
    }
    
    if (!/^\d{3,4}$/.test(cvc)) {
        return 'CVC must be 3 or 4 digits';
    }
    
    return null;
}

function validateCountry(country) {
    if (!country) {
        return 'Please select a country';
    }
    return null;
}

function validateAddress(address) {
    if (!address || address.trim().length < 5) {
        return 'Please enter a valid address';
    }
    return null;
}

function validateCity(city) {
    if (!city || city.trim().length < 2) {
        return 'Please enter a valid city';
    }
    return null;
}

function validateState(state) {
    if (!state || state.trim().length < 2) {
        return 'Please enter a valid state';
    }
    return null;
}

function validateZipcode(zipcode) {
    if (!zipcode) {
        return 'Zipcode is required';
    }
    
    if (zipcode.length < 3 || zipcode.length > 10) {
        return 'Please enter a valid zipcode';
    }
    
    return null;
}

// ===== ERROR DISPLAY FUNCTIONS =====
function showFieldError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}Error`);
    
    if (field) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
    }
    
    if (errorSpan) {
        errorSpan.textContent = errorMessage;
        errorSpan.style.display = 'block';
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}Error`);
    
    if (field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
    }
    
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
    }
}

function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.textContent = '';
        msg.style.display = 'none';
    });
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
    });
    
    const generalError = document.getElementById('formGeneralError');
    if (generalError) {
        generalError.textContent = '';
        generalError.style.display = 'none';
    }
}

// ===== FORM VALIDATION =====
function validatePaymentForm() {
    clearAllErrors();
    let isValid = true;
    let firstErrorField = null;

    // Validate cardholder name
    const cardholderName = document.getElementById('cardholderName')?.value || '';
    const nameError = validateCardholderName(cardholderName);
    if (nameError) {
        showFieldError('cardholderName', nameError);
        if (!firstErrorField) firstErrorField = document.getElementById('cardholderName');
        isValid = false;
    }

    // Validate card number
    const cardNumber = document.getElementById('cardNumber')?.value || '';
    const cardError = validateCardNumber(cardNumber);
    if (cardError) {
        showFieldError('cardNumber', cardError);
        if (!firstErrorField) firstErrorField = document.getElementById('cardNumber');
        isValid = false;
    }

    // Validate expiry date
    const expiryDate = document.getElementById('expiryDate')?.value || '';
    const expiryError = validateExpiryDate(expiryDate);
    if (expiryError) {
        showFieldError('expiryDate', expiryError);
        if (!firstErrorField) firstErrorField = document.getElementById('expiryDate');
        isValid = false;
    }

    // Validate CVC
    const cvc = document.getElementById('cvc')?.value || '';
    const cvcError = validateCVC(cvc);
    if (cvcError) {
        showFieldError('cvc', cvcError);
        if (!firstErrorField) firstErrorField = document.getElementById('cvc');
        isValid = false;
    }

    // Validate country
    const country = document.getElementById('country')?.value || '';
    const countryError = validateCountry(country);
    if (countryError) {
        showFieldError('country', countryError);
        if (!firstErrorField) firstErrorField = document.getElementById('country');
        isValid = false;
    }

    // Validate address
    const address = document.getElementById('address')?.value || '';
    const addressError = validateAddress(address);
    if (addressError) {
        showFieldError('address', addressError);
        if (!firstErrorField) firstErrorField = document.getElementById('address');
        isValid = false;
    }

    // Validate city
    const city = document.getElementById('city')?.value || '';
    const cityError = validateCity(city);
    if (cityError) {
        showFieldError('city', cityError);
        if (!firstErrorField) firstErrorField = document.getElementById('city');
        isValid = false;
    }

    // Validate state
    const state = document.getElementById('state')?.value || '';
    const stateError = validateState(state);
    if (stateError) {
        showFieldError('state', stateError);
        if (!firstErrorField) firstErrorField = document.getElementById('state');
        isValid = false;
    }

    // Validate zipcode
    const zipcode = document.getElementById('zipcode')?.value || '';
    const zipcodeError = validateZipcode(zipcode);
    if (zipcodeError) {
        showFieldError('zipcode', zipcodeError);
        if (!firstErrorField) firstErrorField = document.getElementById('zipcode');
        isValid = false;
    }

    // Validate terms checkbox
    const terms = document.getElementById('terms')?.checked || false;
    if (!terms) {
        const termsError = document.getElementById('termsError');
        if (termsError) {
            termsError.textContent = 'You must accept the terms and conditions';
            termsError.style.display = 'block';
        }
        if (!firstErrorField) firstErrorField = document.getElementById('terms');
        isValid = false;
    }

    // Focus first error field
    if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
}

// ===== HANDLE PAYMENT SUBMISSION =====
async function handlePayment(event) {
    event.preventDefault();
    
    // Validate form
    if (!validatePaymentForm()) {
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success
        alert('Payment successful! Your tickets will be sent to your email.');
        
        // In real implementation, redirect to success page
        // window.location.href = 'success.html';
    } catch (error) {
        console.error('Payment error:', error);
        
        const generalError = document.getElementById('formGeneralError');
        if (generalError) {
            generalError.textContent = 'Payment failed. Please check your details and try again.';
            generalError.style.display = 'block';
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm and pay';
    }
}

// ===== PAYMENT METHOD SELECTION =====
let currentPaymentMethod = 'card';

function initializePaymentMethods() {
    document.querySelectorAll('.payment-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            this.querySelector('input').checked = true;
            
            currentPaymentMethod = this.getAttribute('data-method');
            const cardForm = document.getElementById('paymentForm');
            const gpayBtn = document.getElementById('gpayBtn');
            const applepayBtn = document.getElementById('applepayBtn');
            const paypalBtn = document.getElementById('paypalBtn');
            
            // Clear all errors when switching payment methods
            clearAllErrors();
            
            // Hide all
            if (cardForm) cardForm.style.display = 'none';
            if (gpayBtn) gpayBtn.style.display = 'none';
            if (applepayBtn) applepayBtn.style.display = 'none';
            if (paypalBtn) paypalBtn.style.display = 'none';
            
            // Show correct one
            if (currentPaymentMethod === 'card' && cardForm) {
                cardForm.style.display = 'block';
            } else if (currentPaymentMethod === 'gpay' && gpayBtn) {
                gpayBtn.style.display = 'block';
            } else if (currentPaymentMethod === 'applepay' && applepayBtn) {
                applepayBtn.style.display = 'block';
            } else if (currentPaymentMethod === 'paypal' && paypalBtn) {
                paypalBtn.style.display = 'block';
            }
        });
    });
}

// ===== ALTERNATIVE PAYMENT METHODS =====
async function handleAlternativePayment(method) {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Processing...';
    
    try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Payment successful via ${method}! Your tickets will be sent to your email.`);
    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
        btn.disabled = false;
        btn.textContent = `Continue with ${method}`;
    }
}

function initializeAlternativePaymentButtons() {
    const gpayBtn = document.getElementById('gpayBtn');
    const applepayBtn = document.getElementById('applepayBtn');
    const paypalBtn = document.getElementById('paypalBtn');
    
    if (gpayBtn) {
        gpayBtn.addEventListener('click', () => handleAlternativePayment('Google Pay'));
    }
    if (applepayBtn) {
        applepayBtn.addEventListener('click', () => handleAlternativePayment('Apple Pay'));
    }
    if (paypalBtn) {
        paypalBtn.addEventListener('click', () => handleAlternativePayment('PayPal'));
    }
}

// ===== REAL-TIME VALIDATION =====
function setupRealTimeValidation() {
    // Card number formatting and validation
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });

        cardNumberInput.addEventListener('blur', () => {
            const error = validateCardNumber(cardNumberInput.value);
            if (error) {
                showFieldError('cardNumber', error);
            } else {
                clearFieldError('cardNumber');
            }
        });

        cardNumberInput.addEventListener('focus', () => {
            clearFieldError('cardNumber');
        });
    }

    // CVC validation
    const cvcInput = document.getElementById('cvc');
    if (cvcInput) {
        cvcInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        cvcInput.addEventListener('blur', () => {
            const error = validateCVC(cvcInput.value);
            if (error) {
                showFieldError('cvc', error);
            } else {
                clearFieldError('cvc');
            }
        });

        cvcInput.addEventListener('focus', () => {
            clearFieldError('cvc');
        });
    }

    // Expiry date auto-format and validation
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            
            e.target.value = value;
        });
        
        expiryInput.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace') {
                let val = e.target.value;
                if (val.endsWith('/')) {
                    e.target.value = val.slice(0, -1);
                }
            }
        });

        expiryInput.addEventListener('blur', () => {
            const error = validateExpiryDate(expiryInput.value);
            if (error) {
                showFieldError('expiryDate', error);
            } else {
                clearFieldError('expiryDate');
            }
        });

        expiryInput.addEventListener('focus', () => {
            clearFieldError('expiryDate');
        });
    }

    // Cardholder name validation
    const nameInput = document.getElementById('cardholderName');
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            const error = validateCardholderName(nameInput.value);
            if (error) {
                showFieldError('cardholderName', error);
            } else {
                clearFieldError('cardholderName');
            }
        });

        nameInput.addEventListener('focus', () => {
            clearFieldError('cardholderName');
        });
    }

    // Clear errors on focus for other fields
    ['country', 'address', 'city', 'state', 'zipcode'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('focus', () => clearFieldError(fieldId));
        }
    });
}

// ===== INITIALIZE ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentMethods();
    initializeAlternativePaymentButtons();
    setupRealTimeValidation();
    
    console.log('Payment validation initialized');
});
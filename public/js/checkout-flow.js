// checkout-flow.js - 3-Step Checkout Modal (Mobile & Desktop Ready)
// Updated for dynamic pricing with Stripe payment links

class CheckoutFlow {
    constructor() {
        this.currentStep = 1;
        this.orderData = {};
    }

    // ===== STEP 1: TICKET SELECTION =====
    showStep1(ticketData) {
        this.orderData = ticketData;
        
        const modalHTML = `
            <div class="checkout-modal-overlay" id="checkoutModal">
                <div class="checkout-card">
                    <button class="checkout-close" onclick="checkoutFlow.close()">×</button>
                    
                    <div class="checkout-content step-1">
                        <div class="checkout-left">
                            <p class="checkout-date-header">${ticketData.eventDate}</p>
                            
                            <button class="back-arrow" onclick="checkoutFlow.close()">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            
                            <div class="ticket-selection-card">
                                <div class="ticket-selection-header">
                                    <span>${ticketData.ticketType}</span>
                                    <div class="quantity-controls-inline">
                                        <span id="modalQuantity">${ticketData.quantity}</span>
                                    </div>
                                </div>
                                
                                <div class="ticket-price-info">
                                    <div class="ticket-price-main">$${ticketData.price.toFixed(2)}</div>
                                    <div class="ticket-remaining">394 remaining</div>
                                    <div class="sales-end">Sales end on Oct 31, 2025</div>
                                </div>
                            </div>
                            
                            <button class="register-btn" onclick="checkoutFlow.showStep2()">Register</button>
                        </div>
                        
                        <div class="checkout-right">
                            <div class="event-preview">
                                <img src="${ticketData.eventImage}" alt="Event">
                                <div class="event-preview-title">${ticketData.eventName}</div>
                            </div>
                            
                            <h3 class="order-summary-title">Order summary</h3>
                            
                            <div class="order-item">
                                <span>${ticketData.quantity} x ${ticketData.ticketType}</span>
                                <span>$${ticketData.price.toFixed(2)}</span>
                            </div>
                            
                            <div class="order-total">
                                <span class="order-total-label">Total</span>
                                <span class="order-total-price">$${ticketData.price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addModalToPage(modalHTML);
    }

    // ===== STEP 2: BILLING INFORMATION =====
    showStep2() {
        const modalHTML = `
            <div class="checkout-modal-overlay" id="checkoutModal">
                <div class="checkout-card">
                    <button class="checkout-close" onclick="checkoutFlow.close()">×</button>
                    
                    <div class="checkout-content step-2">
                        <div class="checkout-left">
                            <p class="checkout-date-header">${this.orderData.eventDate}</p>
                            
                            <div class="checkout-steps">
                                <div class="step completed">
                                    <div class="step-number">1</div>
                                </div>
                                <div class="step-line completed"></div>
                                <div class="step active">
                                    <div class="step-number">2</div>
                                </div>
                                <div class="step-line"></div>
                                <div class="step">
                                    <div class="step-number">3</div>
                                </div>
                            </div>
                            
                            <h2 class="checkout-heading">1. Billing information</h2>
                            
                            <form id="billingForm" onsubmit="checkoutFlow.handleBillingSubmit(event)">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>First name</label>
                                        <input type="text" name="firstName" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Last name</label>
                                        <input type="text" name="lastName" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Email</label>
                                        <input type="email" name="email" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Confirm Email</label>
                                        <input type="email" name="confirmEmail" required>
                                    </div>
                                </div>
                                
                                <button type="submit" class="checkout-submit-btn">Continue to payment</button>
                            </form>
                        </div>
                        
                        <div class="checkout-right">
                            <div class="event-preview">
                                <img src="${this.orderData.eventImage}" alt="Event">
                                <div class="event-preview-title">${this.orderData.eventName}</div>
                            </div>
                            
                            <h3 class="order-summary-title">Order summary</h3>
                            
                            <div class="order-item">
                                <span>${this.orderData.quantity} x ${this.orderData.ticketType}</span>
                                <span>$${this.orderData.price.toFixed(2)}</span>
                            </div>
                            
                            <div class="order-total">
                                <span class="order-total-label">Total</span>
                                <span class="order-total-price">$${this.orderData.price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.removeCurrentModal();
        this.addModalToPage(modalHTML);
        this.currentStep = 2;
    }

    // ===== STEP 3: PAYMENT SELECTION =====
    showStep3() {
        const modalHTML = `
            <div class="checkout-modal-overlay" id="checkoutModal">
                <div class="checkout-card">
                    <button class="checkout-close" onclick="checkoutFlow.close()">×</button>
                    
                    <div class="checkout-content step-3">
                        <div class="checkout-left">
                            <p class="checkout-date-header">${this.orderData.eventDate}</p>
                            
                            <div class="checkout-steps">
                                <div class="step completed">
                                    <div class="step-number">1</div>
                                </div>
                                <div class="step-line completed"></div>
                                <div class="step completed">
                                    <div class="step-number">2</div>
                                </div>
                                <div class="step-line completed"></div>
                                <div class="step active">
                                    <div class="step-number">3</div>
                                </div>
                            </div>
                            
                            <div class="section-header">
                                <h2 class="checkout-heading section-title">Payment Method</h2>
                                <p class="section-subtitle">Choose how you'd like to pay</p>
                            </div>
                            
                            <div class="payment-options">
                                <!-- Card Option -->
                                <div class="payment-option">
                                    <input type="radio" id="modalCard" name="modalPayment" checked>
                                    <label for="modalCard">
                                        <div class="option-content">
                                            <div class="radio-circle"></div>
                                            <div class="icon-container">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                                    <line x1="1" y1="10" x2="23" y2="10"/>
                                                </svg>
                                            </div>
                                            <div class="text-content">
                                                <div class="option-title">Card</div>
                                                <div class="option-description">Pay with debit or credit card</div>
                                                <div class="badges">
                                                    <span class="badge">
                                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                                        </svg>
                                                        Apple Pay
                                                    </span>
                                                    <span class="badge">
                                                        <svg viewBox="0 0 24 24">
                                                            <path fill="#4285F4" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                                                        </svg>
                                                        Google Pay
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <!-- PayPal Option -->
                                <div class="payment-option">
                                    <input type="radio" id="modalPaypal" name="modalPayment">
                                    <label for="modalPaypal">
                                        <div class="option-content">
                                            <div class="radio-circle"></div>
                                            <div class="icon-container">
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.65h6.96c2.303 0 4.122.626 5.175 1.819.913 1.035 1.271 2.458.989 4.181-.012.067-.024.134-.038.2-.015.07-.032.14-.05.21-.502 2.67-2.23 4.47-5.132 5.09a10.18 10.18 0 0 1-2.197.232H9.92a.77.77 0 0 0-.758.65l-.808 5.17a.641.641 0 0 1-.633.715h-.645z" fill="#003087"/>
                                                    <path d="M19.952 7.23c-.075.418-.177.854-.312 1.31-.802 2.724-2.756 4.39-5.736 4.873a9.88 9.88 0 0 1-1.728.148H9.492l-.896 5.723a.641.641 0 0 1-.633.716H5.6l.232-1.484.58-3.716.012-.077.116-.745a.77.77 0 0 1 .758-.65h1.488c.75 0 1.457-.078 2.12-.234 2.67-.624 4.278-2.29 4.907-4.765.25-.985.328-1.844.255-2.585-.027-.28-.076-.54-.146-.78.088.044.173.092.256.144.64.403 1.107.969 1.357 1.678.147.414.239.876.26 1.384l.157.06z" opacity="0.7" fill="#003087"/>
                                                </svg>
                                            </div>
                                            <div class="text-content">
                                                <div class="option-title">PayPal</div>
                                                <div class="option-description">Pay using your PayPal account</div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            <button class="primary-btn payment-continue-btn" id="paymentBtn" type="button">
                                Proceed with payment
                            </button>
                            <div id="paypal-button-container" style="display: none; margin-top: 16px;"></div>
                        </div>
                        
                        <div class="checkout-right">
                            <div class="event-preview">
                                <img src="${this.orderData.eventImage}" alt="Event">
                                <div class="event-preview-title">${this.orderData.eventName}</div>
                            </div>
                            
                            <h3 class="order-summary-title">Order summary</h3>
                            
                            <div class="order-item">
                                <span>${this.orderData.quantity} x ${this.orderData.ticketType}</span>
                                <span>$${this.orderData.price.toFixed(2)}</span>
                            </div>
                            
                            <div class="order-total">
                                <span class="order-total-label">Total</span>
                                <span class="order-total-price">$${this.orderData.price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.removeCurrentModal();
        this.addModalToPage(modalHTML);
        this.currentStep = 3;
        
        // Setup payment method switching
        this.setupPaymentMethodSwitching();
    }

    // ===== SETUP PAYMENT METHOD SWITCHING =====
    setupPaymentMethodSwitching() {
        const paymentOptions = document.querySelectorAll('.payment-option');
        const paymentBtn = document.getElementById('paymentBtn');
        const paypalContainer = document.getElementById('paypal-button-container');
        
        let currentMethod = 'card';
        
        // Store reference to class instance
        const self = this;
        
        paymentOptions.forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            const label = option.querySelector('label');
            
            label.addEventListener('click', function(e) {
                e.preventDefault();
                
                paymentOptions.forEach(opt => {
                    opt.querySelector('input[type="radio"]').checked = false;
                });
                
                radio.checked = true;
                const method = radio.id === 'modalCard' ? 'card' : 'paypal';
                currentMethod = method;
                
                if (method === 'card') {
                    paymentBtn.style.display = 'block';
                    paymentBtn.textContent = 'Proceed with payment';
                    if (paypalContainer) paypalContainer.style.display = 'none';
                } else if (method === 'paypal') {
                    paymentBtn.style.display = 'none';
                    if (paypalContainer) {
                        paypalContainer.style.display = 'block';
                        // Use 'self' instead of 'this' to reference the class
                        self.initializePayPalButton();
                    }
                }
                
                console.log('Payment method changed to:', method);
            });
        });
        
        // Card payment button click
        paymentBtn.addEventListener('click', () => {
            if (currentMethod === 'card') {
                this.handlePayment('card');
            }
        });
    }

    // ===== HANDLE BILLING FORM =====
    handleBillingSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const confirmEmail = formData.get('confirmEmail');
        
        if (email !== confirmEmail) {
            alert('Emails do not match');
            return;
        }
        
        this.orderData.firstName = formData.get('firstName');
        this.orderData.lastName = formData.get('lastName');
        this.orderData.email = email;
        
        // Save to sessionStorage for mobile compatibility
        sessionStorage.setItem('buyerEmail', email);
        sessionStorage.setItem('firstName', this.orderData.firstName);
        sessionStorage.setItem('lastName', this.orderData.lastName);
        
        this.showStep3();
    }

    // ===== HANDLE PAYMENT =====
    handlePayment(paymentMethod) {
        console.log('Payment initiated with method:', paymentMethod);
        console.log('Order data:', this.orderData);
        // Normalize ticket type to lowercase
        const ticketType = (this.orderData.ticketType || 'early bird').toLowerCase();
        
        if (paymentMethod === 'paypal') {
            // Save order data to sessionStorage for PayPal page
            sessionStorage.setItem('ticketData', JSON.stringify(this.orderData));
            sessionStorage.setItem('eventName', this.orderData.eventName);
            sessionStorage.setItem('eventDate', this.orderData.eventDate);
            sessionStorage.setItem('ticketType', this.orderData.ticketType);
            sessionStorage.setItem('ticketQuantity', this.orderData.quantity);
            sessionStorage.setItem('ticketPrice', this.orderData.price);
            sessionStorage.setItem('basePrice', this.orderData.basePrice);
            
            // Redirect to PayPal checkout page
            window.location.href = 'paypal-checkout.html';
            
        } else {
            // Stripe payment links
            const stripeLinks = {
                'early bird': 'https://buy.stripe.com/test_eVqdRa2Iz4Po4iwgoX3Ru02',
                'regular': 'https://buy.stripe.com/test_9B67sM3MDepY4iw3Cb3Ru03',
                'vip': 'https://buy.stripe.com/test_fZucN6erhchQ7uI4Gf3Ru04'
            };
            
            const stripeLink = stripeLinks[ticketType];
            
            if (!stripeLink) {
                alert('Stripe payment not configured for this ticket type.');
                return;
            }
            
            window.location.href = stripeLink;
        }
    }

    // QUANTITY CONTROLS
    increaseQuantity() {
        this.orderData.quantity++;
        this.orderData.price = this.orderData.basePrice * this.orderData.quantity;
        document.getElementById('modalQuantity').textContent = this.orderData.quantity;
        this.updateOrderSummary();
    }

    decreaseQuantity() {
        if (this.orderData.quantity > 1) {
            this.orderData.quantity--;
            this.orderData.price = this.orderData.basePrice * this.orderData.quantity;
            document.getElementById('modalQuantity').textContent = this.orderData.quantity;
            this.updateOrderSummary();
        }
    }

    updateOrderSummary() {
        const orderItem = document.querySelector('.order-item span:first-child');
        const orderPrice = document.querySelector('.order-item span:last-child');
        const totalPrice = document.querySelector('.order-total-price');
        const ticketPriceMain = document.querySelector('.ticket-price-main');
        
        if (orderItem) orderItem.textContent = `${this.orderData.quantity} x ${this.orderData.ticketType}`;
        if (orderPrice) orderPrice.textContent = `$${this.orderData.price.toFixed(2)}`;
        if (totalPrice) totalPrice.textContent = `$${this.orderData.price.toFixed(2)}`;
        if (ticketPriceMain) ticketPriceMain.textContent = `$${this.orderData.price.toFixed(2)}`;
    }
    // ===== INITIALIZE PAYPAL BUTTON =====
    initializePayPalButton() {
        const container = document.getElementById('paypal-button-container');
        
        // Clear any existing buttons
        container.innerHTML = '';
        
        // Calculate amount
        const amount = this.orderData.price.toFixed(2);
        
        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        description: `${this.orderData.eventName} - ${this.orderData.ticketType}`,
                        amount: {
                            currency_code: 'AUD',
                            value: amount
                        }
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    alert('Payment successful! Transaction ID: ' + details.id);
                    // Redirect to success page
                    window.location.href = 'success.html';
                });
            },
            onError: (err) => {
                console.error('PayPal error:', err);
                alert('Payment failed. Please try again.');
            }
        }).render('#paypal-button-container');
    }
    // ===== HELPER METHODS =====
    addModalToPage(html) {
        document.body.insertAdjacentHTML('beforeend', html);
        document.body.classList.add('modal-open');
        
        const overlay = document.getElementById('checkoutModal');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });
        
        document.addEventListener('keydown', this.handleEscape);
    }

    removeCurrentModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) modal.remove();
    }

    handleEscape = (e) => {
        if (e.key === 'Escape') this.close();
    }

    close() {
        this.removeCurrentModal();
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', this.handleEscape);
        this.currentStep = 1;
    }
}

// Create global instance
const checkoutFlow = new CheckoutFlow();
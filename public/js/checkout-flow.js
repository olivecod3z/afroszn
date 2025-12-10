// checkout-flow.js - Simple 3-Step Checkout Modal

class CheckoutFlow {
    constructor() {
        this.currentStep = 1;
        this.orderData = {};
    }

    // ===== STEP 1: TICKET SELECTION & ORDER SUMMARY =====
    showStep1(ticketData) {
        this.orderData = ticketData;
        
        const modalHTML = `
            <div class="checkout-modal-overlay" id="checkoutModal">
                <div class="checkout-card">
                    <button class="checkout-close" onclick="checkoutFlow.close()">×</button>
                    
                    <div class="checkout-content step-1">
                        <!-- Left Side -->
                        <div class="checkout-left">
                            <!-- Date Header -->
                            <p class="checkout-date-header">Saturday, November 1 - 12 - 3am WAT</p>
                            
                            <!-- Back Arrow -->
                            <button class="back-arrow" onclick="checkoutFlow.close()">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            
                            <!-- Ticket Selection Card -->
                            <div class="ticket-selection-card">
                                <div class="ticket-selection-header">
                                    <span>General Admission</span>
                                    <div class="quantity-controls-inline">
                                        <button onclick="checkoutFlow.decreaseQuantity()">−</button>
                                        <span id="modalQuantity">${ticketData.quantity}</span>
                                        <button onclick="checkoutFlow.increaseQuantity()">+</button>
                                    </div>
                                </div>
                                
                                <div class="ticket-price-info">
                                    <div class="ticket-price-main">$${ticketData.price.toFixed(2)}</div>
                                    <div class="ticket-remaining">394 remaining</div>
                                    <div class="sales-end">Sales end on Oct 31, 2025</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Right Side -->
                        <div class="checkout-right">
                            <!-- Event Preview -->
                            <div class="event-preview">
                                <img src="${ticketData.eventImage}" alt="${ticketData.eventName}">
                                <div class="event-preview-title">THE CALLOUT<br>SHOW</div>
                            </div>
                            
                            <!-- Order Summary -->
                            <h3 class="order-summary-title">Order summary</h3>
                            
                            <div class="order-item">
                                <span>${ticketData.quantity} x General Admission</span>
                                <span>$${ticketData.price.toFixed(2)}</span>
                            </div>
                            
                            <div class="order-total">
                                <span class="order-total-label">Total</span>
                                <span class="order-total-price">$${ticketData.price.toFixed(2)}</span>
                            </div>
                            
                            <button class="register-btn" onclick="checkoutFlow.showStep2()">
                                Register
                            </button>
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
                        <!-- Left Side -->
                        <div class="checkout-left">
                            <!-- Date Header -->
                            <p class="checkout-date-header">Saturday, November 1 - 12 - 3am WAT</p>
                            
                            <!-- Progress Steps -->
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
                            
                            <!-- Form -->
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
                                
                                <button type="submit" class="checkout-submit-btn">
                                    Confirm and pay
                                </button>
                            </form>
                        </div>
                        
                        <!-- Right Side -->
                        <div class="checkout-right">
                            <div class="event-preview">
                                <img src="${this.orderData.eventImage}" alt="Event">
                                <div class="event-preview-title">THE CALLOUT<br>SHOW</div>
                            </div>
                            
                            <h3 class="order-summary-title">Order summary</h3>
                            
                            <div class="order-item">
                                <span>${this.orderData.quantity} x General Admission</span>
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

    // ===== STEP 3: PAYMENT DETAILS =====
    showStep3() {
        const modalHTML = `
            <div class="checkout-modal-overlay" id="checkoutModal">
                <div class="checkout-card">
                    <button class="checkout-close" onclick="checkoutFlow.close()">×</button>
                    
                    <div class="checkout-content step-3">
                        <!-- Left Side -->
                        <div class="checkout-left">
                            <!-- Date Header -->
                            <p class="checkout-date-header">Saturday, November 1 - 12 - 3am WAT</p>
                            
                            <!-- Progress Steps -->
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
                            
                            <!-- Payment Options -->
                            <h2 class="checkout-heading">2. Payment details</h2>
                            
                            <div class="payment-methods">
                                <button class="payment-method active">
                                    <input type="radio" name="payment" value="card" checked>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                    </svg>
                                    <span>Credit or Debit card</span>
                                </button>
                                
                                <button class="payment-method">
                                    <input type="radio" name="payment" value="gpay">
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                                    </svg>
                                    <span>Google pay</span>
                                </button>
                                
                                <button class="payment-method">
                                    <input type="radio" name="payment" value="applepay">
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                    </svg>
                                    <span>Apple pay</span>
                                </button>
                                
                                <button class="payment-method">
                                    <input type="radio" name="payment" value="paypal">
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506L9.95 7.254a.641.641 0 0 1 .633-.74h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.15.054-.295.077-.437.097.426.14.863.14 1.288 0 1.82-.613 3.398-1.414 4.35z"/>
                                    </svg>
                                    <span>Paypal</span>
                                </button>
                            </div>
                            
                            <!-- Card Form -->
                            <form id="paymentForm" onsubmit="checkoutFlow.handlePayment(event)">
                                <div class="form-group">
                                    <label>Cardholder's name</label>
                                    <input type="text" placeholder="John Doe" required>
                                </div>
                                
                                <div class="form-group">
                                    <label>Card number</label>
                                    <input type="text" placeholder="1234 1234 1234 1234" maxlength="19" required>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Expiration date</label>
                                        <input type="text" placeholder="MM/YY" maxlength="5" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Security code</label>
                                        <input type="text" placeholder="123" maxlength="3" required>
                                    </div>
                                </div>
                                
                                <button type="submit" class="checkout-submit-btn">
                                    Confirm and pay
                                </button>
                            </form>
                        </div>
                        
                        <!-- Right Side -->
                        <div class="checkout-right">
                            <div class="event-preview">
                                <img src="${this.orderData.eventImage}" alt="Event">
                                <div class="event-preview-title">THE CALLOUT<br>SHOW</div>
                            </div>
                            
                            <h3 class="order-summary-title">Order summary</h3>
                            
                            <div class="order-item">
                                <span>${this.orderData.quantity} x General Admission</span>
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
    }

    // ===== HANDLE BILLING FORM SUBMISSION =====
    handleBillingSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const confirmEmail = formData.get('confirmEmail');
        
        // Validate emails match
        if (email !== confirmEmail) {
            alert('Emails do not match');
            return;
        }
        
        // Save billing info
        this.orderData.firstName = formData.get('firstName');
        this.orderData.lastName = formData.get('lastName');
        this.orderData.email = email;
        
        // Move to payment step
        this.showStep3();
    }

    // ===== HANDLE PAYMENT =====
    async handlePayment(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.checkout-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        try {
            // Here you would integrate with Stripe/PayPal
            // For now, we'll simulate it
            console.log('Processing payment with data:', this.orderData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Close modal and show success
            this.close();
            alert('Payment successful! Tickets will be sent to ' + this.orderData.email);
            
            // Redirect to success page or show success modal
            // window.location.href = '/success';
            
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirm and pay';
        }
    }

    // ===== QUANTITY CONTROLS =====
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
        
        if (orderItem) orderItem.textContent = `${this.orderData.quantity} x General Admission`;
        if (orderPrice) orderPrice.textContent = `$${this.orderData.price.toFixed(2)}`;
        if (totalPrice) totalPrice.textContent = `$${this.orderData.price.toFixed(2)}`;
    }

    // ===== HELPER METHODS =====
    addModalToPage(html) {
        document.body.insertAdjacentHTML('beforeend', html);
        document.body.classList.add('modal-open');
        
        // Close on overlay click
        const overlay = document.getElementById('checkoutModal');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', this.handleEscape);
    }

    removeCurrentModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.remove();
        }
    }

    handleEscape = (e) => {
        if (e.key === 'Escape') {
            this.close();
        }
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

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    const getTicketsBtn = document.querySelector('.ticket-btn');
    
    if (getTicketsBtn) {
        getTicketsBtn.addEventListener('click', function() {
            // Get data from ticket card
            const ticketType = document.querySelector('.ticket-type.active')?.textContent.trim() || 'Early bird';
            const quantity = parseInt(document.getElementById('quantityValue')?.textContent) || 1;
            const basePrice = 10; // Price per ticket
            
            checkoutFlow.showStep1({
                eventName: 'The Callout Show',
                eventDate: 'Saturday, November 1 - 12 - 3am WAT',
                eventImage: '../images/event_checkout.png',
                ticketType: ticketType,
                quantity: quantity,
                basePrice: basePrice,
                price: basePrice * quantity
            });
        });
    }
});
// Add checkmark styling for completed steps
const checkmarkStyle = document.createElement('style');
checkmarkStyle.textContent = `
    /* Hide number on completed steps */
    .step.completed .step-number {
        font-size: 0 !important;
    }
    
    /* Show checkmark instead */
    .step.completed .step-number::before {
        content: "✓";
        font-size: 1.5rem;
        font-weight: bold;
        color: inherit;
    }
`;
document.head.appendChild(checkmarkStyle);
// checkout-flow.js - 3-Step Checkout Modal (Mobile & Desktop Ready)

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
                            
                            <button class="register-btn" onclick="checkoutFlow.showStep2()">Register</button>
                        </div>
                        
                        <div class="checkout-right">
                            <div class="event-preview">
                                <img src="${ticketData.eventImage}" alt="Event">
                                <div class="event-preview-title">${ticketData.eventName}</div>
                            </div>
                            
                            <h3 class="order-summary-title">Order summary</h3>
                            
                            <div class="order-item">
                                <span>${ticketData.quantity} x General Admission</span>
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
                                
                                <button type="submit" class="checkout-submit-btn">Confirm and pay</button>
                            </form>
                        </div>
                        
                        <div class="checkout-right">
                            <div class="event-preview">
                                <img src="${this.orderData.eventImage}" alt="Event">
                                <div class="event-preview-title">${this.orderData.eventName}</div>
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
                            
                            <h2 class="checkout-heading section-title">Payment</h2>
                            
                            <div class="payment-methods">
                                <button class="payment-option active" data-method="card" type="button" onclick="checkoutFlow.selectPayment(this, 'card')">
                                    <input type="radio" name="payment" checked>
                                    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="white" stroke-width="2">
                                        <rect x="2" y="4" width="28" height="16" rx="2" ry="2"></rect>
                                        <line x1="2" y1="10" x2="30" y2="10"></line>
                                    </svg>
                                    <span>Credit or Debit card</span>
                                </button>

                                <button class="payment-option" data-method="gpay" type="button" onclick="checkoutFlow.selectPayment(this, 'gpay')">
                                    <input type="radio" name="payment">
                                    <div class="logo-container gpay-split" style="display:flex;align-items:center;">
                                        <svg class="gpay-glyph" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 17" aria-hidden="true">
                                            <path d="M19.526 2.635v4.083h2.518c.6 0 1.096-.202 1.488-.605.403-.402.605-.882.605-1.437 0-.544-.202-1.018-.605-1.422-.392-.413-.888-.62-1.488-.62h-2.518zm0 5.52v4.736h-1.504V1.198h3.99c1.013 0 1.873.337 2.582 1.012.72.675 1.08 1.497 1.08 2.466 0 .991-.36 1.819-1.08 2.482-.697.665-1.559.996-2.583.996h-2.485v.001zm7.668 2.287c0 .392.166.718.499.98.332.26.722.391 1.168.391.633 0 1.196-.234 1.692-.7.497-.469.744-1.019.744-1.65-.469-.37-1.123-.555-1.962-.555-.61 0-1.12.148-1.528.442-.409.294-.613.657-.613 1.092m1.946-5.815c1.112 0 1.989.297 2.633.89.642.594.964 1.408.964 2.442v4.932h-1.439v-1.11h-.065c-.622.914-1.45 1.372-2.486 1.372-.882 0-1.621-.262-2.215-.784-.594-.523-.891-1.176-.891-1.96 0-.828.313-1.486.94-1.976s1.463-.735 2.51-.735c.892 0 1.629.163 2.206.49v-.344c0-.522-.207-.966-.621-1.33a2.132 2.132 0 0 0-1.455-.547c-.84 0-1.504.353-1.995 1.062l-1.324-.834c.73-1.045 1.812-1.568 3.238-1.568m11.853.262l-5.02 11.53H34.42l1.864-4.034-3.302-7.496h1.635l2.387 5.749h.033l2.322-5.75z" fill="#5F6368"/>
                                            <path d="M13.448 7.134c0-.473-.04-.93-.116-1.366H6.988v2.588h3.634a3.11 3.11 0 0 1-1.344 2.042v1.68h2.169c1.27-1.17 2.001-2.9 2.001-4.944" fill="#4285F4"/>
                                            <path d="M6.988 13.7c1.816 0 3.344-.595 4.459-1.621l-2.169-1.681c-.603.406-1.38.643-2.29.643-1.754 0-3.244-1.182-3.776-2.774H.978v1.731a6.728 6.728 0 0 0 6.01 3.703" fill="#34A853"/>
                                            <path d="M3.212 8.267a4.034 4.034 0 0 1 0-2.572V3.964H.978a6.678 6.678 0 0 0 0 6.034l2.234-1.731z" fill="#FABB05"/>
                                            <path d="M6.988 2.921c.992 0 1.88.34 2.58 1.008v.001l1.92-1.918C10.324.928 8.804.262 6.989.262a6.728 6.728 0 0 0-6.01 3.702l2.234 1.731c.532-1.592 2.022-2.774 3.776-2.774" fill="#E94235"/>
                                        </svg>
                                    </div>
                                    <span>Google pay</span>
                                </button>

                                <button class="payment-option" data-method="applepay" type="button" onclick="checkoutFlow.selectPayment(this, 'applepay')">
                                    <input type="radio" name="payment">
                                    <div class="logo-container apple-split" style="display:flex;align-items:center;gap:0px;">
                                        <svg viewBox="0 0 24 24" class="apple-glyph" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="white" role="img">
                                            <title>Apple</title>
                                            <path d="M9.5 3.5c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z"/>
                                            <path d="M10.1 6c-1.4 0-2.5.8-3.2.8s-1.7-.8-2.8-.8c-1.4 0-2.8.9-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2.1.8-1.2 1.1-2.3 1.2-2.4 0 0-2.3-.9-2.3-3.5 0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.7-1.7-3.3-1.7z"/>
                                        </svg>
                                        <span class="apple-pay-text" style="font-family:SF Pro Display,-apple-system,sans-serif;">Pay</span>
                                    </div>
                                    <span>Apple pay</span>
                                </button>

                                <button class="payment-option" data-method="paypal" type="button" onclick="checkoutFlow.selectPayment(this, 'paypal')">
                                    <input type="radio" name="payment">
                                    <div class="logo-container">
                                        <svg width="80" height="22" viewBox="0 0 124 33" fill="none">
                                            <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zm.789 6.405c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.423.468 1.058.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#253B80"/>
                                            <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.013-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.423.467 1.058.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" fill="#179BD7"/>
                                            <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z" fill="#253B80"/>
                                            <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill="#179BD7"/>
                                            <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z" fill="#222D65"/>
                                            <path d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z" fill="#253B80"/>
                                        </svg>
                                    </div>
                                    <span>Paypal</span>
                                </button>
                            </div>
                            
                            <form id="paymentForm" onsubmit="checkoutFlow.handlePayment(event)" style="display: block;" novalidate>
                                <div class="form-group">
                                    <label>Cardholder's name</label>
                                    <input type="text" id="cardholderName" name="cardholderName" required>
                                    <span class="error-message" id="cardholderNameError"></span>
                                </div>
                                
                                <div class="form-group">
                                    <label>Card number</label>
                                    <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
                                    <span class="error-message" id="cardNumberError"></span>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Expiration date</label>
                                        <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" maxlength="5" required>
                                        <span class="error-message" id="expiryDateError"></span>
                                    </div>
                                    <div class="form-group">
                                        <label>CVC</label>
                                        <input type="text" id="cvc" name="cvc" placeholder="123" maxlength="4" required>
                                        <span class="error-message" id="cvcError"></span>
                                    </div>
                                </div>

                                <div class="billing-section">
                                    <h3 class="section-title">Billing address</h3>
                                    
                                    <div class="form-group">
                                        <select class="form-input" id="country" name="country" required>
                                            <option value="">Select country</option>
                                            <option value="au">Australia</option>
                                            <option value="us">United States</option>
                                            <option value="uk">United Kingdom</option>
                                            <option value="ca">Canada</option>
                                        </select>
                                        <span class="error-message" id="countryError"></span>
                                    </div>

                                    <div class="form-group">
                                        <input type="text" class="form-input" id="address" name="address" placeholder="Address" required>
                                        <span class="error-message" id="addressError"></span>
                                    </div>

                                    <div class="address-row">
                                        <div class="form-group-inline">
                                            <input type="text" class="form-input" id="city" name="city" placeholder="City" required>
                                            <span class="error-message" id="cityError"></span>
                                        </div>
                                        <div class="form-group-inline">
                                            <input type="text" class="form-input" id="state" name="state" placeholder="State" required>
                                            <span class="error-message" id="stateError"></span>
                                        </div>
                                        <div class="form-group-inline">
                                            <input type="text" class="form-input" id="zipcode" name="zipcode" placeholder="Zipcode" required>
                                            <span class="error-message" id="zipcodeError"></span>
                                        </div>
                                    </div>

                                    <div class="terms-checkbox">
                                        <input type="checkbox" id="terms" name="terms" required>
                                        <label for="terms">
                                            I understand and accept <a href="#">Afroszn's Services Agreement</a>, which includes the <a href="#">Cancellation and Refund Policy</a>.
                                        </label>
                                    </div>
                                    <span class="error-message" id="termsError"></span>
                                </div>
                                
                                <div id="formGeneralError" class="general-error-message"></div>
                                
                                <button type="submit" class="primary-btn checkout-submit-btn">Confirm and pay</button>
                            </form>

                            <!-- Google Pay Button -->
                            <button class="primary-btn payment-continue-btn" id="gpayBtn" style="display: none;">
                                Continue with Google Pay
                            </button>

                            <!-- Apple Pay Button -->
                            <button class="primary-btn payment-continue-btn" id="applepayBtn" style="display: none;">
                                Continue with Apple Pay
                            </button>

                            <!-- PayPal Button -->
                            <button class="primary-btn payment-continue-btn" id="paypalBtn" style="display: none;">
                                Continue with PayPal
                            </button>
                        </div>
                        
                        <div class="checkout-right">
                            <div class="event-preview">
                                <img src="${this.orderData.eventImage}" alt="Event">
                                <div class="event-preview-title">${this.orderData.eventName}</div>
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
        
        // Add payment method switching functionality after modal is added
        this.setupPaymentMethodSwitching();
    }

    // ===== SETUP PAYMENT METHOD SWITCHING =====
    setupPaymentMethodSwitching() {
        const paymentOptions = document.querySelectorAll('.payment-option');
        const cardForm = document.getElementById('paymentForm');
        const gpayBtn = document.getElementById('gpayBtn');
        const applepayBtn = document.getElementById('applepayBtn');
        const paypalBtn = document.getElementById('paypalBtn');
        
        paymentOptions.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all options
                paymentOptions.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Check the radio button
                this.querySelector('input[type="radio"]').checked = true;
                
                const paymentMethod = this.getAttribute('data-method');
                
                // Hide all payment forms first
                if (cardForm) cardForm.style.display = 'none';
                if (gpayBtn) gpayBtn.style.display = 'none';
                if (applepayBtn) applepayBtn.style.display = 'none';
                if (paypalBtn) paypalBtn.style.display = 'none';
                
                // Show the correct payment form
                if (paymentMethod === 'card' && cardForm) {
                    cardForm.style.display = 'block';
                } else if (paymentMethod === 'gpay' && gpayBtn) {
                    gpayBtn.style.display = 'block';
                } else if (paymentMethod === 'applepay' && applepayBtn) {
                    applepayBtn.style.display = 'block';
                } else if (paymentMethod === 'paypal' && paypalBtn) {
                    paypalBtn.style.display = 'block';
                }
            });
        });

        // Handle payment button clicks for alternative methods
        if (gpayBtn) gpayBtn.addEventListener('click', (e) => this.handlePayment(e));
        if (applepayBtn) applepayBtn.addEventListener('click', (e) => this.handlePayment(e));
        if (paypalBtn) paypalBtn.addEventListener('click', (e) => this.handlePayment(e));
        
        // Auto-format expiration date input
        const expiryInput = document.querySelector('input[placeholder="MM/YY"]');
        if (expiryInput) {
            expiryInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                
                // Add slash after 2 digits
                if (value.length > 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                
                e.target.value = value;
            });
            
            expiryInput.addEventListener('keydown', function(e) {
                // Allow backspace to remove slash cleanly
                if (e.key === 'Backspace') {
                    let val = e.target.value;
                    if (val.endsWith('/')) {
                        e.target.value = val.slice(0, -1);
                    }
                }
            });
        }
        
        // Setup real-time validation for form fields
        this.setupRealTimeValidation();
    }

    // ===== SELECT PAYMENT METHOD =====
    selectPayment(button, method) {
        document.querySelectorAll('.payment-option').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        button.querySelector('input[type="radio"]').checked = true;
        this.orderData.paymentMethod = method;
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
        this.showStep3();
    }

    // ===== VALIDATION HELPERS =====
    validators = {
        cardholderName: (v) => !v || v.trim().length < 3 ? 'Please enter a valid cardholder name' : !/^[a-zA-Z\s]+$/.test(v) ? 'Name should only contain letters' : null,
        
        cardNumber: (v) => {
            const c = v.replace(/\s/g, '');
            if (!c) return 'Card number is required';
            if (c.length < 13 || c.length > 19) return 'Card number must be 13-19 digits';
            if (!/^\d+$/.test(c)) return 'Card number should only contain digits';
            
            // Luhn check
            let sum = 0, even = false;
            for (let i = c.length - 1; i >= 0; i--) {
                let d = parseInt(c[i]);
                if (even && (d *= 2) > 9) d -= 9;
                sum += d;
                even = !even;
            }
            return sum % 10 !== 0 ? 'Invalid card number' : null;
        },
        
        expiryDate: (v) => {
            if (!v) return 'Expiration date is required';
            if (!/^\d{2}\/\d{2}$/.test(v)) return 'Format should be MM/YY';
            const [m, y] = v.split('/').map(Number);
            if (m < 1 || m > 12) return 'Invalid month (01-12)';
            const now = new Date(), cy = now.getFullYear() % 100, cm = now.getMonth() + 1;
            return y < cy || (y === cy && m < cm) ? 'Card has expired' : null;
        },
        
        cvc: (v) => !v ? 'CVC is required' : !/^\d{3,4}$/.test(v) ? 'CVC must be 3 or 4 digits' : null,
        country: (v) => !v ? 'Please select a country' : null,
        address: (v) => !v || v.trim().length < 5 ? 'Please enter a valid address' : null,
        city: (v) => !v || v.trim().length < 2 ? 'Please enter a valid city' : null,
        state: (v) => !v || v.trim().length < 2 ? 'Please enter a valid state' : null,
        zipcode: (v) => !v ? 'Zipcode is required' : v.length < 3 || v.length > 10 ? 'Please enter a valid zipcode' : null
    };

    showFieldError(fieldId, errorMessage) {
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

    clearFieldError(fieldId) {
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

    clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
            msg.style.display = 'none';
        });
        
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
        });
        
        const generalError = document.getElementById('formGeneralError');
        if (generalError) {
            generalError.textContent = '';
            generalError.style.display = 'none';
        }
    }

    validatePaymentForm() {
        this.clearAllErrors();
        let isValid = true;
        let firstErrorField = null;

        // Validate all fields using validators object
        Object.keys(this.validators).forEach(fieldId => {
            const value = document.getElementById(fieldId)?.value || '';
            const error = this.validators[fieldId](value);
            if (error) {
                this.showFieldError(fieldId, error);
                if (!firstErrorField) firstErrorField = document.getElementById(fieldId);
                isValid = false;
            }
        });

        // Validate terms checkbox
        if (!document.getElementById('terms')?.checked) {
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

    setupRealTimeValidation() {
        // Card number
        const cn = document.getElementById('cardNumber');
        if (cn) {
            cn.addEventListener('input', e => e.target.value = e.target.value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || e.target.value);
            cn.addEventListener('blur', () => {
                const err = this.validators.cardNumber(cn.value);
                err ? this.showFieldError('cardNumber', err) : this.clearFieldError('cardNumber');
            });
            cn.addEventListener('focus', () => this.clearFieldError('cardNumber'));
        }

        // CVC
        const cvc = document.getElementById('cvc');
        if (cvc) {
            cvc.addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, ''));
            cvc.addEventListener('blur', () => {
                const err = this.validators.cvc(cvc.value);
                err ? this.showFieldError('cvc', err) : this.clearFieldError('cvc');
            });
            cvc.addEventListener('focus', () => this.clearFieldError('cvc'));
        }

        // Expiry date
        const exp = document.getElementById('expiryDate');
        if (exp) {
            exp.addEventListener('blur', () => {
                const err = this.validators.expiryDate(exp.value);
                err ? this.showFieldError('expiryDate', err) : this.clearFieldError('expiryDate');
            });
            exp.addEventListener('focus', () => this.clearFieldError('expiryDate'));
        }

        // Cardholder name
        const name = document.getElementById('cardholderName');
        if (name) {
            name.addEventListener('blur', () => {
                const err = this.validators.cardholderName(name.value);
                err ? this.showFieldError('cardholderName', err) : this.clearFieldError('cardholderName');
            });
            name.addEventListener('focus', () => this.clearFieldError('cardholderName'));
        }

        // Clear errors on focus for other fields
        ['country', 'address', 'city', 'state', 'zipcode'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.addEventListener('focus', () => this.clearFieldError(fieldId));
        });
    }

    // ===== HANDLE PAYMENT =====
    async handlePayment(e) {
        e.preventDefault();
        
        // If using alternative payment method, skip form validation
        const paymentMethod = this.orderData.paymentMethod || 'card';
        
        if (paymentMethod !== 'card') {
            // Handle alternative payment methods
            const submitBtn = e.target;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
            
            try {
                console.log('Processing payment with:', paymentMethod);
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.close();
                alert('Payment successful! Tickets will be sent to ' + this.orderData.email);
            } catch (error) {
                console.error('Payment error:', error);
                alert('Payment failed. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = e.target.textContent.replace('Processing...', 'Continue with');
            }
            return;
        }
        
        // Validate card payment form
        if (!this.validatePaymentForm()) {
            return;
        }
        
        const submitBtn = document.querySelector('.checkout-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        try {
            console.log('Processing payment:', this.orderData);
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.close();
            alert('Payment successful! Tickets will be sent to ' + this.orderData.email);
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
        const ticketPriceMain = document.querySelector('.ticket-price-main');
        
        if (orderItem) orderItem.textContent = `${this.orderData.quantity} x General Admission`;
        if (orderPrice) orderPrice.textContent = `$${this.orderData.price.toFixed(2)}`;
        if (totalPrice) totalPrice.textContent = `$${this.orderData.price.toFixed(2)}`;
        if (ticketPriceMain) ticketPriceMain.textContent = `$${this.orderData.price.toFixed(2)}`;
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
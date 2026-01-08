// Cart Modal Functionality
class CartModal {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        // Create modal if it doesn't exist
        if (!document.getElementById('cartModal')) {
            this.createModal();
        }
        this.attachEventListeners();
        this.updateCartCount();
    }

    createModal() {
        const modalHTML = `
            <div class="cart-modal-overlay" id="cartModal">
                <div class="cart-modal">
                    <button class="cart-modal-close" id="closeCartModal">&times;</button>
                    
                    <div class="cart-success-message" id="cartSuccessMessage" style="display: none;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <p>It's in the cart! Wait hold it for one hour</p>
                    </div>

                    <h2 class="cart-modal-title">My Cart</h2>

                    <div id="cartItemsContainer"></div>

                    <div class="cart-summary" id="cartSummary" style="display: none;">
                        <div class="cart-summary-row">
                            <span class="cart-summary-label">Subtotal</span>
                            <span class="cart-summary-value" id="cartSubtotal">$0.00</span>
                        </div>
                    </div>

                    <div class="cart-actions" id="cartActions" style="display: none;">
                        <button class="cart-btn cart-btn-continue" id="continueShoppingBtn">My bag</button>
                        <button class="cart-btn cart-btn-checkout" id="checkoutBtn">Checkout</button>
                    </div>

                    <div class="cart-empty" id="cartEmpty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <h3>Your cart is empty</h3>
                        <p>Add some items to get started</p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    attachEventListeners() {
        // Close modal
        const closeBtn = document.getElementById('closeCartModal');
        const overlay = document.getElementById('cartModal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeModal();
                }
            });
        }

        // Continue shopping button
        const continueBtn = document.getElementById('continueShoppingBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                window.location.href = 'checkout.html';
            });
        }

        // Cart icon click
        const cartIcon = document.querySelector('.nav-cart a');
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        }
    }

    openModal(showSuccess = false) {
        const modal = document.getElementById('cartModal');
        const successMsg = document.getElementById('cartSuccessMessage');
        
        if (modal) {
            this.renderCart();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (showSuccess && successMsg) {
                successMsg.style.display = 'flex';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 3000);
            }
        }
    }

    closeModal() {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    addToCart(item) {
        const existingItem = this.cart.find(
            cartItem => 
                cartItem.id === item.id && 
                cartItem.color === item.color && 
                cartItem.size === item.size
        );

        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.cart.push({
                ...item,
                quantity: item.quantity || 1
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.openModal(true);
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(index);
        } else {
            this.cart[index].quantity = quantity;
            this.saveCart();
            this.renderCart();
        }
    }

    renderCart() {
        const container = document.getElementById('cartItemsContainer');
        const emptyState = document.getElementById('cartEmpty');
        const summary = document.getElementById('cartSummary');
        const actions = document.getElementById('cartActions');

        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            summary.style.display = 'none';
            actions.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        summary.style.display = 'block';
        actions.style.display = 'flex';

        container.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="cart-item-options">
                                <span class="cart-item-option">${item.color}</span>
                                <span class="cart-item-option"><span>${item.size}</span></span>
                            </div>
                        </div>
                        <button class="cart-item-remove" onclick="cartModal.removeFromCart(${index})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="cart-item-footer">
                        <div class="cart-item-quantity">
                            <span>Qty</span>
                            <input 
                                type="number" 
                                min="1" 
                                value="${item.quantity}" 
                                onchange="cartModal.updateQuantity(${index}, parseInt(this.value))"
                            >
                        </div>
                        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateSummary();
    }

    updateSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const subtotalElement = document.getElementById('cartSubtotal');
        
        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }
    }

    updateCartCount() {
        const cartIcon = document.querySelector('.nav-cart');
        if (!cartIcon) return;

        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Remove existing badge
        const existingBadge = cartIcon.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Add badge if count > 0
        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = count;
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(badge);
        }
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('afroszn_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveCart() {
        localStorage.setItem('afroszn_cart', JSON.stringify(this.cart));
    }

    getCart() {
        return this.cart;
    }
}

// Initialize cart modal when DOM is ready
let cartModal;
document.addEventListener('DOMContentLoaded', () => {
    cartModal = new CartModal();
});
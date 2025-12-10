// Ticket Card Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== TICKET TYPE SWITCHING =====
    const ticketTypes = document.querySelectorAll('.ticket-type');
    const ticketPriceElement = document.querySelector('.ticket-price');
    const ticketNoteElement = document.querySelector('.ticket-note');
    
    // Ticket pricing and descriptions
    const ticketData = {
        'early bird': {
            price: 25,
            note: 'Limited early access tickets with exclusive perks and priority entry'
        },
        'regular': {
            price: 30,
            note: 'Standard admission with full access to all event areas and activities'
        },
        'vip': {
            price: 40,
            note: 'Premium VIP experience with exclusive lounge access, priority entry, and special perks'
        }
    };
    
    let currentTicketType = 'early bird';
    let currentPrice = 25;
    
    // Handle ticket type button clicks
    ticketTypes.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            ticketTypes.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get ticket type (convert to lowercase for matching)
            currentTicketType = this.textContent.trim().toLowerCase();
            
            // Update price and note
            if (ticketData[currentTicketType]) {
                currentPrice = ticketData[currentTicketType].price;
                updatePriceDisplay();
                ticketNoteElement.textContent = ticketData[currentTicketType].note;
            }
        });
    });
    
    // ===== QUANTITY COUNTER =====
    let quantity = 1;
    const minQty = 1;
    const maxQty = 10;
    
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityValue = document.getElementById('quantityValue');
    
    // Update quantity function
    function updateQuantity(change) {
        const newQuantity = quantity + change;
        
        // Check boundaries
        if (newQuantity >= minQty && newQuantity <= maxQty) {
            quantity = newQuantity;
            quantityValue.textContent = quantity;
            
            // Update price display
            updatePriceDisplay();
            
            // Update button states
            decreaseBtn.disabled = quantity <= minQty;
            increaseBtn.disabled = quantity >= maxQty;
        }
    }
    
    // Attach event listeners to quantity buttons
    if (decreaseBtn && increaseBtn) {
        decreaseBtn.addEventListener('click', () => updateQuantity(-1));
        increaseBtn.addEventListener('click', () => updateQuantity(1));
        
        // Initialize decrease button as disabled
        decreaseBtn.disabled = true;
    }
    
    // ===== UPDATE PRICE DISPLAY =====
    function updatePriceDisplay() {
        const totalPrice = currentPrice * quantity;
        
        if (ticketPriceElement) {
            // Update the price, keeping the /person text
            ticketPriceElement.innerHTML = `$${totalPrice} <span>/person</span>`;
            
            // If quantity > 1, show total breakdown
            if (quantity > 1) {
                ticketPriceElement.innerHTML = `$${totalPrice} <span>($${currentPrice} × ${quantity})</span>`;
            }
        }
    }
    
    // ===== GET TICKETS BUTTON =====
    const getTicketsBtn = document.querySelector('.ticket-btn');
    
    if (getTicketsBtn) {
        getTicketsBtn.addEventListener('click', function() {
            // Prepare ticket order data
            const orderData = {
                ticketType: currentTicketType,
                quantity: quantity,
                pricePerTicket: currentPrice,
                totalPrice: currentPrice * quantity
            };
            
            // Log order data (you can replace this with actual checkout logic)
            console.log('Order Details:', orderData);
            
            // Show confirmation (replace with your actual checkout flow)
            alert(`Adding ${quantity} ${currentTicketType} ticket(s) to cart\nTotal: $${orderData.totalPrice}`);
            
            // Here you would typically:
            // 1. Add to cart
            // 2. Navigate to checkout
            // 3. Send data to backend
        });
    }
    
    // Initialize price display
    updatePriceDisplay();
});
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
            // If quantity = 1, show simple price
            if (quantity === 1) {
                ticketPriceElement.innerHTML = `$${totalPrice} <span>/person</span>`;
            } 
            // If quantity > 1, show total breakdown
            else {
                ticketPriceElement.innerHTML = `$${totalPrice} <span>($${currentPrice} × ${quantity})</span>`;
            }
        }
    }
    
    // Format ticket type for display
    function formatTicketType(type) {
        return type.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    // ===== GET TICKETS BUTTON - MOBILE vs DESKTOP =====
    const getTicketsBtn = document.querySelector('.ticket-btn');
    
    if (getTicketsBtn) {
        getTicketsBtn.addEventListener('click', function() {
            // Prepare complete ticket order data
            const orderData = {
                eventName: 'AFRO SEASON VOLUME 4',
                eventDate: 'Friday, October 2025, 10:00pm ACST',
                eventImage: 'images/event_checkout.png',
                ticketType: formatTicketType(currentTicketType),
                quantity: quantity,
                basePrice: currentPrice,
                price: currentPrice * quantity
            };
            
            // Check screen size
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // MOBILE: Save complete data as single object for consistency
                sessionStorage.setItem('ticketData', JSON.stringify(orderData));
                
                // Also save individual items for backward compatibility
                sessionStorage.setItem('ticketType', formatTicketType(currentTicketType));
                sessionStorage.setItem('ticketQuantity', quantity);
                sessionStorage.setItem('ticketPrice', currentPrice * quantity);
                sessionStorage.setItem('basePrice', currentPrice);
                sessionStorage.setItem('eventName', orderData.eventName);
                sessionStorage.setItem('eventDate', orderData.eventDate);
                
                // Navigate to checkout
                window.location.href = 'checkout1.html';
            } else {
                // DESKTOP: Open modal
                if (typeof checkoutFlow !== 'undefined') {
                    checkoutFlow.showStep1(orderData);
                } else {
                    console.error('Checkout flow not loaded');
                    // Fallback: save to session and redirect
                    sessionStorage.setItem('ticketData', JSON.stringify(orderData));
                    window.location.href = 'checkout1.html';
                }
            }
        });
    }
    
    // Initialize price display
    updatePriceDisplay();
    
    // Log ticket data for debugging (remove in production)
    console.log('Ticket card initialized:', {
        currentType: currentTicketType,
        currentPrice: currentPrice,
        quantity: quantity
    });
});
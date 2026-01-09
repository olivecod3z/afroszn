// Ticket Card Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== HARDCODED EVENT DATA (temporary until Firebase is set up) =====
    const eventData = {
        eventId: 'event_001',
        eventName: 'AFRO SEASON VOLUME 4',
        eventDate: 'Friday, October 2025, 10:00pm ACST',
        eventImage: 'images/event_checkout.png',
        ticketTypes: [
            {
                name: 'Early Bird',
                price: 25,
                description: 'Limited early access tickets with exclusive perks and priority entry'
            },
            {
                name: 'Regular',
                price: 30,
                description: 'Standard admission with full access to all event areas and activities'
            },
            {
                name: 'VIP',
                price: 40,
                description: 'Premium VIP experience with exclusive lounge access, priority entry, and special perks'
            }
        ]
    };
    
    // ===== TICKET TYPE SWITCHING =====
    const ticketTypes = document.querySelectorAll('.ticket-type');
    const ticketPriceElement = document.querySelector('.ticket-price');
    const ticketNoteElement = document.querySelector('.ticket-note');
    
    // Build ticket data
    const ticketData = {};
    eventData.ticketTypes.forEach(ticket => {
        const key = ticket.name.toLowerCase();
        ticketData[key] = {
            price: ticket.price,
            note: ticket.description
        };
    });
    
    let currentTicketType = 'early bird';
    let currentPrice = ticketData[currentTicketType].price;
    
    // Handle ticket type button clicks
    ticketTypes.forEach(button => {
        button.addEventListener('click', function() {
            ticketTypes.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentTicketType = this.textContent.trim().toLowerCase();
            
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
    
    function updateQuantity(change) {
        const newQuantity = quantity + change;
        
        if (newQuantity >= minQty && newQuantity <= maxQty) {
            quantity = newQuantity;
            quantityValue.textContent = quantity;
            updatePriceDisplay();
            
            decreaseBtn.disabled = quantity <= minQty;
            increaseBtn.disabled = quantity >= maxQty;
        }
    }
    
    if (decreaseBtn && increaseBtn) {
        decreaseBtn.addEventListener('click', () => updateQuantity(-1));
        increaseBtn.addEventListener('click', () => updateQuantity(1));
        decreaseBtn.disabled = true;
    }
    
    // ===== UPDATE PRICE DISPLAY =====
    function updatePriceDisplay() {
        const totalPrice = currentPrice * quantity;
        
        if (ticketPriceElement) {
            if (quantity === 1) {
                ticketPriceElement.innerHTML = `$${totalPrice} <span>/person</span>`;
            } else {
                ticketPriceElement.innerHTML = `$${totalPrice} <span>($${currentPrice} × ${quantity})</span>`;
            }
        }
    }
    
    function formatTicketType(type) {
        return type.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    // ===== GET TICKETS BUTTON =====
    const getTicketsBtn = document.querySelector('.ticket-btn');
    
    if (getTicketsBtn) {
        getTicketsBtn.addEventListener('click', function() {
            const orderData = {
                eventId: eventData.eventId,
                eventName: eventData.eventName,
                eventDate: eventData.eventDate,
                eventImage: eventData.eventImage,
                ticketType: formatTicketType(currentTicketType),
                quantity: quantity,
                basePrice: currentPrice,
                price: currentPrice * quantity
            };
            
            console.log('Order data:', orderData); // Debug log
            
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // Save to sessionStorage
                sessionStorage.setItem('ticketData', JSON.stringify(orderData));
                sessionStorage.setItem('ticketType', formatTicketType(currentTicketType));
                sessionStorage.setItem('ticketQuantity', quantity);
                sessionStorage.setItem('ticketPrice', currentPrice * quantity);
                sessionStorage.setItem('basePrice', currentPrice);
                sessionStorage.setItem('eventName', orderData.eventName);
                sessionStorage.setItem('eventDate', orderData.eventDate);
                sessionStorage.setItem('eventId', orderData.eventId);
                
                console.log('Redirecting to mobile checkout...'); // Debug log
                window.location.href = 'checkout1.html';
            } else {
                // Desktop modal
                if (typeof checkoutFlow !== 'undefined') {
                    console.log('Opening desktop checkout modal...'); // Debug log
                    checkoutFlow.showStep1(orderData);
                } else {
                    console.error('Checkout flow not loaded');
                    // Fallback to mobile flow
                    sessionStorage.setItem('ticketData', JSON.stringify(orderData));
                    window.location.href = 'checkout1.html';
                }
            }
        });
    }
    
    // Initialize
    updatePriceDisplay();
    
    console.log('Ticket card initialized successfully!', {
        currentTicketType,
        currentPrice,
        quantity
    });
});
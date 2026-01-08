document.addEventListener('DOMContentLoaded', () => {
    // Gallery functionality
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    const prevBtn = document.querySelector('.gallery-nav.prev');
    const nextBtn = document.querySelector('.gallery-nav.next');

    let currentImageIndex = 0;
    const images = Array.from(thumbnails).map(thumb => thumb.dataset.image);

    // Thumbnail click
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentImageIndex = index;
            updateMainImage();
            updateActiveThumbnail();
        });
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateMainImage();
        updateActiveThumbnail();
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateMainImage();
        updateActiveThumbnail();
    });

    function updateMainImage() {
        mainImage.src = images[currentImageIndex];
    }

    function updateActiveThumbnail() {
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentImageIndex);
        });
    }

    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    const selectedColorText = document.getElementById('selectedColor');

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedColorText.textContent = option.dataset.color;
        });
    });

    // Size selection
    const sizeOptions = document.querySelectorAll('.size-option');
    const selectedSizeText = document.getElementById('selectedSize');

    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedSizeText.textContent = option.dataset.size;
        });
    });

    // Buy Now button
    const buyNowBtn = document.querySelector('.btn-buy-now');
    buyNowBtn.addEventListener('click', () => {
        // Get selected options
        const selectedColor = document.querySelector('.color-option.active').dataset.color;
        const selectedSize = document.querySelector('.size-option.active').dataset.size;
        
        console.log('Buy Now clicked:', {
            product: 'Afroszn Classic Logo Cap',
            color: selectedColor,
            size: selectedSize,
            price: '$10'
        });

        // You can add checkout logic here
        alert(`Proceeding to checkout:\nProduct: Afroszn Classic Logo Cap\nColor: ${selectedColor}\nSize: ${selectedSize}\nPrice: $10`);
    });

    // Add to Cart button
    const addToCartBtn = document.querySelector('.btn-add-cart');
    addToCartBtn.addEventListener('click', () => {
        // Get selected options
        const selectedColor = document.querySelector('.color-option.active').dataset.color;
        const selectedSize = document.querySelector('.size-option.active').dataset.size;
        
        // Create cart item
        const cartItem = {
            id: 'cap-001',
            name: 'Afroszn classic cap',
            color: selectedColor,
            size: selectedSize,
            price: 10.00,
            image: '../images/merch3.jpg',
            quantity: 1
        };

        // Add to cart using cart modal
        if (window.cartModal) {
            window.cartModal.addToCart(cartItem);
        }

        // Visual feedback
        addToCartBtn.textContent = 'Added! ✓';
        addToCartBtn.style.background = '#28a745';
        addToCartBtn.style.borderColor = '#28a745';
        
        setTimeout(() => {
            addToCartBtn.textContent = 'Add to cart';
            addToCartBtn.style.background = 'transparent';
            addToCartBtn.style.borderColor = '#9AA4B236';
        }, 2000);
    });
});
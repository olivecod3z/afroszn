document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded');

    // ==================== MOBILE MENU ====================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // ==================== VIDEO CAROUSEL ====================
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const playPauseBtn = document.getElementById('playPauseBtn');

    console.log('Found slides:', slides.length);
    console.log('Found indicators:', indicators.length);

    if (slides.length === 0) {
        console.log('No carousel on this page');
        return;
    }

    let currentSlide = 0;
    let isPlaying = true;
    let autoPlayInterval = null;

    // Get current video element
    function getCurrentVideo() {
        return slides[currentSlide].querySelector('video');
    }

    // Show a specific slide
    function showSlide(index) {
        console.log('Showing slide:', index);

        // Hide all slides and pause all videos
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            const video = slide.querySelector('video');
            if (video) {
                video.pause();
            }
        });

        // Remove active from all indicators
        indicators.forEach(ind => {
            ind.classList.remove('active');
        });

        // Show current slide
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');

        // Play current video
        const video = getCurrentVideo();
        if (video && isPlaying) {
            video.play().catch(err => {
                console.log('Video play error:', err);
            });
        }
    }

    // Go to next slide
    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        console.log('Next slide:', next);
        showSlide(next);
    }

    // Start automatic slideshow
    function startAutoPlay() {
        // Clear any existing interval first
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
        
        console.log('Starting autoplay');
        autoPlayInterval = setInterval(() => {
            console.log('Auto-switching slide');
            nextSlide();
        }, 5000);
    }

    // Stop automatic slideshow
    function stopAutoPlay() {
        if (autoPlayInterval) {
            console.log('Stopping autoplay');
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // Indicator dots click handler
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            console.log('Indicator clicked:', index);
            stopAutoPlay();
            showSlide(index);
            if (isPlaying) {
                startAutoPlay();
            }
        });
    });

    // Play/Pause button handler
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            const video = getCurrentVideo();
            
            if (isPlaying) {
                // Pause
                video.pause();
                stopAutoPlay();
                playPauseBtn.textContent = '▶ PLAY VIDEO';
                isPlaying = false;
                console.log('Paused');
            } else {
                // Play
                video.play();
                startAutoPlay();
                playPauseBtn.textContent = '⏸ PAUSE VIDEO';
                isPlaying = true;
                console.log('Playing');
            }
        });
    }

    // NO HOVER PAUSE - Just continuous autoplay

    // Initialize: start with first slide
    console.log('Initializing carousel');
    showSlide(0);
    startAutoPlay();
});
/* ============================
   MAIN INITIALIZATION
============================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Script loaded');

  /* ============================
     MOBILE MENU
  ============================= */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  /* ============================
     VIDEO CAROUSEL
  ============================= */
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const indicators = Array.from(document.querySelectorAll('.indicator'));
  const playPauseBtn = document.getElementById('playPauseBtn');

  if (slides.length > 0) {
    let currentSlide = 0;
    let isPlaying = true;
    let autoPlayInterval = null;

    function safePlay(video) {
      if (!video) return;
      try { video.play().catch(()=>{}); } catch(e) {}
    }
    function safePause(video) {
      if (!video) return;
      try { video.pause(); } catch(e) {}
    }

    function getVideo() {
      return slides[currentSlide]?.querySelector('video') || null;
    }

    function showSlide(index) {
      if (index < 0 || index >= slides.length) return;

      slides.forEach(s => {
        s.classList.remove('active','prev');
        safePause(s.querySelector('video'));
      });
      indicators.forEach(i => i.classList.remove('active'));

      slides[currentSlide].classList.add('prev');
      currentSlide = index;

      slides[currentSlide].classList.add('active');
      if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');

      const video = getVideo();
      if (video && isPlaying) safePlay(video);
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % slides.length);
    }

    function startAuto() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAuto() {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }

    indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => {
        stopAuto();
        showSlide(i);
        if (isPlaying) startAuto();
      });
    });

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        const video = getVideo();
        if (isPlaying) {
          safePause(video);
          stopAuto();
          playPauseBtn.textContent = "▶ PLAY VIDEO";
          isPlaying = false;
        } else {
          safePlay(video);
          startAuto();
          playPauseBtn.textContent = "⏸ PAUSE VIDEO";
          isPlaying = true;
        }
      });
    }

    showSlide(0);
    startAuto();
  }

  /* ============================
     PARALLAX (Disabled)
  ============================= */
  console.log("Parallax disabled – hero stays fixed.");
});
/* ============================
   MOBILE TESTIMONIAL DECK ADAPTER
============================ */
(function () {
  const MOBILE_BREAK = 480;
  let deckInitialized = false;
  let original = null;

  function initDeck() {
    if (deckInitialized) return;

    const container = document.querySelector('.testimonials-container');
    if (!container) return;

    const top = container.querySelector('.testimonials-row-left');
    const bottom = container.querySelector('.testimonials-row-right');

    const cards = [
      ...top.querySelectorAll('.testimonial-card'),
      ...bottom.querySelectorAll('.testimonial-card')
    ];

    original = {
      top: top.innerHTML,
      bottom: bottom.innerHTML
    };

    const stackSection = document.createElement('section');
    stackSection.className = "testimonials-stack";

    const deck = document.createElement('div');
    deck.id = "testimonialDeck";
    deck.className = "deck";
    stackSection.appendChild(deck);

    cards.forEach(c => deck.appendChild(c));

    const controls = document.createElement('div');
    controls.className = "deck-controls";
    controls.innerHTML = `
      <button id="prevCard">‹</button>
      <div id="deckDots" class="dots"></div>
      <button id="nextCard">›</button>
    `;
    stackSection.appendChild(controls);

    container.parentNode.insertBefore(stackSection, container);

    top.style.display = "none";
    bottom.style.display = "none";

    initDeckBehavior(deck);
    deckInitialized = true;
  }

  function destroyDeck() {
    if (!deckInitialized) return;

    const container = document.querySelector('.testimonials-container');
    const top = container.querySelector('.testimonials-row-left');
    const bottom = container.querySelector('.testimonials-row-right');

    top.innerHTML = original.top;
    bottom.innerHTML = original.bottom;

    const stack = document.querySelector('.testimonials-stack');
    if (stack) stack.remove();

    destroyDeckBehavior();
    deckInitialized = false;
  }

  function check() {
    if (window.innerWidth <= MOBILE_BREAK) initDeck();
    else destroyDeck();
  }

  document.addEventListener('DOMContentLoaded', () => {
    check();
    window.addEventListener('resize', () => {
      clearTimeout(window._deckTimer);
      window._deckTimer = setTimeout(check, 120);
    });
  });
})();
/* ============================
   DECK BEHAVIOR ENGINE
============================ */
(function () {
  let cards = [];
  let index = 0;
  let timer = null;
  const visible = 3;
  const autoMs = 4200;

  function layout() {
    cards.forEach((c, i) => {
      const pos = (i - index + cards.length) % cards.length;
      c.dataset.pos = pos < visible ? pos : "off";
    });
    updateDots();
  }

  function next() { index = (index + 1) % cards.length; layout(); }
  function prev() { index = (index - 1 + cards.length) % cards.length; layout(); }

  function startAuto() { stopAuto(); timer = setInterval(next, autoMs); }
  function stopAuto() { if (timer) clearInterval(timer); timer = null; }

  function updateDots() {
    const wrap = document.getElementById('deckDots');
    if (!wrap) return;

    if (wrap.children.length !== cards.length) {
      wrap.innerHTML = "";
      cards.forEach((_, i) => {
        const b = document.createElement('button');
        b.addEventListener('click',()=>{ index=i; layout(); stopAuto(); startAuto(); });
        wrap.appendChild(b);
      });
    }

    [...wrap.children].forEach((btn,i)=> btn.classList.toggle('active', i===index));
  }

  window.initDeckBehavior = function(deckRoot) {
    cards = [...deckRoot.querySelectorAll('.testimonial-card')];
    if (!cards.length) return;

    const prevBtn = document.getElementById("prevCard");
    const nextBtn = document.getElementById("nextCard");

    prevBtn?.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
    nextBtn?.addEventListener('click', () => { next(); stopAuto(); startAuto(); });

    layout();
    startAuto();
  };

  window.destroyDeckBehavior = function() {
    stopAuto();
    cards = [];
  };
})();

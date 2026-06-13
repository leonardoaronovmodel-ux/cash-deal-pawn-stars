import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Lenis Smooth Scroll Setup
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 1,
});

let scrollVelocity = 0;
let lastVelocity = 0;

lenis.on('scroll', (e) => {
  scrollVelocity = e.velocity;
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Helper: Preload Images
async function preloadImages(urls) {
  return Promise.all(
    urls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
      });
    })
  );
}

// Hero Animations
function initHeroAnimations() {
  try {
    const heroVideo = document.querySelector('.bg-video');
    const heroTitle = document.querySelector('.hero-title');
    const heroRolex = document.querySelector('.hero-rolex');
    const heroContent = document.querySelector('.hero-content');

    if (heroVideo) {
  heroVideo.style.opacity = 0;

  heroVideo.addEventListener('playing', () => {
    gsap.to(heroVideo, {
      opacity: 0.4,
      duration: 1,
      ease: 'power2.out',
    });
  });

  heroVideo.play().catch(() => {});
}

    if (heroTitle) {
      const lines = heroTitle.querySelectorAll('.hero-line');
      gsap.from(lines, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        delay: 0.8,
      });
    }

    if (heroRolex) {
      gsap.from(heroRolex, {
        opacity: 0,
        scale: 0.8,
        rotate: -10,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.5,
      });

      // Scroll rotation
      ScrollTrigger.create({
        trigger: '.hero',
        onUpdate: (self) => {
          gsap.to(heroRolex, {
            rotate: self.getVelocity() * 0.1,
            duration: 0.3,
            overwrite: 'auto',
          });
        },
      });
    }

    // Featured section parallax on hero scroll
    ScrollTrigger.create({
      trigger: '.hero',
      onUpdate: (self) => {
        const progress = self.progress;
        if (heroContent) {
          gsap.to(heroContent, {
            y: progress * 100,
            opacity: 1 - progress * 0.5,
            overwrite: 'auto',
          });
        }
      },
    });
  } catch (error) {
    console.error('Error in initHeroAnimations:', error);
  }
}

// Featured Collateral Animations
function initFeaturedAnimations() {
  try {
    const featuredItems = document.querySelectorAll('.featured-render');

    featuredItems.forEach((item, index) => {
      // Floating animation already in CSS, add scroll parallax
      ScrollTrigger.create({
        trigger: '.featured-collateral',
        start: 'top center',
        onUpdate: (self) => {
          const yOffset = self.progress * 50;
          gsap.to(item, {
            y: -yOffset,
            rotate: self.progress * 5,
            overwrite: 'auto',
          });
        },
      });
    });

    // Background animation
    const featuredBg = document.querySelector('.featured-bg');
    if (featuredBg) {
      ScrollTrigger.create({
        trigger: '.featured-collateral',
        start: 'top center',
        onUpdate: (self) => {
          const rotation = self.progress * 10;
          gsap.to(featuredBg, {
            backgroundPosition: `${rotation}% 0%`,
            overwrite: 'auto',
          });
        },
      });
    }
  } catch (error) {
    console.error('Error in initFeaturedAnimations:', error);
  }
}

// Inventory Animations
function initInventoryAnimations() {
  try {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const showcaseItems = document.querySelectorAll('.showcase-item');

    function showCategory(category) {
      categoryBtns.forEach((b) => b.classList.remove('active'));
      showcaseItems.forEach((item) => item.classList.remove('active'));

      document.querySelector(`[data-category="${category}"].category-btn`).classList.add('active');
      showcaseItems.forEach((item) => {
        if (item.dataset.category === category) {
          item.classList.add('active');
        }
      });
    }

    // Initialize with watches
    showCategory('watches');

    categoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        showCategory(btn.dataset.category);
      });
    });

    // Background animation
    const inventoryBg = document.querySelector('.inventory-bg');
    if (inventoryBg) {
      ScrollTrigger.create({
        trigger: '.inventory',
        start: 'top center',
        onUpdate: (self) => {
          const brightness = 0.8 + self.progress * 0.3;
          gsap.to(inventoryBg, {
            opacity: brightness,
            overwrite: 'auto',
          });
        },
      });
    }
  } catch (error) {
    console.error('Error in initInventoryAnimations:', error);
  }
}

// Art of the Deal Gallery Animations
function initArtOfDealAnimations() {
  try {
    const dealCards = document.querySelectorAll('.deal-card');

    dealCards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top center',
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(card, {
            opacity: Math.max(0.5, 1 - (1 - progress) * 0.5),
            overwrite: 'auto',
          });
        },
      });
    });
  } catch (error) {
    console.error('Error in initArtOfDealAnimations:', error);
  }
}

// Navigation Scroll Hide/Show
function initNavScroll() {
  try {
    const nav = document.querySelector('.nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const isScrollingDown = scrollTop > lastScrollTop;

      if (isScrollingDown && scrollTop > 200) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  } catch (error) {
    console.error('Error in initNavScroll:', error);
  }
}

// Offer Modal
function initOfferModal() {
  try {
    const modal = document.getElementById('offer-modal');
    const openBtns = document.querySelectorAll('.open-offer-modal');
    const closeBtns = document.querySelectorAll('.close-offer-modal');
    const form = document.querySelector('.offer-form');

    openBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
      });
    });

    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        // Formspree handles form submission
      });
    }
  } catch (error) {
    console.error('Error in initOfferModal:', error);
  }
}

// Init All Animations on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimations();
  initFeaturedAnimations();
  initInventoryAnimations();
  initArtOfDealAnimations();
  initNavScroll();
  initOfferModal();

  // Refresh ScrollTrigger after all content loads
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);
});

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

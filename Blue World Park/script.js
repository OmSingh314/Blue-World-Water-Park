// Utility functions
const isMobile = () => window.innerWidth <= 768;
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// DOM Elements
const elements = {
  cursor: document.querySelector("#cursor"),
  cursorBlur: document.querySelector("#cursor-blur"),
  menuToggle: document.querySelector('.menu-toggle'),
  navItems: document.querySelector('.nav-items'),
  dropdowns: document.querySelectorAll('.dropdown'),
  video: document.querySelector("video")
};

// Wait for GSAP to be fully loaded
function waitForGSAP() {
  return new Promise((resolve) => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      resolve();
    } else {
      const checkInterval = setInterval(() => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    }
  });
}

// Mobile Menu Toggle
function setupMobileMenu() {
  if (elements.menuToggle && elements.navItems) {
    elements.menuToggle.addEventListener('click', () => {
      const isOpen = elements.navItems.classList.contains('active');
      
      // Toggle menu
      elements.navItems.classList.toggle('active');
      document.body.style.overflow = isOpen ? '' : 'hidden';
      
      // Update toggle icon
      elements.menuToggle.innerHTML = isOpen 
        ? '<i class="ri-menu-line"></i>' 
        : '<i class="ri-close-line"></i>';
    });

    // Close menu when clicking links (mobile)
    document.querySelectorAll('.nav-items a').forEach(item => {
      item.addEventListener('click', () => {
        if (isMobile()) {
          elements.navItems.classList.remove('active');
          elements.menuToggle.innerHTML = '<i class="ri-menu-line"></i>';
          document.body.style.overflow = '';
        }
      });
    });
  }
}

// Dropdown Menus
function setupDropdowns() {
  elements.dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropbtn');
    const content = dropdown.querySelector('.dropdown-content');

    if (isMobile()) {
      // Mobile behavior - click to open
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      });
    } else {
      // Desktop behavior - hover to open
      dropdown.addEventListener('mouseenter', () => {
        content.style.display = 'block';
      });
      dropdown.addEventListener('mouseleave', () => {
        content.style.display = 'none';
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (isMobile() && !e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
      });
    }
  });
}

// Scroll Animations with Intersection Observer
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  // Observe cards and other elements
  document.querySelectorAll('.card, #about-us, #about-us img, #about-us-in').forEach(el => {
    observer.observe(el);
  });
}

// GSAP Animations
function setupAnimations() {
  // Only proceed if GSAP and ScrollTrigger are available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not available - skipping animations');
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Navbar background change - immediate black on scroll
  const nav = document.querySelector("#nav");
  if (nav) {
    gsap.to(nav, {
      backgroundColor: "#000",
      duration: 0.3,
      scrollTrigger: {
        trigger: "body",
        start: "10px top", // Changed from 40px to 10px for earlier trigger
        end: "100px top",
        toggleActions: "play none none reverse" // Immediate change on scroll down
      }
    });
  }

  // About section animation - more prominent effect
  const aboutUs = document.querySelector("#about-us");
  if (aboutUs) {
    gsap.from("#about-us", {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: "#about-us",
        start: "top 80%", // Changed from 70% to 80% for earlier trigger
        end: "top 50%",
        scrub: 1
      }
    });

    gsap.from("#about-us img, #about-us-in", {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: "#about-us",
        start: "top 70%",
        end: "top 50%",
        scrub: 1
      }
    });
  }

  // Video fade out
  if (elements.video) {
    gsap.to(elements.video, {
      opacity: 0,
      scrollTrigger: {
        trigger: "#page1",
        start: "bottom center",
        end: "bottom top", 
        scrub: 1
      }
    });
  }

  // Scroller animation
  const scroller = document.querySelector("#scroller-in");
  if (scroller) {
    scroller.innerHTML += scroller.innerHTML;
    const duration = scroller.scrollWidth / 100;
    gsap.to("#scroller-in", {
      x: -scroller.scrollWidth / 2,
      duration: duration,
      ease: "none",
      repeat: -1
    });
  }
}

// Initialize navigation (global)
window.initNav = async function() {
  await waitForGSAP();
  setupMobileMenu();
  setupDropdowns();
  setupScrollAnimations();
  setupAnimations();
  
  // Set active page highlight
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.dropbtn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (currentPage === 'index.html' || currentPage === '') {
    document.querySelector('.nav-items > .dropdown:first-child .dropbtn').classList.add('active');
  } else if (currentPage === 'park-info.html') {
    document.querySelector('.nav-items > .dropdown:first-child .dropbtn').classList.add('active');
  }
};

// Initialize on first load
document.addEventListener('DOMContentLoaded', function () {
  const navPlaceholder = document.getElementById('nav-placeholder');

  if (navPlaceholder) {
    // Load navigation
    fetch('nav.html')
      .then(response => response.text())
      .then(data => {
        navPlaceholder.innerHTML = data;

        // Update elements after nav is loaded
        elements.cursor = document.querySelector("#cursor");
        elements.cursorBlur = document.querySelector("#cursor-blur");
        elements.menuToggle = document.querySelector('.menu-toggle');
        elements.navItems = document.querySelector('.nav-items');
        elements.dropdowns = document.querySelectorAll('.dropdown');

        initNav();

        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      })
      .catch(error => {
        console.error('Error loading navigation:', error);
      });
  } else {
    // If no nav-placeholder, just run everything
    initNav();
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  // Reset dropdowns on resize
  document.querySelectorAll('.dropdown-content').forEach(content => {
    content.style.display = 'none';
  });
  setupDropdowns();
  
  // Reset mobile menu if we cross the breakpoint
  if (!isMobile()) {
    if (elements.navItems) {
      elements.navItems.classList.remove('active');
    }
    if (elements.menuToggle) {
      elements.menuToggle.innerHTML = '<i class="ri-menu-line"></i>';
    }
    document.body.style.overflow = '';
  }
});

// Scrolled nav effect (fallback if GSAP fails)
window.addEventListener('scroll', function() {
  const nav = document.querySelector('#nav');
  if (nav) {
    if (window.scrollY > 10) { // Changed from 40 to 10 for immediate effect
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
});

// Cleanup on window unload
window.addEventListener("beforeunload", () => {
  if (elements.menuToggle && elements.navItems) {
    elements.navItems.classList.remove('active');
    document.body.style.overflow = '';
  }
});
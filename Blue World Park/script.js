// Mobile Detection Helper
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

// // Initialize Function
function init() {
  // setupCursor();
  setupMobileMenu();
  setupDropdowns();
  // setupAnimations();
  // setupCardHoverEffects();
  setupScrollAnimations();
}

// Make initNav function available globally
window.initNav = function() {
  // setupCursor();
  setupMobileMenu();
  setupDropdowns();
  setupSectionNavigation();
  
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
  // Add more pages as needed
};

window.addEventListener('scroll', function() {
  const nav = document.querySelector('#nav');
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Initialize on first load
document.addEventListener('DOMContentLoaded', function () {
  const navPlaceholder = document.getElementById('nav-placeholder');

  if (navPlaceholder) {
    // Load navigation
    fetch('nav.html')
      .then(response => response.text())
      .then(data => {
        navPlaceholder.innerHTML = data;

        // Re-query any elements from nav.html
        elements.cursor = document.querySelector("#cursor");
        elements.cursorBlur = document.querySelector("#cursor-blur");
        elements.menuToggle = document.querySelector('.menu-toggle');
        elements.navItems = document.querySelector('.nav-items');
        elements.dropdowns = document.querySelectorAll('.dropdown');

        // setupCursor();

        // Initialize nav-related behavior after DOM injection
        initNav();
        setupAnimations();
        // setupCardHoverEffects();
        setupScrollAnimations();
      });
  } else {
    // If no nav-placeholder, just run everything
    initNav();
    setupAnimations();
    // setupCardHoverEffects();
    setupScrollAnimations();
  }
});

// Cursor Effects (Desktop Only)
// function setupCursor() {
//   if (!isTouchDevice() && elements.cursor && elements.cursorBlur) {
//     elements.cursor.style.display = "block";
//     elements.cursorBlur.style.display = "block";

//     document.addEventListener("mousemove", (dets) => {
//       elements.cursor.style.transform = `translate(${dets.x}px, ${dets.y}px)`;
//       elements.cursorBlur.style.transform = `translate(${dets.x - 250}px, ${dets.y - 250}px)`;
//     });

//     // Cursor effects for interactive elements
//     const interactiveElements = [
//       ...document.querySelectorAll("a, button, .card, .menu-toggle, .dropbtn")
//     ];

//     interactiveElements.forEach(elem => {
//       elem.addEventListener("mouseenter", () => {
//         elements.cursor.style.transform = "scale(3)";
//         elements.cursor.style.border = "1px solid #fff";
//         elements.cursor.style.backgroundColor = "transparent";
//       });
//       elem.addEventListener("mouseleave", () => {
//         elements.cursor.style.transform = "scale(1)";
//         elements.cursor.style.border = "0px solid #1973d2";
//         elements.cursor.style.backgroundColor = "#1973d2";
//       });
//     });
//   } else if (elements.cursor && elements.cursorBlur) {
//     elements.cursor.style.display = "none";
//     elements.cursorBlur.style.display = "none";
//   }
// }

// Mobile Menu Toggle - Fixed Version
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

// Dropdown Menus - Fixed for Mobile
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
  document.querySelectorAll('.card, #about-us img, #about-us-in').forEach(el => {
    observer.observe(el);
  });
}

// GSAP Animations
function setupAnimations() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Only run heavy animations on desktop
    if (!isMobile()) {
      // Navbar background change
      gsap.to("#nav", {
        backgroundColor: "#000",
        scrollTrigger: {
          trigger: "body",
          start: "40px top",
          end: "100px top",
          scrub: true
        }
      });

      // About section
      gsap.from("#about-us img, #about-us-in", {
        y: 90,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: "#about-us",
          start: "top 70%",
          end: "top 65%",
          scrub: 1
        }
      });

      // Quote marks
      gsap.from("#colon1", {
        y: -70,
        x: -70,
        scrollTrigger: {
          trigger: "#colon1",
          start: "top 55%",
          end: "top 45%",
          scrub: 4
        }
      });

      gsap.from("#colon2", {
        y: 70,
        x: 70,
        scrollTrigger: {
          trigger: "#colon1",
          start: "top 55%",
          end: "top 45%",
          scrub: 4
        }
      });

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
    }

    // Scroller animation (works on all devices)
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
  else {
    console.warn("GSAP or ScrollTrigger not found!");
}
}

// Initialize when DOM is loaded
// document.addEventListener("DOMContentLoaded", init);

// Cleanup on window unload
window.addEventListener("beforeunload", () => {
  if (elements.menuToggle && elements.navItems) {
    elements.navItems.classList.remove('active');
    document.body.style.overflow = '';
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
    elements.navItems.classList.remove('active');
    elements.menuToggle.innerHTML = '<i class="ri-menu-line"></i>';
    document.body.style.overflow = '';
  }
});
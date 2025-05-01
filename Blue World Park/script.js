// Cursor Effects
var crsr = document.querySelector("#cursor");
var blur = document.querySelector("#cursor-blur");

if (window.matchMedia("(hover: hover)").matches) {
  crsr.style.display = "block";
  blur.style.display = "block";
  
  document.addEventListener("mousemove", function(dets) {
    crsr.style.left = dets.x + "px";
    crsr.style.top = dets.y + "px";
    blur.style.left = dets.x - 250 + "px";
    blur.style.top = dets.y - 250 + "px";
  });

  var h4all = document.querySelectorAll("#nav h4");
  h4all.forEach(function(elem) {
    elem.addEventListener("mouseenter", function() {
      crsr.style.scale = 3;
      crsr.style.border = "1px solid #fff";
      crsr.style.backgroundColor = "transparent";
    });
    elem.addEventListener("mouseleave", function() {
      crsr.style.scale = 1;
      crsr.style.border = "0px solid #1973d2";
      crsr.style.backgroundColor = "#1973d2";
    });
  });
}

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
const navItems = document.querySelector('.nav-items');

if (menuToggle && navItems) {
  menuToggle.addEventListener('click', function() {
    navItems.classList.toggle('active');
    menuToggle.innerHTML = navItems.classList.contains('active') ? 
      '<i class="ri-close-line"></i>' : '<i class="ri-menu-line"></i>';
  });
  
  // Close menu when clicking nav items on mobile
  document.querySelectorAll('#nav h4').forEach(item => {
    item.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navItems.classList.remove('active');
        menuToggle.innerHTML = '<i class="ri-menu-line"></i>';
      }
    });
  });
}

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

gsap.to("#nav", {
  backgroundColor: "#000",
  scrollTrigger: {
    trigger: "body",
    start: "40px top", // Starts when 50px scrolled
    end: "100px top",
    scrub: true,
    onToggle: ({isActive}) => {
      document.body.classList.toggle('scrolled', isActive);
    }
  }
});

// About section animation
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

// Cards animation
gsap.from(".card", {
  scale: 0.8,
  duration: 1,
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".card",
    start: "top 70%",
    end: "top 65%",
    scrub: 1
  }
});

// Quote marks animation
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

// Solid black background for content
gsap.to("#main", {
  backgroundColor: "#000",
  scrollTrigger: {
    trigger: "#page1",
    start: "bottom center",
    end: "bottom top", 
    scrub: 1
  }
});

// Fade out video quickly after hero section
gsap.to("video", {
  opacity: 0,
  scrollTrigger: {
    trigger: "#page1",
    start: "bottom center", // Starts when page1 bottom hits center
    end: "bottom top", // Ends when page1 bottom hits top
    scrub: 1
  }
});

/* =========================================
   MAIN JAVASCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initNavbarScroll();
    initMobileMenu();
    initPreloader();
    initScrollReveal();
    initLiquidDistortion();
    initParallax();
    initAntiInspect();
    initImageModal();
});

/* 1. Hero Slider (Simultaneous Crossfade) */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const intervalTime = 5000;

    // Initial state check
    slides.forEach((slide, i) => {
        if (i === 0) slide.classList.add('active');
        else slide.classList.remove('active');
    });

    const startSlider = () => {
        setInterval(() => {
            // Remove active from current
            slides[currentSlide].classList.remove('active');

            // Add active to next
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, intervalTime);
    };

    // Wait until preloader finishes before starting the slider
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(startSlider, 1300); // Wait for preloader animation total time
        });
    } else {
        startSlider();
    }
}

/* 2. Navbar Scroll Effect */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* 3. Mobile Menu Toggle */
/* 3. Mobile Menu Toggle */
function initMobileMenu() {
    const hamburger = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!hamburger || !mobileMenu) return;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking close button
    const closeBtn = document.getElementById('close-menu');
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking any link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });
}

/* 4. Preloader Logic */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        // Minimum display time for logo animation
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 800);
    });
}

/* 5. Scroll Reveal Animation */
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
}

/* 6. Liquid Distortion Effect (SVG) */
function initLiquidDistortion() {
    // Only on Desktop for performance
    if (window.innerWidth < 1024) return;

    const displacement = document.getElementById('liquidDisplacement');
    const targets = document.querySelectorAll('.liquid-target');

    if (!displacement || targets.length === 0) return;

    let mouseX = 0, mouseY = 0, lastX = 0, lastY = 0, speed = 0, scale = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        const dx = mouseX - lastX;
        const dy = mouseY - lastY;
        speed = Math.sqrt(dx * dx + dy * dy);
        lastX = mouseX;
        lastY = mouseY;
    });

    function animate() {
        scale += (speed - scale) * 0.1;
        speed *= 0.9; // Friction
        const finalScale = Math.min(Math.max(scale * 0.5, 0), 50);
        displacement.setAttribute('scale', finalScale);
        requestAnimationFrame(animate);
    }

    animate();
}

/* 7. Layered Parallax (Scroll) */
function initParallax() {
    // Only Desktop
    if (window.innerWidth < 1024) return;

    const shapes = document.querySelectorAll('.parallax-shape');
    if (shapes.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        shapes.forEach(shape => {
            const speed = shape.getAttribute('data-speed');
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/* 8. Anti-Inspection Script */
function initAntiInspect() {
    // Disable Right Click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Disable Shortcuts
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        // Ctrl + Shift + I (Inspect)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }

        // Ctrl + Shift + J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }

        // Ctrl + U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
    });
}

/* 9. Image Modal Logic */
function initImageModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close-modal');

    // Select images from Beneficios (bento grid) and Galeria
    const clickableImages = document.querySelectorAll('.bento-bg, .gallery-item img');

    if (!modal || !modalImg || clickableImages.length === 0) return;

    // Open Modal
    clickableImages.forEach(img => {
        // Find the closest clickable wrapper or card to attach the event
        const wrapper = img.closest('.bento-card') || img.closest('.img-wrapper');

        if (wrapper) {
            wrapper.addEventListener('click', () => {
                modalImg.src = img.src;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        }
    });

    // Close Modal Function
    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        // Clear src after transition to avoid flash on next open
        setTimeout(() => modalImg.src = '', 300);
    };

    // Close on click (X button)
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close on click outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

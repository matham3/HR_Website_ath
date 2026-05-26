// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Navbar Scroll Effect (for homepage)
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile Menu Toggle (handles both .nav and .navbar)
const navToggle = document.getElementById('navToggle') || document.getElementById('nav-toggle');
const navMenu = document.getElementById('navMenu') || document.getElementById('nav-menu');

function closeResourcesDropdown() {
    const panel = document.getElementById('resources-panel');
    const btn = document.getElementById('resources-toggle');
    if (panel && btn) {
        panel.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
    }
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (!navMenu.classList.contains('active')) {
            closeResourcesDropdown();
        }
    });

    // Close mobile menu when clicking a link (not the Resources toggle — it only opens submenu)
    document.querySelectorAll('.nav-link:not(.nav-dropdown-btn), .navbar .nav-menu a, .nav-dropdown-item').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            closeResourcesDropdown();
        }
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
        const scrolled = window.pageYOffset;
        heroImg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// HR Business Partners — show / hide extra divisions
document.querySelectorAll('.partner-card .partner-toggle').forEach((btn) => {
    const card = btn.closest('.partner-card');
    const showLabel = btn.dataset.labelShow || 'Show all';
    const hideLabel = btn.dataset.labelHide || 'Hide';
    btn.addEventListener('click', () => {
        const expanded = card.classList.toggle('is-expanded');
        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        btn.textContent = expanded ? hideLabel : showLabel;
    });
});

// Active Nav Link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link[href]').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Resources dropdown (full-width centered panel under header)
(function () {
    const toggle = document.getElementById('resources-toggle');
    const panel = document.getElementById('resources-panel');
    const navbar = document.getElementById('navbar');
    if (!toggle || !panel) return;

    const positionPanel = () => {
        if (window.innerWidth <= 768) {
            panel.style.top = '';
            return;
        }
        if (navbar) {
            panel.style.top = `${navbar.getBoundingClientRect().bottom}px`;
        }
    };

    const openResources = () => {
        positionPanel();
        panel.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel.classList.contains('is-open')) {
            closeResourcesDropdown();
        } else {
            openResources();
        }
    });

    window.addEventListener('resize', () => {
        if (panel.classList.contains('is-open')) positionPanel();
    });

    window.addEventListener('scroll', () => {
        if (panel.classList.contains('is-open')) positionPanel();
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeResourcesDropdown();
    });

    document.addEventListener('click', (e) => {
        if (!panel.classList.contains('is-open')) return;
        if (toggle.contains(e.target) || panel.contains(e.target)) return;
        closeResourcesDropdown();
    });

    const resourcePages = ['hr-business-partners.html', 'manager-development.html'];
    if (resourcePages.includes(currentPage)) {
        toggle.classList.add('active');
        panel.querySelectorAll('.nav-dropdown-item').forEach((link) => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
})();

// Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// News Carousel
const newsCarousel = document.getElementById('news-carousel');
if (newsCarousel) {
    const track = newsCarousel.querySelector('.news-carousel-track');
    const originalSlides = Array.from(track.children);

    if (track && originalSlides.length > 1) {
        originalSlides.forEach((slide) => {
            track.appendChild(slide.cloneNode(true));
        });

        let currentOffset = 0;
        let animationId = null;
        let isPaused = false;
        const speed = 0.45;
        let loopWidth = 0;

        const updateLoopWidth = () => {
            loopWidth = 0;
            originalSlides.forEach((slide) => {
                loopWidth += slide.getBoundingClientRect().width;
            });
            loopWidth += (originalSlides.length - 1) * 24;
        };

        const tick = () => {
            if (!isPaused && loopWidth > 0) {
                currentOffset += speed;
                if (currentOffset >= loopWidth) {
                    currentOffset = 0;
                }
                track.style.transform = `translateX(-${currentOffset}px)`;
            }
            animationId = requestAnimationFrame(tick);
        };

        updateLoopWidth();
        animationId = requestAnimationFrame(tick);

        newsCarousel.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        newsCarousel.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        window.addEventListener('resize', () => {
            currentOffset = 0;
            track.style.transform = 'translateX(0)';
            updateLoopWidth();
        });

        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }
}

// Rewards Updates Carousel (image left, text right)
const rewardsCarousel = document.getElementById('rewards-updates-carousel');
if (rewardsCarousel) {
    const track = rewardsCarousel.querySelector('.rewards-carousel-track');
    const slides = Array.from(rewardsCarousel.querySelectorAll('.announcement-card'));
    const nextBtn = rewardsCarousel.querySelector('.rewards-carousel-btn.next');
    const prevBtn = rewardsCarousel.querySelector('.rewards-carousel-btn.prev');
    const dotsContainer = rewardsCarousel.querySelector('.rewards-carousel-dots');
    
    if (!track || !nextBtn || !prevBtn || !dotsContainer || slides.length === 0) {
        console.warn('Rewards carousel elements not found');
    } else {
        let currentIndex = 0;
        let autoplayTimer = null;

    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dotsContainer.querySelectorAll('button').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    const goToSlide = (index) => {
        currentIndex = (index + slides.length) % slides.length;
        updateCarousel();
    };

    const startAutoplay = () => {
        stopAutoplay(); // Clear any existing timer first
        autoplayTimer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 8000);
    };

    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to update ${index + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoplay();
            startAutoplay();
        });
        dotsContainer.appendChild(dot);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        stopAutoplay();
        startAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        stopAutoplay();
        startAutoplay();
    });

    rewardsCarousel.addEventListener('mouseenter', stopAutoplay);
    rewardsCarousel.addEventListener('mouseleave', startAutoplay);

    updateCarousel();
    startAutoplay();
    }
}

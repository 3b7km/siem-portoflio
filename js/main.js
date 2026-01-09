// ============================================
// SIEM Portfolio - Premium Interactive Features
// ============================================

// DOM Elements
const logo = document.getElementById('logo');
const navbar = document.getElementById('navbar');
const carouselTrack = document.getElementById('carouselTrack');
const carouselPrevBtn = document.getElementById('carouselPrev');
const carouselNextBtn = document.getElementById('carouselNext');
const carouselCards = document.querySelectorAll('.carousel-card');
const progressIndicator = document.querySelector('.progress-indicator');
const sections = document.querySelectorAll('.section');
const particleNetwork = document.getElementById('particleNetwork');

// ============================================
// LOGO CLICK - NAVIGATE TO HOME
// ============================================

if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    logo.style.cursor = 'pointer';
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (progressIndicator) {
        progressIndicator.style.width = scrollPercent + '%';
    }
    
    // Navbar scroll effect
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// CAROUSEL NAVIGATION
// ============================================

let scrollPos = 0;
const cardWidth = 130;

function updateCarouselButtons() {
    if (carouselTrack) {
        const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
        carouselPrevBtn.disabled = scrollPos <= 0;
        carouselNextBtn.disabled = scrollPos >= maxScroll;
    }
}

carouselPrevBtn?.addEventListener('click', () => {
    scrollPos = Math.max(scrollPos - cardWidth, 0);
    carouselTrack.scrollLeft = scrollPos;
    updateCarouselButtons();
});

carouselNextBtn?.addEventListener('click', () => {
    const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
    scrollPos = Math.min(scrollPos + cardWidth, maxScroll);
    carouselTrack.scrollLeft = scrollPos;
    updateCarouselButtons();
});

// Carousel card click navigation
carouselCards.forEach(card => {
    card.addEventListener('click', () => {
        const targetId = card.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            carouselCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            window.scrollTo({
                top: targetSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
    
    // Keyboard navigation
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});

// Update carousel active card on scroll
window.addEventListener('scroll', () => {
    let currentSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    if (currentSection) {
        carouselCards.forEach(card => {
            if (card.getAttribute('data-target') === currentSection) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
});

window.addEventListener('load', updateCarouselButtons);

// ============================================
// PARTICLE NETWORK BACKGROUND
// ============================================

class ParticleNetwork {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.numParticles = window.innerWidth > 768 ? 50 : 25;
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        this.canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                radius: Math.random() * 1.5 + 0.5
            });
        }
        
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(140, 82, 255, 0.1)';
        this.ctx.strokeStyle = 'rgba(140, 82, 255, 0.1)';
        
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw connections
            for (let i = index + 1; i < this.particles.length; i++) {
                const other = this.particles[i];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
}

// Initialize particle network on hero section
if (particleNetwork) {
    new ParticleNetwork(particleNetwork);
}

// ============================================
// SCROLL ANIMATIONS (AOS-like Implementation)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.dataset.animation || 'slideInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Stagger animations for grid items
document.querySelectorAll('.overview-card, .feature-card, .model-card, .result-card, .dashboard-feature, .timeline-item, .benefits-list li, .tech-tag, .viz-item, .link-card').forEach((el, index) => {
    el.style.animation = `slideInUp 0.8s ease-out ${0.4 + (index * 0.1)}s both`;
});

// ============================================
// 3D TILT EFFECT FOR CARDS
// ============================================

function addTiltEffect(cards) {
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) * 0.1;
            const rotateY = (centerX - x) * 0.1;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Apply tilt to model cards
addTiltEffect(document.querySelectorAll('.model-card'));
addTiltEffect(document.querySelectorAll('.feature-card'));

// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// RIPPLE EFFECT ON BUTTONS
// ============================================

document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255,255,255,0.5);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;
        
        if (!this.style.position || this.style.position === 'static') {
            this.style.position = 'relative';
        }
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ============================================
// PARALLAX SCROLLING EFFECT
// ============================================

const heroBackground = document.querySelector('.hero-background');
if (heroBackground) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ============================================
// LIGHTBOX FUNCTIONALITY
// ============================================

function openLightbox(imageSrc, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightboxImage.src = imageSrc;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ============================================
// VISUALIZATION FILTER FUNCTIONALITY
// ============================================

const filterButtons = document.querySelectorAll('.viz-filter-btn');
const vizItems = document.querySelectorAll('.viz-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        vizItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.classList.remove('hidden');
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.transition = 'all 0.5s ease-out';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
    });
});

// ============================================
// EXTERNAL LINKS
// ============================================

document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});

// ============================================
// LAZY LOAD IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%cSIEM Security Solution', 'color: #8c52ff; font-size: 20px; font-weight: bold;');
console.log('%cPremium Redesign - Advanced Interactive Features', 'color: #8e50ec; font-size: 14px;');
console.log('%cBuilt with modern web technologies and best practices', 'color: #d9d9d9; font-size: 12px;');

// ============================================
// PERFORMANCE MONITORING
// ============================================

if ('performance' in window && 'PerformanceObserver' in window) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });
}

// ============================================
// SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS
// ============================================

if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// TOUCH GESTURE SUPPORT FOR CAROUSEL
// ============================================

let touchStartX = 0;
let touchEndX = 0;

carouselTrack?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

carouselTrack?.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
        carouselNextBtn?.click();
    }
    if (touchEndX - touchStartX > 50) {
        carouselPrevBtn?.click();
    }
}

// ============================================
// ACCESSIBILITY - FOCUS MANAGEMENT
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============================================
// INIT ON DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Add data-aos attributes dynamically if not already present
    document.querySelectorAll('.section-title').forEach(el => {
        if (!el.hasAttribute('data-aos')) {
            el.setAttribute('data-aos', 'fade-up');
        }
    });
    
    // Ensure progress bar is visible
    if (progressIndicator) {
        progressIndicator.style.display = 'block';
    }
});

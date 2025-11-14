// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    // Navbar background on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Scroll progress bar
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const progress = (scrollPosition / scrollHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
});

// Active Navigation Link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) {
            return;
        }
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) {
            return;
        }
        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Portfolio Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        portfolioCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Portfolio Detail Modal
const portfolioModal = document.getElementById('portfolioModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalDialog = portfolioModal.querySelector('.modal-dialog');
const modalClose = portfolioModal.querySelector('.modal-close');
const modalImage = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalClient = document.getElementById('modalClient');
const modalDescription = document.getElementById('modalDescription');
const modalDuration = document.getElementById('modalDuration');
const modalTags = document.getElementById('modalTags');
const modalDeliverablesWrapper = portfolioModal.querySelector('.modal-deliverables');
const modalDeliverables = document.getElementById('modalDeliverables');
const modalLink = document.getElementById('modalLink');
const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
let lastFocusedElement = null;

const categoryMap = {
    business: 'Bisnis',
    ecommerce: 'E-Commerce',
    personal: 'Personal',
    custom: 'Custom'
};

const handleFocusTrap = (event) => {
    if (event.key !== 'Tab') {
        return;
    }

    const focusableElements = portfolioModal.querySelectorAll(focusableSelectors);
    if (!focusableElements.length) {
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
        if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }
    } else if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
};

const closeModal = () => {
    portfolioModal.classList.remove('active');
    portfolioModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    portfolioModal.removeEventListener('keydown', handleFocusTrap);

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
};

const openModal = (card) => {
    lastFocusedElement = document.activeElement;

    const image = card.querySelector('.portfolio-image');
    const descriptionElement = card.querySelector('.portfolio-description');

    modalImage.src = image ? image.src : '';
    modalImage.alt = image ? image.alt : card.querySelector('.portfolio-title').textContent;
    modalCategory.textContent = categoryMap[card.dataset.category] || 'Proyek';
    modalTitle.textContent = card.querySelector('.portfolio-title').textContent;

    if (card.dataset.client) {
        modalClient.textContent = `Klien: ${card.dataset.client}`;
        modalClient.style.display = '';
    } else {
        modalClient.textContent = '';
        modalClient.style.display = 'none';
    }

    modalDescription.textContent = descriptionElement ? descriptionElement.textContent : '';
    modalDuration.textContent = card.dataset.duration || '-';

    modalTags.innerHTML = '';
    const techStack = (card.dataset.tech || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

    if (techStack.length) {
        techStack.forEach(stack => {
            const span = document.createElement('span');
            span.textContent = stack;
            modalTags.appendChild(span);
        });
    } else {
        const span = document.createElement('span');
        span.textContent = 'Detail teknologi menyusul';
        modalTags.appendChild(span);
    }

    modalDeliverables.innerHTML = '';
    const deliverables = (card.dataset.deliverables || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

    if (deliverables.length) {
        deliverables.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            modalDeliverables.appendChild(li);
        });
        modalDeliverablesWrapper.style.display = '';
    } else {
        modalDeliverablesWrapper.style.display = 'none';
    }

    if (card.dataset.link && card.dataset.link !== '#') {
        modalLink.href = card.dataset.link;
        modalLink.classList.remove('hidden');
    } else {
        modalLink.href = '#';
        modalLink.classList.add('hidden');
    }

    portfolioModal.classList.add('active');
    portfolioModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    portfolioModal.addEventListener('keydown', handleFocusTrap);

    setTimeout(() => {
        modalDialog.focus();
    }, 100);
};

portfolioCards.forEach(card => {
    const detailBtn = card.querySelector('.portfolio-btn');
    if (!detailBtn) {
        return;
    }

    detailBtn.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(card);
    });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && portfolioModal.classList.contains('active')) {
        closeModal();
    }
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Contact Form
const contactForm = document.getElementById('contactForm');
const contactNameInput = document.getElementById('contactName');
const contactMessageInput = document.getElementById('contactMessage');
const whatsappNumber = '62895370209724';

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameValue = contactNameInput.value.trim() || 'Calon Klien';
    const messageValue = contactMessageInput.value.trim();

    const whatsappMessage = `Halo Zentrix Kreasi,\nSaya ${nameValue} ingin berkonsultasi mengenai pembuatan website.\n\n${messageValue}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.location.href = whatsappURL;
    contactForm.reset();
});

// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

    
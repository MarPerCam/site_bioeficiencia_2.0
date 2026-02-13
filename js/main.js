document.addEventListener('DOMContentLoaded', function () {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    // Scroll effect removed to standardize navbar size
    // window.addEventListener('scroll', function () {
    //     if (window.scrollY > 50) {
    //         navbar.style.padding = '10px 0';
    //         navbar.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    //     } else {
    //         navbar.style.padding = '45px 0';
    //         navbar.style.boxShadow = 'none';
    //     }
    // });


    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem("theme");

    // Apply saved theme on load
    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        if (themeToggle) themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            let theme = "light";
            if (document.documentElement.getAttribute("data-theme") !== "dark") {
                theme = "dark";
            }

            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);

            // Toggle Icon & Logo
            const icon = themeToggle.querySelector('i');
            const logoImg = document.querySelector('.logo-img');

            if (theme === 'dark') {
                icon.classList.replace('fa-moon', 'fa-sun');
                if (logoImg) logoImg.src = 'img/logo_dark.png';
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                if (logoImg) logoImg.src = 'img/logo_dark.png';
            }
        });
    }

    // Set initial logo on load
    const currentThemeOnLoad = document.documentElement.getAttribute("data-theme");
    const logoImg = document.querySelector('.logo-img');
    if (currentThemeOnLoad === 'dark' && logoImg) {
        logoImg.src = 'img/logo_dark.png';
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Scroll Reveal Animation (Simple IntersectionObserver)
    const revealElements = document.querySelectorAll('.service-card, .step-card, .about-content');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // --- Scrollspy & Animated Marker ---
    const navLinksList = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Create marker element dinamically
    const marker = document.createElement('li');
    marker.classList.add('nav-marker');
    // Initialize width/position to 0 or first item
    marker.style.width = '0px';
    marker.style.left = '0px';
    if (navLinksList) {
        navLinksList.appendChild(marker);
    }

    function moveMarker(targetLink) {
        if (!targetLink || !marker) return;

        // Use the relative position within nav-links
        // nav-links is position: relative
        const rect = targetLink.getBoundingClientRect();
        const parentRect = navLinksList.getBoundingClientRect();

        const relativeLeft = rect.left - parentRect.left;
        const width = rect.width;

        marker.style.left = `${relativeLeft}px`;
        marker.style.width = `${width}px`;
    }

    // Intersection Observer for Sections to auto-update active state
    // We want to highlight the section that is currently most visible.
    const sectionObserverOptions = {
        threshold: 0.3 // Trigger when 30% visible
        // You might need different thresholds or rootMargin for better feel
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all
                links.forEach(link => {
                    link.classList.remove('active');
                    // Match href with id
                    const id = entry.target.getAttribute('id');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        moveMarker(link);
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Update marker on window resize
    window.addEventListener('resize', () => {
        const active = document.querySelector('.nav-link.active');
        if (active) moveMarker(active);
    });

});

// Savings Calculator Function (Global)
function calculateSavings() {
    const costInput = document.getElementById('energy-cost');
    const stateSelect = document.getElementById('state-select');
    const resultBox = document.getElementById('result-box');
    const savingsAmount = document.getElementById('savings-amount');

    // Average Industrial/Commercial Tariff approximations (R$/kWh) - 2024 Estimates
    const stateTariffs = {
        'AC': 1.05, 'AL': 0.95, 'AP': 0.98, 'AM': 1.02,
        'BA': 0.88, 'CE': 0.92, 'DF': 0.85, 'ES': 0.82,
        'GO': 0.84, 'MA': 1.08, 'MT': 0.96, 'MS': 0.94,
        'MG': 0.89, 'PA': 1.12, 'PB': 0.90, 'PR': 0.86,
        'PE': 0.91, 'PI': 1.00, 'RJ': 1.15, 'RN': 0.93,
        'RS': 0.87, 'RO': 0.98, 'RR': 1.10, 'SC': 0.80,
        'SP': 0.85, 'SE': 0.92, 'TO': 1.05
    };

    const monthlyCost = parseFloat(costInput.value);
    const selectedState = stateSelect.value;
    const tariff = stateTariffs[selectedState] || 0.85; // Default fallback

    if (isNaN(monthlyCost) || monthlyCost <= 0) {
        alert("Por favor, insira um valor válido para o gasto mensal.");
        return;
    }

    // Calculations
    const annualizedCost = monthlyCost * 12;
    // Estimated Money Saved (30% reduction) - Keep simple business logic
    const estimatedMoneySaved = annualizedCost * 0.30;

    // Estimated Energy Saved (kWh)
    const monthlyKWh = monthlyCost / tariff;
    const annualKWhSaved = (monthlyKWh * 12) * 0.30;

    savingsAmount.innerText = estimatedMoneySaved.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // Create or update detail text
    let detailsEl = document.getElementById('savings-details');
    if (!detailsEl) {
        detailsEl = document.createElement('p');
        detailsEl.id = 'savings-details';
        detailsEl.style.marginTop = '10px';
        detailsEl.style.fontSize = '0.95rem';
        detailsEl.style.color = 'var(--primary-color)';
        resultBox.insertBefore(detailsEl, resultBox.querySelector('.note'));
    }

    detailsEl.innerHTML = `
        <strong>Estado:</strong> ${selectedState} (Tarifa ref: R$ ${tariff.toFixed(2)}/kWh)<br>
        <strong>Energia Poupada:</strong> ~${Math.round(annualKWhSaved).toLocaleString('pt-BR')} kWh/ano
    `;

    resultBox.style.display = 'block';
}

// Carousel Logic
document.addEventListener('DOMContentLoaded', function () {
    const track = document.querySelector('.carousel-track');
    if (!track) return; // Exit if no carousel on this page

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-dots');

    if (slides.length === 0) return;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    // Initial setup
    let currentIndex = 0;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex++;
            if (currentIndex >= slides.length) {
                currentIndex = 0;
            }
            updateCarousel();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
            }
            updateCarousel();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Auto play
    setInterval(() => {
        currentIndex++;
        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }
        updateCarousel();
    }, 5000);
});


// Initialize Swiper for Services Details
var swiper = new Swiper(".mySwiper", {
    loop: true,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

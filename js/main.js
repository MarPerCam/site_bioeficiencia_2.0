document.addEventListener('DOMContentLoaded', function () {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = 'none';
        }
    });

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
        // Calculation relative to the UL parent
        // We use offsetLeft and offsetWidth of the <a> link, 
        // but note the <a> is inside an <li>? 
        // Wait, HTML structure is: <ul> <li> <a ...> </a> </li> ... </ul>
        // So we need to target the LI parent of the active string, or position relative to the LI?
        // The nav-links is row flex. The items are LI. The A is inside LI.
        // Let's target the A's position relative to nav-links?
        // nav-links (relative) -> li -> a
        // offsetLeft of a is relative to li? No, relative to offsetParent.
        // If li is static, a's offsetParent might be nav-links (if relative).
        // Let's check styling. LI has no position set in CSS I saw. nav-links is now relative.

        const rect = targetLink.getBoundingClientRect();
        const parentRect = navLinksList.getBoundingClientRect();

        const relativeLeft = rect.left - parentRect.left;
        const width = rect.width;

        marker.style.left = `${relativeLeft}px`;
        marker.style.width = `${width}px`;
    }

    // Initialize marker on first active link
    const initialActive = document.querySelector('.nav-link.active');
    if (initialActive) moveMarker(initialActive);

    // Update on click
    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            moveMarker(link);
        });
    });

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

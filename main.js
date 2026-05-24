document.addEventListener('DOMContentLoaded', function() {
    
    const navbar = document.querySelector('.navbar');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    
    // Theme Toggle
    function updateThemeIcon() {
        const isDark = html.getAttribute('data-bs-theme') === 'dark';
        if (themeIcon) {
            themeIcon.className = isDark ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon();
        });
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-bs-theme', savedTheme);
        updateThemeIcon();
    }
    
    // Navbar Scroll
    function handleScroll() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                if (document.querySelector('.hero-section')) {
                    navbar.classList.remove('scrolled');
                }
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');
        const successMessage = document.getElementById('successMessage');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (btnText) btnText.classList.add('d-none');
            if (btnSpinner) btnSpinner.classList.remove('d-none');
            if (submitBtn) submitBtn.disabled = true;
            
            setTimeout(function() {
                if (btnText) btnText.classList.remove('d-none');
                if (btnSpinner) btnSpinner.classList.add('d-none');
                if (submitBtn) submitBtn.disabled = false;
                if (successMessage) successMessage.classList.add('show');
                contactForm.reset();
                
                setTimeout(function() {
                    if (successMessage) successMessage.classList.remove('show');
                }, 5000);
            }, 2000);
        });
    }
    
    // Menu Cart & Category Filter
    const addButtons = document.querySelectorAll('.add-btn');
    const cartContent = document.getElementById('cart-content');
    const cartTotal = document.getElementById('cart-total');
    const sendOrderBtn = document.getElementById('send-order-btn');
    const cartMainLayout = document.getElementById('cart-main-layout');
    const successMessage = document.getElementById('success-message');
    const resetCartBtn = document.getElementById('reset-cart-btn');

    let panier = [];

    function mettreAJourPanier() {
        if (!cartContent || !cartTotal || !sendOrderBtn) return;

        if (panier.length === 0) {
            cartContent.innerHTML = '<p class="empty-msg">Votre sélection est vide</p>';
            cartTotal.innerText = '0 HTG';
            sendOrderBtn.disabled = true;
            return;
        }

        cartContent.innerHTML = '';
        let total = 0;

        panier.forEach(item => {
            total += item.prix;
            const itemRow = document.createElement('div');
            itemRow.classList.add('cart-item');
            itemRow.innerHTML = `
                <span>${item.nom}</span>
                <span style="color: var(--accent); font-weight: bold;">${item.prix} HTG</span>
            `;
            cartContent.appendChild(itemRow);
        });

        cartTotal.innerText = total + ' HTG';
        sendOrderBtn.disabled = false;
    }

    if (addButtons.length > 0 && cartContent && cartTotal) {
        addButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.product-card');
                if (!card) return;

                const nom = card.querySelector('.item-title').innerText;
                const priceText = card.querySelector('.price').innerText;
                const prix = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

                panier.push({ nom, prix });
                mettreAJourPanier();
            });
        });
    }

    if (sendOrderBtn && cartMainLayout && successMessage) {
        sendOrderBtn.addEventListener('click', () => {
            console.log('Liste envoyée avec succès :', panier);
            cartMainLayout.style.display = 'none';
            successMessage.style.display = 'block';
        });
    }

    if (resetCartBtn && cartMainLayout && successMessage) {
        resetCartBtn.addEventListener('click', () => {
            panier = [];
            mettreAJourPanier();
            successMessage.style.display = 'none';
            cartMainLayout.style.display = 'block';
        });
    }

    if (sendOrderBtn) {
        sendOrderBtn.disabled = true;
    }

    mettreAJourPanier();

    // Ensure fixed cart doesn't overlap the header: position it below the page header on desktop
    function adjustCartPosition() {
        if (!cartMainLayout) return;
        if (window.innerWidth < 992) {
            cartMainLayout.style.position = '';
            cartMainLayout.style.top = '';
            cartMainLayout.style.right = '';
            cartMainLayout.style.width = '';
            return;
        }

        const pageHeader = document.querySelector('.page-header');
        let topOffset = 100;

        if (pageHeader) {
            const rect = pageHeader.getBoundingClientRect();
            if (rect.bottom > 0) {
                topOffset = Math.round(rect.bottom) + 20; // place cart below visible header
            } else {
                topOffset = (navbar ? navbar.offsetHeight : 60) + 20;
            }
        } else {
            topOffset = (navbar ? navbar.offsetHeight : 60) + 20;
        }

        cartMainLayout.style.position = 'fixed';
        cartMainLayout.style.top = topOffset + 'px';
        cartMainLayout.style.right = '20px';
        cartMainLayout.style.width = '320px';
    }

    window.addEventListener('resize', adjustCartPosition);
    window.addEventListener('scroll', adjustCartPosition);
    adjustCartPosition();

    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');
                productCards.forEach(card => {
                    const cardCat = card.getAttribute('data-cat');
                    card.style.display = filterValue === 'all' || cardCat === filterValue ? 'flex' : 'none';
                });
            });
        });
    }
});


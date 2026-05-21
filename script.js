// Cart functionality
let cartCount = 0;

document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', function() {
        // Find product info
        const productCard = this.closest('.product-card');
        const name = productCard.querySelector('h3').textContent;
        const priceSection = productCard.querySelector('.price-section');
        let price = 0;
        if (priceSection) {
            const sale = priceSection.querySelector('.sale-price');
            const orig = priceSection.querySelector('.original-price');
            if (sale) {
                price = parseFloat(sale.textContent.replace(/[^\d.]/g, ''));
            } else if (orig) {
                price = parseFloat(orig.textContent.replace(/[^\d.]/g, ''));
            }
        } else {
            // Fallback: try to find price in button's parent
            const sale = productCard.querySelector('.sale-price');
            if (sale) price = parseFloat(sale.textContent.replace(/[^\d.]/g, ''));
        }
        const image = productCard.querySelector('.product-image')?.textContent || '';

        // Add to cart in localStorage
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.name === name && item.price === price);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name, price, image, qty: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartCount();

        // Show feedback
        const originalText = this.textContent;
        this.textContent = 'Added! ✓';
        this.style.backgroundColor = '#4ECDC4';

        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = '';
        }, 2000);
    });
});

function updateCartCount() {
    // Count total items in cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

// On page load, sync cart count
updateCartCount();

// Countdown timer
function updateCountdown() {
    let hours = parseInt(document.getElementById('hours').textContent);
    let minutes = parseInt(document.getElementById('minutes').textContent);
    let seconds = parseInt(document.getElementById('seconds').textContent);

    if (seconds > 0) {
        seconds--;
    } else if (minutes > 0) {
        minutes--;
        seconds = 59;
    } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
    }

    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);

// Newsletter form
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with ${email}!`);
    this.reset();
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Search functionality
document.querySelector('.search-bar button').addEventListener('click', function() {
    const searchTerm = document.querySelector('.search-bar input').value;
    if (searchTerm.trim()) {
        alert(`Searching for: ${searchTerm}`);
    }
});

// Category card click
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const categoryName = this.querySelector('h3').textContent;
        alert(`Browsing: ${categoryName}`);
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .category-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Header icons click handlers
document.querySelector('.header-icons').addEventListener('click', function(e) {
    const iconItem = e.target.closest('.icon-item');
    if (iconItem) {
        const text = iconItem.querySelector('p').textContent;
        if (text === 'Cart') {
            alert(`Cart has ${cartCount} items`);
        } else if (text === 'Wishlist') {
            alert('Opening your Wishlist...');
        } else if (text === 'Account') {
            alert('Redirecting to Account page...');
        }
    }
});

// Product creation handler (used by product_create.html)
function createProduct(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('#product-name').value.trim();
    const price = parseFloat(form.querySelector('#product-price').value);
    const desc = form.querySelector('#product-desc').value.trim();
    const image = form.querySelector('#product-image').value.trim();
    const category = form.querySelector('#product-category').value.trim();

    if (!name || isNaN(price)) {
        alert('Please provide a product name and a valid price.');
        return;
    }

    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = {
        id: Date.now(),
        name,
        price,
        description: desc,
        image,
        category
    };

    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    alert('Product created successfully.');
    form.reset();
    window.location.href = 'index.html';
}

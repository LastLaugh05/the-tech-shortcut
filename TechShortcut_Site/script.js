// ==========================================================================
// 1. MOBILE MENU LOGIC
// ==========================================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    if (navLinks.classList.contains('active')) {
        hamburger.innerHTML = '✕';
        hamburger.style.transform = 'rotate(90deg)';
    } else {
        hamburger.innerHTML = '☰';
        hamburger.style.transform = 'rotate(0deg)';
    }
});

links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '☰';
        hamburger.style.transform = 'rotate(0deg)';
    });
});

// ==========================================================================
// 2. CUSTOM GLOWING CURSOR LOGIC (Optimized for Mobile)
// ==========================================================================
const cursor = document.querySelector('.custom-cursor');

// Only run the custom cursor logic if the device supports hover (i.e., not a touch screen)
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    
    document.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for buttery smooth performance without lag
        requestAnimationFrame(() => {
            if (cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
        });
    });

    // Make cursor expand when hovering over interactive elements
    const interactables = document.querySelectorAll('a, button, .category-card, .price-card, label, input');

    interactables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (cursor) {
                cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
                cursor.style.background = 'transparent';
                cursor.style.border = '1px solid var(--accent-gold)';
            }
        });
        item.addEventListener('mouseleave', () => {
            if (cursor) {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.background = 'var(--accent-gold)';
                cursor.style.border = 'none';
            }
        });
    });
} else {
    // Completely remove the cursor element from the DOM on mobile to save memory
    if(cursor) cursor.remove();
}

// ==========================================================================
// 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
// ==========================================================================
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px" 
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target); 
    });
}, revealOptions);

revealElements.forEach(el => revealOnScroll.observe(el));

// ==========================================================================
// 4. SMART FLOATING NAVBAR LOGIC
// ==========================================================================
const navbar = document.querySelector('.navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    // Morph into Floating Pill Effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Smart Hide (Hide when scrolling down past hero, show scrolling up)
    if (window.scrollY > lastScrollY && window.scrollY > 300) {
        navbar.style.transform = 'translateY(-150%)'; 
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
});

// ==========================================================================
// 5. DEPTH SECTION SCROLL SYNC
// ==========================================================================
const depthCards = document.querySelectorAll('.depth-card');

const depthObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
            entry.target.querySelector('.depth-number-bg').style.opacity = '1';
        }
    });
}, { threshold: 0.5 });

depthCards.forEach(card => depthObserver.observe(card));

// ==========================================================================
// 6. ORDER & PAYMENT VIP MODAL LOGIC
// ==========================================================================
const modal = document.getElementById('orderModal');
const step1 = document.getElementById('modalStep1');
const step2 = document.getElementById('modalStep2');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const btnUpi = document.getElementById('btnUpi');
const btnTelegram = document.getElementById('btnTelegram');
const modalServiceName = document.getElementById('modalServiceName');
const modalPrice = document.getElementById('modalPrice');

// ⚠️ YOUR EXACT PAYMENT DETAILS ⚠️
const YOUR_UPI_ID = "utan05@axl"; 
const YOUR_PAYEE_NAME = "Utsha Rudra"; 

let currentServiceName = "";
let currentBasePrice = 0;

window.openOrderModal = function(serviceName, priceAmount) {
    currentServiceName = serviceName;
    currentBasePrice = parseInt(priceAmount);
    
    // Reset modal text and uncheck the box every time it opens
    modalServiceName.textContent = `You are ordering a ${serviceName} (₹${currentBasePrice})`;
    document.getElementById('supportCheckbox').checked = false;

    // Reset modal back to "Phase 1" state
    step1.style.display = 'block';
    step2.style.display = 'none';
    
    // Open it!
    modal.classList.add('active');
};

// "Proceed to Pay" button calculates final price and reveals payment instructions
btnYes.addEventListener('click', () => {
    let finalPrice = currentBasePrice;
    let telegramMessage = `Hi Utsha! I have made the payment of ₹${currentBasePrice} for the ${currentServiceName}. Here is my screenshot:`;
    let upiNote = `Payment for ${currentServiceName}`.replace(/ /g, "%20");

    // VIP Support Math Logic
    if (document.getElementById('supportCheckbox').checked) {
        finalPrice = currentBasePrice + 99;
        telegramMessage = `🛡️ SYSTEM UPGRADE: Hi Utsha, I have paid ₹${finalPrice} for the ${currentServiceName} AND activated the 1-Month Update License. Here is my screenshot:`;
        upiNote = `Payment for ${currentServiceName} and Support`.replace(/ /g, "%20");
    }

    // 1. Update the Price on the Payment Screen
    modalPrice.textContent = `₹${finalPrice}`;

    // 2. Build the exact UPI Deep Link with the calculated price
    const upiLink = `upi://pay?pa=${YOUR_UPI_ID}&pn=${YOUR_PAYEE_NAME.replace(/ /g, "%20")}&am=${finalPrice}&cu=INR&tn=${upiNote}`;
    btnUpi.href = upiLink;
    
    // 3. Build the exact Telegram Link with the calculated message
    const tgLink = `https://t.me/utsha05?text=${encodeURIComponent(telegramMessage)}`;
    btnTelegram.href = tgLink;

    // Switch to Phase 2
    step1.style.display = 'none';
    step2.style.display = 'block';
});

// "No" button closes the popup
btnNo.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Clicking the dark background outside the box also closes it
modal.addEventListener('click', (e) => {
    if(e.target === modal) {
        modal.classList.remove('active');
    }
});

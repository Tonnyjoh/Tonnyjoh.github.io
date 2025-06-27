// Typewriter effect
const nameElement = document.getElementById("typewriter-name");
const fullName = "RAJAOHARIVONY Haritody Tonny Raldo";
let i = 0;
let isCursorVisible = true;

function typeWriter() {
    if (i < fullName.length) {
        nameElement.innerHTML = fullName.substring(0, i + 1) + '<span class="cursor">|</span>';
        i++;
        setTimeout(typeWriter, 100);
    } else {
        setInterval(() => {
            isCursorVisible = !isCursorVisible;
            nameElement.innerHTML = fullName + (isCursorVisible ? '<span class="cursor">|</span>' : '');
        }, 500);
    }
}

// Animation au scroll
function checkScroll() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => {
        const elementPosition = el.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (elementPosition < screenPosition) {
            el.classList.add('visible');
        }
    });

    // Gestion de la navigation active
    const sections = document.querySelectorAll('section');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= (sectionTop - 100)) {
            currentSection = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(a => {
        a.classList.remove('active-nav');
        if (a.getAttribute('href') === `#${currentSection}`) {
            a.classList.add('active-nav');
        }
    });
}

// Navigation fluide
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        window.scrollTo({
            top: targetElement.offsetTop - 20,
            behavior: 'smooth'
        });
    });
});

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', () => {
    checkScroll();
    setTimeout(typeWriter, 500);
});

document.querySelector('nav a[href="#about"]').classList.add('active-nav');

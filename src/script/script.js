(() => {
    // Theme toggle
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');

        if (currentTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }

        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    };

    // Typewriter effect
    const initTypewriterEffect = () => {
        const commands = document.querySelectorAll('.terminal-output p.mono');
        if (!commands.length) return;

        commands.forEach((cmd, index) => {
            const text = cmd.textContent || '';
            cmd.textContent = '';

            let i = 0;
            const speed = 30 + Math.random() * 30;

            const typeWriter = () => {
                if (i < text.length) {
                    cmd.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                }
            };

            setTimeout(typeWriter, index * 300); // Stagger animations
        });
    };

    // Rocket message animation
    const initRocketMessageAnimation = () => {
        const words = [
            "Initializing systems...",
            "Loading dependencies...",
            "Compiling code...",
            "Ready for launch!",
            "3... 2... 1...",
            "<span class='text-green-500'>Flymetothemoon!</span>"
        ];
        let i = 0;

        const rocketWords = document.getElementById('rocket-words');
        if (!rocketWords) return;

        setInterval(() => {
            rocketWords.style.opacity = 0;
            setTimeout(() => {
                rocketWords.innerHTML = words[i = (i + 1) % words.length];
                rocketWords.style.opacity = 1;
            }, 400);
        }, 2000);
    };

    // Rocket hover effect
    const initRocketHoverEffect = () => {
        const rocketContainer = document.querySelector('.rocket-animation-container');
        if (!rocketContainer) return;

        const stage = rocketContainer.querySelector('.stage');
        if (!stage) return;

        rocketContainer.addEventListener('mouseenter', () => {
            stage.style.animation = 'none';
            void stage.offsetWidth; // Trigger reflow
            stage.style.animation = 'rocket-launch 2s forwards';
        });

        rocketContainer.addEventListener('mouseleave', () => {
            stage.style.animation = 'rocket-float 4s linear infinite alternate-reverse';
        });
    };

    // Add rocket launch animation styles
    const addRocketLaunchStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rocket-launch {
                0% { transform: translateY(0) rotate(0deg); }
                30% { transform: translateY(-20px) rotate(5deg); }
                70% { transform: translateY(-60px) rotate(0deg); }
                100% { transform: translateY(-100px) rotate(-5deg) scale(0.8); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    };

    // Initialize all features
    const init = () => {
        initThemeToggle();
        initTypewriterEffect();
        initRocketMessageAnimation();
        initRocketHoverEffect();
        addRocketLaunchStyles();
    };

    // Run initialization on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', init);
})();
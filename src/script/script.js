(() => {
  /**
   * Wires the theme toggle button. Restores the saved preference from localStorage,
   * falling back to the OS color-scheme preference on first visit, and persists
   * the choice on every click. orb.js watches for the resulting `.dark` class
   * change via a MutationObserver to re-theme the WebGL scene.
   */
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

  // Variable globale pour gérer les étoiles
  let starsContainer = null;
  let starsResizeListener = null;

  /**
   * Builds a parallax starfield (1 layer / 10 stars on mobile, 2 layers / 30 on desktop)
   * as absolutely-positioned divs behind the page. Re-runs itself (via `starsResizeListener`,
   * debounced 250ms) on every resize to adjust density for the new viewport, tearing down
   * and rebuilding rather than patching in place. See `cleanupStars` for teardown.
   */
  const initStarsBackground = () => {
    // Nettoyer les étoiles existantes
    cleanupStars();

    starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container fixed top-0 left-0 w-full h-full pointer-events-none z-0';
    document.body.appendChild(starsContainer);
    
    // Determine number of stars based on screen size
    const isMobile = window.innerWidth < 768;
    const starsPerLayer = isMobile ? 10 : 30; // Significantly fewer stars on mobile
    
    // Create only 1 layer on mobile, 2 layers on desktop
    const layerCount = isMobile ? 1 : 2;
    
    for (let i = 1; i <= layerCount; i++) {
      const starsLayer = document.createElement('div');
      starsLayer.className = `stars-layer stars-layer-${i} absolute top-0 left-0 w-full h-full`;
      starsContainer.appendChild(starsLayer);
      
      for (let j = 0; j < starsPerLayer; j++) {
        const star = document.createElement('div');
        const size = Math.random() * 1.2 + (3 - i) * 0.4; // Even smaller stars
        star.className = 'star absolute rounded-full';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = i === 1 ? '#fff' : '#f8f8f8';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.4 + 0.2; // Further reduced opacity
        star.style.boxShadow = `0 0 ${size / 2}px rgba(255, 255, 255, 0.5)`; // Significantly reduced glow
        starsLayer.appendChild(star);
      }
    }

    // Simplified parallax effect - disabled on mobile for performance
    if (!isMobile) {
      window.addEventListener('mousemove', (e) => {
        const layers = document.querySelectorAll('.stars-layer');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        layers.forEach((layer, index) => {
          const speed = (2 - index) * 10; // Further reduced speed
          const offsetX = (x - 0.5) * speed;
          const offsetY = (y - 0.5) * speed;
          layer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
      });
    }
    
    // Créer un nouvel event listener pour le resize
    starsResizeListener = () => {
      // Débouncer pour éviter trop d'appels
      clearTimeout(starsResizeListener.timeout);
      starsResizeListener.timeout = setTimeout(() => {
        initStarsBackground();
      }, 250);
    };
    
    window.addEventListener('resize', starsResizeListener);
  };

  // Fonction pour nettoyer les étoiles
  const cleanupStars = () => {
    // Supprimer le conteneur existant s'il existe
    if (starsContainer && starsContainer.parentNode) {
      starsContainer.parentNode.removeChild(starsContainer);
      starsContainer = null;
    }
    
    // Supprimer l'ancien event listener de resize s'il existe
    if (starsResizeListener) {
      window.removeEventListener('resize', starsResizeListener);
      clearTimeout(starsResizeListener.timeout);
      starsResizeListener = null;
    }
  };

  /**
   * Animates each `.progress-fill` bar from 0 to its target width (read from the
   * `--progress-width` custom property) the first time it scrolls into view,
   * then stops observing it — the animation plays once per page load.
   */
  const initSkillBarsAnimation = () => {
    const progressBars = document.querySelectorAll('.progress-fill');
    if (!progressBars.length) return;

    const animateProgressBar = (bar) => {
      const width = bar.style.getPropertyValue('--progress-width');
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.transition = 'width 1s ease-out';
        bar.style.width = width;
      }, 100);
    };

    // Intersection observer for skills section
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          animateProgressBar(progressBar);
          observer.unobserve(progressBar);
        }
      });
    }, { threshold: 0.2 });

    progressBars.forEach(bar => {
      observer.observe(bar);
    });
  };

  // Scrolling terminal line
  const initScrollingTerminalLine = () => {
    const terminalOutputs = document.querySelectorAll('.terminal-output');
    if (!terminalOutputs.length) return;

    terminalOutputs.forEach(terminal => {
      const cursor = document.createElement('span');
      cursor.className = 'terminal-cursor inline-block w-2 h-4 bg-gray-600 dark:bg-gray-400 ml-1 animate-blink';
      const commandLine = terminal.querySelector('.command-line');
      if (commandLine) {
        commandLine.appendChild(cursor);
      }
    });
  };

  // Variable globale pour gérer les particules
  let particlesCanvas = null;
  let particlesAnimationId = null;
  let particlesResizeListener = null;

  /**
   * Draws a lightweight drifting-particle field on a full-viewport canvas, sized
   * proportionally to screen area (capped at 30 particles). Skipped entirely below
   * 768px — `init()` never calls it on mobile, and the resize handler here also
   * tears it down if the window is resized down past that breakpoint.
   */
  const initSpaceParticles = () => {
    // Early exit on small screens to avoid performance issues
    if (window.innerWidth < 768) {
      cleanupParticles();
      return; // Don't create particles on mobile at all
    }

    // Nettoyer les particules existantes
    cleanupParticles();

    particlesCanvas = document.createElement('canvas');
    particlesCanvas.id = 'space-particles';
    particlesCanvas.className = 'fixed top-0 left-0 w-full h-full pointer-events-none z-0';
    document.body.prepend(particlesCanvas);

    const ctx = particlesCanvas.getContext('2d');
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;

    // Resize handler
    particlesResizeListener = () => {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
      
      // Remove canvas entirely if resized to mobile dimensions
      if (window.innerWidth < 768) {
        cleanupParticles();
        return;
      }
    };
    
    window.addEventListener('resize', particlesResizeListener);

    // Significantly reduced particle count based on screen size
    const screenArea = particlesCanvas.width * particlesCanvas.height;
    const baseCount = 30; // Further reduced from 50
    const particleCount = Math.min(Math.floor(screenArea / 40000), baseCount);

    // Particles
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 0.8 + 0.3; // Even smaller particles
        this.speedX = (Math.random() - 0.5) * 0.2; // Even slower movement
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`; // Even less bright
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = particlesCanvas.width;
        if (this.x > particlesCanvas.width) this.x = 0;
        if (this.y < 0) this.y = particlesCanvas.height;
        if (this.y > particlesCanvas.height) this.y = 0;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop with reference for potential cancellation
    const animate = () => {
      ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      particlesAnimationId = requestAnimationFrame(animate);
    };
    
    animate();
  };

  // Fonction pour nettoyer les particules
  const cleanupParticles = () => {
    // Arrêter l'animation
    if (particlesAnimationId) {
      cancelAnimationFrame(particlesAnimationId);
      particlesAnimationId = null;
    }
    
    // Supprimer le canvas
    if (particlesCanvas && particlesCanvas.parentNode) {
      particlesCanvas.parentNode.removeChild(particlesCanvas);
      particlesCanvas = null;
    }
    
    // Supprimer l'event listener
    if (particlesResizeListener) {
      window.removeEventListener('resize', particlesResizeListener);
      particlesResizeListener = null;
    }
  };

  // Section transitions
  const initSectionTransitions = () => {
    const sections = document.querySelectorAll('section');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(section);
    });
  };

  // Rocket launch animation styles
  const addRocketLaunchStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rocket-launch {
        0% { transform: translateY(0) rotate(0deg); }
        30% { transform: translateY(-20px) rotate(5deg); }
        70% { transform: translateY(-60px) rotate(0deg); }
        100% { transform: translateY(-100px) rotate(-5deg) scale(0.8); opacity: 0; }
      }
      @keyframes rocket-float {
        0% { transform: translateY(0); }
        100% { transform: translateY(-10px); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .animate-blink {
        animation: blink 1s infinite;
      }
      .stars-container {
        overflow: hidden;
      }
      .stars-layer {
        transition: transform 0.5s ease-out;
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Injects a small fixed moon button (hidden below `md`) bottom-right; clicking it
   * plays a pop animation and smooth-scrolls the page back to top. Craters are a few
   * randomly placed decorative divs, purely cosmetic.
   */
  const initInteractiveMoon = () => {
    const moonContainer = document.createElement('div');
    // Make the moon responsive - hidden on small screens, visible on md and up
    moonContainer.className = 'moon-container fixed bottom-5 right-5 z-40 hidden md:block';
    
    const moon = document.createElement('div');
    // Smaller moon
    moon.className = 'moon w-12 h-12 rounded-full bg-gray-200 shadow-inner cursor-pointer transition-transform duration-300';
    moon.style.backgroundImage = 'radial-gradient(circle at 30% 30%, #f5f5f5, #e0e0e0)';
    moon.style.boxShadow = 'inset -3px -3px 8px rgba(0,0,0,0.2), 0 0 15px rgba(255,255,255,0.4)';
    
    moon.addEventListener('mouseenter', () => {
      moon.style.transform = 'scale(1.1)';
    });
    
    moon.addEventListener('mouseleave', () => {
      moon.style.transform = 'scale(1)';
    });
    
    moon.addEventListener('click', () => {
      // Animate moon on click
      moon.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(0.9)' },
        { transform: 'scale(1.1)' },
        { transform: 'scale(1)' }
      ], {
        duration: 300,
        easing: 'ease-out'
      });
      
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    moonContainer.appendChild(moon);
    document.body.appendChild(moonContainer);
    
    // Create only 3 craters
    for (let i = 0; i < 3; i++) {
      const crater = document.createElement('div');
      crater.className = 'crater absolute rounded-full bg-gray-300';
      const size = Math.random() * 3 + 2; // Smaller craters
      crater.style.width = `${size}px`;
      crater.style.height = `${size}px`;
      crater.style.left = `${Math.random() * 70 + 15}%`;
      crater.style.top = `${Math.random() * 70 + 15}%`;
      crater.style.boxShadow = 'inset 1px 1px 2px rgba(0,0,0,0.3)';
      moon.appendChild(crater);
    }
  };

  /**
   * Wires up every hero/decoration feature on DOMContentLoaded. Particles are skipped
   * on mobile (<768px) for performance; the other features self-adjust to viewport
   * size internally instead of being gated here.
   */
  const init = () => {
    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    
    addRocketLaunchStyles();
    initThemeToggle();
    initTypewriterEffect();
    initRocketMessageAnimation();
    initRocketHoverEffect();
    
    // Only initialize stars on larger screens or with reduced count on mobile
    initStarsBackground();
    
    initSkillBarsAnimation();
    initScrollingTerminalLine();
    
    // Only initialize particles on larger screens
    if (!isMobile) {
      initSpaceParticles();
    }
    
    initSectionTransitions();
    initInteractiveMoon();
  };

  // Run initialization on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', init);
})();
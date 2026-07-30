// Global variables
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const volumeSlider = document.getElementById('volumeSlider');
const canvas = document.getElementById('fireworksCanvas');
const particlesCanvas = document.getElementById('particlesCanvas');

let musicInterval;
let fireworksInterval;
let confettiInterval;
let starsInterval;
let heartsInterval;
let balloonsInterval;
let currentScreen = 'landing';
let screenTransition = false;
let mouseParticles = [];
let audioContext, analyser, source;
let particleAnimationFrame;
let mouseAnimationFrame;
let isInitialized = false;

// Initialize Audio Context for better sound
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        source.connect(audioContext.destination);
        return true;
    } catch (e) {
        console.log('Web Audio API not supported:', e);
        return false;
    }
}

// Setup music system with better control
function setupMusicControls() {
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const muteIcon = document.querySelector('.mute-icon');

    // Set initial volume
    audio.volume = volumeSlider.value;

    // Volume slider event
    volumeSlider.addEventListener('input', function(e) {
        audio.volume = e.target.value;
    });

    // Music button toggle
    musicBtn.addEventListener('click', function() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }

        if (musicBtn.classList.contains('playing')) {
            audio.pause();
            musicBtn.classList.remove('playing');
        } else {
            audio.play().catch(e => {
                console.log('Audio playback failed:', e);
            });
            musicBtn.classList.add('playing');
        }

        musicBtn.classList.toggle('muted', !musicBtn.classList.contains('muted'));
    });

    // Attempt to play first user gesture
    document.addEventListener('click', function initAudioOnFirstClick() {
        if (!isInitialized) {
            audio.play().then(() => {
                isInitialized = true;
            }).catch(e => {
                console.log('Auto-play prevented:', e);
            });
        }
        document.removeEventListener('click', initAudioOnFirstClick);
    }, { once: true });

    // Double click to skip to next celebration
    document.addEventListener('dblclick', function() {
        if (currentScreen === 'gift' && !screenTransition) {
            skipToCelebration();
        }
    });
}

// Screen transition system
function showScreen(screenId) {
    if (screenTransition) return;

    screenTransition = true;
    const currentScreenEl = document.querySelector('.screen.active');
    const targetScreen = document.getElementById(screenId + 'Screen');

    // Fade out current screen
    currentScreenEl.classList.remove('active');
    currentScreenEl.classList.add('transitioning');

    // Small delay for smooth transition
    setTimeout(() => {
        // Fade in target screen
        targetScreen.classList.add('active');
        targetScreen.classList.remove('hidden');

        // Reset transition flag
        setTimeout(() => {
            screenTransition = false;
        }, 800);
    }, 100);

    currentScreen = screenId;
    // Trigger resize events for responsive adjustments
    setTimeout(() => window.dispatchEvent(new Event('resize')), 850);
}

// Smooth fade-in effect for initial page load
function initPageLoad() {
    const wrapper = document.getElementById('mainWrapper');
    const mainTitle = document.getElementById('mainTitle');
    const subtitle = document.getElementById('subtitle');

    // Initial state - hidden from view
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'scale(0.9)';

    // Animate in after small delay
    setTimeout(() => {
        wrapper.style.transition = 'all 1s ease-in-out';
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'scale(1)';

        // Remove loading overlay
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loadingOverlay');
            loadingOverlay.classList.add('hidden');

            // Initialize all background animations after loading
            initBackgroundAnimations();

            // Start the celebration sequence
            startCelebrationSequence();

            // Reveal title after 2.6 seconds
            setTimeout(() => {
                mainTitle.classList.remove('hidden-title');
                mainTitle.style.animation = 'titleReveal 2s ease-out';
                mainTitle.style.opacity = '1';

                setTimeout(() => {
                    subtitle.classList.remove('hidden-subtitle');
                    subtitle.style.animation = 'subtitleReveal 2s ease-out 0.5s forwards';
                    subtitle.style.opacity = '1';
                }, 500);
            }, 2600);
        }, 800);
    }, 100);
}

// Create floating balloons
function initBalloons() {
    const container = document.getElementById('floatingDecorations');
    const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.style.backgroundColor = color;
        balloon.style.width = `${Math.random() * 40 + 30}px`;
        balloon.style.height = `${Math.random() * 60 + 50}px`;
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
        balloon.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px ${color}40`;

        container.appendChild(balloon);

        animateObject(balloon, {
            duration: Math.random() * 8 + 5,
            properties: [{
                name: 'y',
                start: -50,
                end: window.innerHeight + 100
            }, {
                name: 'x',
                start: 0,
                end: Math.random() * 40 - 20
            }],
            animation: 'linear'
        });
    }

    balloonsInterval = setInterval(() => {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.style.backgroundColor = color;
        balloon.style.width = `${Math.random() * 40 + 30}px`;
        balloon.style.height = `${Math.random() * 60 + 50}px`;
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
        balloon.style.boxShadow = `0 0 ${Math.random() * 20 + 10}px ${color}40`;

        container.appendChild(balloon);

        animateObject(balloon, {
            duration: Math.random() * 8 + 5,
            properties: [{
                name: 'y',
                start: -50,
                end: window.innerHeight + 100
            }, {
                name: 'x',
                start: 0,
                end: Math.random() * 40 - 20
            }, {
                name: 'rotation',
                start: 0,
                end: Math.random() * 360
            }],
            animation: 'linear'
        });

        setTimeout(() => balloon.remove(), 12000);
    }, 1500);
}

// Create twinkling stars
function initStars() {
    const container = document.getElementById('floatingDecorations');

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.backgroundColor = ['#FFFFFF', '#FFFFE0', '#FFE4B5', '#FFD700'][Math.floor(Math.random() * 4)];
        star.style.borderRadius = '50%';
        star.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${star.style.backgroundColor}80`;

        container.appendChild(star);

        animateObject(star, {
            duration: Math.random() * 6 + 3,
            properties: [{
                name: 'opacity',
                start: 0.2,
                end: 1
            }, {
                name: 'scale',
                start: 0.5,
                end: 1.5
            }],
            animation: 'ease-in-out',
            repeat: true,
            direction: 'alternate'
        });
    }

    starsInterval = setInterval(() => {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.backgroundColor = ['#FFFFFF', '#FFFFE0', '#FFE4B5', '#FFD700'][Math.floor(Math.random() * 4)];
        star.style.borderRadius = '50%';
        star.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${star.style.backgroundColor}80`;

        container.appendChild(star);

        animateObject(star, {
            duration: Math.random() * 6 + 3,
            properties: [{
                name: 'opacity',
                start: 0.2,
                end: 1
            }, {
                name: 'scale',
                start: 0.5,
                end: 1.5
            }],
            animation: 'ease-in-out',
            repeat: true,
            direction: 'alternate'
        });

        setTimeout(() => star.remove(), 6000);
    }, 2000);
}

// Create floating hearts
function initHearts() {
    heartsInterval = setInterval(() => {
        if (Math.random() > 0.7) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '💖';
            heart.style.fontSize = `${Math.random() * 20 + 15}px`;
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.position = 'fixed';
            heart.style.top = `${window.innerHeight - 50}px`;
            document.body.appendChild(heart);

            animateObject(heart, {
                duration: Math.random() * 5 + 3,
                properties: [{
                    name: 'y',
                    start: window.innerHeight - 50,
                    end: -100
                }, {
                    name: 'x',
                    start: 0,
                    end: Math.random() * 40 - 20
                }, {
                    name: 'rotation',
                    start: 0,
                    end: Math.random() * 360
                }, {
                    name: 'opacity',
                    start: 1,
                    end: 0
                }],
                animation: 'linear'
            });

            setTimeout(() => heart.remove(), 8000);
        }
    }, 3000);
}

// Create confetti pieces
function initConfetti() {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#FF1493'];

    confettiInterval = setInterval(() => {
        for (let i = 0; i < 3; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.width = `${Math.random() * 8 + 5}px`;
            confetti.style.height = `${Math.random() * 8 + 5}px`;
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.position = 'fixed';
            confetti.style.top = '-20px';
            document.body.appendChild(confetti);

            animateObject(confetti, {
                duration: Math.random() * 8 + 4,
                properties: [{
                    name: 'y',
                    start: -20,
                    end: window.innerHeight + 100
                }, {
                    name: 'x',
                    start: 0,
                    end: Math.random() * 60 - 30
                }, {
                    name: 'rotation',
                    start: 0,
                    end: Math.random() * 720
                }, {
                    name: 'opacity',
                    start: 1,
                    end: 0
                }],
                animation: 'linear'
            });

            setTimeout(() => confetti.remove(), 12000);
        }
    }, 2000);
}

// Create fireworks
function initFireworks() {
    const ctx = canvas.getContext('2d');
    const particles = [];
    let fireworksIntervalId;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Firework particle class
    class FireworkParticle {
        constructor(x, y, color, speed) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.speed = speed;
            this.angle = Math.random() * Math.PI * 2;
            this.size = Math.random() * 3 + 1;
            this.gravity = 0.05;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.life = 100;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.life--;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life / 100;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        explode() {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    particles.push(new FireworkParticle(this.x, this.y, this.color, Math.random() * 8 + 3));
                }, i * 20);
            }
        }
    }

    // Celebration firework
    function launchFirework() {
        if (currentScreen === 'celebration') {
            const x = Math.random() * canvas.width;
            const colors = ['#FF0000', '#FF69B4', '#FFD700', '#00FFFF', '#FF1493'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const fw = new FireworkParticle(x, canvas.height - 100, color, Math.random() * 15 + 10);
            fw.explode();
        }
    }

    function animateFireworks() {
        if (currentScreen === 'celebration') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                if (particles[i].life <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    }

    // Start fireworks loop
    fireworksIntervalId = setInterval(() => {
        if (currentScreen === 'gift' && !screenTransition) {
            launchFirework();
        } else if (currentScreen === 'celebration') {
            const intensity = Math.random() > 0.7 ? 2 : 1;
            for (let i = 0; i < intensity; i++) {
                launchFirework();
            }
        }
    }, 2000);

    // Start particle animation loop
    function animateFireworksLoop() {
        animateFireworks();
        particleAnimationFrame = requestAnimationFrame(animateFireworksLoop);
    }

    animateFireworksLoop();

    return () => {
        clearInterval(fireworksIntervalId);
        cancelAnimationFrame(particleAnimationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
}

// Create interactive mouse particles
function initMouseParticles() {
    const container = document.getElementById('interactiveParticles');

    document.addEventListener('mousemove', function(e) {
        if (currentScreen === 'celebration') return;

        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'mouse-particle';
            particle.style.width = `${Math.random() * 6 + 3}px`;
            particle.style.height = particle.style.width;
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            particle.style.backgroundColor = ['#FFD700', '#FF69B4', '#00FFFF', '#9370DB'][Math.floor(Math.random() * 4)];
            particle.style.borderRadius = '50%';
            particle.style.position = 'fixed';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '99';
            document.body.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 2;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;

            let posX = e.clientX;
            let posY = e.clientY;

            animateObject(particle, {
                duration: 1000,
                properties: [{
                    name: 'x',
                    start: posX,
                    end: posX + dx * 50
                }, {
                    name: 'y',
                    start: posY,
                    end: posY + dy * 50
                }, {
                    name: 'opacity',
                    start: 1,
                    end: 0
                }, {
                    name: 'scale',
                    start: 1,
                    end: 0
                }],
                animation: 'linear'
            });

            setTimeout(() => particle.remove(), 1000);
        }
    });

    document.addEventListener('click', function(e) {
        if (currentScreen === 'celebration') return;

        // Create sparkle effect
        createSparkles(e.clientX, e.clientY);
    });

    function createSparkles(x, y) {
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.innerHTML = '✨';
            sparkle.style.fontSize = `${Math.random() * 20 + 10}px`;
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.position = 'fixed';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '100';
            document.body.appendChild(sparkle);

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 8 + 3;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;

            animateObject(sparkle, {
                duration: 500 + Math.random() * 500,
                properties: [{
                    name: 'x',
                    start: x,
                    end: x + dx * 100
                }, {
                    name: 'y',
                    start: y,
                    end: y + dy * 100
                }, {
                    name: 'opacity',
                    start: 1,
                    end: 0
                }, {
                    name: 'rotation',
                    start: 0,
                    end: Math.random() * 720
                }],
                animation: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });

            setTimeout(() => sparkle.remove(), 1500);
        }
    }
}

// Create touch heart burst effect
function initTouchEffects() {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 10) {
            const heartBurstEffect = document.createElement('div');
            heartBurstEffect.style.position = 'fixed';
            heartBurstEffect.style.left = (touchStartX - 15) + 'px';
            heartBurstEffect.style.top = (touchStartY - 15) + 'px';
            heartBurstEffect.style.zIndex = '999';
            heartBurstEffect.style.pointerEvents = 'none';
            document.body.appendChild(heartBurstEffect);

            for (let i = 0; i < 20; i++) {
                createTouchHeart(heartBurstEffect, i);
            }

            setTimeout(() => heartBurstEffect.remove(), 1000);
        }
    });

    function createTouchHeart(container, index) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'absolute';
        heart.style.fontSize = `${Math.random() * 30 + 20}px`;
        heart.style.left = '0';
        heart.style.top = '0';
        const angle = (Math.PI * 2 * index) / 20 + (Math.random() - 0.5) * 0.5;
        const radius = Math.random() * 50 + 30;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        heart.style.transform = `translate(${x}px, ${y}px)`;
        heart.style.opacity = '0';
        container.appendChild(heart);

        animateObject(heart, {
            duration: 500 + Math.random() * 500,
            properties: [{
                name: 'opacity',
                start: 0,
                end: 1
            }, {
                name: 'scale',
                start: 0,
                end: 1
            }, {
                name: 'y',
                start: 0,
                end: -60 - Math.random() * 40
            }],
            animation: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });

        setTimeout(() => heart.remove(), 1500);
    }
}

// Gift box opening animation
function initGiftBox() {
    const giftBox = document.getElementById('giftBox');
    let isOpened = false;

    giftBox.addEventListener('click', function() {
        if (!isOpened && currentScreen === 'gift' && !screenTransition) {
            isOpened = true;

            // Add sparkle explosion effect
            createGiftSparkles();

            // Open gift box
            const lid = document.querySelector('.gift-lid');
            lid.style.transform = 'rotateX(-180deg)';
            lid.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            // Show surprise message
            setTimeout(() => {
                const surpriseMessage = document.getElementById('surpriseMessage');
                surpriseMessage.classList.add('active');

                // Show "kun happy birthday" popup
                setTimeout(() => {
                    const kunPopup = document.getElementById('kunPopup');
                    kunPopup.classList.remove('hidden');
                    kunPopup.classList.add('active');

                    // Close popup on click
                    kunPopup.addEventListener('click', function closePopup() {
                        kunPopup.classList.remove('active');
                        setTimeout(() => {
                            kunPopup.classList.add('hidden');
                        }, 500);
                        kunPopup.removeEventListener('click', closePopup);
                    });
                }, 500);

                // Launch fireworks
                if (fireworksInterval) {
                    clearInterval(fireworksInterval);
                }
                fireworksInterval = setInterval(() => {
                    if (currentScreen === 'celebration') {
                        launchFirework();
                    }
                }, 1000);

                // Show more balloons
                if (balloonsInterval) {
                    clearInterval(balloonsInterval);
                }
                initBalloons();

                // Show more hearts
                showMoreHearts();

                // Show more confetti
                showMoreConfetti();

                // Increase fireworks size
                increaseFireworksSize();

                // Transition to celebration
                setTimeout(() => {
                    showScreen('celebration');
                }, 3000);
            }, 800);
        }
    });

    function createGiftSparkles() {
        const sparkles = document.createElement('div');
        sparkles.style.position = 'fixed';
        sparkles.style.left = '50%';
        sparkles.style.top = '50%';
        sparkles.style.transform = 'translate(-50%, -50%)';
        sparkles.style.zIndex = '1000';
        sparkles.style.pointerEvents = 'none';
        document.body.appendChild(sparkles);

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.position = 'absolute';
                sparkle.style.fontSize = `${Math.random() * 30 + 20}px`;
                sparkle.style.left = '50%';
                sparkle.style.top = '50%';
                sparkle.style.transform = 'translate(-50%, -50%)';
                sparkle.style.opacity = '0';
                sparkle.style.transition = 'all 0.5s ease-out';
                sparkles.appendChild(sparkle);

                setTimeout(() => {
                    sparkle.style.opacity = '1';
                    sparkle.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg) scale(${Math.random() * 2})`;
                }, 10);

                setTimeout(() => sparkle.remove(), 500);
            }, i * 20);
        }

        setTimeout(() => sparkles.remove(), 2000);
    }

    function increaseFireworksSize() {
        console.log('Fireworks are getting bigger!');
    }
}

// Typewriter effect
function initTypewriter() {
    const text = "Today is your special day. May every dream come true. Thank you for being an amazing person. Enjoy every moment of your beautiful life. Happy Birthday!";
    const typewriterText = document.getElementById('typewriterText');
    let charIndex = 0;

    function typeCharacter() {
        if (charIndex < text.length) {
            typewriterText.textContent += text[charIndex];
            charIndex++;

            if (charIndex % 5 === 0) {
                createCharSparkles();
            }

            setTimeout(typeCharacter, Math.random() * 100 + 50);
        }
    }

    function createCharSparkles() {
        const sparkle = document.createElement('span');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'relative';
        sparkle.style.display = 'inline-block';
        sparkle.style.margin = '0 -2px';
        typewriterText.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 500);
    }

    setTimeout(() => {
        if (currentScreen === 'message') {
            typeCharacter();
        }
    }, 2000);
}

// Handle cake candles blowing out
function initCakeCandles() {
    const candles = document.querySelectorAll('.candle');
    let candlesBlown = false;

    function blowOutCandles() {
        if (!candlesBlown) {
            candles.forEach((candle, index) => {
                setTimeout(() => {
                    const flame = candle.querySelector('.flame');
                    const smoke = candle.querySelector('.smoke');

                    flame.style.animation = 'none';
                    flame.style.opacity = '0';
                    smoke.style.opacity = '0.8';
                }, index * 200);
            });

            candlesBlown = true;

            setTimeout(() => {
                const cakeMessage = document.getElementById('cakeMessage');
                cakeMessage.textContent = 'Wishes came true! 🎂';
                cakeMessage.style.color = '#FFD700';

                showMoreConfetti();

                setTimeout(() => {
                    showScreen('gift');
                }, 3000);
            }, 1500);
        }
    }

    setTimeout(blowOutCandles, 3000);
}

// More hearts
function showMoreHearts() {
    if (heartsInterval) clearInterval(heartsInterval);

    heartsInterval = setInterval(() => {
        if (Math.random() > 0.5) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '💖';
            heart.style.fontSize = `${Math.random() * 25 + 15}px`;
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.position = 'fixed';
            heart.style.top = `${window.innerHeight - 50}px`;
            document.body.appendChild(heart);

            animateObject(heart, {
                duration: Math.random() * 4 + 2,
                properties: [{
                    name: 'y',
                    start: window.innerHeight - 50,
                    end: -150
                }, {
                    name: 'x',
                    start: 0,
                    end: Math.random() * 60 - 30
                }, {
                    name: 'rotation',
                    start: 0,
                    end: Math.random() * 360
                }, {
                    name: 'opacity',
                    start: 1,
                    end: 0
                }],
                animation: 'linear'
            });

            setTimeout(() => heart.remove(), 6000);
        }
    }, 2000);
}

// More confetti
function showMoreConfetti() {
    if (confettiInterval) clearInterval(confettiInterval);

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#FF1493'];

    confettiInterval = setInterval(() => {
        for (let i = 0; i < 8; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.width = `${Math.random() * 12 + 8}px`;
            confetti.style.height = `${Math.random() * 12 + 8}px`;
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : Math.random() > 0.5 ? '0' : '5px';
            confetti.style.position = 'fixed';
            confetti.style.top = '-30px';
            document.body.appendChild(confetti);

            animateObject(confetti, {
                duration: Math.random() * 10 + 6,
                properties: [{
                    name: 'y',
                    start: -30,
                    end: window.innerHeight + 200
                }, {
                    name: 'x',
                    start: 0,
                    end: Math.random() * 120 - 60
                }, {
                    name: 'rotation',
                    start: 0,
                    end: Math.random() * 1080
                }, {
                    name: 'opacity',
                    start: 1,
                    end: 0
                }],
                animation: 'linear'
            });

            setTimeout(() => confetti.remove(), 15000);
        }
    }, 1000);
}

// Skip to celebration screen
function skipToCelebration() {
    showScreen('celebration');
}

// Animation utility function
function animateObject(element, options) {
    const startTime = Date.now();
    const duration = options.duration || 1000;
    const properties = options.properties || [];
    const animation = options.animation || 'linear';
    const repeat = options.repeat || 0;
    const direction = options.direction || 'normal';

    // Get initial styles
    const startValues = {};
    const endValues = {};
    properties.forEach(prop => {
        const computedStyle = getComputedStyle(element);
        let start = prop.start;
        let end = prop.end;

        if (typeof start === 'number') {
            start = parseFloat(start);
        }
        if (typeof end === 'number') {
            end = parseFloat(end);
        }

        if (prop.name.includes('x') || prop.name.includes('y') || prop.name === 'rotation' || prop.name === 'scale') {
            const currentTransform = computedStyle.transform || '';
            if (currentTransform && currentTransform !== 'none') {
                const transformMatch = currentTransform.match(/translate3d\\(([^)]+)\\)/);
                if (transformMatch) {
                    const coords = transformMatch[1].split(',').map(v => v.trim().replace('px', ''));
                    start = coords[0] || 0;
                } else if (currentTransform.includes('translate')) {
                    const translateMatch = currentTransform.match(/translateX\\(([^)]+)\\)/);
                    if (translateMatch) {
                        start = parseFloat(translateMatch[1]);
                    }
                }
            }

            startValues[prop.name] = start || 0;
            endValues[prop.name] = end;

            requestAnimationFrame(function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                let easeProgress = progress;
                switch (animation) {
                    case 'ease-in':
                        easeProgress = Math.pow(progress, 1.5);
                        break;
                    case 'ease-out':
                        easeProgress = 1 - Math.pow(1 - progress, 1.5);
                        break;
                    case 'ease-in-out':
                        easeProgress = progress < 0.5 ? Math.pow(progress * 2, 1.5) / 2 : 1 - Math.pow(1 - progress, 1.5) / 2;
                        break;
                    case 'cubic-bezier(0.175, 0.885, 0.32, 1.275)':
                        easeProgress = 1 - Math.pow(1 - progress, 3);
                        break;
                    case 'bounce':
                        if (progress < 0.5) {
                            easeProgress = 0.5 * Math.pow(progress * 2, 2);
                        } else {
                            easeProgress = 0.5 * (1 - Math.pow(1 - progress * 2, 2)) + 0.5;
                        }
                        break;
                }

                let transform = '';
                let opacity = element.style.opacity !== '' ? parseFloat(element.style.opacity) : 1;
                let filter = '';

                for (const prop of properties) {
                    const value = startValues[prop.name] + (endValues[prop.name] - startValues[prop.name]) * easeProgress;

                    switch (prop.name) {
                        case 'x':
                        case 'y':
                            transform += `translate${prop.name.toUpperCase()}(${value}px) `;
                            break;
                        case 'rotation':
                            transform += `rotate(${value}deg) `;
                            break;
                        case 'scale':
                            transform += `scale(${value}) `;
                            break;
                        case 'opacity':
                            opacity = value;
                            break;
                        case 'blur':
                            filter += `blur(${value}px) `;
                            break;
                        case 'brightness':
                            filter += `brightness(${value}) `;
                            break;
                        default:
                            element.style[prop.name] = value + (isNaN(value) ? '' : 'px');
                    }
                }

                if (transform) {
                    element.style.transform = transform.trim();
                }

                if (filter) {
                    element.style.filter = filter.trim();
                }

                element.style.opacity = opacity;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else if (repeat > 0) {
                    startTime = Date.now();
                    const currentRepeat = repeat - 1;
                    if (currentRepeat > 0) {
                        setTimeout(() => animateObject(element, {...options, repeat: currentRepeat}), 100);
                    }
                }
            });
        } else {
            element.style[prop.name] = start + (end - start) * progress + (isNaN(start) ? '' : 'px');
        }
    });
}

// Initialize all animations and effects
function initBackgroundAnimations() {
    initAudio();
    initBalloons();
    initStars();
    initHearts();
    initConfetti();
    initFireworks();
    initMouseParticles();
    initTouchEffects();
    initGiftBox();

    setTimeout(() => {
        showScreen('cake');
    }, 4600);

    setTimeout(() => {
        if (currentScreen === 'cake') {
            showScreen('message');
        }
    }, 9600);

    setTimeout(() => {
        if (currentScreen === 'message') {
            skipToCelebration();
        }
    }, 24600);
}

// Celebration sequence
function startCelebrationSequence() {
    setupMusicControls();
    initTypewriter();
    initCakeCandles();
    initShareButton();
}

// Handle window resize
function handleResize() {
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach(balloon => balloon.remove());

    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => heart.remove());

    const confetti = document.querySelectorAll('.confetti');
    confetti.forEach(piece => piece.remove());

    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.remove());

    initBalloons();
    initHearts();
    initConfetti();
    initStars();
}

window.addEventListener('resize', handleResize);

// Cleanup function
function cleanup() {
    clearInterval(musicInterval);
    clearInterval(fireworksInterval);
    clearInterval(confettiInterval);
    clearInterval(starsInterval);
    clearInterval(heartsInterval);
    clearInterval(balloonsInterval);

    if (particleAnimationFrame) {
        cancelAnimationFrame(particleAnimationFrame);
    }

    if (audioContext) {
        audioContext.close();
    }

    const fireworksCanvas = document.getElementById('fireworksCanvas');
    const particlesCanvas = document.getElementById('particlesCanvas');
    if (fireworksCanvas) {
        const ctx = fireworksCanvas.getContext('2d');
        ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    }

    if (particlesCanvas) {
        const ctx = particlesCanvas.getContext('2d');
        ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    }
}

// Share button functionality
function initShareButton() {
    const shareBtn = document.getElementById('shareBtn');

    shareBtn.addEventListener('click', function() {
        // Try to use the Web Share API
        if (navigator.share) {
            navigator.share({
                title: 'Happy Birthday!',
                text: 'Check out this amazing birthday celebration!',
                url: window.location.href
            }).catch(error => {
                console.log('Share failed:', error);
                fallbackShare();
            });
        } else {
            fallbackShare();
        }
    });

    function fallbackShare() {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            // Show a temporary notification
            showShareNotification('Link copied to clipboard! 📋');
        }).catch(err => {
            console.log('Failed to copy: ', err);
            showShareNotification('Right-click and copy the URL to share! 🔗');
        });
    }

    function showShareNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'share-notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '80px';
        notification.style.right = '30px';
        notification.style.background = 'var(--glass-bg)';
        notification.style.border = '2px solid var(--glass-border)';
        notification.style.borderRadius = '15px';
        notification.style.padding = '15px 25px';
        notification.style.backdropFilter = 'blur(10px)';
        notification.style.zIndex = '10000';
        notification.style.boxShadow = '0 10px 30px rgba(255, 215, 0, 0.5)';
        notification.style.animation = 'shareNotification 3s ease-in-out';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Add share notification animation to CSS
const shareNotificationStyle = document.createElement('style');
shareNotificationStyle.textContent = `
    @keyframes shareNotification {
        0% { transform: translateX(100%); opacity: 0; }
        10% { transform: translateX(0); opacity: 1; }
        90% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(shareNotificationStyle);

// Start everything
initPageLoad();

// Global cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Allow manual skip with spacebar
window.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && currentScreen === 'gift') {
        skipToCelebration();
    }
});

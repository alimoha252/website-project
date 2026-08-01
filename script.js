const canvas = document.getElementById('confetti');
const context = canvas.getContext('2d');
let pieces = [];
let frame;

function resize() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
function launch() {
  const colors = ['#e8a52d', '#df6d5b', '#5e8dc7', '#52a891', '#f7d978'];
  pieces = Array.from({ length: 170 }, () => ({ x: innerWidth / 2, y: innerHeight / 2, vx: (Math.random() - .5) * 13, vy: -Math.random() * 13 - 3, size: Math.random() * 8 + 4, color: colors[Math.floor(Math.random() * colors.length)], rotation: Math.random() * 6.3, spin: (Math.random() - .5) * .25, life: 1 }));
  cancelAnimationFrame(frame); animate();
}
function animate() {
  context.clearRect(0, 0, innerWidth, innerHeight);
  pieces.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .18; p.rotation += p.spin; p.life -= .009; context.save(); context.globalAlpha = Math.max(p.life, 0); context.translate(p.x, p.y); context.rotate(p.rotation); context.fillStyle = p.color; context.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * .66); context.restore(); });
  pieces = pieces.filter(p => p.life > 0 && p.y < innerHeight + 30);
  if (pieces.length) frame = requestAnimationFrame(animate);
}
resize(); addEventListener('resize', resize);
const messages = [
  'Guushaadu ha noqoto mid sii socota.',
  'Riyadaada waa kuu dhowdahay - sii wad!',
  'Waxaad tahay qof awood badan oo karti leh.',
  'Maanta waa adiga maalintaada. Hambalyo!'
];
let surpriseIndex = 0;
function showSurprise() {
  launch();
  return messages[surpriseIndex++ % messages.length];
}
function releaseBalloons() {
  const colors = ['#df6d8a', '#e8a52d', '#5e8dc7', '#df8067', '#52a891'];
  for (let index = 0; index < 12; index += 1) {
    const balloon = document.createElement('i');
    balloon.className = 'celebration-balloon';
    balloon.style.left = `${Math.random() * 90 + 4}%`;
    balloon.style.background = colors[index % colors.length];
    balloon.style.animationDelay = `${index * 85}ms`;
    document.body.appendChild(balloon);
    setTimeout(() => balloon.remove(), 6100);
  }
}
function launchFireworks() {
  const colors = ['#ffd45c', '#ff6e7b', '#75b9ff', '#7be3bb', '#e08cff', '#ffffff'];
  const container = document.getElementById('fireworks');
  const patterns = ['chrysanthemum', 'peony', 'willow', 'comet'];

  function burst(x, y, color, pattern) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;
    const smoke = document.createElement('i');
    smoke.className = 'firework-smoke';
    firework.appendChild(smoke);
    const core = document.createElement('i');
    core.className = 'firework-core';
    core.style.setProperty('--spark-color', color);
    firework.appendChild(core);
    const count = pattern === 'chrysanthemum' ? 68 : pattern === 'peony' ? 54 : 44;
    const radius = pattern === 'chrysanthemum' ? 345 : pattern === 'peony' ? 270 : 300;
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + (Math.random() - .5) * .11;
      const factor = .58 + Math.random() * .42;
      const spark = document.createElement('i');
      spark.className = 'firework-spark';
      spark.style.setProperty('--spark-color', index % 8 === 0 ? '#fff' : color);
      spark.style.setProperty('--spark-size', `${pattern === 'chrysanthemum' ? 8 : 7}px`);
      spark.style.setProperty('--burst-duration', `${pattern === 'willow' ? 2.55 : 1.7 + Math.random() * .55}s`);
      spark.style.setProperty('--spark-x', `${Math.cos(angle) * radius * factor}px`);
      spark.style.setProperty('--spark-y', `${Math.sin(angle) * radius * factor + (pattern === 'willow' ? 95 : 0)}px`);
      firework.appendChild(spark);
    }
    container.appendChild(firework);
    setTimeout(() => firework.remove(), 3500);
  }

  function launch(x, y, color, pattern, delay) {
    setTimeout(() => {
      const trail = document.createElement('div');
      trail.className = 'firework';
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
      const streak = document.createElement('i');
      streak.className = 'firework-trail';
      streak.style.setProperty('--spark-color', color);
      trail.appendChild(streak);
      container.appendChild(trail);
      setTimeout(() => { trail.remove(); burst(x, y - 155, color, pattern); }, 650);
    }, delay);
  }

  const launchPoints = [[.08,.88],[.22,.8],[.38,.92],[.52,.84],[.68,.9],[.84,.78],[.95,.88]];
  for (let wave = 0; wave < 4; wave += 1) {
    launchPoints.forEach(([x, y], index) => {
      if ((index + wave) % 2 === 0 || wave === 3) {
        launch(innerWidth * x, innerHeight * y, colors[(index + wave) % colors.length], patterns[(index + wave) % patterns.length], wave * 760 + index * 75);
      }
    });
  }
}
document.getElementById('celebrate').addEventListener('click', showSurprise);
function openGift() {
  const gift = document.getElementById('giftBox');
  gift.classList.add('open');
  gift.disabled = true;
  document.querySelector('.gift-hint').textContent = 'Hadiyaddii waa furantay!';
  const surpriseMessage = showSurprise();
  releaseBalloons();
  launchFireworks();
  const modal = document.getElementById('surpriseModal');
  document.getElementById('modalText').textContent = surpriseMessage;
  setTimeout(() => {
    modal.classList.add('show');
    setTimeout(() => modal.classList.remove('show'), 3800);
  }, 360);
}
document.getElementById('giftBox').addEventListener('click', openGift, { once: true });

document.getElementById('openGreeting').addEventListener('click', () => {
  document.body.classList.add('revealed');
  document.getElementById('welcome').classList.add('closed');
  setTimeout(launch, 250);
  setTimeout(() => {
    const loader = document.getElementById('galaxyLoader');
    loader.classList.add('show');
    setTimeout(() => document.getElementById('galaxyJoke').classList.add('show'), 2000);
    setTimeout(() => document.getElementById('whiteout').classList.add('show'), 4300);
  }, 10000);
});

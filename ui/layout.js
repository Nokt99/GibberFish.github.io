// ui/layout.js
window.GF = window.GF || {};

GF.createLayout = function (root) {
  const shell = document.createElement('div');
  shell.className = 'gf-shell';

  // -----------------------------
  // TOP BAR
  // -----------------------------
  const topbar = document.createElement('div');
  topbar.className = 'gf-topbar';

  const topLeft = document.createElement('div');
  topLeft.className = 'gf-top-left';

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'gf-back-btn';
  backBtn.innerHTML = '<span>⟵</span> Back';
  backBtn.style.display = 'none';

  // Logo
  const logo = document.createElement('div');
  logo.className = 'gf-logo';
  logo.innerHTML = `
    <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
      <defs>
        <linearGradient id="gf-g1" x1="0" x2="1">
          <stop offset="0" stop-color="#25f4ff"/>
          <stop offset="1" stop-color="#a855ff"/>
        </linearGradient>
      </defs>
      <path d="M8 32c8-12 28-12 36 0-8 12-28 12-36 0z" fill="url(#gf-g1)"/>
      <circle cx="44" cy="24" r="4" fill="#fff" opacity="0.95"/>
    </svg>
  `;

  // Title + tagline
  const titleWrap = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'gf-title';
  title.textContent = 'GibberFish';

  const tagline = document.createElement('div');
  tagline.className = 'gf-tagline';
  tagline.textContent = 'Session • The Fish Decides';

  titleWrap.appendChild(title);
  titleWrap.appendChild(tagline);

  topLeft.appendChild(backBtn);
  topLeft.appendChild(logo);
  topLeft.appendChild(titleWrap);

  // -----------------------------
  // TOP RIGHT
  // -----------------------------
  const topRight = document.createElement('div');
  topRight.className = 'gf-top-right';

  // Mode buttons container
  const modeButtons = document.createElement('div');
  modeButtons.className = 'gf-mode-buttons';

  // Chaos meter
  const meterWrap = document.createElement('div');
  meterWrap.className = 'gf-meter-wrap';

  const meterLabel = document.createElement('div');
  meterLabel.className = 'gf-meter-label';
  meterLabel.textContent = 'Chaos';

  const meter = document.createElement('div');
  meter.className = 'gf-meter';

  const meterFill = document.createElement('div');
  meterFill.className = 'gf-meter-fill';

  meter.appendChild(meterFill);
  meterWrap.appendChild(meterLabel);
  meterWrap.appendChild(meter);

  // Troll mode toggle
  const trollBtn = document.createElement('button');
  trollBtn.className = 'gf-troll-toggle';
  trollBtn.id = 'gf-troll-toggle';
  trollBtn.type = 'button';
  trollBtn.setAttribute('aria-pressed', 'false');
  trollBtn.textContent = 'Troll Mode';

  topRight.appendChild(modeButtons);
  topRight.appendChild(meterWrap);
  topRight.appendChild(trollBtn);

  topbar.appendChild(topLeft);
  topbar.appendChild(topRight);

  // -----------------------------
  // MAIN CONTENT AREA
  // -----------------------------
  const main = document.createElement('div');
  main.className = 'gf-main';

  // -----------------------------
  // BACKGROUND BUBBLES
  // -----------------------------
  const bubbles = document.createElement('div');
  bubbles.className = 'gf-bubbles';

  for (let i = 0; i < 8; i++) {
    const b = document.createElement('div');
    b.className = 'gf-bubble';

    const size = 40 + Math.random() * 80;
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = (Math.random() * 100) + '%';
    b.style.bottom = (-50 - Math.random() * 200) + 'px';
    b.style.animationDuration = (20 + Math.random() * 25) + 's';

    bubbles.appendChild(b);
  }

  // -----------------------------
  // ASSEMBLE LAYOUT
  // -----------------------------
  shell.appendChild(topbar);
  shell.appendChild(main);
  shell.appendChild(bubbles);
  root.appendChild(shell);

  // -----------------------------
  // PUBLIC API
  // -----------------------------
  return {
    shell,
    main,
    backBtn,
    modeButtons,
    meterFill,
    trollBtn,
    tagline,

    clearMain() {
      main.innerHTML = '';
    }
  };
};

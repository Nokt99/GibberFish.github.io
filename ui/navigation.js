// ui/navigation.js
window.GF = window.GF || {};

GF.createNavigation = function (layout) {
  const { backBtn, modeButtons, trollBtn, meterFill, tagline } = layout;

  let backHandler = null;
  let modeHandler = null;
  let activeMode = 'hub';

  // Mode buttons
  const modes = [
    { key: 'chaos', label: 'Chaos Mode' },
    { key: 'code', label: 'Code Mode' }
  ];

  const btns = new Map();

  modes.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'gf-mode-btn';
    btn.textContent = m.label;

    btn.addEventListener('click', () => {
      if (modeHandler) modeHandler(m.key);
    });

    modeButtons.appendChild(btn);
    btns.set(m.key, btn);
  });

  // Back button
  backBtn.addEventListener('click', () => {
    if (backHandler) backHandler();
  });

  // Show/hide troll button
  function setTrollVisible(visible) {
    trollBtn.style.display = visible ? 'inline-flex' : 'none';
  }

  // Update active mode UI
  function setActiveMode(key) {
    activeMode = key;

    backBtn.style.display = key === 'hub' ? 'none' : 'inline-flex';

    btns.forEach((b, k) => {
      b.classList.toggle('active', k === key);
    });

    if (key === 'hub') tagline.textContent = 'Choose your flavor of chaos';
    else if (key === 'chaos') tagline.textContent = 'Chaos Mode • Every letter is a drop';
    else if (key === 'code') tagline.textContent = 'Code Mode • Script the fish';
  }

  // Register callbacks
  function onBack(fn) { backHandler = fn; }
  function onModeSelect(fn) { modeHandler = fn; }

  // Chaos meter
  function setChaosMeter(percent) {
    const p = Math.max(0, Math.min(100, percent));
    meterFill.style.width = p + '%';
  }

  return {
    onBack,
    onModeSelect,
    setActiveMode,
    setChaosMeter,
    trollBtn,
    setTrollVisible
  };
};

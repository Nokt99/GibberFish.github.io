// app.js
window.GF = window.GF || {};

(function () {
  const root = document.getElementById('app-root');

  // Build layout + navigation
  const layout = GF.createLayout(root);
  const nav = GF.createNavigation(layout);

  // Lazy-loaded modes
  let hubMode = null;
  let chaosMode = null;
  let codeMode = null;

  function showMode(name) {
    layout.clearMain();
    nav.setActiveMode(name);

    if (name === 'hub') {
      if (!hubMode) hubMode = GF.createHubMode(layout.main, { onSelectMode });
      hubMode.show();
    }

    if (name === 'chaos') {
      if (!chaosMode) chaosMode = GF.createChaosMode(layout.main, nav);
      chaosMode.show();
    }

    if (name === 'code') {
      if (!codeMode) codeMode = GF.createCodeMode(layout.main, nav);
      codeMode.show();
    }
  }

  function onSelectMode(name) {
    showMode(name);
  }

  // Navigation events
  nav.onBack(() => showMode('hub'));
  nav.onModeSelect((name) => showMode(name));

  // Start at the hub
  showMode('hub');
})();

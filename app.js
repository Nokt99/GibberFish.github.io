// app.js
import { createLayout } from './ui/layout.js';
import { createNavigation } from './ui/navigation.js';
import { createHubMode } from './modes/mode-hub.js';
import { createChaosMode } from './modes/chaos-mode.js';
import { createCodeMode } from './modes/code-mode.js';

const root = document.getElementById('app-root');

// App layout
const layout = createLayout(root);
const nav = createNavigation(layout);

// Mode instances (lazy-created)
let hubMode = null;
let chaosMode = null;
let codeMode = null;

function showMode(name) {
  // clear content area
  layout.clearMain();

  // update nav active state
  nav.setActiveMode(name);

  if (name === 'hub') {
    if (!hubMode) hubMode = createHubMode(layout.main, { onSelectMode });
    hubMode.show();
  } else if (name === 'chaos') {
    if (!chaosMode) chaosMode = createChaosMode(layout.main, nav);
    chaosMode.show();
  } else if (name === 'code') {
    if (!codeMode) codeMode = createCodeMode(layout.main, nav);
    codeMode.show();
  }
}

function onSelectMode(name) {
  showMode(name);
}

// wired navigation
nav.onBack(() => showMode('hub'));
nav.onModeSelect((name) => showMode(name));

// start at hub
showMode('hub');

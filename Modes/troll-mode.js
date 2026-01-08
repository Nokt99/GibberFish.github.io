// modes/troll-mode.js
// Troll Mode controller for Chaos Mode.

export function createTrollController({ onLog, onSpawn }) {
  let enabled = false;

  function setEnabled(v) {
    enabled = !!v;
    onLog(`[GF] Troll Mode ${enabled ? 'ON' : 'OFF'}`);
  }

  function isEnabled() {
    return enabled;
  }

  function maybeTriggerRandom() {
    if (!enabled) return;
    if (Math.random() < 0.02) prankOverlay();
    if (Math.random() < 0.12) fakeCall();
    if (Math.random() < 0.12) fakePrinter();
  }

  function fakePrinter() {
    onLog('[GF-PRINTER] Connecting to BlubJet 3000...');
    setTimeout(() => {
      onSpawn({ type: 'printer', title: 'BlubJet Log', letter: '?', rarity: 'uncommon', payload: { text: 'Printed: mysterious receipt' } });
      onLog('[GF-PRINTER] Print job complete.');
    }, 800);
  }

  function fakeCall() {
    onLog('[GF-PHONE] Incoming call from Deep Sea Caller...');
    onSpawn({ type: 'call', title: 'Deep Sea Caller', letter: '?', rarity: 'uncommon', payload: { name: 'Deep Sea Caller' } });
    setTimeout(() => onLog('[GF-PHONE] Call ended.'), 2600);
  }

  function prankOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'gf-prank-overlay';
    overlay.textContent = 'YOU GOT TROLLED LOL';
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.textContent = 'jk';
      setTimeout(() => overlay.remove(), 1200);
    }, 3000);
  }

  return {
    setEnabled,
    isEnabled,
    maybeTriggerRandom,
    prankOverlay,
    fakePrinter,
    fakeCall
  };
}

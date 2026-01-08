// ui/renderer.js
import { renderArtifactCard, renderLogCard } from './cards.js';

export function createChaosRenderer(outputEl) {
  function addArtifact(artifact) {
    const card = renderArtifactCard(artifact);
    outputEl.prepend(card);
  }

  function addLog(message) {
    const card = renderLogCard(message);
    outputEl.prepend(card);
  }

  function clear() {
    outputEl.innerHTML = '';
  }

  return { addArtifact, addLog, clear };
}

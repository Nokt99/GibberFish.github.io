// ui/renderer.js
window.GF = window.GF || {};

GF.createRenderer = function (container) {
  const root = container;

  // Clear all content
  function clear() {
    root.innerHTML = '';
  }

  // Render a single card with animation
  function renderCard(cardEl) {
    cardEl.classList.add('gf-card-appear');
    root.appendChild(cardEl);

    // Force reflow for animation
    void cardEl.offsetWidth;
    cardEl.classList.add('gf-card-appear-active');

    scrollToBottom();
  }

  // Render multiple cards
  function renderCards(list) {
    list.forEach((card) => renderCard(card));
  }

  // Render a log card (Code Mode)
  function log(message, type) {
    const card = GF.renderLogCard(message, type);
    renderCard(card);
  }

  // Auto-scroll to bottom
  function scrollToBottom() {
    setTimeout(() => {
      root.scrollTop = root.scrollHeight;
    }, 10);
  }

  return {
    clear,
    renderCard,
    renderCards,
    log,
    scrollToBottom
  };
};

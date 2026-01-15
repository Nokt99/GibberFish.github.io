// modes/chaos-mode.js
window.GF = window.GF || {};

GF.createChaosMode = function (container, nav) {
  const engine = new GF.ChaosEngine();
  const renderer = GF.createRenderer(container);
  const sandbox = GF.createSandbox();
  const troll = GF.createTrollMode(nav);

  let root = null;
  let input = null;

  function show() {
    container.innerHTML = '';

    root = document.createElement('div');
    root.className = 'gf-chaos';

    // Input area
    const inputWrap = document.createElement('div');
    inputWrap.className = 'gf-chaos-input-wrap';

    input = document.createElement('textarea');
    input.className = 'gf-chaos-input';
    input.placeholder = 'Type to generate chaos…';

    input.addEventListener('input', onInput);

    inputWrap.appendChild(input);
    root.appendChild(inputWrap);

    // Output area
    const output = document.createElement('div');
    output.className = 'gf-chaos-output';
    root.appendChild(output);

    renderer.clear();
    renderer.scrollToBottom();

    container.appendChild(root);
  }

  // Handle typing
  function onInput() {
    const text = input.value;
    engine.setLetters(text);

    // Update chaos meter
    const percent = Math.min(100, text.length * 5);
    nav.setChaosMeter(percent);

    // Generate new artifacts
    const drops = engine.generateDrops();

    // Render each artifact
    drops.forEach((artifact) => {
      const card = GF.renderCard(artifact);
      renderer.renderCard(card);

      // Execute code fragments
      if (artifact.type === 'code') {
        runCode(artifact.payload.code);
      }
    });

    // Troll mode effect
    if (troll.isEnabled()) {
      maybeTroll();
    }
  }

  // Execute code in sandbox
  function runCode(code) {
    sandbox.run(code).then((res) => {
      if (!res.ok) {
        const card = GF.renderLogCard('Error: ' + res.error, 'error');
        renderer.renderCard(card);
      }
    });
  }

  // Troll mode random events
  function maybeTroll() {
    if (Math.random() < 0.15) {
      const msg = [
        'The fish is judging you.',
        'Blub… interesting choice.',
        'Your keyboard smells like chaos.',
        'The fish whispers: “type faster.”'
      ];

      const card = GF.renderLogCard(
        msg[Math.floor(Math.random() * msg.length)],
        'troll'
      );

      renderer.renderCard(card);
    }
  }

  return {
    show
  };
};

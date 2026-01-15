// modes/code-mode.js
window.GF = window.GF || {};

GF.createCodeMode = function (container, nav) {
  const sandbox = GF.createSandbox();
  const troll = GF.createTrollMode(nav);

  let root = null;
  let input = null;
  let output = null;
  let renderer = null;

  function show() {
    container.innerHTML = '';

    root = document.createElement('div');
    root.className = 'gf-code';

    // Input area
    const inputWrap = document.createElement('div');
    inputWrap.className = 'gf-code-input-wrap';

    input = document.createElement('textarea');
    input.className = 'gf-code-input';
    input.placeholder = 'Write GibberFish script…';

    inputWrap.appendChild(input);
    root.appendChild(inputWrap);

    // Run button
    const runBtn = document.createElement('button');
    runBtn.className = 'gf-code-run-btn';
    runBtn.textContent = 'Run Script';
    runBtn.addEventListener('click', runScript);
    root.appendChild(runBtn);

    // Output area
    output = document.createElement('div');
    output.className = 'gf-code-output';
    root.appendChild(output);

    renderer = GF.createRenderer(output);
    renderer.clear();

    container.appendChild(root);
  }

  // Run the script
  function runScript() {
    const text = input.value.trim();
    if (!text) {
      renderer.log('No script to run.', 'error');
      return;
    }

    renderer.clear();
    renderer.log('Interpreting script…', 'info');

    let actions;
    try {
      actions = GF.interpretGibberfishCode(text);
    } catch (e) {
      renderer.log('Parser error: ' + e, 'error');
      return;
    }

    if (!actions || actions.length === 0) {
      renderer.log('No valid GibberFish blocks found.', 'error');
      return;
    }

    executeActions(actions);
  }

  // Execute parsed actions sequentially
  async function executeActions(actions) {
    for (const action of actions) {
      switch (action.type) {
        case 'image':
          await execImage(action);
          break;

        case 'iframe':
          await execIframe(action);
          break;

        case 'raw-code':
          await execRawCode(action);
          break;

        case 'random-code':
          await execRandomCode(action);
          break;

        default:
          renderer.log('Unknown action: ' + action.type, 'error');
      }

      // Troll mode spice
      if (troll.isEnabled()) maybeTroll();
    }

    renderer.log('Script finished.', 'success');
  }

  // -----------------------------
  // ACTION EXECUTORS
  // -----------------------------

  async function execImage(action) {
    const card = document.createElement('div');
    card.className = 'gf-code-image-card';

    const img = document.createElement('img');
    img.src = action.url;
    img.className = 'gf-code-image';

    card.appendChild(img);

    applyPlacement(card, action.meta);
    renderer.renderCard(card);

    if (action.meta.rigSeconds) {
      await wait(action.meta.rigSeconds * 1000);
    }
  }

  async function execIframe(action) {
    const card = document.createElement('div');
    card.className = 'gf-code-iframe-card';

    const frame = document.createElement('iframe');
    frame.src = action.url;
    frame.className = 'gf-code-iframe';

    card.appendChild(frame);

    applyPlacement(card, action.meta);
    renderer.renderCard(card);

    if (action.meta.rigSeconds) {
      await wait(action.meta.rigSeconds * 1000);
    }
  }

  async function execRawCode(action) {
    renderer.log('Running code block…', 'info');

    const res = await sandbox.run(action.code);
    if (!res.ok) {
      renderer.log('Error: ' + res.error, 'error');
    } else {
      renderer.log('Code executed.', 'success');
    }
  }

  async function execRandomCode() {
    const samples = [
      'GF.log("blub");',
      'GF.emit("colorShift", {hue: Math.random()*360});',
      'GF.spawn({type:"meme",text:"Random Fish"});'
    ];

    const code = samples[Math.floor(Math.random() * samples.length)];

    renderer.log('Running random code…', 'info');
    const res = await sandbox.run(code);

    if (!res.ok) {
      renderer.log('Error: ' + res.error, 'error');
    } else {
      renderer.log('Random code executed.', 'success');
    }
  }

  // -----------------------------
  // HELPERS
  // -----------------------------

  function applyPlacement(card, meta) {
    if (!meta || !meta.placement) return;

    const p = meta.placement.toLowerCase();

    if (p.includes('left')) card.style.alignSelf = 'flex-start';
    if (p.includes('right')) card.style.alignSelf = 'flex-end';
    if (p.includes('middle') || p.includes('center')) card.style.alignSelf = 'center';
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function maybeTroll() {
    if (Math.random() < 0.2) {
      const msg = [
        'The FBI is coming for you.',
        '67 67 67 67 67 67 67 kid is coming to meme you up.',
        'You have violated cause number 73477562762446547823.0937427539739755728748752475285798572 of the fbi script, you will now be terminated.',
        'Your code smells like poop.'
      ];

      renderer.log(msg[Math.floor(Math.random() * msg.length)], 'troll');
    }
  }

  return {
    show
  };
};

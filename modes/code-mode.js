// modes/code-mode.js
window.GF = window.GF || {};

GF.createCodeMode = function (container, nav) {
  const sandbox = GF.createSandbox();
  const troll = GF.createTrollMode(nav);

  let root = null;
  let input = null;
  let output = null;
  let renderer = null;
  let timeLoopIntervals = [];
  let dimensionSplitActive = false;
  let leftPane = null;
  let rightPane = null;
  let lastExecutableAction = null;

  function show() {
    container.innerHTML = '';

    root = document.createElement('div');
    root.className = 'gf-code';

    const inputWrap = document.createElement('div');
    inputWrap.className = 'gf-code-input-wrap';

    input = document.createElement('textarea');
    input.className = 'gf-code-input';
    input.placeholder = 'Write GibberFish script…';

    inputWrap.appendChild(input);
    root.appendChild(inputWrap);

    const runBtn = document.createElement('button');
    runBtn.className = 'gf-code-run-btn';
    runBtn.textContent = 'Run Script';
    runBtn.addEventListener('click', runScript);
    root.appendChild(runBtn);

    output = document.createElement('div');
    output.className = 'gf-code-output';
    root.appendChild(output);

    renderer = GF.createRenderer(output);
    renderer.clear();

    container.appendChild(root);
  }

  function runScript() {
    const text = input.value.trim();
    if (!text) {
      renderer.log('No script to run.', 'error');
      return;
    }

    clearTimeLoops();
    resetDimensionSplit();
    output.className = 'gf-code-output';

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
      renderer.log('No valid GibberFish commands found.', 'error');
      return;
    }

    executeActions(actions);
  }

  async function executeActions(actions) {
    for (const action of actions) {
      const isExecutable = !['end-code', 'time-loop'].includes(action.type);

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
          await execRandomCode();
          break;
        case 'says':
          execSays(action);
          break;
        case 'end-code':
          renderer.log('Code block ended.', 'info');
          break;
        case 'duplicate-chaos':
          execDuplicateChaos(false);
          break;
        case 'duplicate-chaos-2':
          execDuplicateChaos(true);
          break;
        case 'fake-hack':
          await execFakeHack();
          break;

        // Ultra chaos
        case 'spawn-text-glitch':
          execTextGlitch(action);
          break;
        case 'rain-images':
          execRainImages(action);
          break;
        case 'audio-import':
          execAudioImport(action);
          break;
        case 'screen-shake':
          execScreenShake(action);
          break;
        case 'spawn-matrix':
          execSpawnMatrix();
          break;
        case 'fish-summon':
          execFishSummon();
          break;
        case 'explode-card':
          execExplodeCard();
          break;
        case 'typewriter-text':
          await execTypewriterText(action);
          break;
        case 'spawn-portal':
          execSpawnPortal(action);
          break;
        case 'dimension-split':
          execDimensionSplit();
          break;
        case 'spawn-blackhole':
          execSpawnBlackhole();
          break;
        case 'summon-entity':
          execSummonEntity(action);
          break;
        case 'screen-corrupt':
          execScreenCorrupt(action);
          break;
        case 'spawn-lore-fragment':
          execSpawnLoreFragment();
          break;
        case 'time-loop':
          execTimeLoop(action);
          break;
        case 'spawn-weather':
          execSpawnWeather(action);
          break;
        case 'screen-clone':
          execScreenClone(action);
          break;
        case 'spawn-ritual-circle':
          execSpawnRitualCircle();
          break;
        case 'summon-glitch-god':
          execSummonGlitchGod();
          break;
        default:
          renderer.log('Unknown action: ' + action.type, 'error');
      }

      if (isExecutable) {
        lastExecutableAction = action;
      }

      if (troll.isEnabled()) maybeTroll();
    }

    renderer.log('Script finished.', 'success');
  }

  // -----------------------------
  // CORE ACTION EXECUTORS
  // -----------------------------

  async function execImage(action) {
    const card = document.createElement('div');
    card.className = 'gf-code-image-card';

    const img = document.createElement('img');
    img.src = action.url;
    img.className = 'gf-code-image';

    card.appendChild(img);
    appendToCurrentOutput(card);

    if (action.meta && action.meta.rigSeconds) {
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
    appendToCurrentOutput(card);

    if (action.meta && action.meta.rigSeconds) {
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
      'GF.log && GF.log("blub");',
      'console.log("Random fish:", Math.random());',
      'document.body.style.filter = "hue-rotate(" + (Math.random()*360) + "deg)";'
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

  function execSays(action) {
    const card = document.createElement('div');
    card.className = 'gf-code-says-card';
    card.textContent = action.text;
    appendToCurrentOutput(card);
  }

  function execDuplicateChaos(isV2) {
    const count = isV2
      ? 40 + Math.floor(Math.random() * 80)
      : 15 + Math.floor(Math.random() * 40);

    for (let i = 0; i < count; i++) {
      const card = document.createElement('div');
      card.className = 'gf-code-chaos-dup-card';
      card.textContent = isV2 ? 'CHAOS x2' : 'CHAOS';
      card.style.transform =
        'translate(' + (Math.random() * 40 - 20) + 'px,' + (Math.random() * 40 - 20) + 'px) ' +
        'rotate(' + (Math.random() * 60 - 30) + 'deg) ' +
        'scale(' + (0.4 + Math.random() * 1.2) + ')';
      card.style.opacity = String(0.3 + Math.random() * 0.7);
      appendToCurrentOutput(card);
    }
  }

  async function execFakeHack() {
    const url = window.prompt('WHAT WEBSITE DO YOU WANT TO "HACK"?');
    if (!url) {
      renderer.log('Fake hack cancelled.', 'info');
      return;
    }

    renderer.log('Scanning ' + url + '…', 'info');
    await wait(800);

    const fakeCode = [
      '<html>',
      '  <head>',
      '    <title>GibberFish Mirror</title>',
      '  </head>',
      '  <body>',
      '    <!-- simulated source, not real -->',
      '    <h1>Access Denied by The Fish</h1>',
      '  </body>',
      '</html>'
    ].join('\n');

    const pre = document.createElement('pre');
    pre.className = 'gf-code-fake-hack';
    pre.textContent = fakeCode;
    appendToCurrentOutput(pre);

    renderer.log('Fake source generated. (No real hacking performed.)', 'success');
  }

  // -----------------------------
  // ULTRA CHAOS EXECUTORS
  // -----------------------------

  function execTextGlitch(action) {
    const el = document.createElement('div');
    el.className = 'gf-code-text-glitch';
    el.textContent = action.text;
    appendToCurrentOutput(el);
  }

  function execRainImages(action) {
    const layer = appendEffectLayer('gf-code-rain-layer');
    for (let i = 0; i < 50; i++) {
      const img = document.createElement('img');
      img.src = action.url;
      img.className = 'gf-code-rain-image';
      img.style.left = Math.random() * 100 + '%';
      img.style.animationDelay = (Math.random() * 3) + 's';
      img.style.animationDuration = (3 + Math.random() * 3) + 's';
      layer.appendChild(img);
    }
    setTimeout(() => layer.remove(), 8000);
  }

  function execAudioImport(action) {
    const audio = document.createElement('audio');
    audio.src = action.url;
    audio.controls = true;
    audio.autoplay = true;

    const card = document.createElement('div');
    card.className = 'gf-code-audio-card';
    card.appendChild(audio);
    appendToCurrentOutput(card);
  }

  function execScreenShake(action) {
    const intensity = Math.max(1, Math.min(action.intensity || 1, 10));
    output.style.setProperty('--gf-shake-intensity', intensity);
    output.classList.add('gf-code-shake');
    setTimeout(() => {
      output.classList.remove('gf-code-shake');
    }, 300 + intensity * 80);
  }

  function execSpawnMatrix() {
    const layer = appendEffectLayer('gf-code-matrix-layer');
    for (let i = 0; i < 90; i++) {
      const col = document.createElement('div');
      col.className = 'gf-code-matrix-column';
      col.style.left = Math.random() * 100 + '%';
      col.style.animationDelay = (Math.random() * 2) + 's';
      col.textContent = '01'.repeat(25);
      layer.appendChild(col);
    }
    setTimeout(() => layer.remove(), 7000);
  }

  function execFishSummon() {
    const names = [
      'Bloopus the Unstable',
      'Sir Wiggleton IV',
      'The Forbidden Salmon',
      'Packet Eater',
      'Lag Carp'
    ];
    const lines = [
      'Blub. I have arrived.',
      'You summoned me for THIS?',
      'I demand snacks.',
      'Your code smells like seaweed.',
      'I saw what you typed.'
    ];

    const card = document.createElement('div');
    card.className = 'gf-code-fish-card';

    const title = document.createElement('div');
    title.className = 'gf-code-fish-name';
    title.textContent = names[Math.floor(Math.random() * names.length)];

    const text = document.createElement('div');
    text.className = 'gf-code-fish-line';
    text.textContent = lines[Math.floor(Math.random() * lines.length)];

    card.appendChild(title);
    card.appendChild(text);
    appendToCurrentOutput(card);
  }

  function execExplodeCard() {
    const cards = Array.from(output.querySelectorAll('.gf-card, .gf-code-image-card, .gf-code-iframe-card, .gf-code-says-card'));
    if (cards.length === 0) return;

    const target = cards[Math.floor(Math.random() * cards.length)];
    target.classList.add('gf-code-explode');
    setTimeout(() => target.remove(), 700);
  }

  async function execTypewriterText(action) {
    const el = document.createElement('div');
    el.className = 'gf-code-typewriter';
    appendToCurrentOutput(el);

    const text = action.text;
    el.textContent = '';
    for (let i = 0; i < text.length; i++) {
      el.textContent += text[i];
      await wait(25 + Math.random() * 35);
    }
  }

  function execSpawnPortal(action) {
    const card = document.createElement('div');
    card.className = 'gf-code-portal-card';

    const swirl = document.createElement('div');
    swirl.className = 'gf-code-portal-swirls';

    const frame = document.createElement('iframe');
    frame.src = action.url;
    frame.className = 'gf-code-portal-iframe';

    card.appendChild(swirl);
    card.appendChild(frame);
    appendToCurrentOutput(card);
  }

  function execDimensionSplit() {
    if (dimensionSplitActive) return;

    dimensionSplitActive = true;
    output.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'gf-code-dimension-wrapper';

    leftPane = document.createElement('div');
    leftPane.className = 'gf-code-dimension-pane gf-code-dimension-left';

    rightPane = document.createElement('div');
    rightPane.className = 'gf-code-dimension-pane gf-code-dimension-right';

    wrapper.appendChild(leftPane);
    wrapper.appendChild(rightPane);
    output.appendChild(wrapper);
  }

  function execSpawnBlackhole() {
    const hole = document.createElement('div');
    hole.className = 'gf-code-blackhole';
    appendToCurrentOutput(hole);

    const cards = Array.from(output.querySelectorAll('.gf-card, .gf-code-image-card, .gf-code-iframe-card, .gf-code-says-card'));
    cards.slice(0, 7).forEach((c, i) => {
      setTimeout(() => {
        c.classList.add('gf-code-sucked');
        setTimeout(() => c.remove(), 600);
      }, i * 120);
    });

    setTimeout(() => hole.remove(), 4500);
  }

  function execSummonEntity(action) {
    const card = document.createElement('div');
    card.className = 'gf-code-entity-card';

    const name = document.createElement('div');
    name.className = 'gf-code-entity-name';
    name.textContent = action.name || 'Unnamed Entity';

    const stats = document.createElement('div');
    stats.className = 'gf-code-entity-stats';
    stats.textContent =
      'Power: ' + (1 + Math.floor(Math.random() * 100)) +
      ' | Chaos: ' + (1 + Math.floor(Math.random() * 100)) +
      ' | Stability: ' + (1 + Math.floor(Math.random() * 100));

    const line = document.createElement('div');
    line.className = 'gf-code-entity-line';
    line.textContent = '“I was not meant to exist, yet here I am.”';

    card.appendChild(name);
    card.appendChild(stats);
    card.appendChild(line);
    appendToCurrentOutput(card);
  }

  function execScreenCorrupt(action) {
    const intensity = Math.max(1, Math.min(action.intensity || 1, 10));
    output.style.setProperty('--gf-corrupt-intensity', intensity);
    output.classList.add('gf-code-corrupt');
    setTimeout(() => {
      output.classList.remove('gf-code-corrupt');
    }, 3500);
  }

  function execSpawnLoreFragment() {
    const fragments = [
      'In the year of the Great Spill, the Fish ascended.',
      'The Deep Server remembers every dropped packet.',
      'Some sockets never truly close.',
      'The first GibberFish was compiled in a dream.',
      'Beneath the UI, something watches.'
    ];

    const card = document.createElement('div');
    card.className = 'gf-code-lore-card';
    card.textContent = fragments[Math.floor(Math.random() * fragments.length)];
    appendToCurrentOutput(card);
  }

  function execTimeLoop(action) {
    if (!lastExecutableAction) {
      renderer.log('time.loop has nothing to repeat.', 'error');
      return;
    }

    const ms = (action.seconds || 1) * 1000;
    const copy = JSON.parse(JSON.stringify(lastExecutableAction));

    const id = setInterval(() => {
      executeActions([copy]);
    }, ms);

    timeLoopIntervals.push(id);
    renderer.log('Looping last action every ' + action.seconds + 's.', 'info');
  }

  function execSpawnWeather(action) {
    const kind = action.kind || 'rain';
    const layer = appendEffectLayer('gf-code-weather-layer gf-code-weather-' + kind);

    for (let i = 0; i < 70; i++) {
      const drop = document.createElement('div');
      drop.className = 'gf-code-weather-drop';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.animationDelay = (Math.random() * 3) + 's';
      drop.style.animationDuration = (3 + Math.random() * 3) + 's';
      layer.appendChild(drop);
    }

    setTimeout(() => layer.remove(), 7000);
  }

  function execScreenClone(action) {
    const times = Math.max(1, Math.min(action.times || 1, 4));
    const cloneWrap = document.createElement('div');
    cloneWrap.className = 'gf-code-clone-wrapper';

    for (let i = 0; i < times; i++) {
      const clone = output.cloneNode(true);
      clone.classList.add('gf-code-clone');
      cloneWrap.appendChild(clone);
    }

    appendToCurrentOutput(cloneWrap);
  }

  function execSpawnRitualCircle() {
    const card = document.createElement('div');
    card.className = 'gf-code-ritual-card';

    const circle = document.createElement('div');
    circle.className = 'gf-code-ritual-circle';

    const text = document.createElement('div');
    text.className = 'gf-code-ritual-text';
    text.textContent = 'THE FISH IS LISTENING';

    card.appendChild(circle);
    card.appendChild(text);
    appendToCurrentOutput(card);
  }

  function execSummonGlitchGod() {
    const layer = appendEffectLayer('gf-code-glitch-god-layer');

    const msg = document.createElement('div');
    msg.className = 'gf-code-glitch-god-text';
    msg.textContent = 'THE GLITCH GOD AWAKENS';
    layer.appendChild(msg);

    execScreenCorrupt({ intensity: 10 });
    execScreenShake({ intensity: 10 });
    execSpawnMatrix();
    execDuplicateChaos(true);

    setTimeout(() => layer.remove(), 6500);
  }

  // -----------------------------
  // HELPERS
  // -----------------------------

  function appendToCurrentOutput(el) {
    if (dimensionSplitActive && leftPane && rightPane) {
      const target = Math.random() < 0.5 ? leftPane : rightPane;
      target.appendChild(el);
    } else {
      renderer.renderCard(el);
    }
  }

  function appendEffectLayer(className) {
    const layer = document.createElement('div');
    layer.className = className;
    output.appendChild(layer);
    return layer;
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function clearTimeLoops() {
    timeLoopIntervals.forEach(id => clearInterval(id));
    timeLoopIntervals = [];
  }

  function resetDimensionSplit() {
    dimensionSplitActive = false;
    leftPane = null;
    rightPane = null;
  }

  function maybeTroll() {
    if (Math.random() < 0.2) {
      const msg = [
        'The fish is watching.',
        'Suspicious script detected.',
        'GibberFish is amused.',
        'Your code smells like seaweed.'
      ];

      renderer.log(msg[Math.floor(Math.random() * msg.length)], 'troll');
    }
  }

  return {
    show
  };
};

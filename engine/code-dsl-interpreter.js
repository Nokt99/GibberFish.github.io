// engine/code-dsl-interpreter.js
window.GF = window.GF || {};

// Interprets GibberFish DSL into a flat list of actions
GF.interpretGibberfishCode = function (rawText) {
  const lines = (rawText || '').split('\n');
  const actions = [];
  let lastAction = null;

  function addAction(action) {
    actions.push(action);
    lastAction = action;
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    if (!trimmed) continue;

    // -----------------------------
    // BASIC / LEGACY BLOCKS
    // -----------------------------

    // Old-style random code block
    if (/^Gibberfish:\(random\.code\);$/i.test(trimmed)) {
      addAction({ type: 'random-code' });
      continue;
    }

    // Old-style image.insert
    let oldImage = trimmed.match(/^Gibberfish:\(image\.insert\)\/\((.+)\)\\$/i);
    if (oldImage) {
      addAction({
        type: 'image',
        url: oldImage[1].trim(),
        meta: {}
      });
      continue;
    }

    // Old-style iframe.import
    let oldIframe = trimmed.match(/^Gibberfish:\(Iframe\.import\);\/\((.+)\)\\$/i);
    if (oldIframe) {
      addAction({
        type: 'iframe',
        url: oldIframe[1].trim(),
        meta: {}
      });
      continue;
    }

    // Old-style raw code
    let oldCode = trimmed.match(/^Gibberfish:\(code\);\/\(([\s\S]+)\)\\$/i);
    if (oldCode) {
      addAction({
        type: 'raw-code',
        code: oldCode[1]
      });
      continue;
    }

    // -----------------------------
    // NEW CORE COMMANDS
    // -----------------------------

    // New-style iframe.import
    let iframeNew = trimmed.match(/^Gibberfish:\(iframe\.import\)=\((.+)\);$/i);
    if (iframeNew) {
      addAction({
        type: 'iframe',
        url: iframeNew[1].trim(),
        meta: {}
      });
      continue;
    }

    // New-style image.import
    let imageNew = trimmed.match(/^Gibberfish:\(image\.import\)=\((.+)\);$/i);
    if (imageNew) {
      addAction({
        type: 'image',
        url: imageNew[1].trim(),
        meta: {}
      });
      continue;
    }

    // New-style set.rig.time (attach to last image/iframe)
    let rigMatch = trimmed.match(/^Gibberfish:\(set\.rig\.time=\/attribute\((\d+)\)=\(image\.import\)=\((.+)\);$/i);
    if (rigMatch) {
      const seconds = parseInt(rigMatch[1], 10);
      const url = rigMatch[2].trim();
      if (lastAction && (lastAction.type === 'image' || lastAction.type === 'iframe')) {
        lastAction.meta = lastAction.meta || {};
        lastAction.meta.rigSeconds = seconds;
        if (!lastAction.url) lastAction.url = url;
      } else {
        addAction({
          type: 'image',
          url,
          meta: { rigSeconds: seconds }
        });
      }
      continue;
    }

    // Simple random.code
    if (/^Gibberfish:\(random\.code\);$/i.test(trimmed)) {
      addAction({ type: 'random-code' });
      continue;
    }

    // Gibberfish.says(line separate);
    let saysMatch = trimmed.match(/^Gibberfish\.says\((.+)\);$/i);
    if (saysMatch) {
      addAction({
        type: 'says',
        text: saysMatch[1].trim()
      });
      continue;
    }

    // End code (marker)
    if (/^Gibberfish:\(end code\);?$/i.test(trimmed)) {
      addAction({ type: 'end-code' });
      continue;
    }

    // duplicate.chaos
    if (/^Gibberfish:\(duplicate\.chaos\);$/i.test(trimmed)) {
      addAction({ type: 'duplicate-chaos' });
      continue;
    }

    // duplicate.chaos.2
    if (/^Gibberfish:\(duplicate\.chaos\.2\);$/i.test(trimmed)) {
      addAction({ type: 'duplicate-chaos-2' });
      continue;
    }

    // Safe fake "hack" command
    if (/^Gibberfish:\(execute\.website\.hack\)=dont do\.end$/i.test(trimmed)) {
      addAction({ type: 'fake-hack' });
      continue;
    }

    // -----------------------------
    // ULTRA CHAOS COMMANDS
    // -----------------------------

    // spawn.text.glitch
    let glitchText = trimmed.match(/^Gibberfish:\(spawn\.text\.glitch\)=\((.+)\);$/i);
    if (glitchText) {
      addAction({
        type: 'spawn-text-glitch',
        text: glitchText[1].trim()
      });
      continue;
    }

    // rain.images
    let rainImages = trimmed.match(/^Gibberfish:\(rain\.images\)=\((.+)\);$/i);
    if (rainImages) {
      addAction({
        type: 'rain-images',
        url: rainImages[1].trim()
      });
      continue;
    }

    // audio.import
    let audioImport = trimmed.match(/^Gibberfish:\(audio\.import\)=\((.+)\);$/i);
    if (audioImport) {
      addAction({
        type: 'audio-import',
        url: audioImport[1].trim()
      });
      continue;
    }

    // screen.shake
    let shake = trimmed.match(/^Gibberfish:\(screen\.shake\)=\((\d+)\);$/i);
    if (shake) {
      addAction({
        type: 'screen-shake',
        intensity: parseInt(shake[1], 10)
      });
      continue;
    }

    // spawn.matrix
    if (/^Gibberfish:\(spawn\.matrix\);$/i.test(trimmed)) {
      addAction({ type: 'spawn-matrix' });
      continue;
    }

    // fish.summon
    if (/^Gibberfish:\(fish\.summon\);$/i.test(trimmed)) {
      addAction({ type: 'fish-summon' });
      continue;
    }

    // explode.card
    if (/^Gibberfish:\(explode\.card\);$/i.test(trimmed)) {
      addAction({ type: 'explode-card' });
      continue;
    }

    // typewriter.text
    let typewriter = trimmed.match(/^Gibberfish:\(typewriter\.text\)=\((.+)\);$/i);
    if (typewriter) {
      addAction({
        type: 'typewriter-text',
        text: typewriter[1].trim()
      });
      continue;
    }

    // spawn.portal
    let portal = trimmed.match(/^Gibberfish:\(spawn\.portal\)=\((.+)\);$/i);
    if (portal) {
      addAction({
        type: 'spawn-portal',
        url: portal[1].trim()
      });
      continue;
    }

    // dimension.split
    if (/^Gibberfish:\(dimension\.split\);$/i.test(trimmed)) {
      addAction({ type: 'dimension-split' });
      continue;
    }

    // spawn.blackhole
    if (/^Gibberfish:\(spawn\.blackhole\);$/i.test(trimmed)) {
      addAction({ type: 'spawn-blackhole' });
      continue;
    }

    // summon.entity
    let entity = trimmed.match(/^Gibberfish:\(summon\.entity\)=\((.+)\);$/i);
    if (entity) {
      addAction({
        type: 'summon-entity',
        name: entity[1].trim()
      });
      continue;
    }

    // screen.corrupt
    let corrupt = trimmed.match(/^Gibberfish:\(screen\.corrupt\)=\((\d+)\);$/i);
    if (corrupt) {
      addAction({
        type: 'screen-corrupt',
        intensity: parseInt(corrupt[1], 10)
      });
      continue;
    }

    // spawn.lore.fragment
    if (/^Gibberfish:\(spawn\.lore\.fragment\);$/i.test(trimmed)) {
      addAction({ type: 'spawn-lore-fragment' });
      continue;
    }

    // time.loop
    let loop = trimmed.match(/^Gibberfish:\(time\.loop\)=\((\d+)\);$/i);
    if (loop) {
      addAction({
        type: 'time-loop',
        seconds: parseInt(loop[1], 10)
      });
      continue;
    }

    // spawn.weather
    let weather = trimmed.match(/^Gibberfish:\(spawn\.weather\)=\((.+)\);$/i);
    if (weather) {
      addAction({
        type: 'spawn-weather',
        kind: weather[1].trim().toLowerCase()
      });
      continue;
    }

    // screen.clone
    let clone = trimmed.match(/^Gibberfish:\(screen\.clone\)=\((\d+)\);$/i);
    if (clone) {
      addAction({
        type: 'screen-clone',
        times: parseInt(clone[1], 10)
      });
      continue;
    }

    // spawn.ritual.circle
    if (/^Gibberfish:\(spawn\.ritual\.circle\);$/i.test(trimmed)) {
      addAction({ type: 'spawn-ritual-circle' });
      continue;
    }

    // summon.glitch.god
    if (/^Gibberfish:\(summon\.glitch\.god\);$/i.test(trimmed)) {
      addAction({ type: 'summon-glitch-god' });
      continue;
    }

    // Unknown line → ignore
  }

  return actions;
};

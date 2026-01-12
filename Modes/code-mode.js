// modes/code-mode.js
window.GF = window.GF || {};

window.GF.createCodeMode = function (container, nav) {
  var interpretGibberfishCode = window.GF.interpretGibberfishCode;

  var root = document.createElement('div');
  root.className = 'gf-code-root gf-panel';

  var controls = document.createElement('div');
  controls.className = 'gf-code-controls';
  var leftControls = document.createElement('div');
  var runBtn = document.createElement('button');
  runBtn.className = 'gf-btn primary small';
  runBtn.textContent = 'Run Script';
  var clearBtn = document.createElement('button');
  clearBtn.className = 'gf-btn small';
  clearBtn.textContent = 'Clear';
  leftControls.appendChild(runBtn);
  leftControls.appendChild(clearBtn);

  var rightControls = document.createElement('div');
  rightControls.style.fontSize = '11px';
  rightControls.style.color = 'var(--muted)';
  rightControls.textContent = 'Language: GibberFish Script';

  controls.appendChild(leftControls);
  controls.appendChild(rightControls);

  var mainGrid = document.createElement('div');
  mainGrid.className = 'gf-code-main';

  var editorPanel = document.createElement('div');
  var editorTitle = document.createElement('div');
  editorTitle.textContent = 'Code Editor';
  editorTitle.style.marginBottom = '6px';
  var editorWrap = document.createElement('div');
  editorWrap.className = 'gf-code-editor-wrap';

  var linenos = document.createElement('div');
  linenos.className = 'gf-code-linenos';

  var textarea = document.createElement('textarea');
  textarea.className = 'gf-code-editor';
  textarea.spellcheck = false;
  textarea.placeholder = [
    '1  Gibberfish:(random.code);',
    '2  Gibberfish Obey:',
    '',
    '// Try for yourself. Example:',
    'Gibberfish:(image.insert)/(https://example.com/image.png)\\',
    'Gibberfish.Says',
    'Gibberfish:(set.rig.time.3)=image;',
    'Gibberfish.Says',
    'Gibberfish:(set.placement);',
    'middle',
    'Gibberfish Obey:'
  ].join('\n');

  editorWrap.appendChild(linenos);
  editorWrap.appendChild(textarea);
  editorPanel.appendChild(editorTitle);
  editorPanel.appendChild(editorWrap);

  var rightPanel = document.createElement('div');

  var previewTitle = document.createElement('div');
  previewTitle.textContent = 'Preview Box';
  previewTitle.style.marginBottom = '6px';

  var preview = document.createElement('div');
  preview.className = 'gf-code-preview';

  var consoleTitle = document.createElement('div');
  consoleTitle.textContent = 'Console';
  consoleTitle.style.margin = '10px 0 4px 0';

  var consoleBox = document.createElement('div');
  consoleBox.className = 'gf-code-console';

  var apiRef = document.createElement('div');
  apiRef.className = 'gf-code-api';
  apiRef.innerHTML = `
    <h4>GibberFish Script</h4>
    <ul>
      <li><code>Gibberfish:(random.code);</code> — spin wheel, random language + random code.</li>
      <li><code>Gibberfish:(image.insert)/(url)\\</code> — insert image in preview.</li>
      <li><code>Gibberfish:(Iframe.import);/(url)\\</code> — import iframe in preview.</li>
      <li><code>Gibberfish:(code);/(code here)\\</code> — run generic code snippet.</li>
      <li><code>Gibberfish.Says</code> — attach extra instructions.</li>
      <li><code>Gibberfish:(set.rig.time.6)=image;</code> — rig image to appear after 6s.</li>
      <li><code>Gibberfish:(set.placement);</code> + line with e.g. <code>middle left</code>.</li>
      <li><code>Gibberfish Obey:</code> — end of block.</li>
    </ul>
  `;

  rightPanel.appendChild(previewTitle);
  rightPanel.appendChild(preview);
  rightPanel.appendChild(consoleTitle);
  rightPanel.appendChild(consoleBox);
  rightPanel.appendChild(apiRef);

  mainGrid.appendChild(editorPanel);
  mainGrid.appendChild(rightPanel);

  root.appendChild(controls);
  root.appendChild(mainGrid);

  nav.setTrollVisible(false);

  function updateLinenos() {
    var text = textarea.value || '';
    var count = text.split('\n').length || 1;
    linenos.innerHTML = '';
    for (var i = 1; i <= count; i++) {
      var d = document.createElement('div');
      d.textContent = String(i);
      linenos.appendChild(d);
    }
  }
  textarea.addEventListener('input', updateLinenos);
  updateLinenos();

  function log(msg, type) {
    var line = document.createElement('div');
    line.textContent = msg;
    if (type === 'error') line.style.color = '#ff4d6d';
    consoleBox.appendChild(line);
    consoleBox.scrollTop = consoleBox.scrollHeight;
  }

  function clearPreview() {
    preview.innerHTML = '';
  }

  function runScript() {
    clearPreview();
    consoleBox.innerHTML = '';
    var code = textarea.value || '';
    var actions = interpretGibberfishCode(code);
    if (!actions.length) {
      log('[GF-SCRIPT] No valid GibberFish commands found.');
      return;
    }
    log('[GF-SCRIPT] Running ' + actions.length + ' blocks...');

    actions.forEach(function (act, idx) {
      if (act.type === 'random-code') {
        runRandomCode(act, idx);
      } else if (act.type === 'image') {
        runImageAction(act, idx);
      } else if (act.type === 'iframe') {
        runIframeAction(act, idx);
      } else if (act.type === 'raw-code') {
        runRawCodeAction(act, idx);
      }
    });
  }

  function runRandomCode(action, index) {
    var langs = ['JavaScript', 'Python', 'C', 'Go', 'Rust', 'Ruby'];
    var lang = langs[Math.floor(Math.random()*langs.length)];
    log('[GF-SCRIPT] Block ' + (index+1) + ': random.code → ' + lang);
    var snippet = generateRandomSnippet(lang);
    var pre = document.createElement('pre');
    pre.style.fontFamily = 'var(--mono)';
    pre.style.fontSize = '11px';
    pre.textContent = snippet;
    preview.appendChild(pre);
  }

  function generateRandomSnippet(lang) {
    if (lang === 'JavaScript') {
      var choicesJs = [
        'console.log(67);',
        'function game67(){ return Math.floor(Math.random()*67); }\nconsole.log("Score:", game67());',
        'const nums = Array.from({length: 67}, (_,i)=>i+1);\nconsole.log(nums.join(", "));'
      ];
      return choicesJs[Math.floor(Math.random()*choicesJs.length)];
    }
    if (lang === 'Python') {
      var choicesPy = [
        'print(67)',
        'import random\nprint("Score:", random.randint(1,67))',
        'nums = list(range(1,68))\nprint(nums)'
      ];
      return choicesPy[Math.floor(Math.random()*choicesPy.length)];
    }
    return '// ' + lang + ' snippet\n// Imagine something weird and fishy here.\n';
  }

  function runImageAction(action, index) {
    log('[GF-SCRIPT] Block ' + (index+1) + ': image.insert → ' + action.url);
    var img = document.createElement('img');
    img.src = action.url;
    img.alt = 'GibberFish image';
    img.style.maxWidth = '100%';
    img.style.borderRadius = '10px';
    img.style.display = 'block';
    img.style.margin = '4px auto';

    var place = placeWrapper(action.meta);
    var delay = (action.meta.rigSeconds || 0) * 1000;
    if (delay > 0) {
      setTimeout(function () { preview.appendChild(place(img)); }, delay);
    } else {
      preview.appendChild(place(img));
    }
  }

  function runIframeAction(action, index) {
    log('[GF-SCRIPT] Block ' + (index+1) + ': Iframe.import → ' + action.url);
    var frame = document.createElement('iframe');
    frame.src = action.url;
    frame.style.width = '100%';
    frame.style.height = '220px';
    frame.style.border = 'none';
    frame.style.borderRadius = '10px';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';

    var place = placeWrapper(action.meta);
    var delay = (action.meta.rigSeconds || 0) * 1000;
    if (delay > 0) {
      setTimeout(function () { preview.appendChild(place(frame)); }, delay);
    } else {
      preview.appendChild(place(frame));
    }
  }

  function runRawCodeAction(action, index) {
    log('[GF-SCRIPT] Block ' + (index+1) + ': code;/(...)\\');
    var pre = document.createElement('pre');
    pre.style.fontFamily = 'var(--mono)';
    pre.style.fontSize = '11px';
    pre.textContent = action.code;
    preview.appendChild(pre);
  }

  function placeWrapper(meta) {
    var wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.margin = '4px 0';
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.alignItems = 'center';

    var placement = (meta && meta.placement || '').toLowerCase();

    if (placement.indexOf('left') !== -1) wrapper.style.justifyContent = 'flex-start';
    else if (placement.indexOf('right') !== -1) wrapper.style.justifyContent = 'flex-end';
    else wrapper.style.justifyContent = 'center';

    if (placement.indexOf('top') !== -1) wrapper.style.alignItems = 'flex-start';
    else if (placement.indexOf('bottom') !== -1) wrapper.style.alignItems = 'flex-end';
    else wrapper.style.alignItems = 'center';

    return function (node) {
      wrapper.appendChild(node);
      return wrapper;
    };
  }

  runBtn.addEventListener('click', runScript);
  clearBtn.addEventListener('click', function () {
    textarea.value = '';
    updateLinenos();
    clearPreview();
    consoleBox.innerHTML = '';
  });

  return {
    show: function () {
      container.innerHTML = '';
      container.appendChild(root);
    }
  };
};

// ui/cards.js
window.GF = window.GF || {};

GF.renderCard = function (artifact) {
  const card = document.createElement('div');
  card.className = 'gf-card gf-card-' + artifact.type;

  // Title
  const title = document.createElement('div');
  title.className = 'gf-card-title';
  title.textContent = artifact.title || artifact.type;
  card.appendChild(title);

  // Content container
  const body = document.createElement('div');
  body.className = 'gf-card-body';

  // Render by type
  switch (artifact.type) {
    case 'meme':
      renderMeme(body, artifact);
      break;

    case 'code':
      renderCode(body, artifact);
      break;

    case 'printer':
      renderPrinter(body, artifact);
      break;

    case 'call':
      renderCall(body, artifact);
      break;

    case 'glitch':
      renderGlitch(body, artifact);
      break;

    case 'rareProgram':
      renderRareProgram(body, artifact);
      break;

    default:
      body.textContent = JSON.stringify(artifact.payload);
  }

  card.appendChild(body);
  return card;
};

// -----------------------------
// RENDERERS
// -----------------------------

function renderMeme(body, a) {
  const caption = document.createElement('div');
  caption.className = 'gf-meme-caption';
  caption.textContent = a.payload.caption || '(no caption)';
  body.appendChild(caption);
}

function renderCode(body, a) {
  const pre = document.createElement('pre');
  pre.className = 'gf-code-block';
  pre.textContent = a.payload.code || '// empty';
  body.appendChild(pre);
}

function renderPrinter(body, a) {
  const text = document.createElement('div');
  text.className = 'gf-printer-text';
  text.textContent = a.payload.text || '(blank)';
  body.appendChild(text);
}

function renderCall(body, a) {
  const caller = document.createElement('div');
  caller.className = 'gf-call-name';
  caller.textContent = a.payload.name || 'Unknown Caller';
  body.appendChild(caller);

  const status = document.createElement('div');
  status.className = 'gf-call-status';
  status.textContent = 'Incoming…';
  body.appendChild(status);
}

function renderGlitch(body, a) {
  const g = document.createElement('div');
  g.className = 'gf-glitch-box';
  g.textContent = 'GLITCH x' + (a.payload.intensity || 1);
  body.appendChild(g);
}

function renderRareProgram(body, a) {
  const desc = document.createElement('div');
  desc.className = 'gf-rare-desc';
  desc.textContent = a.payload.description || 'Unknown program';
  body.appendChild(desc);
}

// -----------------------------
// LOG CARDS (for Code Mode)
// -----------------------------
GF.renderLogCard = function (msg, type) {
  const card = document.createElement('div');
  card.className = 'gf-log-card ' + (type || 'info');

  const text = document.createElement('div');
  text.className = 'gf-log-text';
  text.textContent = msg;

  card.appendChild(text);
  return card;
};

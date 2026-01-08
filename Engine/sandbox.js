// engine/sandbox.js
// Safe-ish sandbox: iframe with limited GF API for messages.

export function createSandbox() {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);

  const iframe = document.createElement('iframe');
  iframe.sandbox = 'allow-scripts';
  container.appendChild(iframe);

  iframe.srcdoc = `
    <!doctype html>
    <html>
    <head></head>
    <body>
      <script>
        window.GF = {
          emit: function(ev, data){ parent.postMessage({ gfEvent: ev, data: data }, '*'); },
          log: function(msg){ parent.postMessage({ gfLog: String(msg) }, '*'); },
          spawn: function(card){ parent.postMessage({ gfSpawn: card }, '*'); }
        };
      </script>
    </body>
    </html>
  `;

  function run(code, timeout = 2000) {
    return new Promise((resolve) => {
      const win = iframe.contentWindow;
      let finished = false;

      const listener = (ev) => {
        if (ev.source !== win) return;
        if (ev.data && (ev.data.gfDone || ev.data.gfError)) {
          finished = true;
          window.removeEventListener('message', listener);
          if (ev.data.gfError) resolve({ ok: false, error: ev.data.gfError });
          else resolve({ ok: true });
        }
      };
      window.addEventListener('message', listener);

      const wrapped = `
        try{
          (function(){
            ${code}
          })();
          parent.postMessage({ gfDone: true }, '*');
        }catch(e){
          parent.postMessage({ gfError: String(e) }, '*');
        }
      `;
      const script = win.document.createElement('script');
      script.textContent = wrapped;
      win.document.body.appendChild(script);

      setTimeout(() => {
        if (!finished) {
          window.removeEventListener('message', listener);
          resolve({ ok: false, error: 'timeout' });
        }
      }, timeout);
    });
  }

  function destroy() {
    try { document.body.removeChild(container); } catch(e) {}
  }

  return { run, destroy };
}

// engine/sandbox.js
window.GF = window.GF || {};

GF.createSandbox = function () {
  // Hidden container
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);

  // Sandbox iframe
  const iframe = document.createElement('iframe');
  iframe.sandbox = 'allow-scripts';
  container.appendChild(iframe);

  // Initial sandbox environment
  iframe.srcdoc = `
    <!doctype html>
    <html>
    <head></head>
    <body>
      <script>
        // Expose safe API to parent
        window.GF = {
          emit: function(ev, data){
            parent.postMessage({ gfEvent: ev, data: data }, '*');
          },
          log: function(msg){
            parent.postMessage({ gfLog: String(msg) }, '*');
          },
          spawn: function(card){
            parent.postMessage({ gfSpawn: card }, '*');
          }
        };
      </script>
    </body>
    </html>
  `;

  // Run code inside the sandbox
  function run(code, timeout) {
    timeout = timeout || 2000;

    return new Promise((resolve) => {
      const win = iframe.contentWindow;
      let finished = false;

      // Listen for completion or errors
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

      // Wrap user code safely
      const wrapped = `
        try {
          (function(){
            ${code}
          })();
          parent.postMessage({ gfDone: true }, '*');
        } catch (e) {
          parent.postMessage({ gfError: String(e) }, '*');
        }
      `;

      // Inject script into sandbox
      const script = win.document.createElement('script');
      script.textContent = wrapped;
      win.document.body.appendChild(script);

      // Timeout fallback
      setTimeout(() => {
        if (!finished) {
          window.removeEventListener('message', listener);
          resolve({ ok: false, error: 'timeout' });
        }
      }, timeout);
    });
  }

  // Destroy sandbox
  function destroy() {
    try {
      document.body.removeChild(container);
    } catch (e) {}
  }

  return { run, destroy };
};

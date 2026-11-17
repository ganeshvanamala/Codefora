const CONSOLE_INTERCEPT_SCRIPT = `
<script>
(function() {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;

  function serialize(arg) {
    try {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (_) {
          return Object.prototype.toString.call(arg);
        }
      }
      return String(arg);
    } catch (e) {
      return String(arg);
    }
  }

  function emit(type, args) {
    try {
      const formatted = Array.from(args).map(serialize).join(' ');
      window.parent.postMessage({
        type: 'CODEFORA_CONSOLE_MESSAGE',
        level: type,
        message: formatted,
        timestamp: new Date().toLocaleTimeString()
      }, '*');
    } catch(e) {}
  }

  console.log = function(...args) { originalLog.apply(console, args); emit('log', args); };
  console.warn = function(...args) { originalWarn.apply(console, args); emit('warn', args); };
  console.error = function(...args) { originalError.apply(console, args); emit('error', args); };
  console.info = function(...args) { originalInfo.apply(console, args); emit('info', args); };

  window.addEventListener('error', function(event) {
    emit('error', [(event.message || 'Script error') + (event.filename ? ' (' + event.filename + ':' + event.lineno + ')' : '')]);
  });

  window.addEventListener('unhandledrejection', function(event) {
    emit('error', ['Unhandled Promise Rejection: ' + (event.reason?.message || event.reason || 'Unknown error')]);
  });
})();
</script>
`;

export function buildPreview(files, preferredHtmlFile = null) {
  let htmlFile = null;
  if (preferredHtmlFile) {
    htmlFile = files.find(file => file.name === preferredHtmlFile && file.name.endsWith(".html"));
  }
  if (!htmlFile) {
    htmlFile = files.find((file) => file.name.endsWith(".html"));
  }
  let html = htmlFile?.code || "";

  // If no html file exists but React/JSX or JS exists, create a default mounting HTML
  const hasJsx = files.some(f => f.name.endsWith(".jsx") || f.name.endsWith(".tsx"));
  if (!html && (hasJsx || files.some(f => f.name.endsWith(".js")))) {
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  }

  let unlinkedCss = [];
  let unlinkedJs = [];

  // Escape string for regex
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Replace CSS links: <link ... href="filename.css" ... >
  files.filter(f => f.name.endsWith(".css")).forEach(file => {
    const regex = new RegExp(`<link[^>]*href=["'](?:\\.\\/)?${escapeRegExp(file.name)}["'][^>]*>`, 'gi');
    if (regex.test(html)) {
      html = html.replace(regex, () => `<style>${file.code}</style>`);
    } else {
      unlinkedCss.push(file.code);
    }
  });

  // Replace JS / JSX scripts: <script ... src="filename.js" ...></script>
  files.filter(f => f.name.endsWith(".js") || f.name.endsWith(".jsx") || f.name.endsWith(".ts") || f.name.endsWith(".tsx")).forEach(file => {
    const regex = new RegExp(`<script[^>]*src=["'](?:\\.\\/)?${escapeRegExp(file.name)}["'][^>]*>\\s*<\\/script>`, 'gi');
    if (regex.test(html)) {
      html = html.replace(regex, () => `<script type="module">${file.code}</script>`);
    } else {
      unlinkedJs.push(file.code);
    }
  });

  const css = unlinkedCss.join("\n");
  const js = unlinkedJs.join("\n");

  const fullHeaderInject = `${CONSOLE_INTERCEPT_SCRIPT}${css ? `<style>${css}</style>` : ''}`;

  if (html.toLowerCase().includes("<html")) {
     if (html.toLowerCase().includes("</head>")) {
       html = html.replace(/<\/head>/i, () => `${fullHeaderInject}</head>`);
     } else {
       html = html.replace(/<html[^>]*>/i, match => `${match}<head>${fullHeaderInject}</head>`);
     }
     if (js) {
       if (html.toLowerCase().includes("</body>")) {
         html = html.replace(/<\/body>/i, () => `<script type="module">${js}</script></body>`);
       } else {
         html += `<script type="module">${js}</script>`;
       }
     }
     return html;
  }

  return `<!doctype html><html><head>${fullHeaderInject}</head><body>${html}<script type="module">${js}</script></body></html>`;
}

export function withChallengePolicy(html) {
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src 'none'; font-src data:">`;
  return `<!doctype html>${policy}${String(html).replace(/<!doctype[^>]*>/gi, '')}`;
}


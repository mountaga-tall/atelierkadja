(() => {
  const parts = location.pathname.split('/').filter(Boolean);
  const locale = parts[0] === 'en' ? 'en' : 'fr';
  const filename = parts[1] || 'index.html';

  if (locale !== 'fr' && locale !== 'en') return;

  fetch('../' + filename, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Unable to load the French source page.');
      return response.text();
    })
    .then(html => {
      html = html
        .replace('<html lang="fr">', '<html lang="' + locale + '">')
        .replace(/<script id="kadja-sw-registered">[\s\S]*?<\/script>/i, '');

      html = html.replace(
        /href="(?!https?:\/\/|mailto:|#|\/)([^"]+\.html(?:#[^"]*)?)"/gi,
        (_, target) => 'href="/' + locale + '/' + target + '"'
      );

      html = html.replace(
        '<head>',
        '<head><base href="../">'
      );

      document.open();
      document.write(html);
      document.close();
    })
    .catch(error => {
      document.body.innerHTML = '<main style="font:16px system-ui;padding:40px">Unable to load this page.</main>';
      console.error(error);
    });
})();
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
        .replace('<html lang="fr">', '<html lang="' + locale + '">');

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
      const message = locale === 'en'
        ? 'Unable to load this page.'
        : 'Impossible de charger cette page.';
      document.body.innerHTML =
        '<main style="font:16px system-ui;padding:40px">' +
        message +
        '</main>';
      console.error(error);
    });
})();
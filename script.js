/* يقرأ config.js ويبني الروابط والقصص والمعرض. لا حاجة لتعديله عادةً. */
(() => {
  const S = window.SITE || {};
  const L = S.links || {};

  document.getElementById('y').textContent = new Date().getFullYear();

  // الروابط: كل عنصر فيه data-link يأخذ رابطه من config.js
  document.querySelectorAll('[data-link]').forEach(a => {
    const u = L[a.dataset.link];
    if (u) a.href = u;
  });

  const make = (tag, props) => Object.assign(document.createElement(tag), props);

  // القصص (الهايلايت)
  const lists = {
    'hl-yahya': [S.highlights && S.highlights.yahya, L.yahyaInstagram],
    'hl-ghazal': [S.highlights && S.highlights.ghazal, L.ghazalInstagram],
    'hl-sana': [S.highlights && S.highlights.sana, L.sanaInstagram]
  };
  Object.entries(lists).forEach(([key, [items, href]]) => {
    const box = document.querySelector('[data-render="' + key + '"]');
    if (!box || !items) return;
    items.forEach(it => {
      const a = make('a', { className: 'hl-item', href: it.url || href, target: '_blank', rel: 'noopener' });
      const img = make('img', { src: it.img, alt: '', width: 92, height: 92, loading: 'lazy' });
      a.append(img, make('span', { textContent: it.name }));
      box.append(a);
    });
  });

  // معرض غزل أتولييه
  const gal = document.querySelector('[data-render="gallery"]');
  if (gal && S.gallery) {
    S.gallery.forEach(it => {
      const a = make('a', { className: 'g', href: it.url || L.ghazalInstagram, target: '_blank', rel: 'noopener' });
      a.append(make('img', { src: it.img, alt: it.alt || '', loading: 'lazy' }));
      gal.append(a);
    });
  }

  // قائمة الجوال
  const btn = document.querySelector('.menu'), links = document.getElementById('links');
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A') { links.classList.remove('open'); btn.setAttribute('aria-expanded', false); }
  });

  // فيديو البودكاست: يُحمَّل المشغّل عند الضغط فقط
  const yt = document.getElementById('yt');
  const vid = (S.podcast && S.podcast.id) || '';
  if (yt && vid) {
    yt.addEventListener('click', e => {
      e.preventDefault();
      const f = make('iframe', {
        src: 'https://www.youtube-nocookie.com/embed/' + vid + '?autoplay=1&rel=0',
        title: 'حلقة ماتعة مع يحيى',
        allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
        allowFullscreen: true,
        referrerPolicy: 'strict-origin-when-cross-origin'
      });
      yt.replaceChildren(f);
      yt.removeAttribute('href');
    });
  }
})();

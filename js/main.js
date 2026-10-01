// Merkabah — interações e animações da landing page (sem dependências)
(function () {
  'use strict';

  var WA = '5562993638585';
  var body = document.body;
  var $ = function (id) { return document.getElementById(id); };
  var mqDesk = window.matchMedia('(min-width: 960px)');
  var mqCalm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motion = function () { return !mqCalm.matches; };
  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };
  var ease = function (x) { return 1 - Math.pow(1 - x, 3); };

  // ---------------------------------------------------------------- dados
  // Ordem do ciclo de fotos do hero (o nome aparece no chip).
  var PHOTOS = [
    ['jardim-vertical', 'Jardim Vertical'],
    ['jardim-de-inverno', 'Jardim de Inverno'],
    ['buda', 'Buda'],
    ['egipcia', 'Egípcia'],
    ['alema', 'Alemã'],
    ['africana', 'Africana'],
    ['estetica', 'Estética'],
    ['curso', 'de Curso']
  ];

  var ROOMS = [
    { img: 'jardim-de-inverno', name: 'Jardim de Inverno', alt: 'Sala Jardim de Inverno com divã verde, mesa e poltronas', text: 'Maca, divã, mesa e poltronas, integrada a um jardim de inverno privativo.', tag: 'Psicologia · Mentorias', price: 'R$ 65/h' },
    { img: 'buda', name: 'Buda', alt: 'Sala Buda com maca, mesa, poltronas e quadro de Buda', text: 'Maca, mesa e poltronas, com TV e espelho para diferentes formatos de atendimento.', tag: 'Terapias · Estética', price: 'R$ 65/h' },
    { img: 'egipcia', name: 'Egípcia', alt: 'Sala Egípcia com mesa, poltrona, maca e lustre', text: 'Ambiente amplo e elegante, com maca, mesa, poltronas, ar-condicionado e banheiro.', tag: 'Terapias · Psicologia', price: 'R$ 65/h' },
    { img: 'jardim-vertical', name: 'Jardim Vertical', alt: 'Sala Jardim Vertical com parede verde, maca e poltrona', text: 'Maca, mesa e poltronas, com destaque para o jardim vertical de planta artificial.', tag: 'Terapias integrativas', price: 'R$ 45/h' },
    { img: 'alema', name: 'Alemã', alt: 'Sala Alemã com poltrona reclinável e armário', text: 'Mesa, cadeiras e poltrona reclinável, num ambiente aconchegante.', tag: 'Consultas · Mentorias', price: 'R$ 45/h' },
    { img: 'africana', name: 'Africana', alt: 'Sala Africana com poltronas amarela e laranja e quadro', text: 'Mesa, poltronas e poltrona reclinável, com decoração cheia de personalidade.', tag: 'Psicologia · Terapias', price: 'R$ 45/h' },
    { img: 'estetica', name: 'Estética', alt: 'Sala Estética com maca reta e prateleira iluminada', text: 'Maca reta, ar-condicionado e apoio completo para o atendimento.', tag: 'Estética · Massoterapia', price: 'R$ 45/h' },
    { img: 'curso', name: 'Curso', alt: 'Sala de Curso com cadeiras universitárias', text: 'Cadeiras, ar-condicionado, bebedouro, TV, café e chá, adaptável a diferentes formatos.', tag: 'Cursos · Workshops', price: 'R$ 65/h' }
  ];

  var VALIDITY = 'Validade dos pacotes: 5h = 45 dias · 10h = 90 dias · 20h = 150 dias.';
  var PLANS = {
    amp: { rooms: 'Salas Jardim de Inverno, Egípcia e Buda', gift: true, validity: VALIDITY, rows: [
      ['1 hora', 'R$ 65', ''], ['Pacote 5 horas', 'R$ 300', 'R$ 60/h'], ['Pacote 10 horas', 'R$ 550', 'R$ 55/h'],
      ['Pacote 20 horas', 'R$ 900', 'R$ 45/h'], ['Meio período (5h seguidas)', 'R$ 220', 'R$ 44/h'], ['Diária (10h seguidas)', 'R$ 350', 'R$ 35/h']
    ] },
    pad: { rooms: 'Salas Jardim Vertical, Alemã, Africana e Estética', gift: false, validity: VALIDITY, rows: [
      ['1 hora', 'R$ 45', ''], ['Pacote 5 horas', 'R$ 200', 'R$ 40/h'], ['Pacote 10 horas', 'R$ 350', 'R$ 35/h'],
      ['Pacote 20 horas', 'R$ 600', 'R$ 30/h'], ['Meio período (5h seguidas)', 'R$ 150', 'R$ 30/h'], ['Diária (10h seguidas)', 'R$ 250', 'R$ 25/h']
    ] },
    cur: { rooms: 'Sala de Curso — cadeiras, TV, bebedouro, café e chá', gift: false, validity: 'Turno fixo semanal e outros formatos: consulte condições pelo WhatsApp.', rows: [
      ['1 hora', 'R$ 65', ''], ['Pacote 5 horas', 'R$ 300', 'R$ 60/h'], ['Pacote 10 horas', 'R$ 500', 'R$ 50/h']
    ] }
  };

  var WORDS = ['cuidam', 'orientam', 'transformam'];
  var WORD_BG = ['#4F6B47', '#A9541F', '#16261D'];

  var el = function (tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

  // ---------------------------------------------------------------- render
  document.querySelectorAll('[data-photos]').forEach(function (box) {
    var decorative = box.dataset.photos === 'win';
    PHOTOS.forEach(function (p) {
      var img = el('img');
      img.src = 'img/' + p[0] + '.jpg';
      img.alt = decorative ? '' : 'Sala ' + p[1];
      box.appendChild(img);
    });
  });

  var row = $('rooms-row');
  ROOMS.forEach(function (r, i) {
    var kk = Math.min(i, 4);
    var card = el('div', 'room',
      '<article><div class="ph"><img src="img/' + r.img + '.jpg" alt="' + r.alt + '" loading="lazy"></div>' +
      '<div class="body"><h3 class="serif">' + r.name + '</h3><p>' + r.text + '</p>' +
      '<div class="meta"><span class="tag">' + r.tag + '</span><span class="price">' + r.price + '</span></div></div></article>');
    card.dataset.r = 'card';
    card.dataset.o = (0.1 + kk * 0.07).toFixed(2);
    card.dataset.sp = '.6';
    card.style.setProperty('--kk', kk);
    row.appendChild(card);
  });

  var kwWords = $('kw-words');
  var kwDots = $('kw-dots');
  WORDS.forEach(function (w, i) {
    var word = el('div', 'kw-word');
    w.split('').forEach(function (ch, j) {
      var s = el('span', 'kw-letter', ch);
      s.style.setProperty('--j', j);
      word.appendChild(s);
    });
    kwWords.appendChild(word);
    var b = el('button', null, '<span></span>');
    b.type = 'button';
    b.setAttribute('aria-label', 'Mostrar ' + w);
    b.addEventListener('click', function () { setWord(i); });
    kwDots.appendChild(b);
  });

  // ---------------------------------------------------------------- intro
  var state = { intro: 0, thumb: 0, hi: 0, word: -1 };
  var timers = [];
  var heroTimer = null;

  function setIntro(n) {
    state.intro = n;
    for (var k = 1; k <= 4; k++) body.classList.toggle('i' + k, n >= k);
    paintPhotos();
  }

  function paintPhotos() {
    var desk = mqDesk.matches;
    var arch = state.intro < 2 ? (desk ? 0 : state.thumb) : state.hi;
    document.querySelectorAll('[data-photos="win"] img').forEach(function (img, k) { img.classList.toggle('on', k === state.thumb); });
    document.querySelectorAll('[data-photos="arch"] img').forEach(function (img, k) { img.classList.toggle('on', k === arch); });
    $('chip-name').textContent = PHOTOS[arch][1];
  }

  function playIntro() {
    timers.forEach(clearTimeout);
    timers = [];
    body.classList.remove('menu-open');
    state.hi = 0;
    if (!motion()) { state.thumb = 0; body.classList.add('drawn'); setIntro(4); return; }
    state.thumb = 1;
    body.classList.remove('drawn');
    setIntro(0);
    var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    at(80, function () { body.classList.add('drawn'); });
    at(1700, function () { setIntro(1); });
    // as miniaturas passam e sempre terminam na foto do hero (índice 0)
    var order = [1, 2, 3, 4, 5, 6, 7, 0];
    order.forEach(function (k, j) { if (j) at(1700 + j * 230, function () { state.thumb = k; paintPhotos(); }); });
    var t2 = 1700 + order.length * 230 + 320;
    at(t2, function () { setIntro(2); });
    at(t2 + 900, function () { setIntro(3); });
    at(t2 + 2900, function () { setIntro(4); });
  }

  function startHeroCycle() {
    clearInterval(heroTimer);
    if (!motion()) return;
    heroTimer = setInterval(function () {
      if (state.intro < 4) return;
      state.hi = (state.hi + 1) % PHOTOS.length;
      paintPhotos();
    }, 3400);
  }

  document.querySelectorAll('[data-replay]').forEach(function (a) { a.addEventListener('click', playIntro); });

  // ---------------------------------------------------------------- menu
  var menu = $('menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    menu.querySelectorAll('a, button').forEach(function (n) { n.tabIndex = open ? 0 : -1; });
    document.querySelectorAll('.burger').forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    if (open) menu.querySelector('button').focus();
  }
  document.querySelectorAll('[data-menu-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false); });

  // ---------------------------------------------------------------- carrossel de salas (mobile/tablet)
  var track = $('rooms-track');
  var step = function () { var c = row.children; return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : 314; };
  track.addEventListener('scroll', function () {
    if (mqDesk.matches) return;
    var max = Math.max(1, track.scrollWidth - track.clientWidth);
    var i = Math.max(0, Math.min(ROOMS.length - 1, Math.round(track.scrollLeft / step())));
    $('rooms-count').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(ROOMS.length).padStart(2, '0');
    $('rooms-bar').style.width = (12.5 + clamp(track.scrollLeft / max) * 87.5) + '%';
  }, { passive: true });
  $('rooms-prev').addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  $('rooms-next').addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });

  // ---------------------------------------------------------------- tabela de valores
  var tabs = document.querySelectorAll('[data-tab]');
  function setPlan(key) {
    var p = PLANS[key];
    tabs.forEach(function (t) { t.setAttribute('aria-selected', t.dataset.tab === key ? 'true' : 'false'); });
    $('plan-rooms').textContent = p.rooms;
    $('plan-rows').innerHTML = p.rows.map(function (r) {
      return '<li><span class="lbl"><span>' + r[0] + '</span><span class="note">' + r[2] + '</span></span><span class="serif">' + r[1] + '</span></li>';
    }).join('');
    $('plan-gift').hidden = !p.gift;
    $('plan-validity').textContent = p.validity;
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { setPlan(t.dataset.tab); }); });
  setPlan('amp');

  // ---------------------------------------------------------------- reserva via WhatsApp
  var form = $('book');
  function updateWa() {
    var room = form.elements.room.value, kind = form.elements.kind.value, pref = form.elements.pref.value.trim();
    var msg = 'Olá! Gostaria de reservar no Espaço Merkabah.\nSala: ' + room + '\nFormato: ' + kind + (pref ? '\nPreferência: ' + pref : '');
    $('wa-send').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }
  form.addEventListener('input', updateWa);
  form.addEventListener('submit', function (e) { e.preventDefault(); $('wa-send').click(); });
  updateWa();

  // ---------------------------------------------------------------- palavras cinéticas
  function setWord(w) {
    if (w === state.word) return;
    state.word = w;
    kwWords.querySelectorAll('.kw-word').forEach(function (n, i) { n.dataset.d = (i - w + 3) % 3; });
    kwDots.querySelectorAll('button').forEach(function (b, i) { b.setAttribute('aria-current', i === w ? 'true' : 'false'); });
    kwWords.parentNode.style.backgroundColor = WORD_BG[w];
  }
  setWord(0);

  // ---------------------------------------------------------------- scroll
  // Cada [data-r] recebe --e (0→1) conforme entra na tela:
  //   e = ease(clamp((vh*s - topo) / (vh*sp) - o))   s=.95 sp=.45 o=0 por padrão
  // O topo vem de uma medição sem transformações (cache), evitando que o próprio
  // deslocamento da animação realimente o cálculo.
  var reveals = [].slice.call(document.querySelectorAll('[data-r]'));
  reveals.forEach(function (n) { if (n.dataset.dist) n.style.setProperty('--dist', n.dataset.dist + 'px'); });
  var tops = [];
  var roomsWrap = $('rooms-wrap');
  var kw = $('kw-wrap');
  var visit = $('visita');
  var footer = $('footer');
  var wordmark = $('wordmark');
  var hero = $('hero');
  var actionbar = $('actionbar');
  var pinT = 0;

  function measure() {
    var vh = window.innerHeight;
    var W = document.documentElement.clientWidth;
    var pin = motion() && mqDesk.matches;
    roomsWrap.classList.toggle('pinned', pin);
    // percurso horizontal = largura da fileira de cards além da tela
    if (pin) {
      row.style.transform = '';
      var rowRight = row.getBoundingClientRect().left + row.scrollWidth;
      pinT = Math.max(0, Math.ceil(rowRight - W));
      roomsWrap.style.height = (vh + pinT) + 'px';
    } else {
      pinT = 0;
      roomsWrap.style.height = '';
      row.style.transform = '';
    }
    reveals.forEach(function (n) { n.style.setProperty('--e', 1); });
    var y = window.scrollY;
    tops = reveals.map(function (n) { return n.getBoundingClientRect().top + y; });
    onScroll();
  }

  function onScroll() {
    var vh = window.innerHeight;
    var y = window.scrollY;
    var anim = motion();

    reveals.forEach(function (n, i) {
      var e = 1;
      if (anim) {
        var d = n.dataset;
        var s = d.s ? +d.s : 0.95, sp = d.sp ? +d.sp : 0.45, o = d.o ? +d.o : 0;
        e = ease(clamp((vh * s - (tops[i] - y)) / (vh * sp) - o));
      }
      n.style.setProperty('--e', e.toFixed(3));
    });

    // salas: palco fixo, a fileira anda na horizontal
    if (pinT) {
      var p = clamp(-roomsWrap.getBoundingClientRect().top / pinT);
      row.style.transform = 'translateX(' + (-p * pinT).toFixed(1) + 'px)';
    }

    // palavras: uma por altura de tela enquanto o palco está fixo
    if (anim) {
      var kTop = kw.getBoundingClientRect().top;
      setWord(Math.min(2, Math.floor(clamp(-kTop / (2 * vh)) * 3)));
    }

    // estrela decorativa da localização gira ao entrar
    var eV = anim ? clamp((vh * 0.95 - visit.getBoundingClientRect().top) / (vh * 0.6)) : 1;
    visit.style.setProperty('--rot', ((1 - eV) * -30).toFixed(2) + 'deg');

    // marca d'água do rodapé sobe e a foto desliza dentro das letras
    var eF = anim ? clamp((vh - footer.getBoundingClientRect().top) / (vh * 0.6)) : 1;
    wordmark.style.transform = 'translateY(' + ((1 - eF) * (mqDesk.matches ? 140 : 60)).toFixed(1) + 'px)';
    wordmark.style.backgroundPosition = 'center ' + (15 + 70 * (1 - eF)).toFixed(1) + '%';

    // barra de ação (mobile) aparece depois do hero
    actionbar.classList.toggle('show', state.intro >= 4 && hero.getBoundingClientRect().bottom < vh * 0.55);
  }

  var schedule = function (fn) {
    var raf = 0;
    return function () { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; fn(); }); };
  };
  window.addEventListener('scroll', schedule(onScroll), { passive: true });
  window.addEventListener('resize', schedule(measure), { passive: true });
  window.addEventListener('load', measure);
  mqDesk.addEventListener('change', function () { measure(); paintPhotos(); });
  mqCalm.addEventListener('change', function () { measure(); playIntro(); startHeroCycle(); });
  if (document.fonts) document.fonts.ready.then(measure);

  playIntro();
  startHeroCycle();
  measure();
})();

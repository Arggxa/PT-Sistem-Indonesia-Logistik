  /* Tab layanan + sub-nav + tombol bahasa ENG/IDN */
  (function () {
 var porto = document.getElementById('portofolio'), tentangSec = document.getElementById('tentang');
    if (porto && tentangSec) tentangSec.appendChild(porto);
    // --- Tab utama ---
    function showPanel(sel) {
      document.querySelectorAll('.svc-panel').forEach(p => p.classList.toggle('active', '#' + p.id === sel));
      document.querySelectorAll('.svc-tab').forEach(t => t.classList.toggle('active', t.dataset.target === sel));
      if (window.AOS) setTimeout(() => AOS.refresh(), 50);
    }
    document.querySelectorAll('.svc-tab').forEach(t =>
      t.addEventListener('click', () => showPanel(t.dataset.target)));
    document.querySelectorAll('.svc-pick').forEach(t =>
      t.addEventListener('click', () => {
        showPanel(t.dataset.target);
        const bar = document.querySelector('.svc-tabbar');
        if (bar) window.scrollTo({ top: bar.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }));

    // --- Sub-nav (scroll ke blok dalam panel aktif) ---
    document.querySelectorAll('.svc-sub').forEach(a =>
      a.addEventListener('click', ev => {
        ev.preventDefault();
        const el = document.getElementById(a.getAttribute('href').slice(1));
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
      }));

    // --- Bahasa ---
    function setLang(lang) {
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-id][data-en]').forEach(el => {
        el.textContent = el.dataset[lang];
      });
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
      try { localStorage.setItem('silog-lang', lang); } catch (e) {}
    }
    document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
    let saved = 'id';
    try { saved = localStorage.getItem('silog-lang') || 'id'; } catch (e) {}
    if (saved === 'en') setLang('en');
      // --- Video banner "Tentang Kami" (tanpa suara, tanpa tombol) ---
    var aboutVideo = document.getElementById('aboutVideo');
    function toggleAboutVideo(on) {
      if (!aboutVideo) return;
      if (on) {
        var p = aboutVideo.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        aboutVideo.pause();
      }
    }
        // --- Tautan footer: pindah ke halaman lalu gulir ke bagian tertentu ---
    var pendingScroll = null;
    function scrollToSection(id) {
      var el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
    }
    document.querySelectorAll('[data-goto]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        var target = a.dataset.goto;
        var page = a.getAttribute('href').slice(1);
        if (location.hash === '#' + page) {
          scrollToSection(target);          // sudah di halaman itu
        } else {
          pendingScroll = target;           // pindah halaman dulu
          location.hash = '#' + page;
        }
      });
    });
    // --- Navigasi per halaman ---
    var PAGES = ['hero', 'tentang', 'layanan', 'karir', 'kontak'];
    function showPage(id) {
      document.querySelectorAll('.page').forEach(function (p) { p.classList.toggle('active', p.id === id); });
      document.querySelectorAll('#navmenu a').forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
      // halaman gelap (hero, karir) = header transparan; halaman terang = header putih
      document.body.classList.toggle('header-solid', id !== 'hero' && id !== 'karir');
      window.scrollTo(0, 0);
        toggleAboutVideo(id === 'tentang');
              if (pendingScroll) {
        var t = pendingScroll; pendingScroll = null;
        setTimeout(function () { scrollToSection(t); }, 300);
      }
      if (window.AOS) setTimeout(function () { AOS.refreshHard(); }, 50);
    }
    window.addEventListener('hashchange', function () {
      var id = location.hash.slice(1);
      if (PAGES.indexOf(id) > -1) showPage(id);
    });
    var first = location.hash.slice(1);
    showPage(PAGES.indexOf(first) > -1 ? first : 'hero');

    // --- Beranda: ringkasan layanan (menu kiri bisa diklik) ---
    var hlNav = document.querySelector('.hl-nav');
    var hlIndicator = document.querySelector('.hl-nav-indicator');
    var hlItems = Array.prototype.slice.call(document.querySelectorAll('.hl-nav-item'));

    // pindahkan garis merah ke item yang aktif
    function moveIndicator() {
      if (!hlIndicator) return;
      var active = document.querySelector('.hl-nav-item.active');
      if (!active || !active.offsetHeight) return;
      hlIndicator.style.top = active.offsetTop + 'px';
      hlIndicator.style.height = active.offsetHeight + 'px';
    }

    function setSlide(key) {
      hlItems.forEach(function (x) {
        var on = x.dataset.slide === key;
        x.classList.toggle('active', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      document.querySelectorAll('.hl-slide').forEach(function (s) {
        s.classList.toggle('active', s.id === 'hl-' + key);
      });
      moveIndicator();
    }

    hlItems.forEach(function (b) {
      b.addEventListener('click', function () { setSlide(b.dataset.slide); });
    });

    // posisi garis tetap benar saat ukuran/teks berubah (ganti bahasa, resize, halaman baru tampil)
    if (window.ResizeObserver && hlNav) new ResizeObserver(moveIndicator).observe(hlNav);
    window.addEventListener('resize', moveIndicator);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);
    moveIndicator();

    document.querySelectorAll('.hl-more').forEach(function (a) {
      a.addEventListener('click', function () { showPanel(a.dataset.target); });
    });
        // --- Portofolio: klik kartu -> jendela detail (isi diambil dari .porto-detail) ---
    var portoEl = document.getElementById('portoModal');
    if (portoEl && window.bootstrap) {
      var portoBody = portoEl.querySelector('.porto-modal-body');
      var portoModal = bootstrap.Modal.getOrCreateInstance(portoEl);
      document.querySelectorAll('.porto-card').forEach(function (card) {
        card.addEventListener('click', function () {
          var d = card.parentElement.querySelector('.porto-detail');
          if (!d) return;
          portoBody.innerHTML = d.innerHTML;
          portoModal.show();
        });
      });
      portoBody.addEventListener('click', function (ev) {
        // tombol "Diskusikan Proyek": tutup jendela lalu pindah ke halaman Kontak
        var go = ev.target.closest('a[href^="#"]');
        if (go) {
          ev.preventDefault();
          var h = go.getAttribute('href');
          portoEl.addEventListener('hidden.bs.modal', function once() {
            portoEl.removeEventListener('hidden.bs.modal', once);
            location.hash = h;
          });
          portoModal.hide();
          return;
        }
        // ganti foto utama saat miniatur diklik
        var t = ev.target.closest('.pd-thumb');
        if (!t) return;
        var main = portoBody.querySelector('.pd-main img');
        main.src = t.dataset.src;
        main.alt = t.querySelector('img').alt;
        portoBody.querySelectorAll('.pd-thumb').forEach(function (x) { x.classList.toggle('active', x === t); });
      });
    }
      // --- Ikon proses kerja (halaman Layanan) ---
  var STEP_ICONS = [
    ['orang-laptop', 'truk-jadwal', 'muat-periksa', 'lacak-kirim', 'serah-terima'],        // Logistik Darat
    ['rencana-kapal', 'verifikasi-peti', 'crane-kapal', 'kapal-laut', 'serah-terima'],     // Laut & Kepelabuhanan
    ['rute-moda', 'ambil-barang', 'antarmoda', 'kirim-akhir'],                             // Multimoda & Forwarding
    ['orang-laptop', 'rak-gudang', 'konsolidasi', 'forklift-kirim'],                       // Gudang 3PL & 4PL
    ['pallet-kembali', 'periksa-pallet', 'perbaiki-pallet', 'forklift-kirim'],             // Pengelolaan Pallet
    ['orang-laptop', 'desain', 'fabrikasi', 'pasang', 'uji'],                              // Fabrikasi Mekanikal
    ['inspeksi', 'rencana-mro', 'kerja-mro', 'uji']                                        // Pemeliharaan & MRO
  ];
  // Coba beberapa lokasi folder ikon; bila tidak ketemu, beri tahu di Console (F12)
  var ICON_DIRS = ['assets/img/icons/', 'assets/img/'];
  function buildIcon(name) {
    var file = name + (name === 'orang-laptop' ? '.jpg' : '.svg');
    var img = new Image();
    var n = 0;
    img.alt = '';
    img.onerror = function () {
      n++;
      if (n < ICON_DIRS.length) { img.src = ICON_DIRS[n] + file; }
      else {
        img.onerror = null;
        img.style.visibility = 'hidden';
        console.warn('Ikon tidak ditemukan: ' + file + ' | sudah dicoba di: ' + ICON_DIRS.join(' , '));
      }
    };
    img.src = ICON_DIRS[0] + file;
    return img;
  }
  document.querySelectorAll('.steps').forEach(function (box, i) {
    box.querySelectorAll('.step-icon').forEach(function (el, j) {
      var name = (STEP_ICONS[i] || [])[j];
      if (name) { el.innerHTML = ''; el.appendChild(buildIcon(name)); }
    });
  });
  })();
/* ============================================================
   HABLAME.IA — main.js v3
   Interacciones: reveal, dolores scroll-driven, carrusel,
   formulario auditoría (Supabase), video on-view, config CMS
   ============================================================ */
(function () {
  'use strict';

  var SB_URL = 'https://fnoolbnacifxgppfjsoa.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub29sYm5hY2lmeGdwcGZqc29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MTU3MzEsImV4cCI6MjA5OTI5MTczMX0.sNfRvqyrP_X5uDedP9j59L2fwLgboIOZSCaZCYBXvPI';
  var WA_NUM = '573170731171';

  var sb = null;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Supabase loader ---------- */
  function loadSupabase() {
    return new Promise(function (resolve) {
      if (window.supabase) { resolve(window.supabase); return; }
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.onload = function () { resolve(window.supabase); };
      s.onerror = function () { resolve(null); };
      document.head.appendChild(s);
    });
  }

  function fetchSection(section) {
    if (!sb) return Promise.resolve(null);
    return sb.from('site_content').select('data').eq('section', section).single()
      .then(function (r) { return r.data ? r.data.data : null; })
      .catch(function () { return null; });
  }

  /* ---------- Paint offer + countdown dates (editable) ---------- */
  function paintOffer(d) {
    if (!d) return;
    var f = document.getElementById('offerFecha');
    if (f && d.fecha_cierre) f.textContent = d.fecha_cierre;
    var t = document.querySelector('.offer-text');
    if (t && d.texto) t.textContent = d.texto;
    if (d.disponibles != null) { var dd = document.getElementById('cuposDisp'); if (dd) dd.textContent = d.disponibles; }
    if (d.total != null) { var tt = document.getElementById('cuposTotal'); if (tt) tt.textContent = d.total; }
    var bar = document.getElementById('cuposBarFill');
    if (bar && d.disponibles != null && d.total) {
      bar.style.width = Math.max(0, Math.min(100, Math.round((d.disponibles / d.total) * 100))) + '%';
    }
  }

  function paintCourses(list) {
    if (!list || !list.length) return;
    // Solo actualiza la fecha de countdown del curso de lanzamiento
    var lanz = list.filter(function (c) { return c && c.countdown && c.countdown_fecha; })[0];
    if (lanz) {
      var cd = document.getElementById('countdownFecha');
      if (cd) cd.textContent = lanz.countdown_fecha;
    }
  }

  /* ---------- Config: WhatsApp + redes ---------- */
  function updateConfig(cfg) {
    if (!cfg) return;
    if (cfg.whatsapp) {
      document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
        a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + cfg.whatsapp);
      });
    }
    setSocial('footerIG', cfg.instagram, 'https://instagram.com/');
    setSocial('footerTK', cfg.tiktok, 'https://tiktok.com/@');
    setSocial('footerFB', cfg.facebook, 'https://facebook.com/');
  }

  function setSocial(id, handle, base) {
    var el = document.getElementById(id);
    if (!el || !handle) return;
    var clean = String(handle).replace(/^@/, '').trim();
    if (!clean) return;
    el.href = /^https?:\/\//.test(handle) ? handle : base + clean;
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Dolores scroll-driven ---------- */
  function initPains() {
    var cards = document.querySelectorAll('.pain-card');
    if (!cards.length) return;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      cards.forEach(function (c) { c.classList.add('in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    cards.forEach(function (c) { obs.observe(c); });
  }

  /* ---------- Header scroll ---------- */
  function initHeader() {
    var header = document.getElementById('header');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    var btn = document.getElementById('menuBtn');
    var nav = document.getElementById('mobileNav');
    var close = document.getElementById('menuClose');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () { nav.classList.add('open'); });
    if (close) close.addEventListener('click', function () { nav.classList.remove('open'); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- Carrusel testimonios auto-scroll ---------- */
  function initCarousel() {
    var track = document.getElementById('carouselTrack');
    if (!track) return;
    var paused = reduceMotion;
    track.addEventListener('mouseenter', function () { paused = true; });
    track.addEventListener('mouseleave', function () { if (!reduceMotion) paused = false; });
    track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    track.addEventListener('touchend', function () { setTimeout(function () { if (!reduceMotion) paused = false; }, 4000); });
    if (reduceMotion) return;
    setInterval(function () {
      if (paused) return;
      var first = track.firstElementChild;
      var cardW = first ? first.offsetWidth + 22 : 350;
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: cardW, behavior: 'smooth' });
      }
    }, 3200);
  }

  /* ---------- Luna: demo interactiva ---------- */
  function initLunaDemo() {
    var body = document.getElementById('chatBubbles');
    if (!body) return;
    var form = document.getElementById('lunaForm');
    var input = document.getElementById('lunaInput');

    function scrollBottom() { var p = document.getElementById('chatBody'); if (p) p.scrollTop = p.scrollHeight; }

    function addBubble(type, text, delay) {
      return new Promise(function (res) {
        setTimeout(function () {
          var b = document.createElement('div');
          b.className = 'chat-bubble chat-bubble--' + type;
          b.textContent = text;
          body.appendChild(b);
          requestAnimationFrame(function () { b.classList.add('show'); scrollBottom(); });
          res();
        }, delay);
      });
    }

    // Conversación guionizada al entrar en vista
    var scripted = [
      { t: 'client', m: '¿Atienden mañana a las 3pm?' },
      { t: 'luna', m: '¡Hola! 😊 Sí, hay turno con Sandra. ¿Te lo agendo?' },
      { t: 'client', m: 'Sí, por favor' },
      { t: 'luna', m: '¡Listo! Cita confirmada para mañana 3:00 PM 📅 Te llegará un recordatorio. ¿Algo más?' }
    ];
    var started = false;
    function runScript() { var d = 0; scripted.forEach(function (msg) { addBubble(msg.t, msg.m, d); d += 900; }); }
    if (!reduceMotion && typeof IntersectionObserver !== 'undefined') {
      var obs = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !started) { started = true; runScript(); obs.disconnect(); }
      }, { threshold: 0.3 });
      obs.observe(body.parentElement);
    } else {
      runScript();
    }

    // Interacción: el usuario le escribe a Luna
    if (form && input) {
      var replies = [
        '¡Genial! 🙌 Un asesor confirma los detalles enseguida.',
        '¡Claro que sí! 😊 ¿Quieres que te agende una cita o te paso el catálogo?',
        '¡Con gusto! Cuéntame un poco más y te ayudo al instante.',
        'Perfecto ✅ Ya lo registré. ¿Algo más en lo que te ayude?',
        '¡Buenísimo! 🚀 Te muestro las opciones disponibles ahora mismo.'
      ];
      var ri = 0;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var text = input.value.trim();
        if (!text) return;
        input.value = '';
        addBubble('client', text, 0).then(function () {
          var typing = document.createElement('div');
          typing.className = 'chat-typing';
          typing.innerHTML = '<span></span><span></span><span></span>';
          body.appendChild(typing); scrollBottom();
          setTimeout(function () {
            typing.remove();
            addBubble('luna', replies[ri % replies.length], 0);
            ri++;
          }, 1100);
        });
      });
    }
  }

  /* ---------- Formulario auditoría ---------- */
  function initAuditForm() {
    var form = document.getElementById('auditForm');
    var msg = document.getElementById('auditMsg');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('auditBtn');
      var textEl = btn ? btn.querySelector('.btn-star-text') : null;
      var honeypot = form.querySelector('[name="website"]');
      if (honeypot && honeypot.value) return;

      if (btn) btn.disabled = true;
      if (textEl) textEl.textContent = 'Enviando…';
      if (msg) { msg.textContent = ''; msg.className = 'audit-msg'; }

      var data = {
        nombre: val(form, 'nombre'),
        whatsapp: val(form, 'whatsapp'),
        email: val(form, 'email'),
        tipo_negocio: val(form, 'tipo_negocio'),
        freno: val(form, 'freno'),
        origen: 'web',
        created_at: new Date().toISOString()
      };

      var done = function (ok) {
        if (ok) {
          if (msg) { msg.textContent = '¡Listo! Te contactaremos pronto por WhatsApp.'; msg.className = 'audit-msg success'; }
          form.reset();
          var waText = encodeURIComponent('Hola, acabo de solicitar la auditoría gratis desde la web. Soy ' + data.nombre + '.');
          setTimeout(function () { window.open('https://wa.me/' + WA_NUM + '?text=' + waText, '_blank'); }, 1000);
        } else {
          if (msg) { msg.textContent = 'Error al enviar. Intenta de nuevo o escríbenos por WhatsApp.'; msg.className = 'audit-msg error'; }
        }
        if (btn) btn.disabled = false;
        if (textEl) textEl.textContent = '⚡ SOLICITAR MI AUDITORÍA GRATIS';
      };

      if (sb) {
        sb.from('auditorias').insert([data])
          .then(function (r) { done(!r.error); })
          .catch(function () { done(false); });
      } else {
        done(true); // sin backend: sigue a WhatsApp
      }
    });
  }

  function val(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? el.value.trim() : '';
  }

  /* ---------- WA float ---------- */
  function initWaFloat() {
    var waFloat = document.getElementById('waFloat');
    if (!waFloat) return;
    var ids = ['auditoria', 'formacion'];
    var onScroll = function () {
      var hide = false;
      ids.forEach(function (id) {
        var sec = document.getElementById(id);
        if (!sec) return;
        var r = sec.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) hide = true;
      });
      waFloat.classList.toggle('hidden', hide);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- BOOT ---------- */
  function boot() {
    // Interacciones (no dependen de red)
    initHeader();
    initMobileMenu();
    initReveal();
    initPains();
    initCarousel();
    initLunaDemo();
    initAuditForm();
    initWaFloat();

    // Contenido editable desde CMS (best-effort)
    loadSupabase().then(function (lib) {
      if (lib) { try { sb = lib.createClient(SB_URL, SB_KEY); } catch (_) { sb = null; } }
      if (!sb) return;
      Promise.all([
        fetchSection('oferta'),
        fetchSection('courses'),
        fetchSection('config')
      ]).then(function (res) {
        paintOffer(res[0]);
        paintCourses(res[1]);
        updateConfig(res[2]);
      }).catch(function () {});
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

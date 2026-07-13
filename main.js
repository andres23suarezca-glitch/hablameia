/* ============================================================
   HABLAME.IA — Main JavaScript
   Supabase CMS + Animaciones + Demo chat + Stats
   Vanilla JS · GSAP + ScrollTrigger
   ============================================================ */

(function () {
  'use strict';

  // --- Configuracion Supabase (reemplazar con valores reales) ---
  var SUPABASE_URL = 'https://fnoolbnacifxgppfjsoa.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub29sYm5hY2lmeGdwcGZqc29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MTU3MzEsImV4cCI6MjA5OTI5MTczMX0.sNfRvqyrP_X5uDedP9j59L2fwLgboIOZSCaZCYBXvPI';
  var WA = '573170731171';

  // --- Helpers ---
  function waUrl(msg) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  var WA_ICON_TPL = '<svg width="SZ" height="SZ" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  function waIcon(sz) { return WA_ICON_TPL.replace(/SZ/g, sz); }

  // =====================================================
  // HEADER SCROLL (inmediato)
  // =====================================================
  var header = document.getElementById('header');

  function checkHeaderScroll() {
    if ((window.scrollY || window.pageYOffset) > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', checkHeaderScroll, { passive: true });
  checkHeaderScroll();

  // =====================================================
  // MOBILE MENU (inmediato)
  // =====================================================
  var menuBtn = document.getElementById('menuBtn');
  var menuClose = document.getElementById('menuClose');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobile() {
    if (mobileNav) {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    if (menuClose) menuClose.addEventListener('click', closeMobile);
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobile);
    });
  }

  // =====================================================
  // SMOOTH SCROLL (inmediato)
  // =====================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 10,
          behavior: 'smooth'
        });
      }
    });
  });

  // =====================================================
  // PINTAR HERO desde Supabase
  // =====================================================
  function paintHero(d) {
    var sec = document.getElementById('top');
    if (!sec) return;

    var kicker = sec.querySelector('.kicker');
    if (kicker && d.kicker) {
      kicker.innerHTML = '<span class="kicker-dot"></span> ' + esc(d.kicker);
    }

    var h1 = sec.querySelector('h1');
    if (h1 && d.title) {
      var t = d.title;
      var qi = t.lastIndexOf('¿');
      var before, underlined;
      if (qi > 0) {
        before = t.substring(0, qi);
        underlined = t.substring(qi);
      } else {
        before = '';
        underlined = t;
      }
      var svg = '<svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path d="M2 10 C 60 2, 140 2, 220 8 S 290 12, 298 6" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round"/></svg>';
      h1.innerHTML = esc(before).replace(/\.\s*/g, '.<br>') +
        '<span class="underline">' + esc(underlined) + svg + '</span>';
    }

    var sub = sec.querySelector('.hero-subtitle');
    if (sub && d.subtitle) sub.textContent = d.subtitle;

    var btns = sec.querySelectorAll('.hero-buttons .btn');
    if (btns[0] && d.btn1) btns[0].innerHTML = '&#x1F3E2; ' + esc(d.btn1);
    if (btns[1] && d.btn2) btns[1].innerHTML = '&#x1F393; ' + esc(d.btn2);
  }

  // =====================================================
  // PINTAR SERVICIOS desde Supabase
  // =====================================================
  function paintServices(list) {
    var grid = document.getElementById('servicesGrid');
    if (!grid || !list || !list.length) return;
    grid.innerHTML = '';
    var firstActive = true;

    list.forEach(function (s, i) {
      var num = pad2(i + 1);
      var el = document.createElement('div');

      if (s.active !== false && firstActive) {
        // Tarjeta destacada (primer servicio activo)
        firstActive = false;
        el.className = 'card card--featured reveal';
        var incl = (s.includes || '').split('\n').filter(Boolean);
        var niches = (s.niches || '').split(',').map(function (n) { return n.trim(); }).filter(Boolean);

        el.innerHTML =
          '<div class="card-badge-top"><span style="color:#F97316;">&#x2605;</span> Más vendido</div>' +
          '<div aria-hidden="true" style="position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.35),transparent 70%);filter:blur(40px);pointer-events:none;"></div>' +
          '<div style="position:relative;padding:30px 34px 24px;display:flex;align-items:flex-start;gap:18px;">' +
            '<div class="card-icon card-icon--big">' + (s.icon || '💬') + '</div>' +
            '<div>' +
              '<div class="card-service-num">Servicio ' + num + '</div>' +
              '<h3 style="margin:6px 0 0;">' + esc(s.title) + '</h3>' +
            '</div>' +
          '</div>' +
          '<div class="card-body" style="padding:0 34px 30px;">' +
            '<p style="margin-bottom:22px;color:#3D3D3D;font-size:15.5px;">' + esc(s.desc) + '</p>' +
            (incl.length ?
              '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 24px;margin-bottom:22px;">' +
              incl.map(function (x) { return '<div class="check-item"><span class="check-icon">&#x2713;</span>' + esc(x) + '</div>'; }).join('') +
              '</div>' : '') +
            (niches.length ?
              '<div class="niche-tags">' +
              niches.map(function (n) { return '<span class="niche-tag">' + esc(n) + '</span>'; }).join('') +
              '</div>' : '') +
            '<a href="' + waUrl('Hola, quiero saber más del servicio: ' + s.title) + '" target="_blank" rel="noopener" class="btn btn-green btn-buy card-cta" style="width:100%;">' +
              waIcon(18) + ' QUIERO SABER MÁS <span style="margin-left:auto;">&rarr;</span>' +
            '</a>' +
          '</div>';

      } else if (s.active !== false) {
        // Tarjeta activa normal
        el.className = 'card reveal';
        var incl = (s.includes || '').split('\n').filter(Boolean);

        el.innerHTML =
          '<div class="card-header">' +
            '<div class="card-header-blob" aria-hidden="true"></div>' +
            '<div style="position:relative;display:flex;align-items:center;gap:14px;">' +
              '<div class="card-icon">' + (s.icon || '📦') + '</div>' +
              '<div class="card-service-num">Servicio ' + num + '</div>' +
            '</div>' +
            '<h3 style="margin:14px 0 0;">' + esc(s.title) + '</h3>' +
          '</div>' +
          '<div class="card-body">' +
            '<p style="margin-bottom:16px;flex:1;">' + esc(s.desc) + '</p>' +
            (incl.length ?
              '<div class="check-list">' +
              incl.map(function (x) { return '<div class="check-item"><span class="check-icon">&#x2713;</span>' + esc(x) + '</div>'; }).join('') +
              '</div>' : '') +
            '<a href="' + waUrl('Hola, quiero saber del servicio: ' + s.title) + '" target="_blank" rel="noopener" class="btn btn-green card-cta" style="width:100%;font-size:14px;">' +
              waIcon(15) + ' ME INTERESA' +
            '</a>' +
          '</div>';

      } else {
        // Tarjeta proximamente
        el.className = 'card card--soon reveal';

        el.innerHTML =
          '<div class="card-header card-header--soon">' +
            '<span class="badge-soon" style="position:absolute;top:18px;right:18px;">Próximamente</span>' +
            '<div style="display:flex;align-items:center;gap:14px;">' +
              '<div class="card-icon card-icon--soon">' + (s.icon || '📦') + '</div>' +
              '<div class="card-service-num" style="color:#92400E;">Servicio ' + num + '</div>' +
            '</div>' +
            '<h3 style="margin:14px 0 0;">' + esc(s.title) + '</h3>' +
          '</div>' +
          '<div class="card-body">' +
            '<p style="margin-bottom:18px;flex:1;">' + esc(s.desc) + '</p>' +
            '<a href="' + waUrl('Hola, me interesa el servicio: ' + s.title + ' cuando esté disponible.') + '" target="_blank" rel="noopener" class="btn btn-green card-cta" style="width:100%;font-size:14px;">AVISARME CUANDO ESTÉ</a>' +
          '</div>';
      }

      grid.appendChild(el);
    });
  }

  // =====================================================
  // PINTAR PRECIOS desde Supabase
  // =====================================================
  function paintPricing(list) {
    var grid = document.getElementById('pricingGrid');
    if (!grid || !list || !list.length) return;
    grid.innerHTML = '';

    list.forEach(function (p) {
      var el = document.createElement('div');
      el.className = 'price-card' + (p.popular ? ' price-card--popular' : '') + ' reveal';
      var features = (p.features || '').split('\n').filter(Boolean);

      el.innerHTML =
        (p.popular ? '<div class="price-popular-badge">&#x2605; Más popular</div>' : '') +
        '<div class="price-name">' + esc(p.name) + '</div>' +
        '<p class="price-desc">' + esc(p.desc) + '</p>' +
        '<div>' +
          '<span class="price-amount">$' + esc(p.price) + '</span>' +
          '<span class="price-period">COP/mes</span>' +
        '</div>' +
        '<div class="price-setup">+ $' + esc(p.setup) + ' COP configuración inicial (una vez)</div>' +
        '<div class="price-divider"></div>' +
        '<div class="price-features">' +
          features.map(function (f) {
            var bold = f.indexOf('Todo lo del') === 0;
            return '<div class="price-feature"><span class="price-feature-check">&#x2713;</span><span>' +
              (bold ? '<strong>' + esc(f) + '</strong>' : esc(f)) +
            '</span></div>';
          }).join('') +
        '</div>' +
        '<a href="' + waUrl(p.wa_msg || 'Hola, me interesa el plan ' + p.name) + '" target="_blank" rel="noopener" class="btn btn-green price-cta" style="width:100%;' +
          (p.popular ? 'font-size:15px;padding:16px;' : '') + '">Contratar ahora</a>';

      grid.appendChild(el);
    });
  }

  // =====================================================
  // PINTAR CURSOS desde Supabase
  // Logica de boton:
  //   activo + payment_link → Comprar (abre Wompi)
  //   activo sin link       → Comprar (abre WhatsApp)
  //   proximamente          → Reservar cupo (WhatsApp)
  // =====================================================
  function paintCourses(list) {
    var grid = document.getElementById('coursesGrid');
    if (!grid || !list || !list.length) return;
    grid.innerHTML = '';
    var featuredDone = false;

    list.forEach(function (c, i) {
      var num = pad2(i + 1);
      var el = document.createElement('div');

      if (c.active && !featuredDone) {
        // Curso destacado (primer activo)
        featuredDone = true;
        el.className = 'card course-card--featured reveal';
        var incl = (c.includes || '').split('\n').filter(Boolean);

        var buyHref = c.payment_link
          ? esc(c.payment_link)
          : waUrl('Hola, quiero comprar el curso: ' + c.title);
        var btnHtml =
          '<a href="' + buyHref + '" target="_blank" rel="noopener" class="btn btn-green btn-buy" style="width:100%;">' +
            '<span>&#x1F6D2; Comprar por</span>' +
            '<span class="course-price-text">$' + esc(c.price) + '</span>' +
            '<span style="margin-left:auto;">&rarr;</span>' +
          '</a>';
        var priceNote = '<div class="course-price-note">Pago único · acceso de por vida</div>';

        el.innerHTML =
          '<div class="card-badge-top"><span style="color:#F97316;">&#x2605;</span> Curso estrella</div>' +
          '<div aria-hidden="true" style="position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,0.35),transparent 70%);filter:blur(40px);pointer-events:none;"></div>' +
          '<div style="position:relative;padding:30px 30px 0;">' +
            '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">' +
              '<div class="card-icon card-icon--big">' + (c.icon || '🎓') + '</div>' +
              '<div>' +
                '<div class="card-service-num">Curso ' + num + '</div>' +
                '<div class="badge-available" style="margin-top:6px;"><span class="badge-available-dot"></span> Disponible</div>' +
              '</div>' +
            '</div>' +
            '<h3>' + esc(c.title) + '</h3>' +
            '<p style="margin:12px 0 22px;color:#3D3D3D;font-size:14.5px;line-height:1.6;">' + esc(c.desc) + '</p>' +
          '</div>' +
          '<div style="position:relative;padding:0 30px;flex:1;">' +
            (incl.length ?
              '<div class="course-includes">' +
              incl.map(function (x) { return '<div class="course-include"><span class="course-include-icon">&rarr;</span>' + esc(x) + '</div>'; }).join('') +
              '</div>' : '') +
          '</div>' +
          '<div style="padding:24px 30px 30px;margin-top:20px;">' +
            btnHtml + priceNote +
          '</div>';

      } else if (c.active) {
        // Curso activo no destacado
        el.className = 'card reveal';
        var incl = (c.includes || '').split('\n').filter(Boolean);
        var buyHref = c.payment_link
          ? esc(c.payment_link)
          : waUrl('Hola, quiero comprar el curso: ' + c.title);

        el.innerHTML =
          '<div class="card-header">' +
            '<div class="card-header-blob" aria-hidden="true"></div>' +
            '<div class="badge-available" style="position:absolute;top:16px;right:16px;"><span class="badge-available-dot"></span> Disponible</div>' +
            '<div style="position:relative;display:flex;align-items:center;gap:14px;">' +
              '<div class="card-icon">' + (c.icon || '🎓') + '</div>' +
              '<div class="card-service-num">Curso ' + num + '</div>' +
            '</div>' +
            '<h3 style="margin:14px 0 0;">' + esc(c.title) + '</h3>' +
          '</div>' +
          '<div class="card-body">' +
            '<p style="margin-bottom:16px;flex:1;">' + esc(c.desc) + '</p>' +
            (incl.length ?
              '<div class="course-includes" style="margin-bottom:16px;">' +
              incl.map(function (x) { return '<div class="course-include"><span class="course-include-icon">&rarr;</span>' + esc(x) + '</div>'; }).join('') +
              '</div>' : '') +
            '<a href="' + buyHref + '" target="_blank" rel="noopener" class="btn btn-green card-cta" style="width:100%;font-size:14px;">&#x1F6D2; Comprar · $' + esc(c.price) + '</a>' +
          '</div>';

      } else {
        // Curso proximamente
        el.className = 'card reveal';
        el.style.opacity = '0.85';

        el.innerHTML =
          '<div class="card-header">' +
            '<div class="card-header-blob" aria-hidden="true"></div>' +
            '<span class="badge-soon" style="position:absolute;top:16px;right:16px;">Próximamente</span>' +
            '<div style="position:relative;display:flex;align-items:center;gap:14px;">' +
              '<div class="card-icon">' + (c.icon || '🎓') + '</div>' +
              '<div class="card-service-num">Curso ' + num + '</div>' +
            '</div>' +
            '<h3 style="margin:14px 0 0;">' + esc(c.title) + '</h3>' +
          '</div>' +
          '<div class="card-body">' +
            '<p style="margin-bottom:18px;flex:1;">' + esc(c.desc) + '</p>' +
            '<div style="font-size:16px;color:#9A9A9A;font-weight:600;margin-bottom:16px;">Próximamente</div>' +
            '<a href="' + waUrl('Hola, quiero reservar cupo para el curso: ' + c.title) + '" target="_blank" rel="noopener" class="btn btn-green card-cta" style="width:100%;font-size:14px;">Reservar cupo</a>' +
          '</div>';
      }

      grid.appendChild(el);
    });
  }

  // =====================================================
  // ACTUALIZAR WHATSAPP Y REDES SOCIALES
  // =====================================================
  function updateConfig(cfg) {
    if (cfg.whatsapp) WA = cfg.whatsapp;

    document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
      a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + WA);
    });

    var socials = document.querySelectorAll('.footer-social');
    if (socials.length >= 3) {
      if (cfg.instagram) socials[0].href = 'https://instagram.com/' + cfg.instagram.replace(/@/g, '');
      if (cfg.tiktok) socials[1].href = 'https://tiktok.com/@' + cfg.tiktok.replace(/@/g, '');
      if (cfg.facebook) socials[2].href = 'https://facebook.com/' + cfg.facebook;
    }
  }

  // =====================================================
  // ANIMACIONES (se ejecutan DESPUES de pintar contenido)
  // =====================================================
  function initAnimations() {
    // --- GSAP ScrollTrigger ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.reveal').forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          }
        );
      });

      document.querySelectorAll('.world-separator-line').forEach(function (line) {
        gsap.fromTo(line,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: line, start: 'top 85%', once: true }
          }
        );
      });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }

    // --- Stats counter ---
    var statsAnimated = false;
    var stat1 = document.getElementById('stat1');
    var stat2 = document.getElementById('stat2');
    var stat3 = document.getElementById('stat3');
    var heroStats = document.getElementById('heroStats');

    function animateCounter(el, target, duration) {
      var start = performance.now();
      function tick(now) {
        var p = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (heroStats && 'IntersectionObserver' in window) {
      var statsObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounter(stat1, 24, 1100);
          animateCounter(stat2, 85, 1300);
          animateCounter(stat3, 2, 900);
          statsObs.disconnect();
        }
      }, { threshold: 0.4 });
      statsObs.observe(heroStats);
    } else if (stat1) {
      stat1.textContent = '24';
      stat2.textContent = '85';
      stat3.textContent = '2';
    }

    // --- Chat demo ---
    var chatMessages = [
      { from: 'client', text: 'Hola, ¿tienen disponibilidad para un corte mañana a las 3pm?', time: '11:42 PM' },
      { from: 'luna', text: '¡Hola! 😊 Sí, tenemos disponibilidad mañana a las 3:00 PM con Sandra. ¿Te confirmo la cita?', time: '11:42 PM' },
      { from: 'client', text: '¡Sí, por favor!', time: '11:43 PM' },
      { from: 'luna', text: 'Listo, tu cita queda confirmada 📋\n\n📅 Mañana, 3:00 PM\n💇 Corte con Sandra\n📍 Stilos Pasto, Cra 27 #18-45\n\nTe enviaré un recordatorio 1 hora antes. ¡Te esperamos!', time: '11:43 PM' }
    ];

    var chatBubbles = document.getElementById('chatBubbles');
    var chatBody = document.getElementById('chatBody');
    var chatPlayed = false;

    function playChat() {
      if (chatPlayed || !chatBubbles) return;
      chatPlayed = true;
      var step = 0;

      function showNext() {
        if (step >= chatMessages.length) return;
        var msg = chatMessages[step];
        var div = document.createElement('div');
        div.className = 'chat-bubble chat-bubble--' + (msg.from === 'luna' ? 'luna' : 'client');
        div.style.whiteSpace = 'pre-wrap';
        div.textContent = msg.text;
        var time = document.createElement('span');
        time.className = 'chat-bubble-time';
        time.textContent = msg.time;
        div.appendChild(time);
        chatBubbles.appendChild(div);
        requestAnimationFrame(function () { div.classList.add('visible'); });
        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
        step++;
        if (step < chatMessages.length) setTimeout(showNext, 1500);
      }

      setTimeout(showNext, 700);
    }

    var demoSection = document.getElementById('demo-section');
    if (demoSection && 'IntersectionObserver' in window) {
      var chatObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          playChat();
          chatObs.disconnect();
        }
      }, { threshold: 0.25 });
      chatObs.observe(demoSection);
    }

    // --- WA float: ocultar en seccion cursos ---
    var waFloat = document.getElementById('waFloat');
    var cursosSection = document.getElementById('cursos-section');
    if (waFloat && cursosSection && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            waFloat.classList.add('hidden');
          } else {
            waFloat.classList.remove('hidden');
          }
        });
      }, { threshold: 0.15 }).observe(cursosSection);
    }
  }

  // =====================================================
  // BOOT: Supabase -> pintar contenido -> iniciar animaciones
  // Si Supabase falla, el contenido hardcodeado queda visible
  // =====================================================
  (function boot() {
    if (SUPABASE_URL.indexOf('TU-PROYECTO') !== -1) {
      initAnimations();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = function () {
      try {
        var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        sb.from('site_content').select('*')
          .then(function (res) {
            if (res.data && res.data.length > 0) {
              var map = {};
              res.data.forEach(function (r) { map[r.section] = r.data; });
              if (map.config && map.config.whatsapp) WA = map.config.whatsapp;
              if (map.hero) paintHero(map.hero);
              if (map.services) paintServices(map.services);
              if (map.pricing) paintPricing(map.pricing);
              if (map.courses) paintCourses(map.courses);
              if (map.config) updateConfig(map.config);
            }
            initAnimations();
          })
          .catch(function () { initAnimations(); });
      } catch (e) {
        initAnimations();
      }
    };
    script.onerror = function () { initAnimations(); };
    document.head.appendChild(script);
  })();

})();

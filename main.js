/* ============================================================
   HABLAME.IA — main.js v2
   Landing page logic: Supabase CMS, animations, carousel,
   audit form, chat demo, counters
   ============================================================ */
(function () {
  'use strict';

  const SB_URL  = 'https://fnoolbnacifxgppfjsoa.supabase.co';
  const SB_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub29sYm5hY2lmeGdwcGZqc29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MTU3MzEsImV4cCI6MjA5OTI5MTczMX0.sNfRvqyrP_X5uDedP9j59L2fwLgboIOZSCaZCYBXvPI';
  const WA_NUM  = '573170731171';

  let sb = null;

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

  /* ---------- Fetch section ---------- */
  async function fetchSection(section) {
    if (!sb) return null;
    try {
      var r = await sb.from('site_content').select('data').eq('section', section).single();
      return r.data ? r.data.data : null;
    } catch (_) { return null; }
  }

  /* ---------- Paint Hero ---------- */
  function paintHero(d) {
    if (!d) return;
    var k = document.querySelector('.hero .kicker');
    if (k && d.kicker) {
      k.innerHTML = '<span class="kicker-dot"></span>' + d.kicker;
    }
    var h1 = document.querySelector('.hero h1');
    if (h1 && d.title) {
      var parts = d.title.split('\n');
      h1.innerHTML = parts.map(function (p, i) {
        return i === parts.length - 1
          ? '<span class="underline">' + p + '<svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path d="M2 10 C 60 2, 140 2, 220 8 S 290 12, 298 6" fill="none" stroke="#FF5A5F" stroke-width="3" stroke-linecap="round"/></svg></span>'
          : p;
      }).join('<br>');
    }
    var sub = document.querySelector('.hero-subtitle');
    if (sub && d.subtitle) sub.textContent = d.subtitle;
  }

  /* ---------- Paint Cupos ---------- */
  function paintCupos(d) {
    if (!d) return;
    var mes = document.getElementById('cuposMes');
    var disp = document.getElementById('cuposDisp');
    var total = document.getElementById('cuposTotal');
    var fecha = document.getElementById('cuposFecha');
    var bar = document.getElementById('cuposBarFill');
    if (mes && d.mes) mes.textContent = d.mes;
    if (disp && d.disponibles != null) disp.textContent = d.disponibles;
    if (total && d.total != null) total.textContent = d.total;
    if (fecha && d.fecha_cierre) fecha.textContent = d.fecha_cierre;
    if (bar && d.disponibles != null && d.total) {
      bar.style.width = Math.round((d.disponibles / d.total) * 100) + '%';
    }
  }

  /* ---------- Paint Testimonials ---------- */
  function paintTestimonials(list) {
    if (!list || !list.length) return;
    var track = document.getElementById('carouselTrack');
    if (!track) return;
    track.innerHTML = '';
    list.forEach(function (t) {
      if (t.show === false) return;
      var card = document.createElement('div');
      if (t.type === 'capture') {
        card.className = 'testi-card testi-card--capture';
        card.innerHTML =
          '<div class="testi-capture-placeholder">' + (t.icon || '📱') + '</div>' +
          '<p class="testi-capture-label">' + (t.label || '') + '</p>' +
          '<span class="testi-demo-tag">demo</span>';
      } else {
        card.className = 'testi-card';
        card.innerHTML =
          '<div class="testi-quote">&ldquo;</div>' +
          '<p>' + (t.text || '') + '</p>' +
          '<div class="testi-author">' +
            '<div class="testi-avatar">' + (t.initials || '') + '</div>' +
            '<div><strong>' + (t.name || '') + '</strong><br><span>' + (t.sector || '') + '</span></div>' +
          '</div>';
      }
      track.appendChild(card);
    });
  }

  /* ---------- Paint Services (CMS override) ---------- */
  function paintServices(list) {
    if (!list || !list.length) return;
    var grid = document.getElementById('servicesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    list.forEach(function (svc, i) {
      if (svc.active === false) return;
      var card = document.createElement('div');
      card.className = 'svc-card reveal' + (i === 0 ? ' svc-card--featured' : '');
      var badge = i === 0 ? '<div class="svc-card-badge">★ Más vendido</div>' : '';
      var num = String(i + 1).padStart(2, '0');
      var checks = '';
      if (svc.includes) {
        checks = '<div class="svc-checks">' +
          svc.includes.split('\n').filter(Boolean).map(function (c) {
            return '<span>✓ ' + c + '</span>';
          }).join('') + '</div>';
      }
      var waMsg = encodeURIComponent(svc.wa_msg || 'Hola, quiero saber más del servicio ' + svc.title);
      var actions = i === 0
        ? '<div class="svc-card-actions">' +
          '<a href="#demo-section" class="btn btn-outline btn-sm">VER DEMO ↓</a>' +
          '<a href="https://wa.me/' + WA_NUM + '?text=' + waMsg + '" target="_blank" rel="noopener" class="btn btn-wa btn-sm">Quiero saber más →</a></div>'
        : '<a href="https://wa.me/' + WA_NUM + '?text=' + waMsg + '" target="_blank" rel="noopener" class="btn btn-wa btn-sm svc-cta">Me interesa →</a>';
      card.innerHTML = badge +
        '<div class="svc-card-num">' + num + '</div>' +
        '<h3>' + (svc.title || '') + '</h3>' +
        '<p>' + (svc.desc || '') + '</p>' +
        checks + actions;
      grid.appendChild(card);
    });
  }

  /* ---------- Paint Pricing (CMS override) ---------- */
  function paintPricing(list) {
    if (!list || !list.length) return;
    var grid = document.getElementById('pricingGrid');
    if (!grid) return;
    grid.innerHTML = '';
    list.forEach(function (plan) {
      var card = document.createElement('div');
      card.className = 'price-card reveal' + (plan.popular ? ' price-card--popular' : '');
      var badge = plan.popular ? '<div class="price-popular-badge">★ Más popular</div>' : '';
      var features = '';
      if (plan.features) {
        features = plan.features.split('\n').filter(Boolean).map(function (f) {
          return '<div class="price-feature"><span class="price-feature-check">✓</span><span>' + f + '</span></div>';
        }).join('');
      }
      var waMsg = encodeURIComponent(plan.wa_msg || 'Hola, me interesa el plan ' + plan.name);
      card.innerHTML = badge +
        '<div class="price-name">' + (plan.name || '') + '</div>' +
        '<p class="price-desc">' + (plan.desc || '') + '</p>' +
        '<div><span class="price-amount">$' + (plan.price || '') + '</span><span class="price-period">COP/mes</span></div>' +
        '<div class="price-setup">+ $' + (plan.setup || '') + ' COP configuración inicial (una vez)</div>' +
        '<div class="price-divider"></div>' +
        '<div class="price-features">' + features + '</div>' +
        '<a href="https://wa.me/' + WA_NUM + '?text=' + waMsg + '" target="_blank" rel="noopener" class="btn btn-wa price-cta" style="width:100%;">Contratar ahora</a>';
      grid.appendChild(card);
    });
  }

  /* ---------- Paint Courses (CMS override) ---------- */
  function paintCourses(list) {
    if (!list || !list.length) return;
    var grid = document.getElementById('coursesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    list.forEach(function (c, i) {
      if (c.active === false) return;
      var card = document.createElement('div');
      var cls = 'course-card reveal';
      if (i === 0) cls += ' course-card--free';
      if (c.countdown) cls += ' course-card--countdown';
      card.className = cls;

      var badge = '';
      if (i === 0) badge = '<div class="course-badge course-badge--free">GRATIS</div>';
      else if (c.countdown) badge = '<div class="course-badge course-badge--promo">LANZAMIENTO</div>';
      else badge = '<div class="course-badge">NUEVO</div>';

      var price = '';
      if (c.price) {
        var oldPrice = c.old_price ? '<span class="course-price-old">$' + c.old_price + '</span>' : '';
        price = '<div class="course-price">' + oldPrice + '$' + c.price + ' <span>COP</span></div>';
      }

      var countdown = '';
      if (c.countdown && c.countdown_fecha) {
        countdown = '<div class="course-countdown">Precio de lanzamiento hasta el <strong>' + c.countdown_fecha + '</strong></div>';
      }

      var link = c.landing_url || '#';
      var btnClass = i === 0 || c.countdown ? 'btn btn-accent' : 'btn btn-wa';
      var btnText = i === 0 ? 'Acceder gratis →' : 'Ver landing del curso →';
      if (i === 0) link = '#auditoria';

      card.innerHTML = badge +
        '<h3>' + (c.title || '') + '</h3>' +
        '<p>' + (c.desc || '') + '</p>' +
        price + countdown +
        '<a href="' + link + '" class="' + btnClass + '" style="width:100%;">' + btnText + '</a>';
      grid.appendChild(card);
    });
  }

  /* ---------- Update Config ---------- */
  function updateConfig(cfg) {
    if (!cfg) return;
    if (cfg.whatsapp) {
      document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
        a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + cfg.whatsapp);
      });
    }
  }

  /* ---------- Scroll Reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Header scroll ---------- */
  function initHeader() {
    var header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
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

  /* ---------- Stats counter ---------- */
  function initCounters() {
    var container = document.getElementById('heroStats');
    if (!container) return;
    var s1 = document.getElementById('stat1');
    var s2 = document.getElementById('stat2');
    var s3 = document.getElementById('stat3');
    var done = false;

    function animate() {
      if (done) return;
      done = true;
      animateValue(s1, 0, 24, 1200);
      animateValue(s2, 0, 85, 1400);
      animateValue(s3, 0, 2, 800);
    }

    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { animate(); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(container);
  }

  function animateValue(el, start, end, duration) {
    if (!el) return;
    var range = end - start;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + range * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Chat demo ---------- */
  function initChatDemo() {
    var body = document.getElementById('chatBubbles');
    if (!body) return;

    var messages = [
      { type: 'client', text: '¿Cuánto cuesta el combo familiar?' },
      { type: 'luna', text: '¡Hola! 😊 El combo familiar está en $45.000. ¿Te lo separo o quieres ver las otras opciones?' },
      { type: 'client', text: 'Ese está bien. ¿Tienen domicilio?' },
      { type: 'luna', text: 'Sí, hacemos domicilio gratis en pedidos de $30.000+. ¿Me das tu dirección para agendarlo? 🏠' }
    ];

    var done = false;
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !done) {
        done = true;
        showMessages(body, messages);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(body.parentElement);
  }

  function showMessages(container, msgs) {
    msgs.forEach(function (msg, i) {
      setTimeout(function () {
        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble chat-bubble--' + msg.type;
        bubble.textContent = msg.text;
        container.appendChild(bubble);
        requestAnimationFrame(function () {
          bubble.classList.add('show');
          container.parentElement.scrollTop = container.parentElement.scrollHeight;
        });
      }, i * 900);
    });
  }

  /* ---------- Testimonials carousel auto-scroll ---------- */
  function initCarousel() {
    var track = document.getElementById('carouselTrack');
    if (!track) return;
    var paused = false;
    var interval = 3000;

    track.addEventListener('mouseenter', function () { paused = true; });
    track.addEventListener('mouseleave', function () { paused = false; });
    track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    track.addEventListener('touchend', function () {
      setTimeout(function () { paused = false; }, 4000);
    });

    setInterval(function () {
      if (paused) return;
      var cardW = track.firstElementChild ? track.firstElementChild.offsetWidth + 20 : 340;
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: cardW, behavior: 'smooth' });
      }
    }, interval);
  }

  /* ---------- Audit form ---------- */
  function initAuditForm() {
    var form = document.getElementById('auditForm');
    var msg = document.getElementById('auditMsg');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn = document.getElementById('auditBtn');
      var honeypot = form.querySelector('[name="website"]');
      if (honeypot && honeypot.value) return;

      btn.disabled = true;
      btn.querySelector('.audit-btn-text').textContent = 'Enviando...';
      msg.textContent = '';
      msg.className = 'audit-msg';

      var data = {
        nombre: form.querySelector('[name="nombre"]').value.trim(),
        whatsapp: form.querySelector('[name="whatsapp"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        tipo_negocio: form.querySelector('[name="tipo_negocio"]').value,
        freno: form.querySelector('[name="freno"]').value.trim(),
        origen: 'web',
        created_at: new Date().toISOString()
      };

      try {
        if (sb) {
          var r = await sb.from('auditorias').insert([data]);
          if (r.error) throw r.error;
        }
        msg.textContent = '¡Listo! Te contactaremos pronto por WhatsApp.';
        msg.className = 'audit-msg success';
        form.reset();

        var waText = encodeURIComponent(
          'Hola, acabo de solicitar la auditoría gratis desde la web. Soy ' + data.nombre + '.'
        );
        setTimeout(function () {
          window.open('https://wa.me/' + WA_NUM + '?text=' + waText, '_blank');
        }, 1200);

      } catch (err) {
        msg.textContent = 'Error al enviar. Intenta de nuevo o escríbenos por WhatsApp.';
        msg.className = 'audit-msg error';
      }

      btn.disabled = false;
      btn.querySelector('.audit-btn-text').textContent = 'SOLICITAR MI AUDITORÍA GRATIS';
    });
  }

  /* ---------- WA float visibility ---------- */
  function initWaFloat() {
    var waFloat = document.getElementById('waFloat');
    if (!waFloat) return;
    var sections = ['cursos-section', 'auditoria'];

    window.addEventListener('scroll', function () {
      var hide = false;
      sections.forEach(function (id) {
        var sec = document.getElementById(id);
        if (!sec) return;
        var rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) hide = true;
      });
      waFloat.classList.toggle('hidden', hide);
    }, { passive: true });
  }

  /* ---------- GSAP animations ---------- */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.fromTo(el,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });
  }

  /* ---------- BOOT ---------- */
  async function boot() {
    initHeader();
    initMobileMenu();

    var supabaseLib = await loadSupabase();
    if (supabaseLib) {
      sb = supabaseLib.createClient(SB_URL, SB_KEY);
    }

    var results = await Promise.allSettled([
      fetchSection('hero'),
      fetchSection('services'),
      fetchSection('pricing'),
      fetchSection('courses'),
      fetchSection('config'),
      fetchSection('cupos'),
      fetchSection('testimonials')
    ]);

    var hero    = results[0].status === 'fulfilled' ? results[0].value : null;
    var svcs    = results[1].status === 'fulfilled' ? results[1].value : null;
    var prices  = results[2].status === 'fulfilled' ? results[2].value : null;
    var courses = results[3].status === 'fulfilled' ? results[3].value : null;
    var config  = results[4].status === 'fulfilled' ? results[4].value : null;
    var cupos   = results[5].status === 'fulfilled' ? results[5].value : null;
    var testis  = results[6].status === 'fulfilled' ? results[6].value : null;

    paintHero(hero);
    paintServices(svcs);
    paintPricing(prices);
    paintCourses(courses);
    paintCupos(cupos);
    paintTestimonials(testis);
    updateConfig(config);

    initReveal();
    initGSAP();
    initCounters();
    initChatDemo();
    initCarousel();
    initAuditForm();
    initWaFloat();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

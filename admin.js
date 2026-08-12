/* ============================================================
   HABLAME.IA — Admin Panel Logic v2
   Supabase auth + CRUD: hero, cupos, services, pricing,
   courses, testimonials, legal, config
   ============================================================ */

(function () {
  'use strict';

  var SUPABASE_URL = 'https://fnoolbnacifxgppfjsoa.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub29sYm5hY2lmeGdwcGZqc29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MTU3MzEsImV4cCI6MjA5OTI5MTczMX0.sNfRvqyrP_X5uDedP9j59L2fwLgboIOZSCaZCYBXvPI';

  var supabase = null;
  var currentUser = null;

  function initSupabase() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return true;
    }
    return false;
  }

  var loginView = document.getElementById('loginView');
  var dashboardView = document.getElementById('dashboardView');
  var loginForm = document.getElementById('loginForm');
  var loginError = document.getElementById('loginError');
  var logoutBtn = document.getElementById('logoutBtn');
  var dashUser = document.getElementById('dashUser');
  var saveBtn = document.getElementById('saveBtn');
  var saveStatus = document.getElementById('saveStatus');

  function showLogin() {
    loginView.style.display = '';
    dashboardView.classList.remove('active');
  }

  function showDashboard(email) {
    loginView.style.display = 'none';
    dashboardView.classList.add('active');
    dashUser.textContent = email || 'Admin';
    loadAllData();
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;
    loginError.style.display = 'none';
    if (!supabase) { showError('Supabase no configurado.'); return; }
    supabase.auth.signInWithPassword({ email: email, password: password })
      .then(function (res) {
        if (res.error) { showError(res.error.message); }
        else { currentUser = res.data.user; showDashboard(currentUser.email); }
      })
      .catch(function (err) { showError('Error: ' + err.message); });
  });

  logoutBtn.addEventListener('click', function () {
    if (supabase) { supabase.auth.signOut().then(function () { currentUser = null; showLogin(); }); }
    else { showLogin(); }
  });

  function showError(msg) { loginError.textContent = msg; loginError.style.display = 'block'; }

  // --- TABS ---
  var tabs = document.querySelectorAll('.dash-tab');
  var tabContents = document.querySelectorAll('.tab-content');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tabContents.forEach(function (tc) { tc.classList.remove('active'); });
      tab.classList.add('active');
      var target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // --- DATA ---
  var siteData = {
    hero: {
      kicker: 'HABLAME.IA · Automatización con IA · Colombia',
      title: 'Son las 11:42 PM.\nTu cliente pregunta.\n¿Quién responde?',
      subtitle: 'Agentes de inteligencia artificial que atienden, califican y venden por ti — más formación para emprendedores que quieren monetizar con tecnología.',
      image: ''
    },
    cupos: {
      mes: 'Agosto 2026',
      disponibles: 11,
      total: 15,
      fecha_cierre: '31 de agosto'
    },
    services: [
      { icon: '💬', title: 'Agente IA · Leads · CRM', desc: 'Capta, califica y agenda por WhatsApp 24/7.', includes: 'Respuestas 24/7\nAgendamiento de citas\nCalificación de leads\nCRM conectado\nMulticanal WA/IG/FB\nSoporte mensual', active: true, wa_msg: '' },
      { icon: '📣', title: 'Contenido Viral · Video · Imagen IA', desc: 'Videos e imágenes creados con IA para tus redes.', includes: 'Reels y shorts\nFotos de producto\nGuiones con IA\nCalendario mensual\nListo para publicar', active: true, wa_msg: '' },
      { icon: '📊', title: 'Publicidad con IA · Meta Ads', desc: 'Campañas en Facebook e Instagram sin agencia.', includes: 'Campañas en tu cuenta\nSegmentación automática\nCreativos incluidos\nReporte mensual\nSin cuota de agencia', active: true, wa_msg: '' },
      { icon: '🌐', title: 'Web · Landing · Automatización', desc: 'Tu web lista en días, hecha para convertir.', includes: 'Diseño a medida\nOptimizada para móvil\nSEO + AEO/GEO\nIntegrada con WhatsApp\nFormularios conectados', active: true, wa_msg: '' }
    ],
    pricing: [
      { name: 'Básico', desc: 'Para empezar a no perder mensajes.', price: '150.000', setup: '300.000', features: '1 agente IA\n1 número WhatsApp\nRespuestas automáticas 24/7\nSync Google Sheets\nSoporte por chat', popular: false, wa_msg: '' },
      { name: 'Profesional', desc: 'El que eligen la mayoría.', price: '280.000', setup: '400.000', features: 'Todo lo del Básico\nTranscripción de audios\nMemoria de clientes\nRecordatorios automáticos\nReportes mensuales', popular: true, wa_msg: '' },
      { name: 'Premium', desc: 'Tu negocio en piloto automático.', price: '450.000', setup: '500.000', features: 'Todo lo del Profesional\nMulti-canal (IG + FB)\nRemarketing automático\nPanel de analytics\nSoporte prioritario', popular: false, wa_msg: '' }
    ],
    courses: [
      { icon: '🎓', title: 'Tu primer agente de IA en 60 minutos', desc: 'Curso gratuito para montar tu primer agente.', price: '', landing_url: '#auditoria', active: true, countdown: false, countdown_fecha: '', old_price: '' },
      { icon: '📣', title: 'Crea tu propio contenido viral', desc: 'Videos e imágenes con IA para tus redes.', price: '127.000', landing_url: 'curso-contenido-viral.html', active: true, countdown: false, countdown_fecha: '', old_price: '' },
      { icon: '⚙️', title: 'Todo sobre IA en 1', desc: 'Todo lo que necesitas saber de la IA.', price: '120.000', landing_url: 'curso-todo-ia.html', active: true, countdown: true, countdown_fecha: '31 de agosto', old_price: '250.000' }
    ],
    testimonials: [
      { type: 'capture', icon: '📱', label: 'Luna agendando una cita a las 11:42 PM', show: true },
      { type: 'capture', icon: '📋', label: 'Luna calificando un lead y pasándolo a un humano', show: true },
      { type: 'capture', icon: '💬', label: 'Luna respondiendo un DM de Instagram', show: true },
      { type: 'testimonial', text: 'Desde que Andrés implementó el agente de IA, el seguimiento de pacientes se hace solo.', name: 'Cristina Obando', sector: 'Clínica odontológica', initials: 'CO', show: true },
      { type: 'testimonial', text: 'Nunca imaginé resultados tan rápidos. Los clientes escriben y la IA los atiende al instante.', name: 'Santiago Ruiz', sector: 'Inmobiliaria', initials: 'SR', show: true },
      { type: 'testimonial', text: 'La combinación de atención con IA y la pauta que nos montó fue una bomba.', name: 'Christian Oñate', sector: 'Concesionario', initials: 'ChO', show: true },
      { type: 'testimonial', text: 'Tuvimos que pausar la pauta un día por la cantidad de clientes que llegaron.', name: 'Luz Castillo', sector: 'Campañas Meta Ads', initials: 'LC', show: true },
      { type: 'testimonial', text: 'Con las automatizaciones que creó para producción y contabilidad, la empresa funciona como un reloj.', name: 'Fernando Caiza', sector: 'Producción y contabilidad', initials: 'FC', show: true },
      { type: 'testimonial', text: 'El software que nos creó es una maravilla. Controlar a los vendedores era un dolor de cabeza.', name: 'Miguel Guerrero', sector: 'Distribución tienda a tienda', initials: 'MG', show: true },
      { type: 'testimonial', text: 'El sistema que desarrolló para el PAMEC y la auditoría interna fue la pieza que nos faltaba.', name: 'S. Pantoja', sector: 'Hospital', initials: 'SP', show: true },
      { type: 'testimonial', text: 'Sus automatizaciones nos quitaron un peso enorme. Logramos la acreditación.', name: 'Angela Bastidas', sector: 'Hospital', initials: 'AB', show: true },
      { type: 'testimonial', text: 'El nuevo sistema de call center es de otro mundo. La atención es inmediata y trazable.', name: 'Equipo de Atención', sector: 'Hospital', initials: 'EA', show: true }
    ],
    legal: { privacy: '', terms: '' },
    config: { whatsapp: '573170731171', email: '', instagram: '', tiktok: '', facebook: '' }
  };

  // --- LOAD DATA ---
  function loadAllData() {
    if (!supabase) { renderAll(); return; }
    supabase.from('site_content').select('*')
      .then(function (res) {
        if (res.data && res.data.length > 0) {
          res.data.forEach(function (row) {
            if (siteData[row.section] !== undefined) {
              siteData[row.section] = row.data;
            }
          });
        }
        renderAll();
      })
      .catch(function () { renderAll(); });
  }

  function renderAll() {
    renderHero();
    renderCupos();
    renderServices();
    renderPricing();
    renderCourses();
    renderTestimonials();
    renderLegal();
    renderConfig();
  }

  // --- RENDER HERO ---
  function renderHero() {
    var h = siteData.hero;
    document.getElementById('hero-kicker').value = h.kicker || '';
    document.getElementById('hero-title').value = h.title || '';
    document.getElementById('hero-subtitle').value = h.subtitle || '';
    document.getElementById('hero-image').value = h.image || '';
  }

  // --- RENDER CUPOS ---
  function renderCupos() {
    var c = siteData.cupos;
    document.getElementById('cupos-mes').value = c.mes || '';
    document.getElementById('cupos-fecha').value = c.fecha_cierre || '';
    document.getElementById('cupos-disponibles').value = c.disponibles != null ? c.disponibles : '';
    document.getElementById('cupos-total').value = c.total != null ? c.total : '';
  }

  // --- RENDER SERVICES ---
  function renderServices() {
    var list = document.getElementById('servicesList');
    list.innerHTML = '';
    siteData.services.forEach(function (svc, i) {
      var card = document.createElement('div');
      card.className = 'edit-card';
      card.innerHTML =
        '<div class="edit-card-header">' +
          '<div class="edit-card-title">' +
            '<span style="font-size:24px;">' + (svc.icon || '📦') + '</span> Servicio ' + (i + 1) +
            ' <span class="edit-card-badge ' + (svc.active ? 'edit-card-badge--active' : 'edit-card-badge--soon') + '">' + (svc.active ? 'Activo' : 'Próximo') + '</span>' +
          '</div>' +
          '<div style="display:flex;gap:4px;">' +
            (i > 0 ? '<button class="btn-admin btn-sm btn-outline-admin" data-move-svc-up="' + i + '">↑</button>' : '') +
            (i < siteData.services.length - 1 ? '<button class="btn-admin btn-sm btn-outline-admin" data-move-svc-down="' + i + '">↓</button>' : '') +
            '<button class="btn-admin btn-danger btn-sm" data-delete-service="' + i + '">Eliminar</button>' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Icono</label><input type="text" class="form-input form-input-small" data-svc="' + i + '" data-field="icon" value="' + (svc.icon || '') + '"></div>' +
          '<div class="form-group"><label class="form-label">Estado</label>' +
            '<div class="toggle-wrapper"><div class="toggle ' + (svc.active ? 'on' : '') + '" data-svc-toggle="' + i + '"></div><span>' + (svc.active ? 'Activo' : 'Próximamente') + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="form-group"><label class="form-label">Título</label><input type="text" class="form-input" data-svc="' + i + '" data-field="title" value="' + esc(svc.title) + '"></div>' +
        '<div class="form-group"><label class="form-label">Descripción</label><textarea class="form-textarea" data-svc="' + i + '" data-field="desc" rows="2">' + esc(svc.desc) + '</textarea></div>' +
        '<div class="form-group"><label class="form-label">Incluye (uno por línea)</label><textarea class="form-textarea" data-svc="' + i + '" data-field="includes" rows="4">' + esc(svc.includes) + '</textarea></div>' +
        '<div class="form-group"><label class="form-label">Mensaje WhatsApp</label><input type="text" class="form-input" data-svc="' + i + '" data-field="wa_msg" value="' + esc(svc.wa_msg) + '"></div>';
      list.appendChild(card);
    });
    bindListEvents(list, 'svc', siteData.services, renderServices);
  }

  // --- RENDER PRICING ---
  function renderPricing() {
    var list = document.getElementById('pricingList');
    list.innerHTML = '';
    siteData.pricing.forEach(function (plan, i) {
      var card = document.createElement('div');
      card.className = 'edit-card';
      card.innerHTML =
        '<div class="edit-card-header">' +
          '<div class="edit-card-title">Plan ' + (i + 1) + ': ' + esc(plan.name) +
            (plan.popular ? ' <span class="edit-card-badge edit-card-badge--active">Destacado</span>' : '') +
          '</div>' +
          '<div class="toggle-wrapper"><div class="toggle ' + (plan.popular ? 'on' : '') + '" data-plan-popular="' + i + '"></div><span>Destacado</span></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Nombre</label><input type="text" class="form-input" data-plan="' + i + '" data-field="name" value="' + esc(plan.name) + '"></div>' +
          '<div class="form-group"><label class="form-label">Descripción</label><input type="text" class="form-input" data-plan="' + i + '" data-field="desc" value="' + esc(plan.desc) + '"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Precio mensual (COP)</label><input type="text" class="form-input" data-plan="' + i + '" data-field="price" value="' + esc(plan.price) + '"></div>' +
          '<div class="form-group"><label class="form-label">Config. inicial (COP)</label><input type="text" class="form-input" data-plan="' + i + '" data-field="setup" value="' + esc(plan.setup) + '"></div>' +
        '</div>' +
        '<div class="form-group"><label class="form-label">Features (una por línea)</label><textarea class="form-textarea" data-plan="' + i + '" data-field="features" rows="4">' + esc(plan.features) + '</textarea></div>' +
        '<div class="form-group"><label class="form-label">Mensaje WhatsApp</label><input type="text" class="form-input" data-plan="' + i + '" data-field="wa_msg" value="' + esc(plan.wa_msg) + '"></div>';
      list.appendChild(card);
    });
    list.querySelectorAll('[data-plan-popular]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.planPopular);
        siteData.pricing.forEach(function (p, j) { p.popular = (j === idx) ? !p.popular : false; });
        renderPricing();
      });
    });
  }

  // --- RENDER COURSES ---
  function renderCourses() {
    var list = document.getElementById('coursesList');
    list.innerHTML = '';
    siteData.courses.forEach(function (course, i) {
      var card = document.createElement('div');
      card.className = 'edit-card';
      card.innerHTML =
        '<div class="edit-card-header">' +
          '<div class="edit-card-title">' +
            '<span style="font-size:24px;">' + (course.icon || '🎓') + '</span> Curso ' + (i + 1) +
            ' <span class="edit-card-badge ' + (course.active ? 'edit-card-badge--active' : 'edit-card-badge--soon') + '">' + (course.active ? 'Activo' : 'Próximo') + '</span>' +
          '</div>' +
          '<div style="display:flex;gap:4px;">' +
            (i > 0 ? '<button class="btn-admin btn-sm btn-outline-admin" data-move-course-up="' + i + '">↑</button>' : '') +
            (i < siteData.courses.length - 1 ? '<button class="btn-admin btn-sm btn-outline-admin" data-move-course-down="' + i + '">↓</button>' : '') +
            '<button class="btn-admin btn-danger btn-sm" data-delete-course="' + i + '">Eliminar</button>' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Icono</label><input type="text" class="form-input form-input-small" data-course="' + i + '" data-field="icon" value="' + (course.icon || '') + '"></div>' +
          '<div class="form-group"><label class="form-label">Estado</label>' +
            '<div class="toggle-wrapper"><div class="toggle ' + (course.active ? 'on' : '') + '" data-course-toggle="' + i + '"></div><span>' + (course.active ? 'Activo' : 'Próximamente') + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="form-group"><label class="form-label">Título</label><input type="text" class="form-input" data-course="' + i + '" data-field="title" value="' + esc(course.title) + '"></div>' +
        '<div class="form-group"><label class="form-label">Descripción</label><textarea class="form-textarea" data-course="' + i + '" data-field="desc" rows="2">' + esc(course.desc) + '</textarea></div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Precio (COP)</label><input type="text" class="form-input" data-course="' + i + '" data-field="price" value="' + esc(course.price) + '"></div>' +
          '<div class="form-group"><label class="form-label">URL landing</label><input type="text" class="form-input" data-course="' + i + '" data-field="landing_url" value="' + esc(course.landing_url) + '"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Precio anterior (tachado)</label><input type="text" class="form-input" data-course="' + i + '" data-field="old_price" value="' + esc(course.old_price) + '"></div>' +
          '<div class="form-group"><label class="form-label">Fecha countdown</label><input type="text" class="form-input" data-course="' + i + '" data-field="countdown_fecha" value="' + esc(course.countdown_fecha) + '" placeholder="31 de agosto"></div>' +
        '</div>' +
        '<div class="form-group"><label class="form-label">Countdown activo</label>' +
          '<div class="toggle-wrapper"><div class="toggle ' + (course.countdown ? 'on' : '') + '" data-course-countdown="' + i + '"></div><span>' + (course.countdown ? 'Sí' : 'No') + '</span></div>' +
        '</div>';
      list.appendChild(card);
    });
    bindListEvents(list, 'course', siteData.courses, renderCourses);
    list.querySelectorAll('[data-course-countdown]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.courseCountdown);
        siteData.courses[idx].countdown = !siteData.courses[idx].countdown;
        renderCourses();
      });
    });
  }

  // --- RENDER TESTIMONIALS ---
  function renderTestimonials() {
    var list = document.getElementById('testimonialsList');
    list.innerHTML = '';
    siteData.testimonials.forEach(function (t, i) {
      var card = document.createElement('div');
      card.className = 'edit-card';
      var isCapture = t.type === 'capture';
      card.innerHTML =
        '<div class="edit-card-header">' +
          '<div class="edit-card-title">' +
            'Testimonio ' + (i + 1) + ' ' +
            '<span class="edit-card-badge ' + (t.show !== false ? 'edit-card-badge--active' : 'edit-card-badge--soon') + '">' + (t.show !== false ? 'Visible' : 'Oculto') + '</span>' +
          '</div>' +
          '<div style="display:flex;gap:4px;">' +
            '<button class="btn-admin btn-danger btn-sm" data-delete-testi="' + i + '">Eliminar</button>' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Tipo</label>' +
            '<select class="form-input" data-testi="' + i + '" data-field="type"><option value="testimonial"' + (!isCapture ? ' selected' : '') + '>Testimonio</option><option value="capture"' + (isCapture ? ' selected' : '') + '>Captura</option></select>' +
          '</div>' +
          '<div class="form-group"><label class="form-label">Visible</label>' +
            '<div class="toggle-wrapper"><div class="toggle ' + (t.show !== false ? 'on' : '') + '" data-testi-toggle="' + i + '"></div><span>' + (t.show !== false ? 'Sí' : 'No') + '</span></div>' +
          '</div>' +
        '</div>' +
        (isCapture
          ? '<div class="form-row">' +
              '<div class="form-group"><label class="form-label">Icono</label><input type="text" class="form-input form-input-small" data-testi="' + i + '" data-field="icon" value="' + esc(t.icon) + '"></div>' +
              '<div class="form-group"><label class="form-label">Etiqueta</label><input type="text" class="form-input" data-testi="' + i + '" data-field="label" value="' + esc(t.label) + '"></div>' +
            '</div>'
          : '<div class="form-group"><label class="form-label">Texto</label><textarea class="form-textarea" data-testi="' + i + '" data-field="text" rows="3">' + esc(t.text) + '</textarea></div>' +
            '<div class="form-row">' +
              '<div class="form-group"><label class="form-label">Nombre</label><input type="text" class="form-input" data-testi="' + i + '" data-field="name" value="' + esc(t.name) + '"></div>' +
              '<div class="form-group"><label class="form-label">Sector</label><input type="text" class="form-input" data-testi="' + i + '" data-field="sector" value="' + esc(t.sector) + '"></div>' +
            '</div>' +
            '<div class="form-group"><label class="form-label">Iniciales</label><input type="text" class="form-input form-input-small" data-testi="' + i + '" data-field="initials" value="' + esc(t.initials) + '"></div>'
        );
      list.appendChild(card);
    });
    list.querySelectorAll('[data-testi-toggle]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.testiToggle);
        siteData.testimonials[idx].show = siteData.testimonials[idx].show === false ? true : false;
        renderTestimonials();
      });
    });
    list.querySelectorAll('[data-delete-testi]').forEach(function (el) {
      el.addEventListener('click', function () {
        siteData.testimonials.splice(parseInt(el.dataset.deleteTesti), 1);
        renderTestimonials();
      });
    });
  }

  // --- RENDER LEGAL ---
  function renderLegal() {
    document.getElementById('legal-privacy').value = siteData.legal.privacy || '';
    document.getElementById('legal-terms').value = siteData.legal.terms || '';
  }

  // --- RENDER CONFIG ---
  function renderConfig() {
    var c = siteData.config;
    document.getElementById('config-whatsapp').value = c.whatsapp || '';
    document.getElementById('config-email').value = c.email || '';
    document.getElementById('config-instagram').value = c.instagram || '';
    document.getElementById('config-tiktok').value = c.tiktok || '';
    document.getElementById('config-facebook').value = c.facebook || '';
  }

  // --- SHARED LIST EVENT BINDING ---
  function bindListEvents(container, prefix, arr, renderFn) {
    container.querySelectorAll('[data-' + prefix + '-toggle]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset[prefix + 'Toggle']);
        arr[idx].active = !arr[idx].active;
        renderFn();
      });
    });
    container.querySelectorAll('[data-delete-' + (prefix === 'svc' ? 'service' : prefix) + ']').forEach(function (el) {
      el.addEventListener('click', function () {
        arr.splice(parseInt(el.dataset['delete' + capitalize(prefix === 'svc' ? 'service' : prefix)]), 1);
        renderFn();
      });
    });
    container.querySelectorAll('[data-move-' + prefix + '-up]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset['move' + capitalize(prefix) + 'Up']);
        if (idx > 0) { swap(arr, idx, idx - 1); renderFn(); }
      });
    });
    container.querySelectorAll('[data-move-' + prefix + '-down]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset['move' + capitalize(prefix) + 'Down']);
        if (idx < arr.length - 1) { swap(arr, idx, idx + 1); renderFn(); }
      });
    });
  }

  function swap(arr, a, b) { var t = arr[a]; arr[a] = arr[b]; arr[b] = t; }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // --- ADD BUTTONS ---
  document.getElementById('addServiceBtn').addEventListener('click', function () {
    siteData.services.push({ icon: '📋', title: 'Nuevo servicio', desc: '', includes: '', active: true, wa_msg: '' });
    renderServices();
  });
  document.getElementById('addCourseBtn').addEventListener('click', function () {
    siteData.courses.push({ icon: '🎓', title: 'Nuevo curso', desc: '', price: '', landing_url: '', active: false, countdown: false, countdown_fecha: '', old_price: '' });
    renderCourses();
  });
  document.getElementById('addTestimonialBtn').addEventListener('click', function () {
    siteData.testimonials.push({ type: 'testimonial', text: '', name: '', sector: '', initials: '', show: true });
    renderTestimonials();
  });

  // --- COLLECT ---
  function collectAll() {
    siteData.hero = {
      kicker: document.getElementById('hero-kicker').value,
      title: document.getElementById('hero-title').value,
      subtitle: document.getElementById('hero-subtitle').value,
      image: document.getElementById('hero-image').value
    };
    siteData.cupos = {
      mes: document.getElementById('cupos-mes').value,
      disponibles: parseInt(document.getElementById('cupos-disponibles').value) || 0,
      total: parseInt(document.getElementById('cupos-total').value) || 15,
      fecha_cierre: document.getElementById('cupos-fecha').value
    };
    collectFields('svc', siteData.services);
    collectFields('plan', siteData.pricing);
    collectFields('course', siteData.courses);
    collectFields('testi', siteData.testimonials);
    siteData.legal = {
      privacy: document.getElementById('legal-privacy').value,
      terms: document.getElementById('legal-terms').value
    };
    siteData.config = {
      whatsapp: document.getElementById('config-whatsapp').value,
      email: document.getElementById('config-email').value,
      instagram: document.getElementById('config-instagram').value,
      tiktok: document.getElementById('config-tiktok').value,
      facebook: document.getElementById('config-facebook').value
    };
  }

  function collectFields(prefix, arr) {
    document.querySelectorAll('[data-' + prefix + ']').forEach(function (el) {
      var i = parseInt(el.dataset[prefix]);
      var field = el.dataset.field;
      if (arr[i] && field) arr[i][field] = el.value;
    });
  }

  // --- SAVE ---
  saveBtn.addEventListener('click', function () {
    collectAll();
    saveStatus.textContent = 'Guardando...';
    saveStatus.className = 'save-status';

    if (!supabase) {
      setTimeout(function () {
        saveStatus.textContent = '⚠️ Supabase no configurado — datos en memoria';
        saveStatus.className = 'save-status save-status--error';
      }, 500);
      return;
    }

    var sections = ['hero', 'cupos', 'services', 'pricing', 'courses', 'testimonials', 'legal', 'config'];
    var promises = sections.map(function (section) {
      return supabase.from('site_content').upsert({
        section: section,
        data: siteData[section],
        updated_at: new Date().toISOString()
      }, { onConflict: 'section' });
    });

    Promise.all(promises)
      .then(function (results) {
        var hasError = results.some(function (r) { return r.error; });
        if (hasError) {
          saveStatus.textContent = '❌ Error al guardar';
          saveStatus.className = 'save-status save-status--error';
        } else {
          saveStatus.textContent = '✓ Guardado';
          saveStatus.className = 'save-status save-status--ok';
          setTimeout(function () { saveStatus.textContent = ''; }, 3000);
        }
      })
      .catch(function () {
        saveStatus.textContent = '❌ Error de conexión';
        saveStatus.className = 'save-status save-status--error';
      });
  });

  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --- INIT ---
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  script.onload = function () {
    initSupabase();
    if (supabase) {
      supabase.auth.getSession().then(function (res) {
        if (res.data.session) {
          currentUser = res.data.session.user;
          showDashboard(currentUser.email);
        }
      });
    }
  };
  script.onerror = function () {
    console.warn('Supabase CDN no disponible.');
  };
  document.head.appendChild(script);

})();

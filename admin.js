/* ============================================================
   HABLAME.IA — Admin Panel Logic
   Supabase auth + CRUD para contenido del sitio
   ============================================================ */

(function () {
  'use strict';

  // --- SUPABASE CONFIG ---
  // Reemplazar con los valores reales de tu proyecto Supabase
  var SUPABASE_URL = 'https://fnoolbnacifxgppfjsoa.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub29sYm5hY2lmeGdwcGZqc29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MTU3MzEsImV4cCI6MjA5OTI5MTczMX0.sNfRvqyrP_X5uDedP9j59L2fwLgboIOZSCaZCYBXvPI';

  var supabase = null;
  var currentUser = null;

  // Intentar inicializar Supabase
  function initSupabase() {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return true;
    }
    return false;
  }

  // --- DOM REFS ---
  var loginView = document.getElementById('loginView');
  var dashboardView = document.getElementById('dashboardView');
  var loginForm = document.getElementById('loginForm');
  var loginError = document.getElementById('loginError');
  var logoutBtn = document.getElementById('logoutBtn');
  var dashUser = document.getElementById('dashUser');
  var saveBtn = document.getElementById('saveBtn');
  var saveStatus = document.getElementById('saveStatus');

  // --- VIEW TOGGLE ---
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

  // --- AUTH ---
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;
    loginError.style.display = 'none';

    if (!supabase) {
      showError('Supabase no configurado. Revisa SUPABASE_URL y SUPABASE_ANON_KEY en admin.js');
      return;
    }

    supabase.auth.signInWithPassword({ email: email, password: password })
      .then(function (res) {
        if (res.error) {
          showError(res.error.message);
        } else {
          currentUser = res.data.user;
          showDashboard(currentUser.email);
        }
      })
      .catch(function (err) {
        showError('Error de conexion: ' + err.message);
      });
  });

  logoutBtn.addEventListener('click', function () {
    if (supabase) {
      supabase.auth.signOut().then(function () {
        currentUser = null;
        showLogin();
      });
    } else {
      showLogin();
    }
  });

  function showError(msg) {
    loginError.textContent = msg;
    loginError.style.display = 'block';
  }

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

  // --- DATA STORAGE (local fallback when Supabase not configured) ---
  var siteData = {
    hero: {
      kicker: 'Automatizacion con IA · Pasto, Colombia',
      title: 'Son las 11:42 PM. Tu cliente pregunta. ¿Quien responde?',
      subtitle: 'Automatizaciones con inteligencia artificial para empresas + formacion para emprendedores que quieren monetizar con tecnologia.',
      btn1: 'Soluciones para empresas',
      btn2: 'Cursos y formacion'
    },
    services: [
      { icon: '💬', title: 'Tu asistente en WhatsApp que nunca duerme', desc: 'Un agente de IA que responde a tus clientes por WhatsApp 24/7.', includes: 'Respuestas 24/7\nAgendamiento de citas\nCatalogo de servicios\nCalificacion de leads\nCRM en Google Sheets\nSoporte mensual', niches: 'Salones de belleza, Inmobiliarias, Clinicas, Restaurantes', active: true },
      { icon: '📊', title: 'Tu negocio en una sola pantalla', desc: 'Panel web con citas, clientes, facturacion e inventario.', includes: 'Panel de citas y reservas\nMetricas en vivo\nAcceso desde cualquier dispositivo', niches: '', active: true },
      { icon: '🌐', title: 'Tu web o app lista en dias, no en meses', desc: 'Landing pages, catalogos, sistemas de reservas online.', includes: 'Diseno personalizado\nOptimizada para celular\nIntegrada con WhatsApp', niches: '', active: true },
      { icon: '🧾', title: 'Foto de factura → datos para tu contador', desc: 'La IA categoriza y organiza tus facturas.', includes: '', niches: '', active: false },
      { icon: '📦', title: 'Control de stock sin planillas', desc: 'Alertas, reportes automaticos, control de entradas y salidas.', includes: '', niches: '', active: false }
    ],
    pricing: [
      { name: 'Basico', desc: 'Para empezar a no perder mensajes.', price: '150.000', setup: '300.000', features: '1 agente IA\n1 numero WhatsApp\nRespuestas automaticas 24/7\nSync Google Sheets\nSoporte por chat', popular: false, wa_msg: 'Hola, me interesa el Plan Basico de automatizacion para mi negocio.' },
      { name: 'Profesional', desc: 'El que eligen la mayoria.', price: '280.000', setup: '400.000', features: 'Todo lo del Basico\nTranscripcion de audios\nMemoria de clientes\nRecordatorios automaticos\nReportes mensuales', popular: true, wa_msg: 'Hola, quiero saber mas del Plan Profesional de automatizacion.' },
      { name: 'Premium', desc: 'Tu negocio en piloto automatico.', price: '450.000', setup: '500.000', features: 'Todo lo del Profesional\nMulti-canal (IG + FB)\nRemarketing automatico\nPanel de analytics\nSoporte prioritario', popular: false, wa_msg: 'Hola, me interesa el Plan Premium con todos los servicios.' }
    ],
    courses: [
      { icon: '🎓', title: 'Automatizacion con IA para emprendedores', desc: 'Aprende a usar IA para automatizar tareas reales.', price: '127.000', payment_link: '', includes: '3 modulos en video\nQue es un LLM (sin tecnicismos)\nPrompting efectivo\nTu primer agente WhatsApp\nAcceso a comunidad\nTutor IA 24/7', active: true },
      { icon: '📣', title: 'Vibe Marketing: vende mas sin equipo grande', desc: 'Campanas, prospeccion y ventas con IA.', price: '', payment_link: '', includes: '', active: false },
      { icon: '⚙️', title: 'Vibe Coding: construye y vende automatizaciones', desc: 'Crea agentes, dashboards y sistemas usando IA.', price: '', payment_link: '', includes: '', active: false }
    ],
    legal: { privacy: '', terms: '' },
    config: { whatsapp: '573170731171', email: '', instagram: '', tiktok: '', facebook: '' }
  };

  // --- LOAD DATA ---
  function loadAllData() {
    if (!supabase) {
      renderAll();
      return;
    }

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
    renderServices();
    renderPricing();
    renderCourses();
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
    document.getElementById('hero-btn1').value = h.btn1 || '';
    document.getElementById('hero-btn2').value = h.btn2 || '';
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
            '<span style="font-size:24px;">' + (svc.icon || '📦') + '</span> ' +
            'Servicio ' + (i + 1) +
            ' <span class="edit-card-badge ' + (svc.active ? 'edit-card-badge--active' : 'edit-card-badge--soon') + '">' + (svc.active ? 'Activo' : 'Proximo') + '</span>' +
          '</div>' +
          '<div style="display:flex;gap:4px;">' +
            (i > 0 ? '<button class="btn-admin btn-sm btn-outline-admin" data-move-svc-up="' + i + '" title="Subir">&uarr;</button>' : '') +
            (i < siteData.services.length - 1 ? '<button class="btn-admin btn-sm btn-outline-admin" data-move-svc-down="' + i + '" title="Bajar">&darr;</button>' : '') +
            '<button class="btn-admin btn-danger btn-sm" data-delete-service="' + i + '">Eliminar</button>' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Icono (emoji)</label><input type="text" class="form-input form-input-small" data-svc="' + i + '" data-field="icon" value="' + (svc.icon || '') + '"></div>' +
          '<div class="form-group"><label class="form-label">Estado</label>' +
            '<div class="toggle-wrapper"><div class="toggle ' + (svc.active ? 'on' : '') + '" data-svc-toggle="' + i + '"></div><span>' + (svc.active ? 'Activo' : 'Proximamente') + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="form-group"><label class="form-label">Titulo</label><input type="text" class="form-input" data-svc="' + i + '" data-field="title" value="' + escHtml(svc.title) + '"></div>' +
        '<div class="form-group"><label class="form-label">Descripcion</label><textarea class="form-textarea" data-svc="' + i + '" data-field="desc" rows="2">' + escHtml(svc.desc) + '</textarea></div>' +
        '<div class="form-group"><label class="form-label">Incluye (uno por linea)</label><textarea class="form-textarea" data-svc="' + i + '" data-field="includes" rows="4">' + escHtml(svc.includes) + '</textarea></div>' +
        '<div class="form-group"><label class="form-label">Nichos (separados por coma)</label><input type="text" class="form-input" data-svc="' + i + '" data-field="niches" value="' + escHtml(svc.niches) + '"></div>';
      list.appendChild(card);
    });

    list.querySelectorAll('[data-svc-toggle]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.svcToggle);
        siteData.services[idx].active = !siteData.services[idx].active;
        renderServices();
      });
    });

    list.querySelectorAll('[data-delete-service]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.deleteService);
        siteData.services.splice(idx, 1);
        renderServices();
      });
    });

    list.querySelectorAll('[data-move-svc-up]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.moveSvcUp);
        if (idx > 0) { var tmp = siteData.services[idx]; siteData.services[idx] = siteData.services[idx - 1]; siteData.services[idx - 1] = tmp; renderServices(); }
      });
    });

    list.querySelectorAll('[data-move-svc-down]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.moveSvcDown);
        if (idx < siteData.services.length - 1) { var tmp = siteData.services[idx]; siteData.services[idx] = siteData.services[idx + 1]; siteData.services[idx + 1] = tmp; renderServices(); }
      });
    });
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
          '<div class="edit-card-title">Plan ' + (i + 1) + ': ' + escHtml(plan.name) +
            (plan.popular ? ' <span class="edit-card-badge edit-card-badge--active">Destacado</span>' : '') +
          '</div>' +
          '<div class="toggle-wrapper"><div class="toggle ' + (plan.popular ? 'on' : '') + '" data-plan-popular="' + i + '"></div><span>Destacado</span></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Nombre</label><input type="text" class="form-input" data-plan="' + i + '" data-field="name" value="' + escHtml(plan.name) + '"></div>' +
          '<div class="form-group"><label class="form-label">Descripcion</label><input type="text" class="form-input" data-plan="' + i + '" data-field="desc" value="' + escHtml(plan.desc) + '"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Precio mensual (COP)</label><input type="text" class="form-input" data-plan="' + i + '" data-field="price" value="' + escHtml(plan.price) + '"></div>' +
          '<div class="form-group"><label class="form-label">Config. inicial (COP)</label><input type="text" class="form-input" data-plan="' + i + '" data-field="setup" value="' + escHtml(plan.setup) + '"></div>' +
        '</div>' +
        '<div class="form-group"><label class="form-label">Features (una por linea)</label><textarea class="form-textarea" data-plan="' + i + '" data-field="features" rows="4">' + escHtml(plan.features) + '</textarea></div>' +
        '<div class="form-group"><label class="form-label">Mensaje WhatsApp pre-llenado</label><input type="text" class="form-input" data-plan="' + i + '" data-field="wa_msg" value="' + escHtml(plan.wa_msg) + '"></div>';
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
            '<span style="font-size:24px;">' + (course.icon || '🎓') + '</span> ' +
            'Curso ' + (i + 1) +
            ' <span class="edit-card-badge ' + (course.active ? 'edit-card-badge--active' : 'edit-card-badge--soon') + '">' + (course.active ? 'Activo' : 'Proximo') + '</span>' +
          '</div>' +
          '<div style="display:flex;gap:4px;">' +
            (i > 0 ? '<button class="btn-admin btn-sm btn-outline-admin" data-move-course-up="' + i + '" title="Subir">&uarr;</button>' : '') +
            (i < siteData.courses.length - 1 ? '<button class="btn-admin btn-sm btn-outline-admin" data-move-course-down="' + i + '" title="Bajar">&darr;</button>' : '') +
            '<button class="btn-admin btn-danger btn-sm" data-delete-course="' + i + '">Eliminar</button>' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Icono</label><input type="text" class="form-input form-input-small" data-course="' + i + '" data-field="icon" value="' + (course.icon || '') + '"></div>' +
          '<div class="form-group"><label class="form-label">Estado</label>' +
            '<div class="toggle-wrapper"><div class="toggle ' + (course.active ? 'on' : '') + '" data-course-toggle="' + i + '"></div><span>' + (course.active ? 'Activo' : 'Proximamente') + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="form-group"><label class="form-label">Titulo</label><input type="text" class="form-input" data-course="' + i + '" data-field="title" value="' + escHtml(course.title) + '"></div>' +
        '<div class="form-group"><label class="form-label">Descripcion</label><textarea class="form-textarea" data-course="' + i + '" data-field="desc" rows="2">' + escHtml(course.desc) + '</textarea></div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">Precio (COP)</label><input type="text" class="form-input" data-course="' + i + '" data-field="price" value="' + escHtml(course.price) + '"></div>' +
          '<div class="form-group"><label class="form-label">Link de pago (Wompi)</label><input type="url" class="form-input" data-course="' + i + '" data-field="payment_link" value="' + escHtml(course.payment_link) + '" placeholder="https://checkout.wompi.co/..."></div>' +
        '</div>' +
        '<div class="form-group"><label class="form-label">Incluye (uno por linea)</label><textarea class="form-textarea" data-course="' + i + '" data-field="includes" rows="4">' + escHtml(course.includes) + '</textarea></div>';
      list.appendChild(card);
    });

    list.querySelectorAll('[data-course-toggle]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.courseToggle);
        siteData.courses[idx].active = !siteData.courses[idx].active;
        renderCourses();
      });
    });

    list.querySelectorAll('[data-delete-course]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.deleteCourse);
        siteData.courses.splice(idx, 1);
        renderCourses();
      });
    });

    list.querySelectorAll('[data-move-course-up]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.moveCourseUp);
        if (idx > 0) { var tmp = siteData.courses[idx]; siteData.courses[idx] = siteData.courses[idx - 1]; siteData.courses[idx - 1] = tmp; renderCourses(); }
      });
    });

    list.querySelectorAll('[data-move-course-down]').forEach(function (el) {
      el.addEventListener('click', function () {
        var idx = parseInt(el.dataset.moveCourseDown);
        if (idx < siteData.courses.length - 1) { var tmp = siteData.courses[idx]; siteData.courses[idx] = siteData.courses[idx + 1]; siteData.courses[idx + 1] = tmp; renderCourses(); }
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

  // --- ADD SERVICE ---
  document.getElementById('addServiceBtn').addEventListener('click', function () {
    siteData.services.push({ icon: '📋', title: 'Nuevo servicio', desc: '', includes: '', niches: '', active: true });
    renderServices();
  });

  // --- ADD COURSE ---
  document.getElementById('addCourseBtn').addEventListener('click', function () {
    siteData.courses.push({ icon: '🎓', title: 'Nuevo curso', desc: '', price: '', payment_link: '', includes: '', active: false });
    renderCourses();
  });

  // --- COLLECT DATA FROM FORMS ---
  function collectAll() {
    // Hero
    siteData.hero = {
      kicker: document.getElementById('hero-kicker').value,
      title: document.getElementById('hero-title').value,
      subtitle: document.getElementById('hero-subtitle').value,
      image: document.getElementById('hero-image').value,
      btn1: document.getElementById('hero-btn1').value,
      btn2: document.getElementById('hero-btn2').value
    };

    // Services
    document.querySelectorAll('[data-svc]').forEach(function (el) {
      var i = parseInt(el.dataset.svc);
      var field = el.dataset.field;
      if (siteData.services[i]) {
        siteData.services[i][field] = el.value;
      }
    });

    // Pricing
    document.querySelectorAll('[data-plan]').forEach(function (el) {
      var i = parseInt(el.dataset.plan);
      var field = el.dataset.field;
      if (siteData.pricing[i]) {
        siteData.pricing[i][field] = el.value;
      }
    });

    // Courses
    document.querySelectorAll('[data-course]').forEach(function (el) {
      var i = parseInt(el.dataset.course);
      var field = el.dataset.field;
      if (siteData.courses[i]) {
        siteData.courses[i][field] = el.value;
      }
    });

    // Legal
    siteData.legal = {
      privacy: document.getElementById('legal-privacy').value,
      terms: document.getElementById('legal-terms').value
    };

    // Config
    siteData.config = {
      whatsapp: document.getElementById('config-whatsapp').value,
      email: document.getElementById('config-email').value,
      instagram: document.getElementById('config-instagram').value,
      tiktok: document.getElementById('config-tiktok').value,
      facebook: document.getElementById('config-facebook').value
    };
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

    var sections = ['hero', 'services', 'pricing', 'courses', 'legal', 'config'];
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
        saveStatus.textContent = '❌ Error de conexion';
        saveStatus.className = 'save-status save-status--error';
      });
  });

  // --- UTILS ---
  function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --- INIT ---
  // Try loading Supabase from CDN
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
    console.warn('Supabase CDN no disponible, panel funciona en modo local.');
  };
  document.head.appendChild(script);

})();

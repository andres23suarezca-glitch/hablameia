-- ============================================================
-- HABLAME.IA — Supabase Setup
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- 1. Crear tabla site_content
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- 3. Politica: lectura publica (para que la landing lea contenido)
CREATE POLICY "Lectura publica" ON site_content
  FOR SELECT
  USING (true);

-- 4. Politica: escritura solo para usuarios autenticados (admin)
CREATE POLICY "Escritura autenticados" ON site_content
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Insertar datos iniciales

-- HERO
INSERT INTO site_content (section, data) VALUES ('hero', '{
  "kicker": "Automatización con IA · Pasto, Colombia",
  "title": "Son las 11:42 PM. Tu cliente pregunta. ¿Quién responde?",
  "subtitle": "Automatizaciones con inteligencia artificial para empresas + formación para emprendedores que quieren monetizar con tecnología.",
  "btn1": "Soluciones para empresas",
  "btn2": "Cursos y formación"
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- SERVICIOS
INSERT INTO site_content (section, data) VALUES ('services', '[
  {"icon": "💬", "title": "Tu asistente en WhatsApp que nunca duerme", "desc": "Un agente de IA que responde a tus clientes por WhatsApp 24/7. Agenda citas, muestra tu catálogo, califica interesados y te avisa solo cuando importa. Tu cliente no descarga nada, no aprende nada — solo escribe por WhatsApp como siempre.", "includes": "Respuestas automáticas inteligentes\nAgendamiento de citas\nCatálogo de servicios\nCalificación de leads\nRegistro en hoja de cálculo (CRM)\nSoporte y ajustes mensuales", "niches": "Salones de belleza, Inmobiliarias, Clínicas, Restaurantes", "active": true},
  {"icon": "📊", "title": "Tu negocio en una sola pantalla", "desc": "Un panel web donde ves citas, clientes, facturación e inventario sin abrir 5 apps distintas. Conectado a tu WhatsApp y a tus datos reales. Tú ves números, no caos.", "includes": "Panel de citas y reservas\nVista de clientes\nMétricas básicas de ventas\nAcceso desde celular o computador", "niches": "", "active": true},
  {"icon": "🌐", "title": "Tu web o app lista en días, no en meses", "desc": "Landing pages, catálogos públicos, sistemas de reservas online, páginas de captura. Diseñadas para tu negocio, listas para compartir por WhatsApp o redes.", "includes": "Diseño personalizado\nOptimizada para celular\nDominio propio\nIntegración con WhatsApp", "niches": "", "active": true},
  {"icon": "🧾", "title": "Foto de factura → datos para tu contador", "desc": "Tomas foto de una factura o recibo, la IA la categoriza y organiza los datos. Tu contador recibe todo listo, no cajas de papeles.", "includes": "", "niches": "", "active": false},
  {"icon": "📦", "title": "Control de stock sin planillas", "desc": "Alertas cuando un producto se agota, reportes automáticos, control de entradas y salidas. Para que nunca te quedes sin lo que más vendes.", "includes": "", "niches": "", "active": false}
]'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- PRECIOS
INSERT INTO site_content (section, data) VALUES ('pricing', '[
  {"name": "Básico", "desc": "Para empezar a no perder mensajes.", "price": "150.000", "setup": "300.000", "features": "1 agente IA\n1 número WhatsApp\nRespuestas automáticas 24/7\nSync Google Sheets\nSoporte por chat", "popular": false, "wa_msg": "Hola, me interesa el Plan Básico de automatización para mi negocio."},
  {"name": "Profesional", "desc": "El que eligen la mayoría.", "price": "280.000", "setup": "400.000", "features": "Todo lo del Básico\nTranscripción de audios\nMemoria de clientes\nRecordatorios automáticos\nReportes mensuales", "popular": true, "wa_msg": "Hola, quiero saber más del Plan Profesional de automatización."},
  {"name": "Premium", "desc": "Tu negocio en piloto automático.", "price": "450.000", "setup": "500.000", "features": "Todo lo del Profesional\nMulti-canal (IG + FB)\nRemarketing automático\nPanel de analytics\nSoporte prioritario", "popular": false, "wa_msg": "Hola, me interesa el Plan Premium con todos los servicios."}
]'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- CURSOS
INSERT INTO site_content (section, data) VALUES ('courses', '[
  {"icon": "🎓", "title": "Automatización con IA para emprendedores", "desc": "Aprende a usar inteligencia artificial para automatizar tareas reales de tu negocio. Sin humo, sin 50 herramientas. Un solo enfoque práctico con casos reales.", "price": "127.000", "payment_link": "", "includes": "3 módulos en video\nQué es un LLM y cómo funciona (sin tecnicismos)\nPrompting efectivo para tareas de negocio\nTu primer agente de WhatsApp paso a paso\nAcceso a comunidad\nAgente tutor IA 24/7 para resolver dudas", "active": true},
  {"icon": "📣", "title": "Vibe Marketing: vende más sin equipo grande", "desc": "Tú diriges, la IA ejecuta. Aprende a crear campañas, prospectar clientes y cerrar ventas usando inteligencia artificial como tu equipo de marketing.", "price": "", "payment_link": "", "includes": "", "active": false},
  {"icon": "⚙️", "title": "Vibe Coding: construye y vende automatizaciones", "desc": "Crea agentes de WhatsApp, dashboards y sistemas para otros negocios usando IA. Sin saber programar. Y cobra por ello.", "price": "", "payment_link": "", "includes": "", "active": false}
]'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- LEGAL
INSERT INTO site_content (section, data) VALUES ('legal', '{
  "privacy": "",
  "terms": ""
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- CONFIG
INSERT INTO site_content (section, data) VALUES ('config', '{
  "whatsapp": "573170731171",
  "email": "",
  "instagram": "",
  "tiktok": "",
  "facebook": ""
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

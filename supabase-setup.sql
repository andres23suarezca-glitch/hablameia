-- ============================================================
-- HABLAME.IA — Supabase Setup v3
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- 1. Tabla site_content
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Lectura publica" ON site_content FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Escritura autenticados" ON site_content FOR ALL
    USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Tabla auditorias (formulario)
CREATE TABLE IF NOT EXISTS auditorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  tipo_negocio TEXT,
  freno TEXT,
  origen TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE auditorias ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Insercion publica auditorias" ON auditorias FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Lectura autenticados auditorias" ON auditorias FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- DATOS INICIALES
-- ============================================================

INSERT INTO site_content (section, data) VALUES ('hero', '{
  "kicker": "HABLAME.IA · Inteligencia Artificial · Colombia",
  "title": "¿Estás listo para dejar de usar mal la «IA» y empezar a usarla para automatizar, vender y crecer tu negocio?",
  "subtitle": "Diseñamos automatizaciones, agentes de IA y soluciones para marketing, ventas, atención al cliente y gestión interna; además, formamos equipos y emprendedores para que aprendan a utilizar la IA con una metodología práctica.",
  "image": ""
}'::jsonb) ON CONFLICT (section) DO NOTHING;

INSERT INTO site_content (section, data) VALUES ('oferta', '{
  "texto": "NUESTRA OFERTA DE LANZAMIENTO ESTÁ A PUNTO DE FINALIZAR",
  "fecha_cierre": "31 de agosto",
  "disponibles": 3,
  "total": 15
}'::jsonb) ON CONFLICT (section) DO NOTHING;

INSERT INTO site_content (section, data) VALUES ('services', '[
  {"icon": "💬", "title": "Agente IA · Leads · CRM", "desc": "Capta, califica y agenda por WhatsApp 24/7.", "includes": "Respuestas 24/7\nAgendamiento de citas\nCalificación de leads\nCRM conectado\nMulticanal WA/IG/FB\nSoporte mensual", "active": true, "wa_msg": ""},
  {"icon": "📣", "title": "Contenido Viral · Video · Imagen IA", "desc": "Videos e imágenes creados con IA para tus redes y tu pauta.", "includes": "Reels y shorts\nFotos de producto\nGuiones con IA\nCalendario mensual\nListo para publicar", "active": true, "wa_msg": ""},
  {"icon": "📊", "title": "Publicidad con IA · Meta Ads", "desc": "Campañas en Facebook e Instagram sin agencia.", "includes": "Campañas en tu cuenta\nSegmentación automática\nCreativos incluidos\nReporte mensual\nSin cuota de agencia", "active": true, "wa_msg": ""},
  {"icon": "🌐", "title": "Web · Landing · Automatización", "desc": "Tu web lista en días, hecha para convertir.", "includes": "Diseño a medida\nOptimizada para móvil\nSEO + AEO/GEO\nIntegrada con WhatsApp\nFormularios conectados", "active": true, "wa_msg": ""}
]'::jsonb) ON CONFLICT (section) DO NOTHING;

INSERT INTO site_content (section, data) VALUES ('courses', '[
  {"icon": "🎓", "title": "Tu primer agente de IA en 60 minutos", "desc": "Curso gratuito para montar tu primer agente de WhatsApp con IA.", "price": "", "old_price": "", "landing_url": "#auditoria", "active": true, "countdown": false, "countdown_fecha": ""},
  {"icon": "📣", "title": "Crea tu propio contenido viral", "desc": "Videos e imágenes con IA para tus redes. Producción semanal sin cámara.", "price": "127.000", "old_price": "197.000", "landing_url": "curso-contenido-viral.html", "active": true, "countdown": false, "countdown_fecha": ""},
  {"icon": "⚙️", "title": "Todo sobre IA en 1", "desc": "Todo lo que necesitas saber de la IA para tu trabajo o para generar ingresos.", "price": "120.000", "old_price": "250.000", "landing_url": "curso-todo-ia.html", "active": true, "countdown": true, "countdown_fecha": "31 de agosto"}
]'::jsonb) ON CONFLICT (section) DO NOTHING;

INSERT INTO site_content (section, data) VALUES ('testimonials', '[
  {"type": "wa", "text": "Desde que Andrés implementó el agente de IA, el seguimiento de pacientes se hace solo.", "name": "Cristina Obando", "sector": "Clínica odontológica", "initials": "CO", "foto": "assets/client-1.webp", "show": true},
  {"type": "wa", "text": "Nunca imaginé resultados tan rápidos. Los clientes escriben y la IA los atiende al instante.", "name": "Santiago Ruiz", "sector": "Inmobiliaria", "initials": "SR", "foto": "assets/client-2.webp", "show": true},
  {"type": "wa", "text": "La combinación de atención con IA y la pauta que nos montó fue una bomba.", "name": "Christian Oñate", "sector": "Concesionario", "initials": "ChO", "foto": "assets/client-3.webp", "show": true},
  {"type": "wa", "text": "Tuvimos que pausar la pauta un día por la cantidad de clientes que llegaron.", "name": "Luz Castillo", "sector": "Campañas Meta Ads", "initials": "LC", "foto": "assets/client-4.webp", "show": true},
  {"type": "wa", "text": "Con las automatizaciones que creó para producción y contabilidad, la empresa funciona como un reloj.", "name": "Fernando Caiza", "sector": "Producción y contabilidad", "initials": "FC", "foto": "assets/client-5.webp", "show": true},
  {"type": "wa", "text": "El software que nos creó es una maravilla. Controlar a los vendedores era un dolor de cabeza.", "name": "Miguel Guerrero", "sector": "Distribución tienda a tienda", "initials": "MG", "foto": "assets/client-6.webp", "show": true},
  {"type": "ig", "text": "El sistema que desarrolló para el PAMEC y la auditoría interna fue la pieza que nos faltaba.", "name": "s.pantoja", "sector": "Hospital", "initials": "SP", "foto": "assets/client-7.webp", "show": true},
  {"type": "ig", "text": "Sus automatizaciones nos quitaron un peso enorme. Logramos la acreditación.", "name": "angela.bastidas", "sector": "Hospital", "initials": "AB", "foto": "assets/client-8.webp", "show": true},
  {"type": "ig", "text": "El nuevo sistema de call center es de otro mundo. La atención es inmediata y trazable.", "name": "atencion.hospital", "sector": "Hospital", "initials": "EA", "foto": "assets/client-9.webp", "show": true}
]'::jsonb) ON CONFLICT (section) DO NOTHING;

INSERT INTO site_content (section, data) VALUES ('legal', '{"privacy": "", "terms": ""}'::jsonb)
ON CONFLICT (section) DO NOTHING;

INSERT INTO site_content (section, data) VALUES ('config', '{
  "whatsapp": "573170731171", "email": "", "instagram": "", "tiktok": "", "facebook": ""
}'::jsonb) ON CONFLICT (section) DO NOTHING;

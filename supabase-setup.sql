-- ============================================================
-- HABLAME.IA — Supabase Setup v2
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- 1. Crear tabla site_content (si no existe)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- 3. Politica: lectura publica
DO $$ BEGIN
  CREATE POLICY "Lectura publica" ON site_content FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4. Politica: escritura autenticados
DO $$ BEGIN
  CREATE POLICY "Escritura autenticados" ON site_content FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 5. Tabla auditorias (formulario de auditoria gratis)
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

-- Cualquiera puede insertar (formulario publico)
DO $$ BEGIN
  CREATE POLICY "Insercion publica auditorias" ON auditorias
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Solo autenticados pueden leer
DO $$ BEGIN
  CREATE POLICY "Lectura autenticados auditorias" ON auditorias
    FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- HERO
INSERT INTO site_content (section, data) VALUES ('hero', '{
  "kicker": "HABLAME.IA · Automatización con IA · Colombia",
  "title": "Son las 11:42 PM.\nTu cliente pregunta.\n¿Quién responde?",
  "subtitle": "Agentes de inteligencia artificial que atienden, califican y venden por ti — más formación para emprendedores que quieren monetizar con tecnología.",
  "image": ""
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- CUPOS
INSERT INTO site_content (section, data) VALUES ('cupos', '{
  "mes": "Agosto 2026",
  "disponibles": 11,
  "total": 15,
  "fecha_cierre": "31 de agosto"
}'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- SERVICIOS
INSERT INTO site_content (section, data) VALUES ('services', '[
  {"icon": "💬", "title": "Agente IA · Leads · CRM", "desc": "Capta, califica y agenda por WhatsApp 24/7. Tus clientes escriben como siempre; tú recibes solo lo que importa.", "includes": "Respuestas 24/7\nAgendamiento de citas\nCalificación de leads\nCRM conectado\nMulticanal WA/IG/FB\nSoporte mensual", "active": true, "wa_msg": ""},
  {"icon": "📣", "title": "Contenido Viral · Video · Imagen IA", "desc": "Videos e imágenes creados con IA para tus redes y tu pauta. Producción semanal, sin equipo ni cámara.", "includes": "Reels y shorts\nFotos de producto\nGuiones con IA\nCalendario mensual\nListo para publicar", "active": true, "wa_msg": ""},
  {"icon": "📊", "title": "Publicidad con IA · Meta Ads", "desc": "Campañas en Facebook e Instagram sin agencia. Tú das la orden en tu idioma, la IA arma segmentación, presupuesto y creativos.", "includes": "Campañas en tu cuenta\nSegmentación automática\nCreativos incluidos\nReporte mensual\nSin cuota de agencia", "active": true, "wa_msg": ""},
  {"icon": "🌐", "title": "Web · Landing · Automatización", "desc": "Tu web lista en días, hecha para convertir y para que la IA te recomiende cuando alguien pregunte por tu sector.", "includes": "Diseño a medida\nOptimizada para móvil\nSEO + AEO/GEO\nIntegrada con WhatsApp\nFormularios conectados", "active": true, "wa_msg": ""}
]'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- PRECIOS
INSERT INTO site_content (section, data) VALUES ('pricing', '[
  {"name": "Básico", "desc": "Para empezar a no perder mensajes.", "price": "150.000", "setup": "300.000", "features": "1 agente IA\n1 número WhatsApp\nRespuestas automáticas 24/7\nSync Google Sheets\nSoporte por chat", "popular": false, "wa_msg": ""},
  {"name": "Profesional", "desc": "El que eligen la mayoría.", "price": "280.000", "setup": "400.000", "features": "Todo lo del Básico\nTranscripción de audios\nMemoria de clientes\nRecordatorios automáticos\nReportes mensuales", "popular": true, "wa_msg": ""},
  {"name": "Premium", "desc": "Tu negocio en piloto automático.", "price": "450.000", "setup": "500.000", "features": "Todo lo del Profesional\nMulti-canal (IG + FB)\nRemarketing automático\nPanel de analytics\nSoporte prioritario", "popular": false, "wa_msg": ""}
]'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- CURSOS
INSERT INTO site_content (section, data) VALUES ('courses', '[
  {"icon": "🎓", "title": "Tu primer agente de IA en 60 minutos", "desc": "Curso gratuito. Aprende lo básico para montar tu primer agente de WhatsApp con IA.", "price": "", "landing_url": "#auditoria", "active": true, "countdown": false, "countdown_fecha": "", "old_price": ""},
  {"icon": "📣", "title": "Crea tu propio contenido viral", "desc": "Videos e imágenes con IA para tus redes. Producción semanal sin cámara ni equipo.", "price": "127.000", "landing_url": "curso-contenido-viral.html", "active": true, "countdown": false, "countdown_fecha": "", "old_price": ""},
  {"icon": "⚙️", "title": "Todo sobre IA en 1", "desc": "Todo lo que necesitas saber de la IA para tu trabajo o para generar ingresos.", "price": "120.000", "landing_url": "curso-todo-ia.html", "active": true, "countdown": true, "countdown_fecha": "31 de agosto", "old_price": "250.000"}
]'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- TESTIMONIOS
INSERT INTO site_content (section, data) VALUES ('testimonials', '[
  {"type": "capture", "icon": "📱", "label": "Luna agendando una cita a las 11:42 PM", "show": true},
  {"type": "capture", "icon": "📋", "label": "Luna calificando un lead y pasándolo a un humano", "show": true},
  {"type": "capture", "icon": "💬", "label": "Luna respondiendo un DM de Instagram", "show": true},
  {"type": "testimonial", "text": "Desde que Andrés implementó el agente de IA, el seguimiento de pacientes se hace solo: agenda las citas de forma natural y ya no tenemos huecos en la agenda.", "name": "Cristina Obando", "sector": "Clínica odontológica", "initials": "CO", "show": true},
  {"type": "testimonial", "text": "Nunca imaginé resultados tan rápidos. Los clientes escriben y la IA los atiende al instante, les perfila las propiedades y los deja listos para cerrar.", "name": "Santiago Ruiz", "sector": "Inmobiliaria", "initials": "SR", "show": true},
  {"type": "testimonial", "text": "La combinación de atención con IA y la pauta que nos montó fue una bomba. Los clientes llegan interesados y la atención automatizada los enamora.", "name": "Christian Oñate", "sector": "Concesionario", "initials": "ChO", "show": true},
  {"type": "testimonial", "text": "Tuvimos que pausar la pauta un día por la cantidad de clientes que llegaron. Nunca había visto resultados así en Meta.", "name": "Luz Castillo", "sector": "Campañas Meta Ads", "initials": "LC", "show": true},
  {"type": "testimonial", "text": "Con las automatizaciones que creó para producción y contabilidad, la empresa funciona como un reloj. Redujimos errores a cero.", "name": "Fernando Caiza", "sector": "Producción y contabilidad", "initials": "FC", "show": true},
  {"type": "testimonial", "text": "El software que nos creó es una maravilla. Controlar a los vendedores y hacer seguimiento entre Cali y Pasto era un dolor de cabeza; ahora tengo todo en tiempo real.", "name": "Miguel Guerrero", "sector": "Distribución tienda a tienda", "initials": "MG", "show": true},
  {"type": "testimonial", "text": "El sistema que desarrolló para el PAMEC y la auditoría interna fue la pieza que nos faltaba. Recibir la certificación ISO 9001 fue un proceso fluido.", "name": "S. Pantoja", "sector": "Hospital", "initials": "SP", "show": true},
  {"type": "testimonial", "text": "Sus automatizaciones nos quitaron un peso enorme. Procesos que tomaban semanas ahora se hacen en segundos. Logramos la acreditación.", "name": "Angela Bastidas", "sector": "Hospital", "initials": "AB", "show": true},
  {"type": "testimonial", "text": "El nuevo sistema de call center es de otro mundo. La atención es inmediata y trazable. Los usuarios se sienten escuchados.", "name": "Equipo de Atención", "sector": "Hospital", "initials": "EA", "show": true}
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

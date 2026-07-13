# Deploy — Hablame.IA en Cloudflare Pages

## 1. Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar todo el contenido de `supabase-setup.sql`
3. Ir a **Authentication > Users** y crear el usuario admin (email + contraseña)
4. Ir a **Settings > API** y copiar:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public key** → `eyJhbGci...`

## 2. Configurar las claves en el código

Reemplazar los placeholders en **3 archivos**:

| Archivo | Buscar | Reemplazar con |
|---------|--------|----------------|
| `main.js` | `https://TU-PROYECTO.supabase.co` | Tu Project URL |
| `main.js` | `TU-ANON-KEY` | Tu anon public key |
| `admin.js` | `https://TU-PROYECTO.supabase.co` | Tu Project URL |
| `admin.js` | `TU-ANON-KEY` | Tu anon public key |
| `privacidad.html` | `https://TU-PROYECTO.supabase.co` | Tu Project URL |
| `privacidad.html` | `TU-ANON-KEY` | Tu anon public key |
| `terminos.html` | `https://TU-PROYECTO.supabase.co` | Tu Project URL |
| `terminos.html` | `TU-ANON-KEY` | Tu anon public key |

> La anon key es pública por diseño. La seguridad está en las políticas RLS de Supabase.
> NUNCA pongas la `service_role` key en el frontend.

## 3. Subir a GitHub

```bash
git init
git add .
git commit -m "Hablame.IA - sitio completo"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/hablame-ia.git
git push -u origin main
```

## 4. Conectar con Cloudflare Pages

1. Ir a [dash.cloudflare.com](https://dash.cloudflare.com) > **Workers & Pages**
2. Click **Create** > **Pages** > **Connect to Git**
3. Autorizar GitHub si no lo has hecho
4. Seleccionar el repositorio `hablame-ia`
5. Configuración de build:
   - **Production branch:** `main`
   - **Build command:** *(dejar vacío)*
   - **Build output directory:** `/`
6. Click **Save and Deploy**

El deploy tarda ~30 segundos. Tu sitio estará en `hablame-ia.pages.dev`.

## 5. Dominio personalizado (opcional)

1. En el proyecto de Cloudflare Pages > **Custom domains**
2. Click **Set up a custom domain**
3. Escribir tu dominio (ej: `hablame.ia` o `www.hablame.ia`)
4. Cloudflare te dará un registro CNAME para apuntar
5. Si el dominio está en Cloudflare DNS, se configura automáticamente

## Estructura de archivos

```
hablame-ia/
├── index.html          ← Landing page pública
├── admin.html          ← Panel de administración
├── privacidad.html     ← Política de privacidad
├── terminos.html       ← Términos y condiciones
├── styles.css          ← Estilos de la landing
├── admin.css           ← Estilos del admin
├── main.js             ← JS landing + Supabase CMS
├── admin.js            ← JS admin panel
├── supabase-setup.sql  ← Script de base de datos
├── _headers            ← Headers de seguridad
└── DEPLOY.md           ← Este archivo
```

## Flujo de contenido

```
Admin edita en admin.html
        ↓
Guarda en Supabase (site_content)
        ↓
Landing (index.html) lee de Supabase al cargar
        ↓
Si Supabase falla → contenido hardcodeado se mantiene
```

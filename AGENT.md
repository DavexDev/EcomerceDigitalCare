# AGENT.md — Contexto del Proyecto DigitalCare GT

Este archivo proporciona contexto completo para agentes de IA (Copilot, Claude, Cursor, etc.) que trabajen en este repositorio.

---

## 🧭 Descripción General

**DigitalCare GT** es un sitio web comercial para una empresa de tecnología en Guatemala.  
Ofrece servicios de soporte técnico, mantenimiento, seguridad digital, asesorías, desarrollo web, y venta de productos (licencias y accesorios).

Tiene dos sucursales:

- **Chiquimula** → WhatsApp: 5765 5899
- **Esquipulas** → WhatsApp: 5424 9388

---

## 🛠️ Stack Tecnológico

| Capa                 | Tecnología                          | Uso                          |
| -------------------- | ----------------------------------- | ---------------------------- |
| Framework            | **Next.js 16** (App Router)         | SSR + rutas + API            |
| UI                   | **React 19** + CSS global           | Componentes                  |
| Estilos              | **Tailwind CSS v4** + `globals.css` | Layout y diseño              |
| Base de datos        | **Supabase** (PostgreSQL)           | Productos, licencias, leads  |
| Autenticación        | **Firebase Auth** (Google Sign-In)  | Login del panel admin        |
| Deploy               | **Vercel** (CI/CD desde GitHub)     | Hosting + builds automáticos |
| Control de versiones | **Git + GitHub**                    | Repositorio principal        |

---

## 📁 Estructura del Proyecto

```
digitalcare-nextjs/
├── app/
│   ├── layout.js               # RootLayout global: AuthProvider + WhatsAppModal + fuente Orbitron
│   ├── globals.css             # TODOS los estilos: migrado desde style.css original
│   ├── page.js                 # Página principal (Home) — todas las secciones
│   ├── accesorios/
│   │   └── page.js             # Catálogo de accesorios — datos desde Supabase (SSR)
│   ├── licencias/
│   │   └── page.js             # Catálogo de licencias — datos desde Supabase (SSR)
│   └── admin/
│       ├── layout.js           # Guard de autenticación Firebase — redirige a /admin/login si no hay sesión
│       ├── page.js             # Dashboard con conteo de registros por tabla
│       ├── login/
│       │   └── page.js         # Login con Google (Firebase Auth)
│       ├── accesorios/
│       │   └── page.js         # CRUD completo: crear, editar, toggle activo, eliminar
│       ├── licencias/
│       │   └── page.js         # CRUD completo de licencias con tipo y plataforma
│       └── contactos/
│           └── page.js         # Tabla de leads capturados por el modal de WhatsApp
│
├── components/
│   ├── Header.js               # Navegación con submenús, hamburguesa, scroll effect
│   ├── WhatsAppModal.js        # Modal de contacto: guarda lead en Supabase + abre WhatsApp
│   └── ProductCard.js          # Tarjeta reutilizable para accesorios y licencias
│
├── hooks/
│   └── useAuth.js              # Context de Firebase Auth: user, loading, loginWithGoogle, logout
│
├── lib/
│   ├── supabase.js             # Cliente Supabase (usa NEXT_PUBLIC_SUPABASE_URL + ANON_KEY)
│   └── firebase.js             # Config Firebase + GoogleAuthProvider
│
├── supabase/
│   └── schema.sql              # Schema SQL completo: tablas + RLS + datos seed de ejemplo
│
├── public/
│   ├── logo.png                # Logo de la empresa
│   └── hero-bg.mp4             # Video de fondo del hero (NO incluido en git — subir a Supabase Storage)
│
├── .env.example                # Plantilla de variables de entorno (sin valores reales)
├── .env.local                  # Variables reales — IGNORADO por git (.gitignore incluye .env*)
├── vercel.json                 # Config de Vercel: framework, env refs, headers de seguridad
├── next.config.mjs             # Config de Next.js
├── tailwind.config.js          # Config de Tailwind (si existe)
├── package.json                # Dependencias del proyecto
├── README.md                   # Guía de setup para desarrolladores
└── AGENT.md                    # Este archivo — contexto para agentes de IA
```

---

## 🗄️ Base de Datos Supabase

### Tablas

| Tabla        | Campos clave                                                            | Notas                                 |
| ------------ | ----------------------------------------------------------------------- | ------------------------------------- |
| `accesorios` | `id, nombre, descripcion, precio, stock, activo, created_at`            | RLS: lectura pública si `activo=true` |
| `licencias`  | `id, nombre, descripcion, precio, tipo, plataforma, activo, created_at` | `tipo`: permanente/anual/mensual      |
| `contactos`  | `id, producto, sucursal, mensaje, created_at`                           | Leads de WhatsApp — inserción pública |

### Row Level Security (RLS)

- **Lectura pública** (anon): solo registros con `activo = true`
- **Escritura**: solo `service_role` puede modificar productos
- **Contactos**: inserción pública, lectura solo `service_role`

### Ejecutar schema

```sql
-- En: supabase.com → tu proyecto → SQL Editor
-- Ejecuta: supabase/schema.sql
```

---

## 🔐 Variables de Entorno

Todas las variables deben estar en `.env.local` (local) y en el dashboard de Vercel (producción).

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

---

## 🗺️ Rutas de la Aplicación

| Ruta                | Tipo        | Descripción                                          |
| ------------------- | ----------- | ---------------------------------------------------- |
| `/`                 | Public, SSR | Home con todas las secciones de servicios            |
| `/accesorios`       | Public, SSR | Catálogo dinámico de accesorios desde Supabase       |
| `/licencias`        | Public, SSR | Catálogo dinámico de licencias desde Supabase        |
| `/admin`            | Privado     | Dashboard con estadísticas (requiere Firebase login) |
| `/admin/login`      | Public      | Página de login con Google                           |
| `/admin/accesorios` | Privado     | CRUD de accesorios                                   |
| `/admin/licencias`  | Privado     | CRUD de licencias                                    |
| `/admin/contactos`  | Privado     | Vista de leads capturados                            |

---

## 🔄 Flujo del Modal de WhatsApp

1. Usuario hace clic en botón con clase `.btn-consultar` (o evento `open-whatsapp`)
2. `WhatsAppModal.js` captura el evento `CustomEvent('open-whatsapp', {detail: {producto}})`
3. Usuario elige sucursal y escribe mensaje
4. Al enviar: inserta registro en `supabase → contactos` (lead)
5. Abre WhatsApp Web: `https://wa.me/502{numero}?text={mensaje}`

---

## 🎨 Convenciones de Estilos

- **Sin módulos CSS** — todos los estilos están en `app/globals.css`
- **Fuente principal**: `Orbitron` (Google Fonts) via `next/font/google`
- **Colores de marca**:
  - Azul principal: `#176887`
  - Cyan acento: `#64ccc5`
  - Fondo claro: `#F5F5F5`
  - Texto: `#424242`
- **Clases CSS clave**: `.section`, `.container`, `.header`, `.modal-overlay`, `.modal`, `.btn-primary`, `.btn-consultar`, `.admin-layout`, `.admin-card`, `.admin-table`

---

## 🚀 Comandos Frecuentes

```bash
# Desarrollo local
cd ~/DigitalCarev.3/digitalcare-nextjs
npm run dev          # http://localhost:3000

# Build de producción
npm run build

# Deploy a Vercel
vercel --prod        # Requiere: npm i -g vercel && vercel login

# Subir cambios a GitHub (activa CI/CD en Vercel automáticamente)
git add -A && git commit -m "descripción" && git push origin main
```

---

## ⚠️ Notas Importantes para Agentes

1. **El video `hero-bg.mp4`** no está en el repo (43MB). En `app/page.js` la fuente es `/hero-bg.mp4` — reemplazar por URL de Supabase Storage en producción.
2. **Firebase Auth** solo acepta dominios autorizados — agregar el dominio de Vercel en _Firebase Console → Authentication → Settings → Dominios autorizados_.
3. **`useAuth.js`** usa `'use client'` — no usar directamente en Server Components.
4. **Las páginas de `app/accesorios/page.js` y `app/licencias/page.js`** son Server Components (sin `'use client'`) — hacen el fetch a Supabase en el servidor.
5. **El panel `/admin`** tiene su propio `layout.js` que verifica auth en cada render del cliente.
6. La propiedad `revalidate = 0` en `/admin/contactos/page.js` fuerza datos frescos en cada visita.

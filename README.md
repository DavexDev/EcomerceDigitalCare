# DigitalCare GT — Next.js + Supabase + Firebase + Vercel

Versión moderna del sitio web de **DigitalCare GT**, migrado a un stack full-stack profesional.

## 🛠️ Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Estilos | Tailwind CSS v4 + CSS global |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Firebase Auth (Google Sign-In) |
| Deploy | Vercel (CI/CD desde GitHub) |

---

## ⚡ Inicio rápido

```bash
git clone https://github.com/tu-usuario/digitalcare-nextjs.git
cd digitalcare-nextjs
npm install
cp .env.example .env.local
# Edita .env.local con tus credenciales
npm run dev
```

## 🔧 Configuración

### Supabase
1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta `supabase/schema.sql` en el SQL Editor
3. Copia **URL** y **anon key** → `.env.local`

### Firebase Auth
1. Crea proyecto en [console.firebase.google.com](https://console.firebase.google.com)
2. Activa **Authentication → Google**
3. Crea app web y copia credenciales → `.env.local`
4. Agrega tu dominio Vercel en **Authentication → Dominios autorizados**

### Vercel (deploy)
```bash
# Opción A: CLI
vercel --prod

# Opción B: GitHub CI/CD (recomendado)
# Importa el repo en vercel.com/new y agrega las env vars
```

## 🗺️ Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/accesorios` | Catálogo dinámico (Supabase) |
| `/licencias` | Catálogo dinámico (Supabase) |
| `/admin` | Dashboard (requiere login) |
| `/admin/login` | Login con Google |
| `/admin/accesorios` | CRUD accesorios |
| `/admin/licencias` | CRUD licencias |
| `/admin/contactos` | Leads de WhatsApp |

## 📝 Nota sobre el video de fondo

El archivo `hero-bg.mp4` (~43MB) no se incluye en el repo. Cópialo a `public/` o súbelo a Supabase Storage y actualiza la ruta en `app/page.js`.

```bash
cp ../DigitalCareV_3/hero-bg.mp4 public/hero-bg.mp4
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

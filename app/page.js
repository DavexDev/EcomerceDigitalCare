import Header from '@/components/Header';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section className="hero">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>DigitalCare GT</h1>
          <p>Soporte técnico, desarrollo web, seguridad digital y más.</p>
        </div>
      </section>

      {/* MANTENIMIENTO */}
      <section id="mantenimiento" className="section mantenimiento">
        <div className="container">
          <h2>Mantenimiento de PC y Consolas</h2>
          <p>Ofrecemos servicios completos de diagnóstico, reparación y mantenimiento preventivo.</p>
          <ul className="servicios-lista">
            <li>✔ Limpieza interna y externa</li>
            <li>✔ Cambio de pasta térmica</li>
            <li>✔ Diagnóstico de fallos</li>
            <li>✔ Reparación de hardware</li>
            <li>✔ Instalación de sistema operativo</li>
          </ul>
        </div>
      </section>

      {/* ACCESORIOS (preview) */}
      <section id="accesorios" className="section accesorios">
        <div className="container">
          <h2>Accesorios</h2>
          <p>Encuentra los mejores complementos para tu PC o consola.</p>
          <div className="ver-mas-container">
            <Link href="/accesorios" className="btn-ver-mas">Ver accesorios</Link>
          </div>
        </div>
      </section>

      {/* LICENCIAS (preview) */}
      <section id="licencias" className="section licencias">
        <div className="container">
          <h2>Venta de Licencias</h2>
          <p>Licencias originales para uso personal, profesional o empresarial.</p>
          <div className="ver-mas-container">
            <Link href="/licencias" className="btn-ver-mas">Ver licencias</Link>
          </div>
        </div>
      </section>

      {/* SOPORTE */}
      <section id="soporte" className="section soporte">
        <div className="container">
          <h2>Soporte Técnico</h2>
          <p>Asistencia especializada para computadoras, laptops y consolas.</p>
          <div className="soporte-servicios">
            <div className="servicio"><h3>✔ Diagnóstico remoto</h3><p>Conexión segura para diagnosticar y resolver problemas.</p></div>
            <div className="servicio"><h3>✔ Reparaciones a domicilio</h3><p>Servicio técnico rápido y profesional.</p></div>
            <div className="servicio"><h3>✔ Optimización de rendimiento</h3><p>Mejoramos el funcionamiento de tu sistema.</p></div>
          </div>
        </div>
      </section>

      {/* ASESORÍAS */}
      <section id="asesorias" className="section asesorias">
        <div className="container">
          <h2>Asesorías</h2>
          <p>Te ayudamos a tomar decisiones tecnológicas acertadas.</p>
          <div className="asesorias-grid">
            <div className="asesoria-item"><h3>✔ Elección de equipos</h3><p>Recomendaciones según tu presupuesto.</p></div>
            <div className="asesoria-item"><h3>✔ Configuraciones personalizadas</h3><p>Setups para gaming, oficina o trabajo creativo.</p></div>
            <div className="asesoria-item"><h3>✔ Soluciones a medida</h3><p>Software, seguridad y herramientas digitales.</p></div>
          </div>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section id="seguridad" className="section seguridad">
        <div className="container">
          <h2>Protección y Seguridad Digital</h2>
          <p>Protege tu información con nuestros servicios de ciberseguridad.</p>
          <div className="seguridad-lista">
            <div className="seguridad-item"><h3>✔ Instalación de antivirus</h3><p>ESET, Kaspersky o Bitdefender.</p></div>
            <div className="seguridad-item"><h3>✔ Protección de datos</h3><p>Respaldo automático y cifrado seguro.</p></div>
            <div className="seguridad-item"><h3>✔ Auditoría de seguridad</h3><p>Cerramos vulnerabilidades en tu entorno.</p></div>
          </div>
        </div>
      </section>

      {/* DESARROLLO WEB */}
      <section id="desarrollo" className="section desarrollo">
        <div className="container">
          <h2>Desarrollo Web</h2>
          <p>Diseñamos sitios web profesionales, responsivos y optimizados.</p>
          <div className="desarrollo-tipos">
            <div className="tipo-web"><h3>✔ Sitios Informativos</h3><p>Empresas, servicios y portafolios.</p></div>
            <div className="tipo-web"><h3>✔ E-commerce</h3><p>Tiendas online con pagos integrados.</p></div>
            <div className="tipo-web"><h3>✔ Landing Pages</h3><p>Orientadas a conversión o productos.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.js file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

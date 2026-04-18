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
          <p>Ofrecemos servicios completos de diagnóstico, reparación y mantenimiento preventivo para computadoras y consolas de videojuegos.</p>
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
          <p>Encuentra los mejores complementos para tu PC o consola: calidad, estilo y funcionalidad en un solo lugar.</p>
          <div className="accesorios-grid">
            <div className="accesorio-card">
              <h3>Teclado Mecánico RGB</h3>
              <p>Iluminación LED, switches blue, ideal para gaming y escritura.</p>
              <span className="precio">Q250</span>
            </div>
            <div className="accesorio-card">
              <h3>Mouse Gamer 7200 DPI</h3>
              <p>Diseño ergonómico, 6 botones programables.</p>
              <span className="precio">Q180</span>
            </div>
            <div className="accesorio-card">
              <h3>Auriculares con Micrófono</h3>
              <p>Sonido envolvente, cómodos para largas sesiones.</p>
              <span className="precio">Q220</span>
            </div>
          </div>
          <div className="ver-mas-container">
            <Link href="/accesorios" className="btn-ver-mas">Ver más accesorios</Link>
          </div>
        </div>
      </section>

      {/* LICENCIAS (preview) */}
      <section id="licencias" className="section licencias">
        <div className="container">
          <h2>Venta de Licencias</h2>
          <p>Licencias originales para uso personal, profesional o empresarial. Garantizamos productos genuinos y activación segura.</p>
          <div className="licencias-grid">
            <div className="licencia-card">
              <h3>Windows 10/11 Pro</h3>
              <p>Licencia permanente</p>
              <span className="precio">Q150</span>
            </div>
            <div className="licencia-card">
              <h3>Microsoft Office 2021</h3>
              <p>Word, Excel, PowerPoint y más</p>
              <span className="precio">Q200</span>
            </div>
            <div className="licencia-card">
              <h3>Antivirus ESET</h3>
              <p>Protección total por 1 año</p>
              <span className="precio">Q120</span>
            </div>
          </div>
          <div className="ver-mas-container">
            <Link href="/licencias" className="btn-ver-mas">Ver más licencias</Link>
          </div>
        </div>
      </section>

      {/* SOPORTE */}
      <section id="soporte" className="section soporte">
        <div className="container">
          <h2>Soporte Técnico</h2>
          <p>Asistencia especializada para computadoras, laptops y consolas. Soluciones a problemas de hardware y software.</p>
          <div className="soporte-servicios">
            <div className="servicio">
              <h3>✔ Diagnóstico remoto</h3>
              <p>Conexión segura para diagnosticar y resolver problemas.</p>
            </div>
            <div className="servicio">
              <h3>✔ Reparaciones a domicilio</h3>
              <p>Servicio técnico rápido y profesional donde lo necesites.</p>
            </div>
            <div className="servicio">
              <h3>✔ Optimización de rendimiento</h3>
              <p>Mejoramos el funcionamiento de tu sistema.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ASESORÍAS */}
      <section id="asesorias" className="section asesorias">
        <div className="container">
          <h2>Asesorías</h2>
          <p>Te ayudamos a tomar decisiones tecnológicas acertadas con soluciones a medida.</p>
          <div className="asesorias-grid">
            <div className="asesoria-item">
              <h3>✔ Elección de equipos</h3>
              <p>Recomendaciones según tu presupuesto y necesidades.</p>
            </div>
            <div className="asesoria-item">
              <h3>✔ Configuraciones personalizadas</h3>
              <p>Setups para gaming, oficina o trabajo creativo.</p>
            </div>
            <div className="asesoria-item">
              <h3>✔ Soluciones a medida</h3>
              <p>Te recomendamos software, seguridad y herramientas digitales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section id="seguridad" className="section seguridad">
        <div className="container">
          <h2>Protección y Seguridad Digital</h2>
          <p>Protege tu información con nuestros servicios de ciberseguridad.</p>
          <div className="seguridad-lista">
            <div className="seguridad-item">
              <h3>✔ Instalación de antivirus</h3>
              <p>Protección avanzada con ESET, Kaspersky o Bitdefender.</p>
            </div>
            <div className="seguridad-item">
              <h3>✔ Protección de datos</h3>
              <p>Respaldo automático, cifrado y recuperación segura.</p>
            </div>
            <div className="seguridad-item">
              <h3>✔ Auditoría de seguridad</h3>
              <p>Evaluamos tu entorno digital y cerramos vulnerabilidades.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DESARROLLO WEB */}
      <section id="desarrollo" className="section desarrollo">
        <div className="container">
          <h2>Desarrollo Web</h2>
          <p>Diseñamos sitios web profesionales, responsivos y optimizados para tu negocio.</p>
          <div className="desarrollo-tipos">
            <div className="tipo-web">
              <h3>✔ Sitios Informativos</h3>
              <p>Ideales para empresas, servicios y portafolios.</p>
            </div>
            <div className="tipo-web">
              <h3>✔ E-commerce</h3>
              <p>Tiendas online completas con pagos integrados.</p>
            </div>
            <div className="tipo-web">
              <h3>✔ Landing Pages</h3>
              <p>Páginas orientadas a conversión o productos específicos.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

'use client';
import Header from '@/components/Header';
import Link from 'next/link';
import { 
  Wrench, Thermometer, Search, Settings, Disc3, 
  Keyboard, Mouse, Headphones, 
  AppWindow, BarChart3, Shield,
  Monitor, Home, Zap,
  Target, Gamepad2, Lightbulb,
  Lock, ScanSearch
} from 'lucide-react';

export default function HomePage() {
  const openWhatsApp = (producto) => {
    window.dispatchEvent(new CustomEvent('open-whatsapp', { detail: { producto } }));
  };

  return (
    <>
      <Header />

      {/* HERO - Kong inspired */}
      <section className="hero">
        <div className="hero-bg-gradient"></div>
        <div className="hero-content">
          <p className="hero-tagline">SOLUCIONES TECNOLÓGICAS</p>
          <h1 className="hero-title">
            <span className="gradient-text">Tecnología</span> que impulsa
            <br />tu productividad
          </h1>
          <p className="hero-subtitle">Soporte técnico, seguridad digital, licencias y accesorios para tu equipo.</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => openWhatsApp('Consulta General')}>
              Contáctanos
            </button>
            <Link href="/accesorios" className="btn-secondary">Ver Catálogo</Link>
          </div>
        </div>
      </section>

      {/* STATS - Kong inspired */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Clientes Satisfechos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99%</span>
            <span className="stat-label">Problemas Resueltos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24h</span>
            <span className="stat-label">Tiempo de Respuesta</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5★</span>
            <span className="stat-label">Calificación Promedio</span>
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section className="trust-banner">
        <p>CONFÍAN EN NOSOTROS</p>
        <div className="trust-logos">
          <span>ESET</span>
          <span>Microsoft</span>
          <span>Kaspersky</span>
          <span>Windows</span>
          <span>AMD</span>
          <span>Intel</span>
        </div>
      </section>

      {/* SERVICIOS - Kong inspired numbered sections */}
      <section className="services-intro">
        <div className="container">
          <p className="section-tag">NUESTROS SERVICIOS</p>
          <h2 className="section-title-large">Soluciones completas para tu <span className="gradient-text">tecnología</span></h2>
        </div>
      </section>

      {/* 01/ MANTENIMIENTO */}
      <section id="mantenimiento" className="section numbered-section">
        <div className="container">
          <div className="section-number">01/</div>
          <div className="section-content-split">
            <div className="section-left">
              <h2>Mantenimiento de PC y Consolas</h2>
              <p>Servicios completos de diagnóstico, reparación y mantenimiento preventivo para computadoras y consolas de videojuegos.</p>
              <button className="btn-outline" onClick={() => openWhatsApp('Mantenimiento')}>
                Solicitar Servicio
              </button>
            </div>
            <div className="section-right">
              <div className="feature-grid">
                <div className="feature-item"><span className="feature-icon"><Wrench size={20} /></span> Limpieza interna y externa</div>
                <div className="feature-item"><span className="feature-icon"><Thermometer size={20} /></span> Cambio de pasta térmica</div>
                <div className="feature-item"><span className="feature-icon"><Search size={20} /></span> Diagnóstico de fallos</div>
                <div className="feature-item"><span className="feature-icon"><Settings size={20} /></span> Reparación de hardware</div>
                <div className="feature-item"><span className="feature-icon"><Disc3 size={20} /></span> Instalación de sistema operativo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS SECTION - Kong inspired */}
      <section className="products-section">
        <div className="container">
          <p className="section-tag">NUESTROS PRODUCTOS</p>
          <h2 className="section-title-large">Todo lo que necesitas en <span className="gradient-text">un solo lugar</span></h2>
        </div>
      </section>

      {/* ACCESORIOS (preview) */}
      <section id="accesorios" className="section products-preview">
        <div className="container">
          <div className="products-header">
            <h2>Accesorios</h2>
            <Link href="/accesorios" className="btn-outline">Ver Catálogo</Link>
          </div>
          <p className="products-desc">Encuentra los mejores complementos para tu PC o consola.</p>
          <div className="products-grid">
            <div className="product-card-modern">
              <div className="product-icon"><Keyboard size={32} /></div>
              <h3>Teclado Mecánico RGB</h3>
              <p>Iluminación LED, switches blue, ideal para gaming.</p>
              <span className="product-price">Desde Q250</span>
            </div>
            <div className="product-card-modern">
              <div className="product-icon"><Mouse size={32} /></div>
              <h3>Mouse Gamer 7200 DPI</h3>
              <p>Diseño ergonómico, 6 botones programables.</p>
              <span className="product-price">Desde Q180</span>
            </div>
            <div className="product-card-modern">
              <div className="product-icon"><Headphones size={32} /></div>
              <h3>Auriculares con Micrófono</h3>
              <p>Sonido envolvente, cómodos para largas sesiones.</p>
              <span className="product-price">Desde Q220</span>
            </div>
          </div>
        </div>
      </section>

      {/* LICENCIAS (preview) */}
      <section id="licencias" className="section products-preview alt-bg">
        <div className="container">
          <div className="products-header">
            <h2>Licencias</h2>
            <Link href="/licencias" className="btn-outline">Ver Catálogo</Link>
          </div>
          <p className="products-desc">Licencias originales con activación segura garantizada.</p>
          <div className="products-grid">
            <div className="product-card-modern">
              <div className="product-icon"><AppWindow size={32} /></div>
              <h3>Windows 10/11 Pro</h3>
              <p>Licencia perpetua</p>
              <span className="product-price">Desde Q150</span>
            </div>
            <div className="product-card-modern">
              <div className="product-icon"><BarChart3 size={32} /></div>
              <h3>Microsoft Office 2021</h3>
              <p>Word, Excel, PowerPoint y más</p>
              <span className="product-price">Desde Q200</span>
            </div>
            <div className="product-card-modern">
              <div className="product-icon"><Shield size={32} /></div>
              <h3>Antivirus ESET</h3>
              <p>Protección total por 1 año</p>
              <span className="product-price">Desde Q120</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02/ SOPORTE */}
      <section id="soporte" className="section numbered-section alt-bg">
        <div className="container">
          <div className="section-number">02/</div>
          <div className="section-content-split reverse">
            <div className="section-left">
              <h2>Soporte Técnico</h2>
              <p>Asistencia especializada para computadoras, laptops y consolas. Soluciones a problemas de hardware y software.</p>
              <button className="btn-outline" onClick={() => openWhatsApp('Soporte Técnico')}>
                Obtener Soporte
              </button>
            </div>
            <div className="section-right">
              <div className="feature-grid">
                <div className="feature-item"><span className="feature-icon"><Monitor size={20} /></span> Diagnóstico remoto seguro</div>
                <div className="feature-item"><span className="feature-icon"><Home size={20} /></span> Reparaciones a domicilio</div>
                <div className="feature-item"><span className="feature-icon"><Zap size={20} /></span> Optimización de rendimiento</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03/ ASESORÍAS */}
      <section id="asesorias" className="section numbered-section">
        <div className="container">
          <div className="section-number">03/</div>
          <div className="section-content-split">
            <div className="section-left">
              <h2>Asesorías Tecnológicas</h2>
              <p>Te ayudamos a tomar decisiones tecnológicas acertadas con soluciones personalizadas.</p>
              <button className="btn-outline" onClick={() => openWhatsApp('Asesoría')}>
                Solicitar Asesoría
              </button>
            </div>
            <div className="section-right">
              <div className="feature-grid">
                <div className="feature-item"><span className="feature-icon"><Target size={20} /></span> Elección de equipos</div>
                <div className="feature-item"><span className="feature-icon"><Gamepad2 size={20} /></span> Configuraciones personalizadas</div>
                <div className="feature-item"><span className="feature-icon"><Lightbulb size={20} /></span> Soluciones a medida</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04/ SEGURIDAD */}
      <section id="seguridad" className="section numbered-section alt-bg">
        <div className="container">
          <div className="section-number">04/</div>
          <div className="section-content-split reverse">
            <div className="section-left">
              <h2>Protección y Seguridad Digital</h2>
              <p>Protege tu información con nuestros servicios de ciberseguridad profesional.</p>
              <button className="btn-outline" onClick={() => openWhatsApp('Seguridad Digital')}>
                Proteger Mi Equipo
              </button>
            </div>
            <div className="section-right">
              <div className="feature-grid">
                <div className="feature-item"><span className="feature-icon"><Shield size={20} /></span> Instalación de antivirus</div>
                <div className="feature-item"><span className="feature-icon"><Lock size={20} /></span> Protección de datos</div>
                <div className="feature-item"><span className="feature-icon"><ScanSearch size={20} /></span> Auditoría de seguridad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL - Kong inspired */}
      <section className="final-cta">
        <div className="container">
          <h2>¿Listo para <span className="gradient-text">potenciar</span> tu tecnología?</h2>
          <p>Contáctanos hoy y descubre cómo podemos ayudarte.</p>
          <button className="btn-primary large" onClick={() => openWhatsApp('Consulta General')}>
            Solicitar Cotización
          </button>
        </div>
      </section>
    </>
  );
}

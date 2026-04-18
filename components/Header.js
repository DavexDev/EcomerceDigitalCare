'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const openWhatsApp = (producto) => {
    window.dispatchEvent(new CustomEvent('open-whatsapp', { detail: { producto } }));
    setMenuOpen(false);
  };

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="logo">
        <Link href="/">
          <Image src="/logo.png" alt="Logo DigitalCare GT" width={120} height={40} priority />
        </Link>
      </div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menú"
      >
        {menuOpen ? '✖' : '☰'}
      </button>

      <nav className={`nav${menuOpen ? ' show' : ''}`} id="nav-menu">
        <ul className="menu-principal">
          <li className="has-submenu">
            <span className="submenu-toggle">
              Servicios <span className="arrow">▾</span>
            </span>
            <ul className="submenu">
              <li><button onClick={() => scrollTo('mantenimiento')}>Mantenimiento</button></li>
              <li><button onClick={() => scrollTo('soporte')}>Soporte</button></li>
              <li><button onClick={() => scrollTo('asesorias')}>Asesorías</button></li>
              <li><button onClick={() => scrollTo('seguridad')}>Seguridad</button></li>
              <li><button onClick={() => scrollTo('desarrollo')}>Desarrollo Web</button></li>
            </ul>
          </li>
          <li className="has-submenu">
            <span className="submenu-toggle">
              Productos <span className="arrow">▾</span>
            </span>
            <ul className="submenu">
              <li><Link href="/licencias" onClick={() => setMenuOpen(false)}>Licencias</Link></li>
              <li><Link href="/accesorios" onClick={() => setMenuOpen(false)}>Accesorios</Link></li>
            </ul>
          </li>
          <li>
            <button 
              className="nav-btn btn-consultar" 
              onClick={() => openWhatsApp('Contacto General')}
            >
              Contacto
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

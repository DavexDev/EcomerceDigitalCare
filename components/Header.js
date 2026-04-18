'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef(null);
  const { dark, toggleDark } = useTheme();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
    setActiveSubmenu(null);
  };

  const openWhatsApp = (producto) => {
    window.dispatchEvent(new CustomEvent('open-whatsapp', { detail: { producto } }));
    setMenuOpen(false);
    setActiveSubmenu(null);
  };

  const handleMouseEnter = (name) => {
    if (!isMobile) setActiveSubmenu(name);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setActiveSubmenu(null);
  };

  const handleClick = (name) => {
    if (isMobile) setActiveSubmenu(activeSubmenu === name ? null : name);
  };

  const submenuStyle = (name) => ({
    display: activeSubmenu === name ? 'flex' : 'none',
    flexDirection: 'column',
    position: isMobile ? 'static' : 'absolute',
  });

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="logo">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="DigitalCare GT"
            width={180}
            height={60}
            priority
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>

      <button
        className="hamburger"
        onClick={() => { setMenuOpen(!menuOpen); setActiveSubmenu(null); }}
        aria-label="Menú"
      >
        {menuOpen ? '✖' : '☰'}
      </button>

      <nav ref={navRef} className={`nav${menuOpen ? ' show' : ''}`} id="nav-menu">
        <ul className="menu-principal">
          <li
            className="has-submenu"
            onMouseEnter={() => handleMouseEnter('servicios')}
            onMouseLeave={handleMouseLeave}
          >
            <span
              className="submenu-toggle"
              onClick={() => handleClick('servicios')}
            >
              Servicios{' '}
              <ChevronDown
                size={14}
                style={{ transition: 'transform 0.2s', transform: activeSubmenu === 'servicios' ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </span>
            <ul className="submenu" style={submenuStyle('servicios')}>
              <li><button onClick={() => scrollTo('mantenimiento')}>Mantenimiento</button></li>
              <li><button onClick={() => scrollTo('soporte')}>Soporte</button></li>
              <li><button onClick={() => scrollTo('asesorias')}>Asesorías</button></li>
              <li><button onClick={() => scrollTo('seguridad')}>Seguridad</button></li>
            </ul>
          </li>
          <li
            className="has-submenu"
            onMouseEnter={() => handleMouseEnter('productos')}
            onMouseLeave={handleMouseLeave}
          >
            <span
              className="submenu-toggle"
              onClick={() => handleClick('productos')}
            >
              Productos{' '}
              <ChevronDown
                size={14}
                style={{ transition: 'transform 0.2s', transform: activeSubmenu === 'productos' ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </span>
            <ul className="submenu" style={submenuStyle('productos')}>
              <li><Link href="/licencias" onClick={() => { setMenuOpen(false); setActiveSubmenu(null); }}>Licencias</Link></li>
              <li><Link href="/accesorios" onClick={() => { setMenuOpen(false); setActiveSubmenu(null); }}>Accesorios</Link></li>
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
          <li>
            <button
              className="theme-toggle"
              onClick={toggleDark}
              aria-label="Cambiar tema"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

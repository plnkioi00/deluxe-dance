import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Icons from 'lucide-react'; // for iconMap lookups like Icons.Heart
import { ChevronLeft, ChevronRight, X, Menu, MapPin, Phone, Mail, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { translations } from './translations.js';
import AllStylesPage from './AllStyles.js'; // keep if your file is AllStyles.js
import logo from './assets/logo.png';
import './App.css';

export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden'; // hard lock
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = prev || '';
    };
  }, [locked]);
}

const iconMap = {
  Heart: Icons.Heart, Layers: Icons.Music, Award: Icons.Award, Sparkles: Icons.Sparkles,
  Shield: Icons.Shield, Users: Icons.Users, Video: Icons.Video, Home: Icons.Home,
  MapPin: Icons.PersonStandingIcon, Star: Icons.Star
};

const getIconSafe = (key) => {
  const I = iconMap[key];
  return typeof I === 'function' ? I : Icons.Star;
};


export function AnimatedClasses({
  items,
  onOpen,
  autoplay = false,
  interval = 5000,
}) {
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    if (active >= items.length && items.length > 0) setActive(0);
  }, [items.length, active]);

  const next = useCallback(() => {
    const len = Math.max(items.length, 1);
    setActive((i) => (i + 1) % len);
  }, [items.length]);

  const prev = useCallback(() => {
    const len = Math.max(items.length, 1);
    setActive((i) => (i - 1 + len) % len);
  }, [items.length]);

  useEffect(() => {
    if (!autoplay || items.length === 0) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoplay, interval, next, items.length]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const hasItems = items && items.length > 0;
  const current = hasItems ? items[active] : null;

  return (
    <section
      className="carousel-section"
      ref={rootRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Classes carousel"
    >
      <div className="carousel-inner">
        <div className="animated-classes-grid">
          {/* Image stack */}
          <div className="animated-classes-figure" aria-live="polite">
            <AnimatePresence initial={false}>
              {hasItems
                ? items.map((it, i) => (
                    <motion.img
                      key={it.image}
                      src={it.image}
                      alt={it.name}
                      draggable={false}
                      className="carousel-img"
                      style={{
                        position: "absolute",
                        inset: 0,
                        objectFit: "cover",
                        objectPosition: it.focus || "50% 50%",
                      }}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{
                        opacity: i === active ? 1 : 0,
                        scale: i === active ? 1 : 0.98,
                        zIndex: i === active ? 2 : 1,
                      }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                  ))
                : null}
            </AnimatePresence>
          </div>

          {/* Copy + controls */}
          <div>
            <h3 className="carousel-title">{current ? current.name : ""}</h3>
            <p className="carousel-desc">{current ? current.description : ""}</p>

            <div className="carousel-cta">
              <button className="carousel-nav" onClick={prev} aria-label="Previous slide" type="button" disabled={!hasItems}>
                <ChevronLeft />
              </button>
              <button className="carousel-nav" onClick={next} aria-label="Next slide" type="button" disabled={!hasItems}>
                <ChevronRight />
              </button>
              <button
                className="carousel-more"
                onClick={() => current && onOpen(current)}
                type="button"
                disabled={!current}
              >
                Подробнее
              </button>
            </div>

            <div className="carousel-dots" role="tablist" aria-label="Slide dots">
              {hasItems
                ? items.map((_, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={i === active}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`dot ${i === active ? "active" : ""}`}
                      onClick={() => setActive(i)}
                      type="button"
                    />
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------- App with Router --------- */
const App = () => {
  const [locale, setLocale] = useState('ru');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [horizontalStyles, setHorizontalStyles] = useState([]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const onOpen = (e) => setSelectedStyle(e.detail);
    window.addEventListener('openStyle', onOpen);
    return () => window.removeEventListener('openStyle', onOpen);
  }, []);

  useLockBodyScroll(!!selectedStyle);

  const t = translations[locale];
  const danceStyles = t.danceStyles;
  const instructors = t.instructors.list;

  // filter only horizontal images for the carousel
  useEffect(() => {
    const loadAndFilter = async () => {
      const filtered = [];
      for (const style of danceStyles) {
        const img = new Image();
        img.src = style.image;
        await new Promise((res) => {
          img.onload = () => {
            if (img.naturalWidth > img.naturalHeight) filtered.push(style);
            res();
          };
          img.onerror = res; // skip on error
        });
      }
      setHorizontalStyles(filtered);
    };
    loadAndFilter();
  }, [danceStyles]);

  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <div className="app-container">
              {/* Language Switcher */}
              <div className="lang-switcher">
                {['en', 'ru', 'es'].map(code => (
                  <button
                    key={code}
                    className={`lang-button ${locale === code ? 'active' : ''}`}
                    onClick={() => setLocale(code)}
                  >
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Header */}
              <header className="app-header">
                <div className="header-content">
                  <div className="brand">
                    <img src={logo} alt="Deluxe Dance Studio Logo" className="brand-logo" />
                    <span className="brand-title">Deluxe Dance Studio</span>
                  </div>
                  <nav className="nav-desktop">
                    {t.nav.map(link => (
                      <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">
                        {link}
                      </a>
                    ))}
                  </nav>
                  <button className="nav-toggle" onClick={() => setIsMenuOpen(open => !open)}>
                    {isMenuOpen ? <X /> : <Menu />}
                  </button>
                </div>
                {isMenuOpen && (
                  <nav className="nav-mobile">
                    {t.nav.map(link => (
                      <a
                        key={link}
                        href={`#${link.toLowerCase()}`}
                        className="nav-link-mobile"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link}
                      </a>
                    ))}
                  </nav>
                )}
              </header>

              {/* Hero */}
              <section id="home" className="hero-section">
                <motion.h1 className="hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  {t.hero.title}
                </motion.h1>
                <motion.p
                  className="hero-subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {t.hero.subtitle}
                </motion.p>
                <button className="hero-button">{t.hero.cta}</button>
              </section>

              {/* About */}
              <section id="about" className="about-section">
                <h2 className="section-title">{t.about?.title || ''}</h2>
                <div className="about-content">
                  <div className="about-image">
                    <img src={logo} alt="About Deluxe Dance" className="about-img" />
                    <img src={logo} alt="About Deluxe Dance" className="about-img" />
                  </div>
                  <ul className="features-list">
                    {t.about?.features?.map((f, i) => {
                      const Icon = getIconSafe(f.icon);
                      return (
                        <li key={i} className="feature-item">
                          <Icon className="feature-icon" />
                          <span className="feature-text">{f.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>

              {/* Classes */}
              <section id="classes">
                <h2 className="section-title">{t.classes.title}</h2>
                <p className="section-subtitle">{t.classes.subtitle}</p>

                {horizontalStyles.length > 0 && (
                  <AnimatedClasses
                    items={horizontalStyles.slice(0, 8)}
                    onOpen={(style) => setSelectedStyle(style)}
                    autoplay={false}
                    interval={5000}
                  />
                )}

                {/* View More → separate page */}
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <Link to="/all-styles" className="view-more-btn">
                    {locale === "ru" ? "Смотреть все" : locale === "es" ? "Ver todos" : "View More"}
                  </Link>
                </div>
              </section>

              {/* Modal */}
              {selectedStyle && (
                <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setSelectedStyle(null)}>
                  <motion.div
                    className="modal-content"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="modal-close" aria-label="Close" onClick={() => setSelectedStyle(null)}>
                      ✕
                    </button>
                    <h3 className="modal-title">{selectedStyle.name}</h3>
                    <p className="modal-details">{selectedStyle.details}</p>
                    <p className="modal-price">
                      {locale === 'ru' ? 'Цена' : locale === 'es' ? 'Precio' : 'Price'}: {selectedStyle.price}
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Instructors */}
              <section id="instructors">
                <h2 className="section-title">{t.instructors.title}</h2>
                <p className="section-subtitle">{t.instructors.subtitle}</p>
                <div className="instructors-grid">
                  {instructors.map(inst => (
                    <motion.div key={inst.name} className="instructor-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                      <img src={inst.photo} alt={inst.name} className="instructor-photo" />
                      <h3 className="instructor-name">{inst.name}</h3>
                      <p className="instructor-role">{inst.role}</p>
                      <p className="instructor-bio">{inst.bio}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Schedule */}
              <section id="schedule">
                <h2 className="section-title">{t.schedule.title}</h2>
                <p className="section-subtitle">{t.schedule.subtitle}</p>
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>{locale === 'ru' ? 'Направление' : locale === 'es' ? 'Estilo' : 'Style'}</th>
                      <th>{locale === 'ru' ? 'Цена' : locale === 'es' ? 'Precio' : 'Price'}</th>
                      <th>{locale === 'ru' ? 'Длительность' : locale === 'es' ? 'Duración' : 'Duration'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {danceStyles.map(style => (
                      <tr key={style.key}>
                        <td>{style.name}</td>
                        <td>{style.price}</td>
                        <td>1 class / 60 min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* Footer */}
              <footer id="contact" className="footer-section">
                <div className="footer-grid">
                  <div className="footer-column">
                    <h4>{t.footer.contact}</h4>
                    <p><MapPin /> {t.footer.address}</p>
                    <p><Phone /> {t.footer.phone}</p>
                    <p><Mail /> {t.footer.email}</p>
                  </div>
                  <div className="footer-column">
                    <h4>{t.footer.hoursTitle}</h4>
                    {t.footer.hours.map(line => (
                      <p key={line}><Clock /> {line}</p>
                    ))}
                  </div>
                  <div className="footer-column">
                    <h4>{t.footer.socialTitle}</h4>
                    {t.footer.social.map(s => (
                      <p key={s}><Star /> {s}</p>
                    ))}
                  </div>
                </div>
              </footer>
            </div>
          }
        />

        {/* All Styles page */}
        <Route
          path="/all-styles"
          element={
            <AllStylesPage
              styles={danceStyles}
              locale={locale}
              onOpen={(style) => setSelectedStyle(style)}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
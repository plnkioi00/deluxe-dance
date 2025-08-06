// src/App.js
import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  Menu,
  X,
  Music
} from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from './translations.js';
import './App.css';


const App = () => {
  const [locale, setLocale] = useState('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);

  // grab the text/data for current locale
  const t = translations[locale];
  const danceStyles = t.danceStyles;
  const instructors = t.instructors.list;

  return (
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
            <Music className="brand-icon" />
            <span className="brand-title">Deluxe Dance Studio</span>
          </div>
          <nav className="nav-desktop">
            {t.nav.map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="nav-link"
              >
                {link}
              </a>
            ))}
          </nav>
          <button
            className="nav-toggle"
            onClick={() => setIsMenuOpen(open => !open)}
          >
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
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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

      {/* Classes */}
      <section id="classes">
        <h2 className="section-title">{t.classes.title}</h2>
        <p className="section-subtitle">{t.classes.subtitle}</p>
        <div className="classes-grid">
          {danceStyles.map(style => (
            <motion.div
              key={style.key}
              className="class-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <img
                src={style.image}
                alt={style.name}
                className="class-image"
              />
              <h3 className="class-name">{style.name}</h3>
              <p className="class-description">{style.description}</p>
              <div className="class-footer">
                <span className="class-level">{style.level}</span>
                <button
                  className="class-button"
                  onClick={() => setSelectedStyle(style)}
                >
                  {locale === 'ru' ? 'Подробнее' : locale === 'es' ? 'Más info' : 'Learn More'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal for style details */}
      {selectedStyle && (
        <div className="modal-overlay" onClick={() => setSelectedStyle(null)}>
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedStyle(null)}
            >
              <X />
            </button>
            <h3 className="modal-title">{selectedStyle.name}</h3>
            <p className="modal-details">{selectedStyle.details}</p>
            <p className="modal-price">
              {locale === 'ru' ? 'Цена' : locale === 'es' ? 'Precio' : 'Price'}:{' '}
              {selectedStyle.price}
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
            <motion.div
              key={inst.name}
              className="instructor-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <img
                src={inst.photo}
                alt={inst.name}
                className="instructor-photo"
              />
              <h3 className="instructor-name">{inst.name}</h3>
              <p className="instructor-role">{inst.role}</p>
              <p className="instructor-bio">{inst.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Schedule & Pricing */}
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
  );
};

export default App;

import React from "react";
import { motion } from "framer-motion";
import "./App.css";

const AllStylesPage = ({ styles, locale, onOpen }) => {
  return (
    <section id="all-styles" className="all-styles-container">
      <h2 className="section-title">
        {locale === "ru"
          ? "Все стили"
          : locale === "es"
          ? "Todos los estilos"
          : "All Styles"}
      </h2>
      <p className="section-subtitle">
        {locale === "ru"
          ? "Откройте для себя все направления"
          : locale === "es"
          ? "Descubre todos nuestros estilos"
          : "Browse all our dance styles"}
      </p>

      <div className="classes-grid">
        {styles.map((style) => (
          <motion.div
            key={style.key}
            className="class-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <img
              src={style.image}
              alt={style.name}
              className="class-image"
              loading="lazy"
              style={{ objectPosition: style.focus || "center 20%" }}
            />
            <h3 className="class-name">{style.name}</h3>
            <p className="class-description">{style.description}</p>

            <div className="class-footer">
              <span className="class-level">{style.level}</span>
              <button className="class-button" onClick={() => onOpen(style)}>
                {locale === "ru"
                  ? "Подробнее"
                  : locale === "es"
                  ? "Más info"
                  : "Learn More"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AllStylesPage;

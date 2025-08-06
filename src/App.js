import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, Star, Menu, X, User, Award, Music } from 'lucide-react';
import { motion } from 'framer-motion';

// Detailed dance styles with full descriptions from АНКЕТА
const danceStyles = [
  {
    name: 'Aero-stretching',
    description: 'Aerial stretching for flexibility and relaxation in the air',
    details: `Аэростретчинг — сочетание расслабления, вытяжения и гибкости в воздушном гама...`,
    image: 'https://placehold.co/400x300/7C3AED/FFFFFF?text=Aerostretching',
    level: 'All Levels',
    price: '8 classes €80 / 30 days, 16 classes €140 / 70 days, Single €15'
  },
  // ... other styles omitted for brevity. Same as before.
];

// Instructors data extracted from АНКЕТА
const instructors = [
  {
    name: 'Оксана Лотоцкая',
    role: 'Founder & Lead Choreographer',
    photo: 'https://placehold.co/200x200/6B7280/FFFFFF?text=Oksana',
    bio: `Оксана окончила Ровненский государственный гуманитарный университет (Хореография, 2002). Руководитель детских коллективов, контрактная шоу-программа в Ливане (1993). Профессиональный педагог с опытом более 20 лет, лауреат международных конкурсов.`
  }
];

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <Music className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Deluxe Dance Studio</h1>
          </motion.div>

          <nav className="hidden md:flex space-x-8">
            {['Home','Classes','Instructors','Schedule','Contact'].map(link => (
              <a href={`#${link.toLowerCase()}`} key={link} className="text-gray-700 hover:text-purple-600">{link}</a>
            ))}
          </nav>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white">
            <div className="flex flex-col p-4 space-y-3">
              {['Home','Classes','Instructors','Schedule','Contact'].map(link => (
                <a href={`#${link.toLowerCase()}`} key={link} className="text-gray-700 hover:text-purple-600">{link}</a>
              ))}
            </div>
          </motion.nav>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-bold mb-6">
          Відкрий свою жіночність та силу через танець у Deluxe Dance
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl mb-8 max-w-3xl mx-auto">
          Індивідуальний підхід, професійні педагоги та тепла спільнота в Іспанії
        </motion.p>
        <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100">
          Записатися на безкоштовне пробне заняття
        </button>
      </section>

      {/* ... rest of sections unchanged ... */}
    </div>
  );
};

export default App;


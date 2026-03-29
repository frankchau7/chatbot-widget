import './App.css'
import ChatWidget from '../src/frontend/components/ChatWidget'
import {ServiceBox} from "./frontend/components/ServiceBox.tsx";
import AboutUs from './frontend/pages/AboutUs.tsx';
import BookNow from './frontend/pages/BookNow.tsx';
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from 'react-router-dom';
import heroImage from './frontend/assets/dental-clinic.png';

const Home = () => (
  <main className="pb-16">
    {/* Hero Section with Background Image */}
    <section
      className="relative w-full h-[70vh] min-h-[400px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg animate-slide-up">
          FC Dentals Open 7 Days
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md animate-slide-up-delay">
          Book a dentist in Melbourne with the best dentist! Definitely legit :D
        </p>
      </div>
    </section>

    {/* Services Section */}
    <section id="services" className="space-y-12 pt-16 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-slate-800">
        How can Doctor Frank Chau help you?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* General Dentistry Card */}
        <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">General Dentistry</h3>
          <div className="space-y-4">
            <ServiceBox content="Check-up and Teeth Cleaning" />
            <ServiceBox content="Dental Fillings" />
            <ServiceBox content="Children's Dentistry" />
          </div>
        </div>

        {/* Cosmetic Dentistry Card */}
        <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">Cosmetic Dentistry</h3>
          <div className="space-y-4">
            <ServiceBox content="Teeth Whitening" />
            <ServiceBox content="Dental Veneers" />
          </div>
        </div>

        {/* Orthodontics Card */}
        <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">Orthodontics</h3>
          <div className="space-y-4">
            <ServiceBox content="Invisalign" />
            <ServiceBox content="ClearCorrect" />
            <ServiceBox content="SureSmile" />
          </div>
        </div>
      </div>
    </section>
  </main>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        {/* Banner */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40 border-b border-slate-100 px-6 h-16 flex items-center justify-between">
          <Link 
            to="/"
            className="text-xl font-bold text-purple-700 hover:opacity-80 transition-opacity"
          >
            FC Dentals
          </Link>
          <nav className="absolute left-1/2 -translate-x-1/2 flex gap-8 items-center h-full">
            <NavLink 
              to="/"
              className={({ isActive }) => 
                `text-sm font-semibold transition-colors uppercase tracking-wider ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`
              }
            >
              SERVICES
            </NavLink>
            <NavLink 
              to="/about"
              className={({ isActive }) => 
                `text-sm font-semibold transition-colors uppercase tracking-wider ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`
              }
            >
              ABOUT US
            </NavLink>
            <a href="#locations" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors uppercase tracking-wider">LOCATIONS</a>
          </nav>
          <div className="w-24" /> {/* Spacer to balance the logo */}
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/book-now" element={<BookNow />} />
        </Routes>

        <ChatWidget />
      </div>
    </Router>
  )
}

export default App

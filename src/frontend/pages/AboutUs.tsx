import React from 'react';
import heroImage from '../assets/about_us_page.jpg';

const AboutUs: React.FC = () => {
  return (
    <main className="pb-16">
      {/* Hero Section with Background Image */}
      <section
        className="relative w-full h-[70vh] min-h-[400px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg animate-slide-up">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md animate-slide-up-delay">
            Definitely not me operating :)
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section id="about" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <p className="text-lg text-slate-700 leading-relaxed text-center italic">
              "FC Dental consists of a highly qualified and experienced team of dentists and dental nurses. We pride ourselves on delivering personalised dental care in a professional and compassionate manner to each and every one of our patients."
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;

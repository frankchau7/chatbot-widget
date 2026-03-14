import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <main className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
      <section id="about" className="py-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl font-extrabold text-center text-slate-900 mb-8 tracking-tight">
            About Us
          </h1>
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <p className="text-lg text-slate-700 leading-relaxed text-center italic">
              "FCXO Dental consists of a highly qualified and experienced team of dentists and dental nurses. We pride ourselves on delivering personalised dental care in a professional and compassionate manner to each and every one of our patients."
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;

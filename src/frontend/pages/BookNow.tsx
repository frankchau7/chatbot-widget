import React from 'react';

const BookNow: React.FC = () => {
  return (
    <main className="pt-24 pb-16 px-6 max-w-6xl mx-auto text-center">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">
        Book Now
      </h1>
      <div className="bg-slate-50 rounded-3xl p-12 shadow-sm border border-slate-100 max-w-2xl mx-auto">
        <p className="text-xl text-slate-700 mb-8 font-medium">
          Ready to experience the best dental care in Melbourne?
        </p>
        <div className="space-y-6">
          <p className="text-slate-600">
            Please call us at <span className="font-bold text-purple-700">(03) 9876 5432</span> or use our online portal below.
          </p>
          <div className="w-full h-96 bg-slate-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
            <span className="text-slate-500 font-medium">Calendly / Booking Widget Placeholder</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookNow;

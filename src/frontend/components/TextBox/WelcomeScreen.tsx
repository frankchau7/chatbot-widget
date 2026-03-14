import React from "react";

interface WelcomeScreenProps {
  formData: {
    fullName: string;
    phone: string;
    email: string;
  };
  setFormData: (data: { fullName: string; phone: string; email: string }) => void;
  errors: {
    phone: string;
    email: string;
  };
  handleStartChat: (e: React.FormEvent) => void;
}

export const WelcomeScreen = ({
  formData,
  setFormData,
  errors,
  handleStartChat,
}: WelcomeScreenProps) => {
  return (
    <div className="px-6 py-10 h-[500px] w-[350px] flex flex-col justify-center bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome!</h2>
        <p className="text-slate-500 text-sm">Please enter your details to start chatting</p>
      </div>
      <form onSubmit={handleStartChat} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. 0412 345 678"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.phone
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-sky-500 focus:ring-sky-100"
            } outline-none transition-all text-sm`}
          />
          {errors.phone && (
            <p className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{errors.phone}</p>
          )}
        </div>
        <div>
          <div className="flex justify-between items-center mb-1 ml-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Email address
            </label>
            <span className="text-[10px] text-slate-400 font-medium">OPTIONAL</span>
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. john@example.com"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.email
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-sky-500 focus:ring-sky-100"
            } outline-none transition-all text-sm`}
          />
          {errors.email && (
            <p className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{errors.email}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-sky-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-4"
        >
          Start Chat
        </button>
      </form>
    </div>
  );
};

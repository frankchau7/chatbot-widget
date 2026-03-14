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
  isEditing?: boolean;
}

export const WelcomeScreen = ({
  formData,
  setFormData,
  errors,
  handleStartChat,
  isEditing = false,
}: WelcomeScreenProps) => {
  return (
    <div className="px-6 py-10 h-[500px] w-[350px] flex flex-col justify-center bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isEditing ? "Edit details" : "Welcome!"}
        </h2>
        <p className="text-slate-500 text-sm">
          {isEditing 
            ? "Update your information below" 
            : "Please enter your details to start chatting"}
        </p>
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
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all text-sm"
            style={{ 
              borderColor: 'var(--border-color, #e2e8f0)',
              boxShadow: 'var(--focus-shadow, none)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--theme-color)';
              e.currentTarget.style.boxShadow = '0 0 0 4px var(--theme-color-ring)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
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
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm`}
            style={{ 
              borderColor: errors.phone ? '#f87171' : '#e2e8f0',
              boxShadow: 'none'
            }}
            onFocus={(e) => {
              if (!errors.phone) {
                e.currentTarget.style.borderColor = 'var(--theme-color)';
                e.currentTarget.style.boxShadow = '0 0 0 4px var(--theme-color-ring)';
              } else {
                e.currentTarget.style.borderColor = '#ef4444';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.phone ? '#f87171' : '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
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
            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm`}
            style={{ 
              borderColor: errors.email ? '#f87171' : '#e2e8f0',
              boxShadow: 'none'
            }}
            onFocus={(e) => {
              if (!errors.email) {
                e.currentTarget.style.borderColor = 'var(--theme-color)';
                e.currentTarget.style.boxShadow = '0 0 0 4px var(--theme-color-ring)';
              } else {
                e.currentTarget.style.borderColor = '#ef4444';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.email ? '#f87171' : '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{errors.email}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-4 cursor-pointer"
          style={{ 
            backgroundColor: 'var(--theme-color)',
            boxShadow: '0 10px 15px -3px var(--theme-color-ring)' 
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-color-dark)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-color)'}
        >
          {isEditing ? "Continue" : "Start Chat"}
        </button>
      </form>
    </div>
  );
};

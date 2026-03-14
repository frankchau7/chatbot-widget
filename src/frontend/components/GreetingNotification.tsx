interface GreetingNotificationProps {
  onClose: () => void;
}

const GreetingNotification = ({ onClose }: GreetingNotificationProps) => {
  return (
    <div className="relative mb-2 animate-bounce-slow">
      <div className="bg-sky-600 text-white px-4 py-3 rounded-2xl shadow-xl max-w-[240px] text-sm font-medium relative leading-relaxed">
        Hey! I am your AI receptionist! Let me know if you want to book, or have any enquiries!
        {/* Triangle indicator */}
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-sky-600 rotate-45 transform"></div>
      </div>
      <button 
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-slate-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-slate-700 shadow-md border border-white cursor-pointer transition-colors"
        aria-label="Close greeting"
      >
        ✕
      </button>
    </div>
  );
};

export default GreetingNotification;

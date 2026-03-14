interface GreetingNotificationProps {
  name: string | null;
  onClose: () => void;
}

const GreetingNotification = ({ name, onClose }: GreetingNotificationProps) => {
  return (
    <div className="relative mb-2 animate-bounce-slow">
      <div 
        className="text-white px-4 py-3 rounded-2xl shadow-xl max-w-[240px] text-sm font-medium relative leading-relaxed"
        style={{ backgroundColor: 'var(--theme-color)' }}
      >
        Hey{name ? ` ${name}` : ''}! I am your AI receptionist! Let me know if you want to book, or have any enquiries!
        {/* Triangle indicator */}
        <div 
          className="absolute -bottom-2 right-6 w-4 h-4 rotate-45 transform"
          style={{ backgroundColor: 'var(--theme-color)' }}
        ></div>
      </div>
      <button 
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] hover:bg-slate-700 shadow-md border border-white cursor-pointer transition-colors p-0 shrink-0 aspect-square"
        aria-label="Close greeting"
      >
        ✕
      </button>
    </div>
  );
};

export default GreetingNotification;

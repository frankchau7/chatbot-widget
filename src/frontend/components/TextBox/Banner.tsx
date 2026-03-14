import botAvatar from "../../assets/bot_avatar.jpg";

interface BannerProps {
  onClose?: () => void;
  readOnly: boolean;
}

export const Banner = ({onClose, readOnly}: BannerProps) => {
  return (
      <div className="relative flex items-center justify-between bg-slate-100 px-4 h-16 border-b border-slate-200">
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
            <img
                src={botAvatar}
                alt="Chatbot avatar"
                className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-sm font-semibold">Chatbot</span>
            <span className="text-xs text-slate-500">Ask me anything</span>
          </div>
        </div>
        <div className="flex-1"/>
        {!readOnly && (
            <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-100 rounded-full"
                aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>)}
      </div>
  )
}
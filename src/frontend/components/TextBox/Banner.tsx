import { useState, useRef, useEffect } from "react";
import botAvatar from "../../assets/bot_avatar.jpg";

interface BannerProps {
  onEditDetails: () => void;
  onEndConversation: () => void;
  readOnly: boolean;
  showMenu?: boolean;
}

export const Banner = ({ onEditDetails, onEndConversation, readOnly, showMenu = true }: BannerProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center justify-between px-4 h-16 border-b shadow-sm" style={{ backgroundColor: 'var(--theme-color)', borderColor: 'var(--theme-color-dark)' }}>
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
          <img
            src={botAvatar}
            alt="Chatbot avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center leading-tight">
          <span className="text-sm font-bold text-white">Chatbot</span>
          <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider">Ask me anything</span>
        </div>
      </div>
      <div className="flex-1" />
      {!readOnly && showMenu && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white/80 hover:text-white transition-colors p-0 w-8 h-8 flex items-center justify-center rounded-full shrink-0 aspect-square cursor-pointer"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
              <button
                onClick={() => {
                  onEditDetails();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium border-b border-slate-50 last:border-0"
              >
                Edit details
              </button>
              <button
                onClick={() => {
                  onEndConversation();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
              >
                End conversation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
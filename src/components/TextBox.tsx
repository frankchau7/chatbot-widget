import botAvatar from "../assets/bot_avatar.jpg";

const TextBox = () => {
  return (
    <div className="w-full max-w-md bg-white text-black rounded-xl shadow-lg overflow-hidden">
      {/* Top banner with avatar */}
      <div className="flex items-center gap-3 bg-slate-100 px-4 py-3 border-b border-slate-200">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
          <img
            src={botAvatar}
            alt="Chatbot avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Chatbot</span>
          <span className="text-xs text-slate-500">Ask me anything</span>
        </div>
      </div>

      {/* Text input area */}
      <div className="px-4 py-3">
        <textarea
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          rows={3}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
};

export default TextBox;
import botAvatar from "../../assets/bot_avatar.jpg";

export const Banner = () => {
  return (
    <div className="flex items-center justify-center gap-3 bg-slate-100 px-4 h-16 border-b border-slate-200">
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
  )
}
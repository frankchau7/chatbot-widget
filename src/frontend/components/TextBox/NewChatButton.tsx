interface NewChatButtonProps {
  handleStartNewChat: () => void;
}

export const NewChatButton = ({ handleStartNewChat }: NewChatButtonProps) => {
  return (
    <div className="px-4 py-3 border-t border-slate-200 bg-white flex justify-center">
      <button
        onClick={handleStartNewChat}
        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm"
      >
        Start new chat
      </button>
    </div>
  );
};

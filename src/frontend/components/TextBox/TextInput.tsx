import sendIcon from "../../assets/send_icon.png";

interface TextInputInterface {
  input: string;
  setInput: (input: string) => void;
  handleMessageSend: () => void;
}

export const TextInput = ({input, setInput, handleMessageSend}: TextInputInterface) => {
  return (
    <div className="px-4 py-3 border-t border-slate-200 bg-white">
      <div className="flex items-center gap-2">
        <textarea
          className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          rows={3}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleMessageSend();
            }
          }}
        />
        <div
          role="button"
          aria-label="Send message"
          onClick={handleMessageSend}
          className="flex h-8 w-8 items-center justify-center cursor-pointer"
        >
          <img src={sendIcon} alt="Send" className="h-6 w-6 object-contain" />
        </div>
      </div>
    </div>
  );
};

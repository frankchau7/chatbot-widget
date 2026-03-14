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
          className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none transition-all"
          style={{ 
            borderColor: 'var(--border-color, #cbd5e1)',
            boxShadow: 'none'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--theme-color)';
            e.currentTarget.style.boxShadow = '0 0 0 2px var(--theme-color-ring)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.boxShadow = 'none';
          }}
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
          className="flex h-10 w-10 items-center justify-center cursor-pointer transition-colors"
          style={{ color: 'var(--theme-color)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-color-dark)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-color)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
      </div>
    </div>
  );
};

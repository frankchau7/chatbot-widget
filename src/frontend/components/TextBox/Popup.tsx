interface PopupProps {
    setShowExitPopup: (show: boolean) => void;
    handleEndConversation: () => void;
    children: React.ReactNode;
}

export const Popup = ({setShowExitPopup, handleEndConversation, children}: PopupProps) => {
    return (<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-[280px] text-center">
            {children}
            <div className="flex gap-3 justify-center">
                <button
                    onClick={() => setShowExitPopup(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                    No
                </button>
                <button
                    onClick={handleEndConversation}
                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                    Yes
                </button>
            </div>
        </div>
    </div>)
}
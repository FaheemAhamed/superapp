import { useState, useEffect, useRef } from "react";

export default function NotesWidget() {
  const [note, setNote] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("super_app_notes");
    if (saved) {
      setNote(saved);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setNote(val);
    localStorage.setItem("super_app_notes", val);
  };

  const handleAddNote = () => {
    const newText = note + (note ? "\n\n" : "") + "• ";
    setNote(newText);
    localStorage.setItem("super_app_notes", newText);
    textareaRef.current?.focus();
  };

  const handleClearNotes = () => {
    setNote("");
    localStorage.removeItem("super_app_notes");
    textareaRef.current?.focus();
  };

  return (
    <div className="w-[470px] h-[535px] relative font-['Roboto'] overflow-hidden rounded-[19px] bg-[#F1C75B]">
      <style>
        {`
          .custom-notes-scroll::-webkit-scrollbar {
            width: 14px;
          }
          .custom-notes-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-notes-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.4);
            border-radius: 10px;
            border: 4px solid #F1C75B; /* Creates padding effect */
          }
          .custom-notes-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.6);
          }
        `}
      </style>

      <div className="absolute left-[51px] top-[36px] w-[184px] h-[38px] text-black text-[38px] font-semibold leading-[105.69%] tracking-[0.02em]">
        All notes
      </div>

      <div className="absolute right-[30px] top-[46px] flex gap-4 z-10">
        <button 
          onClick={handleClearNotes}
          className="text-black/50 hover:text-black text-[18px] font-medium transition-colors underline underline-offset-2 cursor-pointer"
        >
          Clear
        </button>
        <button 
          onClick={handleAddNote}
          className="text-black/70 hover:text-black text-[18px] font-medium transition-colors underline underline-offset-2 cursor-pointer"
        >
          Add note
        </button>
      </div>
      
      <textarea
        ref={textareaRef}
        value={note}
        onChange={handleChange}
        className="absolute left-[46px] top-[117px] w-[390px] h-[380px] bg-transparent resize-none outline-none text-black text-[21px] font-normal leading-[130%] tracking-[0.04em] custom-notes-scroll pr-4"
        placeholder="Type your notes here..."
      />
    </div>
  );
}

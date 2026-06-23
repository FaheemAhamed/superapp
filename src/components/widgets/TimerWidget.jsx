import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function TimerWidget() {
  const [h, setH] = useState(5);
  const [m, setM] = useState(9);
  const [s, setS] = useState(0);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const ref = useRef(null);

  const timerSound = useRef(null);

  useEffect(() => {
    // initialize an audio object for notification
    timerSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); 
  }, []);

  useEffect(() => {
    if (running && remaining > 0) {
      ref.current = window.setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            if (timerSound.current) {
              timerSound.current.play().catch(e => console.log('Audio play failed', e));
            }
            setShowPopup(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running, remaining]);

  const toggleTimer = () => {
    if (!running) {
      if (remaining === 0) {
        const t = h * 3600 + m * 60 + s;
        if (t === 0) return; // Don't start if it's 00:00:00
        setTotal(t);
        setRemaining(t);
      }
      setRunning(true);
    } else {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setRemaining(0);
    setTotal(0);
  };

  const currentTotalDisplay = h * 3600 + m * 60 + s;
  const display = remaining > 0 || running ? remaining : currentTotalDisplay;
  const hh = Math.floor(display / 3600);
  const mm = Math.floor((display % 3600) / 60);
  const ss = display % 60;
  const fmt = (n) => String(n).padStart(2, "0");

  const increment = (setter, max) => {
    if (!running && remaining === 0) setter((prev) => (prev < max ? prev + 1 : 0));
  };
  const decrement = (setter, max) => {
    if (!running && remaining === 0) setter((prev) => (prev > 0 ? prev - 1 : max));
  };

  const UpArrow = ({ onClick, left }) => (
    <div 
      className={`absolute cursor-pointer select-none transition-opacity ${running || remaining > 0 ? 'opacity-20 pointer-events-none' : 'hover:opacity-100 opacity-60'}`}
      style={{ left: `${left}px`, top: '90px', color: '#949494' }}
      onClick={onClick}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 8l6 6H6z" />
      </svg>
    </div>
  );

  const DownArrow = ({ onClick, left }) => (
    <div 
      className={`absolute cursor-pointer select-none transition-opacity ${running || remaining > 0 ? 'opacity-20 pointer-events-none' : 'hover:opacity-100 opacity-60'}`}
      style={{ left: `${left}px`, top: '210px', color: '#949494' }}
      onClick={onClick}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 16l-6-6h12z" />
      </svg>
    </div>
  );

  // Calculate SVG stroke offset for the animation ring
  const circleCircumference = 2 * Math.PI * 114.5; // r=114.5, so C ≈ 719.42
  const strokeDashoffset = remaining > 0 && total > 0 
    ? circleCircumference - (remaining / total) * circleCircumference 
    : 0;

  return (
    <>
      <div className="w-[1038px] h-[333px] relative font-['Roboto'] overflow-hidden rounded-[19px] bg-[#1E2343]">
        
        {/* Ellipse 3 (Outer Drop Shadow Background) */}
        <div 
          className="absolute left-[53px] top-[27px] w-[282px] h-[282px] bg-[#191E39] rounded-full"
          style={{ boxShadow: "-3px -7px 16px rgba(95, 88, 88, 0.23), inset 0px 6px 26px rgba(0, 0, 0, 0.61)" }}
        ></div>

        {/* Ellipse 4 (Progress Circle Background) */}
        <div 
          className="absolute left-[76px] top-[50px] w-[235px] h-[235px] bg-[#181D37] rounded-full"
        ></div>

        {/* Animated SVG Ring */}
        <svg className="absolute left-[76px] top-[50px] w-[235px] h-[235px] -rotate-90 pointer-events-none z-10">
          <circle 
            cx="117.5" cy="117.5" r="114.5" 
            stroke="#FF6A6A" strokeWidth="6" fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* Timer Text Inside Circle */}
        <div className="absolute left-[76px] top-[50px] w-[235px] h-[235px] flex items-center justify-center z-20 pointer-events-none">
          <div className="text-white text-[40px] font-semibold leading-[105.69%] tracking-[0.04em]">
            {fmt(hh)}:{fmt(mm)}:{fmt(ss)}
          </div>
        </div>

        {/* Labels */}
        <div className="absolute left-[487px] top-[33px] w-[75px] h-[27px] text-[#949494] text-[26px] font-normal leading-[105.69%] tracking-[0.04em]">
          Hours
        </div>
        <div className="absolute left-[638px] top-[33px] w-[100px] h-[27px] text-[#949494] text-[26px] font-normal leading-[105.69%] tracking-[0.04em]">
          Minutes
        </div>
        <div className="absolute left-[813px] top-[33px] w-[107px] h-[27px] text-[#949494] text-[26px] font-normal leading-[105.69%] tracking-[0.04em]">
          Seconds
        </div>

        {/* Arrows */}
        <UpArrow left={515} onClick={() => increment(setH, 23)} />
        <UpArrow left={675} onClick={() => increment(setM, 59)} />
        <UpArrow left={855} onClick={() => increment(setS, 59)} />
        
        <DownArrow left={515} onClick={() => decrement(setH, 23)} />
        <DownArrow left={675} onClick={() => decrement(setM, 59)} />
        <DownArrow left={855} onClick={() => decrement(setS, 59)} />

        {/* Numbers */}
        <div className="absolute left-[501px] top-[138px] w-[65px] h-[53px] text-white text-[50px] font-light leading-[105.69%] tracking-[0.04em] flex justify-center">
          {fmt(h)}
        </div>
        <div className="absolute left-[603px] top-[130px] w-[11px] h-[50px] text-white text-[56px] font-light leading-[105.69%] tracking-[0.04em]">
          :
        </div>
        <div className="absolute left-[658px] top-[133px] w-[65px] h-[53px] text-white text-[56px] font-light leading-[105.69%] tracking-[0.04em] flex justify-center">
          {fmt(m)}
        </div>
        <div className="absolute left-[784px] top-[130px] w-[11px] h-[50px] text-white text-[56px] font-light leading-[105.69%] tracking-[0.04em]">
          :
        </div>
        <div className="absolute left-[837px] top-[133px] w-[65px] h-[53px] text-white text-[56px] font-light leading-[105.69%] tracking-[0.04em] flex justify-center">
          {fmt(s)}
        </div>

        {/* Dynamic Buttons */}
        {remaining === 0 ? (
          <button 
            onClick={toggleTimer}
            className="absolute left-[487px] top-[264px] w-[432px] h-[47px] bg-[#FF6A6A] rounded-[20px] cursor-pointer hover:bg-[#ff5252] transition-colors flex justify-center items-center"
          >
            <span className="text-white text-[31px] font-normal leading-[105.69%] tracking-[0.04em]">
              Start
            </span>
          </button>
        ) : (
          <>
            <button 
              onClick={toggleTimer}
              className="absolute left-[487px] top-[264px] w-[206px] h-[47px] bg-[#FF6A6A] rounded-[20px] cursor-pointer hover:bg-[#ff5252] transition-colors flex justify-center items-center"
            >
              <span className="text-white text-[25px] font-normal leading-[105.69%] tracking-[0.04em]">
                {running ? "Pause" : "Resume"}
              </span>
            </button>
            <button 
              onClick={handleReset}
              className="absolute left-[713px] top-[264px] w-[206px] h-[47px] bg-transparent border border-[#FF6A6A] rounded-[20px] cursor-pointer hover:bg-[#FF6A6A]/10 transition-colors flex justify-center items-center"
            >
              <span className="text-[#FF6A6A] text-[25px] font-normal leading-[105.69%] tracking-[0.04em]">
                Reset
              </span>
            </button>
          </>
        )}

      </div>

      {/* Custom Popup Modal using React Portal for full-screen overlay */}
      {showPopup && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181D37] border-2 border-[#FF6A6A] p-10 rounded-2xl flex flex-col items-center shadow-[0_0_60px_rgba(255,106,106,0.4)] animate-in zoom-in duration-200">
            <h3 className="text-white text-4xl font-semibold mb-3">Time is up!</h3>
            <p className="text-[#949494] text-xl mb-8">Your timer has finished.</p>
            <button 
              onClick={() => setShowPopup(false)}
              className="bg-[#FF6A6A] hover:bg-[#ff5252] text-white px-10 py-4 rounded-xl text-2xl font-medium transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

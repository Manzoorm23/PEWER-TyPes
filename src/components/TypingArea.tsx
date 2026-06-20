import React, { useRef, useEffect, useState } from "react";

interface TypingAreaProps {
  targetText: string;
  typedText: string;
  isActive: boolean;
  isFinished: boolean;
  timeLeft: number;
  mode: "time" | "words" | "quote";
  caretStyle: "line" | "block" | "underline" | "none";
  fontStyle: string;
  onInputChange: (value: string) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  typedText,
  isActive,
  isFinished,
  timeLeft,
  mode,
  caretStyle,
  fontStyle,
  onInputChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const activeLetterRef = useRef<HTMLSpanElement>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [caretPos, setCaretPos] = useState({ left: 0, top: 0, height: 20 });

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Update caret position when typedText or fontStyle changes
  useEffect(() => {
    if (isFinished) return;

    const timer = setTimeout(() => {
      if (activeLetterRef.current && containerRef.current) {
        const left = activeLetterRef.current.offsetLeft;
        const top = activeLetterRef.current.offsetTop;
        const height = activeLetterRef.current.offsetHeight;

        setCaretPos({
          left,
          top: caretStyle === "underline" ? top + height - 2 : top,
          height,
        });

        // Scroll container if active letter is out of view (for long texts)
        const currentScrollTop = containerRef.current.scrollTop;
        if (top - currentScrollTop > 100) {
          containerRef.current.scrollTop = top - 60;
        } else if (top - currentScrollTop < 20) {
          containerRef.current.scrollTop = Math.max(0, top - 20);
        }
      }
    }, 15);

    return () => clearTimeout(timer);
  }, [typedText, caretStyle, fontStyle, isFinished]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Helper to split text into words and characters
  const renderTextWords = () => {
    const targetWords = targetText.split(" ");
    
    // We need to keep track of absolute character index to match with typedText
    let absoluteCharIndex = 0;

    return targetWords.map((word, wIdx) => {
      const typedWords = typedText.split(" ");
      const currentTypedWord = typedWords[wIdx] || "";
      const isWordActive = wIdx === typedWords.length - 1;
      
      // Determine word correctness status
      let wordClass = "typing-word";
      if (wIdx < typedWords.length - 1) {
        wordClass += typedWords[wIdx] === word ? " word-correct" : " word-incorrect";
      } else if (isWordActive) {
        wordClass += " word-active";
      }

      // Render characters of the target word
      const chars = word.split("").map((char, cIdx) => {
        const currentCharIndex = absoluteCharIndex + cIdx;
        const typedChar = typedText[currentCharIndex];
        
        let charClass = "typing-char";
        let isCharActive = currentCharIndex === typedText.length;
        
        if (currentCharIndex < typedText.length) {
          if (typedChar === char) {
            charClass += " char-correct";
          } else {
            charClass += " char-incorrect";
          }
        } else {
          charClass += " char-untyped";
        }

        // Set ref on the currently active character
        const isCaretHere = isCharActive;

        return (
          <span
            key={cIdx}
            ref={isCaretHere ? activeLetterRef : null}
            className={charClass}
          >
            {char}
          </span>
        );
      });

      // Render extra typed characters beyond target word length
      const extraChars = [];
      if (isWordActive && currentTypedWord.length > word.length) {
        const extraLength = currentTypedWord.length - word.length;
        for (let i = 0; i < extraLength; i++) {
          const charIndex = absoluteCharIndex + word.length + i;
          const typedChar = typedText[charIndex] || "";
          const isCaretHere = charIndex === typedText.length;

          extraChars.push(
            <span
              key={`extra-${i}`}
              ref={isCaretHere ? activeLetterRef : null}
              className="typing-char char-extra"
            >
              {typedChar}
            </span>
          );
        }
      }

      // Add a space character at the end of word if it's not the last word
      const isLastWord = wIdx === targetWords.length - 1;
      let spaceNode = null;
      if (!isLastWord) {
        const spaceIndex = absoluteCharIndex + word.length;
        const typedSpace = typedText[spaceIndex];
        let spaceClass = "typing-char space";
        
        if (spaceIndex < typedText.length) {
          spaceClass += typedSpace === " " ? " space-correct" : " space-incorrect char-incorrect";
        } else {
          spaceClass += " char-untyped";
        }

        const isCaretHere = spaceIndex === typedText.length;

        spaceNode = (
          <span
            ref={isCaretHere ? activeLetterRef : null}
            className={spaceClass}
          >
            &nbsp;
          </span>
        );
      }

      // Update the running absolute character index (word characters + space)
      absoluteCharIndex += word.length + 1;

      return (
        <span key={wIdx} className={wordClass}>
          {chars}
          {extraChars}
          {spaceNode}
        </span>
      );
    });
  };

  // Format time remaining (e.g. 60 -> 1:00 or just 60)
  const formatTime = (seconds: number) => {
    if (mode === "time") {
      return seconds;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="typing-area-container">
      {/* Timer and live status indicators */}
      <div className="typing-metrics-bar">
        <div className="timer-pill glow-text">
          {formatTime(timeLeft)}
        </div>
        
        {isActive && (
          <div className="live-stat-pills">
            <span className="live-stat">wpm: {Math.max(0, Math.round(((typedText.length - (typedText.split("").filter((c, i) => c !== targetText[i]).length)) / 5) / (Math.max(1, timeLeft) / 60)) || 0)}</span>
          </div>
        )}
      </div>

      <div 
        className={`typing-text-wrapper glass-panel ${!isFocused && !isFinished ? "blurred" : ""}`}
        onClick={handleContainerClick}
        style={{ fontFamily: fontStyle === "Outfit" ? "Outfit" : "var(--font-mono)" }}
      >
        {/* Focus lock overlay */}
        {!isFocused && !isFinished && (
          <div className="focus-overlay">
            <span className="focus-message animate-bounce">Click here or press any key to focus</span>
          </div>
        )}

        {/* Text Container */}
        <div ref={containerRef} className="typing-text-content">
          {renderTextWords()}
          
          {/* Smooth caret indicator */}
          {!isFinished && caretStyle !== "none" && isFocused && (
            <div
              className={`typing-caret caret-${caretStyle} ${!isActive ? "caret-blink" : ""}`}
              style={{
                left: `${caretPos.left}px`,
                top: `${caretPos.top}px`,
                height: `${caretPos.height}px`,
              }}
            />
          )}
        </div>

        {/* Hidden textarea to capture input */}
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="hidden-typing-input"
          disabled={isFinished}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      <div className="typing-restart-tooltip text-muted">
        <span>Tip: press </span>
        <kbd className="key-kbd">Tab</kbd>
        <span> + </span>
        <kbd className="key-kbd">Enter</kbd>
        <span> to restart test</span>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";

export const KeyboardVisualizer: React.FC = () => {
  const [activeKeys, setActiveKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let key = e.key.toLowerCase();
      // Normalize space
      if (e.code === "Space") {
        key = "space";
      }
      setActiveKeys((prev) => ({ ...prev, [key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      let key = e.key.toLowerCase();
      if (e.code === "Space") {
        key = "space";
      }
      setActiveKeys((prev) => ({ ...prev, [key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
    ["space"],
  ];

  return (
    <div className="keyboard-visualizer glass-panel">
      <div className="keyboard-container">
        {keyboardRows.map((row, rIdx) => (
          <div key={`row-${rIdx}`} className="keyboard-row">
            {row.map((key) => {
              const isActive = activeKeys[key];
              const isSpace = key === "space";

              return (
                <div
                  key={key}
                  className={`keyboard-key ${isSpace ? "space-key" : ""} ${
                    isActive ? "active" : ""
                  }`}
                >
                  {isSpace ? "" : key.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

import React from "react";
import { Clock, Type, Quote } from "lucide-react";

interface TestSelectorProps {
  mode: "time" | "words" | "quote";
  limit: number;
  quoteLength: "short" | "medium" | "long" | "all";
  onModeChange: (mode: "time" | "words" | "quote") => void;
  onLimitChange: (limit: number) => void;
  onQuoteLengthChange: (length: "short" | "medium" | "long" | "all") => void;
  isActive: boolean;
}

export const TestSelector: React.FC<TestSelectorProps> = ({
  mode,
  limit,
  quoteLength,
  onModeChange,
  onLimitChange,
  onQuoteLengthChange,
  isActive,
}) => {
  const timeLimits = [15, 30, 60, 120];
  const wordLimits = [10, 25, 50, 100];
  const quoteLengths: Array<"short" | "medium" | "long" | "all"> = ["short", "medium", "long", "all"];

  return (
    <div className={`test-config-bar glass-panel ${isActive ? "typing-fade" : ""}`}>
      <div className="config-group">
        <button
          className={`config-tab ${mode === "time" ? "active" : ""}`}
          onClick={() => onModeChange("time")}
        >
          <Clock size={16} />
          <span>time</span>
        </button>
        <button
          className={`config-tab ${mode === "words" ? "active" : ""}`}
          onClick={() => onModeChange("words")}
        >
          <Type size={16} />
          <span>words</span>
        </button>
        <button
          className={`config-tab ${mode === "quote" ? "active" : ""}`}
          onClick={() => onModeChange("quote")}
        >
          <Quote size={16} />
          <span>quote</span>
        </button>
      </div>

      <div className="config-divider"></div>

      <div className="config-group sub-options">
        {mode === "time" &&
          timeLimits.map((l) => (
            <button
              key={l}
              className={`config-option ${limit === l ? "active" : ""}`}
              onClick={() => onLimitChange(l)}
            >
              {l}s
            </button>
          ))}

        {mode === "words" &&
          wordLimits.map((l) => (
            <button
              key={l}
              className={`config-option ${limit === l ? "active" : ""}`}
              onClick={() => onLimitChange(l)}
            >
              {l}
            </button>
          ))}

        {mode === "quote" &&
          quoteLengths.map((q) => (
            <button
              key={q}
              className={`config-option ${quoteLength === q ? "active" : ""}`}
              onClick={() => onQuoteLengthChange(q)}
            >
              {q}
            </button>
          ))}
      </div>
    </div>
  );
};

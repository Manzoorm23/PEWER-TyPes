import React, { useState } from "react";
import { X, Volume2, Type, Music, Eye, FileText } from "lucide-react";
import type { KeySoundType } from "../utils/audioSynth";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  soundType: KeySoundType;
  onSoundTypeChange: (type: KeySoundType) => void;
  soundVolume: number;
  onSoundVolumeChange: (volume: number) => void;
  caretStyle: "line" | "block" | "underline" | "none";
  onCaretStyleChange: (style: "line" | "block" | "underline" | "none") => void;
  fontStyle: string;
  onFontStyleChange: (font: string) => void;
  onCustomTextSubmit: (text: string) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  soundType,
  onSoundTypeChange,
  soundVolume,
  onSoundVolumeChange,
  caretStyle,
  onCaretStyleChange,
  fontStyle,
  onFontStyleChange,
  onCustomTextSubmit,
}) => {
  const [customText, setCustomText] = useState("");

  if (!isOpen) return null;

  const handleCustomTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customText.trim()) {
      onCustomTextSubmit(customText.trim());
      setCustomText("");
      onClose();
    }
  };

  return (
    <div className="settings-drawer-overlay" onClick={onClose}>
      <div className="settings-drawer glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Settings</h3>
          <button className="icon-button close-btn" onClick={onClose} aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Keyboard Switch Type */}
          <div className="setting-section">
            <div className="setting-title">
              <Music size={16} className="text-muted" />
              <span>Keyboard Switches Sound</span>
            </div>
            <div className="setting-options-grid">
              {(["clicky", "tactile", "linear", "mute"] as KeySoundType[]).map((type) => (
                <button
                  key={type}
                  className={`setting-btn ${soundType === type ? "active" : ""}`}
                  onClick={() => onSoundTypeChange(type)}
                >
                  {type === "clicky" && "MX Blue"}
                  {type === "tactile" && "MX Brown"}
                  {type === "linear" && "MX Red"}
                  {type === "mute" && "Mute"}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Slider */}
          <div className="setting-section">
            <div className="setting-title">
              <Volume2 size={16} className="text-muted" />
              <span>Click Sound Volume ({soundVolume}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={soundVolume}
              onChange={(e) => onSoundVolumeChange(Number(e.target.value))}
              disabled={soundType === "mute"}
              className="volume-slider"
            />
          </div>

          {/* Caret Style Selection */}
          <div className="setting-section">
            <div className="setting-title">
              <Eye size={16} className="text-muted" />
              <span>Typing Caret Style</span>
            </div>
            <div className="setting-options-grid">
              {(["line", "block", "underline", "none"] as const).map((style) => (
                <button
                  key={style}
                  className={`setting-btn ${caretStyle === style ? "active" : ""}`}
                  onClick={() => onCaretStyleChange(style)}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Fonts selection */}
          <div className="setting-section">
            <div className="setting-title">
              <Type size={16} className="text-muted" />
              <span>Font Style</span>
            </div>
            <div className="setting-options-grid">
              {["JetBrains Mono", "Fira Code", "Share Tech Mono", "Outfit", "Courier New"].map(
                (font) => (
                  <button
                    key={font}
                    className={`setting-btn ${fontStyle === font ? "active" : ""}`}
                    onClick={() => onFontStyleChange(font)}
                    style={{ fontFamily: font === "Outfit" ? "Outfit" : "monospace" }}
                  >
                    {font.split(" ")[0]}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Custom Text Mode */}
          <div className="setting-section">
            <div className="setting-title">
              <FileText size={16} className="text-muted" />
              <span>Custom Typing Text</span>
            </div>
            <form onSubmit={handleCustomTextSubmit} className="custom-text-form">
              <textarea
                placeholder="Paste your own text here to practice typing it..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="custom-text-textarea"
                rows={4}
              />
              <button
                type="submit"
                className="btn-primary custom-text-btn"
                disabled={!customText.trim()}
              >
                Apply Custom Text
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

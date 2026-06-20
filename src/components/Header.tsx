import React from "react";
import { Keyboard, Settings, SunMoon } from "lucide-react";

interface HeaderProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  onOpenSettings: () => void;
  isActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onThemeChange,
  onOpenSettings,
  isActive,
}) => {
  const themes = [
    { id: "carbon", name: "Carbon" },
    { id: "dracula", name: "Dracula" },
    { id: "cyberpunk", name: "Cyberpunk" },
    { id: "forest", name: "Forest" },
    { id: "sakura", name: "Sakura" },
    { id: "terminal", name: "Terminal" },
  ];

  return (
    <header className={`app-header ${isActive ? "typing-fade" : ""}`}>
      <div className="header-brand">
        <Keyboard className="logo-icon" />
        <span className="logo-text">
          PEWER <span className="logo-accent">TyPes</span>
        </span>
      </div>

      <div className="header-actions">
        <div className="theme-selector">
          <SunMoon className="action-icon text-muted" size={18} />
          <select
            value={currentTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="theme-dropdown"
            title="Choose Theme"
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onOpenSettings}
          className="icon-button"
          title="Open Settings"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { TestSelector } from "./components/TestSelector";
import { TypingArea } from "./components/TypingArea";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { KeyboardVisualizer } from "./components/KeyboardVisualizer";
import { useTypingTest } from "./hooks/useTypingTest";
import { quotes, basicSentences, continuousParagraphs } from "./utils/sentences";
import type { KeySoundType } from "./utils/audioSynth";
import { Keyboard } from "lucide-react";
import "./App.css";

export default function App() {
  // Splash Screen States
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [isSplashFading, setIsSplashFading] = useState(false);

  // Global User Options & Settings
  const [theme, setTheme] = useState(() => localStorage.getItem("type-theme") || "carbon");
  const [soundType, setSoundType] = useState<KeySoundType>(
    () => (localStorage.getItem("type-sound") as KeySoundType) || "clicky"
  );
  const [soundVolume, setSoundVolume] = useState<number>(() =>
    localStorage.getItem("type-volume") ? Number(localStorage.getItem("type-volume")) : 50
  );
  const [caretStyle, setCaretStyle] = useState<"line" | "block" | "underline" | "none">(
    () => (localStorage.getItem("type-caret") as any) || "line"
  );
  const [fontStyle, setFontStyle] = useState(() => localStorage.getItem("type-font") || "JetBrains Mono");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Test state configuration
  const [mode, setMode] = useState<"time" | "words" | "quote">("time");
  const [limit, setLimit] = useState(30); // Default 30s or 30 words
  const [quoteLength, setQuoteLength] = useState<"short" | "medium" | "long" | "all">("all");
  const [customText, setCustomText] = useState<string | null>(null);

  // Target text state
  const [targetText, setTargetText] = useState("");

  // Helper to generate target text
  const generateNewText = useCallback(
    (currentMode = mode, currentLimit = limit, qLen = quoteLength) => {
      if (customText) {
        setTargetText(customText);
        return;
      }

      if (currentMode === "time") {
        // Pick two random paragraphs to form a long continuous typing block
        const p1 = continuousParagraphs[Math.floor(Math.random() * continuousParagraphs.length)];
        const p2 = continuousParagraphs[Math.floor(Math.random() * continuousParagraphs.length)];
        setTargetText(p1 + " " + p2);
      } else if (currentMode === "words") {
        // Gather paragraphs until we have enough words, then slice to currentLimit
        let combined = "";
        const shuffled = [...continuousParagraphs].sort(() => 0.5 - Math.random());
        for (const p of shuffled) {
          combined += (combined ? " " : "") + p;
          if (combined.split(" ").length >= currentLimit) break;
        }
        const wordsList = combined.split(" ").slice(0, currentLimit).join(" ");
        setTargetText(wordsList);
      } else if (currentMode === "quote") {
        // Pick a quote
        const filtered = quotes.filter((q) => qLen === "all" || q.length === qLen);
        if (filtered.length > 0) {
          const randQuote = filtered[Math.floor(Math.random() * filtered.length)];
          setTargetText(randQuote.text);
        } else {
          // Fallback to static sentence
          const randSentence = basicSentences[Math.floor(Math.random() * basicSentences.length)];
          setTargetText(randSentence);
        }
      }
    },
    [mode, limit, quoteLength, customText]
  );

  // Initialize typing test hook
  const {
    typedText,
    isActive,
    isFinished,
    timeLeft,
    timeElapsed,
    telemetry,
    handleInput,
    resetTest,
    getStats,
  } = useTypingTest({
    targetText,
    mode: customText ? "quote" : mode, // Custom text operates like quotes (count up until finished)
    limit,
    soundType,
    soundVolume,
  });

  // Generate initial text on load
  useEffect(() => {
    generateNewText();
  }, [generateNewText]);

  // Sync theme to document body class list
  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("type-theme", theme);
  }, [theme]);

  // Sync settings changes to localStorage
  useEffect(() => {
    localStorage.setItem("type-sound", soundType);
  }, [soundType]);

  useEffect(() => {
    localStorage.setItem("type-volume", soundVolume.toString());
  }, [soundVolume]);

  useEffect(() => {
    localStorage.setItem("type-caret", caretStyle);
  }, [caretStyle]);

  useEffect(() => {
    localStorage.setItem("type-font", fontStyle);
  }, [fontStyle]);

  // Update typing speed cycle and intensity for interactive responsive background animations
  useEffect(() => {
    const currentWpm = getStats().wpm;
    if (isActive && currentWpm > 0) {
      // 60 WPM represents the baseline (6.0 second loop)
      // Faster typing speeds up the visual animations, slower typing calms them down
      const baseDuration = 6.0;
      const cycleDuration = Math.max(0.6, Math.min(12.0, baseDuration * (60 / currentWpm)));
      const wpmIntensity = Math.max(0.2, Math.min(2.5, currentWpm / 60));

      document.documentElement.style.setProperty("--wpm-cycle", `${cycleDuration}s`);
      document.documentElement.style.setProperty("--wpm-intensity", `${wpmIntensity}`);
    } else {
      document.documentElement.style.setProperty("--wpm-cycle", "6s");
      document.documentElement.style.setProperty("--wpm-intensity", "0.25");
    }
  }, [isActive, timeElapsed, typedText, getStats]);

  // Handle configuration changes
  const handleModeChange = (newMode: "time" | "words" | "quote") => {
    setCustomText(null); // Clear custom text on mode change
    setMode(newMode);
    
    // Set appropriate default limits for each mode
    let defaultLimit = limit;
    if (newMode === "time" && ![15, 30, 60, 120].includes(limit)) {
      defaultLimit = 30;
      setLimit(30);
    } else if (newMode === "words" && ![10, 25, 50, 100].includes(limit)) {
      defaultLimit = 25;
      setLimit(25);
    }
    
    resetTest();
    generateNewText(newMode, defaultLimit, quoteLength);
  };

  const handleLimitChange = (newLimit: number) => {
    setCustomText(null);
    setLimit(newLimit);
    resetTest();
    generateNewText(mode, newLimit, quoteLength);
  };

  const handleQuoteLengthChange = (qLen: "short" | "medium" | "long" | "all") => {
    setCustomText(null);
    setQuoteLength(qLen);
    resetTest();
    generateNewText(mode, limit, qLen);
  };

  const handleCustomTextSubmit = (text: string) => {
    setCustomText(text);
    resetTest();
    // Use timeout to let state update before generating text
    setTimeout(() => {
      setTargetText(text);
    }, 0);
  };

  // Restart handlers
  const handleRestart = useCallback(() => {
    resetTest();
    generateNewText();
  }, [resetTest, generateNewText]);

  const handleNextTest = () => {
    setCustomText(null); // Clear custom text if they click Next
    resetTest();
    // A timeout ensures customText resolves to null before we run target generation
    setTimeout(() => {
      generateNewText(mode, limit, quoteLength);
    }, 0);
  };

  // Bind Tab key global shortcut to quickly restart test
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRestart]);

  // Handle splash auto-dismissal and fade-out timer (5 seconds)
  useEffect(() => {
    if (!isSplashActive) return;

    // Start fading out at exactly 2 seconds
    const fadeTimer = setTimeout(() => {
      setIsSplashFading(true);
    }, 2000);

    // Unmount completely at 2.4 seconds (after the 400ms transition)
    const unmountTimer = setTimeout(() => {
      setIsSplashActive(false);
    }, 2400);

    // Allow user to click or press any key to bypass splash immediately
    const handleDismiss = () => {
      setIsSplashFading(true);
      setTimeout(() => {
        setIsSplashActive(false);
      }, 400);
    };

    window.addEventListener("keydown", handleDismiss);
    window.addEventListener("click", handleDismiss);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
      window.removeEventListener("keydown", handleDismiss);
      window.removeEventListener("click", handleDismiss);
    };
  }, [isSplashActive]);

  const stats = getStats();

  return (
    <div className="app-container">
      {/* Welcome Splash Screen Overlay */}
      {isSplashActive && (
        <div className={`splash-overlay ${isSplashFading ? "fade-out" : ""}`}>
          <div className="splash-content">
            <div className="splash-icon-container">
              <Keyboard className="splash-icon" size={80} />
            </div>
          </div>
        </div>
      )}

      {/* Background Interactive Particles */}
      <div className="theme-bg-particles">
        <div className="particle p-1"></div>
        <div className="particle p-2"></div>
        <div className="particle p-3"></div>
        <div className="particle p-4"></div>
        <div className="particle p-5"></div>
        <div className="particle p-6"></div>
        <div className="particle p-7"></div>
        <div className="particle p-8"></div>
      </div>

      {/* Top Header */}
      <Header
        currentTheme={theme}
        onThemeChange={setTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isActive={isActive}
      />

      {/* Main Core Dashboard */}
      {!isFinished ? (
        <>
          <TestSelector
            mode={mode}
            limit={limit}
            quoteLength={quoteLength}
            onModeChange={handleModeChange}
            onLimitChange={handleLimitChange}
            onQuoteLengthChange={handleQuoteLengthChange}
            isActive={isActive}
          />

          <TypingArea
            targetText={targetText}
            typedText={typedText}
            isActive={isActive}
            isFinished={isFinished}
            timeLeft={timeLeft}
            mode={customText ? "quote" : mode}
            caretStyle={caretStyle}
            fontStyle={fontStyle}
            onInputChange={handleInput}
          />

          {/* Interactive Keyboard */}
          <KeyboardVisualizer />
        </>
      ) : (
        <ResultsDashboard
          wpm={stats.wpm}
          rawWpm={stats.rawWpm}
          accuracy={stats.accuracy}
          errors={stats.uncorrectedErrors}
          timeElapsed={timeElapsed}
          telemetry={telemetry}
          onRestart={handleRestart}
          onNextTest={handleNextTest}
        />
      )}

      {/* Slide-out configuration settings drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundType={soundType}
        onSoundTypeChange={setSoundType}
        soundVolume={soundVolume}
        onSoundVolumeChange={setSoundVolume}
        caretStyle={caretStyle}
        onCaretStyleChange={setCaretStyle}
        fontStyle={fontStyle}
        onFontStyleChange={setFontStyle}
        onCustomTextSubmit={handleCustomTextSubmit}
      />

      {/* Bottom Footer Info */}
      <footer className={`app-footer ${isActive ? "typing-fade" : ""}`}>
        <p>PEWER TyPes Rebuild — Built with React & TypeScript.</p>
        <p style={{ marginTop: "4px" }}>Press Tab key to instantly restart/reroll test.</p>
      </footer>
    </div>
  );
}

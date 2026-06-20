import { useState, useEffect, useRef, useCallback } from "react";
import { playKeySound, type KeySoundType } from "../utils/audioSynth";

export interface TelemetryPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

interface UseTypingTestProps {
  targetText: string;
  mode: "time" | "words" | "quote";
  limit: number; // seconds for 'time', word count for 'words'
  soundType: KeySoundType;
  soundVolume: number;
}

export function useTypingTest({
  targetText,
  mode,
  limit,
  soundType,
  soundVolume,
}: UseTypingTestProps) {
  const [typedText, setTypedText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Telemetry for charts
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);

  // Keystroke counters
  const totalKeystrokes = useRef(0);
  const correctKeystrokes = useRef(0);
  const errorsTimeline = useRef<number[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset all states
  const resetTest = useCallback(() => {
    setTypedText("");
    setIsActive(false);
    setIsFinished(false);
    setTimeElapsed(0);
    setTelemetry([]);
    totalKeystrokes.current = 0;
    correctKeystrokes.current = 0;
    errorsTimeline.current = [];
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Calculate current stats
  const getStats = useCallback(() => {
    const elapsed = Math.max(1, timeElapsed);
    const elapsedMinutes = elapsed / 60;

    // Count current uncorrected errors in the input
    let uncorrectedErrors = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] !== targetText[i]) {
        uncorrectedErrors++;
      }
    }

    // Standard WPM: (correct characters / 5) / minutes
    // Correct characters is total typed length minus uncorrected errors
    const correctCharsCount = Math.max(0, typedText.length - uncorrectedErrors);
    const wpm = Math.round((correctCharsCount / 5) / elapsedMinutes);

    // Raw WPM: (all typed characters / 5) / minutes
    const rawWpm = Math.round((typedText.length / 5) / elapsedMinutes);

    // Accuracy: (correct keystrokes / total keystrokes) * 100
    const accuracy = totalKeystrokes.current > 0
      ? Math.round((correctKeystrokes.current / totalKeystrokes.current) * 100)
      : 100;

    return {
      wpm: isNaN(wpm) || !isFinite(wpm) ? 0 : wpm,
      rawWpm: isNaN(rawWpm) || !isFinite(rawWpm) ? 0 : rawWpm,
      accuracy,
      uncorrectedErrors,
      timeElapsed: elapsed,
      totalKeystrokes: totalKeystrokes.current,
      correctKeystrokes: correctKeystrokes.current,
    };
  }, [typedText, targetText, timeElapsed]);

  // Finish test callback
  const finishTest = useCallback(() => {
    setIsActive(false);
    setIsFinished(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Handle keyboard inputs
  const handleInput = useCallback((value: string) => {
    if (isFinished) return;

    // Start test on first keystroke
    if (!isActive && value.length > 0) {
      setIsActive(true);
    }

    const prevLength = typedText.length;
    const newLength = value.length;

    // Determine keystroke type (backspace vs typing)
    if (newLength > prevLength) {
      // User typed a character
      const charTyped = value[value.length - 1];
      const targetChar = targetText[prevLength];

      totalKeystrokes.current += 1;

      if (charTyped === targetChar) {
        correctKeystrokes.current += 1;
        playKeySound(soundType, soundVolume);
      } else {
        // play error sound
        playKeySound("error", soundVolume);
      }
    } else if (newLength < prevLength) {
      // User pressed backspace
      playKeySound(soundType, soundVolume);
    }

    setTypedText(value);

    // Check completion conditions for words/quote mode
    // (If user typed all target characters correctly)
    if (value === targetText) {
      finishTest();
    }
  }, [typedText, targetText, isActive, isFinished, soundType, soundVolume, finishTest]);

  // Timer effect
  useEffect(() => {
    if (isActive && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const nextTime = prev + 1;

          // Check if time-limit reached
          if (mode === "time" && nextTime >= limit) {
            finishTest();
            return limit;
          }
          return nextTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isFinished, mode, limit, finishTest]);

  // Telemetry updates (second-by-second log)
  useEffect(() => {
    if (isActive && timeElapsed > 0) {
      const stats = getStats();
      setTelemetry((prev) => [
        ...prev,
        {
          second: timeElapsed,
          wpm: stats.wpm,
          rawWpm: stats.rawWpm,
          errors: stats.uncorrectedErrors,
        },
      ]);
    }
  }, [timeElapsed, isActive]); // Depend on timeElapsed to update once per second

  // Calculate remaining time for timer display
  const timeLeft = mode === "time" ? Math.max(0, limit - timeElapsed) : timeElapsed;

  return {
    typedText,
    isActive,
    isFinished,
    timeLeft,
    timeElapsed,
    telemetry,
    handleInput,
    resetTest,
    getStats,
    finishTest,
  };
}

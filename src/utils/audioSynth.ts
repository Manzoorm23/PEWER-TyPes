let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export type KeySoundType = "clicky" | "tactile" | "linear" | "error" | "mute";

export function playKeySound(type: KeySoundType, volumePercent: number) {
  if (type === "mute" || volumePercent <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security)
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const volume = volumePercent / 100;
  const now = ctx.currentTime;

  if (type === "clicky") {
    // High-pitched mechanical click (Cherry MX Blue style)
    // 1. High transient click (sine wave pitch sweep)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.015);

    gainNode.gain.setValueAtTime(0.3 * volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);

    // 2. High-frequency noise burst for the snap
    const bufferSize = ctx.sampleRate * 0.01; // 10ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 5000;
    noiseFilter.Q.value = 3;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08 * volume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.015);
  } 
  else if (type === "tactile") {
    // Deeper, rounder click (Cherry MX Brown style)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.02);

    gainNode.gain.setValueAtTime(0.5 * volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    // Add a bit of low-pass noise
    const bufferSize = ctx.sampleRate * 0.015; // 15ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1000;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12 * volume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.02);
  } 
  else if (type === "linear") {
    // Softer click (Cherry MX Red style)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.025);

    gainNode.gain.setValueAtTime(0.4 * volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  } 
  else if (type === "error") {
    // Subtle typewriter scratch / buzzer sound
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);

    osc2.type = "square";
    osc2.frequency.setValueAtTime(154, now); // Detune slightly for chorusing effect

    gainNode.gain.setValueAtTime(0.18 * volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 1.5;

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.15);
    osc2.stop(now + 0.15);
  }
}

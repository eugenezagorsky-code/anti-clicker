export type SoundId =
  | "generate"
  | "complete"
  | "purchase"
  | "disconnect"
  | "killSwitch"
  | "initialize";

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    try {
      audioContext = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioContext;
}

export function resumeAudio(): void {
  const ctx = getContext();
  if (ctx?.state === "suspended") {
    void ctx.resume().catch(() => {});
  }
}

function playTone(
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.08,
): void {
  const ctx = getContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.01);
}

function playGenerate(ctx: AudioContext): void {
  const t = ctx.currentTime;
  playTone(120, t, 0.05, "square", 0.06);
  playTone(280, t + 0.04, 0.1, "square", 0.07);
  playTone(440, t + 0.08, 0.12, "sine", 0.05);
}

function playComplete(ctx: AudioContext): void {
  const t = ctx.currentTime;
  playTone(880, t, 0.06, "square", 0.05);
  playTone(1100, t + 0.07, 0.08, "square", 0.05);
  playTone(660, t + 0.14, 0.18, "sine", 0.04);
}

function playPurchase(ctx: AudioContext): void {
  const t = ctx.currentTime;
  playTone(880, t, 0.08, "square", 0.07);
  playTone(1320, t + 0.09, 0.1, "square", 0.06);
  playTone(660, t + 0.18, 0.15, "sine", 0.05);
}

function playDisconnect(ctx: AudioContext): void {
  const t = ctx.currentTime;
  playTone(440, t, 0.1, "sawtooth", 0.06);
  playTone(330, t + 0.1, 0.1, "sawtooth", 0.06);
  playTone(220, t + 0.2, 0.15, "sawtooth", 0.05);
}

function playKillSwitch(ctx: AudioContext): void {
  const t = ctx.currentTime;
  for (let i = 0; i < 4; i++) {
    playTone(180 + i * 20, t + i * 0.07, 0.06, "sawtooth", 0.09);
  }
  playTone(90, t + 0.28, 0.2, "square", 0.07);
}

function playInitialize(ctx: AudioContext): void {
  const t = ctx.currentTime;
  playTone(220, t, 0.08, "sine", 0.05);
  playTone(330, t + 0.07, 0.08, "sine", 0.05);
  playTone(440, t + 0.14, 0.12, "sine", 0.04);
}

const PLAYERS: Record<SoundId, (ctx: AudioContext) => void> = {
  generate: playGenerate,
  complete: playComplete,
  purchase: playPurchase,
  disconnect: playDisconnect,
  killSwitch: playKillSwitch,
  initialize: playInitialize,
};

export function playSound(id: SoundId): void {
  try {
    const ctx = getContext();
    if (!ctx) return;
    PLAYERS[id](ctx);
  } catch {
    // Autoplay or audio unavailable — fail silently
  }
}

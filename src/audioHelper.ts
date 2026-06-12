// --- Browser Native Audio Synthesizer via Web Audio API ---
// This avoids CFRS/network load issues with external sound assets.

let audioContext: AudioContext | null = null;
let drumrollSource: AudioScheduledSourceNode | null = null;
let drumrollGain: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Plays a custom synthesized drumroll that builds up in intensity.
 */
export function playSynthesizedDrumroll() {
  try {
    const ctx = getAudioContext();
    const duration = 2.8; // seconds

    // Stop existing sounds if running
    stopSynthesizedDrumroll();

    // Create noise buffer for snare drum noise
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    // Snare noise source
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to shape raw noise into a snare drum texture
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(180, ctx.currentTime);
    // Rapidly modulate frequency to simulate drum rattles
    for (let t = 0; t < duration; t += 0.05) {
      filter.frequency.setValueAtTime(140 + Math.random() * 80, ctx.currentTime + t);
    }

    // Drum kick tone to accompany the roll (low rumbling frequency)
    const oscillator = ctx.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(65, ctx.currentTime);
    // Sub-bass vibrato
    for (let t = 0; t < duration; t += 0.1) {
      oscillator.frequency.setValueAtTime(60 + Math.sin(t * 30) * 10, ctx.currentTime + t);
    }

    // Gain envelope to build up excitement
    drumrollGain = ctx.createGain();
    drumrollGain.gain.setValueAtTime(0.01, ctx.currentTime);
    // Linear build up
    drumrollGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + duration - 0.2);
    // Fade out slightly at very end before the crash
    drumrollGain.gain.setValueAtTime(0.35, ctx.currentTime + duration - 0.25);
    drumrollGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // Connections
    noise.connect(filter);
    filter.connect(drumrollGain);
    oscillator.connect(drumrollGain);

    drumrollGain.connect(ctx.destination);

    // Start playback
    noise.start();
    oscillator.start();

    drumrollSource = noise;
  } catch (e) {
    console.warn("Could not play synthesized drumroll:", e);
  }
}

/**
 * Stops any actively running drumroll synthetic audio.
 */
export function stopSynthesizedDrumroll() {
  try {
    if (drumrollSource) {
      drumrollSource.stop();
      drumrollSource = null;
    }
    if (drumrollGain) {
      drumrollGain.disconnect();
      drumrollGain = null;
    }
  } catch (e) {
    // Already stopped or uninitialized
  }
}

/**
 * Plays a triumphant fanfare sound with synthesizer oscillators and an explosive crash tail.
 */
export function playFanfareCrash() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Triumphant chords (Major notes: Root, Third, Fifth, Octave)
    const notes = [196.00, 246.94, 293.66, 392.00, 493.88]; // G-Major chords (rich brass feel)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Brass-like sawtooth waveform
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);
      // Slight pitch slide for epic brass feel
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + 0.1);

      // Shaping the volume
      gainNode.gain.setValueAtTime(0.08, now);
      // Stagger notes starting marginally for natural orchestra delay
      gainNode.gain.setValueAtTime(0.12, now + idx * 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2 + idx * 0.05);

      // Low-pass filter to make it sound warm and rich, like stadium brass
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, now);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + idx * 0.03);
      osc.stop(now + 1.5 + idx * 0.05);
    });

    // 2. High-energy explosion tail (Cymbal crash sound)
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const crashNoise = ctx.createBufferSource();
    crashNoise.buffer = buffer;

    const crashFilter = ctx.createBiquadFilter();
    crashFilter.type = "highpass";
    crashFilter.frequency.setValueAtTime(3000, now);

    const crashGain = ctx.createGain();
    crashGain.gain.setValueAtTime(0.25, now);
    crashGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    crashNoise.connect(crashFilter);
    crashFilter.connect(crashGain);
    crashGain.connect(ctx.destination);

    crashNoise.start(now);
    crashNoise.stop(now + 2.0);
  } catch (e) {
    console.warn("Could not play synthesized fanfare:", e);
  }
}

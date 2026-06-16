import { useState, useEffect } from 'react';

export const useSound = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('oasis_sound_enabled');
    return saved ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('oasis_sound_enabled', String(enabled));
  }, [enabled]);

  const toggleSound = () => setEnabled(!enabled);

  const playSound = (type: 'click' | 'xp' | 'levelup' | 'success' | 'purchase') => {
    if (!enabled) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const playTone = (freq: number, waveType: OscillatorType, duration: number, delay = 0) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      if (type === 'click') {
        // Short digital click
        playTone(680, 'triangle', 0.06);
      } else if (type === 'xp') {
        // Fast upward pitch sweep
        playTone(440, 'square', 0.08, 0);
        playTone(554.37, 'square', 0.08, 0.04);
        playTone(659.25, 'square', 0.12, 0.08);
      } else if (type === 'success') {
        // High double chime
        playTone(523.25, 'sine', 0.12, 0);
        playTone(783.99, 'sine', 0.18, 0.06);
      } else if (type === 'levelup') {
        // Complete 8-bit victory fanfare
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
          playTone(freq, 'sawtooth', 0.12, index * 0.07);
        });
        
        // Ending chord
        setTimeout(() => {
          playTone(523.25, 'triangle', 0.4, 0);
          playTone(659.25, 'triangle', 0.4, 0);
          playTone(783.99, 'triangle', 0.4, 0);
          playTone(1046.50, 'triangle', 0.4, 0);
        }, notes.length * 70);
      } else if (type === 'purchase') {
        // Coin collection sound
        playTone(987.77, 'sine', 0.06, 0);
        playTone(1318.51, 'sine', 0.06, 0.03);
        playTone(1975.53, 'sine', 0.15, 0.06);
      }
    } catch (error) {
      console.warn("AudioContext failed to initialize:", error);
    }
  };

  return { enabled, toggleSound, playSound };
};

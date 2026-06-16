import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Trophy } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  title: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, title, onClose }) => {
  useEffect(() => {
    // Launch retro confetti bursts
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-md glass-panel glow-cyan rounded-xl p-8 text-center relative overflow-hidden crt-flicker hologram-scan">
        <div className="absolute top-2 right-2 text-xs font-share text-cyan-400/40">OASIS_SYS_v1.0</div>
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-cyan-950/50 border border-cyan-500/40 rounded-full animate-bounce">
            <Trophy className="w-14 h-14 text-yellow-400 text-glow-gold" />
          </div>
        </div>

        <h2 className="font-orbitron text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400 mb-2 animate-pulse">
          ¡NIVEL COMPLETADO!
        </h2>
        
        <p className="font-share text-xs text-cyan-400 tracking-widest mb-6">
          CARGANDO NUEVO RANGO...
        </p>

        <div className="mb-6 inline-block py-2 px-8 bg-cyan-950/40 border border-cyan-500/30 rounded-lg">
          <div className="text-xs font-share text-cyan-300/70">NIVEL ACTUAL</div>
          <div className="text-4xl font-orbitron font-black text-cyan-400 text-glow-cyan">{level}</div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-share text-gray-400 uppercase tracking-widest mb-1">RANGO OASIS</div>
          <div className="text-lg font-orbitron font-semibold text-pink-500 text-glow-pink">{title}</div>
        </div>

        <div className="border-t border-cyan-500/20 pt-6 mb-6">
          <div className="flex items-start gap-3 text-left bg-cyan-950/20 p-3 rounded border border-cyan-500/10">
            <Award className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs font-share text-cyan-200/90 leading-relaxed">
              <span className="text-pink-400 font-semibold">JARVIS:</span> "Excelente trabajo, Parzival. Tus estadísticas en la base de datos de OASIS se han actualizado correctamente. Has subido de nivel. Continúa completando misiones cotidianas."
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-orbitron font-bold tracking-wider rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer border-0 duration-300"
        >
          RETORNAR AL OASIS
        </button>
      </div>
    </div>
  );
};

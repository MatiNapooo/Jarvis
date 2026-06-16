import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Play, Pause, RotateCcw, Award, CheckCircle, Clock, Trash2 } from 'lucide-react';
import type { FocusSession } from '../types/game';

interface StudyTrackerProps {
  sessions: FocusSession[];
  onAddSession: (session: FocusSession) => void;
  onDeleteSession: (id: string) => void;
  playSound: (type: 'click' | 'xp' | 'levelup' | 'success' | 'purchase') => void;
}

export const StudyTracker: React.FC<StudyTrackerProps> = ({
  sessions,
  onAddSession,
  onDeleteSession,
  playSound,
}) => {
  // Mode: Timer vs Manual
  const [activeTab, setActiveTab] = useState<'timer' | 'manual'>('timer');

  // Pomodoro Timer State
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalDuration, setTotalDuration] = useState(25 * 60); // in seconds
  const [category, setCategory] = useState<'Estudio' | 'Trabajo' | 'Diseño' | 'Otro'>('Estudio');
  const [focusName, setFocusName] = useState('');
  
  // Manual Logging State
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState<'Estudio' | 'Trabajo' | 'Diseño' | 'Otro'>('Estudio');
  const [manualDuration, setManualDuration] = useState(60); // in minutes

  const timerRef = useRef<any>(null);

  // Sound and Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete!
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => {
    playSound('click');
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    playSound('click');
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setTotalDuration(25 * 60);
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    playSound('levelup');

    const durationMins = Math.floor(totalDuration / 60);
    const xpReward = durationMins * 2;
    const coinsReward = durationMins * 1;

    const newSession: FocusSession = {
      id: Date.now().toString(),
      name: focusName.trim() || `Sesión de ${category}`,
      category,
      duration: durationMins,
      date: new Date().toISOString().split('T')[0],
      xpEarned: xpReward,
      coinsEarned: coinsReward,
    };

    onAddSession(newSession);
    setFocusName('');
    setMinutes(25);
    setSeconds(0);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    playSound('xp');

    const xpReward = manualDuration * 2;
    const coinsReward = manualDuration * 1;

    const newSession: FocusSession = {
      id: Date.now().toString(),
      name: manualName,
      category: manualCategory,
      duration: manualDuration,
      date: new Date().toISOString().split('T')[0],
      xpEarned: xpReward,
      coinsEarned: coinsReward,
    };

    onAddSession(newSession);
    setManualName('');
    setManualDuration(60);
  };

  const getPercentage = () => {
    const currentSeconds = minutes * 60 + seconds;
    const passed = totalDuration - currentSeconds;
    return (passed / totalDuration) * 100;
  };

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="font-orbitron text-xl font-bold tracking-wider text-cyan-400 text-glow-cyan flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            PORTAL MENTAL // FOCUS Y ESTUDIO
          </h2>
          <p className="text-xs font-share text-cyan-300/60 mt-1">
            CONTRÓLA EL TIEMPO DE ENFOQUE PARA GANAR XP Y CRÉDITOS DEL OASIS
          </p>
        </div>

        <div className="flex bg-cyan-950/40 border border-cyan-500/30 rounded p-0.5 text-xs font-share font-bold uppercase">
          <button
            onClick={() => { playSound('click'); setActiveTab('timer'); }}
            className={`px-3 py-1 cursor-pointer transition-all ${activeTab === 'timer' ? 'bg-cyan-500 text-black' : 'text-cyan-400'}`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('manual'); }}
            className={`px-3 py-1 cursor-pointer transition-all ${activeTab === 'manual' ? 'bg-cyan-500 text-black' : 'text-cyan-400'}`}
          >
            Manual
          </button>
        </div>
      </div>

      {/* Main Focus Area */}
      {activeTab === 'timer' ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Pomodoro Timer HUD Card */}
          <div className="lg:col-span-3 glass-panel glow-cyan rounded-xl p-6 flex flex-col items-center justify-center border border-cyan-500/20 text-center relative overflow-hidden crt-flicker">
            <div className="absolute top-2 left-2 text-[9px] font-share text-cyan-400/40">SYS_TIMER_V2.0</div>
            
            {/* Countdown Clock */}
            <div className="relative my-6 w-52 h-52 flex flex-col items-center justify-center rounded-full border-4 border-cyan-950/60 bg-black/40 glow-pulse">
              {/* Radial HUD Indicator (Simulated with simple ring border or relative circles) */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-pink-500/50"
                style={{ transform: `rotate(${getPercentage() * 3.6}deg)`, transition: 'transform 0.5s linear' }}
              ></div>

              <div className="font-orbitron text-5xl font-black text-pink-500 text-glow-pink">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="font-share text-[11px] text-cyan-400 tracking-widest mt-1.5 uppercase">
                {isActive ? 'Módulo Activo' : 'En Pausa'}
              </div>
            </div>

            {/* Config & Input */}
            <div className="w-full max-w-sm space-y-4 mb-4">
              <input
                type="text"
                value={focusName}
                onChange={(e) => setFocusName(e.target.value)}
                placeholder="¿En qué estás trabajando? (ej. Estudiar React)"
                disabled={isActive}
                className="w-full px-3 py-2 bg-cyan-950/20 disabled:opacity-50 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-xs text-center focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />

              <div className="grid grid-cols-4 gap-1.5 text-xs font-share">
                {(['Estudio', 'Trabajo', 'Diseño', 'Otro'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    disabled={isActive}
                    onClick={() => { playSound('click'); setCategory(cat); }}
                    className={`py-1 rounded border transition-all cursor-pointer ${
                      category === cat
                        ? 'bg-pink-950/40 border-pink-500 text-pink-400 font-bold'
                        : 'bg-cyan-950/10 border-cyan-500/20 text-cyan-400/70 hover:border-cyan-400/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={toggleTimer}
                className={`px-5 py-2.5 rounded font-share font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-amber-600/20 border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black' 
                    : 'bg-emerald-600/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                }`}
              >
                {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isActive ? 'Pausar' : 'Iniciar'}
              </button>

              <button
                onClick={resetTimer}
                className="px-5 py-2.5 rounded bg-zinc-800/40 border border-zinc-600 text-zinc-400 hover:bg-zinc-700 hover:text-white font-share font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reiniciar
              </button>
            </div>
          </div>

          {/* Quick HUD Guide Info */}
          <div className="lg:col-span-2 glass-panel rounded-xl p-5 border border-cyan-500/25 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-orbitron font-bold text-sm text-cyan-400 tracking-wider">DIAGNOSTICO DE ENFOQUE</h3>
              <p className="text-xs font-share text-gray-300 leading-relaxed">
                El método Pomodoro te ayuda a mantener el cerebro al 100%. Trabaja durante <span className="text-pink-400 font-bold">25 minutos</span> sin distracciones, luego toma un breve descanso de <span className="text-cyan-400 font-bold">5 minutos</span>.
              </p>
              
              <div className="border-t border-cyan-500/10 pt-4 space-y-2.5 text-xs font-share">
                <div className="flex justify-between">
                  <span className="text-cyan-400/70">TASA DE XP:</span>
                  <span className="text-emerald-400 font-bold">+2 XP / Minuto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400/70">TASA DE MONEDAS:</span>
                  <span className="text-emerald-400 font-bold">+1 Moneda / Minuto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400/70">RECOMPENSA COMPLETA:</span>
                  <span className="text-pink-400 font-bold">+50 XP / +25 Monedas</span>
                </div>
              </div>
            </div>

            <div className="bg-cyan-950/20 border border-cyan-500/10 p-3.5 rounded mt-4 flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-share text-cyan-300">
                <span className="text-pink-400 font-bold">CONSEJO DE JARVIS:</span> "Parzival, recuerda silenciar el comunicador móvil y cerrar otras pestañas del OASIS para maximizar la eficiencia."
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Manual Focus Logger */
        <form onSubmit={handleManualSubmit} className="glass-panel glow-pink rounded-xl p-6 border border-pink-500/25 space-y-4 max-w-xl mx-auto crt-flicker">
          <h3 className="font-orbitron font-bold text-sm text-pink-500 tracking-wider">REGISTRO MANUAL DE ENFOQUE</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1.5">Descripción de la Tarea</label>
              <input
                type="text"
                required
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="ej. Estudié 2 horas de Programación, Trabajé en Diseño Web"
                className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1.5">Categoría</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-sm focus:outline-none"
                >
                  <option value="Estudio">📚 Estudio / Aprendizaje</option>
                  <option value="Trabajo">💼 Trabajo / Proyectos</option>
                  <option value="Diseño">🎨 Diseño / Creativo</option>
                  <option value="Otro">🔧 Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1.5">Duración (Minutos)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-orbitron font-black text-xs rounded tracking-widest uppercase transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer border-0 shadow-md"
          >
            <Award className="w-4 h-4 text-yellow-300" />
            REGISTRAR ENFOQUE (+{manualDuration * 2} XP / +{manualDuration * 1} MONEDAS)
          </button>
        </form>
      )}

      {/* History */}
      <div className="space-y-4">
        <h3 className="font-share text-xs font-bold text-gray-400 uppercase tracking-widest">
          Bitácoras de Enfoque Recientes
        </h3>

        {sessions.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center text-gray-500 font-share border border-cyan-500/10">
            No se han registrado sesiones de enfoque en esta sesión.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((s) => (
              <div key={s.id} className="glass-panel border border-cyan-500/25 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-400 transition-all glow-pulse">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-orbitron font-bold text-cyan-200 text-glow-cyan text-sm">{s.name}</h4>
                      <span className="text-[9px] bg-pink-950/40 border border-pink-500/30 px-2 py-0.5 rounded text-pink-400 font-share tracking-wider uppercase mt-1 inline-block">
                        {s.category}
                      </span>
                    </div>
                    <button
                      onClick={() => { playSound('click'); onDeleteSession(s.id); }}
                      className="text-gray-500 hover:text-pink-500 cursor-pointer p-1 rounded hover:bg-pink-950/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-4 font-share text-xs text-cyan-300/80 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-500" />
                      {s.duration} min
                    </span>
                    <span className="text-gray-400">Fecha: {s.date}</span>
                  </div>
                </div>

                <div className="border-t border-cyan-500/10 pt-2.5 mt-2 flex justify-between text-[10px] font-share text-emerald-400 font-bold">
                  <span>Datos Procesados:</span>
                  <span>+{s.xpEarned} XP / +{s.coinsEarned} Monedas</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

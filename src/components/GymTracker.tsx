import React, { useState } from 'react';
import { Dumbbell, Plus, Trash2, Calendar, Clock, Trophy } from 'lucide-react';
import type { Workout, Exercise } from '../types/game';


interface GymTrackerProps {
  workouts: Workout[];
  onAddWorkout: (workout: Workout) => void;
  onDeleteWorkout: (id: string) => void;
  playSound: (type: 'click' | 'xp' | 'levelup' | 'success' | 'purchase') => void;
}

export const GymTracker: React.FC<GymTrackerProps> = ({
  workouts,
  onAddWorkout,
  onDeleteWorkout,
  playSound,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'Fuerza' | 'Cardio' | 'Combate' | 'Otro'>('Fuerza');
  const [duration, setDuration] = useState(60);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState({ name: '', sets: 3, reps: 10, weight: 0 });
  const [showForm, setShowForm] = useState(false);

  const handleAddExercise = () => {
    if (!currentExercise.name.trim()) return;
    playSound('click');
    setExercises([...exercises, { ...currentExercise }]);
    setCurrentExercise({ name: '', sets: 3, reps: 10, weight: 0 });
  };

  const handleRemoveExercise = (index: number) => {
    playSound('click');
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playSound('xp');

    const newWorkout: Workout = {
      id: Date.now().toString(),
      name,
      type,
      exercises,
      duration,
      date: new Date().toISOString().split('T')[0],
      xpEarned: 100,
      coinsEarned: 50,
    };

    onAddWorkout(newWorkout);
    setName('');
    setType('Fuerza');
    setDuration(60);
    setExercises([]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="font-orbitron text-xl font-bold tracking-wider text-cyan-400 text-glow-cyan flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-cyan-400 animate-pulse" />
            PORTAL FÍSICO // ENTRENAMIENTO
          </h2>
          <p className="text-xs font-share text-cyan-300/60 mt-1">
            CONVIERTE SUDOR EN PUNTOS DE EXPERIENCIA PARA TU AVATAR
          </p>
        </div>
        <button
          onClick={() => { playSound('click'); setShowForm(!showForm); }}
          className="px-3 py-1.5 font-share font-bold text-xs bg-cyan-950/40 border border-cyan-500 hover:bg-cyan-500 hover:text-black rounded transition-all cursor-pointer uppercase tracking-wider"
        >
          {showForm ? 'Cancelar' : 'Registrar Entreno'}
        </button>
      </div>

      {/* Workout Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel glow-cyan rounded-xl p-5 border border-cyan-500/20 space-y-4 max-w-2xl mx-auto crt-flicker">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1.5">Nombre del Entrenamiento</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Pecho y Tríceps, Trote 5K, Kickboxing"
                className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1.5">Tipo de Disciplina</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-sm focus:outline-none"
              >
                <option value="Fuerza">🏋️ Fuerza / Musculación</option>
                <option value="Cardio">🏃 Cardio / Resistencia</option>
                <option value="Combate">🥊 Combate / Artes Marciales</option>
                <option value="Otro">🥋 Otro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1.5">Duración (Minutos)</label>
              <input
                type="number"
                required
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          {/* Exercise Builder (For Strength or custom tracking) */}
          {type === 'Fuerza' && (
            <div className="border-t border-cyan-500/20 pt-4 space-y-3">
              <h3 className="text-xs font-orbitron font-bold text-pink-500 tracking-wider">CREADOR DE TABLA DE EJERCICIOS</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Nombre Ejercicio (ej. Press Banca)"
                  value={currentExercise.name}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                  className="sm:col-span-2 px-3 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs focus:outline-none focus:border-cyan-400"
                />
                <div className="grid grid-cols-3 gap-1 sm:col-span-2">
                  <input
                    type="number"
                    placeholder="Sets"
                    value={currentExercise.sets || ''}
                    onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) || 0 })}
                    className="px-2 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs text-center"
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={currentExercise.reps || ''}
                    onChange={(e) => setCurrentExercise({ ...currentExercise, reps: parseInt(e.target.value) || 0 })}
                    className="px-2 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs text-center"
                  />
                  <input
                    type="number"
                    placeholder="Kg"
                    value={currentExercise.weight || ''}
                    onChange={(e) => setCurrentExercise({ ...currentExercise, weight: parseFloat(e.target.value) || 0 })}
                    className="px-2 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs text-center"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddExercise}
                className="py-1 px-3 bg-pink-950/30 border border-pink-500/40 hover:bg-pink-500 hover:text-black rounded text-xs font-share font-bold text-pink-400 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Ejercicio
              </button>

              {/* Added Exercises List */}
              {exercises.length > 0 && (
                <div className="bg-cyan-950/10 rounded border border-cyan-500/10 p-3">
                  <ul className="space-y-2 font-share text-xs">
                    {exercises.map((ex, index) => (
                      <li key={index} className="flex justify-between items-center border-b border-cyan-500/5 pb-1 last:border-b-0">
                        <span className="text-cyan-200">{ex.name}</span>
                        <div className="flex items-center gap-4 text-cyan-400">
                          <span>{ex.sets}x{ex.reps} ({ex.weight} kg)</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(index)}
                            className="text-pink-500 hover:text-pink-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-orbitron font-black text-sm rounded shadow-lg transition-all tracking-widest hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer border-0"
          >
            <Trophy className="w-4 h-4 text-yellow-300" />
            SUBIR LOGS AL OASIS (+100 XP / +50 MONEDAS)
          </button>
        </form>
      )}

      {/* History List */}
      <div className="space-y-4">
        <h3 className="font-share text-xs font-bold text-gray-400 uppercase tracking-widest">
          Bitácoras de Entrenamiento Recientes
        </h3>

        {workouts.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center text-gray-500 font-share border border-cyan-500/10">
            No se han detectado datos de entrenamiento en la sesión actual de Parzival.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workouts.map((w) => (
              <div key={w.id} className="glass-panel border border-cyan-500/25 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-400 transition-all glow-pulse">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-orbitron font-bold text-cyan-200 text-glow-cyan text-sm">{w.name}</h4>
                      <span className="text-[10px] bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded text-cyan-400 font-share tracking-wider uppercase mt-1 inline-block">
                        {w.type}
                      </span>
                    </div>
                    <button
                      onClick={() => { playSound('click'); onDeleteWorkout(w.id); }}
                      className="text-gray-500 hover:text-pink-500 cursor-pointer p-1 rounded hover:bg-pink-950/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-4 font-share text-xs text-cyan-300/80 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                      {w.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-500" />
                      {w.duration} min
                    </span>
                  </div>

                  {w.exercises && w.exercises.length > 0 && (
                    <div className="border-t border-cyan-500/10 pt-2.5 mt-2 bg-cyan-950/10 p-2.5 rounded">
                      <div className="text-[10px] font-share text-gray-400 uppercase tracking-wider mb-1.5">Ejercicios Registrados:</div>
                      <ul className="space-y-1 font-share text-xs">
                        {w.exercises.map((ex, i) => (
                          <li key={i} className="flex justify-between text-cyan-200/90">
                            <span>• {ex.name}</span>
                            <span className="text-cyan-400/90">{ex.sets}x{ex.reps} @ {ex.weight} kg</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="border-t border-cyan-500/10 pt-3 mt-3 flex justify-between text-[11px] font-share text-emerald-400 font-bold">
                  <span>Recompensa Reclamada:</span>
                  <span>+{w.xpEarned} XP / +{w.coinsEarned} Monedas</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

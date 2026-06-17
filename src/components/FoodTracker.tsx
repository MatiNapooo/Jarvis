import React, { useState } from 'react';
import { Sparkles, Trash2, Coffee } from 'lucide-react';
import type { Meal, DailyWater } from '../types/game';
import { getLocalDateString } from '../utils/date';


interface FoodTrackerProps {
  meals: Meal[];
  waterLogs: DailyWater[];
  onAddMeal: (meal: Meal) => void;
  onDeleteMeal: (id: string) => void;
  onUpdateWater: (amountMl: number) => void;
  onResetWater: () => void;
  playSound: (type: 'click' | 'xp' | 'levelup' | 'success' | 'purchase') => void;
}

export const FoodTracker: React.FC<FoodTrackerProps> = ({
  meals,
  waterLogs,
  onAddMeal,
  onDeleteMeal,
  onUpdateWater,
  onResetWater,
  playSound,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack'>('Desayuno');
  const [calories, setCalories] = useState(400);
  const [protein, setProtein] = useState(20);
  const [carbs, setCarbs] = useState(40);
  const [fats, setFats] = useState(10);

  const todayStr = getLocalDateString();
  const todayMeals = meals.filter(m => m.date === todayStr);

  const totalCalories = todayMeals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = todayMeals.reduce((acc, curr) => acc + curr.protein, 0);
  const totalCarbs = todayMeals.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalFats = todayMeals.reduce((acc, curr) => acc + curr.fats, 0);

  // Water calculations
  const todayWaterLog = waterLogs.find(w => w.date === todayStr);
  const currentWater = todayWaterLog ? todayWaterLog.amountMl : 0;
  const waterGoal = 2000; // 2 Liters default

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playSound('xp');

    const newMeal: Meal = {
      id: Date.now().toString(),
      name,
      type,
      calories,
      protein,
      carbs,
      fats,
      date: todayStr,
      xpEarned: 30,
    };

    onAddMeal(newMeal);
    setName('');
    setCalories(400);
    setProtein(20);
    setCarbs(40);
    setFats(10);
    setShowForm(false);
  };

  const handleAddWater = (ml: number) => {
    playSound('xp');
    onUpdateWater(ml);
  };

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="font-orbitron text-xl font-bold tracking-wider text-cyan-400 text-glow-cyan flex items-center gap-2">
            <Coffee className="w-5 h-5 text-cyan-400 animate-pulse" />
            REPLICADOR DE ALIMENTOS // FUEL DEPOT
          </h2>
          <p className="text-xs font-share text-cyan-300/60 mt-1">
            CONTROLA TUS ENTRADAS NUTRICIONALES PARA OPTIMIZAR TU RENDIMIENTO
          </p>
        </div>
        <button
          onClick={() => { playSound('click'); setShowForm(!showForm); }}
          className="px-3 py-1.5 font-share font-bold text-xs bg-cyan-950/40 border border-cyan-500 hover:bg-cyan-500 hover:text-black rounded transition-all cursor-pointer uppercase tracking-wider"
        >
          {showForm ? 'Cancelar' : 'Loguear Comida'}
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel border border-cyan-500/20 rounded-xl p-3 text-center">
          <div className="text-[10px] font-share text-cyan-400/70 uppercase">Calorías Hoy</div>
          <div className="text-xl font-orbitron font-bold text-cyan-300 text-glow-cyan mt-1">{totalCalories} kcal</div>
        </div>
        <div className="glass-panel border border-cyan-500/20 rounded-xl p-3 text-center">
          <div className="text-[10px] font-share text-pink-400/70 uppercase">Proteínas</div>
          <div className="text-xl font-orbitron font-bold text-pink-400 text-glow-pink mt-1">{totalProtein}g</div>
        </div>
        <div className="glass-panel border border-cyan-500/20 rounded-xl p-3 text-center">
          <div className="text-[10px] font-share text-emerald-400/70 uppercase">Carbohidratos</div>
          <div className="text-xl font-orbitron font-bold text-emerald-400 text-glow-green mt-1">{totalCarbs}g</div>
        </div>
        <div className="glass-panel border border-cyan-500/20 rounded-xl p-3 text-center">
          <div className="text-[10px] font-share text-yellow-400/70 uppercase">Grasas</div>
          <div className="text-xl font-orbitron font-bold text-yellow-400 text-glow-gold mt-1">{totalFats}g</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Water Tracker */}
        <div className="lg:col-span-2 glass-panel glow-cyan rounded-xl p-5 border border-cyan-500/25 flex flex-col justify-between items-center text-center relative overflow-hidden crt-flicker">
          <div className="absolute top-2 left-2 text-[9px] font-share text-cyan-400/40">SYS_HYDRO_v1.0</div>
          
          <h3 className="font-orbitron font-bold text-xs text-cyan-400 tracking-wider mb-4">REGENERADOR DE AGUA</h3>
          
          {/* Water Cylinder Meter */}
          <div className="w-24 h-40 bg-cyan-950/25 border-2 border-cyan-500/40 rounded-xl relative overflow-hidden flex flex-col justify-end mb-4">
            {/* Water Fill */}
            <div 
              className="bg-cyan-500/50 w-full transition-all duration-700 ease-out absolute bottom-0 left-0"
              style={{ height: `${Math.min((currentWater / waterGoal) * 100, 100)}%` }}
            >
              {/* Wave effect */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-cyan-400/70 animate-pulse"></div>
            </div>
            
            {/* Overlay value */}
            <div className="absolute inset-0 flex flex-col justify-center items-center font-orbitron text-sm font-black text-white text-shadow">
              <span>{currentWater} ml</span>
              <span className="text-[9px] font-share text-cyan-200/60 uppercase">de {waterGoal} ml</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <div className="flex gap-1.5 justify-center">
              <button
                onClick={() => handleAddWater(250)}
                className="py-1.5 px-3 bg-cyan-950/40 border border-cyan-500 text-cyan-400 rounded text-xs font-share font-bold cursor-pointer transition-all hover:bg-cyan-500 hover:text-black"
              >
                +250ml
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="py-1.5 px-3 bg-cyan-950/40 border border-cyan-500 text-cyan-400 rounded text-xs font-share font-bold cursor-pointer transition-all hover:bg-cyan-500 hover:text-black"
              >
                +500ml
              </button>
              <button
                onClick={() => handleAddWater(1000)}
                className="py-1.5 px-3 bg-cyan-950/40 border border-cyan-500 text-cyan-400 rounded text-xs font-share font-bold cursor-pointer transition-all hover:bg-cyan-500 hover:text-black"
              >
                +1.0L
              </button>
            </div>
            
            <button
              onClick={() => { playSound('click'); onResetWater(); }}
              className="text-[10px] font-share text-gray-500 hover:text-pink-500 tracking-wider uppercase cursor-pointer"
            >
              Reiniciar Registro Diario
            </button>

            {currentWater >= waterGoal && (
              <div className="mt-2 py-1 px-3 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded text-[11px] font-share font-semibold">
                ¡Objetivo de hidratación alcanzado! (+50 XP)
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Meals list */}
        <div className="lg:col-span-3 space-y-4">
          {showForm && (
            <form onSubmit={handleMealSubmit} className="glass-panel glow-cyan rounded-xl p-5 border border-cyan-500/20 space-y-4 crt-flicker">
              <h3 className="font-orbitron font-bold text-xs text-cyan-400 tracking-wider">REGISTRO DE INGESTA</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1">Nombre del Alimento</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ej. Licuado proteico, Ensalada César, etc."
                    className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1">Categoría</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-sm focus:outline-none"
                  >
                    <option value="Desayuno">🍳 Desayuno</option>
                    <option value="Almuerzo">🍽️ Almuerzo</option>
                    <option value="Cena">🍲 Cena</option>
                    <option value="Snack">🍌 Snack / Merienda</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-share text-cyan-400/80 uppercase mb-1">Calorías</label>
                  <input
                    type="number"
                    required
                    value={calories}
                    onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-share text-pink-400/80 uppercase mb-1">Proteínas (g)</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={protein}
                    onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-share text-emerald-400/80 uppercase mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={carbs}
                    onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-share text-yellow-400/80 uppercase mb-1">Grasas (g)</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={fats}
                    onChange={(e) => setFats(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs text-center"
                  />
                </div>
              </div>

              {/* Recent meals autofill */}
              {(() => {
                const uniquePastMeals = meals.reduce((acc: Meal[], curr) => {
                  if (!acc.some(m => m.name.toLowerCase() === curr.name.toLowerCase())) {
                    acc.push(curr);
                  }
                  return acc;
                }, []).slice(0, 6);

                if (uniquePastMeals.length === 0) return null;

                return (
                  <div className="border-t border-cyan-500/10 pt-3 mt-1">
                    <span className="block text-[10px] font-share text-cyan-400/80 uppercase mb-2">Replicar Comidas Frecuentes (Autocompletar):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {uniquePastMeals.map(pm => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => {
                            setName(pm.name);
                            setCalories(pm.calories);
                            setProtein(pm.protein);
                            setCarbs(pm.carbs);
                            setFats(pm.fats);
                            setType(pm.type);
                            playSound('click');
                          }}
                          className="px-2 py-1 bg-cyan-950/20 hover:bg-cyan-500 hover:text-black border border-cyan-500/25 text-[10px] font-share text-cyan-300 rounded transition-all cursor-pointer hover:border-cyan-400"
                        >
                          {pm.name} ({pm.calories} kcal)
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-orbitron font-black text-xs rounded tracking-widest uppercase transition-all hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer border-0 animate-pulse hover:animate-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                LOGUEAR ALIMENTO EN EL OASIS (+30 XP)
              </button>
            </form>
          )}

          <h4 className="font-share text-xs font-bold text-gray-400 uppercase tracking-widest">
            Combustibles Replicados Hoy
          </h4>

          {todayMeals.length === 0 ? (
            <div className="glass-panel rounded-xl p-8 text-center text-gray-500 font-share border border-cyan-500/10">
              No se han registrado comidas en la fecha actual.
            </div>
          ) : (
            <div className="space-y-2">
              {todayMeals.map((m) => (
                <div key={m.id} className="glass-panel border border-cyan-500/15 rounded-xl p-3.5 flex justify-between items-center hover:border-cyan-400 transition-all glow-pulse">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron font-bold text-cyan-200 text-sm">{m.name}</span>
                      <span className="text-[9px] bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded text-cyan-400 font-share tracking-wider uppercase">
                        {m.type}
                      </span>
                    </div>
                    
                    <div className="flex gap-3 font-share text-[11px] text-cyan-300/80 mt-1">
                      <span>{m.calories} kcal</span>
                      <span className="text-gray-500">|</span>
                      <span>P: {m.protein}g</span>
                      <span>C: {m.carbs}g</span>
                      <span>G: {m.fats}g</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-share font-semibold text-emerald-400 bg-emerald-950/20 px-2 py-1 rounded">
                      +{m.xpEarned} XP
                    </span>
                    <button
                      onClick={() => { playSound('click'); onDeleteMeal(m.id); }}
                      className="text-gray-500 hover:text-pink-500 cursor-pointer p-1 rounded hover:bg-pink-950/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

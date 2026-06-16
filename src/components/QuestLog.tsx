import React, { useState } from 'react';
import { Shield, Trash2, CheckSquare, Square, Star, Calendar, Bell } from 'lucide-react';
import type { Quest } from '../types/game';
import { CustomDatePicker, CustomTimePicker } from './CustomDateTimePicker';



interface QuestLogProps {
  quests: Quest[];
  onAddQuest: (quest: Quest) => void;
  onToggleQuest: (id: string) => void;
  onDeleteQuest: (id: string) => void;
  playSound: (type: 'click' | 'xp' | 'levelup' | 'success' | 'purchase') => void;
}

export const QuestLog: React.FC<QuestLogProps> = ({
  quests,
  onAddQuest,
  onToggleQuest,
  onDeleteQuest,
  playSound,
}) => {
  const [activeTab, setActiveTab] = useState<'Diaria' | 'Historia'>('Diaria');
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(50);
  const [coinsReward, setCoinsReward] = useState(20);
  const [dueDate, setDueDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  const filteredQuests = quests.filter(q => q.type === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    playSound('success');

    const newQuest: Quest = {
      id: Date.now().toString(),
      title,
      description,
      type: activeTab,
      completed: false,
      dateAdded: new Date().toISOString().split('T')[0],
      xpReward,
      coinsReward,
      dueDate: dueDate || undefined,
      reminderTime: reminderTime || undefined,
    };

    onAddQuest(newQuest);
    setTitle('');
    setDescription('');
    setXpReward(50);
    setCoinsReward(20);
    setDueDate('');
    setReminderTime('');
    setShowForm(false);
  };

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      playSound('xp');
    } else {
      playSound('click');
    }
    onToggleQuest(id);
  };

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="font-orbitron text-xl font-bold tracking-wider text-cyan-400 text-glow-cyan flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
            TABLÓN DE MISIONES // QUEST LOG
          </h2>
          <p className="text-xs font-share text-cyan-300/60 mt-1">
            COMPLETA TUS DEBERES Y CONTRATOS DIARIOS PARA GANAR BOTÍN Y PUNTOS
          </p>
        </div>

        <button
          onClick={() => { playSound('click'); setShowForm(!showForm); }}
          className="px-3 py-1.5 font-share font-bold text-xs bg-cyan-950/40 border border-cyan-500 hover:bg-cyan-500 hover:text-black rounded transition-all cursor-pointer uppercase tracking-wider"
        >
          {showForm ? 'Cancelar' : 'Añadir Misión'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-cyan-950/40 border border-cyan-500/30 rounded p-0.5 text-xs font-share font-bold uppercase w-fit">
        <button
          onClick={() => { playSound('click'); setActiveTab('Diaria'); }}
          className={`px-4 py-1.5 cursor-pointer transition-all ${activeTab === 'Diaria' ? 'bg-cyan-50 text-black' : 'text-cyan-400'}`}
        >
          Misiones Diarias
        </button>
        <button
          onClick={() => { playSound('click'); setActiveTab('Historia'); }}
          className={`px-4 py-1.5 cursor-pointer transition-all ${activeTab === 'Historia' ? 'bg-cyan-50 text-black' : 'text-cyan-400'}`}
        >
          Misiones de Historia (Épicas)
        </button>
      </div>

      {/* Add Quest Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel glow-cyan rounded-xl p-5 border border-cyan-500/20 space-y-4 max-w-xl mx-auto crt-flicker">
          <h3 className="font-orbitron font-bold text-xs text-cyan-400 tracking-wider">AÑADIR CONTRATO AL SISTEMA</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1">Título de la Misión</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej. Estudiar inglés, Limpiar habitación, Entrenar piernas"
                className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-share text-cyan-400 uppercase tracking-widest mb-1">Detalle / Notas de Apoyo</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ingresa los detalles para completarla o recordatorios importantes..."
                rows={2}
                className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/30 rounded focus:border-cyan-400 text-cyan-100 font-share text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-share text-cyan-400/80 uppercase mb-1">XP Recompensa</label>
                <input
                  type="number"
                  required
                  min="5"
                  value={xpReward}
                  onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-share text-cyan-400/80 uppercase mb-1">Monedas Recompensa</label>
                <input
                  type="number"
                  required
                  min="5"
                  value={coinsReward}
                  onChange={(e) => setCoinsReward(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-cyan-950/20 border border-cyan-500/30 rounded text-cyan-100 font-share text-xs text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-share text-cyan-400/80 uppercase mb-1">Fecha Límite (Opcional)</label>
                <CustomDatePicker
                  value={dueDate || ''}
                  onChange={setDueDate}
                />
              </div>
              <div>
                <label className="block text-[10px] font-share text-cyan-400/80 uppercase mb-1">Hora Alarma (Opcional)</label>
                <CustomTimePicker
                  value={reminderTime || ''}
                  onChange={setReminderTime}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-orbitron font-black text-xs rounded tracking-widest uppercase transition-all hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer border-0"
          >
            AÑADIR A LA BASE DE DATOS
          </button>
        </form>
      )}

      {/* Quests Display */}
      <div className="space-y-3 max-w-3xl">
        {filteredQuests.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center text-gray-500 font-share border border-cyan-500/10">
            No hay misiones activas en esta categoría.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredQuests.map((q) => (
              <div 
                key={q.id} 
                className={`glass-panel border rounded-xl p-4 flex justify-between items-center transition-all ${
                  q.completed 
                    ? 'border-emerald-500/30 bg-emerald-950/5 opacity-60' 
                    : activeTab === 'Diaria' 
                    ? 'border-cyan-500/20 hover:border-cyan-400' 
                    : 'border-pink-500/25 hover:border-pink-400'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 mr-4">
                  <button
                    onClick={() => handleToggle(q.id, q.completed)}
                    className="mt-0.5 text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer shrink-0"
                  >
                    {q.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 text-glow-green" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div>
                    <h4 className={`font-orbitron font-bold text-sm leading-tight ${
                      q.completed ? 'line-through text-gray-500' : 'text-cyan-100 text-glow-cyan'
                    }`}>
                      {q.title}
                    </h4>
                    {q.description && (
                      <p className={`text-xs font-share mt-1 leading-relaxed ${
                        q.completed ? 'text-gray-600' : 'text-cyan-300/70'
                      }`}>
                        {q.description}
                      </p>
                    )}

                    {/* Meta Info (Due date / Alarm) */}
                    <div className="flex gap-3 text-[10px] font-share mt-2 text-cyan-400/50">
                      {q.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-cyan-500" />
                          Límite: {q.dueDate}
                        </span>
                      )}
                      {q.reminderTime && (
                        <span className="flex items-center gap-1">
                          <Bell className="w-3 h-3 text-pink-500" />
                          Alarma: {q.reminderTime} hs
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right shrink-0">
                    <div className="text-xs font-share font-black text-emerald-400 flex items-center gap-1 justify-end">
                      <Star className="w-3.5 h-3.5 text-yellow-400" />
                      +{q.xpReward} XP
                    </div>
                    <div className="text-[10px] font-share text-yellow-400 font-bold">
                      +{q.coinsReward} Monedas
                    </div>
                  </div>

                  <button
                    onClick={() => { playSound('click'); onDeleteQuest(q.id); }}
                    className="text-gray-500 hover:text-pink-500 cursor-pointer p-1 rounded hover:bg-pink-950/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

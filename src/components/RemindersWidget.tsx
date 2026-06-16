import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Plus, Square, Trash2 } from 'lucide-react';
import type { Reminder } from '../types/game';
import { CustomDatePicker, CustomTimePicker } from './CustomDateTimePicker';


interface RemindersWidgetProps {
  reminders: Reminder[];
  onAddReminder: (text: string, date: string, time: string) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  playSound: (type: 'click' | 'xp' | 'levelup' | 'success' | 'purchase') => void;
}

export const RemindersWidget: React.FC<RemindersWidgetProps> = ({
  reminders,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  playSound,
}) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    playSound('click');
    if ('Notification' in window) {
      const resp = await Notification.requestPermission();
      setPermission(resp);
      if (resp === 'granted') {
        new Notification("JARVIS", {
          body: "Sincronización de notificaciones del OASIS completada.",
          icon: "/icon-192.png"
        });
      }
    } else {
      alert("Tu dispositivo o navegador no soporta notificaciones de escritorio/PWA.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !time) return;

    playSound('success');
    onAddReminder(text, date, time);
    setText('');
    setTime('');
  };

  const activeReminders = reminders.filter(r => !r.completed);

  return (
    <div className="glass-panel glow-pink rounded-xl p-4 flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] max-h-[700px] w-full border border-pink-500/25 relative overflow-hidden crt-flicker">
      <div className="absolute top-2 right-2 text-[9px] font-share text-pink-500/40">SYS_ALERTS_V1.1</div>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-pink-500/20 mb-3 text-xs font-share text-pink-400 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-pink-500 animate-pulse" />
          <span>Recordatorios & Alarmas</span>
        </div>
        
        {/* Notification Permission Indicator */}
        <button
          onClick={requestNotificationPermission}
          className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 border cursor-pointer transition-all ${
            permission === 'granted'
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
              : 'bg-yellow-950/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500 hover:text-black'
          }`}
          title="Configurar Notificaciones"
        >
          {permission === 'granted' ? (
            <>Alerta Activa</>
          ) : (
            <>
              <BellOff className="w-3 h-3" /> Solicitar Alertas
            </>
          )}
        </button>
      </div>

      {/* Permission warning */}
      {permission !== 'granted' && (
        <div 
          onClick={requestNotificationPermission}
          className="mb-3 p-2 bg-yellow-950/20 border border-yellow-500/30 rounded text-[10px] font-share text-yellow-400 leading-normal cursor-pointer hover:bg-yellow-950/40"
        >
          ⚠️ Alertas del teléfono desactivadas. Haz clic aquí para permitir que JARVIS te envíe notificaciones.
        </div>
      )}

      {/* Add form */}
      <form onSubmit={handleSubmit} className="space-y-2.5 mb-4 border-b border-pink-500/10 pb-4">
        <input
          type="text"
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Qué debo recordarte? (ej. Tomar proteína)"
          className="w-full px-3 py-1.5 bg-pink-950/10 border border-pink-500/20 rounded text-pink-100 font-share text-xs placeholder-pink-500/40 focus:outline-none focus:border-pink-400 transition-all"
        />

        <div className="grid grid-cols-2 gap-2">
          <CustomDatePicker
            value={date}
            onChange={setDate}
          />
          <CustomTimePicker
            value={time}
            onChange={setTime}
          />
        </div>

        <button
          type="submit"
          className="w-full py-1.5 bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 border-0 rounded text-white font-share font-bold text-xs uppercase cursor-pointer flex items-center justify-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Programar Alerta
        </button>
      </form>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 font-share pr-1">
        {activeReminders.length === 0 ? (
          <div className="text-center text-gray-600 py-8 text-xs leading-relaxed">
            No hay recordatorios pendientes.<br/>¡Agenda uno arriba!
          </div>
        ) : (
          activeReminders.map((r) => (
            <div 
              key={r.id} 
              className="p-2.5 bg-pink-950/10 border border-pink-500/15 rounded flex justify-between items-center hover:border-pink-500/40 transition-all"
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1 mr-2">
                <button
                  onClick={() => onToggleReminder(r.id)}
                  className="mt-0.5 text-pink-400 hover:text-pink-300 transition-all cursor-pointer shrink-0"
                >
                  <Square className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-pink-100 leading-tight break-words">{r.text}</p>
                  <div className="flex gap-2 text-[9px] text-pink-400/50 mt-1">
                    <span>{r.date}</span>
                    <span>•</span>
                    <span>{r.time} hs</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded" title="Recompensa por completar">
                  +{r.xpReward} XP
                </span>
                <button
                  onClick={() => { playSound('click'); onDeleteReminder(r.id); }}
                  className="text-gray-500 hover:text-pink-400 cursor-pointer p-1 rounded hover:bg-pink-950/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

// --- CUSTOM DATE PICKER ---
interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  minDate?: string;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  minDate
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Parse current selected date
  const parsedDate = value ? new Date(value + 'T00:00:00') : new Date();
  
  // Calendar viewport state
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth());
  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());

  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    }
  }, [value, isOpen]);

  // Calendar Math
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    let day = new Date(year, month, 1).getDay();
    // Convert to Monday-first: 0 = Mon, 6 = Sun
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const renderDays = () => {
    const daysCount = getDaysInMonth(viewMonth, viewYear);
    const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const cells: React.ReactNode[] = [];

    // Empty cells for leading days
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of current month
    for (let day = 1; day <= daysCount; day++) {
      const formattedMonth = String(viewMonth + 1).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      const cellDateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;
      
      const isSelected = value === cellDateStr;
      const isToday = todayStr === cellDateStr;
      
      let isDisabled = false;
      if (minDate && cellDateStr < minDate) {
        isDisabled = true;
      }

      cells.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={isDisabled}
          onClick={() => handleSelectDay(day)}
          className={`p-2 text-center rounded font-share text-xs cursor-pointer transition-all border ${
            isDisabled 
              ? 'text-gray-600 border-transparent cursor-default'
              : isSelected
              ? 'bg-pink-500 text-white border-pink-500 font-bold text-glow-pink'
              : isToday
              ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-cyan-200/80 hover:bg-cyan-950/30 hover:border-cyan-500/35'
          }`}
        >
          {day}
        </button>
      );
    }

    return cells;
  };

  const getDisplayValue = () => {
    if (!value) return '--/--/----';
    const parts = value.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <div className="w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-3 py-2 bg-pink-950/15 hover:bg-pink-950/25 border border-pink-500/30 hover:border-pink-500/60 rounded text-pink-100 font-share text-xs focus:outline-none transition-all text-left cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-pink-500" />
          {getDisplayValue()}
        </span>
        <span className="text-[10px] text-pink-500 font-bold uppercase select-none">Elegir</span>
      </button>

      {/* Screen Centered Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          {/* Modal Backdrop closer */}
          <div className="absolute inset-0 cursor-default" onClick={() => setIsOpen(false)}></div>
          
          <div className="w-full max-w-[290px] bg-[#070a13] border-2 border-cyan-500/70 rounded-xl p-4 relative text-white crt-flicker shadow-2xl shadow-cyan-500/20 z-10">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-2.5 right-2.5 text-cyan-400 hover:text-pink-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header controls */}
            <div className="flex justify-between items-center mb-3 pr-6">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 text-cyan-400 hover:bg-cyan-950/40 border border-cyan-500/30 rounded cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-orbitron font-bold text-xs text-cyan-300 tracking-wider">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 text-cyan-400 hover:bg-cyan-950/40 border border-cyan-500/30 rounded cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 text-center font-orbitron font-extrabold text-[10px] text-cyan-400/50 mb-2 border-b border-cyan-500/10 pb-1">
              {WEEK_DAYS.map((d, idx) => (
                <div key={`wd-${idx}`}>{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 min-h-[140px] items-center">
              {renderDays()}
            </div>

            {/* Footer buttons */}
            <div className="flex gap-2 justify-between border-t border-cyan-500/10 pt-2.5 mt-3 text-xs font-share">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  onChange(todayStr);
                  setIsOpen(false);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-pink-500 hover:text-pink-400 font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// --- CUSTOM TIME PICKER ---
interface CustomTimePickerProps {
  value: string; // HH:MM
  onChange: (val: string) => void;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Split selected time
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');

  useEffect(() => {
    if (value && value.includes(':')) {
      const parts = value.split(':');
      setSelectedHour(parts[0]);
      setSelectedMinute(parts[1]);
    }
  }, [value, isOpen]);

  const handleSelectTime = (h: string, m: string) => {
    setSelectedHour(h);
    setSelectedMinute(m);
    onChange(`${h}:${m}`);
  };

  const handleConfirm = () => {
    onChange(`${selectedHour}:${selectedMinute}`);
    setIsOpen(false);
  };

  const hoursList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutesList = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  return (
    <div className="w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-3 py-2 bg-pink-950/15 hover:bg-pink-950/25 border border-pink-500/30 hover:border-pink-500/60 rounded text-pink-100 font-share text-xs focus:outline-none transition-all text-left cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-pink-500" />
          {value ? `${value} hs` : '--:-- hs'}
        </span>
        <span className="text-[10px] text-pink-500 font-bold uppercase select-none">Elegir</span>
      </button>

      {/* Screen Centered Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          {/* Modal Backdrop closer */}
          <div className="absolute inset-0 cursor-default" onClick={() => setIsOpen(false)}></div>
          
          <div className="w-full max-w-[210px] bg-[#070a13] border-2 border-cyan-500/70 rounded-xl p-4 relative text-white crt-flicker shadow-2xl shadow-cyan-500/20 z-10">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-2.5 right-2.5 text-cyan-400 hover:text-pink-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center font-orbitron text-[11px] font-bold text-cyan-400 tracking-wider mb-2.5 pb-1.5 border-b border-cyan-500/10">
              SELECCIONAR HORA
            </div>

            <div className="flex gap-2.5 h-36">
              {/* Hours dial */}
              <div className="flex-1 overflow-y-auto pr-1 border-r border-cyan-500/10 scroll-cyan">
                <div className="text-[9px] font-orbitron text-cyan-500/60 uppercase text-center mb-1 sticky top-0 bg-[#070a13] py-0.5">Hs</div>
                {hoursList.map(h => {
                  const isActive = h === selectedHour;
                  return (
                    <button
                      key={`h-${h}`}
                      type="button"
                      onClick={() => handleSelectTime(h, selectedMinute)}
                      className={`w-full py-1 text-center font-share text-xs rounded transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-pink-500 text-white font-bold text-glow-pink' 
                          : 'text-cyan-300 hover:bg-cyan-950/20'
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>

              {/* Minutes dial */}
              <div className="flex-1 overflow-y-auto pr-1 scroll-cyan">
                <div className="text-[9px] font-orbitron text-cyan-500/60 uppercase text-center mb-1 sticky top-0 bg-[#070a13] py-0.5">Min</div>
                {minutesList.map(m => {
                  const isActive = m === selectedMinute;
                  return (
                    <button
                      key={`m-${m}`}
                      type="button"
                      onClick={() => handleSelectTime(selectedHour, m)}
                      className={`w-full py-1 text-center font-share text-xs rounded transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-pink-500 text-white font-bold text-glow-pink' 
                          : 'text-cyan-300 hover:bg-cyan-950/20'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full mt-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-bold text-xs tracking-widest rounded flex items-center justify-center gap-1 cursor-pointer border-0"
            >
              <Check className="w-3.5 h-3.5" /> CONFIRMAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

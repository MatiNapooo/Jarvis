import { useState, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Dumbbell, 
  Cpu, 
  Coffee, 
  Shield, 
  ShoppingBag, 
  Flame, 
  Coins, 
  Download, 
  Upload, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Menu,
  X
} from 'lucide-react';

import { useSound } from './hooks/useSound';
import type { 
  PlayerStats, 
  Workout, 
  FocusSession, 
  Meal, 
  DailyWater, 
  Quest, 
  SystemLog, 
  OasisData,
  Reminder
} from './types/game';


import { JarvisTerminal } from './components/JarvisTerminal';
import { GymTracker } from './components/GymTracker';
import { StudyTracker } from './components/StudyTracker';
import { FoodTracker } from './components/FoodTracker';
import { QuestLog } from './components/QuestLog';
import { OasisShop } from './components/OasisShop';
import { LevelUpModal } from './components/LevelUpModal';
import { RemindersWidget } from './components/RemindersWidget';


// Initial default quests
const DEFAULT_QUESTS = (): Quest[] => [
  {
    id: 'd1',
    title: 'Entrenamiento en el Portal Físico',
    description: 'Completa una rutina en el gimnasio y registra tus ejercicios.',
    type: 'Diaria',
    completed: false,
    dateAdded: new Date().toISOString().split('T')[0],
    xpReward: 100,
    coinsReward: 50,
  },
  {
    id: 'd2',
    title: 'Sesión de Enfoque Mental',
    description: 'Completa al menos 25 minutos de estudio o trabajo usando el Pomodoro.',
    type: 'Diaria',
    completed: false,
    dateAdded: new Date().toISOString().split('T')[0],
    xpReward: 50,
    coinsReward: 25,
  },
  {
    id: 'd3',
    title: 'Regenerador Hidrológico',
    description: 'Alcanza la meta diaria de 2 litros de agua (2000 ml).',
    type: 'Diaria',
    completed: false,
    dateAdded: new Date().toISOString().split('T')[0],
    xpReward: 50,
    coinsReward: 15,
  },
  {
    id: 's1',
    title: 'Obtener la Llave de Cobre',
    description: 'Desbloquea la Llave de Cobre en el Mercado del OASIS.',
    type: 'Historia',
    completed: false,
    dateAdded: new Date().toISOString().split('T')[0],
    xpReward: 300,
    coinsReward: 150,
  },
  {
    id: 's2',
    title: 'Coleccionar las Tres Llaves',
    description: 'Compra la Llave de Cobre, Jade y Cristal en la tienda del OASIS.',
    type: 'Historia',
    completed: false,
    dateAdded: new Date().toISOString().split('T')[0],
    xpReward: 1000,
    coinsReward: 500,
  }
];

// Initial logs
const INITIAL_LOGS = (): SystemLog[] => [
  {
    id: 'init-1',
    text: "SISTEMA OPERATIVO OASIS v4.5 INICIALIZADO...",
    type: 'system',
    timestamp: new Date().toLocaleTimeString(),
  },
  {
    id: 'init-2',
    text: "Hola, Parzival. Soy JARVIS, tu asistente personal en el OASIS.\nHe sincronizado tus bitácoras de entrenamiento, estudio y misiones de hoy.\n¿Qué módulo deseas cargar? Escribe /help en la consola si necesitas una lista de comandos.",
    type: 'jarvis',
    timestamp: new Date().toLocaleTimeString(),
  }
];

const getTitleForLevel = (lvl: number): string => {
  if (lvl >= 30) return "Heredero de Halliday";
  if (lvl >= 20) return "Arquitecto del OASIS";
  if (lvl >= 15) return "Líder de los High Five";
  if (lvl >= 10) return "Buscador de las Llaves";
  if (lvl >= 5) return "Gunter Veterano";
  return "Cazador de Huevos (Gunter)";
};

export default function App() {
  const { enabled: soundEnabled, toggleSound, playSound } = useSound();
  const [activeTab, setActiveTab] = useState<string>('terminal');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // States
  const [stats, setStats] = useState<PlayerStats>({
    level: 1,
    xp: 0,
    coins: 0,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    title: 'Cazador de Huevos (Gunter)',
    inventory: [],
  });
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [waterLogs, setWaterLogs] = useState<DailyWater[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Level Up Modal state
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [justLeveledUpTo, setJustLeveledUpTo] = useState<number>(1);

  // Load database from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('oasis_jarvis_data');
    if (savedData) {
      try {
        const data: OasisData = JSON.parse(savedData);
        if (data.stats) setStats(data.stats);
        if (data.workouts) setWorkouts(data.workouts);
        if (data.focusSessions) setFocusSessions(data.focusSessions);
        if (data.meals) setMeals(data.meals);
        if (data.waterLogs) setWaterLogs(data.waterLogs);
        if (data.quests) {
          setQuests(data.quests);
        } else {
          setQuests(DEFAULT_QUESTS());
        }
        if (data.logs) {
          setLogs(data.logs);
        } else {
          setLogs(INITIAL_LOGS());
        }
        if (data.reminders) {
          setReminders(data.reminders);
        } else {
          setReminders([]);
        }
      } catch (e) {
        console.error("Error loading local data:", e);
        initializeDefaultData();
      }
    } else {
      initializeDefaultData();
    }
  }, []);


  // Sync / Streak check on load
  useEffect(() => {
    if (stats.lastActiveDate) {
      const todayStr = new Date().toISOString().split('T')[0];
      if (stats.lastActiveDate !== todayStr) {
        // Calculate days difference
        const lastDate = new Date(stats.lastActiveDate);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let newStreak = stats.streak;
        if (diffDays === 1) {
          // Consecutiv day!
          newStreak += 1;
          // Add system log
          const streakLog: SystemLog = {
            id: `streak-${Date.now()}`,
            text: `¡Doble recompensa diaria! Racha activa de ${newStreak} días en el OASIS.`,
            type: 'system',
            timestamp: new Date().toLocaleTimeString(),
          };
          setLogs(prev => [...prev, streakLog]);
        } else if (diffDays > 1) {
          // Streak broken
          newStreak = 1;
          const streakBreakLog: SystemLog = {
            id: `streak-${Date.now()}`,
            text: `Conexión perdida por varios días. Racha de días consecutivos reseteada a 1.`,
            type: 'system',
            timestamp: new Date().toLocaleTimeString(),
          };
          setLogs(prev => [...prev, streakBreakLog]);
        }

        setStats(prev => ({
          ...prev,
          streak: newStreak,
          lastActiveDate: todayStr
        }));
      }
    }
  }, [stats.lastActiveDate]);

  // Save changes to local storage
  const saveData = (
    newStats: PlayerStats,
    newWorkouts: Workout[],
    newSessions: FocusSession[],
    newMeals: Meal[],
    newWaters: DailyWater[],
    newQuests: Quest[],
    newLogs: SystemLog[],
    newReminders: Reminder[] = reminders
  ) => {
    const data: OasisData = {
      stats: newStats,
      workouts: newWorkouts,
      focusSessions: newSessions,
      meals: newMeals,
      waterLogs: newWaters,
      quests: newQuests,
      inventory: newStats.inventory,
      logs: newLogs,
      reminders: newReminders
    };
    localStorage.setItem('oasis_jarvis_data', JSON.stringify(data));
  };

  const initializeDefaultData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const initialStats: PlayerStats = {
      level: 1,
      xp: 0,
      coins: 50, // Start with some pocket change!
      streak: 1,
      lastActiveDate: todayStr,
      title: 'Cazador de Huevos (Gunter)',
      inventory: [],
    };
    setStats(initialStats);
    setWorkouts([]);
    setFocusSessions([]);
    setMeals([]);
    setWaterLogs([]);
    setQuests(DEFAULT_QUESTS());
    setLogs(INITIAL_LOGS());
    setReminders([]);

    const data: OasisData = {
      stats: initialStats,
      workouts: [],
      focusSessions: [],
      meals: [],
      waterLogs: [],
      quests: DEFAULT_QUESTS(),
      inventory: [],
      logs: INITIAL_LOGS(),
      reminders: []
    };
    localStorage.setItem('oasis_jarvis_data', JSON.stringify(data));
  };


  // Gamification: XP addition logic
  const addXp = (amount: number, customStats?: PlayerStats) => {
    setStats(prev => {
      const currentStats = customStats || prev;
      let newXp = currentStats.xp + amount;
      let newLevel = currentStats.level;
      let leveledUp = false;

      // XP needed formula: Level * 100 + 100
      let xpNeeded = newLevel * 100 + 100;
      while (newXp >= xpNeeded) {
        newXp -= xpNeeded;
        newLevel += 1;
        xpNeeded = newLevel * 100 + 100;
        leveledUp = true;
      }

      const updatedStats = {
        ...currentStats,
        level: newLevel,
        xp: newXp,
        title: getTitleForLevel(newLevel),
      };

      if (leveledUp) {
        setJustLeveledUpTo(newLevel);
        setShowLevelUpModal(true);
        // Play level up sound after small delay
        setTimeout(() => playSound('levelup'), 300);

        // Add Jarvis system log
        const levelUpLog: SystemLog = {
          id: `levelup-${Date.now()}`,
          text: `🚨 SUBIDA DE NIVEL: Parzival ha alcanzado el Nivel ${newLevel} (${getTitleForLevel(newLevel)}). ¡Monedas adicionales otorgadas!`,
          type: 'system',
          timestamp: new Date().toLocaleTimeString(),
        };
        setLogs(prevLogs => [...prevLogs, levelUpLog]);

        // Reward extra coins on level up
        updatedStats.coins += newLevel * 20;
      }

      saveData(updatedStats, workouts, focusSessions, meals, waterLogs, quests, logs);
      return updatedStats;
    });
  };

  const addCoins = (amount: number) => {
    setStats(prev => {
      const updated = {
        ...prev,
        coins: prev.coins + amount
      };
      saveData(updated, workouts, focusSessions, meals, waterLogs, quests, logs);
      return updated;
    });
  };

  // Log Gym Workouts
  const handleAddWorkout = (w: Workout) => {
    const newWorkouts = [w, ...workouts];
    setWorkouts(newWorkouts);
    
    // Add terminal log
    const gymLog: SystemLog = {
      id: `gym-${Date.now()}`,
      text: `🏋️ PORTAL FÍSICO: Registrado entreno "${w.name}" (${w.duration} min). Recompensas del OASIS procesadas.`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    };
    const newLogs = [...logs, gymLog];
    setLogs(newLogs);

    // Add Coins
    const updatedStats = {
      ...stats,
      coins: stats.coins + w.coinsEarned
    };
    setStats(updatedStats);

    // Add XP
    addXp(w.xpEarned, updatedStats);

    // Also auto-complete gym daily quest if active
    const newQuests = quests.map(q => {
      if (q.id === 'd1' && !q.completed) {
        // Quest Completed! Add quest rewards
        setTimeout(() => {
          addXp(q.xpReward);
          addCoins(q.coinsReward);
          setLogs(prev => [...prev, {
            id: `quest-complete-d1-${Date.now()}`,
            text: `🏆 MISIÓN DIARIA COMPLETADA: "Entrenamiento en el Portal Físico" (+${q.xpReward} XP / +${q.coinsReward} Monedas)`,
            type: 'system',
            timestamp: new Date().toLocaleTimeString(),
          }]);
        }, 100);
        return { ...q, completed: true, dateCompleted: new Date().toISOString().split('T')[0] };
      }
      return q;
    });
    setQuests(newQuests);

    saveData(updatedStats, newWorkouts, focusSessions, meals, waterLogs, newQuests, newLogs);
  };

  const handleDeleteWorkout = (id: string) => {
    const newWorkouts = workouts.filter(w => w.id !== id);
    setWorkouts(newWorkouts);
    saveData(stats, newWorkouts, focusSessions, meals, waterLogs, quests, logs);
  };

  // Log Focus Sessions
  const handleAddFocus = (s: FocusSession) => {
    const newSessions = [s, ...focusSessions];
    setFocusSessions(newSessions);

    // Add log
    const studyLog: SystemLog = {
      id: `focus-${Date.now()}`,
      text: `🧠 PORTAL MENTAL: Registrada sesión de enfoque "${s.name}" (${s.duration} min). +${s.xpEarned} XP y +${s.coinsEarned} Monedas reclamadas.`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    };
    const newLogs = [...logs, studyLog];
    setLogs(newLogs);

    // Add Coins
    const updatedStats = {
      ...stats,
      coins: stats.coins + s.coinsEarned
    };
    setStats(updatedStats);

    // Add XP
    addXp(s.xpEarned, updatedStats);

    // Check Daily Quest Focus
    const newQuests = quests.map(q => {
      if (q.id === 'd2' && !q.completed) {
        setTimeout(() => {
          addXp(q.xpReward);
          addCoins(q.coinsReward);
          setLogs(prev => [...prev, {
            id: `quest-complete-d2-${Date.now()}`,
            text: `🏆 MISIÓN DIARIA COMPLETADA: "Sesión de Enfoque Mental" (+${q.xpReward} XP / +${q.coinsReward} Monedas)`,
            type: 'system',
            timestamp: new Date().toLocaleTimeString(),
          }]);
        }, 100);
        return { ...q, completed: true, dateCompleted: new Date().toISOString().split('T')[0] };
      }
      return q;
    });
    setQuests(newQuests);

    saveData(updatedStats, workouts, newSessions, meals, waterLogs, newQuests, newLogs);
  };

  const handleDeleteFocus = (id: string) => {
    const newSessions = focusSessions.filter(s => s.id !== id);
    setFocusSessions(newSessions);
    saveData(stats, workouts, newSessions, meals, waterLogs, quests, logs);
  };

  // Log Meals
  const handleAddMeal = (m: Meal) => {
    const newMeals = [m, ...meals];
    setMeals(newMeals);

    // Add log
    const mealLog: SystemLog = {
      id: `meal-${Date.now()}`,
      text: `🍳 REPLICADOR: Replicada comida "${m.name}" (${m.calories} kcal). +${m.xpEarned} XP.`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    };
    const newLogs = [...logs, mealLog];
    setLogs(newLogs);

    // Add XP
    addXp(m.xpEarned);

    saveData(stats, workouts, focusSessions, newMeals, waterLogs, quests, newLogs);
  };

  const handleDeleteMeal = (id: string) => {
    const newMeals = meals.filter(m => m.id !== id);
    setMeals(newMeals);
    saveData(stats, workouts, focusSessions, newMeals, waterLogs, quests, logs);
  };

  // Log Water Intake
  const handleUpdateWater = (amountMl: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let newWaters = [...waterLogs];
    const index = newWaters.findIndex(w => w.date === todayStr);

    let updatedAmount = amountMl;
    if (index !== -1) {
      newWaters[index].amountMl += amountMl;
      updatedAmount = newWaters[index].amountMl;
    } else {
      newWaters.push({ date: todayStr, amountMl });
    }
    setWaterLogs(newWaters);

    // Log
    const waterLog: SystemLog = {
      id: `water-${Date.now()}`,
      text: `💧 HIDRATACIÓN: Consumidos +${amountMl} ml de agua. Hidratación total hoy: ${updatedAmount} ml.`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    };
    const newLogs = [...logs, waterLog];
    setLogs(newLogs);

    // Add XP (small amount for logging water)
    addXp(10);

    // Check Hydration Daily Quest (2000 ml goal)
    let newQuests = quests;
    if (updatedAmount >= 2000) {
      newQuests = quests.map(q => {
        if (q.id === 'd3' && !q.completed) {
          setTimeout(() => {
            addXp(q.xpReward);
            addCoins(q.coinsReward);
            setLogs(prev => [...prev, {
              id: `quest-complete-d3-${Date.now()}`,
              text: `🏆 MISIÓN DIARIA COMPLETADA: "Regenerador Hidrológico" (+${q.xpReward} XP / +${q.coinsReward} Monedas)`,
              type: 'system',
              timestamp: new Date().toLocaleTimeString(),
            }]);
          }, 100);
          return { ...q, completed: true, dateCompleted: new Date().toISOString().split('T')[0] };
        }
        return q;
      });
      setQuests(newQuests);
    }

    saveData(stats, workouts, focusSessions, meals, newWaters, newQuests, newLogs);
  };

  const handleResetWater = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newWaters = waterLogs.map(w => {
      if (w.date === todayStr) {
        return { ...w, amountMl: 0 };
      }
      return w;
    });
    setWaterLogs(newWaters);
    saveData(stats, workouts, focusSessions, meals, newWaters, quests, logs);
  };

  // Quests management
  const handleAddQuest = (q: Quest) => {
    const newQuests = [q, ...quests];
    setQuests(newQuests);

    const questLog: SystemLog = {
      id: `quest-add-${Date.now()}`,
      text: `🛡️ QUEST LOG: Añadida nueva misión "${q.title}" de tipo ${q.type}.`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    };
    const newLogs = [...logs, questLog];
    setLogs(newLogs);

    saveData(stats, workouts, focusSessions, meals, waterLogs, newQuests, newLogs);
  };

  const handleToggleQuest = (id: string) => {
    let xpAwarded = 0;
    let coinsAwarded = 0;
    let questTitle = '';
    
    const newQuests = quests.map(q => {
      if (q.id === id) {
        const nextState = !q.completed;
        if (nextState) {
          xpAwarded = q.xpReward;
          coinsAwarded = q.coinsReward;
          questTitle = q.title;
        }
        return { 
          ...q, 
          completed: nextState, 
          dateCompleted: nextState ? new Date().toISOString().split('T')[0] : undefined 
        };
      }
      return q;
    });
    setQuests(newQuests);

    let updatedStats = stats;
    let newLogs = logs;

    if (xpAwarded > 0) {
      // Award rewards
      updatedStats = {
        ...stats,
        coins: stats.coins + coinsAwarded
      };
      setStats(updatedStats);
      
      const compLog: SystemLog = {
        id: `quest-comp-${Date.now()}`,
        text: `🏆 CONTRATO COMPLETADO: "${questTitle}" (+${xpAwarded} XP / +${coinsAwarded} Monedas)`,
        type: 'system',
        timestamp: new Date().toLocaleTimeString(),
      };
      newLogs = [...logs, compLog];
      setLogs(newLogs);
      
      addXp(xpAwarded, updatedStats);
    }

    saveData(updatedStats, workouts, focusSessions, meals, waterLogs, newQuests, newLogs);
  };

  const handleDeleteQuest = (id: string) => {
    const newQuests = quests.filter(q => q.id !== id);
    setQuests(newQuests);
    saveData(stats, workouts, focusSessions, meals, waterLogs, newQuests, logs);
  };

  // Shop purchase
  const handlePurchaseItem = (id: string, cost: number) => {
    const newInventory = [...stats.inventory, id];
    const updatedStats = {
      ...stats,
      coins: stats.coins - cost,
      inventory: newInventory
    };
    setStats(updatedStats);

    // Terminal log
    const shopLog: SystemLog = {
      id: `shop-${Date.now()}`,
      text: `🛒 MERCADO: Adquirido objeto "${id.replace('_', ' ').toUpperCase()}" por ${cost} Monedas. Objeto añadido a la mochila digital.`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString(),
    };
    const newLogs = [...logs, shopLog];
    setLogs(newLogs);

    // Check Story Quests completion
    const newQuests = quests.map(q => {
      // Key Cobre Story Quest
      if (q.id === 's1' && id === 'copper_key' && !q.completed) {
        setTimeout(() => {
          addXp(q.xpReward);
          addCoins(q.coinsReward);
          setLogs(prev => [...prev, {
            id: `quest-complete-s1-${Date.now()}`,
            text: `🏆 MISIÓN DE HISTORIA COMPLETADA: "Obtener la Llave de Cobre" (+${q.xpReward} XP / +${q.coinsReward} Monedas)`,
            type: 'system',
            timestamp: new Date().toLocaleTimeString(),
          }]);
        }, 100);
        return { ...q, completed: true, dateCompleted: new Date().toISOString().split('T')[0] };
      }
      
      // All Keys check
      if (q.id === 's2' && !q.completed) {
        const hasCopper = newInventory.includes('copper_key');
        const hasJade = newInventory.includes('jade_key');
        const hasCrystal = newInventory.includes('crystal_key');
        
        if (hasCopper && hasJade && hasCrystal) {
          setTimeout(() => {
            addXp(q.xpReward);
            addCoins(q.coinsReward);
            setLogs(prev => [...prev, {
              id: `quest-complete-s2-${Date.now()}`,
              text: `🏆 MISIÓN DE HISTORIA COMPLETADA: "Coleccionar las Tres Llaves" (+${q.xpReward} XP / +${q.coinsReward} Monedas). ¡Has descifrado el OASIS!`,
              type: 'system',
              timestamp: new Date().toLocaleTimeString(),
            }]);
          }, 100);
          return { ...q, completed: true, dateCompleted: new Date().toISOString().split('T')[0] };
        }
      }
      
      return q;
    });
    setQuests(newQuests);

    saveData(updatedStats, workouts, focusSessions, meals, waterLogs, newQuests, newLogs);
  };

  // Reminder handlers
  const handleAddReminder = (text: string, date: string, time: string) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      text,
      date,
      time,
      completed: false,
      notified: false,
      xpReward: 10,
    };
    const newReminders = [newReminder, ...reminders];
    setReminders(newReminders);
    saveData(stats, workouts, focusSessions, meals, waterLogs, quests, logs, newReminders);
  };

  const handleToggleReminder = (id: string) => {
    let xpAwarded = 0;
    let reminderText = '';
    
    const newReminders = reminders.map(r => {
      if (r.id === id) {
        const nextState = !r.completed;
        if (nextState) {
          xpAwarded = r.xpReward;
          reminderText = r.text;
        }
        return { ...r, completed: nextState };
      }
      return r;
    });
    setReminders(newReminders);

    let updatedStats = stats;
    let newLogs = logs;

    if (xpAwarded > 0) {
      playSound('xp');
      
      const compLog: SystemLog = {
        id: `rem-comp-${Date.now()}`,
        text: `⏰ RECORDATORIO COMPLETADO: "${reminderText}" (+${xpAwarded} XP)`,
        type: 'system',
        timestamp: new Date().toLocaleTimeString(),
      };
      newLogs = [...logs, compLog];
      setLogs(newLogs);
      
      // Add XP
      addXp(xpAwarded, updatedStats);
    }

    saveData(updatedStats, workouts, focusSessions, meals, waterLogs, quests, newLogs, newReminders);
  };

  const handleDeleteReminder = (id: string) => {
    const newReminders = reminders.filter(r => r.id !== id);
    setReminders(newReminders);
    saveData(stats, workouts, focusSessions, meals, waterLogs, quests, logs, newReminders);
  };

  const triggerWebNotification = (text: string) => {
    playSound('levelup'); // Play retro chime
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification("JARVIS // Alerta OASIS", {
          body: `Parzival, recuerda: ${text}`,
          icon: "/icon-192.png",
          tag: "oasis-reminder",
          requireInteraction: true
        });
      } catch (err) {
        console.warn("Notification failed:", err);
      }
    }
  };

  // Notification Alarm Check Loop
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      const nowTimeStr = new Date().toTimeString().slice(0, 5); // "HH:MM"

      let notifiedCount = 0;
      const updatedReminders = reminders.map(r => {
        if (!r.completed && !r.notified && r.date === todayStr && r.time <= nowTimeStr) {
          notifiedCount++;
          triggerWebNotification(r.text);
          
          // Add system log
          const alertLog: SystemLog = {
            id: `alert-${Date.now()}-${r.id}`,
            text: `⏰ ALARMA DE JARVIS: "${r.text}"`,
            type: 'system',
            timestamp: new Date().toLocaleTimeString(),
          };
          setLogs(prev => [...prev, alertLog]);
          
          return { ...r, notified: true };
        }
        return r;
      });

      if (notifiedCount > 0) {
        setReminders(updatedReminders);
        saveData(stats, workouts, focusSessions, meals, waterLogs, quests, logs, updatedReminders);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [reminders, stats, workouts, focusSessions, meals, waterLogs, quests, logs]);

  // JSON Backup / Restore exports
  const exportBackup = () => {
    playSound('success');
    const data: OasisData = {
      stats,
      workouts,
      focusSessions,
      meals,
      waterLogs,
      quests,
      inventory: stats.inventory,
      logs,
      reminders
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `jarvis_oasis_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed: OasisData = JSON.parse(event.target?.result as string);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.workouts) setWorkouts(parsed.workouts);
        if (parsed.focusSessions) setFocusSessions(parsed.focusSessions);
        if (parsed.meals) setMeals(parsed.meals);
        if (parsed.waterLogs) setWaterLogs(parsed.waterLogs);
        if (parsed.quests) setQuests(parsed.quests);
        if (parsed.logs) setLogs(parsed.logs);
        if (parsed.reminders) setReminders(parsed.reminders);
        
        // Save
        localStorage.setItem('oasis_jarvis_data', JSON.stringify(parsed));
        playSound('levelup');
        alert("Sincronización de copia de seguridad completada con éxito en el OASIS.");
        setShowSettings(false);
      } catch (err) {
        console.error(err);
        alert("Copia de seguridad ilegible o corrupta.");
      }
    };
  };


  const handleResetAll = () => {
    if (window.confirm("¿Seguro que deseas reiniciar el OASIS? Perderás todo tu nivel, monedas e historial.")) {
      playSound('click');
      initializeDefaultData();
      setShowSettings(false);
      alert("Sistema restaurado a valores de fábrica.");
    }
  };

  // Nav helper
  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  // Navigation tabs config
  const navItems = [
    { id: 'terminal', label: 'Terminal JARVIS', icon: TerminalIcon },
    { id: 'gym', label: 'Portal Físico', icon: Dumbbell },
    { id: 'study', label: 'Portal Mental', icon: Cpu },
    { id: 'food', label: 'Replicador', icon: Coffee },
    { id: 'quests', label: 'Misiones', icon: Shield },
    { id: 'shop', label: 'Mercado', icon: ShoppingBag },
  ];

  // XP calculations for UI
  const xpNeeded = stats.level * 100 + 100;
  const xpPercentage = (stats.xp / xpNeeded) * 100;

  return (
    <div className="min-h-screen flex flex-col cyber-grid text-white relative">
      {/* Level Up Modal */}
      {showLevelUpModal && (
        <LevelUpModal 
          level={justLeveledUpTo} 
          title={getTitleForLevel(justLeveledUpTo)} 
          onClose={() => setShowLevelUpModal(false)} 
        />
      )}

      {/* Main HUD Header */}
      <header className="sticky top-0 z-40 bg-cyber-bg/90 backdrop-blur-md border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between shadow-lg">
        {/* User profile */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => { playSound('click'); setSidebarOpen(!sidebarOpen); }}
            className="md:hidden p-1.5 text-cyan-400 hover:bg-cyan-950/20 border border-cyan-500/20 rounded cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="text-left">
            <h1 className="font-orbitron font-extrabold text-sm md:text-base text-cyan-400 tracking-wider text-glow-cyan m-0 flex items-center gap-1.5">
              <span>JARVIS</span>
              <span className="text-[10px] text-pink-500 px-1.5 py-0.5 border border-pink-500/30 rounded bg-pink-950/15 tracking-widest font-share">
                SYS
              </span>
            </h1>
            <div className="text-[10px] font-share text-cyan-300/60 font-bold uppercase mt-0.5 tracking-wider">
              Gunter: <span className="text-pink-400 font-semibold">{stats.title}</span>
            </div>
          </div>
        </div>

        {/* XP Status bar */}
        <div className="hidden sm:flex flex-col flex-1 max-w-md mx-6">
          <div className="flex justify-between items-baseline text-[10px] font-share text-cyan-400 font-bold tracking-widest mb-1">
            <span>AVATAR: PARZIVAL</span>
            <span>NIVEL {stats.level}</span>
            <span>{stats.xp} / {xpNeeded} XP</span>
          </div>
          <div className="w-full bg-cyan-950/30 border border-cyan-500/40 h-2.5 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Quick HUD Metrics */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => navigateToTab('shop')}
            className="flex items-center gap-1 bg-yellow-950/20 hover:bg-yellow-950/40 border border-yellow-500/30 rounded px-2.5 py-1 text-yellow-400 font-orbitron font-black text-xs md:text-sm tracking-wider cursor-pointer transition-all hover:scale-105"
          >
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            {stats.coins}
          </div>

          <div className="flex items-center gap-1 bg-pink-950/20 border border-pink-500/30 rounded px-2.5 py-1 text-pink-400 font-orbitron font-black text-xs md:text-sm tracking-wider">
            <Flame className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
            {stats.streak}D
          </div>

          {/* Audio toggle & Settings */}
          <div className="flex gap-1">
            <button
              onClick={() => { playSound('click'); toggleSound(); }}
              className="p-1.5 text-cyan-400 hover:bg-cyan-950/20 border border-cyan-500/20 rounded cursor-pointer"
              title="Toggle Audio Feedback"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { playSound('click'); setShowSettings(!showSettings); }}
              className={`p-1.5 border rounded cursor-pointer transition-all ${showSettings ? 'bg-cyan-500 text-black border-cyan-500' : 'text-cyan-400 border-cyan-500/20 hover:bg-cyan-950/20'}`}
              title="OASIS Sync & Settings"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex w-full relative">
        
        {/* Sidebar Nav (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 bg-cyan-950/10 border-r border-cyan-500/20 p-4 gap-2">
          {/* Logo container */}
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="w-24 h-24 rounded-2xl border border-cyan-500/30 p-1 bg-black/40 glow-cyan flex items-center justify-center overflow-hidden">
              <img src="/icon-192.png" alt="OASIS Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <span className="font-orbitron font-extrabold text-[9px] text-pink-500 mt-2.5 tracking-widest uppercase text-glow-pink">OASIS CORE</span>
          </div>

          <div className="text-[10px] font-share font-black text-cyan-400/50 uppercase tracking-widest mb-2 px-3">
            Sectores del OASIS
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { playSound('click'); navigateToTab(item.id); }}
                className={`w-full py-2.5 px-3 rounded-lg font-orbitron font-semibold text-xs tracking-wider flex items-center gap-3 transition-all cursor-pointer text-left border ${
                  isTabActive
                    ? 'bg-cyan-500 text-black border-cyan-500 font-bold shadow-lg shadow-cyan-500/20'
                    : 'text-cyan-400 border-transparent hover:border-cyan-500/40 hover:bg-cyan-950/15'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isTabActive ? 'text-black' : 'text-cyan-400'}`} />
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-35 flex">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            <aside className="w-64 bg-cyber-bg border-r border-cyan-500/40 p-4 flex flex-col gap-2 relative z-10 crt-flicker">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-cyan-500/20">
                <span className="font-orbitron font-black text-cyan-400 text-xs tracking-widest">MENÚ PRINCIPAL</span>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="text-cyan-400 p-1 rounded hover:bg-cyan-950/20 border border-cyan-500/20 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Logo container */}
              <div className="flex flex-col items-center mb-5 mt-2">
                <div className="w-20 h-20 rounded-2xl border border-cyan-500/30 p-1 bg-black/40 glow-cyan flex items-center justify-center overflow-hidden">
                  <img src="/icon-192.png" alt="OASIS Logo" className="w-full h-full object-cover rounded-xl" />
                </div>
                <span className="font-orbitron font-extrabold text-[8px] text-pink-500 mt-2 tracking-widest uppercase text-glow-pink">OASIS CORE</span>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isTabActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { playSound('click'); navigateToTab(item.id); }}
                    className={`w-full py-3 px-3 rounded-lg font-orbitron font-semibold text-xs tracking-wider flex items-center gap-3 transition-all cursor-pointer text-left border ${
                      isTabActive
                        ? 'bg-cyan-500 text-black border-cyan-500 font-bold'
                        : 'text-cyan-400 border-transparent hover:border-cyan-500/40 hover:bg-cyan-950/15'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </aside>
          </div>
        )}

        {/* Core Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-5xl mx-auto w-full pb-24 md:pb-6">
          
          {/* Mobile XP display */}
          <div className="sm:hidden mb-4 p-3 bg-cyan-950/10 border border-cyan-500/20 rounded-xl">
            <div className="flex justify-between items-baseline text-[9px] font-share text-cyan-400 font-bold tracking-widest mb-1.5">
              <span>AVATAR: PARZIVAL</span>
              <span>NIVEL {stats.level}</span>
              <span>{stats.xp}/{xpNeeded} XP</span>
            </div>
            <div className="w-full bg-cyan-950/30 border border-cyan-500/40 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Backup / Restore Overlay Settings Panel */}
          {showSettings ? (
            <div className="glass-panel glow-cyan rounded-xl p-5 border border-cyan-500/25 mb-6 max-w-xl mx-auto crt-flicker">
              <div className="flex justify-between items-center border-b border-cyan-500/20 pb-3 mb-4">
                <h3 className="font-orbitron font-bold text-sm text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                  CONFIGURACIÓN Y BACKUP DE DATOS
                </h3>
                <button 
                  onClick={() => { playSound('click'); setShowSettings(false); }}
                  className="text-xs font-share text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded hover:bg-cyan-500 hover:text-black cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              <div className="space-y-4 font-share text-xs leading-relaxed text-cyan-200">
                <p>
                  Dado que Jarvis opera localmente en tu navegador por privacidad, te recomendamos respaldar tu progreso para evitar pérdidas si borras las cookies del navegador.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={exportBackup}
                    className="py-2.5 px-4 bg-cyan-950/30 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black text-cyan-400 font-bold rounded flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" /> Exportar Backup (JSON)
                  </button>

                  <div className="relative">
                    <input
                      type="file"
                      id="import-file"
                      accept=".json"
                      onChange={importBackup}
                      className="hidden"
                    />
                    <label
                      htmlFor="import-file"
                      className="py-2.5 px-4 bg-pink-950/30 border border-pink-500/40 hover:bg-pink-500 hover:text-black text-pink-400 font-bold rounded flex items-center justify-center gap-2 cursor-pointer transition-all text-center"
                    >
                      <Upload className="w-4 h-4" /> Importar Backup (JSON)
                    </label>
                  </div>
                </div>

                <div className="border-t border-cyan-500/10 pt-4 flex justify-between items-center gap-2">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-black">Restablecer Sistema</span>
                    <p className="text-[10px] text-gray-400/80">Borra todo el progreso de la base de datos de localstorage.</p>
                  </div>
                  <button
                    onClick={handleResetAll}
                    className="py-1.5 px-3 bg-red-950/20 border border-red-500/50 hover:bg-red-600 hover:text-white text-red-400 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Resetear OASIS
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Active Tab Router */}
          {activeTab === 'terminal' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <JarvisTerminal logs={logs} />
              </div>
              <div className="lg:col-span-1">
                <RemindersWidget
                  reminders={reminders}
                  onAddReminder={handleAddReminder}
                  onToggleReminder={handleToggleReminder}
                  onDeleteReminder={handleDeleteReminder}
                  playSound={playSound}
                />
              </div>
            </div>
          )}


          {activeTab === 'gym' && (
            <GymTracker 
              workouts={workouts} 
              onAddWorkout={handleAddWorkout}
              onDeleteWorkout={handleDeleteWorkout}
              playSound={playSound}
            />
          )}

          {activeTab === 'study' && (
            <StudyTracker 
              sessions={focusSessions}
              onAddSession={handleAddFocus}
              onDeleteSession={handleDeleteFocus}
              playSound={playSound}
            />
          )}

          {activeTab === 'food' && (
            <FoodTracker 
              meals={meals}
              waterLogs={waterLogs}
              onAddMeal={handleAddMeal}
              onDeleteMeal={handleDeleteMeal}
              onUpdateWater={handleUpdateWater}
              onResetWater={handleResetWater}
              playSound={playSound}
            />
          )}

          {activeTab === 'quests' && (
            <QuestLog 
              quests={quests}
              onAddQuest={handleAddQuest}
              onToggleQuest={handleToggleQuest}
              onDeleteQuest={handleDeleteQuest}
              playSound={playSound}
            />
          )}

          {activeTab === 'shop' && (
            <OasisShop 
              coins={stats.coins}
              inventory={stats.inventory}
              onPurchaseItem={handlePurchaseItem}
              playSound={playSound}
            />
          )}

        </main>
      </div>

      {/* Sticky Bottom Nav (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cyber-bg/95 backdrop-blur-md border-t border-cyan-500/35 px-2 py-1 flex justify-around items-center shadow-2xl h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isTabActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { playSound('click'); navigateToTab(item.id); }}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                isTabActive
                  ? 'text-pink-500 scale-105'
                  : 'text-cyan-400/70 hover:text-cyan-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-share font-semibold uppercase tracking-wider mt-0.5">
                {item.id === 'terminal' ? 'Jarvis' : item.id === 'study' ? 'Mental' : item.id === 'food' ? 'Fuel' : item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

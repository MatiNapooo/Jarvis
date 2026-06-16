export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number; // in kg or lbs
}

export interface Workout {
  id: string;
  name: string;
  type: 'Fuerza' | 'Cardio' | 'Combate' | 'Otro';
  exercises: Exercise[];
  duration: number; // in minutes
  date: string; // YYYY-MM-DD
  xpEarned: number;
  coinsEarned: number;
}

export interface FocusSession {
  id: string;
  name: string; // e.g. "Estudiando Programación"
  category: 'Estudio' | 'Trabajo' | 'Diseño' | 'Otro';
  duration: number; // in minutes
  date: string; // YYYY-MM-DD
  xpEarned: number;
  coinsEarned: number;
}

export interface Meal {
  id: string;
  name: string;
  type: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  date: string; // YYYY-MM-DD
  xpEarned: number;
}

export interface DailyWater {
  date: string; // YYYY-MM-DD
  amountMl: number; // e.g. 2500
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'Diaria' | 'Historia';
  completed: boolean;
  dateAdded: string; // YYYY-MM-DD
  dateCompleted?: string; // YYYY-MM-DD
  xpReward: number;
  coinsReward: number;
  dueDate?: string; // YYYY-MM-DD
  reminderTime?: string; // HH:MM
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  iconName: string; // Lucide icon identifier
  rarity: 'Común' | 'Raro' | 'Épico' | 'Legendario';
  unlocked: boolean;
}

export interface PlayerStats {
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  title: string;
  inventory: string[]; // List of ShopItem IDs
}

export interface SystemLog {
  id: string;
  text: string;
  type: 'jarvis' | 'parzival' | 'system';
  timestamp: string; // HH:MM:SS
}

export interface Reminder {
  id: string;
  text: string;
  time: string; // HH:MM
  date: string; // YYYY-MM-DD
  completed: boolean;
  notified: boolean;
  xpReward: number;
}

export interface OasisData {
  stats: PlayerStats;
  workouts: Workout[];
  focusSessions: FocusSession[];
  meals: Meal[];
  waterLogs: DailyWater[];
  quests: Quest[];
  inventory: string[];
  logs: SystemLog[];
  reminders?: Reminder[];
}


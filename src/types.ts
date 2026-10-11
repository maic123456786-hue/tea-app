import { PhotoWidgetItem, AnniversaryData } from './constants/assets';

export type { PhotoWidgetItem, AnniversaryData };

export interface Message {
  id: string;
  sender: 'user' | 'tea';
  text: string;
  reasoning?: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
  errorMessage?: string;
  mood?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  color?: string;
}

export interface CalendarEntry {
  date: string; // YYYY-MM-DD
  emoji?: string;
  userNote?: string;
  aiReply?: string;
  updatedAt: number;
  isReplying?: boolean;
}

export interface CalendarAlertPopup {
  id: string;
  date: string;
  message: string;
  timestamp: number;
}

export type ThemePresetKey = 'mint' | 'peach' | 'sakura' | 'lavender' | 'ocean' | 'custom';

export interface ThemeConfig {
  preset: ThemePresetKey;
  primaryColor: string; // Hex color e.g. #10b981
  bubbleOpacity: number; // 30 - 95 (%)
  widgetOpacity: number; // 20 - 90 (%)
}

export interface AppSettings {
  sessionId: number;
  soundEnabled: boolean;
  bubbleStyle: 'cozy' | 'compact';
  userName: string;
  teaRemarkName: string;
  autoScroll: boolean;
  teaAvatar: string;
  userAvatar: string;
  photos: [PhotoWidgetItem, PhotoWidgetItem];
  anniversary: AnniversaryData;
  todos: TodoItem[];
  aiDailyThought: string;
  wallpaper?: string;
  chatWallpaper?: string;
  waterGlasses?: number;
  theme: ThemeConfig;
  teaCurrentMood: string;
  calendarEntries: Record<string, CalendarEntry>;
}

export interface NotificationBanner {
  id: string;
  title: string;
  body: string;
  avatar: string;
  timestamp: number;
}

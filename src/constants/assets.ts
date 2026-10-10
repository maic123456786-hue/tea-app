// Asset paths and fallbacks
export const TEA_AVATAR_PATH = '/src/assets/images/tea_avatar_1791543758222.jpg';
export const USER_AVATAR_PATH = '/src/assets/images/user_avatar_1791543768119.jpg';
export const ALBUM_PHOTO_TEA = '/src/assets/images/album_photo_tea_1791554397395.jpg';
export const ALBUM_PHOTO_SKY = '/src/assets/images/album_photo_sky_1791554413053.jpg';

export interface PhotoWidgetItem {
  id: string;
  url: string;
  title: string;
  date: string;
}

export interface AnniversaryData {
  title: string;
  startDate: string; // YYYY-MM-DD
  note: string;
}

export const PRESET_AVATARS = [
  { id: 'tea-default', name: '薄荷小茶杯 (默认)', url: TEA_AVATAR_PATH, for: 'tea' },
  { id: 'user-cat', name: '薄荷围巾猫 (默认)', url: USER_AVATAR_PATH, for: 'user' },
  { id: 'album-tea', name: '双杯热茶', url: ALBUM_PHOTO_TEA, for: 'both' },
  { id: 'album-sky', name: '梦幻晚霞', url: ALBUM_PHOTO_SKY, for: 'both' },
];

export const THEME_COLOR_PRESETS = [
  { id: 'mint', name: '经典薄荷绿', color: '#10b981', lightBg: '#e8f6ef' },
  { id: 'peach', name: '奶茶暖杏', color: '#f59e0b', lightBg: '#fef3c7' },
  { id: 'sakura', name: '樱花浅粉', color: '#f43f5e', lightBg: '#ffe4e6' },
  { id: 'lavender', name: '薰衣草紫', color: '#8b5cf6', lightBg: '#ede9fe' },
  { id: 'ocean', name: '海盐冰蓝', color: '#06b6d4', lightBg: '#cffafe' },
] as const;

export const AI_MOODS = [
  '🌿 晴朗 (´▽｀)',
  '✨ 欣喜 (๑>ᴗ<๑)',
  '🍃 茶香微甜 ( ˘͈ ᵕ ˘͈ )',
  '🌸 暖呼呼 (*´꒳`*)',
  '🧋 惬意甜度 ٩(๑❛ᴗ❛๑)۶',
  '🤍 听你说呢 (•͈ᴗ•͈)',
  '🍓 软绵绵 (੭ˊ꒳​ˋ)੭',
  '🍵 细细品味 ♨(´ω｀*)',
];

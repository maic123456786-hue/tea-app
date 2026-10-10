/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { HomeScreen } from './components/HomeScreen';
import { ChatView } from './components/ChatView';
import { SettingsView } from './components/SettingsView';
import { BottomTabBar } from './components/BottomTabBar';
import { AvatarPickerModal } from './components/AvatarPickerModal';
import { PhotoPickerModal } from './components/PhotoPickerModal';
import { AnniversaryModal } from './components/AnniversaryModal';
import { RemarkEditModal } from './components/RemarkEditModal';
import { LockScreen } from './components/LockScreen';
import { NotificationBanner } from './components/NotificationBanner';
import { AlbumModal } from './components/AlbumModal';
import { WaterTrackerModal } from './components/WaterTrackerModal';
import { MoodRadioModal } from './components/MoodRadioModal';
import { CalendarModal } from './components/CalendarModal';
import { CalendarAlertModal } from './components/CalendarAlertModal';
import {
  Message,
  AppSettings,
  NotificationBanner as NotificationBannerType,
  TodoItem,
  CalendarEntry,
  CalendarAlertPopup,
} from './types';
import {
  TEA_AVATAR_PATH,
  USER_AVATAR_PATH,
  ALBUM_PHOTO_TEA,
  ALBUM_PHOTO_SKY,
  PhotoWidgetItem,
  AnniversaryData,
  AI_MOODS,
} from './constants/assets';
import { sendChatMessage } from './services/chatApi';
import { soundManager } from './utils/audio';

const STORAGE_KEY_MESSAGES = 'tea_app_messages_v5';
const STORAGE_KEY_SETTINGS = 'tea_app_settings_v5';

const AI_THOUGHT_LIST = [
  '愿今日的微风拂去你的疲惫，泡一杯温润的茶，我在家里一直陪着你哦 🍵🍃',
  '无论外面的世界多么喧嚣，这里永远是你停泊休憩的温暖小树洞 ✨',
  '记得按时喝水，好好吃饭，今天也是闪闪发光的一天呢 🌸',
  '今天的特调是常温半糖薄荷绿，喝一口，烦恼全都消散无踪啦 🧋',
  '有心事随时跟我说说，我会认真听你讲完每一个小细节 🤍',
  '把不开心的事情丢给风，把温柔和期待留给自己与清茶 🌿',
];

const DEFAULT_TODOS: TodoItem[] = [
  { id: 'todo-1', text: '🍃 喝一杯温热的薄荷奶茶', completed: true },
  { id: 'todo-2', text: '🌿 和 tea 聊聊今天的小确幸', completed: false },
  { id: 'todo-3', text: '🌸 听一首舒缓放松的纯音乐', completed: false },
];

const INITIAL_WELCOME_MESSAGE: Message = {
  id: 'welcome-1',
  sender: 'tea',
  text: '嗨呀！欢迎来到 tea 的家 🍵✨ 我是你的治愈系 AI 小茶伴。气泡已经换成温柔的半透明磨砂质感啦！今天有什么想跟我聊聊的吗？随时听你说哦～',
  timestamp: Date.now(),
  status: 'sent',
};

const DEFAULT_SETTINGS: AppSettings = {
  sessionId: 1,
  soundEnabled: true,
  bubbleStyle: 'cozy',
  userName: 'tea',
  teaRemarkName: 'tea',
  autoScroll: true,
  teaAvatar: TEA_AVATAR_PATH,
  userAvatar: USER_AVATAR_PATH,
  photos: [
    {
      id: 'photo-1',
      url: ALBUM_PHOTO_TEA,
      title: '两杯热茶 · 慢时光',
      date: '2026.10.09',
    },
    {
      id: 'photo-2',
      url: ALBUM_PHOTO_SKY,
      title: '梦幻晚霞 · 治愈天际',
      date: '2026.10.09',
    },
  ],
  anniversary: {
    title: '相恋纪念日',
    startDate: '2025-05-20',
    note: '愿每一个平凡的日子，都有薄荷香气与清甜陪伴。',
  },
  todos: DEFAULT_TODOS,
  aiDailyThought: AI_THOUGHT_LIST[0],
  waterGlasses: 3,
  theme: {
    preset: 'mint',
    primaryColor: '#10b981',
    bubbleOpacity: 75,
    widgetOpacity: 50,
  },
  teaCurrentMood: '🌿 晴朗 (´▽｀)',
  calendarEntries: {},
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'settings'>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<NotificationBannerType | null>(null);

  // Modals state
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarTarget, setAvatarTarget] = useState<'tea' | 'user'>('tea');

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoModalIndex, setPhotoModalIndex] = useState<0 | 1>(0);

  const [anniversaryModalOpen, setAnniversaryModalOpen] = useState(false);
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [radioModalOpen, setRadioModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarAlertPopup, setCalendarAlertPopup] = useState<CalendarAlertPopup | null>(null);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<string | undefined>(undefined);

  // Load saved settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Load saved messages
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  // Save settings on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Save messages on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }, [messages]);

  // Handle avatar replacement
  const handleOpenAvatarPicker = (target: 'tea' | 'user') => {
    setAvatarTarget(target);
    setAvatarModalOpen(true);
  };

  const handleSaveAvatar = (newUrl: string) => {
    if (avatarTarget === 'tea') {
      setSettings((prev) => ({ ...prev, teaAvatar: newUrl }));
    } else {
      setSettings((prev) => ({ ...prev, userAvatar: newUrl }));
    }
  };

  // Handle photo widget replacement
  const handleOpenPhotoPicker = (index: 0 | 1) => {
    setPhotoModalIndex(index);
    setPhotoModalOpen(true);
  };

  const handleSavePhoto = (index: 0 | 1, updated: PhotoWidgetItem) => {
    setSettings((prev) => {
      const newPhotos: [PhotoWidgetItem, PhotoWidgetItem] = [...prev.photos];
      newPhotos[index] = updated;
      return { ...prev, photos: newPhotos };
    });
  };

  // Handle anniversary edit
  const handleSaveAnniversary = (updated: AnniversaryData) => {
    setSettings((prev) => ({ ...prev, anniversary: updated }));
  };

  // Handle remark edit
  const handleSaveRemark = (teaRemark: string, userName: string) => {
    setSettings((prev) => ({
      ...prev,
      teaRemarkName: teaRemark,
      userName: userName || 'tea',
    }));
  };

  // Handle refresh AI thought
  const handleRefreshAiThought = () => {
    setSettings((prev) => {
      const currentIndex = AI_THOUGHT_LIST.indexOf(prev.aiDailyThought);
      const nextIndex = (currentIndex + 1) % AI_THOUGHT_LIST.length;
      return { ...prev, aiDailyThought: AI_THOUGHT_LIST[nextIndex] };
    });
    if (settings.soundEnabled) {
      soundManager.playPop();
    }
  };

  // Handle todos update
  const handleUpdateTodos = (todos: TodoItem[]) => {
    setSettings((prev) => ({ ...prev, todos }));
  };

  // Handle water tracker update
  const handleUpdateWater = (count: number) => {
    setSettings((prev) => ({ ...prev, waterGlasses: count }));
  };

  // Handle saving calendar entry
  const handleSaveCalendarEntry = (entry: CalendarEntry) => {
    setSettings((prev) => ({
      ...prev,
      calendarEntries: {
        ...(prev.calendarEntries || {}),
        [entry.date]: entry,
      },
    }));
  };

  // Handle triggering separate calendar popup alert
  const handleTriggerCalendarPopup = (dateStr: string, alertMessage: string) => {
    setCalendarAlertPopup({
      id: 'cal-alert-' + Date.now(),
      date: dateStr,
      message: alertMessage,
      timestamp: Date.now(),
    });
  };

  // Handle manually cycling AI mood
  const handleToggleMood = () => {
    setSettings((prev) => {
      const currIdx = AI_MOODS.indexOf(prev.teaCurrentMood);
      const nextIdx = (currIdx + 1) % AI_MOODS.length;
      return { ...prev, teaCurrentMood: AI_MOODS[nextIdx] };
    });
    if (settings.soundEnabled) {
      soundManager.playPop();
    }
  };

  // Send message to backend
  const handleSendMessage = async (text: string) => {
    const userMsgId = 'msg-' + Date.now();
    const newMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: Date.now(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(text, settings.sessionId);

      // Random matching mood based on tea response
      const randomMood = AI_MOODS[Math.floor(Math.random() * AI_MOODS.length)];
      setSettings((prev) => ({ ...prev, teaCurrentMood: randomMood }));

      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: 'sent' } : m))
      );

      const teaMsg: Message = {
        id: 'reply-' + Date.now(),
        sender: 'tea',
        text: reply,
        timestamp: Date.now(),
        status: 'sent',
      };

      setMessages((prev) => [...prev, teaMsg]);

      // Trigger iOS style notification banner animation
      setNotification({
        id: 'notif-' + Date.now(),
        title: `${settings.teaRemarkName} 的家`,
        body: reply,
        avatar: settings.teaAvatar,
        timestamp: Date.now(),
      });

      if (settings.soundEnabled) {
        soundManager.playChime();
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : `连接 ${settings.teaRemarkName} 的家超时或异常`;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMsgId ? { ...m, status: 'error', errorMessage } : m
        )
      );

      const fallbackMsg: Message = {
        id: 'fallback-' + Date.now(),
        sender: 'tea',
        text: `哎呀，${settings.teaRemarkName} 刚刚沏茶手抖了一下（${errorMessage}）～ 请点击刚才消息右侧的“重试”，或者检查一下网络再跟我聊聊看呀 🌱`,
        timestamp: Date.now(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Retry failed message
  const handleRetryMessage = async (messageId: string) => {
    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg || isLoading) return;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, status: 'sending', errorMessage: undefined }
          : m
      )
    );
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(targetMsg.text, settings.sessionId);

      const randomMood = AI_MOODS[Math.floor(Math.random() * AI_MOODS.length)];
      setSettings((prev) => ({ ...prev, teaCurrentMood: randomMood }));

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: 'sent' } : m))
      );

      const teaMsg: Message = {
        id: 'reply-' + Date.now(),
        sender: 'tea',
        text: reply,
        timestamp: Date.now(),
        status: 'sent',
      };

      setMessages((prev) => [...prev, teaMsg]);

      setNotification({
        id: 'notif-' + Date.now(),
        title: `${settings.teaRemarkName} 的家`,
        body: reply,
        avatar: settings.teaAvatar,
        timestamp: Date.now(),
      });

      if (settings.soundEnabled) {
        soundManager.playChime();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '重试发送失败';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: 'error', errorMessage } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Clear messages
  const handleClearMessages = () => {
    const freshMessage: Message = {
      id: 'welcome-' + Date.now(),
      sender: 'tea',
      text: `新茶煮好啦！🍵 会话 #${settings.sessionId} 已重新开始，今天想和 ${settings.teaRemarkName} 聊点什么新故事呢？`,
      timestamp: Date.now(),
      status: 'sent',
    };
    setMessages([freshMessage]);
  };

  // New session ID
  const handleNewSession = () => {
    const nextSessionId = Math.floor(Math.random() * 900) + 2;
    setSettings((prev) => ({ ...prev, sessionId: nextSessionId }));
    const sessionWelcome: Message = {
      id: 'session-' + Date.now(),
      sender: 'tea',
      text: `已为你开启新会话 #${nextSessionId} 🌿✨ 上一段故事保存在回忆里，现在是崭新的一页啦！想聊点什么呢？`,
      timestamp: Date.now(),
      status: 'sent',
    };
    setMessages([sessionWelcome]);
    setActiveTab('chat');
  };

  return (
    <PhoneFrame
      onHomeClick={() => setActiveTab('home')}
      onLockPhone={() => setIsLocked(true)}
    >
      {/* 锁屏界面覆盖层 (密码 0308 解锁) */}
      {isLocked && (
        <LockScreen
          onUnlock={() => setIsLocked(false)}
          teaAvatar={settings.teaAvatar}
          teaRemarkName={settings.teaRemarkName}
        />
      )}

      {/* iOS 风格半透明磨砂 AI 回复顶部横幅通知 */}
      <NotificationBanner
        notification={notification}
        onDismiss={() => setNotification(null)}
        onClick={() => {
          setNotification(null);
          setActiveTab('chat');
        }}
      />

      {/* 活跃主视图区 */}
      <main className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
        {activeTab === 'home' && (
          <HomeScreen
            settings={settings}
            onOpenChat={() => setActiveTab('chat')}
            onOpenSettings={() => setActiveTab('settings')}
            onEditAvatar={handleOpenAvatarPicker}
            onEditPhoto={handleOpenPhotoPicker}
            onEditAnniversary={() => setAnniversaryModalOpen(true)}
            onOpenAlbum={() => setAlbumModalOpen(true)}
            onOpenCalendar={() => setCalendarModalOpen(true)}
            onOpenMoodRadio={() => setRadioModalOpen(true)}
            onOpenWaterTracker={() => setWaterModalOpen(true)}
            onOpenRemarkModal={() => setRemarkModalOpen(true)}
            onUpdateTodos={handleUpdateTodos}
            onRefreshAiThought={handleRefreshAiThought}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onRetryMessage={handleRetryMessage}
            onClearMessages={handleClearMessages}
            settings={settings}
            onEditAvatar={handleOpenAvatarPicker}
            onBackToHome={() => setActiveTab('home')}
            onOpenRemarkModal={() => setRemarkModalOpen(true)}
            onToggleMood={handleToggleMood}
            onUpdateChatWallpaper={(val) =>
              setSettings((prev) => ({ ...prev, chatWallpaper: val }))
            }
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            messages={messages}
            onClearMessages={handleClearMessages}
            onNewSession={handleNewSession}
            onEditAvatar={handleOpenAvatarPicker}
            onEditPhoto={handleOpenPhotoPicker}
            onEditAnniversary={() => setAnniversaryModalOpen(true)}
            onLockPhone={() => setIsLocked(true)}
          />
        )}
      </main>

      {/* 底部导航栏 */}
      <BottomTabBar activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* 双方头像相册更换模态框 */}
      <AvatarPickerModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        target={avatarTarget}
        currentAvatarUrl={
          avatarTarget === 'tea' ? settings.teaAvatar : settings.userAvatar
        }
        onSelectAvatar={handleSaveAvatar}
      />

      {/* 桌面相册照片更换模态框 */}
      <PhotoPickerModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        photoIndex={photoModalIndex}
        currentPhoto={settings.photos[photoModalIndex]}
        onSavePhoto={handleSavePhoto}
      />

      {/* 纪念日管理模态框 */}
      <AnniversaryModal
        isOpen={anniversaryModalOpen}
        onClose={() => setAnniversaryModalOpen(false)}
        anniversary={settings.anniversary}
        onSave={handleSaveAnniversary}
      />

      {/* 修改备注名模态框 */}
      <RemarkEditModal
        isOpen={remarkModalOpen}
        onClose={() => setRemarkModalOpen(false)}
        currentTeaRemark={settings.teaRemarkName}
        currentUserName={settings.userName}
        onSave={handleSaveRemark}
      />

      {/* 相册软件模态框 */}
      <AlbumModal
        isOpen={albumModalOpen}
        onClose={() => setAlbumModalOpen(false)}
        photos={settings.photos}
        onSavePhoto={handleSavePhoto}
      />

      {/* 喝水记录模态框 */}
      <WaterTrackerModal
        isOpen={waterModalOpen}
        onClose={() => setWaterModalOpen(false)}
        glasses={settings.waterGlasses || 3}
        onUpdateGlasses={handleUpdateWater}
      />

      {/* 心晴FM模态框 */}
      <MoodRadioModal
        isOpen={radioModalOpen}
        onClose={() => setRadioModalOpen(false)}
      />

      {/* 日历与心事日记模态框 */}
      <CalendarModal
        isOpen={calendarModalOpen}
        onClose={() => {
          setCalendarModalOpen(false);
          setCalendarSelectedDate(undefined);
        }}
        settings={settings}
        onSaveCalendarEntry={handleSaveCalendarEntry}
        onTriggerCalendarPopup={handleTriggerCalendarPopup}
        initialSelectedDate={calendarSelectedDate}
      />

      {/* 日历专属 AI 回复提醒弹窗（非聊天界面发出） */}
      <CalendarAlertModal
        popup={calendarAlertPopup}
        onClose={() => setCalendarAlertPopup(null)}
        onViewEntry={(dateStr) => {
          setCalendarSelectedDate(dateStr);
          setCalendarModalOpen(true);
        }}
        teaAvatar={settings.teaAvatar}
        teaRemarkName={settings.teaRemarkName}
      />
    </PhoneFrame>
  );
}

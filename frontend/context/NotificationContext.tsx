'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'pantry' | 'recipe' | 'eco' | 'system' | 'community';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface NotificationPreferences {
  masterNotifications: boolean;
  mealReminders: boolean;
  expiryAlerts: boolean;
  completionNotifications: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isConnected: boolean;
  activeToast: NotificationItem | null;
  preferences: NotificationPreferences;
  updatePreferences: (newPrefs: Partial<NotificationPreferences>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  triggerTestNotification: (title?: string, message?: string, type?: NotificationItem['type']) => Promise<void>;
  dismissToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL 
  || (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000');

const DEFAULT_PREFERENCES: NotificationPreferences = {
  masterNotifications: true,
  mealReminders: true,
  expiryAlerts: true,
  completionNotifications: true,
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mealshare_notif_prefs');
      if (stored) {
        try {
          setPreferences(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const updatePreferences = (newPrefs: Partial<NotificationPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      if (typeof window !== 'undefined') {
        localStorage.setItem('mealshare_notif_prefs', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Fetch initial history once on mount with deduplication
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/notifications`);
        if (res.ok) {
          const data: NotificationItem[] = await res.json();
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const fresh = data.filter((n) => !existingIds.has(n.id));
            return [...fresh, ...prev];
          });
        }
      } catch (err) {
        console.warn('Backend notifications endpoint unavailable, starting with local state.', err);
      }
    };

    fetchHistory();
  }, []);

  // Connect to SSE stream
  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`${BACKEND_URL}/api/notifications/stream`);

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const newNotif: NotificationItem = JSON.parse(event.data);
          
          if (!newNotif || !newNotif.id) return;

          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotif.id || (n.title === newNotif.title && n.message === newNotif.message))) {
              return prev;
            }
            return [newNotif, ...prev];
          });

          // Check user mute preferences before raising live Toast popup
          if (!preferences.masterNotifications) return;
          if (newNotif.type === 'pantry' && !preferences.expiryAlerts) return;
          if (newNotif.type === 'recipe' && !preferences.mealReminders) return;

          // Show Toast popup if unread and not system connection ping
          if (!newNotif.read && newNotif.title !== 'Real-time Stream Connected') {
            setActiveToast(newNotif);
            setTimeout(() => {
              setActiveToast((current) => (current?.id === newNotif.id ? null : current));
            }, 5000);
          }
        } catch (parseErr) {
          console.error('Error parsing SSE event data:', parseErr);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
      };
    } catch (err) {
      console.error('Failed to create EventSource:', err);
    }

    return () => {
      eventSource?.close();
    };
  }, [preferences]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const triggerTestNotification = async (
    title = '🔥 Fresh Recipe Alert!',
    message = '3 new high-protein recipes match your current pantry items.',
    type: NotificationItem['type'] = 'recipe'
  ) => {
    try {
      await fetch(`${BACKEND_URL}/api/notifications/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type, link: '/recipes' }),
      });
    } catch (err) {
      const fallbackNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false,
        link: '/recipes'
      };
      setNotifications((prev) => [fallbackNotif, ...prev]);
      if (preferences.masterNotifications) {
        setActiveToast(fallbackNotif);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        activeToast,
        preferences,
        updatePreferences,
        markAsRead,
        markAllAsRead,
        clearAll,
        triggerTestNotification,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Check, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  BookOpen, 
  Leaf, 
  Info, 
  X, 
  Radio, 
  ExternalLink 
} from 'lucide-react';
import { useNotifications, NotificationItem } from '../context/NotificationContext';

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    isConnected,
    activeToast,
    markAsRead,
    markAllAsRead,
    clearAll,
    triggerTestNotification,
    dismissToast
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pantry' | 'recipe' | 'eco'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'pantry':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'recipe':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'eco':
        return <Leaf className="w-4 h-4 text-teal-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all duration-200 shadow-md group focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-[10px] font-bold text-slate-950 shadow-lg shadow-emerald-500/30 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Live SSE Status Dot */}
        <span
          className={`absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-slate-900 ${
            isConnected ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
          }`}
          title={isConnected ? 'Real-time SSE Connected' : 'SSE Disconnected'}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Mark all as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs & Real-time Indicator */}
          <div className="px-3 py-2 bg-slate-950/40 flex items-center justify-between">
            <div className="flex space-x-1">
              {(['all', 'pantry', 'recipe', 'eco'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-2.5 py-1 text-xs rounded-lg capitalize transition-all font-medium ${
                    filter === tab
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1 text-[10px] text-slate-400">
              <Radio className={`w-3 h-3 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span>{isConnected ? 'Live SSE' : 'Offline'}</span>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/40 custom-scrollbar">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-50" />
                <p className="text-xs">No notifications in this view.</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 flex space-x-3 transition-colors cursor-pointer group hover:bg-slate-800/50 ${
                    !n.read ? 'bg-emerald-950/15 border-l-2 border-emerald-500' : 'bg-transparent'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 h-fit shrink-0 group-hover:scale-105 transition-transform">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                        {timeAgo(n.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 mt-2 transition-colors"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Test Trigger Button Footer */}
          <div className="p-3 bg-slate-950/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Real-time event stream active</span>
            <button
              onClick={() => triggerTestNotification()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Alert</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Popup Notification Overlay */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900/95 border border-emerald-500/40 rounded-2xl shadow-2xl p-4 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 shrink-0">
              {getIcon(activeToast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Real-Time Alert
                </span>
                <button
                  onClick={dismissToast}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5 truncate">{activeToast.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeToast.message}</p>
              {activeToast.link && (
                <Link
                  href={activeToast.link}
                  onClick={dismissToast}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-400 hover:underline mt-2"
                >
                  <span>Take Action</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Response } from 'express';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'pantry' | 'recipe' | 'eco' | 'system' | 'community';
  timestamp: string;
  read: boolean;
  link?: string;
}

class NotificationService {
  private clients: Set<Response> = new Set();
  private history: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'Spinach Expiring Soon!',
      message: 'Your Spinach Leaves expire tomorrow (Aug 19). Check out 2 quick recipes to use them now!',
      type: 'pantry',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      read: false,
      link: '/recipes'
    },
    {
      id: 'notif-2',
      title: 'Eco-Milestone Reached! 🌿',
      message: 'You saved 5.2 kg of CO2 equivalent this week by utilizing leftover ingredients.',
      type: 'eco',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: false,
      link: '/eco'
    }
  ];

  public addClient(res: Response) {
    this.clients.add(res);
  }

  public removeClient(res: Response) {
    this.clients.delete(res);
  }

  public getHistory(): NotificationItem[] {
    return this.history;
  }

  public broadcast(notificationData: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) {
    const notification: NotificationItem = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Add to in-memory history (limit to last 50)
    this.history.unshift(notification);
    if (this.history.length > 50) {
      this.history.pop();
    }

    // Broadcast SSE event to all connected clients
    const payload = `data: ${JSON.stringify(notification)}\n\n`;
    this.clients.forEach(client => {
      try {
        client.write(payload);
      } catch (err) {
        console.error('Failed to write to SSE client, removing client.', err);
        this.clients.delete(client);
      }
    });

    return notification;
  }
}

export const notificationService = new NotificationService();

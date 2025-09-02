
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Notification } from '@/components/types/notification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock notifications data - replace with your actual API calls
  const mockNotifications: Notification[] = [
    {
      id: '1',
      user_id: '1',
      user_email: 'product.owner@example.com',
      title: 'Project Update',
      message: 'Your project "Web Development" has been updated',
      type: 'project_assigned',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: '2',
      user_id: '1',
      user_email: 'product.owner@example.com',
      title: 'New Task Assigned',
      message: 'A new task has been assigned to you',
      type: 'task_assigned',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: '3',
      user_id: '1',
      user_email: 'product.owner@example.com',
      title: 'Meeting Reminder',
      message: 'You have a meeting in 15 minutes',
      type: 'story_ready',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  ];

  const fetchNotifications = async () => {
    if (!currentUser?.email) { 
      setLoading(false);
      return;
    }

    try { 
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter notifications for current user
      const userNotifications = mockNotifications.filter(
        n => n.user_email === currentUser.email
      );
      
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.is_read).length); 
    } catch (error) {
      console.error('❌ Error in fetchNotifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try { 

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true, updated_at: new Date().toISOString() } 
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1)); 
    } catch (error) {
      console.error('❌ Error in markAsRead:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser?.email) return;

    try { 

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Update local state
      setNotifications(prev => prev.map(n => ({ 
        ...n, 
        is_read: true, 
        updated_at: new Date().toISOString() 
      })));
      setUnreadCount(0); 
    } catch (error) {
      console.error('❌ Error in markAllAsRead:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try { 

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      // Update local state
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (notificationToDelete && !notificationToDelete.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
       
    } catch (error) {
      console.error('❌ Error in deleteNotification:', error);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
    if (!newNotification.is_read) {
      setUnreadCount(prev => prev + 1);
    }

    // Show toast for new notification
    // toast({
    //   title: newNotification.title,
    //   description: newNotification.message,
    // });

    return newNotification;
  };

  // useEffect(() => {
  //   if (currentUser?.email) {
  //     fetchNotifications();
  //   }
  // }, [currentUser?.email]);

  // // Simulate real-time notifications with interval (replace with your WebSocket or polling solution)
  // useEffect(() => {
  //   if (!currentUser?.email) { 
  //     return;
  //   }
 

  //   // Simulate new notifications every 30 seconds (for demo purposes)
  //   intervalRef.current = setInterval(() => {
  //     // Random chance to add a new notification
  //     if (Math.random() < 0.1) { // 10% chance every 30 seconds
  //       const notificationTypes = [
  //         { title: 'Project Update', message: 'A project has been updated', type: 'project_assigned' as const },
  //         { title: 'New Task', message: 'A new task has been assigned', type: 'task_assigned' as const },
  //         { title: 'Reminder', message: 'Don\'t forget your upcoming meeting', type: 'story_ready' as const }
  //       ];
        
  //       const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
  //       addNotification({
  //         user_id: '1', // Mock user ID
  //         user_email: currentUser.email!,
  //         ...randomType,
  //         is_read: false
  //       });
  //     }
  //   }, 30000); // 30 seconds

  //   return () => { 
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   };
  // }, [currentUser?.email]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    refetch: fetchNotifications
  };
};


import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { Notification } from '@/types/notification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useUserRole();
  const channelRef = useRef<any>(null);

  const fetchNotifications = async () => {
    if (!currentUser?.email) {
      console.log('🔍 No current user email, skipping notification fetch');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching notifications for:', currentUser.email);

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_email', currentUser.email)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Error fetching notifications:', error);
        toast({
          title: "Error",
          description: "Failed to fetch notifications",
          variant: "destructive",
        });
        return;
      }

      const typedNotifications = (data || []) as Notification[];
      setNotifications(typedNotifications);
      setUnreadCount(typedNotifications.filter(n => !n.is_read).length);
      console.log('✅ Fetched notifications:', typedNotifications.length, 'unread:', typedNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('❌ Error in fetchNotifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      console.log('🔄 Marking notification as read:', notificationId);

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) {
        console.error('❌ Error marking notification as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true } 
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      console.log('✅ Notification marked as read');
    } catch (error) {
      console.error('❌ Error in markAsRead:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser?.email) return;

    try {
      console.log('🔄 Marking all notifications as read');

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('user_email', currentUser.email)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Error marking all notifications as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      console.log('✅ All notifications marked as read');
    } catch (error) {
      console.error('❌ Error in markAllAsRead:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      console.log('🔄 Deleting notification:', notificationId);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('❌ Error deleting notification:', error);
        return;
      }

      // Update local state
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (notificationToDelete && !notificationToDelete.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      console.log('✅ Notification deleted');
    } catch (error) {
      console.error('❌ Error in deleteNotification:', error);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      fetchNotifications();
    }
  }, [currentUser?.email]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!currentUser?.email) {
      console.log('🔍 No user email for realtime subscription');
      return;
    }

    // Clean up existing channel if it exists
    if (channelRef.current) {
      console.log('🔔 Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('🔔 Setting up realtime notification subscription for:', currentUser.email);

    const channelName = `notifications-realtime-${currentUser.email}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_email=eq.${currentUser.email}`
        },
        (payload) => {
          console.log('🔔 New notification received via realtime:', payload);
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for new notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_email=eq.${currentUser.email}`
        },
        (payload) => {
          console.log('🔔 Notification updated via realtime:', payload);
          const updatedNotification = payload.new as Notification;
          setNotifications(prev => 
            prev.map(n => 
              n.id === updatedNotification.id ? updatedNotification : n
            )
          );
        }
      )
      .subscribe((status) => {
        console.log('🔔 Realtime subscription status:', status);
      });

    // Store the channel reference
    channelRef.current = channel;

    return () => {
      console.log('🔔 Cleaning up realtime subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [currentUser?.email]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
};

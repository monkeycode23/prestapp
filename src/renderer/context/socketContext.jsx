import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket } from '../services/socketServices';
/* import { useAuth } from './AuthContext';
 */import apiService, { Notification, Message } from '../services/api'; // Import actual types
import {useSelector,} from 'react-redux'
/* interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[]; // Use imported Notification
  unreadCount: number;
  onlineUsers: string[];
  addNotification: (notification: Notification) => void; // Use imported Notification
  markNotificationsAsRead: (notificationIds?: string[]) => Promise<void>; 
  fetchNotifications: () => Promise<void>;
}
 */
const SocketContext = createContext/* <SocketContextType | undefined> */(undefined);

export const useSocket = ()/* : SocketContextType  */=> {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

/* interface SocketProviderProps {
  children: ReactNode;
} */

export const SocketProvider/* : React.FC<SocketProviderProps> */ = ({ children }) => {
  const { token, isAuthenticated, user } = useSelector(state=>state.auth)
  const [socketInstance, setSocketInstance] = useState/* <Socket | null> */(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState/* <Notification[]> */([]); // Use imported Notification
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState/* <string[]> */([]);

  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const fetchedNotifications = await apiService.getNotifications();
      setNotifications(fetchedNotifications || []);
      setUnreadCount((fetchedNotifications || []).filter((n/* : Notification */) => !n.read).length); // Use imported Notification
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
        console.log(token)
      const newSocket = initializeSocket(token);
      setSocketInstance(newSocket);
      // fetchNotifications(); // This will be called by the dependency array change if user/isAuthenticated changes

      newSocket.on('connect', () => {
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('newNotification', (notification/* : Notification */) => { // Use imported Notification
        setNotifications(prev => [notification, ...prev]);
        if (!notification.read) {
          setUnreadCount(prev => prev + 1);
        }
      });

      newSocket.on('userOnlineStatus', (data/* : { userId: string; isOnline: boolean; onlineUsers: string[] } */) => {
        setOnlineUsers(data.onlineUsers || []);
      });
      
      newSocket.on('receiveMessage', (messageData/* : Message */) => { // Use imported Message
         fetchNotifications(); 
      });

      return () => {
        disconnectSocket();
        setIsConnected(false);
      };
    } else if (!isAuthenticated && socketInstance) {
      disconnectSocket();
      setSocketInstance(null);
      setIsConnected(false);
      setNotifications([]);
      setUnreadCount(0);
      setOnlineUsers([]);
    }
  }, [isAuthenticated, token,/*  socketInstance */]); // Added socketInstance, removed user for now to simplify

  // Separate useEffect for fetching notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
        fetchNotifications();
    }
  }, [isAuthenticated, user]); // Removed fetchNotifications from here as it's not a stable function reference by default


  const addNotification = (notification/* : Notification */) => { // Use imported Notification
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const markNotificationsAsRead = async (notificationIds/* ?: string[] */) => {
    if (!socketInstance || !isAuthenticated) return;
    try {
      await apiService.markNotificationsAsRead(notificationIds);
      const updatedNotifications = notifications.map((n/* : Notification */) => // Use imported Notification
        (notificationIds ? notificationIds.includes(n._id) : !n.read) ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter((n/* : Notification */) => !n.read).length); // Use imported Notification
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
    }
  };

  return (
    <SocketContext.Provider value={{
      socket: socketInstance,
      isConnected,
      notifications,
      unreadCount,
      onlineUsers,
      notifications,
      
      addNotification,
      markNotificationsAsRead,
      fetchNotifications
    }}>
      {children}
    </SocketContext.Provider>
  );
}; 
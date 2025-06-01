import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket } from '../services/socketServices';
/* import { useAuth } from './AuthContext';i // Import actual types
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
import {useNotification} from "../components/Notifications"

import { useSelector } from 'react-redux'
import notificationService from '../services/notificationService'

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
  const {showNotification,setNotification} = useNotification()
  const { token, isAuthenticated, user } = useSelector(state=>state.auth)
  const [socketInstance, setSocketInstance] = useState/* <Socket | null> */(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState/* <Notification[]> */([]); // Use imported Notification
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState/* <string[]> */([]);
  const [messages, setMessages] = useState/* <Message[]> */([]);
  const [onlineClients, setOnlineClients] = useState/* <string[]> */([]);

  
  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const fetchedNotifications = await notificationService.getNotifications();
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
      console.log(user)
      
      console.log(token)
      try{
      const newSocket = initializeSocket(token);
      setSocketInstance(newSocket);
      // fetchNotifications(); // This will be called by the dependency array change if user/isAuthenticated changes
      console.log("Conectando al servidor",newSocket)  
      if(newSocket.connected){
        setNotification({
          title: "Conectando al servidor",
          message: "Conectando al servidor",
          type: "success",
          position: "top-right"
        })
        showNotification()
      }else{
        setNotification({
          title: "Error al conectar al servidor",
          message: "Error al conectar al servidor",
          type: "error",
          position: "top-right"
        })
        showNotification()
      }
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
        console.log(data)
        setOnlineClients(data.onlineClientes|| []);
        setOnlineUsers(data.onlineUsers || []);
      });
      
      newSocket.on('receiveMessage', (messageData/* : Message */) => { // Use imported Message
         //fetchNotifications(); 
          setMessages(prev => [{...messageData,user:{
              _id:messageData.user._id,
              name:messageData.user.username,
              avatar:messageData.user.avatar
          }}, ...prev])
          console.log(messages)
        });
      }catch(error){
        setNotification({
          title: "Error al conectar al servidor",
          message: error.message,
          type: "error",
          position: "top-right"
        })
        showNotification()
        console.log(error)
      }


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
      await notificationService.markNotificationsAsRead(notificationIds);
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
      onlineClients,
      messages,
      setMessages,
      addNotification,
      markNotificationsAsRead,
      fetchNotifications
    }}>
      {children}
    </SocketContext.Provider>
  );
}; 
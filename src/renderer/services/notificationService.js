import axios from 'axios';
import api from './api';

// Servicios de API
const notificationService = {
 
  
  // Notifications
  getNotifications: async () => {
    const response = await api.get/* <Notification[]> */('/notifications/user'); 
    return response.data;
  },
  
  markNotificationsAsRead: async (notificationIds/* ?: string[] */) => {
    const response = await api.post('/notifications/mark-read', { notificationIds });
    return response.data;
  },

 
};

export default notificationService; 
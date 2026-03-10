import { useState, useCallback } from 'react';

// Custom hook for managing notifications
export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  // Show a notification with given message, type and duration
  const showNotification = useCallback((message, type = 'error', duration = 5000) => {
    setNotification({ message, type, duration });
  }, []);

  // Hide the current notification
  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    showNotification,
    hideNotification
  };
};
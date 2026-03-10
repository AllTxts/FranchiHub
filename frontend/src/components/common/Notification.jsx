import { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Notification component for displaying toast messages
const Notification = ({ message, type = 'error', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide notification after duration
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  // Get styles based on notification type
  const getStyles = () => {
    switch(type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-400',
          text: 'text-green-800',
          icon: <FaCheckCircle className="text-green-500" size={20} />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-400',
          text: 'text-yellow-800',
          icon: <FaExclamationCircle className="text-yellow-500" size={20} />
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-400',
          text: 'text-blue-800',
          icon: <FaInfoCircle className="text-blue-500" size={20} />
        };
      default: // error
        return {
          bg: 'bg-red-50',
          border: 'border-red-400',
          text: 'text-red-800',
          icon: <FaExclamationCircle className="text-red-500" size={20} />
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`fixed top-4 right-4 z-50 animate-slideIn`}>
      <div className={`${styles.bg} border ${styles.border} rounded-lg shadow-lg p-4 max-w-md`}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 mt-0.5">
            {styles.icon}
          </div>
          {/* Message */}
          <div className="flex-1">
            <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
          </div>
          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className={`shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
          >
            <FaTimes size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
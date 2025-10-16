import React from 'react';

interface NotificationBannerProps {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ 
  type, 
  message, 
  onClose 
}) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const icons = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✕'
  };

  return (
    <div className={`border rounded-lg px-6 py-4 flex items-center justify-between ${styles[type]}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icons[type]}</span>
        <p className="font-medium">{message}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-xl font-bold hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
};

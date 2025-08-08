import { useState, useEffect } from 'react';

// Simple toast implementation for development
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = 'default' }) => {
    const id = Date.now();
    const newToast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);

    // Log to console for development
    console.log(`Toast [${variant}]: ${title} - ${description}`);
  };

  return { toast, toasts };
};

// Direct toast function for non-hook usage
export const toast = ({ title, description, variant = 'default' }) => {
  // Simple console log for direct toast calls
  console.log(`Toast [${variant}]: ${title} - ${description}`);
}; 
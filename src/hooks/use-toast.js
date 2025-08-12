import { toast as reactToastifyToast } from 'react-toastify';

// React-toastify implementation
export const useToast = () => {
  const toast = ({ title, description, variant = 'default' }) => {
    const message = `${title}: ${description}`;
    
    switch (variant) {
      case 'destructive':
        reactToastifyToast.error(message);
        break;
      case 'success':
        reactToastifyToast.success(message);
        break;
      case 'warning':
        reactToastifyToast.warning(message);
        break;
      default:
        reactToastifyToast.info(message);
        break;
    }
  };

  return { toast };
};

// Direct toast function for non-hook usage
export const toast = ({ title, description, variant = 'default' }) => {
  const message = `${title}: ${description}`;
  
  switch (variant) {
    case 'destructive':
      reactToastifyToast.error(message);
      break;
    case 'success':
      reactToastifyToast.success(message);
      break;
    case 'warning':
      reactToastifyToast.warning(message);
      break;
    default:
      reactToastifyToast.info(message);
      break;
  }
}; 
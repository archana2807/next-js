import { toast } from 'react-toastify';

export const showToast = (message, type = 'info') => {
  const config = {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
  };

  switch (type) {
    case 'success':
      toast.success(message, config);
      break;
    case 'error':
      toast.error(message, config);
      break;
    case 'warn':
    case 'warning':
      toast.warn(message, config);
      break;
    case 'info':
    default:
      toast.info(message, config);
      break;
  }
};

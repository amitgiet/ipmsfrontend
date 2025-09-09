import { useState } from 'react';
import { toast } from 'react-toastify';

interface UseLoadingWithToastOptions {
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
}

export const useLoadingWithToast = (options: UseLoadingWithToastOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed',
    loadingMessage = 'Loading...'
  } = options;

  const executeWithLoading = async <T>(
    operation: () => Promise<T>,
    options?: {
      showLoadingToast?: boolean;
      customSuccessMessage?: string;
      customErrorMessage?: string;
      useToastUpdate?: boolean;
    }
  ): Promise<T | null> => {
    let toastId: any = null;
    
    try {
      setLoading(true);
      
      if (options?.showLoadingToast) {
        if (options?.useToastUpdate) {
          toastId = toast.loading(loadingMessage);
        } else {
          toast.info(loadingMessage);
        }
      }

      const result = await operation();
      
      if (options?.useToastUpdate && toastId) {
        toast.update(toastId, {
          render: options?.customSuccessMessage || successMessage,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
      } else if (options?.customSuccessMessage) {
        toast.success(options.customSuccessMessage);
      } else {
        toast.success(successMessage);
      }

      return result;
    } catch (error) {
      console.error('Operation failed:', error);
      
      if (options?.useToastUpdate && toastId) {
        toast.update(toastId, {
          render: options?.customErrorMessage || errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
        });
      } else if (options?.customErrorMessage) {
        toast.error(options.customErrorMessage);
      } else {
        toast.error(errorMessage);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const executeWithSubmitting = async <T>(
    operation: () => Promise<T>,
    options?: {
      showSubmittingToast?: boolean;
      customSuccessMessage?: string;
      customErrorMessage?: string;
      useToastUpdate?: boolean;
    }
  ): Promise<T | null> => {
    let toastId: any = null;
    
    try {
      setSubmitting(true);
      
      if (options?.showSubmittingToast) {
        if (options?.useToastUpdate) {
          toastId = toast.loading('Submitting...');
        } else {
          toast.info('Submitting...');
        }
      }

      const result = await operation();
      
      if (options?.useToastUpdate && toastId) {
        toast.update(toastId, {
          render: options?.customSuccessMessage || successMessage,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        });
      } else if (options?.customSuccessMessage) {
        toast.success(options.customSuccessMessage);
      } else {
        toast.success(successMessage);
      }

      return result;
    } catch (error) {
      console.error('Submission failed:', error);
      
      if (options?.useToastUpdate && toastId) {
        toast.update(toastId, {
          render: options?.customErrorMessage || errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
        });
      } else if (options?.customErrorMessage) {
        toast.error(options.customErrorMessage);
      } else {
        toast.error(errorMessage);
      }
      
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    executeWithLoading,
    executeWithSubmitting,
    setLoading,
    setSubmitting
  };
};

import { toast } from "sonner";

/**
 * Show error toast with consistent styling and duration
 */
export function showErrorToast(message: string) {
  return toast.error(message, {
    duration: 5000, // 5 seconds for errors
    dismissible: true,
  });
}

/**
 * Show success toast with consistent styling and duration
 */
export function showSuccessToast(message: string) {
  return toast.success(message, {
    duration: 3000, // 3 seconds for success
    dismissible: true,
  });
}

/**
 * Show warning toast with consistent styling and duration
 */
export function showWarningToast(message: string) {
  return toast.warning(message, {
    duration: 4000, // 4 seconds for warnings
    dismissible: true,
  });
}

/**
 * Show info toast with consistent styling and duration
 */
export function showInfoToast(message: string) {
  return toast.info(message, {
    duration: 3000, // 3 seconds for info
    dismissible: true,
  });
}
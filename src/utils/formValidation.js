// Form validation utilities
export const validateProjectForm = (formData) => {
  const errors = {};

  // Required field validations
  if (!formData.projectName?.trim()) {
    errors.projectName = 'Project name is required';
  }

  if (!formData.projectId?.trim()) {
    errors.projectId = 'Project ID is required';
  }

  if (!formData.clientName?.trim()) {
    errors.clientName = 'Client name is required';
  }

  if (!formData.clientEmail?.trim()) {
    errors.clientEmail = 'Client email is required';
  } else if (!isValidEmail(formData.clientEmail)) {
    errors.clientEmail = 'Please enter a valid email address';
  }

  if (!formData.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!formData.duration || isNaN(Number(formData.duration))) {
    errors.duration = 'Duration is required and must be a number';
  }

  if (!formData.projectStatus) {
    errors.projectStatus = 'Project status is required';
  }

  if (!formData.projectType) {
    errors.projectType = 'Project type is required';
  }

  if (!formData.priority) {
    errors.priority = 'Priority is required';
  }

  return errors;
};

// Email validation function
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation function
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// URL validation function
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Number validation function
export const isValidNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
}; 
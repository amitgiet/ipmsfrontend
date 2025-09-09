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

  // Client validation - check first client (primary client)
  if (!formData.allClients || formData.allClients.length === 0) {
    errors.clientName = 'At least one client is required';
    errors.clientEmail = 'Client email is required';
  } else {
    const primaryClient = formData.allClients[0];
    if (!primaryClient.name?.trim()) {
      errors.clientName = 'Primary client name is required';
    }
    if (!primaryClient.email?.trim()) {
      errors.clientEmail = 'Primary client email is required';
    } else if (!isValidEmail(primaryClient.email)) {
      errors.clientEmail = 'Please enter a valid email address';
    }
  }

  if (!formData.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!formData.duration || isNaN(Number(formData.duration))) {
    errors.duration = 'Duration is required and must be a number';
  } else if (Number(formData.duration) < 1) {
    errors.duration = 'Duration must be at least 1 day';
  }

  if (!formData.endDate) {
    errors.endDate = 'End date is required';
  }

  if (!formData.projectStatus) {
    errors.projectStatus = 'Project status is required';
  }

  // Project type validation - check if array has items
  if (!formData.projectType ) {
    errors.projectType = 'At least one project type is required';
  }

  // Project nature validation - check if array has items
  if (!formData.projectNature) {
    errors.projectNature = 'At least one project nature is required';
  }

  if (!formData.priority) {
    errors.priority = 'Priority is required';
  }

  // Validate budgeted hours
  if (formData.budgetedHours && formData.budgetedHours.trim()) {
    const budgetedHours = parseFloat(formData.budgetedHours);
    if (isNaN(budgetedHours) || budgetedHours < 0) {
      errors.budgetedHours = 'Budgeted hours must be a positive number';
    } else if (budgetedHours > 9999) {
      errors.budgetedHours = 'Budgeted hours cannot exceed 9999';
    }
  }

  // Validate logged hours
  if (formData.loggedHours && formData.loggedHours.trim()) {
    const loggedHours = parseFloat(formData.loggedHours);
    if (isNaN(loggedHours) || loggedHours < 0) {
      errors.loggedHours = 'Logged hours must be a positive number';
    } else if (loggedHours > 9999) {
      errors.loggedHours = 'Logged hours cannot exceed 9999';
    }
  }

  // Validate estimated budget
  if (formData.estimatedBudget && formData.estimatedBudget.trim()) {
    const estimatedBudget = parseFloat(formData.estimatedBudget);
    if (isNaN(estimatedBudget) || estimatedBudget < 0) {
      errors.estimatedBudget = 'Estimated budget must be a positive number';
    } else if (estimatedBudget > 999999999.99) {
      errors.estimatedBudget = 'Estimated budget cannot exceed 999,999,999.99';
    }
  }

  // Validate milestones if they exist
  if (formData.milestones && formData.milestones.length > 0) {
    formData.milestones.forEach((milestone, index) => {
      if (!milestone.name?.trim()) {
        errors[`milestone_${index}_name`] = `Milestone ${index + 1} name is required`;
      }
      
      // Validate milestone amount if provided
      if (milestone.amount && milestone.amount.trim()) {
        const amount = parseFloat(milestone.amount);
        if (isNaN(amount) || amount < 0) {
          errors[`milestone_${index}_amount`] = `Milestone ${index + 1} amount must be a positive number`;
        }
      }
      
      // Validate milestone date if provided
      if (milestone.estimated_completion_date && milestone.estimated_completion_date.trim()) {
        const date = new Date(milestone.estimated_completion_date);
        if (isNaN(date.getTime())) {
          errors[`milestone_${index}_date`] = `Milestone ${index + 1} date must be a valid date`;
        }
      }
    });
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
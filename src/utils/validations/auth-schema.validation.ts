//signup
export interface FormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

// Login
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginValidationErrors {
  email?: string;
  password?: string;
}

// Reset Password
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordValidationErrors {
  password?: string;
  confirmPassword?: string;
}


export const validateSignupForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.username.trim()) {
    errors.username = "Username is required";
  } else if (formData.username.length < 2) {
    errors.username = "Name must be at least 2 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(formData.username)) {
    errors.username = "Name must contain only alphabetic characters and spaces";
  }


  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (formData.phone.length !== 10) {
    errors.phone = "Phone number must be exactly 10 digits";
  } else if (!/^\d{10}$/.test(formData.phone)) {
    errors.phone = "Phone number must contain only digits";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else {
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain at least one digit";
    } else if (!/[@$!%*?&]/.test(formData.password)) {
      errors.password = "Password must contain at least one special character";
    }
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

export const validateLoginForm = (formData: LoginFormData): LoginValidationErrors => {
  const errors: LoginValidationErrors = {};

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else {
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain at least one digit";
    } else if (!/[@$!%*?&]/.test(formData.password)) {
      errors.password = "Password must contain at least one special character";
    }
  }

  return errors;
};

export const validateResetPasswordForm = (formData: ResetPasswordFormData): ResetPasswordValidationErrors => {
   const errors: ResetPasswordValidationErrors = {};

     if (!formData.password) {
    errors.password = "Password is required";
  } else {
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain at least one digit";
    } else if (!/[@$!%*?&]/.test(formData.password)) {
      errors.password = "Password must contain at least one special character";
    }
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}
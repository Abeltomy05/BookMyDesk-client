interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  match?: string;
}

export interface ClientProfileData {
  username: string;
  email: string;
  phone: string;
}

export interface ClientProfileErrors {
  username: string;
  email: string;
  phone: string;
}

export interface VendorProfileData {
  username: string;
  email: string;
  idProof?: string;
  phone?: string; 
}

export interface VendorProfileErrors {
  username: string;
  email: string;
  idProof: string;
  phone?: string; 
}

export const validatePasswordForm = (passwordData: PasswordData): PasswordErrors => {
  const errors: PasswordErrors = {};

  if (!passwordData.currentPassword) {
    errors.currentPassword = "Current password is required";
  }

  if (!passwordData.newPassword) {
    errors.newPassword = "New password is required";
  } else if (passwordData.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters long";
  } else if (!/[A-Z]/.test(passwordData.newPassword)) {
    errors.newPassword = "Password must contain at least one uppercase letter";
  } else if (!/[0-9]/.test(passwordData.newPassword)) {
    errors.newPassword = "Password must contain at least one digit";
  } else if (!/[@$!%*?&]/.test(passwordData.newPassword)) {
    errors.newPassword = "Password must contain at least one special character (@$!%*?&)";
  }

  if (!passwordData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (passwordData.newPassword !== passwordData.confirmPassword) {
    errors.match = "Passwords do not match";
  }

  return errors;
};

export const clientValidateProfileForm = (profile: ClientProfileData): { isValid: boolean; errors: ClientProfileErrors } => {
  let isValid = true;
  const errors: ClientProfileErrors = {
    username: "",
    email: "",
    phone: "",
  };

  // Username
  if (!profile.username.trim()) {
    errors.username = "Username is required";
    isValid = false;
  } else if (profile.username.length < 2) {
    errors.username = "Name must be at least 2 characters long";
    isValid = false;
  } else if (!/^[a-zA-Z\s]+$/.test(profile.username)) {
    errors.username = "Name must contain only alphabetic characters and spaces";
    isValid = false;
  }

  // Email
  if (!profile.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(profile.email)) {
    errors.email = "Invalid email format";
    isValid = false;
  }

  // Phone
  if (!profile.phone.trim()) {
    errors.phone = "Phone number is required";
    isValid = false;
  } else if (profile.phone.length !== 10) {
    errors.phone = "Phone number must be exactly 10 digits";
    isValid = false;
  } else if (!/^\d{10}$/.test(profile.phone)) {
    errors.phone = "Phone number must contain only digits";
    isValid = false;
  }

  return { isValid, errors };
};

export const validateVendorProfileForm = (
  profile: VendorProfileData
): { isValid: boolean; errors: VendorProfileErrors } => {
  let isValid = true;
  const errors: VendorProfileErrors = {
    username: "",
    email: "",
    idProof: "",
    phone: "", 
  };

  if (!profile.username.trim()) {
    errors.username = "Username is required";
    isValid = false;
  } else if (profile.username.length < 2) {
    errors.username = "Name must be at least 2 characters long";
    isValid = false;
  } else if (!/^[a-zA-Z\s]+$/.test(profile.username)) {
    errors.username = "Name must contain only alphabetic characters and spaces";
    isValid = false;
  }

  // Email
  if (!profile.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(profile.email)
  ) {
    errors.email = "Invalid email format";
    isValid = false;
  }

  if (profile.phone) {
  if (profile.phone.trim()) {
    if (profile.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits";
      isValid = false;
    } else if (!/^\d{10}$/.test(profile.phone)) {
      errors.phone = "Phone number must contain only digits";
      isValid = false;
    }
  }
}

  if (!profile.idProof || !profile.idProof.trim()) {
    errors.idProof = "ID proof is required";
    isValid = false;
  }

  return { isValid, errors };
};
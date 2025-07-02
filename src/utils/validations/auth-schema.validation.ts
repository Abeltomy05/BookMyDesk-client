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

//Vendor Signup
export interface VendorFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  companyName: string
  companyAddress: string
  idProof: File | string | null;
}

export interface VendorFormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  phone?: string
  companyName?: string
  companyAddress?: string
  idProof?:  string
}

export interface VendorTouchedFields {
  username: boolean
  email: boolean
  password: boolean
  confirmPassword: boolean
  phone: boolean
  companyName: boolean
  companyAddress: boolean
  idProof?: boolean
}



export const validateVendorField = (
  name: string, 
  value: any,
  formData?: any
): string | undefined => {
  switch (name as keyof VendorFormData) {
    case "username":
      return !value || typeof value !== 'string' || !value.trim() ? "Username is required" : undefined
      
    case "email":
      return !value || typeof value !== 'string' || !value.trim() 
        ? "Email is required" 
        : !/\S+@\S+\.\S+/.test(value) 
          ? "Email is invalid" 
          : undefined
          
    case "password":
      if (!value || typeof value !== 'string') {
        return "Password is required" 
      } else if (value.length < 8) {
        return "Password must be at least 8 characters long"
      } else if (!/[A-Z]/.test(value)) {
        return "Password must contain at least one uppercase letter"
      } else if (!/[0-9]/.test(value)) {
        return "Password must contain at least one digit"
      } else if (!/[@$!%*?&]/.test(value)) {
        return "Password must contain at least one special character"
      }
      return undefined
      
    case "confirmPassword":
      return !value || typeof value !== 'string'
        ? "Confirm password is required"
        : formData && value !== formData.password 
          ? "Passwords do not match" 
          : undefined
          
    case "phone":
      return !value || typeof value !== 'string' || !value.trim()
        ? "Phone number is required"
        : !/^\d{10}$/.test(value.replace(/\D/g, ''))
          ? "Phone number must be exactly 10 digits"
          : undefined;
          
    case "companyName":
      return !value || typeof value !== 'string' || !value.trim() ? "Company name is required" : undefined
      
    case "companyAddress":
      return !value || typeof value !== 'string' || !value.trim() ? "Company address is required" : undefined
      
    case "idProof":
      if (!value) {
        return "ID proof is required"
      } else if (value instanceof File) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf','application/msword',  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(value.type)) {
          return "Please upload a valid document (JPG, PNG, PDF, DOC, DOCX)"
        }
        if (value.size > 5 * 1024 * 1024) { // 5MB
          return "File size should be less than 5MB"
        }
      }
      return undefined
      
    default:
      return undefined
  }
}


export const validateVendorSignupForm = (
  formData: VendorFormData,
  setErrors: React.Dispatch<React.SetStateAction<VendorFormErrors>>,
  setTouched: React.Dispatch<React.SetStateAction<VendorTouchedFields>>,
  validateField: ((name: string, value: any) => string | undefined) = 
  (name, value) => validateVendorField(name, value, formData)
): boolean => {
  const newErrors: VendorFormErrors = {}
  
  // Mark all fields as touched
  const allTouched: VendorTouchedFields = Object.keys(formData).reduce((acc, key) => {
    acc[key as keyof VendorTouchedFields] = true
    return acc
  }, {} as VendorTouchedFields)
  
  setTouched(allTouched)
  
  // Validate each field
  Object.keys(formData).forEach((key) => {
    const fieldName = key as keyof VendorFormData
    const error = validateField(fieldName, formData[fieldName])
    if (error) {
      newErrors[fieldName] = error
    }
  })
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}



//client

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

export const validateClientField = (
  name: string, 
  value: any,
  formData?: any
): string | undefined => {
  switch (name as keyof FormData) {
    case "username":
      return !value || typeof value !== 'string' || !value.trim() ? "Username is required" : undefined
      
    case "email":
      return !value || typeof value !== 'string' || !value.trim() 
        ? "Email is required" 
        : !/\S+@\S+\.\S+/.test(value) 
          ? "Email is invalid" 
          : undefined
          
    case "password":
      if (!value || typeof value !== 'string') {
        return "Password is required" 
      } else if (value.length < 8) {
        return "Password must be at least 8 characters long"
      } else if (!/[A-Z]/.test(value)) {
        return "Password must contain at least one uppercase letter"
      } else if (!/[0-9]/.test(value)) {
        return "Password must contain at least one digit"
      } else if (!/[@$!%*?&]/.test(value)) {
        return "Password must contain at least one special character"
      }
      return undefined
      
    case "confirmPassword":
      return !value || typeof value !== 'string'
        ? "Confirm password is required"
        : formData && value !== formData.password 
          ? "Passwords do not match" 
          : undefined
          
    case "phone":
      return !value || typeof value !== 'string' || !value.trim()
        ? "Phone number is required"
        : !/^\d{10}$/.test(value.replace(/\D/g, ''))
          ? "Phone number must be exactly 10 digits"
          : undefined;
          
    default:
      return undefined
  }
}

export const validateClientSignupForm = (
  formData: FormData,
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>,
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  validateField: ((name: string, value: any) => string | undefined) = 
    (name, value) => validateClientField(name, value, formData)
): boolean => {
  const newErrors: ValidationErrors = {}
  
  // Mark all fields as touched
  const allTouched: Record<string, boolean> = Object.keys(formData).reduce((acc, key) => {
    acc[key] = true
    return acc
  }, {} as Record<string, boolean>)
  
  setTouched(allTouched)
  
  // Validate each field
  Object.keys(formData).forEach((key) => {
    const fieldName = key as keyof FormData
    const error = validateField(fieldName, formData[fieldName])
    if (error) {
      newErrors[fieldName] = error
    }
  })
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
import type { ContactInfo } from "@/types/building-form.type"

export interface ContactValidationErrors {
  phone?: string
  email?: string
}

export interface ContactValidationResult {
  isValid: boolean
  errors: ContactValidationErrors
}

// Phone number validation
const validatePhoneNumber = (phone: string): string | null => {
  if (!phone || phone.trim().length === 0) {
    return "Phone number is required"
  }
  
  const cleanPhone = phone.trim().replace(/\s+/g, '')
  
  // Check minimum length
  if (cleanPhone.length < 10) {
    return "Phone number must be  10 digits"
  }
  
  // Check maximum length
  if (cleanPhone.length > 10) {
    return "Phone number must be 10 digits"
  }
  
  // Check if contains only digits, spaces, parentheses, hyphens, and plus
  const phoneRegex = /^[\d\s\(\)\-\+]+$/
  if (!phoneRegex.test(phone)) {
    return "Phone number contains invalid characters"
  }
  
  // Count only digits
  const digitCount = cleanPhone.replace(/[^\d]/g, '').length
  if (digitCount < 10) {
    return "Phone number must contain at least 10 digits"
  }
  
  return null
}

// Email validation
const validateEmail = (email: string): string | null => {
  if (!email || email.trim().length === 0) {
    return "Email address is required"
  }
  
  const trimmedEmail = email.trim()
  
  // Check basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email address"
  }
  
  // Check email length
  if (trimmedEmail.length > 254) {
    return "Email address is too long"
  }
  
  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return "Email address cannot contain consecutive dots"
  }
  
  // Check local part length (before @)
  const localPart = trimmedEmail.split('@')[0]
  if (localPart.length > 64) {
    return "Email address local part is too long"
  }
  
  return null
}

export const validateContactInfo = (contactInfo: ContactInfo): ContactValidationResult => {
  const errors: ContactValidationErrors = {}
  
  const phoneError = validatePhoneNumber(contactInfo.phone)
  if (phoneError) {
    errors.phone = phoneError
  }
  
  const emailError = validateEmail(contactInfo.email)
  if (emailError) {
    errors.email = emailError
  }
  
  const isValid = Object.keys(errors).length === 0
  return { isValid, errors }
}

export const getContactFieldError = (errors: ContactValidationErrors, fieldName: keyof ContactValidationErrors): string | undefined => {
  return errors[fieldName]
}

export const hasContactFieldError = (errors: ContactValidationErrors, fieldName: keyof ContactValidationErrors): boolean => {
  return getContactFieldError(errors, fieldName) !== undefined
}
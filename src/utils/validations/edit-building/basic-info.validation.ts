import type { Building } from "@/types/view&editBuilding"

export interface ValidationErrors {
  buildingName?: string
  location?: string
  email?: string
  phone?: string
  weekdaysOpeningHours?: string
  weekendsOpeningHours?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationErrors
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Time validation - HH:MM format
const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

export const validateBasicInfo = (building: Building): ValidationResult => {
  const errors: ValidationErrors = {}

  // Validate building name
  if (!building.buildingName?.trim()) {
    errors.buildingName = "Building name is required"
  }

  // Validate location
  if (!building.location?.displayName.trim()) {
    errors.location = "Location is required"
  }

  // Validate email
  if (!building.email?.trim()) {
    errors.email = "Email is required"
  } else if (!EMAIL_REGEX.test(building.email.trim())) {
    errors.email = "Please enter a valid email address"
  }

  // Validate phone
  if (!building.phone?.trim()) {
    errors.phone = "Phone number is required"
  } else if (building.phone.length !== 10) {
    errors.phone = "Phone number must be exactly 10 digits"
  } else if (!/^\d{10}$/.test(building.phone)) {
    errors.phone = "Phone number must contain only digits"
  }

  // Validate weekdays opening hours
  const weekdaysHours = building.openingHours?.weekdays
  if (!weekdaysHours) {
    errors.weekdaysOpeningHours = "Weekdays opening hours are required"
  } else if (!weekdaysHours.is24Hour) {
    if (!weekdaysHours.openTime?.trim()) {
      errors.weekdaysOpeningHours = "Weekdays open time is required"
    } else if (!weekdaysHours.closeTime?.trim()) {
      errors.weekdaysOpeningHours = "Weekdays close time is required"
    } else if (!TIME_REGEX.test(weekdaysHours.openTime) || !TIME_REGEX.test(weekdaysHours.closeTime)) {
      errors.weekdaysOpeningHours = "Please enter valid time format (HH:MM)"
    } else if (weekdaysHours.openTime >= weekdaysHours.closeTime) {
      errors.weekdaysOpeningHours = "Close time must be after open time"
    }
  }

  // Validate weekends opening hours
  const weekendsHours = building.openingHours?.weekends
  if (!weekendsHours) {
    errors.weekendsOpeningHours = "Weekends opening hours are required"
  } else if (!weekendsHours.is24Hour) {
    if (!weekendsHours.openTime?.trim()) {
      errors.weekendsOpeningHours = "Weekends open time is required"
    } else if (!weekendsHours.closeTime?.trim()) {
      errors.weekendsOpeningHours = "Weekends close time is required"
    } else if (!TIME_REGEX.test(weekendsHours.openTime) || !TIME_REGEX.test(weekendsHours.closeTime)) {
      errors.weekendsOpeningHours = "Please enter valid time format (HH:MM)"
    } else if (weekendsHours.openTime >= weekendsHours.closeTime) {
      errors.weekendsOpeningHours = "Close time must be after open time"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
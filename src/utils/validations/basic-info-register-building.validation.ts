import type { BasicInfo } from "@/types/building-form.type"

export interface ValidationErrors {
  name?: string
  location?: string
  openingHours?: {
    weekdays?: {
      openTime?: string
      closeTime?: string
      timeRange?: string
    }
    weekends?: {
      openTime?: string
      closeTime?: string
      timeRange?: string
    }
  }
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationErrors
}


const validateTimeRange = (openTime: string, closeTime: string): string | null => {
  if (!openTime || !closeTime) {
    return "Both open and close times are required"
  }

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const openMinutes = timeToMinutes(openTime)
  const closeMinutes = timeToMinutes(closeTime)

  if (closeMinutes <= openMinutes && closeMinutes < 12 * 60) {
    return null
  }

  if (openMinutes >= closeMinutes && closeMinutes >= 12 * 60) {
    return "Close time must be after open time"
  }

  return null
}

export const validateBasicInfo = (data: BasicInfo): ValidationResult => {
  const errors: ValidationErrors = {}

  // Validate building name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Building name is required"
  } else if (data.name.trim().length < 2) {
    errors.name = "Building name must be at least 2 characters long"
  } else if (data.name.trim().length > 100) {
    errors.name = "Building name must be less than 100 characters"
  }

  // Validate location
  if (!data.location || data.location.trim().length === 0) {
    errors.location = "Location is required"
  } else if (data.location.trim().length < 5) {
    errors.location = "Please provide a complete address"
  } else if (data.location.trim().length > 200) {
    errors.location = "Location must be less than 200 characters"
  }

  // Validate opening hours
  const openingHoursErrors: ValidationErrors['openingHours'] = {}

  if (data.openingHours) {
    // Validate weekdays
    if (!data.openingHours.weekdays.is24Hour) {
      const weekdaysErrors: NonNullable<ValidationErrors['openingHours']>['weekdays'] = {}

      if (!data.openingHours.weekdays.openTime) {
        weekdaysErrors.openTime = "Weekday open time is required"
      }

      if (!data.openingHours.weekdays.closeTime) {
        weekdaysErrors.closeTime = "Weekday close time is required"
      }

      if (data.openingHours.weekdays.openTime && data.openingHours.weekdays.closeTime) {
        const timeRangeError = validateTimeRange(
          data.openingHours.weekdays.openTime,
          data.openingHours.weekdays.closeTime
        )
        if (timeRangeError) {
          weekdaysErrors.timeRange = timeRangeError
        }
      }

      if (Object.keys(weekdaysErrors).length > 0) {
        openingHoursErrors.weekdays = weekdaysErrors
      }
    }

    // Validate weekends
    if (!data.openingHours.weekends.is24Hour) {
      const weekendsErrors: NonNullable<ValidationErrors['openingHours']>['weekends'] = {}

      if (!data.openingHours.weekends.openTime) {
        weekendsErrors.openTime = "Weekend open time is required"
      }

      if (!data.openingHours.weekends.closeTime) {
        weekendsErrors.closeTime = "Weekend close time is required"
      }

      if (data.openingHours.weekends.openTime && data.openingHours.weekends.closeTime) {
        const timeRangeError = validateTimeRange(
          data.openingHours.weekends.openTime,
          data.openingHours.weekends.closeTime
        )
        if (timeRangeError) {
          weekendsErrors.timeRange = timeRangeError
        }
      }

      if (Object.keys(weekendsErrors).length > 0) {
        openingHoursErrors.weekends = weekendsErrors
      }
    }
  }

  if (Object.keys(openingHoursErrors).length > 0) {
    errors.openingHours = openingHoursErrors
  }

  // Return validation result
  const isValid = Object.keys(errors).length === 0
  return { isValid, errors }
}

// to get error message for a specific field
export const getFieldError = (errors: ValidationErrors, fieldPath: string): string | undefined => {
  const pathArray = fieldPath.split('.')
  let current: unknown = errors

  for (const path of pathArray) {
    if (current && typeof current === 'object' && path in current) {
      current = (current as Record<string, unknown>)[path];
    } else {
      return undefined
    }
  }

  return typeof current === 'string' ? current : undefined
}

// to check if a specific field has an error
export const hasFieldError = (errors: ValidationErrors, fieldPath: string): boolean => {
  return getFieldError(errors, fieldPath) !== undefined
}
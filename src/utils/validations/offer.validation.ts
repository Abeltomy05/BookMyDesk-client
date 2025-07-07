export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface OfferFormData {
  title: string
  percentage: number
  startDate: string
  endDate: string
  buildingId: string
  spaceId: string
}

export const validateOfferForm = (formData: OfferFormData): ValidationResult => {
  const errors: ValidationError[] = []

  if (!formData.title || formData.title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Title is required'
    })
  } else {
    const wordCount = formData.title.trim().length
    if (wordCount < 2) {
      errors.push({
        field: 'title',
        message: 'Title must contain at least 2 letters'
      })
    }
  }

  // Percentage validation
  if (!formData.percentage || formData.percentage <= 0) {
    errors.push({
      field: 'percentage',
      message: 'Percentage is required and must be greater than 0'
    })
  } else if (formData.percentage > 100) {
    errors.push({
      field: 'percentage',
      message: 'Percentage cannot exceed 100'
    })
  }

  // Start date validation
  if (!formData.startDate || formData.startDate.trim().length === 0) {
    errors.push({
      field: 'startDate',
      message: 'Start date is required'
    })
  }

  // End date validation
  if (!formData.endDate || formData.endDate.trim().length === 0) {
    errors.push({
      field: 'endDate',
      message: 'End date is required'
    })
  }

  // Date range validation
  if (formData.startDate && formData.endDate) {
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0) 

    if (startDate < today) {
      errors.push({
        field: 'startDate',
        message: 'Start date cannot be in the past'
      })
    }

    if (endDate <= startDate) {
      errors.push({
        field: 'endDate',
        message: 'End date must be after start date'
      })
    }
  }

  // Building validation
  if (!formData.buildingId || formData.buildingId.trim().length === 0) {
    errors.push({
      field: 'buildingId',
      message: 'Building selection is required'
    })
  }

  // Space validation
  if (!formData.spaceId || formData.spaceId.trim().length === 0) {
    errors.push({
      field: 'spaceId',
      message: 'Space selection is required'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find(err => err.field === fieldName)
  return error ? error.message : null
}
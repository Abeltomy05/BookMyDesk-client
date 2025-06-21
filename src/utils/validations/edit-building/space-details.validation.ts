export interface SpaceValidationErrors {
  name?: string
  capacity?: string
  pricePerDay?: string
}

export interface SpaceFormData {
  name: string
  capacity: number
  pricePerDay: number
}

export const validateSpaceField = (
  field: keyof SpaceFormData,
  value: string | number,
  existingSpaces?: Array<{ name: string; _id: string }>,
  currentSpaceId?: string
): string | undefined => {
  switch (field) {
    case 'name':
      const nameValue = value as string
      if (!nameValue || nameValue.trim().length === 0) {
        return 'Space name is required'
      }
      if (nameValue.trim().length < 2) {
        return 'Space name must be at least 2 characters long'
      }
      if (nameValue.trim().length > 50) {
        return 'Space name must be less than 50 characters'
      }
      // Check for duplicate names (excluding current space being edited)
      if (existingSpaces) {
        const isDuplicate = existingSpaces.some(
          space => space.name.toLowerCase().trim() === nameValue.toLowerCase().trim() && 
          space._id !== currentSpaceId
        )
        if (isDuplicate) {
          return 'A space with this name already exists'
        }
      }
      break

    case 'capacity':
      const capacityValue = Number(value)
      if (!capacityValue || capacityValue <= 0) {
        return 'Capacity must be greater than zero'
      }
      if (!Number.isInteger(capacityValue)) {
        return 'Capacity must be a whole number'
      }
      if (capacityValue > 1000) {
        return 'Capacity cannot exceed 1000 people'
      }
      break

    case 'pricePerDay':
      const priceValue = Number(value)
      if (!priceValue || priceValue <= 0) {
        return 'Price must be greater than zero'
      }
      if (priceValue > 100000) {
        return 'Price cannot exceed ₹1,00,000 per day'
      }
      // Check for reasonable decimal places (max 2)
      if (priceValue.toString().includes('.') && priceValue.toString().split('.')[1].length > 2) {
        return 'Price can have maximum 2 decimal places'
      }
      break

    default:
      return undefined
  }
  return undefined
}

export const validateAllSpaceFields = (
  spaceData: SpaceFormData,
  existingSpaces?: Array<{ name: string; _id: string }>,
  currentSpaceId?: string
): SpaceValidationErrors => {
  return {
    name: validateSpaceField('name', spaceData.name, existingSpaces, currentSpaceId),
    capacity: validateSpaceField('capacity', spaceData.capacity),
    pricePerDay: validateSpaceField('pricePerDay', spaceData.pricePerDay)
  }
}

export const hasValidationErrors = (errors: SpaceValidationErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined)
}

export const isSpaceFormValid = (
  spaceData: SpaceFormData,
  existingSpaces?: Array<{ name: string; _id: string }>,
  currentSpaceId?: string
): boolean => {
  const errors = validateAllSpaceFields(spaceData, existingSpaces, currentSpaceId)
  return !hasValidationErrors(errors)
}
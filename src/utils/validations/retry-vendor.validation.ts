export interface VendorRetryFormData {
  phoneNumber: string
  companyName: string
  companyAddress: string
  idProof: File | null
}

export interface VendorRetryFormErrors {
  phoneNumber?: string
  companyName?: string
  companyAddress?: string
  idProof?: string
}

export const validateVendorRetryField = (
   formData: VendorRetryFormData
):  VendorRetryFormErrors => {

     const errors: VendorRetryFormErrors = {}
     const { phoneNumber, companyName, companyAddress, idProof } = formData
  // Phone number
  if (!phoneNumber || !phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required"
  } else if (!/^\d{10,15}$/.test(phoneNumber.replace(/\D/g, ""))) {
    errors.phoneNumber = "Please enter a valid phone number"
  }

  // Company Name
  if (!companyName || !companyName.trim()) {
    errors.companyName = "Company name is required"
  }

  // Company Address
  if (!companyAddress || !companyAddress.trim()) {
    errors.companyAddress = "Company address is required"
  }

  // ID Proof
  if (!idProof) {
    errors.idProof = "ID proof is required"
  } else if (idProof instanceof File) {
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!validTypes.includes(idProof.type)) {
      errors.idProof = "Please upload a valid document (JPEG, PNG, or PDF)"
    }
    if (idProof.size > 5 * 1024 * 1024) {
      errors.idProof = "File size should be less than 5MB"
    }
  }

  return errors
}
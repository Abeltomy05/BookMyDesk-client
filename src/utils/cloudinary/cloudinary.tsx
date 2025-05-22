import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = 'unsigned_bookmydesk_uploads';
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dnivctodr/image/upload";

export const uploadImageCloudinary = async (file: File) => {
     const formData = new FormData();
     formData.append('file', file);
     formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  try {
      const response = await axios.post(CLOUDINARY_URL, formData)
      return response.data.secure_url;
  } catch (error) {
      console.log('error while uploding image', error)
      throw error
  }
}
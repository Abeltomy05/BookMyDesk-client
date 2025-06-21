import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

export const uploadImageCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const isImage = file.type.startsWith("image/");
  const resourceType = isImage ? "image" : "raw";
  const uploadUrl = `${CLOUDINARY_BASE_URL}/${resourceType}/upload`;

  try {
    const response = await axios.post(uploadUrl, formData);
    console.log(response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error("Error while uploading to Cloudinary:", error);
    throw error;
  }
};
import axios from "axios";

const UPLOADTHING_API_KEY = import.meta.env.VITE_UPLOADTHING_API_KEY
const UPLOADTHING_URL = import.meta.env.VITE_UPLOADTHING_BASE_URL

export const uploadFileToUploadThing = async (file: File): Promise<string> => {
  try {
    // Step 1: Get presigned URL from UploadThing
    const presignedResponse = await axios.post(
      `${UPLOADTHING_URL}/api/uploadFiles`,
      {
        files: [
          {
            name: file.name,
            size: file.size,
            type: file.type,
          },
        ],
        metadata: {},
        callbackUrl: null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Uploadthing-Api-Key': UPLOADTHING_API_KEY,
        },
      }
    );

    const uploadData = presignedResponse.data?.data?.[0];

    if (!uploadData || !uploadData.fields) {
    console.error("Invalid presigned response:", presignedResponse.data);
    throw new Error("Failed to get a valid upload URL");
    }

    // Step 2: Prepare FormData and upload file using presigned URL
    const uploadFormData = new FormData();

    Object.entries(uploadData.fields).forEach(([key, value]) => {
      uploadFormData.append(key, value as string);
    });

    uploadFormData.append('file', file);

    const uploadResponse = await axios.post(uploadData.url, uploadFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (uploadResponse.status !== 204) {
      throw new Error(`Upload failed with status ${uploadResponse.status}`);
    }
    console.log("Uploaded file full path:", uploadData.fileUrl);
    const relativePath = uploadData.fileUrl.split("/f/")[1];
    console.log("Uploaded file path:", relativePath);
    return relativePath;
  } catch (error) {
    console.error('UploadThing upload error:', error);
    
    // More specific error messages
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 413) {
        throw new Error('File too large. Please select a smaller file.');
      }
      if (error.response?.status === 415) {
        throw new Error('Unsupported file type.');
      }
    }
    
    throw error instanceof Error ? error : new Error('Failed to upload file');
  }
};
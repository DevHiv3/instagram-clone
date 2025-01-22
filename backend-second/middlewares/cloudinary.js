import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary
export async function uploadToCloudinary(fileBuffer, fileName, folderName, fileType) {
  try {
    const fileExtension = path.extname(fileName).substring(1);
    const publicId = `${folderName}/${fileName.split(".")[0]}-${Date.now()}`;

    const result = await cloudinary.uploader.upload(`${fileBuffer}`, 
      {
        folder: folderName,
        public_id: publicId,
        resource_type: "image",
        format: fileExtension,
        allowed_formats: ["jpeg", "png", "jpg"],
      });
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

        // Capture specific error details
        if (error.response) {
          // Detailed Cloudinary error response
          console.error('Cloudinary Error Response:', error.response.data);
        } else {
          // Generic error (no response from Cloudinary)
          console.error('General Error:', error.message);
        }

    throw new Error('Failed to upload file to Cloudinary');
  }
}

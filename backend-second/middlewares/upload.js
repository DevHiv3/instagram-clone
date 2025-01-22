import multer from "multer"
import path from 'path'
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY        , 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

function uploadMiddleware(folderName) {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: (req, file) => {
        const folderPath = `${folderName.trim()}`; // Update the folder path here
        const fileExtension =  path.extname(file.originalname).substring(1);
        const publicId = `${file.fieldname}-${Date.now()}`;
        
        return {
          folder: folderPath,
          public_id: publicId,
          format: fileExtension,
          allowed_formats: ['jpeg', 'png', 'jpg'],
        };
      },
    });
  
    return multer({
      storage: storage,
      limits: {
        fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
      },
    });
  }

const upload = uploadMiddleware("profile-pics")

export default upload
import multer from "multer"
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY        , 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

function uploadMiddleware() {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => ({
        folder: "Reels",
        resource_type: "video",
        format: "mp4",
        public_id: `reel_${Date.now()}_${Math.round(Math.random() * 1e9)}`, // Correct way
      })
    });
  
    return multer({ storage: storage });
  }

const reel = uploadMiddleware()

export default reel
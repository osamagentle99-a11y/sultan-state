import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sultan-properties',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
  },
});

const legalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sultan-legal-maps',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
  },
});

export { cloudinary, storage, legalStorage };
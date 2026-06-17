import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads/documents');
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // FIXED: Extra backslash (\) ko hata diya gaya hai jo typo tha
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique filename banana important hai taaki files overwrite na hon
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// File filter - only PDFs
// FIXED: Parameter mein 'cd' ko badal kar 'cb' (callback) kiya gaya hai
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    // FIXED: Parameter mismatch ko theek kiya (cd -> cb)
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // Env variable se size parse karna ya default 10MB dena
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 
  }
});

export default upload;
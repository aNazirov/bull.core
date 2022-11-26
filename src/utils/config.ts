import { diskStorage } from 'multer';
import { generateFilename } from '.';

export const multerStorage = diskStorage({
  destination: './files',
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

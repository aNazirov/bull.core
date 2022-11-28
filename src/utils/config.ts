import { existsSync, mkdirSync } from 'fs';
import * as moment from 'moment';
import { diskStorage } from 'multer';
import { generateFilename } from '.';

export const multerStorage = diskStorage({
  destination: function (req, file, cb) {
    const directory = `/var/lib/core/uploads/${moment().format('DD-MM-YYYY')}`;

    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    cb(null, directory);
  },
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

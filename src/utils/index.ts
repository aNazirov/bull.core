import { Request } from 'express';
import { extname } from 'path';

export * from './config';
export * as Enums from './enums';
export * from './errorHandler';

export const generateFilename = (file: Express.Multer.File) => {
  return `${Date.now()}${extname(file.originalname)}`;
};

export const getUrl = (req: Request) =>
  `${req.protocol}://${req.get('Host')}${req.originalUrl}`;

export const parse = (query = '{}') => {
  const parsed = JSON.parse(query);

  if (typeof parsed === 'object') {
    return parsed;
  }

  return {};
};

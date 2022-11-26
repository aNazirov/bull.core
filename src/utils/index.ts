import { Request } from 'express';
import { extname } from 'path';
import { IFileMulter } from 'src/file/file.service';

export * from './config';
export * from './errorHandler';
export * as Enums from './enums'

export const generateFilename = (file: IFileMulter) => {
  return `${Date.now()}${extname(file.originalname)}`;
};

export const getUrl = (req: Request) =>
  `${req.protocol}://${req.get('Host')}${req.originalUrl}`;

export const parse = (query: string = '{}') => {
  const parsed = JSON.parse(query);

  if (typeof parsed === 'object') {
    return parsed;
  }

  return {};
};

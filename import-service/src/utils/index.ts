import { CONTENT_TYPE, DEFAULT_EXPIRATION_TIME } from 'src/constants';
import { S3Params } from 'src/models/params.model';

const replacePlusWithSpace = (key: string) => key.replace('+', ' ');

export const getParamsWithExpirationAndContentType = (
  Bucket: string,
  key: string,
  Expires: Date | number = DEFAULT_EXPIRATION_TIME,
  ContentType = CONTENT_TYPE
): S3Params => ({
  Bucket,
  Key: replacePlusWithSpace(key),
  Expires,
  ContentType,
});

export const createKeyForParsedFile = (key: string) =>
  `parsed${key.slice(key.lastIndexOf('/'), key.lastIndexOf('.'))}.json`;

export const normilizeHeader = (header: string) => header.trim().toLowerCase();

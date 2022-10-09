export const FILE_NAME_REQUIRED = 'File name is required for this operation';

export const FILE_PARSED = 'File was successfully parsed';

export const CONTENT_TYPE = 'text/csv';

export const REGION = 'eu-west-1';

export const DEFAULT_EXPIRATION_TIME = 60;

export const FOLDER_NAME = 'uploaded';

export const enum HTTPCODE {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export const enum S3Events {
  ERROR = 'error',
  DATA = 'data',
  END = 'end'
}

export const enum S3Operations {
  PUT_OBJECT = 'putObject'
}

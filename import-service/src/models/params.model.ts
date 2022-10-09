export interface S3Params {
  Bucket: string;
  Key: string;
  Expires?: Date | number;
  ContentType?: string;
}

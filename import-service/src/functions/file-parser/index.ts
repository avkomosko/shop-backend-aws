
import { handlerPath } from '@libs/handler-resolver';
import { env } from 'process';
import * as dotenv from 'dotenv';
import { FOLDER_NAME } from 'src/constants';

dotenv.config();

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
   {
      s3: {
        bucket: env.S3_BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [{ prefix: `${FOLDER_NAME}/` }],
      },
    },
  ],
};

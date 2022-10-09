import { S3 } from 'aws-sdk';
import { env } from 'process';

import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { getParamsWithExpirationAndContentType } from 'src/utils';
import { FILE_NAME_REQUIRED, FOLDER_NAME, HTTPCODE, REGION, S3Operations } from 'src/constants';
import { ValidatedEventAPIGatewayProxyEvent } from 'src/models/aws.models';

const importProductFile: ValidatedEventAPIGatewayProxyEvent<
  Record<string, string>
> = async event => {
  console.log('Event: ', `${JSON.stringify(event)}`);
  try {
    const { queryStringParameters: { name: fileName } } = event;

    if (fileName) {
      const s3 = new S3({ region: REGION });
      const key = `${FOLDER_NAME}/${fileName}`;
      const params = getParamsWithExpirationAndContentType(
        env.S3_BUCKET_NAME,
        key,
      );
      const signedUrl = await s3
        .getSignedUrlPromise(
          S3Operations.PUT_OBJECT,
          params
        );

      return formatJSONResponse(HTTPCODE.OK, { signedUrl });
    }

    throw new Error(FILE_NAME_REQUIRED);
  } catch (error) {
    return formatJSONResponse(HTTPCODE.BAD_REQUEST, {
      error: (error as Error).message,
    });
  }
};

export const main = middyfy(importProductFile);

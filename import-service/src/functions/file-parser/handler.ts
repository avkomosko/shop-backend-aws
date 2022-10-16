import { S3, SQS } from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { S3CreateEvent } from 'aws-lambda';
import csvParser from 'csv-parser';

import { createKeyForParsedFile } from 'src/utils';
import { formatJSONResponse } from '@libs/api-gateway';
import { FILE_PARSED, HTTPCODE, REGION, S3Events } from 'src/constants';
import { S3Params } from 'src/models/params.model';
import { env } from 'process';

const parser = csvParser();

const importFileParser = async (event: S3CreateEvent) => {
  try {
    const [
      {
        s3: {
          bucket: { name },
          object: { key },
        },
      },
    ] = event.Records;
    const s3 = new S3({ region: REGION });
    const sqs = new SQS({ region: REGION });
    const params: S3Params = {
      Bucket: name,
      Key: key,
    };

    const parseFileFromS3 = new Promise((resolve, reject) => {
      const parsedChunks = [];
      s3.getObject(params)
        .createReadStream()
        .pipe(parser)
        .on(S3Events.ERROR, error => {
          reject(error.message);
        })
        .on(S3Events.DATA, chunk => {
          parsedChunks.push(
            sqs
              .sendMessage({
                QueueUrl: env.SQS_QUEUE_URL,
                MessageBody: JSON.stringify(chunk),
              })
              .promise(),
          );
        })
        .on(S3Events.END, async () => {
          await Promise.allSettled(parsedChunks);
          resolve(parsedChunks);
        });
    });

    const parsedFileChunks = await parseFileFromS3;
    await s3
      .putObject({
        Bucket: name,
        Key: createKeyForParsedFile(key),
        Body: JSON.stringify(parsedFileChunks),
      })
      .promise();
    await s3.deleteObject(params).promise();

    return formatJSONResponse(HTTPCODE.OK, {
      message: FILE_PARSED,
    });
  } catch (error) {
    return formatJSONResponse(HTTPCODE.SERVER_ERROR, {
      error: (error as Error).message,
    });
  }
};

export const main = middyfy(importFileParser);

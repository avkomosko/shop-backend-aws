import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
import { env } from 'process';

import { REGION } from 'src/constants';
import { esBuildConfiguration } from './../product-service/esBuild.config';
import { importProductFile, importFileParser } from '@functions/index';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: REGION,
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      S3_BUCKET_NAME: env.S3_BUCKET_NAME,
      SQS_QUEUE_URL: { 'Fn::ImportValue': `${env.SQS_QUEUE_NAME}URL` }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: `arn:aws:s3:::${env.S3_BUCKET_NAME}`
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: `arn:aws:s3:::${env.S3_BUCKET_NAME}/*`
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: { 'Fn::ImportValue': `${env.SQS_QUEUE_NAME}` }
      }
    ],
  },
  functions: { importProductFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: esBuildConfiguration
  }
};

module.exports = serverlessConfiguration;

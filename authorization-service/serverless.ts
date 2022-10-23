import { esBuildConfig } from './esbuildConfig';
import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import basicAuthorizer from '@functions/basicAuthorizer';
import { REGION } from 'src/constants';
import { env } from 'process';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: REGION,
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      avkomosko: env.avkomosko
    },
  },
  functions: { basicAuthorizer },
  package: { individually: true },
  custom: {
    esbuild: esBuildConfig
  },
};

module.exports = serverlessConfiguration;

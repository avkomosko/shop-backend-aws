import { esBuildConfiguration } from './esBuild.config';
import type { AWS } from '@serverless/typescript';

import { getProductList, getProductById } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'productsservice',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { getProductList, getProductById },
  package: { individually: true },
  custom: {
    esbuild: esBuildConfiguration
  },
};

module.exports = serverlessConfiguration;

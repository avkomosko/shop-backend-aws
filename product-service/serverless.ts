import { swaggerConfig } from './swagger.config';
import { esBuildConfiguration } from './esBuild.config';
import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
import { env } from 'process';

import { getProductList, getProductById, uploadToDB, createProduct, catalogBatchProcess } from '@functions/index';
import { Tables } from '@functions/constants';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'productsservice',
  frameworkVersion: '3',
  plugins: [ 'serverless-auto-swagger','serverless-esbuild' ],
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
      PRODUCTS_TABLE: env.PRODUCT_TABLE_NAME,
      STOCK_TABLE: env.STOCK_TABLE_NAME,
      TOPIC_ARN: { Ref: env.SNS_TOPIC },
    },
    iamRoleStatements:[
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        Resource: `${ env.TABLE_ARN }/*`
      },
      {
        Effect: 'Allow',
        Action: [ 'sqs:*' ],
        Resource: { 'Fn::GetAtt': [ 'SQSQueue', 'Arn' ] },
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: { Ref: env.SNS_TOPIC },
      },
    ]
  },
  // import the function via paths
  functions: { getProductList, getProductById, uploadToDB, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: esBuildConfiguration,
    autoswagger: swaggerConfig,
  },
  resources: {
    Resources: {
      [Tables.PRODUCTS]: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: Tables.PRODUCTS,
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            },
          ],
           KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        }
      },
      [Tables.STOCK]: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: Tables.STOCK,
          AttributeDefinitions: [
            {
              AttributeName: 'product_id',
              AttributeType: 'S'
            },
          ],
           KeySchema: [
            {
              AttributeName: 'product_id',
              KeyType: 'HASH'
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        }
      },
      [env.SQS_QUEUE]: {
        Type: 'AWS::SQS::Queue',
        Properties: { QueueName: env.SQS_QUEUE_NAME },
      },
      [env.SNS_TOPIC]: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: env.SNS_TOPIC_NAME,
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: env.email,
          Protocol: 'email',
          TopicArn: { Ref: env.SNS_TOPIC },
        },
      },
    },
    Outputs: {
      SQSQueueInstanceARN: {
        Description: 'SQS Queue instance',
        Value: {
          'Fn::GetAtt': [ 'SQSQueue', 'Arn' ],
        },
        Export: {
          Name: env.SQS_QUEUE_NAME,
        },
      },
      SQSQueueInstanceURL: {
        Description: 'SQS Queue instance',
        Value: {
          Ref: env.SQS_QUEUE
        },
        Export: {
          Name: env.SQS_QUEUE_NAME_URL,
        },
      },
    },
  }
};

module.exports = serverlessConfiguration;

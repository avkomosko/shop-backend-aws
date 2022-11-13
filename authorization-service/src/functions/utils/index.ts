import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent
} from 'aws-lambda';

import * as dotenv from 'dotenv';

import { env } from 'process';
import { Encoding, TOKEN } from 'src/constants';

dotenv.config();

export const isWrongEventType = (
  event: APIGatewayTokenAuthorizerEvent
): boolean => event['type'] !== TOKEN;

export const generatePolicy = (
  { methodArn, authorizationToken }: APIGatewayTokenAuthorizerEvent,
  effect: string
): APIGatewayAuthorizerResult => {
  const [, principalId ] = authorizationToken.split(' ');
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: methodArn
        }
      ]
    }
  }
};

export const parseCredentials = ({
  authorizationToken
}: APIGatewayTokenAuthorizerEvent) => {
  const [, credentials] = authorizationToken
    .split(' ');
  return Buffer
    .from(credentials, Encoding.BASE_64)
    .toString(Encoding.UTF_8)
    .split(':');
};

export const isCorrectCredentials = ([
  userName,
  password
]: Array<string>): boolean => env[userName] === password;

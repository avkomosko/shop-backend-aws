import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

import {
  generatePolicy,
  isCorrectCredentials,
  isWrongEventType,
  parseCredentials
} from '@functions/utils';
import { Effects, UNAUTHORIZED } from 'src/constants';

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  _,
  callback
) => {
  if (isWrongEventType(event)) {
    callback(UNAUTHORIZED);
  }

  try {
    const policy = generatePolicy(
      event,
      isCorrectCredentials(parseCredentials(event))
        ? Effects.ALLOW
        : Effects.DENY
    );

    callback(null, policy);
  } catch (e) {
    callback(`${UNAUTHORIZED}:${(e as Error).message}`);
  }
};

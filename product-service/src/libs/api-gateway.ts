import { DATA_CREATED, HTTPCODE } from '@functions/constants';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: HTTPCODE.OK,
    body: JSON.stringify(response),
  };
};

export const formatJSONRCreatedResponse = (
  body: string | Record<string, unknown> = DATA_CREATED
) => {
  return {
    statusCode: HTTPCODE.CREATED,
    body: JSON.stringify(body),
  };
};

export const formatJSOnErrorResponse = (
  statusCode: number,
  { message }: Error
) => {
  return {
    statusCode,
    body: JSON.stringify({ message }),
  };
};

import { handlerPath } from '@libs/handler-resolver';
import { productResponseData } from './swagger-responce-data';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        cors: {
          origin: '*',
          headers: [
            'Content-Type',
            'X-Amz-Date',
            'Authorization',
            'X-Api-Key',
            'X-Amz-Security-Token'
          ]
        },
        path: 'products/{productId}',
        responseData: productResponseData,
      }
    },
  ],
};

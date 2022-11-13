import { handlerPath } from '@libs/handler-resolver';
import { productPOSTResponseData } from './swagger-responce-data';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
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
        path: 'products',
        responseData: productPOSTResponseData
      },
    },
  ],
};

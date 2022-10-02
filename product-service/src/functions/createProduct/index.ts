import { handlerPath } from '@libs/handler-resolver';
import { productPOSTResponseData } from './swagger-responce-data';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        cors: true,
        path: 'products',
        responseData: productPOSTResponseData
      },
    },
  ],
};

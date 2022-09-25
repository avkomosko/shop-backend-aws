import { handlerPath } from '@libs/handler-resolver';
import { productListResponseData } from './swagger-responce-data';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        cors: true,
        path: 'products',
        responseData: productListResponseData,
      },
    },
  ],
};

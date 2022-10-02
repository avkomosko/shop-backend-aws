import {
  formatJSOnErrorResponse,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { ProductListResponse } from '@functions/models/product-list.model';
import { getProducts } from '@functions/utils/utils';
import { HTTPCODE } from '@functions/constants';

const getProductList: ValidatedEventAPIGatewayProxyEvent<
  ProductListResponse
> = async () => {
  try {
    const products = await getProducts();
    return formatJSONResponse({ products });
  } catch (error) {
    return formatJSOnErrorResponse(HTTPCODE.SERVER_ERROR, error);
  }
};

export const main = middyfy(getProductList);

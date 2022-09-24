import { formatJSONError, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { ProductListResponse } from '@functions/models/product-list.model';
import { getProducts } from '@functions/utils/utils';

const getProductList: ValidatedEventAPIGatewayProxyEvent<ProductListResponse> = async () => {
  try {
    const products = await getProducts();
    return formatJSONResponse({ products });
  } catch (error) {
    return formatJSONError(500, error);
  }
}

export const main = middyfy(getProductList);

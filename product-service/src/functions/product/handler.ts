import { formatJSONError, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { ProductResponse } from '@functions/models/product.model';
import { findProductById } from '@functions/utils/utils';

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  ProductResponse
> = async event => {
  const { productId } = event.pathParameters;

  if (productId) {
    try {
      const product = await findProductById(productId);
      return formatJSONResponse({ product });
    } catch (error) {
      return formatJSONError(500, error);
    }
  }

  return formatJSONError(404, new Error('Product not found'));
};

export const main = middyfy(getProductById);

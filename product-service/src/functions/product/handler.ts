import {
  formatJSOnErrorResponse,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { ProductResponse } from '@functions/models/product.model';
import { findProductById } from '@functions/utils/utils';
import { HTTPCODE, PRODUCT_NOT_FOUND_MESSAGE } from '@functions/constants';

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  ProductResponse
> = async event => {
  const { productId } = event.pathParameters;

  try {
    const product = await findProductById(productId);
    return product
      ? formatJSONResponse({ product })
      : formatJSOnErrorResponse(
          HTTPCODE.NOT_FOUND,
          new Error(PRODUCT_NOT_FOUND_MESSAGE)
        );
  } catch (error) {
    return formatJSOnErrorResponse(HTTPCODE.SERVER_ERROR, error);
  }
};

export const main = middyfy(getProductById);

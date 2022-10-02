import { DynamoDB } from 'aws-sdk';

import {
  formatJSOnErrorResponse,
  formatJSONRCreatedResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product, ProductResponse, ProductWithoutCount, StockItem } from '@functions/models/product.model';
import { DATA_IS_NOT_VALID, HTTPCODE } from '@functions/constants';
import { createProductItem, createStockItem, isNotValidRequest } from '@functions/utils/utils';
const { PRODUCTS_TABLE, STOCK_TABLE } = process.env;

const dynamo = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const createProduct: ValidatedEventAPIGatewayProxyEvent<
  ProductResponse
> = async event => {
  const { count, ...productWithoutCount } = typeof event.body === 'string'
    ? JSON.parse(event.body)
    : event.body as Product;

  console.log('Product  ', event.body);

  try {
    const productItem: ProductWithoutCount = createProductItem(productWithoutCount);
    const stockItem: StockItem = createStockItem(productItem.id, count);

    if (isNotValidRequest(productItem)) {
      return formatJSOnErrorResponse(
        HTTPCODE.BAD_REQUEST,
        new Error(DATA_IS_NOT_VALID)
      );
    }

    await dynamo.put({
      TableName: PRODUCTS_TABLE,
      Item: productItem
    }).promise();

    await dynamo.put({
      TableName: STOCK_TABLE,
      Item: stockItem,
    }).promise();

    console.log('Product ', productItem, 'Stock', stockItem);

    return formatJSONRCreatedResponse({
      ...productItem as ProductWithoutCount,
      count
    })
  } catch (error) {
    return formatJSOnErrorResponse(HTTPCODE.SERVER_ERROR, error);
  }
};

export const main = middyfy(createProduct);

import { DynamoDB } from 'aws-sdk';

import {
  formatJSOnErrorResponse,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductResponse, ProductWithoutCount, StockItem } from '@functions/models/product.model';
import { HTTPCODE, PRODUCT_NOT_FOUND_MESSAGE } from '@functions/constants';
const { PRODUCTS_TABLE, STOCK_TABLE } = process.env;

const dynamo = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  ProductResponse
> = async event => {
  const { productId } = event.pathParameters;
  console.log('Event  ', event);

  try {
    const { Items: [ product ] } = await dynamo
      .query({
        TableName: PRODUCTS_TABLE,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {':id': productId }
      })
      .promise();

    const { Items: [ stock ] } = await dynamo
      .query({
        TableName: STOCK_TABLE,
        KeyConditionExpression: 'product_id = :product_id',
        ExpressionAttributeValues: {':product_id': productId }
      })
      .promise();

    console.log('Product ', product, 'Count', stock);

    return product && stock
      ? formatJSONResponse({ product: {
          ...product as ProductWithoutCount,
          count: (stock as StockItem).count
        }})
      : formatJSOnErrorResponse(
          HTTPCODE.NOT_FOUND,
          new Error(PRODUCT_NOT_FOUND_MESSAGE)
        );
  } catch (error) {
    return formatJSOnErrorResponse(HTTPCODE.SERVER_ERROR, error);
  }
};

export const main = middyfy(getProductById);

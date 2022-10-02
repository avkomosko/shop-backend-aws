import { DynamoDB } from 'aws-sdk';

import { productsMock } from '@functions/products.mock';
import {
  ProductWithoutCount,
  StockItem,
} from '@functions/models/product.model';
import { createProductItem, createStockItem } from '@functions/utils/utils';
import {
  formatJSOnErrorResponse,
  formatJSONRCreatedResponse as formatJSONRCreatedResponse,
} from '@libs/api-gateway';
import { HTTPCODE } from '@functions/constants';
import { middyfy } from '@libs/lambda';
const { PRODUCTS_TABLE, STOCK_TABLE } = process.env;

const dynamo = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const uploadToDB = async () => {
  try {
    for await (const mockItem of productsMock) {
      const { count, ...product } = mockItem;
      const productItem: ProductWithoutCount = createProductItem(product);
      const stockItem: StockItem = createStockItem(productItem.id, count);

      await dynamo
        .put({
          TableName: PRODUCTS_TABLE,
          Item: productItem,
        })
        .promise();

      await dynamo
        .put({
          TableName: STOCK_TABLE,
          Item: stockItem,
        })
        .promise();
    }

    return formatJSONRCreatedResponse();
  } catch (error) {
    return formatJSOnErrorResponse(HTTPCODE.SERVER_ERROR, error);
  }
};

export const main = middyfy(uploadToDB);

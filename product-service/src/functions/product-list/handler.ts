import { DynamoDB } from 'aws-sdk';

import {
  formatJSOnErrorResponse,
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductListResponse } from '@functions/models/product-list.model';
import { HTTPCODE } from '@functions/constants';
import { combineProductsWithStock } from '@functions/utils/utils';
import {
  ProductWithoutCount,
  StockItem,
} from '@functions/models/product.model';
const { PRODUCTS_TABLE, STOCK_TABLE } = process.env;

const dynamo = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const getProductList: ValidatedEventAPIGatewayProxyEvent<
  ProductListResponse
> = async () => {
  try {
    const { Items: productsList } = await dynamo
      .scan({
        TableName: PRODUCTS_TABLE,
      })
      .promise();

    const { Items: stock } = await dynamo
      .scan({
        TableName: STOCK_TABLE,
      })
      .promise();

    const products = combineProductsWithStock(
      productsList as Array<ProductWithoutCount>,
      stock as Array<StockItem>
    );
    return formatJSONResponse({ products });
  } catch (error) {
    return formatJSOnErrorResponse(HTTPCODE.SERVER_ERROR, error);
  }
};

export const main = middyfy(getProductList);

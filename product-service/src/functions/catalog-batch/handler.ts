import { DynamoDB, SNS } from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';

import { formatJSOnErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {
  ProductWithoutCount,
  StockItem
} from '@functions/models/product.model';
import { HTTPCODE, REGION, TOPIC_SUBJECT } from '@functions/constants';
import { createProductItem, createStockItem } from '@functions/utils/utils';

const { PRODUCTS_TABLE, STOCK_TABLE, TOPIC_ARN } = process.env;
const sns = new SNS({ region: REGION });
const dynamo = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const catalogBatchProcess = async (event: SQSEvent) => {
  const promises = [];
  event.Records.forEach(record => {
    const { count, ...product } = JSON.parse(record.body);
    const productItem: ProductWithoutCount = createProductItem(product);
    const stockItem: StockItem = createStockItem(productItem.id, count);

    promises.push(
      dynamo
        .put({
          TableName: PRODUCTS_TABLE,
          Item: productItem
        })
        .promise()
    );

    promises.push(
      dynamo
        .put({
          TableName: STOCK_TABLE,
          Item: stockItem
        })
        .promise()
    );

    promises.push(
      sns
      .publish({
        Subject: TOPIC_SUBJECT,
        Message: JSON.stringify({
          ...productItem,
          count
        }),
        TopicArn: TOPIC_ARN,
        MessageAttributes: {
          price: {
            DataType: 'Number',
            StringValue: `${productItem.price}`,
          },
          count: {
            DataType: 'Number',
            StringValue: `${stockItem.count}`
          },
        }
      })
      .promise()
    )
  });

  try {
    await Promise.allSettled(promises);
  } catch (error) {
    return formatJSOnErrorResponse(HTTPCODE.SERVER_ERROR, error);
  }
};

export const main = middyfy(catalogBatchProcess);

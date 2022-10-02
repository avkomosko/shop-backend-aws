import { v4 as uuidv4 } from 'uuid';

import { ProductList } from './../models/product-list.model';
import { StockItem } from './../models/product.model';
import { ProductWithoutCount } from '@functions/models/product.model';

export const combineProductsWithStock = (
  products: Array<ProductWithoutCount>,
  stock: Array<StockItem>
): ProductList => {
  return products.map(product => {
    const { count } = stock.find(
      stockItem => stockItem.product_id === product.id
    );
    return { ...product, count };
  });
};

export const createProductItem = (
  product: ProductWithoutCount
): ProductWithoutCount => ({
  ...product,
  id: uuidv4(),
});

export const createStockItem = (
  product_id: string,
  count: number
): StockItem => ({ product_id, count });

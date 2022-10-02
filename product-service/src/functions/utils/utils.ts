import { Product } from '@functions/models/product.model';
import { productsMock } from '@functions/products.mock';

export const findProductById = async (id: string): Promise<Product> =>
  productsMock.find((item: Product) => item.id === id);

export const getProducts = async () => productsMock;

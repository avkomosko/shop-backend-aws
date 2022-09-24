import { Product } from './product.model';

export type ProductList = Array<Product>

export interface ProductListResponse {
  products: ProductList
}

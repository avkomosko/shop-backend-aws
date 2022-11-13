export interface Product {
  count: number,
  description: string,
  id: string,
  price: number,
  title: string,
  imgUrl: string
}

export type ProductWithoutCount = Omit<Product, 'count'>;

export interface StockItem {
  product_id: string,
  count: number
}

export interface ProductResponse {
  product: Product
}

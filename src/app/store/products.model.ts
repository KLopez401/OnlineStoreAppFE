export interface ProductDetail {
  name: string;
  description: string;
  price: string;
  id: string;
  dateAdded: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: string;
}

export interface UpdateProductPayload {
  id: string;
  product: ProductPayload;
}

export type ProductState = {
  productList: ProductDetail[];
  productDetail: ProductDetail | null;
  isProductListLoading: boolean;
  isProductAdding: boolean;
  isProductUpdating: boolean;
  isProductDeleting: boolean;
  isProductDetailLoading: boolean;
};

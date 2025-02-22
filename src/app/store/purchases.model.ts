import { CustomerDetail } from './customers.model';
import { ProductDetail } from './products.model';

export interface PurchaseDetail {
  customer: CustomerDetail;
  products: ProductDetail[];
  total: number;
  id: string;
  purchaseDate: string;
  receiptReference: string;
}

export interface PurchasePayload {
  customerId: string;
  products: ProductDetail[];
  total: number;
}

export type PurchasesState = {
  purchaseList: PurchaseDetail[];
  purchaseDetail: PurchaseDetail | null;
  isPurchaseListLoading: boolean;
  isPurchaseAdding: boolean;
  isPurchaseDetailLoading: boolean;
};

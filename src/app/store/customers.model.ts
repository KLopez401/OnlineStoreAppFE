export interface CustomerDetail {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  id: string;
  dateAdded: string;
}

export interface CustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface UpdateCustomerPayload {
  id: string;
  customer: CustomerPayload;
}

export type CustomerState = {
  customerList: CustomerDetail[];
  customerDetail: CustomerDetail | null;
  isCustomerListLoading: boolean;
  isCustomerAdding: boolean;
  isCustomerUpdating: boolean;
  isCustomerDeleting: boolean;
  isCustomerDetailLoading: boolean;
};

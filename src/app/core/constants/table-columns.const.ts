import { ColumnDefinition } from '../models/column-definition.model';

export const CUSTOMERS_TABLE_COLUMNS: ColumnDefinition[] = [
  { id: 1, field: 'firstName', displayName: 'First Name', sortable: true },
  { id: 2, field: 'lastName', displayName: 'Last Name', sortable: true },
  { id: 3, field: 'email', displayName: 'Email', sortable: true },
  { id: 4, field: 'phone', displayName: 'Phone', sortable: true },
  { id: 5, field: 'dateAdded', displayName: 'Date Added', sortable: true },
  { id: 6, field: 'action', displayName: 'Action' }
];

export const PRODUCTS_TABLE_COLUMNS: ColumnDefinition[] = [
  { id: 1, field: 'name', displayName: 'Name', sortable: true },
  { id: 2, field: 'description', displayName: 'Description', sortable: true },
  { id: 3, field: 'price', displayName: 'Price', sortable: true },
  { id: 4, field: 'action', displayName: 'Action' }
];

export const PURCHASES_TABLE_COLUMNS: ColumnDefinition[] = [
  { id: 1, field: 'receiptReference', displayName: 'Reference', sortable: true },
  { id: 2, field: 'purchaseDate', displayName: 'Purchase Date', sortable: true },
  { id: 3, field: 'total', displayName: 'Total', sortable: true },
  { id: 4, field: 'action', displayName: 'Action' }
];

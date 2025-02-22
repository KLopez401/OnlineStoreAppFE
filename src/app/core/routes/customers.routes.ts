import { Routes } from '@angular/router';
import { CustomerTableComponent } from '../../features/customers/customer-table/customer-table.component';
import { CustomerDetailComponent } from '../../features/customers/customer-detail/customer-detail.component';

export const CUSTOMERS_ROUTES: Routes = [
  {
    path: '',
    component: CustomerTableComponent
  },
  {
    path: 'add',
    component: CustomerDetailComponent
  },
  {
    path: ':id',
    component: CustomerDetailComponent
  }
];

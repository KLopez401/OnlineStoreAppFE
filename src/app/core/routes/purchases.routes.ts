import { Routes } from '@angular/router';
import { PurchaseTableComponent } from '../../features/purchases/purchase-table/purchase-table.component';
import { PurchaseDetailComponent } from '../../features/purchases/purchase-detail/purchase-detail.component';

export const PURCHASES_ROUTES: Routes = [
  {
    path: '',
    component: PurchaseTableComponent
  },
  {
    path: 'add',
    component: PurchaseDetailComponent
  },
  {
    path: ':id',
    component: PurchaseDetailComponent
  }
];

import { Routes } from '@angular/router';
import { ProductTableComponent } from '../../features/products/product-table/product-table.component';
import { ProductDetailComponent } from '../../features/products/product-detail/product-detail.component';

export const PRODUCTS_ROUTES: Routes = [
  { path: '', component: ProductTableComponent },
  { path: 'add', component: ProductDetailComponent },
  { path: ':id', component: ProductDetailComponent }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'customers',
    loadChildren: () => import('./customers.routes').then((routes) => routes.CUSTOMERS_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () => import('./products.routes').then((routes) => routes.PRODUCTS_ROUTES)
  },
  {
    path: 'purchases',
    loadChildren: () => import('./purchases.routes').then((routes) => routes.PURCHASES_ROUTES)
  },
  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'customers'
  }
];

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ProductPayload, ProductState, UpdateProductPayload } from './products.model';
import { inject } from '@angular/core';
import { ProductsService } from '../core/services/products.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';
import { EventStateService } from '../core/services/event-state.service';

const initialState: ProductState = {
  productList: [],
  productDetail: null,
  isProductListLoading: false,
  isProductAdding: false,
  isProductUpdating: false,
  isProductDeleting: false,
  isProductDetailLoading: false
};

export const ProductsStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState(initialState),
  withMethods(
    (
      store,
      productsService = inject(ProductsService),
      router = inject(Router),
      eventStateService = inject(EventStateService)
    ) => ({
      getProductList: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { isProductListLoading: true });
          }),
          switchMap(() => productsService.getProductList()),
          tapResponse({
            next: (productList) => {
              patchState(store, {
                productList: productList,
                isProductListLoading: false
              });
            },
            error: () => {
              patchState(store, {
                isProductListLoading: false
              });
            }
          })
        )
      ),
      addProduct: rxMethod<{ payload: ProductPayload }>(
        pipe(
          tap(() => {
            patchState(store, { isProductAdding: true });
          }),
          switchMap(({ payload }) => productsService.addProduct(payload)),
          tapResponse({
            // TODO: update type to actual response
            next: (res: any) => {
              patchState(store, { isProductAdding: false });
              router.navigateByUrl('/products');
            },
            error: () => {
              patchState(store, { isProductAdding: false });
            }
          })
        )
      ),
      updateProduct: rxMethod<{ payload: UpdateProductPayload }>(
        pipe(
          tap(() => {
            patchState(store, { isProductUpdating: true });
          }),
          switchMap(({ payload }) => productsService.updateProduct(payload)),
          tapResponse({
            // TODO: update type to actual response
            next: (res: any) => {
              patchState(store, { isProductUpdating: false });
              router.navigateByUrl('/products');
            },
            error: () => {
              patchState(store, { isProductUpdating: false });
            }
          })
        )
      ),
      getProduct: rxMethod<{ id: string }>(
        pipe(
          tap(() => {
            patchState(store, { isProductDetailLoading: true });
          }),
          switchMap(({ id }) => productsService.getProduct(id)),
          tapResponse({
            next: (res) => {
              patchState(store, { productDetail: res, isProductDetailLoading: false });
            },
            error: () => {
              patchState(store, { isProductDetailLoading: false });
            }
          })
        )
      ),
      deleteProduct: rxMethod<{ id: string }>(
        pipe(
          tap(({ id }) => {
            patchState(store, { isProductDeleting: true });
          }),
          switchMap(({ id }) => productsService.deleteProduct(id)),
          tapResponse({
            next: () => {
              eventStateService.refreshTable = true;
              eventStateService.isItemDeleted = true;
              patchState(store, { isProductDeleting: false });
            },
            error: () => {
              eventStateService.isItemDeleted = true;
              patchState(store, { isProductDeleting: false });
            }
          })
        )
      ),
      clearProducts(): void {
        patchState(store, { productList: [] });
      },
      clearProductDetail(): void {
        patchState(store, { productDetail: null, isProductDetailLoading: false });
      }
    })
  )
);

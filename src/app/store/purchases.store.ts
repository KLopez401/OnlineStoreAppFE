import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { PurchasePayload, PurchasesState } from './purchases.model';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { PurchasesService } from '../core/services/purchases.service';
import { inject } from '@angular/core';
import { EventStateService } from '../core/services/event-state.service';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';

const initialState: PurchasesState = {
  purchaseList: [],
  purchaseDetail: null,
  isPurchaseListLoading: false,
  isPurchaseAdding: false,
  isPurchaseDetailLoading: false
};

export const PurchasesStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState(initialState),
  withMethods(
    (
      store,
      purchasesService = inject(PurchasesService),
      router = inject(Router),
      eventStateService = inject(EventStateService)
    ) => ({
      getPurchaseList: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { isPurchaseListLoading: true });
          }),
          switchMap(() => purchasesService.getPurchaseList()),
          tapResponse({
            next: (purchaseList) => {
              patchState(store, { purchaseList: purchaseList, isPurchaseListLoading: false });
            },
            error: () => {
              patchState(store, { isPurchaseListLoading: false });
            }
          })
        )
      ),
      addPurchase: rxMethod<{ payload: PurchasePayload }>(
        pipe(
          tap(() => {
            patchState(store, { isPurchaseAdding: true });
          }),
          switchMap(({ payload }) => purchasesService.addPurchase(payload)),
          tapResponse({
            next: (res: any) => {
              patchState(store, { isPurchaseAdding: false });
              router.navigateByUrl('/purchases');
            },
            error: () => {
              patchState(store, { isPurchaseAdding: false });
            }
          })
        )
      ),
      getPurchase: rxMethod<{ id: string }>(
        pipe(
          tap(() => {
            patchState(store, { isPurchaseDetailLoading: true });
          }),
          switchMap(({ id }) => purchasesService.getPurchase(id)),
          tapResponse({
            next: (res) => {
              patchState(store, { purchaseDetail: res, isPurchaseDetailLoading: false });
            },
            error: () => {
              patchState(store, { isPurchaseDetailLoading: false });
            }
          })
        )
      ),
      clearPurchases(): void {
        patchState(store, { purchaseList: [] });
      },
      clearPurchaseDetail(): void {
        patchState(store, { purchaseDetail: null, isPurchaseDetailLoading: false });
      }
    })
  )
);

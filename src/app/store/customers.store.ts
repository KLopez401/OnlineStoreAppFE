import { inject } from '@angular/core';
import { CustomersService } from '../core/services/customers.service';
import { CustomerPayload, CustomerState, UpdateCustomerPayload } from './customers.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { EventStateService } from '../core/services/event-state.service';
import { Router } from '@angular/router';

const initialState: CustomerState = {
  customerList: [],
  customerDetail: null,
  isCustomerListLoading: false,
  isCustomerAdding: false,
  isCustomerUpdating: false,
  isCustomerDeleting: false,
  isCustomerDetailLoading: false
};

export const CustomersStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState(initialState),
  withMethods(
    (
      store,
      customersService = inject(CustomersService),
      eventStateService = inject(EventStateService),
      router = inject(Router)
    ) => ({
      getCustomerList: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { isCustomerListLoading: true });
          }),
          switchMap(() => customersService.getCustomerList()),
          tapResponse({
            next: (customerList) => {
              patchState(store, {
                customerList: customerList,
                isCustomerListLoading: false
              });
            },
            error: () => {
              patchState(store, {
                isCustomerListLoading: false
              });
            }
          })
        )
      ),
      addCustomer: rxMethod<{ payload: CustomerPayload }>(
        pipe(
          tap(() => {
            patchState(store, { isCustomerAdding: true });
          }),
          switchMap(({ payload }) => customersService.addCustomer(payload)),
          tapResponse({
            next: (res: any) => {
              patchState(store, { isCustomerAdding: false });
              router.navigateByUrl('/customers');
            },
            error: () => {
              patchState(store, { isCustomerAdding: false });
            }
          })
        )
      ),
      updateCustomer: rxMethod<{ payload: UpdateCustomerPayload }>(
        pipe(
          tap(() => {
            patchState(store, { isCustomerUpdating: true });
          }),
          switchMap(({ payload }) => customersService.updateCustomer(payload)),
          tapResponse({
            // TODO: update type to actual response
            next: (res: any) => {
              patchState(store, { isCustomerUpdating: false });
              router.navigateByUrl('/customers');
            },
            error: () => {
              patchState(store, { isCustomerUpdating: false });
            }
          })
        )
      ),
      getCustomer: rxMethod<{ id: string }>(
        pipe(
          tap(() => {
            patchState(store, { isCustomerDetailLoading: true });
          }),
          switchMap(({ id }) => customersService.getCustomer(id)),
          tapResponse({
            next: (res) => {
              patchState(store, { customerDetail: res, isCustomerDetailLoading: false });
            },
            error: () => {
              patchState(store, { isCustomerDetailLoading: false });
            }
          })
        )
      ),
      deleteCustomer: rxMethod<{ id: string }>(
        pipe(
          tap(() => {
            patchState(store, { isCustomerDeleting: true });
          }),
          switchMap(({ id }) => customersService.deleteCustomer(id)),
          tapResponse({
            next: () => {
              eventStateService.refreshTable = true;
              eventStateService.isItemDeleted = true;
              patchState(store, { isCustomerDeleting: false });
            },
            error: () => {
              eventStateService.isItemDeleted = true;
              patchState(store, { isCustomerDeleting: false });
            }
          })
        )
      ),
      clearCustomers(): void {
        patchState(store, { customerList: [] });
      },
      clearCustomerDetail(): void {
        patchState(store, { customerDetail: null, isCustomerDetailLoading: false });
      }
    })
  )
);

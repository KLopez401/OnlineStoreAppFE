import { catchError } from 'rxjs';
import { patchState, WritableStateSource } from '@ngrx/signals';
import { throwError } from 'rxjs';

export function handleError<T extends Record<string, any>>(
  store: WritableStateSource<T>,
  properties: { key: keyof T; value: boolean }[]
) {
  return catchError((error) => {
    const updatedState: Partial<T> = {};

    properties.forEach(({ key, value }) => {
      updatedState[key] = value as T[typeof key];
    });

    patchState(store, updatedState);
    return throwError(() => error);
  });
}

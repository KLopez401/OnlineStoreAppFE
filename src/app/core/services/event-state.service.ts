import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventStateService {
  private _refreshTable$ = new Subject<boolean>();
  private _isItemDeleted$ = new Subject<boolean>();

  get refreshTable$() {
    return this._refreshTable$.asObservable();
  }

  set refreshTable(refresh: boolean) {
    this._refreshTable$.next(refresh);
  }

  get isItemDeleted$() {
    return this._isItemDeleted$.asObservable();
  }

  set isItemDeleted(refresh: boolean) {
    this._isItemDeleted$.next(refresh);
  }

  constructor() {}
}

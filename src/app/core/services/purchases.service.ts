import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PurchaseDetail, PurchasePayload } from '../../store/purchases.model';
import { delay, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {
  private http = inject(HttpClient);
  private datePipe = inject(DatePipe);

  constructor() {}

  getPurchaseList() {
    return this.http.get<PurchaseDetail[]>(`${environment.API}CustomerPurchaseApi`).pipe(
      map((purchases) =>
        purchases.map((purchase) => ({
          ...purchase,
          purchaseDate: this.datePipe.transform(purchase.purchaseDate, 'MM/dd/yyyy')!
        }))
      ),
      delay(1000)
    );
  }

  getPurchase(id: string): Observable<PurchaseDetail> {
    return this.http.get<PurchaseDetail>(`${environment.API}CustomerPurchaseApi/${id}`);
  }

  addPurchase(payload: PurchasePayload) {
    return this.http.post(`${environment.API}CustomerPurchaseApi`, payload);
  }
}

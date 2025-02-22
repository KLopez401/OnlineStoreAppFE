import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { ProductDetail, ProductPayload, UpdateProductPayload } from '../../store/products.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private datePipe = inject(DatePipe);

  constructor() {}

  getProductList(): Observable<ProductDetail[]> {
    return this.http.get<ProductDetail[]>(`${environment.API}ProductApi`);
  }

  getProduct(id: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${environment.API}ProductApi/${id}`);
  }

  addProduct(payload: ProductPayload) {
    return this.http.post(`${environment.API}ProductApi`, payload);
  }

  updateProduct(payload: UpdateProductPayload) {
    return this.http.put(`${environment.API}ProductApi/${payload.id}`, payload.product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${environment.API}ProductApi/${id}`);
  }
}

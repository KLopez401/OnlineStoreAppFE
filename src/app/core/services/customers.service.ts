import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import {
  CustomerPayload,
  CustomerDetail,
  UpdateCustomerPayload
} from '../../store/customers.model';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private http = inject(HttpClient);
  private datePipe = inject(DatePipe);

  constructor() {}

  getCustomerList(): Observable<CustomerDetail[]> {
    return this.http.get<CustomerDetail[]>(`${environment.API}CustomerApi`).pipe(
      map(customers => 
        customers.map(customer => ({
          ...customer,
          dateAdded: this.datePipe.transform(customer.dateAdded, 'MM/dd/yyyy')!
        }))
      )
    );
  }

  getCustomer(id: string): Observable<CustomerDetail> {
    return this.http.get<CustomerDetail>(`${environment.API}CustomerApi/${id}`);
  }

  addCustomer(payload: CustomerPayload) {
    return this.http.post(`${environment.API}CustomerApi`, payload);
  }

  updateCustomer(payload: UpdateCustomerPayload) {
    return this.http.put(`${environment.API}CustomerApi/${payload.id}`, payload.customer);
  }

  deleteCustomer(id: string) {
    return this.http.delete(`${environment.API}CustomerApi/${id}`);
  }
}

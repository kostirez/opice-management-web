import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Customer, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private endpoint = 'customers';

  constructor(private apiService: ApiService) {}

  getCustomers(params?: Record<string, any>): Observable<ApiListResponse<Customer>> {
    return this.apiService.get<Customer>(this.endpoint, params);
  }

  getCustomer(documentId: string, params?: Record<string, any>): Observable<ApiResponse<Customer>> {
    console.log('getCustomer, params: ', params);
    return this.apiService.getById<Customer>(this.endpoint, documentId, params);
  }

  createCustomer(customer: Partial<Customer>): Observable<ApiResponse<Customer>> {
    return this.apiService.post<Customer>(this.endpoint, customer);
  }

  updateCustomer(documentId: string, customer: Partial<Customer>): Observable<ApiResponse<Customer>> {
    return this.apiService.put<Customer>(this.endpoint, documentId, customer);
  }

  deleteCustomer(documentId: string): Observable<void> {
    return this.apiService.delete<Customer>(this.endpoint, documentId);
  }
}

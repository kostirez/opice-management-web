import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Order, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private endpoint = 'orders';
  // Reuse the same API base used across the app
  private baseUrl = 'http://localhost:1337/api';

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getOrders(params?: Record<string, any>): Observable<ApiListResponse<Order>> {
    return this.apiService.get<Order>(this.endpoint, params);
  }

  getOrder(documentId: string, params?: Record<string, any>): Observable<ApiResponse<Order>> {
    return this.apiService.getById<Order>(this.endpoint, documentId, params);
  }

  createOrder(order: Partial<Order>): Observable<ApiResponse<Order>> {
    return this.apiService.post<Order>(this.endpoint, order);
  }

  updateOrder(documentId: string, order: Partial<Order>): Observable<ApiResponse<Order>> {
    return this.apiService.put<Order>(this.endpoint, documentId, order);
  }

  deleteOrder(documentId: string): Observable<void> {
    return this.apiService.delete<Order>(this.endpoint, documentId);
  }

  /**
   * Generate invoice PDF for a customer and month.
   * Month format expected by backend: YYYY-MM
   */
  generateInvoice(customerId: string, month: string): Observable<Blob> {
    const url = `${this.baseUrl}/invoice/${customerId}/${month}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}

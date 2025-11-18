import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Order, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private endpoint = 'orders';

  constructor(private apiService: ApiService) {}

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
}

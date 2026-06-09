import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Delivery, ApiResponse, ApiListResponse, BoxBatch } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private endpoint = 'deliveries';
  private boxBatchEndpoint = 'box-batches';

  constructor(private apiService: ApiService) {}

  getDeliveries(params?: Record<string, any>): Observable<ApiListResponse<Delivery>> {
    return this.apiService.get<Delivery>(this.endpoint, params);
  }

  getDelivery(documentId: string, params?: Record<string, any>): Observable<ApiResponse<Delivery>> {
    return this.apiService.getById<Delivery>(this.endpoint, documentId, params);
  }

  createDelivery(delivery: any): Observable<ApiResponse<Delivery>> {
    return this.apiService.post<Delivery>(this.endpoint, delivery);
  }

  updateDelivery(documentId: string, delivery: any): Observable<ApiResponse<Delivery>> {
    return this.apiService.put<Delivery>(this.endpoint, documentId, delivery);
  }

  deleteDelivery(documentId: string): Observable<void> {
    return this.apiService.delete<Delivery>(this.endpoint, documentId);
  }

  createBoxBatch(boxBatch: any): Observable<ApiResponse<BoxBatch>> {
    return this.apiService.post<BoxBatch>(this.boxBatchEndpoint, boxBatch);
  }

  updateBoxBatch(documentId: string, boxBatch: any): Observable<ApiResponse<BoxBatch>> {
    return this.apiService.put<BoxBatch>(this.boxBatchEndpoint, documentId, boxBatch);
  }

  deleteBoxBatch(documentId: string): Observable<void> {
    return this.apiService.delete<BoxBatch>(this.boxBatchEndpoint, documentId);
  }
}

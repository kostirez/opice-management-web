import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BatchDeliveryDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BatchDeliveryService {
  private endpoint = 'batch-deliveries';

  constructor(private apiService: ApiService) {}

  getBatchDeliveries(params?: Record<string, any>): Observable<ApiListResponse<BatchDeliveryDto>> {
    return this.apiService.get<BatchDeliveryDto>(this.endpoint, params);
  }

  getBatchDelivery(documentId: string, params?: Record<string, any>): Observable<ApiResponse<BatchDeliveryDto>> {
    return this.apiService.getById<BatchDeliveryDto>(this.endpoint, documentId, params);
  }

  createBatchDelivery(batchDelivery: Partial<BatchDeliveryDto>): Observable<ApiResponse<BatchDeliveryDto>> {
    return this.apiService.post<BatchDeliveryDto>(this.endpoint, batchDelivery);
  }

  updateBatchDelivery(documentId: string, batchDelivery: Partial<BatchDeliveryDto>): Observable<ApiResponse<BatchDeliveryDto>> {
    return this.apiService.put<BatchDeliveryDto>(this.endpoint, documentId, batchDelivery);
  }

  deleteBatchDelivery(documentId: string): Observable<void> {
    return this.apiService.delete<BatchDeliveryDto>(this.endpoint, documentId);
  }
}

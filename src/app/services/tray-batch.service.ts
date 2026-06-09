import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TrayBatchDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TrayBatchService {
  private endpoint = 'tray-batches';

  constructor(private apiService: ApiService) {}

  getTrayBatches(params?: Record<string, any>): Observable<ApiListResponse<TrayBatchDto>> {
    return this.apiService.get<TrayBatchDto>(this.endpoint, params);
  }

  getTrayBatch(documentId: string, params?: Record<string, any>): Observable<ApiResponse<TrayBatchDto>> {
    return this.apiService.getById<TrayBatchDto>(this.endpoint, documentId, params);
  }

  createTrayBatch(trayBatch: Partial<TrayBatchDto>): Observable<ApiResponse<TrayBatchDto>> {
    return this.apiService.post<TrayBatchDto>(this.endpoint, trayBatch);
  }

  updateTrayBatch(documentId: string, trayBatch: Partial<TrayBatchDto>): Observable<ApiResponse<TrayBatchDto>> {
    return this.apiService.put<TrayBatchDto>(this.endpoint, documentId, trayBatch);
  }

  deleteTrayBatch(documentId: string): Observable<void> {
    return this.apiService.delete<TrayBatchDto>(this.endpoint, documentId);
  }
}

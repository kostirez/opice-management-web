import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Batch, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private endpoint = 'batches';
  private baseUrl = 'http://localhost:1337/api';

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  getBatches(params?: Record<string, any>): Observable<ApiListResponse<Batch>> {
    return this.apiService.get<Batch>(this.endpoint, params);
  }

  getBatch(documentId: string, params?: Record<string, any>): Observable<ApiResponse<Batch>> {
    return this.apiService.getById<Batch>(this.endpoint, documentId, params);
  }

  createBatch(batch: Partial<Batch>): Observable<ApiResponse<Batch>> {
    return this.apiService.post<Batch>(this.endpoint, batch);
  }

  updateBatch(documentId: string, batch: Partial<Batch>): Observable<ApiResponse<Batch>> {
    return this.apiService.put<Batch>(this.endpoint, documentId, batch);
  }

  deleteBatch(documentId: string): Observable<void> {
    return this.apiService.delete<Batch>(this.endpoint, documentId);
  }

  generateSingleBatch(orderId: number, date: string): Observable<ApiResponse<Batch>> {
    return this.http.post<ApiResponse<Batch>>(`${this.baseUrl}/${this.endpoint}/generateSingleBatch`, {
      orderId,
      date
    });
  }
}

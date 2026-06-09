import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BatchHarvestDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BatchHarvestService {
  private endpoint = 'batch-harvests';

  constructor(private apiService: ApiService) {}

  getBatchHarvests(params?: Record<string, any>): Observable<ApiListResponse<BatchHarvestDto>> {
    return this.apiService.get<BatchHarvestDto>(this.endpoint, params);
  }

  getBatchHarvest(documentId: string, params?: Record<string, any>): Observable<ApiResponse<BatchHarvestDto>> {
    return this.apiService.getById<BatchHarvestDto>(this.endpoint, documentId, params);
  }

  createBatchHarvest(batchHarvest: Partial<BatchHarvestDto>): Observable<ApiResponse<BatchHarvestDto>> {
    return this.apiService.post<BatchHarvestDto>(this.endpoint, batchHarvest);
  }

  updateBatchHarvest(documentId: string, batchHarvest: Partial<BatchHarvestDto>): Observable<ApiResponse<BatchHarvestDto>> {
    return this.apiService.put<BatchHarvestDto>(this.endpoint, documentId, batchHarvest);
  }

  deleteBatchHarvest(documentId: string): Observable<void> {
    return this.apiService.delete<BatchHarvestDto>(this.endpoint, documentId);
  }
}

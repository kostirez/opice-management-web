import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CropCycleHarvestDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CropCycleHarvestService {
  private endpoint = 'crop-cycle-harvests';

  constructor(private apiService: ApiService) {}

  getCropCycleHarvests(params?: Record<string, any>): Observable<ApiListResponse<CropCycleHarvestDto>> {
    return this.apiService.get<CropCycleHarvestDto>(this.endpoint, params);
  }

  getCropCycleHarvest(documentId: string, params?: Record<string, any>): Observable<ApiResponse<CropCycleHarvestDto>> {
    return this.apiService.getById<CropCycleHarvestDto>(this.endpoint, documentId, params);
  }

  createCropCycleHarvest(cropCycleHarvest: Partial<CropCycleHarvestDto>): Observable<ApiResponse<CropCycleHarvestDto>> {
    return this.apiService.post<CropCycleHarvestDto>(this.endpoint, cropCycleHarvest);
  }

  updateCropCycleHarvest(documentId: string, cropCycleHarvest: Partial<CropCycleHarvestDto>): Observable<ApiResponse<CropCycleHarvestDto>> {
    return this.apiService.put<CropCycleHarvestDto>(this.endpoint, documentId, cropCycleHarvest);
  }

  deleteCropCycleHarvest(documentId: string): Observable<void> {
    return this.apiService.delete<CropCycleHarvestDto>(this.endpoint, documentId);
  }
}

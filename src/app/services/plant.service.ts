import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PlantDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private endpoint = 'plants';

  constructor(private apiService: ApiService) {}

  getPlants(params?: Record<string, any>): Observable<ApiListResponse<PlantDto>> {
    return this.apiService.get<PlantDto>(this.endpoint, params);
  }

  getPlant(documentId: string, params?: Record<string, any>): Observable<ApiResponse<PlantDto>> {
    return this.apiService.getById<PlantDto>(this.endpoint, documentId, params);
  }

  createPlant(plant: Partial<PlantDto>): Observable<ApiResponse<PlantDto>> {
    return this.apiService.post<PlantDto>(this.endpoint, plant);
  }

  updatePlant(documentId: string, plant: Partial<PlantDto>): Observable<ApiResponse<PlantDto>> {
    return this.apiService.put<PlantDto>(this.endpoint, documentId, plant);
  }

  deletePlant(documentId: string): Observable<void> {
    return this.apiService.delete<PlantDto>(this.endpoint, documentId);
  }
}

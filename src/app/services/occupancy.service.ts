import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { OccupancyDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OccupancyService {
  private endpoint = 'occupancies';

  constructor(private apiService: ApiService) {}

  getOccupancies(params?: Record<string, any>): Observable<ApiListResponse<OccupancyDto>> {
    return this.apiService.get<OccupancyDto>(this.endpoint, params);
  }

  getOccupancy(documentId: string, params?: Record<string, any>): Observable<ApiResponse<OccupancyDto>> {
    return this.apiService.getById<OccupancyDto>(this.endpoint, documentId, params);
  }

  createOccupancy(occupancy: Partial<OccupancyDto>): Observable<ApiResponse<OccupancyDto>> {
    return this.apiService.post<OccupancyDto>(this.endpoint, occupancy);
  }

  updateOccupancy(documentId: string, occupancy: Partial<OccupancyDto>): Observable<ApiResponse<OccupancyDto>> {
    return this.apiService.put<OccupancyDto>(this.endpoint, documentId, occupancy);
  }

  deleteOccupancy(documentId: string): Observable<void> {
    return this.apiService.delete<OccupancyDto>(this.endpoint, documentId);
  }
}

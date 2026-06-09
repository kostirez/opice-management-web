import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CropCycleDto, ApiResponse, ApiListResponse, CropCycleCustomListItemDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CropCycleService {
  private endpoint = 'crop-cycles';

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getCropCycles(params?: Record<string, any>): Observable<ApiListResponse<CropCycleDto>> {
    return this.apiService.get<CropCycleDto>(this.endpoint, params);
  }

  getCustomList(params?: Record<string, any>): Observable<CropCycleCustomListItemDto[]> {
    return this.http.get<CropCycleCustomListItemDto[]>(`http://localhost:1337/api/${this.endpoint}/custom-list`, {
      params,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
    });
  }

  getCropCycle(documentId: string, params?: Record<string, any>): Observable<ApiResponse<CropCycleDto>> {
    return this.apiService.getById<CropCycleDto>(this.endpoint, documentId, params);
  }

  createCropCycle(cropCycle: Partial<CropCycleDto>): Observable<ApiResponse<CropCycleDto>> {
    return this.apiService.post<CropCycleDto>(this.endpoint, cropCycle);
  }

  createMany(data: any[]): Observable<CropCycleDto[]> {
    return this.http.post<CropCycleDto[]>(`http://localhost:1337/api/${this.endpoint}/create-many`, { data }, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
    });
  }

  updateCropCycle(documentId: string, cropCycle: Partial<CropCycleDto>): Observable<ApiResponse<CropCycleDto>> {
    return this.apiService.put<CropCycleDto>(this.endpoint, documentId, cropCycle);
  }

  move(id: string, data: { state?: string, placeCode?: string }): Observable<ApiResponse<CropCycleDto>> {
    return this.apiService.patch<CropCycleDto>(this.endpoint, `${id}/move`, data);
  }

  deleteCropCycle(documentId: string): Observable<void> {
    return this.apiService.delete<CropCycleDto>(this.endpoint, documentId);
  }
}

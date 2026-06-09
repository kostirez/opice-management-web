import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DayYieldDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DayYieldService {
  private endpoint = 'day-yields';

  constructor(private apiService: ApiService) {}

  getDayYields(params?: Record<string, any>): Observable<ApiListResponse<DayYieldDto>> {
    return this.apiService.get<DayYieldDto>(this.endpoint, params);
  }

  getDayYield(documentId: string, params?: Record<string, any>): Observable<ApiResponse<DayYieldDto>> {
    return this.apiService.getById<DayYieldDto>(this.endpoint, documentId, params);
  }

  createDayYield(dayYield: Partial<DayYieldDto>): Observable<ApiResponse<DayYieldDto>> {
    return this.apiService.post<DayYieldDto>(this.endpoint, dayYield);
  }

  updateDayYield(documentId: string, dayYield: Partial<DayYieldDto>): Observable<ApiResponse<DayYieldDto>> {
    return this.apiService.put<DayYieldDto>(this.endpoint, documentId, dayYield);
  }

  deleteDayYield(documentId: string): Observable<void> {
    return this.apiService.delete<DayYieldDto>(this.endpoint, documentId);
  }
}

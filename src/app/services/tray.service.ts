import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TrayDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TrayService {
  private endpoint = 'trays';

  constructor(private apiService: ApiService) {}

  getTrays(params?: Record<string, any>): Observable<ApiListResponse<TrayDto>> {
    return this.apiService.get<TrayDto>(this.endpoint, params);
  }

  getTray(documentId: string, params?: Record<string, any>): Observable<ApiResponse<TrayDto>> {
    return this.apiService.getById<TrayDto>(this.endpoint, documentId, params);
  }

  createTray(tray: Partial<TrayDto>): Observable<ApiResponse<TrayDto>> {
    return this.apiService.post<TrayDto>(this.endpoint, tray);
  }

  updateTray(documentId: string, tray: Partial<TrayDto>): Observable<ApiResponse<TrayDto>> {
    return this.apiService.put<TrayDto>(this.endpoint, documentId, tray);
  }

  deleteTray(documentId: string): Observable<void> {
    return this.apiService.delete<TrayDto>(this.endpoint, documentId);
  }
}

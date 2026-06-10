import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DayActionDto, ApiResponse, ApiListResponse } from '../models';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DayActionService {
  private endpoint = 'day-actions';

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getDayActions(params?: Record<string, any>): Observable<ApiListResponse<DayActionDto>> {
    return this.apiService.get<DayActionDto>(this.endpoint, params);
  }

  getCustomList(params?: Record<string, any>): Observable<DayActionDto[]> {
    return this.http.get<DayActionDto[]>(`${environment.apiBaseUrl}/${this.endpoint}/custom-list`, {
      params,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
    });
  }

  getDayAction(documentId: string, params?: Record<string, any>): Observable<ApiResponse<DayActionDto>> {
    return this.apiService.getById<DayActionDto>(this.endpoint, documentId, params);
  }

  createDayAction(dayAction: Partial<DayActionDto>): Observable<ApiResponse<DayActionDto>> {
    return this.apiService.post<DayActionDto>(this.endpoint, dayAction);
  }

  updateDayAction(documentId: string, dayAction: Partial<DayActionDto>): Observable<ApiResponse<DayActionDto>> {
    return this.apiService.put<DayActionDto>(this.endpoint, documentId, dayAction);
  }

  deleteDayAction(documentId: string): Observable<void> {
    return this.apiService.delete<DayActionDto>(this.endpoint, documentId);
  }
}

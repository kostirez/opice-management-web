import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Action, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private endpoint = 'actions';
  private baseUrl = 'http://localhost:1337/api';

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  getActions(params?: Record<string, any>): Observable<ApiListResponse<Action>> {
    return this.apiService.get<Action>(this.endpoint, params);
  }

  getAction(documentId: string, params?: Record<string, any>): Observable<ApiResponse<Action>> {
    return this.apiService.getById<Action>(this.endpoint, documentId, params);
  }

  createAction(action: Partial<Action>): Observable<ApiResponse<Action>> {
    return this.apiService.post<Action>(this.endpoint, action);
  }

  updateAction(documentId: string, action: Partial<Action>): Observable<ApiResponse<Action>> {
    return this.apiService.put<Action>(this.endpoint, documentId, action);
  }

  deleteAction(documentId: string): Observable<void> {
    return this.apiService.delete<Action>(this.endpoint, documentId);
  }

  fulfillAction(id: number, timeInSeconds: number): Observable<ApiResponse<Action>> {
    return this.http.put<ApiResponse<Action>>(`${this.baseUrl}/${this.endpoint}/fulfillAction/${id}`, {
      timeInSeconds
    });
  }

  generateActionsForBatch(batchId: number): Observable<{ success: number }> {
    return this.http.post<{ success: number }>(`${this.baseUrl}/${this.endpoint}/generateActionsForBatch/${batchId}`, {});
  }
}

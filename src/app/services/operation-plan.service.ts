import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { OperationPlanDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OperationPlanService {
  private endpoint = 'operation-plans';

  constructor(private apiService: ApiService) {}

  getOperationPlans(params?: Record<string, any>): Observable<ApiListResponse<OperationPlanDto>> {
    return this.apiService.get<OperationPlanDto>(this.endpoint, params);
  }

  getOperationPlan(documentId: string, params?: Record<string, any>): Observable<ApiResponse<OperationPlanDto>> {
    return this.apiService.getById<OperationPlanDto>(this.endpoint, documentId, params);
  }

  createOperationPlan(operationPlan: Partial<OperationPlanDto>): Observable<ApiResponse<OperationPlanDto>> {
    return this.apiService.post<OperationPlanDto>(this.endpoint, operationPlan);
  }

  updateOperationPlan(documentId: string, operationPlan: Partial<OperationPlanDto>): Observable<ApiResponse<OperationPlanDto>> {
    return this.apiService.put<OperationPlanDto>(this.endpoint, documentId, operationPlan);
  }

  deleteOperationPlan(documentId: string): Observable<void> {
    return this.apiService.delete<OperationPlanDto>(this.endpoint, documentId);
  }
}

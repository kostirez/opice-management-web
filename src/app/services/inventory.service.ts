import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { InventoryDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private endpoint = 'inventories';

  constructor(private apiService: ApiService) {}

  getInventories(params?: Record<string, any>): Observable<ApiListResponse<InventoryDto>> {
    return this.apiService.get<InventoryDto>(this.endpoint, params);
  }

  getInventory(documentId: string, params?: Record<string, any>): Observable<ApiResponse<InventoryDto>> {
    return this.apiService.getById<InventoryDto>(this.endpoint, documentId, params);
  }

  createInventory(inventory: Partial<InventoryDto>): Observable<ApiResponse<InventoryDto>> {
    return this.apiService.post<InventoryDto>(this.endpoint, inventory);
  }

  updateInventory(documentId: string, inventory: Partial<InventoryDto>): Observable<ApiResponse<InventoryDto>> {
    return this.apiService.put<InventoryDto>(this.endpoint, documentId, inventory);
  }

  deleteInventory(documentId: string): Observable<void> {
    return this.apiService.delete<InventoryDto>(this.endpoint, documentId);
  }
}

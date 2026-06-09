import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RecipeDto, ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private endpoint = 'recipes';

  constructor(private apiService: ApiService) {}

  getRecipes(params?: Record<string, any>): Observable<ApiListResponse<RecipeDto>> {
    return this.apiService.get<RecipeDto>(this.endpoint, params);
  }

  getRecipe(documentId: string, params?: Record<string, any>): Observable<ApiResponse<RecipeDto>> {
    return this.apiService.getById<RecipeDto>(this.endpoint, documentId, params);
  }

  createRecipe(recipe: Partial<RecipeDto>): Observable<ApiResponse<RecipeDto>> {
    return this.apiService.post<RecipeDto>(this.endpoint, recipe);
  }

  updateRecipe(documentId: string, recipe: Partial<RecipeDto>): Observable<ApiResponse<RecipeDto>> {
    return this.apiService.put<RecipeDto>(this.endpoint, documentId, recipe);
  }

  deleteRecipe(documentId: string): Observable<void> {
    return this.apiService.delete<RecipeDto>(this.endpoint, documentId);
  }
}

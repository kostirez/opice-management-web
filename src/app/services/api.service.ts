import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ApiListResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:1337/api';

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: Record<string, any>): Observable<ApiListResponse<T>> {
    let httpParams: HttpParams;
    if (params) {
      httpParams = this.createParams(params);
    } else {
      httpParams = new HttpParams();
    }
    return this.http.get<ApiListResponse<T>>(`${this.baseUrl}/${endpoint}`, { params: httpParams, headers: this.getAuthHeaders() });
  }

  getById<T>(endpoint: string, documentId: string, params?: Record<string, any>): Observable<ApiResponse<T>> {
    let httpParams: HttpParams;
    if (params) {
      httpParams = this.createParams(params);
    } else {
      httpParams = new HttpParams();
    }
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${documentId}`, { params: httpParams, headers: this.getAuthHeaders() });
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, { data }, { headers: this.getAuthHeaders() });
  }

  put<T>(endpoint: string, documentId: string, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${documentId}`, { data }, { headers: this.getAuthHeaders() });
  }

  delete<T>(endpoint: string, documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${documentId}`, { headers: this.getAuthHeaders() });
  }

  createParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (key === 'populate') {
        const values = params[key].split(',');
        console.log('populating with: ', values);
        values.forEach((v: string) => {
          let param = this.toStrapiPopulate(v);
          let paramValue = 'true';
          httpParams = httpParams.set(param, paramValue);
        });
      } else if (key === 'filters') {
        const filters = params[key];
        Object.keys(filters).forEach(filterKey => {
          const filterValue = filters[filterKey];
          if (typeof filterValue === 'object') {
             Object.keys(filterValue).forEach(operator => {
               httpParams = httpParams.set(`filters[${filterKey}][${operator}]`, filterValue[operator]);
             });
          } else {
            httpParams = httpParams.set(`filters[${filterKey}]`, filterValue);
          }
        });
      } else if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    return httpParams;
  }

  toStrapiPopulate(path: string): string {
    const parts = path.split(".");
    let result = "populate";
    parts.forEach((part, index) => {
      result += `[${part}]`;
      if (index < parts.length - 1) {
        result += `[populate]`;
      }
    });

    return `${result}`;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.get<ApiListResponse<T>>(`${this.baseUrl}/${endpoint}`, { params: httpParams });
  }

  getById<T>(endpoint: string, documentId: string, params?: Record<string, any>): Observable<ApiResponse<T>> {
    let httpParams: HttpParams;
    if (params) {
      httpParams = this.createParams(params);
    } else {
      httpParams = new HttpParams();
    }
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${documentId}`, { params: httpParams });
  }

  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, { data });
  }

  put<T>(endpoint: string, documentId: string, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${documentId}`, { data });
  }

  delete<T>(endpoint: string, documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${documentId}`);
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
}

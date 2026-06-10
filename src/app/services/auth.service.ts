import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {environment} from '../../environments/environment';

interface StrapiLoginResponse {
  jwt: string;
  user: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl =  environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  login(identifier: string, password: string): Observable<StrapiLoginResponse> {
    return this.http
      .post<StrapiLoginResponse>(`${this.baseUrl}/auth/local`, { identifier, password })
      .pipe(
        tap((res) => {
          if (res?.jwt) {
            localStorage.setItem('jwt', res.jwt);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
}

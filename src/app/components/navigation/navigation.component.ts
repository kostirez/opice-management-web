import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h1>🌱</h1>
      </div>
      <div class="nav-right" *ngIf="isLoggedIn()">
        <ul class="nav-links">
          <li><a routerLink="/customers" routerLinkActive="active">👥 Customers</a></li>
          <li><a routerLink="/orders" routerLinkActive="active">🛒 Orders</a></li>
          <li><a routerLink="/growing-room" routerLinkActive="active">🌱 Growing Room</a></li>
          <li><a routerLink="/operation-plan" routerLinkActive="active">📅 Plan</a></li>
          <li><a routerLink="/provoz" routerLinkActive="active">⚙️ Provoz</a></li>
        </ul>
        <button *ngIf="isLoggedIn()" class="logout-btn" (click)="logout()" title="Logout">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #2c5530;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-brand h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
      font-weight: 500;
    }

    .nav-links a:hover,
    .nav-links a.active {
      background-color: rgba(255,255,255,0.2);
    }

    .logout-btn {
      background: transparent;
      color: white;
      border: 1px solid rgba(255,255,255,0.6);
      padding: 0.5rem 0.9rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s, border-color 0.2s;
    }

    .logout-btn:hover {
      background: rgba(255,255,255,0.2);
      border-color: rgba(255,255,255,0.9);
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-links {
        gap: 1rem;
      }
    }
  `]
})
export class NavigationComponent {
  constructor(private auth: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

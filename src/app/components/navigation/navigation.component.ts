import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h1>🌱</h1>
      </div>
      <ul class="nav-links">
        <li><a routerLink="/customers" routerLinkActive="active">👥 Customers</a></li>
        <li><a routerLink="/orders" routerLinkActive="active">🛒 Orders</a></li>
        <li><a routerLink="/batches" routerLinkActive="active">🌱 Batches</a></li>
        <li><a routerLink="/actions" routerLinkActive="active">📋 Actions</a></li>
      </ul>
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
export class NavigationComponent {}

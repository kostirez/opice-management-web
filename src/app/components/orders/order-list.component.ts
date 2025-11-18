import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>🛒 Orders</h2>
        <button class="btn btn-primary" routerLink="/orders/new">+ Add Order</button>
      </div>

      <div class="filters">
        <button class="filter-btn" [class.active]="activeFilter === 'all'"
                (click)="setFilter('all')">All Orders</button>
        <button class="filter-btn" [class.active]="activeFilter === 'active'"
                (click)="setFilter('active')">Active Only</button>
        <button class="filter-btn" [class.active]="activeFilter === 'inactive'"
                (click)="setFilter('inactive')">Inactive Only</button>
      </div>

      <div class="loading" *ngIf="loading">Loading orders...</div>

      <div class="orders-grid" *ngIf="!loading">
        <div class="order-card" *ngFor="let order of filteredOrders"
             [routerLink]="['/orders', order.id]">
          <div class="order-header">
            <h3>Order #{{ order.id }}</h3>
            <span class="status" [class.active]="order.active">
              {{ order.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="order-details">
            <p class="customer">👤 {{ order.customer?.name || 'Unknown Customer' }}</p>
            <p class="delivery">📅 First Delivery: {{ order.firstDelivery | date }}</p>
            <p class="plants">🌱 {{ order.plantsToGrow?.length || 0 }} plant varieties</p>
            <div class="delivery-days" *ngIf="order.deliveryTimes?.daysInWeek?.length">
              <span class="delivery-day" *ngFor="let day of order.deliveryTimes.daysInWeek">
                {{ getDayName(day) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredOrders.length === 0">
        <h3>No orders found</h3>
        <p>Start by creating your first order</p>
        <button class="btn btn-primary" routerLink="/orders/new">+ Add Order</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h2 {
      margin: 0;
      color: #2c5530;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #2c5530;
      color: white;
    }

    .btn-primary:hover {
      background: #1e3a21;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover,
    .filter-btn.active {
      background: #2c5530;
      color: white;
      border-color: #2c5530;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .order-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: inherit;
    }

    .order-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .order-header h3 {
      margin: 0;
      color: #2c5530;
    }

    .status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #6c757d;
      color: white;
    }

    .status.active {
      background: #28a745;
    }

    .order-details p {
      margin: 0.5rem 0;
      color: #666;
    }

    .customer {
      font-weight: 500;
      color: #2c5530 !important;
    }

    .delivery-days {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .delivery-day {
      background: #f8f9fa;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      color: #495057;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    .empty-state h3 {
      margin-bottom: 1rem;
    }

    .empty-state p {
      margin-bottom: 2rem;
    }
  `]
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  activeFilter = 'all';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getOrders({
      populate: 'customer,plantsToGrow,deliveryTimes'
    }).subscribe({
      next: (response) => {
        this.orders = response.data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    switch (this.activeFilter) {
      case 'active':
        this.filteredOrders = this.orders.filter(order => order.active);
        break;
      case 'inactive':
        this.filteredOrders = this.orders.filter(order => !order.active);
        break;
      default:
        this.filteredOrders = [...this.orders];
    }
  }

  getDayName(day: string): string {
    const dayNames: Record<string, string> = {
      mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
      fri: 'Fri', sat: 'Sat', sun: 'Sun'
    };
    return dayNames[day] || day;
  }
}

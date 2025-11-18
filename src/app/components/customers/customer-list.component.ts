import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>👥 Customers</h2>
        <button class="btn btn-primary" routerLink="/customers/new">+ Add Customer</button>
      </div>

      <div class="loading" *ngIf="loading">Loading customers...</div>

      <div class="customer-grid" *ngIf="!loading">
        <div class="customer-card" *ngFor="let customer of customers"
             [routerLink]="['/customer', customer.documentId]">
          <h3>{{ customer.name }}</h3>
          <p class="company">{{ customer.billing.officialName }}</p>
          <p class="address">{{ customer.deliveryAddress.city }}, {{ customer.deliveryAddress.country }}</p>
          <div class="customer-meta">
            <span class="invoice-id">Invoice ID: {{ customer.invoiceStaticId }}</span>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && customers.length === 0">
        <h3>No customers found</h3>
        <p>Start by adding your first customer</p>
        <button class="btn btn-primary" routerLink="/customers/new">+ Add Customer</button>
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

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .customer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .customer-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: inherit;
    }

    .customer-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .customer-card h3 {
      margin: 0 0 0.5rem 0;
      color: #2c5530;
    }

    .company {
      color: #666;
      margin: 0.5rem 0;
      font-weight: 500;
    }

    .address {
      color: #888;
      margin: 0.5rem 0;
    }

    .customer-meta {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #f0f0f0;
    }

    .invoice-id {
      font-size: 0.875rem;
      color: #666;
      background: #f8f9fa;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
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
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getCustomers({
      populate: 'billing,deliveryAddress'
    }).subscribe({
      next: (response) => {
        this.customers = response.data;
        console.log('Customers loaded:', this.customers);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.loading = false;
      }
    });
  }
}

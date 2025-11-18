import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <button class="btn btn-secondary" routerLink="/customers">← Back to Customers</button>
        <div class="actions" *ngIf="customer">
          <button class="btn btn-primary">Edit Customer</button>
          <button class="btn btn-danger" (click)="deleteCustomer()">Delete</button>
        </div>
      </div>

      <div class="loading" *ngIf="loading">Loading customer details...</div>

      <div class="customer-detail" *ngIf="customer && !loading">
        <div class="detail-header">
          <h1>{{ customer.name }}</h1>
          <span class="invoice-badge">Invoice ID: {{ customer.invoiceStaticId }}</span>
        </div>

        <div class="detail-grid">
          <div class="detail-card">
            <h3>Billing Information</h3>
            <div class="info-row">
              <label>Official Name:</label>
              <span>{{ customer.billing.officialName }}</span>
            </div>
            <div class="info-row">
              <label>ICO:</label>
              <span>{{ customer.billing.ico }}</span>
            </div>
            <div class="info-row" *ngIf="customer.billing.dic">
              <label>DIC:</label>
              <span>{{ customer.billing.dic }}</span>
            </div>
            <div class="address">
              <h4>Billing Address</h4>
              <p>
                {{ customer.billing.address.street }}<br>
                {{ customer.billing.address.postCode }} {{ customer.billing.address.city }}<br>
                {{ customer.billing.address.country }}
              </p>
            </div>
          </div>

          <div class="detail-card">
            <h3>Delivery Address</h3>
            <div class="address">
              <p>
                {{ customer.deliveryAddress.street }}<br>
                {{ customer.deliveryAddress.postCode }} {{ customer.deliveryAddress.city }}<br>
                {{ customer.deliveryAddress.country }}
              </p>
            </div>
          </div>
        </div>

        <div class="detail-card">
          <div class="section-header">
            <h3>Recent Orders</h3>
            <button class="btn btn-primary" [routerLink]="['/orders/new']"
                    [queryParams]="{customerId: customer.id}">+ New Order</button>
          </div>
          <div class="orders-list" *ngIf="customer.orders && customer.orders.length > 0">
            <div class="order-item" *ngFor="let order of customer.orders"
                 [routerLink]="['/orders', order.id]">
              <div class="order-info">
                <h4>Order #{{ order.id }}</h4>
                <p>First Delivery: {{ order.firstDelivery | date }}</p>
                <span class="status" [class.active]="order.active">
                  {{ order.active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>
          <div class="empty-state" *ngIf="!customer.orders || customer.orders.length === 0">
            <p>No orders found for this customer</p>
            <button class="btn btn-primary" [routerLink]="['/orders/new']"
                    [queryParams]="{customerId: customer.id}">Create First Order</button>
          </div>
        </div>
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

    .actions {
      display: flex;
      gap: 1rem;
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

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn:hover {
      opacity: 0.9;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .detail-header h1 {
      margin: 0;
      color: #2c5530;
    }

    .invoice-badge {
      background: #e9ecef;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .detail-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
    }

    .detail-card h3 {
      margin: 0 0 1.5rem 0;
      color: #2c5530;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 0.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f8f9fa;
    }

    .info-row label {
      font-weight: 500;
      color: #666;
    }

    .address h4 {
      margin: 1.5rem 0 0.5rem 0;
      color: #666;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      margin: 0;
      border: none;
      padding: 0;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-item {
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: inherit;
    }

    .order-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .order-info h4 {
      margin: 0 0 0.5rem 0;
      color: #2c5530;
    }

    .order-info p {
      margin: 0 0 0.5rem 0;
      color: #666;
    }

    .status {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #6c757d;
      color: white;
    }

    .status.active {
      background: #28a745;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer | null = null;
  loading = true;
  customerId: string = '';

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.customerId = params['id'];
      if (this.customerId) {
        this.loadCustomer();
      }
    });
  }

  loadCustomer() {
    this.loading = true;
    console.log('Loading customer with ID:', this.customerId);
    this.customerService.getCustomer(this.customerId, {
      populate: 'billing.address,deliveryAddress,orders'
    }).subscribe({
      next: (response) => {
        this.customer = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.loading = false;
      }
    });
  }

  deleteCustomer() {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(this.customerId).subscribe({
        next: () => {
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
        }
      });
    }
  }
}

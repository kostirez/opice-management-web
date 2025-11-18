import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
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

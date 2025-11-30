import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Order } from '../../../models';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  loading = true;
  order?: Order;
  private sub?: Subscription;
  // Invoice generation UI state
  selectedMonth: string = new Date().toISOString().slice(0, 7); // YYYY-MM
  generating = false;
  generateError?: string;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const documentId = params.get('ducumentId'); // note: route param as specified
      if (documentId) {
        this.fetchOrder(documentId);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  fetchOrder(documentId: string) {
    this.loading = true;
    this.orderService.getOrder(documentId, {
      populate: 'customer,plantsToGrow.plant,plantsToGrow.growStrategy,deliveryTimes,price_list,batches'
    }).subscribe({
      next: (response) => {
        this.order = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order detail', err);
        this.loading = false;
      }
    });
  }

  getDayName(day: string): string {
    const dayNames: Record<string, string> = {
      mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
      fri: 'Fri', sat: 'Sat', sun: 'Sun'
    };
    return dayNames[day] || day;
  }

  generateInvoice(): void {
    this.generateError = undefined;
    if (!this.order?.customer?.id) {
      this.generateError = 'Missing customer information for this order.';
      return;
    }
    if (!this.selectedMonth) {
      this.generateError = 'Please select a month.';
      return;
    }

    this.generating = true;
    const customerId = String(this.order.customer.id);
    const month = this.selectedMonth; // expected format YYYY-MM
    this.orderService.generateInvoice(customerId, month).subscribe({
      next: (blob) => {
        const fileName = `invoice-${this.order?.customer?.name || customerId}-${month}.pdf`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        this.generating = false;
      },
      error: (err) => {
        console.error('Failed to generate invoice', err);
        this.generateError = 'Failed to generate invoice. Please try again.';
        this.generating = false;
      }
    });
  }
}

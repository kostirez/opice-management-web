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
  selectedMonth: number = new Date().getMonth(); // 0-11
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' }
  ];
  generating = false;
  generateError?: string;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
  ) {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      this.years.push(i);
    }
    // Default to last month
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    this.selectedMonth = d.getMonth();
    this.selectedYear = d.getFullYear();
  }

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
      populate: 'customer.billing.address,itemsForDelivery,deliveryTimes.daysInWeek,price_list'
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
    console.log(`Fetching day name for ${day}`);
    const dayNames: Record<string, string> = {
      mon: 'Pondělí', tue: 'Úterý', wed: 'Středa', thu: 'Čtvrtek',
      fri: 'Pátek', sat: 'Sobota', sun: 'Neděle'
    };
    return dayNames[day] || day;
  }

  generateInvoice(): void {
    this.generateError = undefined;
    if (!this.order?.customer?.id) {
      this.generateError = 'Missing customer information for this order.';
      return;
    }

    this.generating = true;
    const customerId = String(this.order.customer.id);
    // Format: YYYY-MM-DD as expected by backend (e.g. 2024-04-01)
    const monthStr = (Number(this.selectedMonth) + 1).toString().padStart(2, '0');
    console.log(`Generating invoice for customer ${customerId} for month ${monthStr}/${this.selectedYear}`);
    const month = `${this.selectedYear}-${monthStr}-01`;

    this.orderService.generateInvoice(customerId, month).subscribe({
      next: (blob) => {
        const fileName = `invoice-${this.order?.customer?.name || customerId}-${this.selectedYear}-${monthStr}.pdf`;
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

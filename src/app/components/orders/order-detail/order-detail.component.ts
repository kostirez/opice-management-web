import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from '../../../models';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  loading = true;
  order?: Order;
  private sub?: Subscription;

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
}

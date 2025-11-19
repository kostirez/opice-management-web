import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'order-list.component.html',
  styleUrl: 'order-list.component.scss',
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

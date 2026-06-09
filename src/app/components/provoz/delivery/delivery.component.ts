import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BatchDeliveryService } from '../../../services/batch-delivery.service';
import { BatchDeliveryDto, BoxType, GrowBoxGroup } from '../../../models';
import { forkJoin } from 'rxjs';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  pendingDeliveries: BatchDeliveryDto[] = [];
  onWayDeliveries: (BatchDeliveryDto & {
    newHandedBoxes: GrowBoxGroup[],
    newReturnedBoxes: GrowBoxGroup[]
  })[] = [];
  loading = false;
  boxTypes: BoxType[] = ['BOX_S', 'BOX_M', 'BOX_L'];

  constructor(private batchDeliveryService: BatchDeliveryService) {}

  ngOnInit() {
    this.loadDeliveries();
  }

  loadDeliveries() {
    this.loading = true;
    this.batchDeliveryService.getBatchDeliveries({
      'filters[state][$in][0]': 'PACKED',
      'filters[state][$in][1]': 'ON_WAY',
      'populate': 'order.customer,deliveredItems.recipe'
    }).subscribe({
      next: (response) => {
        const all = response.data;
        this.pendingDeliveries = all.filter(d => d.state === 'PACKED');
        this.onWayDeliveries = all
          .filter(d => d.state === 'ON_WAY')
          .map(d => ({
            ...d,
            newHandedBoxes: [],
            newReturnedBoxes: []
          }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading deliveries', err);
        this.loading = false;
      }
    });
  }

  startDelivery() {
    if (this.pendingDeliveries.length === 0) return;

    this.loading = true;
    const updates = this.pendingDeliveries.map(delivery =>
      this.batchDeliveryService.updateBatchDelivery(delivery.documentId!, { state: 'ON_WAY' })
    );

    forkJoin(updates).subscribe({
      next: () => {
        this.loadDeliveries();
      },
      error: (err) => {
        console.error('Error starting delivery', err);
        this.loading = false;
      }
    });
  }

  addHandedBox(delivery: any) {
    delivery.newHandedBoxes.push({ box: 'BOX_S', amount: 1 });
  }

  removeHandedBox(delivery: any, index: number) {
    delivery.newHandedBoxes.splice(index, 1);
  }

  addReturnedBox(delivery: any) {
    delivery.newReturnedBoxes.push({ box: 'BOX_S', amount: 1 });
  }

  removeReturnedBox(delivery: any, index: number) {
    delivery.newReturnedBoxes.splice(index, 1);
  }

  markAsDelivered(delivery: any) {
    if (!delivery.documentId) return;

    this.loading = true;
    this.batchDeliveryService.updateBatchDelivery(delivery.documentId, {
      state: 'DELIVERED',
      deliveredAt: new Date().toISOString(),
      handedBoxes: delivery.newHandedBoxes,
      returnedBoxes: delivery.newReturnedBoxes
    }).subscribe({
      next: () => {
        this.loadDeliveries();
      },
      error: (err) => {
        console.error('Error marking as delivered', err);
        this.loading = false;
      }
    });
  }
}

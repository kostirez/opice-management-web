import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BatchService } from '../../../services/batch.service';
import { Batch } from '../../../models';
import dayjs from 'dayjs';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'batch-list.component.html',
  styleUrl: 'batch-list.component.scss',
})
export class BatchListComponent implements OnInit {
  batches: Batch[] = [];
  filteredBatches: Batch[] = [];
  loading = true;
  activeFilter = 'all';

  constructor(private batchService: BatchService) {}

  ngOnInit() {
    this.loadBatches();
  }

  loadBatches() {
    this.loading = true;
    this.batchService.getBatches({
      populate: 'order.customer,plantsToGrow.plant,actions',
      sort: 'dueToDate:desc'
    }).subscribe({
      next: (response) => {
        this.batches = response.data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading batches:', error);
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
      case 'waiting':
      case 'running':
      case 'done':
        this.filteredBatches = this.batches.filter(batch => batch.state === this.activeFilter);
        break;
      case 'last7days':
        this.filteredBatches = this.batches.filter(batch => {
          const dueToDay = dayjs(batch.dueToDate);
          return dueToDay.isAfter(dayjs().subtract(7, 'days'));
        });
        break;
      case 'future':
        this.filteredBatches = this.batches.filter(batch => {
          const dueToDay = dayjs(batch.dueToDate);
          return dueToDay.isAfter(dayjs());
        });
        break;
      case 'lastMonth':
        this.filteredBatches = this.batches.filter(batch => {
          const dueToDay = dayjs(batch.dueToDate);
          return dueToDay.isAfter(dayjs().subtract(30, 'days'));
        });
        break;
      default:
        this.filteredBatches = [...this.batches];
    }
  }

  getStatusLabel(state: string): string {
    const labels: Record<string, string> = {
      waiting: 'Waiting',
      running: 'In Progress',
      done: 'Completed'
    };
    return labels[state] || state;
  }

  getCompletedActions(batch: Batch): number {
    return batch.actions?.filter(action => action.state === 'done').length || 0;
  }

  getProgressPercentage(batch: Batch): number {
    if (!batch.actions?.length) return 0;
    const completed = this.getCompletedActions(batch);
    return (completed / batch.actions.length) * 100;
  }
}

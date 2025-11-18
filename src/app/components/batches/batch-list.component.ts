import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BatchService } from '../../services/batch.service';
import { Batch } from '../../models';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>🌱 Batches</h2>
        <button class="btn btn-primary" routerLink="/batches/new">+ Create Batch</button>
      </div>

      <div class="filters">
        <button class="filter-btn" [class.active]="activeFilter === 'all'"
                (click)="setFilter('all')">All Batches</button>
        <button class="filter-btn" [class.active]="activeFilter === 'waiting'"
                (click)="setFilter('waiting')">Waiting</button>
        <button class="filter-btn" [class.active]="activeFilter === 'running'"
                (click)="setFilter('running')">In Progress</button>
        <button class="filter-btn" [class.active]="activeFilter === 'done'"
                (click)="setFilter('done')">Completed</button>
      </div>

      <div class="loading" *ngIf="loading">Loading batches...</div>

      <div class="batches-grid" *ngIf="!loading">
        <div class="batch-card" *ngFor="let batch of filteredBatches"
             [routerLink]="['/batches', batch.id]">
          <div class="batch-header">
            <h3>Batch #{{ batch.id }}</h3>
            <span class="status" [class]="'status-' + batch.state">
              {{ getStatusLabel(batch.state) }}
            </span>
          </div>
          <div class="batch-details">
            <p class="order">🛒 Order #{{ batch.order?.id || 'N/A' }}</p>
            <p class="customer" *ngIf="batch.order?.customer">
              👤 {{ batch.order.customer.name }}
            </p>
            <p class="due-date">📅 Due: {{ batch.dueToDate | date }}</p>
            <div class="plants" *ngIf="batch.plantsToGrow?.length">
              <h4>Plants:</h4>
              <div class="plant-list">
                <span class="plant-item" *ngFor="let plantBatch of batch.plantsToGrow">
                  {{ plantBatch.amount }}x {{ plantBatch.plant?.name || 'Unknown' }}
                </span>
              </div>
            </div>
            <div class="actions-progress" *ngIf="batch.actions?.length">
              <small>Actions: {{ getCompletedActions(batch) }}/{{ batch.actions.length }} completed</small>
              <div class="progress-bar">
                <div class="progress" [style.width.%]="getProgressPercentage(batch)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredBatches.length === 0">
        <h3>No batches found</h3>
        <p>Start by creating your first batch</p>
        <button class="btn btn-primary" routerLink="/batches/new">+ Create Batch</button>
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

    .batches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .batch-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: inherit;
    }

    .batch-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .batch-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .batch-header h3 {
      margin: 0;
      color: #2c5530;
    }

    .status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-waiting {
      background: #ffc107;
      color: #000;
    }

    .status-running {
      background: #007bff;
      color: white;
    }

    .status-done {
      background: #28a745;
      color: white;
    }

    .batch-details p {
      margin: 0.5rem 0;
      color: #666;
    }

    .order, .customer {
      font-weight: 500;
    }

    .plants h4 {
      margin: 1rem 0 0.5rem 0;
      color: #2c5530;
      font-size: 0.9rem;
    }

    .plant-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .plant-item {
      background: #f8f9fa;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #495057;
    }

    .actions-progress {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #f0f0f0;
    }

    .actions-progress small {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: #e9ecef;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress {
      height: 100%;
      background: #28a745;
      transition: width 0.3s ease;
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
      populate: 'order.customer,plantsToGrow.plant,actions'
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

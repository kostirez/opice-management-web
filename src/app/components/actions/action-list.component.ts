import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActionService } from '../../services/action.service';
import { Action } from '../../models';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-action-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>📋 Actions</h2>
        <div class="header-actions">
          <select class="filter-select" [(ngModel)]="selectedBatchId" (change)="onBatchFilterChange()">
            <option value="">All Batches</option>
            <option *ngFor="let batch of uniqueBatches" [value]="batch.id">
              Batch #{{ batch.id }} - {{ batch.order?.customer?.name || 'Unknown' }}
            </option>
          </select>
        </div>
      </div>

      <div class="filters">
        <button class="filter-btn" [class.active]="activeFilter === 'all'"
                (click)="setFilter('all')">All Actions</button>
        <button class="filter-btn" [class.active]="activeFilter === 'waiting'"
                (click)="setFilter('waiting')">Waiting</button>
        <button class="filter-btn" [class.active]="activeFilter === 'running'"
                (click)="setFilter('running')">In Progress</button>
        <button class="filter-btn" [class.active]="activeFilter === 'done'"
                (click)="setFilter('done')">Completed</button>
      </div>

      <div class="loading" *ngIf="loading">Loading actions...</div>

      <div class="actions-list" *ngIf="!loading">
        <div class="action-card" *ngFor="let action of filteredActions">
          <div class="action-header">
            <div class="action-info">
              <h3>{{ action.action_type?.name || 'Unknown Action' }}</h3>
              <span class="batch-info">Batch #{{ action.batch?.id }}</span>
            </div>
            <div class="action-status">
              <span class="status" [class]="'status-' + action.state">
                {{ getStatusLabel(action.state) }}
              </span>
              <button *ngIf="action.state === 'waiting'"
                      class="btn btn-sm btn-primary"
                      (click)="startAction(action, $event)">
                Start
              </button>
              <button *ngIf="action.state === 'running'"
                      class="btn btn-sm btn-success"
                      (click)="completeAction(action, $event)">
                Complete
              </button>
            </div>
          </div>

          <div class="action-details">
            <div class="detail-row">
              <span class="label">Customer:</span>
              <span>{{ action.batch?.order?.customer?.name || 'Unknown' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Plant:</span>
              <span>{{ action.plantBatch?.plant?.name || 'Unknown' }}
                    ({{ action.plantBatch?.amount || 0 }}x)</span>
            </div>
            <div class="detail-row">
              <span class="label">Scheduled:</span>
              <span>{{ action.timestamp | date:'medium' }}</span>
            </div>
            <div class="detail-row" *ngIf="action.timeSpent">
              <span class="label">Time Spent:</span>
              <span>{{ formatTime(action.timeSpent) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredActions.length === 0">
        <h3>No actions found</h3>
        <p>Actions will appear here when batches are created</p>
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

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .filter-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s;
    }

    .btn-sm {
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn:hover {
      opacity: 0.9;
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

    .actions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .action-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      transition: all 0.2s;
    }

    .action-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .action-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .action-info h3 {
      margin: 0;
      color: #2c5530;
    }

    .batch-info {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }

    .action-status {
      display: flex;
      align-items: center;
      gap: 1rem;
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

    .action-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 0.5rem;
    }

    .detail-row {
      display: flex;
      gap: 0.5rem;
    }

    .label {
      font-weight: 500;
      color: #666;
      min-width: 80px;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    .empty-state h3 {
      margin-bottom: 1rem;
    }
  `]
})
export class ActionListComponent implements OnInit {
  actions: Action[] = [];
  filteredActions: Action[] = [];
  uniqueBatches: any[] = [];
  loading = true;
  activeFilter = 'all';
  selectedBatchId = '';

  constructor(private actionService: ActionService) {}

  ngOnInit() {
    this.loadActions();
  }

  loadActions() {
    this.loading = true;
    this.actionService.getActions({
      populate: 'batch,batch.order,batch.order.customer,plantBatch.plant,action_type'
    }).subscribe({
      next: (response) => {
        this.actions = response.data;
        this.extractUniqueBatches();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading actions:', error);
        this.loading = false;
      }
    });
  }

  extractUniqueBatches() {
    const batchMap = new Map();
    this.actions.forEach(action => {
      if (action.batch && !batchMap.has(action.batch.id)) {
        batchMap.set(action.batch.id, action.batch);
      }
    });
    this.uniqueBatches = Array.from(batchMap.values());
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilters();
  }

  onBatchFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.actions];

    // Apply state filter
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(action => action.state === this.activeFilter);
    }

    // Apply batch filter
    if (this.selectedBatchId) {
      filtered = filtered.filter(action => action.batch?.id?.toString() === this.selectedBatchId);
    }

    this.filteredActions = filtered;
  }

  getStatusLabel(state: string): string {
    const labels: Record<string, string> = {
      waiting: 'Waiting',
      running: 'In Progress',
      done: 'Completed'
    };
    return labels[state] || state;
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  startAction(action: Action, event: Event) {
    event.stopPropagation();
    this.actionService.updateAction(action.documentId, { state: 'running' }).subscribe({
      next: () => {
        action.state = 'running';
      },
      error: (error) => {
        console.error('Error starting action:', error);
      }
    });
  }

  completeAction(action: Action, event: Event) {
    event.stopPropagation();
    const timeSpent = prompt('Enter time spent (in minutes):');
    if (timeSpent) {
      const timeInSeconds = parseInt(timeSpent) * 60;
      this.actionService.fulfillAction(action.id, timeInSeconds).subscribe({
        next: (response) => {
          action.state = 'done';
          action.timeSpent = timeInSeconds;
        },
        error: (error) => {
          console.error('Error completing action:', error);
        }
      });
    }
  }
}

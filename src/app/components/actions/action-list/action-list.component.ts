import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActionService } from '../../../services/action.service';
import { Action } from '../../../models';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-action-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './action-list.component.html',
  styleUrl: './action-list.component.scss',
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

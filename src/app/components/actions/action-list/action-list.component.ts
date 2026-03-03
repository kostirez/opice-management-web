import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActionService } from '../../../services/action.service';
import { Action } from '../../../models';
import {FormsModule} from '@angular/forms';
import dayjs from 'dayjs';

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
  groupedActions: { key: string, actions: Action[] }[] = [];
  uniqueBatches: any[] = [];
  loading = true;
  activeFilter = 'today';
  selectedBatchId = '';
  groupingCriteria: 'date' | 'customer' | 'none' = 'date';

  constructor(private actionService: ActionService) {}

  ngOnInit() {
    this.loadActions();
  }

  loadActions() {
    this.loading = true;
    const params: any = {
      populate: 'batch,batch.order,batch.order.customer,plantBatch.plant,action_type',
      sort: 'timestamp:desc',
      filters: {}
    };

    // Apply state filter
    if (['waiting', 'running', 'done'].includes(this.activeFilter)) {
      params.filters.state = { '$eq': this.activeFilter };
    }

    if (this.activeFilter === 'nextWeek') {
      params.filters.timestamp = {
        '$gt': dayjs().toISOString(),
        '$lt': dayjs().add(7, 'days').toISOString()
      };
    }

    if (this.activeFilter === 'nextMonth') {
      params.filters.timestamp = {
        '$gt': dayjs().toISOString(),
        '$lt': dayjs().add(30, 'days').toISOString()
      };
    }

    if (this.activeFilter === 'today') {
      params.filters.timestamp = {
        '$gte': dayjs().startOf('day').toISOString(),
        '$lte': dayjs().endOf('day').toISOString()
      };
    }

    // Apply batch filter
    if (this.selectedBatchId) {
      params.filters.batch = { 'id': { '$eq': this.selectedBatchId } };
    }

    this.actionService.getActions(params).subscribe({
      next: (response) => {
        this.actions = response.data;
        this.filteredActions = [...this.actions];
        this.groupActions();
        if (this.uniqueBatches.length === 0 || (!this.selectedBatchId && this.activeFilter === 'today')) {
           this.extractUniqueBatches();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading actions:', error);
        this.loading = false;
      }
    });
  }

  groupActions() {
    if (this.groupingCriteria === 'none') {
      this.groupedActions = [{ key: 'All Actions', actions: this.filteredActions }];
      return;
    }

    const groups: Record<string, Action[]> = {};

    this.filteredActions.forEach(action => {
      let key = 'Unknown';
      if (this.groupingCriteria === 'date') {
        key = dayjs(action.timestamp).format('YYYY-MM-DD');
      } else if (this.groupingCriteria === 'customer') {
        key = action.batch?.order?.customer?.name || 'Unknown Customer';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(action);
    });

    this.groupedActions = Object.keys(groups).sort().map(key => ({
      key,
      actions: groups[key]
    }));

    if (this.groupingCriteria === 'date') {
       this.groupedActions.reverse(); // Newest dates first
    }
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
    this.loadActions();
  }

  onBatchFilterChange() {
    this.loadActions();
  }

  onGroupingChange() {
    this.groupActions();
  }

  applyFilters() {
    // This is now handled by loadActions via backend filters
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

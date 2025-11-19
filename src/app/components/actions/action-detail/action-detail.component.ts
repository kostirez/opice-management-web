import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Action } from '../../../models';
import { ActionService } from '../../../services/action.service';

@Component({
  selector: 'app-action-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './action-detail.component.html',
  styleUrls: ['./action-detail.component.scss']
})
export class ActionDetailComponent implements OnInit, OnDestroy {
  loading = true;
  action?: Action;
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private actionService: ActionService,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const documentId = params.get('ducumentId'); // as specified
      if (documentId) {
        this.fetchAction(documentId);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  fetchAction(documentId: string) {
    this.loading = true;
    this.actionService.getAction(documentId, {
      populate: 'batch.order.customer,plantBatch.plant,action_type'
    }).subscribe({
      next: (response) => {
        this.action = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load action detail', err);
        this.loading = false;
      }
    });
  }

  getStatusLabel(state: string): string {
    const labels: Record<string, string> = {
      waiting: 'Waiting',
      running: 'In Progress',
      done: 'Completed'
    };
    return labels[state] || state;
  }

  formatTime(seconds?: number): string {
    if (!seconds) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Batch } from '../../../models';
import { BatchService } from '../../../services/batch.service';

@Component({
  selector: 'app-batch-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './batch-detail.component.html',
  styleUrls: ['./batch-detail.component.scss']
})
export class BatchDetailComponent implements OnInit, OnDestroy {
  loading = true;
  batch?: Batch;
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private batchService: BatchService,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const documentId = params.get('ducumentId'); // as specified by issue
      if (documentId) {
        this.fetchBatch(documentId);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  fetchBatch(documentId: string) {
    this.loading = true;
    this.batchService.getBatch(documentId, {
      populate: 'order.customer,plantsToGrow.plant,plantsToGrow.growStrategy,actions.action_type'
    }).subscribe({
      next: (response) => {
        this.batch = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load batch detail', err);
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

  getCompletedActions(): number {
    if (!this.batch?.actions?.length) return 0;
    return this.batch.actions.filter(a => a.state === 'done').length;
  }

  getProgressPercentage(): number {
    if (!this.batch?.actions?.length) return 0;
    const completed = this.getCompletedActions();
    return (completed / this.batch.actions.length) * 100;
  }
}

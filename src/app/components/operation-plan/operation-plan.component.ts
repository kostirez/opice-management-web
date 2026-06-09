import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationPlanService } from '../../services/operation-plan.service';
import { OperationPlanDto } from '../../models';
import { DayActionService } from '../../services/day-action.service';
import { DayYieldService } from '../../services/day-yield.service';
import { OccupancyService } from '../../services/occupancy.service';

@Component({
  selector: 'app-operation-plan',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Operation Plan</h1>

      <div *ngIf="loading" class="loading">Loading operation plan...</div>

      <div *ngIf="!loading && !operationPlan" class="error">
        No active operation plan found.
      </div>

      <div *ngIf="operationPlan" class="plan-details">
        <section class="plan-info">
          <h2>Active Plan</h2>
          <p *ngIf="operationPlan.note"><strong>Note:</strong> {{ operationPlan.note }}</p>
        </section>

        <div class="grid">
          <!-- Day Actions -->
          <section class="card">
            <h3>Day Actions</h3>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Type</th>
                  <th>Plant</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let action of operationPlan.day_actions">
                  <td>{{ action.DayInWeek }}</td>
                  <td>{{ action.type }}</td>
                  <td>{{ action.plant?.name || 'N/A' }}</td>
                  <td>{{ action.trayCount }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Day Yields -->
          <section class="card">
            <h3>Day Yields</h3>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Plant</th>
                  <th>Weight (g)</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let yield of operationPlan.day_yields">
                  <td>{{ yield.dayInWeek }}</td>
                  <td>{{ yield.plant?.name || 'N/A' }}</td>
                  <td>{{ yield.weight }}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Occupancy -->
          <section class="card">
            <h3>Occupancy</h3>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Germination</th>
                  <th>On Light</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let occ of operationPlan.occupancies">
                  <td>{{ occ.dayInWeek }}</td>
                  <td>{{ occ.germinationCount }}</td>
                  <td>{{ occ.onLightCount }}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    h1 { color: #2c5530; margin-bottom: 2rem; }
    h2 { color: #2c5530; margin-bottom: 1rem; border-bottom: 2px solid #2c5530; padding-bottom: 0.5rem; }
    h3 { color: #2c5530; margin-top: 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #eee; }
    .plan-info { background: #f9f9f9; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; font-weight: 600; color: #333; }
    .loading, .error { padding: 2rem; text-align: center; font-size: 1.2rem; }
    .error { color: #d32f2f; }
  `]
})
export class OperationPlanComponent implements OnInit {
  operationPlan: OperationPlanDto | null = null;
  loading = true;

  constructor(private operationPlanService: OperationPlanService) {}

  ngOnInit(): void {
    this.loadActivePlan();
  }

  loadActivePlan(): void {
    this.loading = true;
    const params = {
      filters: { active: { '$eq': true } },
      populate: 'day_actions.plant,day_yields.plant'
    };

    this.operationPlanService.getOperationPlans(params).subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.operationPlan = response.data[0];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading operation plan:', err);
        this.loading = false;
      }
    });
  }
}

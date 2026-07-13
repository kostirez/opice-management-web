import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrayService } from '../../../services/tray.service';
import { TrayDto } from '../../../models';

import { RouterModule } from '@angular/router';

import { ProvozNavigationComponent } from '../provoz-navigation/provoz-navigation.component';

@Component({
  selector: 'app-cleaning',
  standalone: true,
  imports: [CommonModule, RouterModule, ProvozNavigationComponent],
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss']
})
export class CleaningComponent implements OnInit {
  washingTrays: TrayDto[] = [];
  loading = false;

  constructor(private trayService: TrayService) {}

  ngOnInit(): void {
    this.loadWashingTrays();
  }

  loadWashingTrays(): void {
    this.loading = true;
    this.trayService.getTrays({
      filters: { state: 'Washing' }
    }).subscribe({
      next: (response) => {
        this.washingTrays = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading washing trays', err);
        this.loading = false;
      }
    });
  }

  markAsEmpty(tray: TrayDto): void {
    if (!tray.documentId) return;

    this.trayService.updateTray(tray.documentId, { state: 'Empty' }).subscribe({
      next: () => {
        this.loadWashingTrays();
      },
      error: (err) => {
        console.error('Error updating tray state', err);
      }
    });
  }

  markAllAsEmpty(): void {
    if (this.washingTrays.length === 0) return;

    // Ideally there would be a bulk update, but for now we do it one by one
    // or we can implement it if API supports it. TrayService doesn't seem to have bulk update.
    const updateObservables = this.washingTrays
      .filter(t => t.documentId)
      .map(t => this.trayService.updateTray(t.documentId!, { state: 'Empty' }));

    // For simplicity and since it's a small number of trays usually:
    let completed = 0;
    const total = updateObservables.length;

    updateObservables.forEach(obs => {
      obs.subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.loadWashingTrays();
          }
        },
        error: (err) => {
          console.error('Error in bulk update', err);
          completed++;
          if (completed === total) {
            this.loadWashingTrays();
          }
        }
      });
    });
  }
}

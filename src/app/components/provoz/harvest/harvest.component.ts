import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DayActionService } from '../../../services/day-action.service';
import { CropCycleService } from '../../../services/crop-cycle.service';
import { BatchHarvestService } from '../../../services/batch-harvest.service';
import { CropCycleHarvestService } from '../../../services/crop-cycle-harvest.service';
import { DayActionDto, CropCycleCustomListItemDto, BatchHarvestDto } from '../../../models';
import { getCurrentDayInWeek } from '../../../utils/date-utils';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-harvest',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './harvest.component.html',
  styleUrls: ['./harvest.component.scss']
})
export class HarvestComponent implements OnInit {
  dayActions: DayActionDto[] = [];
  cropCyclesToday: (CropCycleCustomListItemDto & { harvestedWeight?: number })[] = [];
  cropCyclesOther: (CropCycleCustomListItemDto & { harvestedWeight?: number })[] = [];
  todayBatchHarvest: BatchHarvestDto | null = null;
  loading = false;
  creatingBatch = false;
  today = new Date().toISOString().split('T')[0];

  constructor(
    private dayActionService: DayActionService,
    private cropCycleService: CropCycleService,
    private batchHarvestService: BatchHarvestService,
    private cropCycleHarvestService: CropCycleHarvestService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadTodayActions();
    this.loadTodayBatchHarvest();
  }

  loadTodayBatchHarvest() {
    this.loading = true;
    const today = new Date().toISOString().split('T')[0];
    this.batchHarvestService.getBatchHarvests({
      'filters[date][$eq]': today,
      'populate': 'harvestedCrops.plant,crop_cycle_harvests'
    }).subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.todayBatchHarvest = response.data[0];
        } else {
          this.todayBatchHarvest = null;
        }
        this.loadCropCyclesToHarvest();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading batch harvests', err);
        this.loading = false;
      }
    });
  }

  loadTodayActions() {
    this.loading = true;
    this.dayActionService.getCustomList({
      type: 'HARVEST',
      active: 'true',
      DayInWeek: getCurrentDayInWeek(),
    }).subscribe({
      next: (actions) => {
        this.dayActions = actions;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading actions', err);
        this.loading = false;
      }
    });
  }

  loadCropCyclesToHarvest() {
    this.cropCycleService.getCustomList({
      state: 'LIGHT'
    }).subscribe({
      next: (cropCycles) => {
        const all = cropCycles.map(c => ({ ...c, harvestedWeight: undefined }));
        this.cropCyclesToday = all.filter(c => this.isToday(c.harvestDay));
        this.cropCyclesOther = all.filter(c => !this.isToday(c.harvestDay));
      },
      error: (err) => {
        console.error('Error loading crop cycles to harvest', err);
      }
    });
  }

  createBatchHarvest() {
    this.creatingBatch = true;
    const today = new Date().toISOString().split('T')[0];
    this.batchHarvestService.createBatchHarvest({
      date: today,
    }).subscribe({
      next: () => {
        this.loadTodayBatchHarvest();
        this.creatingBatch = false;
      },
      error: (err) => {
        console.error('Error creating batch harvest', err);
        this.creatingBatch = false;
      }
    });
  }

  saveHarvest(cycle: CropCycleCustomListItemDto & { harvestedWeight?: number }) {
    if (!cycle.id || cycle.harvestedWeight === undefined || cycle.harvestedWeight === null || !this.todayBatchHarvest) return;

    this.cropCycleHarvestService.createCropCycleHarvest({
      crop_cycle: cycle.id as any,
      batch_harvest: this.todayBatchHarvest.id as any,
      weight: cycle.harvestedWeight,
      performedAt: new Date().toISOString()
    }).subscribe({
      next: () => {
        this.loadTodayBatchHarvest();
      },
      error: (err) => {
        console.error('Error saving harvest', err);
      }
    });
  }

  isToday(dateString?: string): boolean {
    if (!dateString) return false;
    const date = dateString.split('T')[0];
    return date === this.today;
  }
}

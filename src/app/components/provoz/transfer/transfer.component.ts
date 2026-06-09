import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DayActionService } from '../../../services/day-action.service';
import { CropCycleService } from '../../../services/crop-cycle.service';
import { DayActionDto, CropCycleCustomListItemDto } from '../../../models';
import { getCurrentDayInWeek } from '../../../utils/date-utils';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  dayActions: DayActionDto[] = [];
  cropCyclesToday: CropCycleCustomListItemDto[] = [];
  cropCyclesOther: CropCycleCustomListItemDto[] = [];
  selectedCropCycle: CropCycleCustomListItemDto | null = null;
  shelfCode: string = '';
  showMoveModal = false;
  loading = false;
  today = new Date().toISOString().split('T')[0];

  constructor(
    private dayActionService: DayActionService,
    private cropCycleService: CropCycleService
  ) {}

  ngOnInit() {
    this.loadTodayActions();
    this.loadCropCyclesToMove();
  }

  loadTodayActions() {
    this.loading = true;
    this.dayActionService.getCustomList({
      type: 'MOVE_TO_LIGHT',
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

  loadCropCyclesToMove() {
    this.cropCycleService.getCustomList({
      state: 'GERMINATION'
    }).subscribe({
      next: (cropCycles) => {
        this.cropCyclesToday = cropCycles.filter(c => this.isToday(c.moveToLightDay));
        this.cropCyclesOther = cropCycles.filter(c => !this.isToday(c.moveToLightDay));
      },
      error: (err) => {
        console.error('Error loading crop cycles to move', err);
      }
    });
  }

  openMoveModal(cropCycle: CropCycleCustomListItemDto) {
    this.selectedCropCycle = cropCycle;
    this.shelfCode = '';
    this.showMoveModal = true;
  }

  closeMoveModal() {
    this.showMoveModal = false;
    this.selectedCropCycle = null;
    this.shelfCode = '';
  }

  confirmMove() {
    if (!this.selectedCropCycle || !this.selectedCropCycle.id || !this.shelfCode) return;

    this.cropCycleService.move(this.selectedCropCycle.id.toString(), {
      state: 'LIGHT',
      placeCode: this.shelfCode
    }).subscribe({
      next: () => {
        this.closeMoveModal();
        this.loadCropCyclesToMove();
      },
      error: (err) => {
        console.error('Error moving crop cycle', err);
      }
    });
  }

  isToday(dateString?: string): boolean {
    if (!dateString) return false;
    const date = dateString.split('T')[0];
    return date === this.today;
  }
}

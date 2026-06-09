import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DayActionService } from '../../../services/day-action.service';
import { TrayService } from '../../../services/tray.service';
import { CropCycleService } from '../../../services/crop-cycle.service';
import {DayActionDto, TrayDto, PlantDto, CropCycleCustomListItemDto} from '../../../models';
import { getCurrentDayInWeek } from '../../../utils/date-utils';
import { PlantService } from '../../../services/plant.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-planting',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './planting.component.html',
  styleUrls: ['./planting.component.scss']
})
export class PlantingComponent implements OnInit {
  dayActions: DayActionDto[] = [];
  emptyTrays: TrayDto[] = [];
  allPlants: PlantDto[] = [];
  pendingCropCycles: CropCycleCustomListItemDto[] = [];
  selectedAction: DayActionDto | null = null;
  selectedPlant: PlantDto | null = null;
  selectedTrays: TrayDto[] = [];
  selectedCropCycle: CropCycleCustomListItemDto | null = null;
  shelfCode: string = '';
  manualTrayCount: number = 0;
  isManual: boolean = false;
  showModal = false;
  showMoveModal = false;
  loading = false;

  constructor(
    private dayActionService: DayActionService,
    private trayService: TrayService,
    private cropCycleService: CropCycleService,
    private plantService: PlantService
  ) {}

  ngOnInit() {
    this.loadTodayActions();
    this.loadEmptyTrays();
    this.loadPlants();
    this.loadPendingCropCycles();
  }

  loadPendingCropCycles() {
    this.cropCycleService.getCustomList({ state: 'PENDING' }).subscribe({
      next: (cropCycles) => {
        this.pendingCropCycles = cropCycles;
      },
      error: (err) => {
        console.error('Error loading pending crop cycles', err);
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
    console.log('confirm move', this.selectedCropCycle, this.shelfCode)
    if (!this.selectedCropCycle || !this.selectedCropCycle.id || !this.shelfCode) return;
console.log('confirm move')
    this.cropCycleService.move(this.selectedCropCycle.id.toString(), {
      state: 'GERMINATION',
      placeCode: this.shelfCode
    }).subscribe({
      next: () => {
        this.closeMoveModal();
        this.loadPendingCropCycles();
      },
      error: (err) => {
        console.error('Error moving crop cycle', err);
      }
    });
  }

  loadPlants() {
    this.plantService.getPlants().subscribe({
      next: (response) => {
        this.allPlants = response.data;
      },
      error: (err) => {
        console.error('Error loading plants', err);
      }
    });
  }

  loadTodayActions() {
    this.loading = true;
    // logic: load day actions for today with status active and type SEEDING.
    this.dayActionService.getCustomList({
      type: 'SEEDING',
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

  loadEmptyTrays() {
    // load all trays and filter only Empty
    this.trayService.getTrays({
      filters: { state: 'Empty' }
    }).subscribe({
      next: (response) => {
        this.emptyTrays = response.data;
      },
      error: (err) => {
        console.error('Error loading trays', err);
      }
    });
  }

  openTraySelection(action: DayActionDto) {
    this.isManual = false;
    this.selectedAction = action;
    this.selectedPlant = action.plant || null;
    this.selectedTrays = [];
    this.showModal = true;
  }

  openManualPlanting() {
    this.isManual = true;
    this.selectedAction = null;
    this.selectedPlant = null;
    this.selectedTrays = [];
    this.manualTrayCount = 1;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedAction = null;
    this.selectedPlant = null;
    this.selectedTrays = [];
    this.isManual = false;
  }

  toggleTraySelection(tray: TrayDto) {
    const index = this.selectedTrays.findIndex(t => t.id === tray.id);
    if (index > -1) {
      this.selectedTrays.splice(index, 1);
    } else {
      const maxTrays = this.isManual ? this.manualTrayCount : (this.selectedAction?.trayCount || 0);
      if (this.selectedTrays.length < maxTrays) {
        this.selectedTrays.push(tray);
      }
    }
  }

  isTraySelected(tray: TrayDto): boolean {
    return this.selectedTrays.some(t => t.id === tray.id);
  }

  canSubmit(): boolean {
    if (this.isManual) {
      return !!this.selectedPlant && this.selectedTrays.length === this.manualTrayCount && this.manualTrayCount > 0;
    }
    return !!this.selectedAction && this.selectedTrays.length === this.selectedAction.trayCount;
  }

  confirmPlanting() {
    if (!this.canSubmit()) return;

    const now = new Date().toISOString();
    const plantId = this.isManual ? this.selectedPlant?.id : this.selectedAction?.plant?.id;

    const data = this.selectedTrays.map(tray => ({
      plantId: plantId,
      tray: tray.code,
      startDate: now
    }));

    this.cropCycleService.createMany(data).subscribe({
      next: () => {
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating crop cycles', err);
      }
    });
  }
}

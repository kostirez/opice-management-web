import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TrayService } from '../../services/tray.service';
import { CropCycleService } from '../../services/crop-cycle.service';
import { DayActionService } from '../../services/day-action.service';
import { BatchHarvestService } from '../../services/batch-harvest.service';
import { CropCycleHarvestService } from '../../services/crop-cycle-harvest.service';
import { TrayDto, CropCycleCustomListItemDto, DayActionDto, BatchHarvestDto, ID } from '../../models';
import { getCurrentDayInWeek } from '../../utils/date-utils';

import { ProvozNavigationComponent } from '../provoz/provoz-navigation/provoz-navigation.component';

@Component({
  selector: 'app-growing-room',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProvozNavigationComponent],
  templateUrl: './growing-room.component.html',
  styleUrls: ['./growing-room.component.scss']
})
export class GrowingRoomComponent implements OnInit {
  loading = false;
  activeCropCycles: CropCycleCustomListItemDto[] = [];
  dayActions: DayActionDto[] = [];
  todayBatchHarvest: BatchHarvestDto | null = null;

  pendingCycles: CropCycleCustomListItemDto[] = [];
  germinationGrid: (CropCycleCustomListItemDto | null)[][] = [];
  lightGrid: (CropCycleCustomListItemDto | null)[][] = [];

  rows = ['A', 'B', 'C', 'D'];
  germCols = [1, 2, 3, 4, 5];
  lightCols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  showMoveModal = false;
  showHarvestModal = false;
  selectedCycle: CropCycleCustomListItemDto | null = null;
  shelfCode: string = '';
  harvestWeight: number | null = null;

  today = new Date().toISOString().split('T')[0];

  keypadNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  keypadLetters = ['A', 'B', 'C', 'D'];

  constructor(
    private trayService: TrayService,
    private cropCycleService: CropCycleService,
    private dayActionService: DayActionService,
    private batchHarvestService: BatchHarvestService,
    private cropCycleHarvestService: CropCycleHarvestService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.loadPlannedActions();
    this.loadTodayBatchHarvest();
    this.loadActiveCropCycles();
  }

  loadPlannedActions() {
    this.dayActionService.getCustomList({
      active: 'true',
      DayInWeek: getCurrentDayInWeek(),
    }).subscribe({
      next: (actions) => {
        this.dayActions = actions.filter(a => a.type === 'MOVE_TO_LIGHT' || a.type === 'HARVEST');
      },
      error: (err) => console.error('Error loading actions', err)
    });
  }

  loadTodayBatchHarvest() {
    this.batchHarvestService.getBatchHarvests({
      'filters[date][$eq]': this.today,
      'populate': 'harvestedCrops.plant,crop_cycle_harvests'
    }).subscribe({
      next: (response) => {
        this.todayBatchHarvest = response.data[0] || null;
        console.log('harvest', this.todayBatchHarvest)
      },
      error: (err) => console.error('Error loading batch harvests', err)
    });
  }

  loadActiveCropCycles() {
    this.cropCycleService.getCustomList({ state_ne: 'HARVESTED' }).subscribe({
      next: (cropCycles) => {
        this.activeCropCycles = cropCycles;
        this.processCropCycles();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading crop cycles', err);
        this.loading = false;
      }
    });
  }

  processCropCycles() {
    this.pendingCycles = this.activeCropCycles.filter(c => c.state === 'PENDING');

    // Init grids
    this.germinationGrid = this.rows.map(() => new Array(this.germCols.length).fill(null));
    this.lightGrid = this.rows.map(() => new Array(this.lightCols.length).fill(null));

    this.activeCropCycles.forEach(c => {
      console.log("crop", c);
      if (c.state === 'GERMINATION' && c.trayPlace?.startsWith('GERM-')) {
        console.log("germ")
        this.placeInGrid(c, 'GERM-', this.germinationGrid, this.germCols);
      } else if (c.state === 'LIGHT' && c.trayPlace?.startsWith('LIGHT-')) {
        this.placeInGrid(c, 'LIGHT-', this.lightGrid, this.lightCols);
      }
    });
  }

  private placeInGrid(cycle: CropCycleCustomListItemDto, prefix: string, grid: (CropCycleCustomListItemDto | null)[][], cols: number[]) {
    console.log("cycle", cycle);
    const code = cycle.trayPlace!.replace(prefix, ''); // e.g., B3
    const rowChar = code.charAt(0).toUpperCase();
    const colNum = parseInt(code.substring(1));
    console.log("rowChar", rowChar);
    console.log("colNum", colNum);
    console.log("code", code);

    const rowIndex = this.rows.indexOf(rowChar);
    const colIndex = cols.indexOf(colNum);
    console.log("rowIndex", rowIndex);
    console.log("colIndex", colIndex);

    if (rowIndex !== -1 && colIndex !== -1) {
      grid[rowIndex][colIndex] = cycle;
    }
  }

  openMoveModal(cycle: CropCycleCustomListItemDto) {
    this.selectedCycle = cycle;
    this.shelfCode = '';
    this.showMoveModal = true;
  }

  confirmMove() {
    if (!this.selectedCycle?.id || !this.shelfCode) return;

    let newState = this.selectedCycle.state;
    let placePrefix = '';
    if (this.selectedCycle.state === 'PENDING') {
      newState = 'GERMINATION';
      placePrefix = 'GERM-';
    } else if (this.selectedCycle.state === 'GERMINATION') {
      newState = 'LIGHT';
      placePrefix = 'LIGHT-';
    }

    this.cropCycleService.move(this.selectedCycle.id.toString(), {
      state: newState,
      placeCode: placePrefix + this.shelfCode.toUpperCase()
    }).subscribe({
      next: () => {
        this.showMoveModal = false;
        this.loadActiveCropCycles();
      },
      error: (err) => console.error('Error moving', err)
    });
  }

  openHarvestModal(cycle: CropCycleCustomListItemDto) {
    this.selectedCycle = cycle;
    this.harvestWeight = null;
    this.showHarvestModal = true;
  }

  confirmHarvest() {
    if (!this.selectedCycle?.id || this.harvestWeight === null) return;

    if (!this.todayBatchHarvest) {
      this.batchHarvestService.createBatchHarvest({ date: this.today }).subscribe({
        next: (resp) => {
          this.todayBatchHarvest = resp.data;
          this.saveHarvestEntry();
        }
      });
    } else {
      this.saveHarvestEntry();
    }
  }

  private saveHarvestEntry() {
    if (!this.selectedCycle?.id || this.harvestWeight === null || !this.todayBatchHarvest?.id) return;

    this.cropCycleHarvestService.createCropCycleHarvest({
      crop_cycle: this.selectedCycle.id as any,
      batch_harvest: this.todayBatchHarvest.id as any,
      weight: this.harvestWeight,
      performedAt: new Date().toISOString()
    }).subscribe({
      next: () => {
        this.showHarvestModal = false;
        this.loadActiveCropCycles();
        this.loadTodayBatchHarvest();
      },
      error: (err) => console.error('Error harvesting', err)
    });
  }

  getTrayColor(cycle: CropCycleCustomListItemDto): string {
    let targetDateStr = '';
    if (cycle.state === 'PENDING') {
      targetDateStr = cycle.seedingDay || '';
    } else if (cycle.state === 'GERMINATION') {
      targetDateStr = cycle.moveToLightDay || '';
    } else {
      targetDateStr = cycle.harvestDay || '';
    }

    if (!targetDateStr) return '';

    const targetDate = targetDateStr.split('T')[0];
    if (targetDate < this.today) return 'red';
    if (targetDate === this.today) return 'green';
    return 'blue';
  }

  getTrayDate(cycle: CropCycleCustomListItemDto): string {
    if (cycle.state === 'PENDING') return cycle.seedingDay || '';
    if (cycle.state === 'GERMINATION') return cycle.moveToLightDay || '';
    return cycle.harvestDay || '';
  }

  getDateWarning(cycle: CropCycleCustomListItemDto): string | null {
    let targetDateStr = '';
    if (cycle.state === 'PENDING') {
      targetDateStr = cycle.seedingDay || '';
    } else if (cycle.state === 'GERMINATION') {
      targetDateStr = cycle.moveToLightDay || '';
    } else {
      targetDateStr = cycle.harvestDay || '';
    }

    if (!targetDateStr) return null;

    const targetDate = targetDateStr.split('T')[0];
    if (targetDate < this.today) return `Delayed! Should have been done on ${targetDate}.`;
    if (targetDate > this.today) return `Early! Scheduled for ${targetDate}.`;
    return null;
  }

  isPlaceOccupied(shelf: string, type: 'GERM' | 'LIGHT'): boolean {
    const shelfCode = shelf.toUpperCase();
    const prefix = type === 'GERM' ? 'GERM-' : 'LIGHT-';
    const grid = type === 'GERM' ? this.germinationGrid : this.lightGrid;
    const cols = type === 'GERM' ? this.germCols : this.lightCols;

    const rowChar = shelfCode.charAt(0);
    const colNum = parseInt(shelfCode.substring(1));

    const rowIndex = this.rows.indexOf(rowChar);
    const colIndex = cols.indexOf(colNum);

    if (rowIndex === -1 || colIndex === -1) return false; // Invalid place is not "occupied" but will be blocked by validity check

    return !!grid[rowIndex][colIndex];
  }

  isValidPlace(shelf: string, type: 'GERM' | 'LIGHT'): boolean {
    const shelfCode = shelf.toUpperCase();
    const cols = type === 'GERM' ? this.germCols : this.lightCols;

    const rowChar = shelfCode.charAt(0);
    const colNumStr = shelfCode.substring(1);
    const colNum = parseInt(colNumStr);

    if (!rowChar || isNaN(colNum)) return false;

    const rowIndex = this.rows.indexOf(rowChar);
    const colIndex = cols.indexOf(colNum);

    return rowIndex !== -1 && colIndex !== -1 && colNumStr === colNum.toString();
  }

  addToShelfCode(val: string | number) {
    this.shelfCode = (this.shelfCode + val.toString()).toUpperCase();
  }

  clearShelfCode() {
    this.shelfCode = '';
  }

  addToWeight(num: number) {
    const current = this.harvestWeight ? this.harvestWeight.toString() : '';
    this.harvestWeight = parseInt(current + num.toString());
  }

  clearWeight() {
    this.harvestWeight = null;
  }

  onTrayClick(cycle: CropCycleCustomListItemDto | null) {
    if (!cycle) return;
    if (cycle.state === 'LIGHT') {
      this.openHarvestModal(cycle);
    } else {
      this.openMoveModal(cycle);
    }
  }

  isActionCompleted(action: DayActionDto): boolean {
    // Basic completion check - could be improved based on actual count
    return false;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrayService } from '../../services/tray.service';
import { CropCycleService } from '../../services/crop-cycle.service';
import { TrayDto, CropCycleCustomListItemDto } from '../../models';

interface TrayGroup {
  state: string;
  trays: TrayDto[];
}

interface ShelfGroup {
  shelf: string;
  trays: TrayDto[];
}

@Component({
  selector: 'app-growing-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './growing-room.component.html',
  styleUrls: ['./growing-room.component.scss']
})
export class GrowingRoomComponent implements OnInit {
  traysByState: TrayGroup[] = [];
  shelves: ShelfGroup[] = [];
  otherInUseTrays: TrayDto[] = [];
  activeCropCycles: CropCycleCustomListItemDto[] = [];
  selectedTray: TrayDto | null = null;
  loading = false;

  constructor(
    private trayService: TrayService,
    private cropCycleService: CropCycleService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.trayService.getTrays().subscribe({
      next: (response) => {
        this.processTrays(response.data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading trays', err);
        this.loading = false;
      }
    });

    this.cropCycleService.getCustomList().subscribe({
      next: (cropCycles) => {
        this.activeCropCycles = cropCycles.filter(c => c.state !== 'HARVESTED');
      },
      error: (err) => {
        console.error('Error loading crop cycles', err);
      }
    });
  }

  processTrays(trays: TrayDto[]) {
    console.log('Processing trays:', trays);
    const states = ['Empty', 'Washing', 'Damaged'];
    this.traysByState = states.map(state => ({
      state,
      trays: trays.filter(t => t.state === state)
    }));
    console.log('Trays by state:', this.traysByState);
    const inUseTrays = trays.filter(t => t.state === 'InUse');
    const shelfMap = new Map<string, TrayDto[]>();
    const others: TrayDto[] = [];
    console.log('inUseTrays:', inUseTrays);
    inUseTrays.forEach(tray => {
      const placeCode = tray.placeCode || '';
      // first letter represent shelf and number position
      // regex to match: letter followed by numbers
      const match = placeCode.match(/^([a-zA-Z])(\d+)/);
      if (match) {
        const shelfLetter = match[1].toUpperCase();
        if (!shelfMap.has(shelfLetter)) {
          shelfMap.set(shelfLetter, []);
        }
        shelfMap.get(shelfLetter)!.push(tray);
      } else {
        others.push(tray);
      }
    });

    this.shelves = Array.from(shelfMap.entries())
      .map(([shelf, trays]) => ({
        shelf,
        trays: trays.sort((a, b) => (a.placeCode || '').localeCompare(b.placeCode || '', undefined, {numeric: true}))
      }))
      .sort((a, b) => a.shelf.localeCompare(b.shelf));

    this.otherInUseTrays = others;
    console.log('Trays by state:', this.traysByState);
    console.log('Shelves:', this.shelves);
    console.log('Other in-use trays:', this.otherInUseTrays);
  }

  selectTray(tray: TrayDto) {
    if (this.selectedTray?.id === tray.id) {
      this.selectedTray = null;
    } else {
      this.selectedTray = tray;
    }
  }

  isCycleHighlighted(cycle: CropCycleCustomListItemDto): boolean {
    if (!this.selectedTray || this.selectedTray.state !== 'InUse') return false;
    return cycle.trayCode === this.selectedTray.code;
  }
}

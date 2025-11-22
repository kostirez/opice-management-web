import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

function toLocalDatetimeInputValue(date: Date): string {
  // Returns YYYY-MM-DDTHH:mm for input[type=datetime-local]
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

@Component({
  selector: 'app-resolve-action-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resolve-action-dialog.component.html',
  styleUrl: './resolve-action-dialog.component.scss',
})
export class ResolveActionDialogComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ timestamp: string; timeSpent: number; amount: number }>();

  timestampLocal: string = toLocalDatetimeInputValue(new Date());
  timeSpent?: number; // minutes or seconds depends on consumer; keep as number
  amount?: number;
  error = '';

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    this.error = '';
    // Validate timestamp
    if (!this.timestampLocal) {
      this.error = 'Please select a timestamp';
      return;
    }

    const timeSpentNum = Number(this.timeSpent);
    if (isNaN(timeSpentNum) || timeSpentNum < 0) {
      this.error = 'Please enter a valid time spent (>= 0)';
      return;
    }

    const amountNum = Number(this.amount);
    if (!amountNum || isNaN(amountNum) || amountNum <= 0) {
      this.error = 'Please enter a valid amount (> 0)';
      return;
    }

    // Convert local datetime to ISO string for consistency
    const timestamp = new Date(this.timestampLocal).toISOString();
    this.submit.emit({ timestamp, timeSpent: timeSpentNum, amount: amountNum });
  }
}

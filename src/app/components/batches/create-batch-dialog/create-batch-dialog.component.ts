import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-batch-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-batch-dialog.component.html',
  styleUrl: './create-batch-dialog.component.scss',
})
export class CreateBatchDialogComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ orderId: number; date: string }>();

  orderId?: number;
  date: string = '';
  error: string = '';

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    this.error = '';
    const orderIdNum = Number(this.orderId);
    if (!orderIdNum || isNaN(orderIdNum)) {
      this.error = 'Please enter a valid Order ID';
      return;
    }
    if (!this.date) {
      this.error = 'Please select a date';
      return;
    }
    // Input type=date already provides YYYY-MM-DD in most browsers
    this.submit.emit({ orderId: orderIdNum, date: this.date });
  }
}

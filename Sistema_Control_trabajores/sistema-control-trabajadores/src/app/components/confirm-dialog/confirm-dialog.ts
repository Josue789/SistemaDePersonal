import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="p-4">
      <h2 mat-dialog-title class="text-xl font-bold mb-2">{{ data.title }}</h2>
      <mat-dialog-content class="mb-4">
        <p class="text-gray-600">{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="gap-2">
        <button mat-button (click)="onSecondary()">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button 
          mat-flat-button 
          [color]="data.isDestructive ? 'warn' : 'primary'" 
          (click)="onPrimary()"
          class="rounded-lg!"
          [style.background-color]="data.isDestructive ? '#ef4444' : '#1e1b4b'"
          [style.color]="'white'"
        >
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onPrimary(): void {
    this.dialogRef.close(true);
  }

  onSecondary(): void {
    this.dialogRef.close(false);
  }
}

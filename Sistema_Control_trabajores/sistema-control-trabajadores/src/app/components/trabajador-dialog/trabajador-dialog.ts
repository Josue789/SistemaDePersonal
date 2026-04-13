import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Trabajador } from '../../models/trabajador.model';

@Component({
  selector: 'app-trabajador-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './trabajador-dialog.html',
})
export class TrabajadorDialog {
  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<TrabajadorDialog>,
    @Inject(MAT_DIALOG_DATA) public trabajador: Trabajador,
  ) {}

  cerrar() {
    this.dialogRef.close();
  }
}

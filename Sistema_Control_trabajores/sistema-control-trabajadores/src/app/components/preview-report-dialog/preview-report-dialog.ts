import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preview-report-dialog',
  imports: [MatIcon, MatButtonModule, MatButtonToggleModule, FormsModule],
  templateUrl: './preview-report-dialog.html',
  styleUrl: './preview-report-dialog.css',
})
export class PreviewReportDialog {
  formato: 'pdf' | 'excel' = 'pdf';

  constructor(private dialogRef: MatDialogRef<PreviewReportDialog>) {}

  onClose() {
    this.dialogRef.close();
  }

  onGenerate() {
    console.log('Generando reporte');
  }
}

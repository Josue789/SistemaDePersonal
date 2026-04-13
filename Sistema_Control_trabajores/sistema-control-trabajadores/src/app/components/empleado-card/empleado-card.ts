import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatCardAvatar,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Trabajador } from '../../models/trabajador.model';
import { TrabajadorDialog } from '../trabajador-dialog/trabajador-dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-empleado-card',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatIcon,
    CommonModule,
    MatChipsModule,
    MatButtonModule,
  ],
  templateUrl: './empleado-card.html',
})
export class EmpleadoCard {
  private dialog = inject(MatDialog);
  private copyService = inject(Clipboard);
  private toastService = inject(MatSnackBar);

  // Copia el texto al portapapeles
  copyToClipboard(text: string) {
    this.copyService.copy(text);
    this.toastService.open('Texto copiado al portapapeles', 'OK');
  }

  // Abre el dialog para ver el trabajador
  verTrabajador(trabajador: Trabajador) {
    this.dialog.open(TrabajadorDialog, {
      data: trabajador,
      width: '600px',
    });
  }
  @Input() empleado: any;
}

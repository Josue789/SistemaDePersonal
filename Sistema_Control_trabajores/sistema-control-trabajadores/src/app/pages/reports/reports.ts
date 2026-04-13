import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PreviewReportDialog } from '../../components/preview-report-dialog/preview-report-dialog';

@Component({
  selector: 'app-reports',
  imports: [MatCard, MatCardContent, MatIcon, MatAnchor],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
  trabajadores = [
    {
      id: 1,
      nombre: 'Juan',
      apellidoPaterno: 'Perez',
      apellidoMaterno: 'Gomez',
      puesto: 'Programador',
      area: 'Tecnologia',
      rfc: '1234567890',
      estatus: 'Activo',
    },
    {
      id: 2,
      nombre: 'Maria',
      apellidoPaterno: 'Gomez',
      apellidoMaterno: 'Perez',
      puesto: 'Diseñador',
      area: 'Tecnologia',
      rfc: '1234567890',
      estatus: 'Activo',
    },
    {
      id: 3,
      nombre: 'Pedro',
      apellidoPaterno: 'Perez',
      apellidoMaterno: 'Gomez',
      puesto: 'Programador',
      area: 'Tecnologia',
      rfc: '1234567890',
      estatus: 'Activo',
    },
    {
      id: 4,
      nombre: 'Ana',
      apellidoPaterno: 'Gomez',
      apellidoMaterno: 'Perez',
      puesto: 'Diseñador',
      area: 'Tecnologia',
      rfc: '1234567890',
      estatus: 'Activo',
    },
    {
      id: 5,
      nombre: 'Luis',
      apellidoPaterno: 'Perez',
      apellidoMaterno: 'Gomez',
      puesto: 'Programador',
      area: 'Tecnologia',
      rfc: '1234567890',
      estatus: 'Activo',
    },
    {
      id: 6,
      nombre: 'Laura',
      apellidoPaterno: 'Gomez',
      apellidoMaterno: 'Perez',
      puesto: 'Diseñador',
      area: 'Tecnologia',
      rfc: '1234567890',
      estatus: 'Activo',
    },
    {
      id: 7,
      nombre: 'Carlos',
      apellidoPaterno: 'Perez',
      apellidoMaterno: 'Gomez',
      puesto: 'Programador',
      area: 'Tecnologia',
      rfc: '1234567890',
      estatus: 'Activo',
    },
    {
      id: 8,
      nombre: 'Sofia',
      apellidoPaterno: 'Gomez',
      apellidoMaterno: 'Perez',
      puesto: 'Diseñador',
      area: 'Tecnologia',
      rfc: '1234567890',
      estatus: 'Activo',
    },
    {
      id: 9,
      nombre: 'Miguel',
      apellidoPaterno: 'Perez',
      apellidoMaterno: 'Gomez',
      puesto: 'Programador',
      area: 'Tecnologia',
      rfc: '1234567890',
      estatus: 'Activo',
    },
    {
      id: 10,
      nombre: 'Fernanda',
      apellidoPaterno: 'Gomez',
      apellidoMaterno: 'Perez',
      puesto: 'Diseñador',
      area: 'Tecnologia',
      rfc: '1234567890',
      estatus: 'Activo',
    },
  ];

  constructor(private dialog: MatDialog) {}

  openPreviewReportDialog() {
    this.dialog.open(PreviewReportDialog, {
      width: '800px',
    });
  }
}

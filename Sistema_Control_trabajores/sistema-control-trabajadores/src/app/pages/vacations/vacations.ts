import { Component, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardContent, MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { VacationsDialog } from '../../components/vacations-dialog/vacations-dialog';
import { MatDialog } from '@angular/material/dialog';
import { VacationService } from '../../services/vacation.service';
import { Ausencia } from '../../models/vacation.model';
import { AuthService } from '../../services/auth.service';
import { inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-vacations',
  imports: [
    MatIcon,
    CommonModule,
    MatCardContent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    FullCalendarModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './vacations.html',
  styleUrl: './vacations.css',
  standalone: true,
})
export class Vacations implements OnInit {
  public authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private vacationService = inject(VacationService);

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  displayedColumns: string[] = ['trabajador', 'dias', 'inicio', 'fin', 'acciones'];

  vacaciones = signal<Ausencia[]>([]);
  vacacionesAprobadas = signal<Ausencia[]>([]);
  loading = signal(true);

  constructor() {}

  ngOnInit() {
    this.loadVacations();
  }

  loadVacations() {
    this.loading.set(true);
    this.vacationService.getAusencias().subscribe({
      next: (data) => {
        this.vacaciones.set(data);
        const hoy = new Date();
        const aprobadas = data.filter(
          (v) =>
            v.estatus === 'aprobado' &&
            (new Date(v.fecha_inicio) <= hoy || new Date(v.fecha_fin) >= hoy),
        );
        this.vacacionesAprobadas.set(aprobadas);
        this.updateCalendarEvents(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading vacations', err);
        this.loading.set(false);
      },
    });
  }

  updateCalendarEvents(vacations: Ausencia[]) {
    const events = vacations
      .filter((v) => v.estatus === 'aprobado')
      .map((v) => ({
        title: `${v.worker_detail?.nombre} ${v.worker_detail?.apellido_paterno}`,
        start: v.fecha_inicio,
        end: v.fecha_fin,
        allDay: true,
        backgroundColor: this.getEventColor(v.tipo_detail?.nombre || ''),
        borderColor: this.getEventColor(v.tipo_detail?.nombre || ''),
      }));

    this.calendarOptions = {
      ...this.calendarOptions,
      events: events,
    };
  }

  getEventColor(tipo: string): string {
    switch (tipo) {
      case 'Vacaciones':
        return '#8B9AFE';
      case 'Economico':
        return '#fd5da0';
      case 'Incapacidad':
        return '#FD5D5D';
      default:
        return '#5DFD6B';
    }
  }

  openVacationsDialog() {
    const dialogRef = this.dialog.open(VacationsDialog, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadVacations();
      }
    });
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek',
    },
  };

  deleteVacation(id: number) {
    if (confirm('¿Estás seguro de eliminar esta solicitud?')) {
      this.vacationService.deleteAusencia(id).subscribe(() => this.loadVacations());
    }
  }

  approveVacation(id: number) {
    this.vacationService
      .updateAusencia(id, { estatus: 'aprobado' })
      .subscribe(() => this.loadVacations());
  }

  rejectVacation(id: number) {
    this.vacationService
      .updateAusencia(id, { estatus: 'rechazado' })
      .subscribe(() => this.loadVacations());
  }
}

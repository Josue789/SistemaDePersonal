import { Component, inject, OnInit } from '@angular/core';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VacationsDialog } from '../../components/vacations-dialog/vacations-dialog';
import { MatDialog } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { MatList, MatListItem } from '@angular/material/list';
import { WorkerService } from '../../services/worker.service';
import { VacationService } from '../../services/vacation.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-profile',
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    MatFabButton,
    MatTabsModule,
    MatProgressBarModule,
    MatIconButton,
    A11yModule,
    MatList,
    MatListItem,
    MatProgressSpinnerModule,
    TitleCasePipe,
    DatePipe,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: any;
  dataOfUser: any;
  diasDisponibles = 0;
  diasGozados = 0;
  diasPendientes = 0;
  fechaVencimiento = 'N/A';
  ausencias: any[] = [];

  workerService = inject(WorkerService);
  vacationService = inject(VacationService);
  settingsService = inject(SettingsService);

  diasFestivos: any[] = [];
  avisos: any[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.user = this.getUser();
    this.loadProfileData();
    this.getDiasFestivos();
    this.getAvisos();
  }

  loadProfileData() {
    this.workerService.getWorkerByUser(this.user.id).subscribe((data: any) => {
      this.dataOfUser = data;
      if (data && data.id) {
        this.loadVacationData(Number(data.id));
      }
    });
  }

  loadVacationData(workerId: number) {
    // Cargar Políticas para días totales
    this.vacationService.getWorkerPoliticas(workerId).subscribe((politicas) => {
      console.log(politicas);
      if (politicas && politicas.length > 0) {
        this.diasDisponibles = politicas.reduce(
          (acc, p) => acc + (p.politica_detail?.dias || 0),
          0,
        );

        // Estimar fecha de vencimiento basada en la política más reciente
        const ultima = politicas[0];
        if (ultima.fecha_fin) {
          this.fechaVencimiento = ultima.fecha_fin;
        }
        this.calculateFinalBalance(workerId);
      } else {
        // Si no hay políticas específicas, usar configuración global
        this.loadGlobalVacationConfig(workerId);
      }
    });
  }

  loadGlobalVacationConfig(workerId: number) {
    this.settingsService.getVacationConfig().subscribe((configs) => {
      if (configs && configs.length > 0) {
        const config = configs[0];
        this.vacationService.getAusenciasByWorker(workerId).subscribe((ausencias) => {
          this.ausencias = ausencias;
          const balance = this.vacationService.calculateBalance(this.dataOfUser, ausencias, config);

          this.diasDisponibles = balance.available;
          this.diasGozados = balance.used;
          this.diasPendientes = balance.pending;
          this.fechaVencimiento = balance.expiry;
        });
      }
    });
  }

  calculateFinalBalance(workerId: number) {
    this.vacationService.getAusenciasByWorker(workerId).subscribe((ausencias) => {
      this.ausencias = ausencias;
      this.diasGozados = ausencias
        .filter((a) => a.estatus === 'aprobado' && a.tipo_detail?.nombre === 'Vacaciones')
        .reduce((acc, a) => acc + a.dias, 0);

      this.diasPendientes = ausencias
        .filter((a) => a.estatus === 'pendiente' && a.tipo_detail?.nombre === 'Vacaciones')
        .reduce((acc, a) => acc + a.dias, 0);

      this.diasDisponibles -= this.diasGozados;
    });
  }

  openVacationsDialog() {
    const dialogRef = this.dialog.open(VacationsDialog, {
      width: '50%',
      data: { workerId: this.dataOfUser?.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProfileData();
      }
    });
  }

  getUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  getDiasFestivos() {
    this.settingsService.getDiasFestivos().subscribe((diasFestivos) => {
      this.diasFestivos = diasFestivos.filter((dia: any) => {
        return dia.fecha >= new Date().toISOString().split('T')[0];
      });
    });
  }

  getAvisos() {
    this.settingsService.getAvisos().subscribe((avisos) => {
      this.avisos = avisos.filter((aviso: any) => {
        return aviso.fecha >= new Date().toISOString().split('T')[0];
      });
    });
  }
}

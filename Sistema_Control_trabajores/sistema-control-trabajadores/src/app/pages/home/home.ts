import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatChipAvatar } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { WorkerService } from '../../services/worker.service';
import { AuthService } from '../../services/auth.service';
import { Trabajador } from '../../models/trabajador.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { TrabajadorDialog } from '../../components/trabajador-dialog/trabajador-dialog';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    MatSortModule,
    MatChipAvatar,
    MatMenuModule,
    MatProgressSpinnerModule,
    NgxSkeletonLoaderComponent,
  ],
  templateUrl: './home.html',
  providers: [],
})
export class Home implements OnInit {
  //private workerService = inject(WorkerService);
  public authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  trabajadores = signal<Trabajador[]>([]);
  sortedData = signal<Trabajador[]>([]);
  loading = signal(true);

  porRenovar = computed(() => {
    return this.trabajadores().filter(
      (trabajador) =>
        !!trabajador.fechaTerminoContrato &&
        trabajador.fechaTerminoContrato < new Date().toISOString(),
    ).length;
  });

  deVacaciones = signal(0);

  constructor(
    private workerService: WorkerService,
  ) {
    effect(() => {
      this.loadWorkers();
    });
  }

  ngOnInit() {}

  loadWorkers() {
    this.loading.set(true);

    this.workerService.getWorkers().subscribe({
      next: (data) => {
        this.trabajadores.set(data);
        this.sortedData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading workers', err);
        this.loading.set(false);
      },
    });
  }

  sortData(sort: Sort) {
    const data = this.trabajadores().slice();
    if (!sort.active || !sort.direction) {
      this.sortedData.set(data);
      return;
    }

    const sorted = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.nombre, b.nombre, isAsc);
        case 'position':
          return compare(a.puesto, b.puesto, isAsc);
        case 'department':
          return compare(a.area, b.area, isAsc);
        case 'rfc':
          return compare(a.rfc, b.rfc, isAsc);
        case 'status':
          return compare(a.estatus, b.estatus, isAsc);
        default:
          return 0;
      }
    });
    this.sortedData.set(sorted);
  }

  viewDetails(worker: Trabajador) {
    this.dialog.open(TrabajadorDialog, {
      data: worker,
      width: '600px',
    });
  }

  editWorker(worker: Trabajador) {
    this.router.navigate(['/new-worker', worker.id]);
  }

  deleteWorker(worker: Trabajador) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar trabajador',
        message: `¿Estás seguro de que deseas eliminar a ${worker.nombre} ${worker.apellidoPaterno}?`,
        confirmText: 'Eliminar',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && worker.id) {
        this.workerService.deleteWorker(String(worker.id)).subscribe({
          next: () => this.loadWorkers(),
          error: (err) => console.error('Error deleting worker', err),
        });
      }
    });
  }

  renewContract(worker: Trabajador) {
    if (!worker.fechaTerminoContrato || !worker.tipoContrato) {
      alert('Información de contrato incompleta');
      return;
    }

    const currentExpiry = new Date(worker.fechaTerminoContrato);
    const newExpiry = new Date(currentExpiry);

    switch (worker.tipoContrato) {
      case 'Semanal':
        newExpiry.setDate(currentExpiry.getDate() + 7);
        break;
      case 'Quincenal':
        newExpiry.setDate(currentExpiry.getDate() + 15);
        break;
      case 'Mensual':
        newExpiry.setMonth(currentExpiry.getMonth() + 1);
        break;
      case 'Bimestral':
        newExpiry.setMonth(currentExpiry.getMonth() + 2);
        break;
      case 'Trimestral':
        newExpiry.setMonth(currentExpiry.getMonth() + 3);
        break;
      case 'Semestral':
        newExpiry.setMonth(currentExpiry.getMonth() + 6);
        break;
      case 'Anual':
        newExpiry.setFullYear(currentExpiry.getFullYear() + 1);
        break;
      default:
        alert('Tipo de contrato no renovable automáticamente');
        return;
    }

    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const newExpiryStr = formatDate(newExpiry);

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Renovar contrato',
        message: `¿Deseas renovar el contrato de ${worker.nombre}? El nuevo vencimiento será el ${newExpiryStr}.`,
        confirmText: 'Renovar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && worker.id) {
        this.workerService
          .updateWorker(String(worker.id), {
            fecha_termino_contrato: newExpiryStr,
          } as any)
          .subscribe({
            next: () => this.loadWorkers(),
            error: (err) => console.error('Error renewing contract', err),
          });
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

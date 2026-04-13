import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter, ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { WorkerService } from '../../services/worker.service';
import { VacationService } from '../../services/vacation.service';
import { Trabajador } from '../../models/trabajador.model';
import { TipoAusencia, VacationConfig } from '../../models/vacation.model';
import { SettingsService } from '../../services/settings.service';
import { OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

export class FechasInvalidasMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (
      !!(control && control.invalid && (control.dirty || control.touched || isSubmitted)) ||
      !!(form && form.hasError('fechasInvalidas') && (control?.touched || isSubmitted))
    );
  }
}

@Component({
  selector: 'app-vacations-dialog',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatDatepickerModule,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    MatInputModule,
    MatAnchor,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './vacations-dialog.html',
  styleUrl: './vacations-dialog.css',
})
export class VacationsDialog implements OnInit {
  private workerService = inject(WorkerService);
  private vacationService = inject(VacationService);
  private dialogRef = inject(MatDialogRef<VacationsDialog>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);
  private snackBar = inject(MatSnackBar);

  matcher = new FechasInvalidasMatcher();
  workers: Trabajador[] = [];
  types: TipoAusencia[] = [];
  isReadOnly = false;
  availableDays = 0;
  workerData: any = null;
  vacationConfig: VacationConfig | null = null;

  form = this.fb.group(
    {
      worker: ['', Validators.required],
      inicio: [new Date(), Validators.required],
      fin: [new Date(), Validators.required],
      tipo: ['', Validators.required],
      nota: [''],
    },
    {
      validators: this.fechasValidas,
    },
  );

  get minEndDate(): Date {
    return this.form?.get('inicio')?.value || new Date();
  }

  constructor() {}

  ngOnInit() {
    this.vacationService.getTiposAusencia().subscribe((data) => (this.types = data));
    
    if (this.data && this.data.workerId) {
      this.isReadOnly = true;
      this.form.patchValue({ worker: this.data.workerId });
      
      // Cargar info del trabajador y balance
      forkJoin({
        worker: this.workerService.getWorker(this.data.workerId),
        config: this.settingsService.getVacationConfig(),
        ausencias: this.vacationService.getAusenciasByWorker(this.data.workerId)
      }).subscribe(({ worker, config, ausencias }) => {
        this.workers = [worker];
        this.workerData = worker;
        if (config && config.length > 0) {
          this.vacationConfig = config[0];
          const balance = this.vacationService.calculateBalance(worker, ausencias, config[0]);
          this.availableDays = balance.available;
        }
      });
    } else {
      this.workerService.getWorkers().subscribe((data) => (this.workers = data));
      this.settingsService.getVacationConfig().subscribe(c => {
        if (c && c.length > 0) this.vacationConfig = c[0];
      });
    }
  }

  fechasValidas(group: any) {
    const inicio = group.get('inicio')?.value;
    const fin = group.get('fin')?.value;
    console.log(inicio > fin ? { fechasInvalidas: true } : null);
    return inicio > fin ? { fechasInvalidas: true } : null;
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const formatDate = (date: any) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    // Calculate days
    const start = new Date(val.inicio as any);
    const end = new Date(val.fin as any);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Validación de balance si es Vacaciones (asumiendo ID 1 o nombre)
    const tipoSeleccionado = this.types.find(t => t.id === Number(val.tipo));
    if (tipoSeleccionado?.nombre === 'Vacaciones' && this.availableDays < diffDays) {
      this.snackBar.open(`No tienes suficientes días disponibles (${this.availableDays} restantes)`, 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const payload = {
      worker: val.worker,
      tipo: val.tipo,
      fecha_inicio: formatDate(val.inicio),
      fecha_fin: formatDate(val.fin),
      dias: diffDays,
      estatus: 'pendiente',
      nota: val.nota
    };

    this.vacationService.createAusencia(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Error creating absence', err)
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

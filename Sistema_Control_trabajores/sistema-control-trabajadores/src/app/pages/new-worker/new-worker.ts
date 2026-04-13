import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { provideNativeDateAdapter, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { getEstados } from '../../services/estados.service';
import { WorkerService } from '../../services/worker.service';
import { PuestoService } from '../../services/puesto.service';
import { UserService } from '../../services/user.service';
import { Puesto } from '../../models/puesto.model';
import { User } from '../../models/user.model';
import { Trabajador } from '../../models/trabajador.model';

@Component({
  selector: 'app-new-worker',
  imports: [
    MatCard,
    MatCardContent,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatCheckboxModule,
    MatDatepickerModule,
    CommonModule,
    MatOption,
    MatSelectModule,
  ],
  templateUrl: './new-worker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class NewWorker implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private workerService = inject(WorkerService);
  private puestoService = inject(PuestoService);
  private userService = inject(UserService);

  workerId: string | null = null;
  isEditMode = false;
  today = new Date().setDate(new Date().getDate() + 1);
  estados = getEstados();
  puestos: Puesto[] = [];
  periodContractTypes = [
    { value: 'Quincenal', viewValue: 'Quincenal' },
    { value: 'Mensual', viewValue: 'Mensual' },
    { value: 'Semanal', viewValue: 'Semanal' },
    { value: 'Semestral', viewValue: 'Semestral' },
    { value: 'Bimestral', viewValue: 'Bimestral' },
    { value: 'Trimestral', viewValue: 'Trimestral' },
    { value: 'Anual', viewValue: 'Anual' },
    { value: 'Indeterminado', viewValue: 'Indeterminado' },
  ];

  firstFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    paternalSurname: ['', Validators.required],
    maternalSurname: ['', Validators.required],
    dateOfBirth: ['', [Validators.required]],
    curp: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/i),
        Validators.maxLength(18),
      ],
    ],
    rfc: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/i),
        Validators.maxLength(13),
      ],
    ],
  });
  secondFormGroup = this._formBuilder.group({
    position: ['', Validators.required],
    department: ['', Validators.required],
    dateOfAdmission: [null as Date | null, Validators.required],
    contractType: ['', Validators.required],
    endDate: [null as Date | null],
    salary: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{2})?$/)]],
  });
  thirdFormGroup = this._formBuilder.group({
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    number: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
    neighborhood: ['', Validators.required],
    municipality: ['', Validators.required],
    state: ['', Validators.required],
  });
  fourthFormGroup = this._formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rol: ['', Validators.required],
  });
  fifthFormGroup = this._formBuilder.group({});
  isLinear = false;

  ngOnInit() {
    this.workerId = this.route.snapshot.paramMap.get('id');
    if (this.workerId) {
      this.isEditMode = true;
      this.loadWorkerData(this.workerId);
    }
  }

  loadWorkerData(id: string) {
    this.workerService.getWorker(id).subscribe({
      next: (worker) => {
        // Find position ID by name if necessary, though getWorker should return ID
        const puesto = this.puestos.find((p) => p.nombre === worker.puesto) || worker.puesto;

        this.firstFormGroup.patchValue({
          name: worker.nombre,
          paternalSurname: worker.apellidoPaterno,
          maternalSurname: worker.apellidoMaterno,
          dateOfBirth: worker.fechaNacimiento as any, // Adjust if needed
          curp: worker.curp,
          rfc: worker.rfc,
        });

        this.secondFormGroup.patchValue({
          position: typeof puesto === 'object' ? String(puesto.id) : worker.puesto,
          department: worker.area,
          dateOfAdmission: worker.fechaContratacion as any,
          contractType: worker.tipoContrato,
          endDate: worker.fechaTerminoContrato as any,
          salary: String(worker.sueldo),
        });

        this.thirdFormGroup.patchValue({
          phone: worker.telefono,
          email: worker.correo,
          // address, number... need mapping if they are in different fields
          // Assuming these fields are available in the worker object from API
          address: (worker as any).calle,
          number: (worker as any).numero,
          postalCode: (worker as any).cp,
          neighborhood: (worker as any).colonia,
          municipality: (worker as any).municipio,
          state: (worker as any).estado,
        });

        // For editing, we might not want to edit the user account here
        // or just skip fourth step
      },
      error: (err) => console.error('Error loading worker', err),
    });
  }

  constructor() {
    this.loadPuestos();
    this.setupFormListeners();

    this.firstFormGroup.get('curp')?.valueChanges.subscribe((val) => {
      if (val) {
        this.firstFormGroup.get('curp')?.setValue(val.toUpperCase(), { emitEvent: false });
      }
    });

    this.firstFormGroup.get('rfc')?.valueChanges.subscribe((val) => {
      if (val) {
        this.firstFormGroup.get('rfc')?.setValue(val.toUpperCase(), { emitEvent: false });
      }
    });

    this.thirdFormGroup.get('phone')?.valueChanges.subscribe((val) => {
      if (val) {
        this.thirdFormGroup.get('phone')?.setValue(val.replace(/\D/g, ''), { emitEvent: false });
      }
      if (val?.length === 10) {
        this.thirdFormGroup.get('phone')?.setValue(val, { emitEvent: false });
      }
    });

    this.thirdFormGroup.get('postalCode')?.valueChanges.subscribe((val) => {
      if (val) {
        this.thirdFormGroup
          .get('postalCode')
          ?.setValue(val.replace(/\D/g, ''), { emitEvent: false });
      }
      if (val?.length === 5) {
        this.thirdFormGroup.get('postalCode')?.setValue(val, { emitEvent: false });
      }
    });

    // Auto-populate user fields from worker data
    this.firstFormGroup.valueChanges.subscribe((val) => {
      if (val) {
        this.fourthFormGroup.patchValue(
          {
            username: ((val.name?.split(' ')[0] || '') + (val.paternalSurname || '')).toLowerCase(),
          },
          { emitEvent: false },
        );
      }
    });
  }

  loadPuestos() {
    this.puestoService.getPuestos().subscribe({
      next: (puestos) => (this.puestos = puestos),
      error: (err) => console.error('Error loading positions', err),
    });
  }

  setupFormListeners() {
    this.secondFormGroup.get('position')?.valueChanges.subscribe((puestoId) => {
      const selectedId = Number(puestoId as any);
      const puestoSeleccionado = this.puestos.find((p) => p.id === selectedId);
      if (puestoSeleccionado) {
        this.secondFormGroup.patchValue({
          department: puestoSeleccionado.area || '',
          salary: String(puestoSeleccionado.sueldo || 0),
        });
      }
    });

    this.secondFormGroup.get('contractType')?.valueChanges.subscribe(() => {
      this.updateEndDate();
    });

    this.secondFormGroup.get('dateOfAdmission')?.valueChanges.subscribe(() => {
      this.updateEndDate();
    });
  }

  updateEndDate() {
    const admissionDate = this.secondFormGroup.get('dateOfAdmission')?.value;
    const contractType = this.secondFormGroup.get('contractType')?.value;

    if (admissionDate && contractType) {
      const date = new Date(admissionDate);
      let endDate: Date | null = new Date(date);

      switch (contractType) {
        case 'Semanal':
          endDate.setDate(date.getDate() + 7);
          break;
        case 'Quincenal':
          endDate.setDate(date.getDate() + 15);
          break;
        case 'Mensual':
          endDate.setMonth(date.getMonth() + 1);
          break;
        case 'Bimestral':
          endDate.setMonth(date.getMonth() + 2);
          break;
        case 'Trimestral':
          endDate.setMonth(date.getMonth() + 3);
          break;
        case 'Semestral':
          endDate.setMonth(date.getMonth() + 6);
          break;
        case 'Anual':
          endDate.setFullYear(date.getFullYear() + 1);
          break;
        case 'Indeterminado':
          endDate = null;
          break;
        default:
          endDate = null;
      }

      this.secondFormGroup.patchValue(
        {
          endDate: endDate ? endDate : null,
        },
        { emitEvent: false },
      );
    }
  }

  registerWorker() {
    const selectedPuestoId = Number(this.secondFormGroup.value.position as any);
    const selectedPuesto = this.puestos.find((p) => p.id === selectedPuestoId);

    const formatDate = (date: any) => {
      if (!date) return null;
      const d = new Date(date);
      const month = '' + (d.getMonth() + 1);
      const day = '' + d.getDate();
      const year = d.getFullYear();
      return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    };

    const workerData: any = {
      nombre: this.firstFormGroup.value.name,
      apellido_paterno: this.firstFormGroup.value.paternalSurname,
      apellido_materno: this.firstFormGroup.value.maternalSurname,
      fecha_nac: formatDate(this.firstFormGroup.value.dateOfBirth),
      curp: this.firstFormGroup.value.curp,
      rfc: this.firstFormGroup.value.rfc,
      puesto: selectedPuesto ? selectedPuesto.id : null,
      telefono: this.thirdFormGroup.value.phone,
      correo: this.thirdFormGroup.value.email,
      calle: this.thirdFormGroup.value.address,
      numero: this.thirdFormGroup.value.number,
      cp: this.thirdFormGroup.value.postalCode,
      colonia: this.thirdFormGroup.value.neighborhood,
      municipio: this.thirdFormGroup.value.municipality,
      estado: this.thirdFormGroup.value.state,
      pais: 'México',
      fecha_ingreso: formatDate(this.secondFormGroup.value.dateOfAdmission),
      tipo_contrato: this.secondFormGroup.value.contractType,
      fecha_termino_contrato: formatDate(this.secondFormGroup.value.endDate),
      activo: true,
    };

    if (this.isEditMode && this.workerId) {
      this.workerService.updateWorker(this.workerId, workerData).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (err) => console.error('Error updating worker', err),
      });
      return;
    }

    // Creating new worker
    const userData: User = {
      username: this.fourthFormGroup.value.username!,
      password: this.fourthFormGroup.value.password!,
      rol: this.fourthFormGroup.value.rol!,
      email: this.thirdFormGroup.value.email!,
      first_name: this.firstFormGroup.value.name!,
      last_name: `${this.firstFormGroup.value.paternalSurname} ${this.firstFormGroup.value.maternalSurname}`,
      rfc: this.firstFormGroup.value.rfc!,
    };

    this.userService.createUser(userData).subscribe({
      next: (user) => {
        const workerData: any = {
          nombre: this.firstFormGroup.value.name,
          apellido_paterno: this.firstFormGroup.value.paternalSurname,
          apellido_materno: this.firstFormGroup.value.maternalSurname,
          fecha_nac: formatDate(this.firstFormGroup.value.dateOfBirth),
          curp: this.firstFormGroup.value.curp,
          rfc: this.firstFormGroup.value.rfc,
          puesto: selectedPuesto ? selectedPuesto.id : null,
          telefono: this.thirdFormGroup.value.phone,
          correo: this.thirdFormGroup.value.email,
          calle: this.thirdFormGroup.value.address,
          numero: this.thirdFormGroup.value.number,
          cp: this.thirdFormGroup.value.postalCode,
          colonia: this.thirdFormGroup.value.neighborhood,
          municipio: this.thirdFormGroup.value.municipality,
          estado: this.thirdFormGroup.value.state,
          pais: 'México',
          fecha_ingreso: formatDate(this.secondFormGroup.value.dateOfAdmission),
          tipo_contrato: this.secondFormGroup.value.contractType,
          fecha_termino_contrato: formatDate(this.secondFormGroup.value.endDate),
          activo: true,
          user: user.id,
        };

        this.workerService.createWorker(workerData).subscribe({
          next: () => {
            this.firstFormGroup.reset();
            this.secondFormGroup.reset();
            this.thirdFormGroup.reset();
            this.fourthFormGroup.reset();
            this.fifthFormGroup.reset();
            this.router.navigate(['']);
          },
          error: (err) => {
            console.error('Error saving worker', err);
          },
        });
      },
      error: (err) => {
        console.error('Error creating user', err);
      },
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatNavList, MatListItem } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SettingsService } from '../../services/settings.service';
import { Area, DiaFestivo, Aviso, VacationConfig } from '../../models/vacation.model';
import { AuthService } from '../../services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-settings',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatRadioModule,
    FormsModule,
    MatDatepickerModule,
    MatTooltipModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private settingsService = inject(SettingsService);
  public authService = inject(AuthService);
  
  currentSection: string = 'general';
  themeSelected: string = 'claro';

  // Signals for data
  holidays = signal<DiaFestivo[]>([]);
  notices = signal<Aviso[]>([]);
  workAreas = signal<Area[]>([]);

  vacationConfig: VacationConfig = {
    meses_minimos: 6,
    dias_iniciales: 10,
    meses_vigencia: 4
  };

  // Form fields
  newHolidayName: string = '';
  newHolidayDate: Date | null = null;
  newNoticeTitle: string = '';
  newNoticeDate: Date | null = null;
  newNoticeDescription: string = '';
  newAreaName: string = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.settingsService.getDiasFestivos().subscribe(data => this.holidays.set(data));
    this.settingsService.getAvisos().subscribe(data => this.notices.set(data));
    this.settingsService.getAreas().subscribe(data => this.workAreas.set(data));
    this.settingsService.getVacationConfig().subscribe(data => {
      if (data && data.length > 0) {
        this.vacationConfig = data[0];
      }
    });
  }

  selectSection(section: string) {
    this.currentSection = section;
  }

  exportDb() {
    alert('Exportando base de datos a formato CSV/SQL...');
  }

  addHoliday() {
    if (this.newHolidayName && this.newHolidayDate) {
      const payload = {
        descripcion: this.newHolidayName,
        fecha: this.newHolidayDate.toISOString().split('T')[0],
        obligatorio: true,
        activo: true
      };
      this.settingsService.createDiaFestivo(payload).subscribe(() => {
        this.loadData();
        this.newHolidayName = '';
        this.newHolidayDate = null;
      });
    }
  }

  deleteHoliday(id: number) {
    this.settingsService.deleteDiaFestivo(id).subscribe(() => this.loadData());
  }

  addNotice() {
    if (this.newNoticeTitle && this.newNoticeDate && this.newNoticeDescription) {
      const payload = {
        titulo: this.newNoticeTitle,
        fecha: this.newNoticeDate.toISOString().split('T')[0],
        descripcion: this.newNoticeDescription
      };
      this.settingsService.createAviso(payload).subscribe(() => {
        this.loadData();
        this.newNoticeTitle = '';
        this.newNoticeDate = null;
        this.newNoticeDescription = '';
      });
    }
  }

  deleteNotice(id: number) {
    this.settingsService.deleteAviso(id).subscribe(() => this.loadData());
  }

  addArea() {
    if (this.newAreaName) {
      this.settingsService.createArea({ nombre: this.newAreaName }).subscribe(() => {
        this.loadData();
        this.newAreaName = '';
      });
    }
  }

  deleteArea(id: number) {
    this.settingsService.deleteArea(id).subscribe(() => this.loadData());
  }

  saveVacationConfig() {
    const config = this.vacationConfig;
    if (config.id) {
      this.settingsService.updateVacationConfig(config.id, config).subscribe({
        next: () => alert('Configuración guardada correctamente'),
        error: (err) => console.error('Error updating config', err)
      });
    } else {
      this.settingsService.createVacationConfig(config).subscribe({
        next: (newConfig) => {
          this.vacationConfig = newConfig;
          alert('Configuración creada correctamente');
        },
        error: (err) => console.error('Error creating config', err)
      });
    }
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Area, DiaFestivo, Aviso, VacationConfig } from '../models/vacation.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.apiUrl}/areas/`);
  }

  createArea(area: Partial<Area>): Observable<Area> {
    return this.http.post<Area>(`${this.apiUrl}/areas/`, area);
  }

  deleteArea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/areas/${id}/`);
  }

  getDiasFestivos(): Observable<DiaFestivo[]> {
    return this.http.get<DiaFestivo[]>(`${this.apiUrl}/dias-festivos/`);
  }

  createDiaFestivo(dia: Partial<DiaFestivo>): Observable<DiaFestivo> {
    return this.http.post<DiaFestivo>(`${this.apiUrl}/dias-festivos/`, dia);
  }

  deleteDiaFestivo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dias-festivos/${id}/`);
  }

  getAvisos(): Observable<Aviso[]> {
    return this.http.get<Aviso[]>(`${this.apiUrl}/avisos/`);
  }

  createAviso(aviso: Partial<Aviso>): Observable<Aviso> {
    return this.http.post<Aviso>(`${this.apiUrl}/avisos/`, aviso);
  }

  deleteAviso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/avisos/${id}/`);
  }

  getVacationConfig(): Observable<VacationConfig[]> {
    return this.http.get<VacationConfig[]>(`${this.apiUrl}/config-vacaciones/`);
  }

  updateVacationConfig(id: number, config: Partial<VacationConfig>): Observable<VacationConfig> {
    return this.http.put<VacationConfig>(`${this.apiUrl}/config-vacaciones/${id}/`, config);
  }

  createVacationConfig(config: Partial<VacationConfig>): Observable<VacationConfig> {
    return this.http.post<VacationConfig>(`${this.apiUrl}/config-vacaciones/`, config);
  }
}

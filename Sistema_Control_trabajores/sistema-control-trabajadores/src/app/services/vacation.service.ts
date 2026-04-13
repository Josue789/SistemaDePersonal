import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Ausencia, TipoAusencia, Politica, VacationConfig } from '../models/vacation.model';

@Injectable({
  providedIn: 'root',
})
export class VacationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  getAusencias(): Observable<Ausencia[]> {
    return this.http.get<Ausencia[]>(`${this.apiUrl}/ausencias/`);
  }

  createAusencia(ausencia: any): Observable<Ausencia> {
    return this.http.post<Ausencia>(`${this.apiUrl}/ausencias/`, ausencia);
  }

  getTiposAusencia(): Observable<TipoAusencia[]> {
    return this.http.get<TipoAusencia[]>(`${this.apiUrl}/tipos-ausencia/`);
  }

  getPoliticas(): Observable<Politica[]> {
    return this.http.get<Politica[]>(`${this.apiUrl}/politicas/`);
  }

  updateAusencia(id: number, data: Partial<Ausencia>): Observable<Ausencia> {
    return this.http.patch<Ausencia>(`${this.apiUrl}/ausencias/${id}/`, data);
  }

  deleteAusencia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ausencias/${id}/`);
  }

  getAusenciasByWorker(workerId: number): Observable<Ausencia[]> {
    return this.http.get<Ausencia[]>(`${this.apiUrl}/ausencias/?worker=${workerId}`);
  }

  getWorkerPoliticas(workerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trabajador-politicas/?worker=${workerId}`);
  }

  calculateBalance(worker: any, ausencias: Ausencia[], config: VacationConfig) {
    const fechaContratacion = new Date(worker.fechaContratacion);
    const hoy = new Date();
    
    // Diferencia en meses
    const diffMeses = (hoy.getFullYear() - fechaContratacion.getFullYear()) * 12 + (hoy.getMonth() - fechaContratacion.getMonth());
    
    if (diffMeses < config.meses_minimos) {
      return { available: 0, used: 0, pending: 0, expiry: 'N/A', nextGrant: '' };
    }

    const mesesPostMinimo = diffMeses - config.meses_minimos;
    const numeroPeriodos = Math.floor(mesesPostMinimo / config.meses_vigencia) + 1;
    
    const fechaVencimientoDate = new Date(fechaContratacion);
    fechaVencimientoDate.setMonth(fechaVencimientoDate.getMonth() + config.meses_minimos + (numeroPeriodos * config.meses_vigencia));
    
    const inicioPeriodoActual = new Date(fechaVencimientoDate);
    inicioPeriodoActual.setMonth(inicioPeriodoActual.getMonth() - config.meses_vigencia);
    
    const ausenciasFiltradas = ausencias.filter(a => new Date(a.fecha_inicio) >= inicioPeriodoActual);

    const used = ausenciasFiltradas
      .filter((a) => a.estatus === 'aprobado' && (a.tipo_detail?.nombre === 'Vacaciones' || a['tipo'] === 1)) // Assuming 1 is Vacations
      .reduce((acc, a) => acc + a.dias, 0);

    const pending = ausenciasFiltradas
      .filter((a) => a.estatus === 'pendiente' && (a.tipo_detail?.nombre === 'Vacaciones' || a['tipo'] === 1))
      .reduce((acc, a) => acc + a.dias, 0);

    return {
      available: config.dias_iniciales - used,
      used,
      pending,
      expiry: fechaVencimientoDate.toISOString().split('T')[0]
    };
  }
}

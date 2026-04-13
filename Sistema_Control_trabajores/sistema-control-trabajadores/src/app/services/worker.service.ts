import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { Trabajador } from '../models/trabajador.model';

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/trabajadores/`;

  getWorkers(): Observable<Trabajador[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(map((workers) => workers.map((w) => this.mapWorker(w))));
  }

  getWorker(id: string): Observable<Trabajador> {
    return this.http.get<any>(`${this.apiUrl}${id}/`).pipe(map((worker) => this.mapWorker(worker)));
  }

  getWorkerByUser(userId: string): Observable<Trabajador> {
    return this.http
      .get<any>(`${this.apiUrl}?user=${userId}`)
      .pipe(map((workers) => this.mapWorker(workers[0])));
  }

  private mapWorker(w: any): Trabajador {
    return {
      id: w.id,
      nombre: w.nombre || '',
      apellidoPaterno: w.apellido_paterno || '',
      apellidoMaterno: w.apellido_materno || '',
      fechaNacimiento: w.fecha_nac || '',
      telefono: w.telefono || '',
      correo: w.correo || '',
      curp: w.curp || '',
      rfc: w.rfc || '',
      imss: w.imss || '',
      puesto: w.puesto_detail?.nombre || w.puesto || '',
      area: w.puesto_detail?.area_detail?.nombre || '',
      fechaContratacion: w.fecha_ingreso || '',
      tipoContrato: w.tipo_contrato || '',
      fechaTerminoContrato: w.fecha_termino_contrato || '',
      sueldo: w.puesto_detail?.sueldo || 0,
      estatus: w.activo ? 'Activo' : 'Inactivo',
      user: w.user,
      calle: w.calle || '',
      numero: w.numero || '',
      colonia: w.colonia || '',
      municipio: w.municipio || '',
      estado: w.estado || '',
      codigoPostal: w.codigo_postal || '',
    };
  }

  createWorker(worker: Trabajador): Observable<Trabajador> {
    return this.http.post<Trabajador>(this.apiUrl, worker);
  }

  updateWorker(id: string, worker: Partial<Trabajador>): Observable<Trabajador> {
    return this.http.patch<Trabajador>(`${this.apiUrl}${id}/`, worker);
  }

  deleteWorker(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}

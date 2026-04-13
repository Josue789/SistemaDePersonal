import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Puesto } from '../models/puesto.model';

@Injectable({
  providedIn: 'root',
})
export class PuestoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/puestos/`;

  getPuestos(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(this.apiUrl);
  }

  getPuesto(id: number): Observable<Puesto> {
    return this.http.get<Puesto>(`${this.apiUrl}${id}/`);
  }
}

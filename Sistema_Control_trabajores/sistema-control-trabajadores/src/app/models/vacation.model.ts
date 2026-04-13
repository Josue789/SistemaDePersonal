export interface TipoAusencia {
  id?: number;
  nombre: string;
}

export interface Ausencia {
  id?: number;
  worker: number;
  worker_detail?: any;
  tipo: number;
  tipo_detail?: TipoAusencia;
  fecha_inicio: string;
  fecha_fin: string;
  dias: number;
  estatus: string;
  nota?: string;
  aprobado_por?: number;
  fecha_aprobacion?: string;
}

export interface Politica {
  id?: number;
  tipo: number;
  tipo_detail?: TipoAusencia;
  dias: number;
  periodo_dias: number;
  antiguedad_min: number;
  antiguedad_max?: number;
  activo: boolean;
}

export interface DiaFestivo {
  id?: number;
  fecha: string;
  descripcion: string;
  obligatorio: boolean;
  activo: boolean;
}

export interface Area {
  id?: number;
  nombre: string;
}

export interface Aviso {
  id?: number;
  titulo: string;
  fecha: string;
  descripcion: string;
  created_at?: string;
}

export interface VacationConfig {
  id?: number;
  meses_minimos: number;
  dias_iniciales: number;
  meses_vigencia: number;
}

export interface Trabajador {
  id?: string | number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string | null;
  telefono: string;
  correo: string;
  curp: string;
  rfc: string;
  imss: string;
  puesto: string;
  area: string;
  fechaContratacion: string | null;
  tipoContrato: string;
  fechaTerminoContrato: string | null;
  sueldo: number;
  estatus: string;
  user?: number;
  calle: string;
  numero: string;
  colonia: string;
  municipio: string;
  estado: string;
  codigoPostal: string;
}

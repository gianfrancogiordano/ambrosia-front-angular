import { TableCliente } from './tableCliente';

export interface TablePagination {
  conteo: number;
  data: TableCliente[];
  pagActual: number;
  pagSiguiente: number;
  pagAnterior: number;
  pagTotal: number;
  paginas: number[];
}

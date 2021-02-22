import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes/clientes.service';
import { LoginService } from '../../services/login/login.service';
import { TablePagination } from '../../interfaces/tablePagination';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  filtroData: string;
  loadingTable = true;
  pagina: any = 1;
  porPagina: any = 10;
  tableData: TablePagination = {
    conteo: 0,
    data: [],
    pagActual: 0,
    pagSiguiente: 0,
    pagAnterior: 0,
    pagTotal: 0,
    paginas: []
  };

  constructor( private clienteService: ClientesService,
               private loginService: LoginService,
               private router: Router) { }

  ngOnInit(): void {
    this.getClientes( this.pagina, this.porPagina );
  }

  getClientes( pag: number, porPag: number ) {

    this.loadingTable = true;
    this.clienteService.getClientes(pag, porPag).subscribe(( clientes: TablePagination ) => {
      this.tableData = clientes;
      this.loadingTable = false;
    }, error => {

      console.log( error );
      if ( error.status === 401 ) {
        this.loginService.logout();
      }
    });

  }

  buscarCliente() {

    this.loadingTable = true;
    this.clienteService.getClientes( 1, this.porPagina, this.filtroData ).subscribe( clienteFiltrado => {
        this.tableData = clienteFiltrado;
        this.loadingTable = false;
      }, error => {
        if ( error.status === 401 ) {
          this.loginService.logout();
        }

      });
  }

  changePorPag( ePorPagina: any ) {
    this.porPagina = ePorPagina;
    this.getClientes( 1, ePorPagina );
  }

  verCliente( id: string ) {
    this.router.navigate(['/cliente', id ] );
  }

  pedidoCliente( id: string ) {
    console.log( id );
  }

  eliminarCliente( id: string ) {
    console.log( id );
  }

}

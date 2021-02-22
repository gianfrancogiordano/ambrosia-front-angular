import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes/clientes.service';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../../interfaces/cliente';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-ver-cliente',
  templateUrl: './ver-cliente.component.html',
  styleUrls: ['./ver-cliente.component.css']
})
export class VerClienteComponent implements OnInit {

  cliente: any = [];
  idCliente: number;

  constructor( private loginService: LoginService,
               private clientesService: ClientesService,
               private activateRoutes: ActivatedRoute ) { }

  ngOnInit(): void {
    this.activateRoutes.params.subscribe( params => {
      this.getDataCliente( params.id );
      this.idCliente = params.id;
    });
  }

  getDataCliente( idx: number ) {
    this.clientesService.getCliente( idx )
      .subscribe( (data: Cliente) => this.cliente = data, error => {
        if ( error.status === 401 ) {
          this.loginService.logout();
        }
      });
  }

}

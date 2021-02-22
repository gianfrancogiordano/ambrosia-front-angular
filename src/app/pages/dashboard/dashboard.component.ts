import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import {DashboardService} from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  ingresoDia = 0;
  ingresoMes = 0;

  galletasDia = 0;
  galletasMes = 0;

  brannyDia = 0;
  brannyMes = 0;


  constructor( private usuarioService: UsuarioService,
               private dashboardService: DashboardService ) { }

  ngOnInit(): void {
    this.getDataDash();
  }

  getDataDash() {
    this.dashboardService.getData().subscribe( data => {

      data.diario.forEach( diarios => {

        this.ingresoDia += diarios.monto;

        switch ( diarios.id ) {
          case 1:
            this.galletasDia = diarios.cantidad;
            break;
          case 3:
            this.brannyDia = diarios.cantidad;
            break;
        }

      });

      data.mes.forEach( mes => {

        this.ingresoMes += mes.monto;
        switch ( mes.id ) {
          case 1:
            this.galletasMes = mes.cantidad;
            break;
          case 3:
            this.brannyMes = mes.cantidad;
            break;
        }

      });


    });
  }

}

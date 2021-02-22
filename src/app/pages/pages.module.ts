import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProduccionComponent } from './produccion/produccion.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { ClientesComponent } from './clientes/clientes.component';
import { VentasComponent } from './ventas/ventas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteComponent } from './cliente/cliente.component';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { VerClienteComponent } from './ver-cliente/ver-cliente.component';
import { MapaComponent } from '../components/mapa/mapa.component';
import { MapaClientesComponent } from './mapa-clientes/mapa-clientes.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProduccionComponent,
    PagesComponent,
    FacturacionComponent,
    ClientesComponent,
    VentasComponent,
    ClienteComponent,
    NuevoClienteComponent,
    VerClienteComponent,
    MapaComponent,
    MapaClientesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PagesComponent
  ]
})
export class PagesModule { }

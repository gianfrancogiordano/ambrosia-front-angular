import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProduccionComponent } from './produccion/produccion.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { VentasComponent } from './ventas/ventas.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteComponent } from './cliente/cliente.component';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { AmbrosiaAuthGuard } from '../services/service.index';
import { VerClienteComponent } from './ver-cliente/ver-cliente.component';
import { MapaClientesComponent } from './mapa-clientes/mapa-clientes.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  { path: '',
    component: PagesComponent,
    canActivate: [ AngularFireAuthGuard ], data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [

      { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard', authGuardPipe: redirectUnauthorizedToLogin }},
      { path: 'produccion', component: ProduccionComponent, data: { titulo: 'Producción', authGuardPipe: redirectUnauthorizedToLogin }},
      { path: 'facturacion', component: FacturacionComponent, canActivate: [ AmbrosiaAuthGuard ],
        data: { titulo: 'Facturación', authGuardPipe: redirectUnauthorizedToLogin }},
      { path: 'ventas', component: VentasComponent, data: { titulo: 'Ventas', authGuardPipe: redirectUnauthorizedToLogin }},
      { path: 'cliente', component: ClienteComponent,
        children: [

          { path: '', component: ClientesComponent, data: { titulo: 'Clientes' } },
          { path: 'nuevo', component: NuevoClienteComponent, data: { titulo: 'Nuevo Cliente' }},
          { path: 'mapa', component: MapaClientesComponent, data: { titulo: 'Mapa de Clientes, Zonas y Rutas' }},

        ],
        data: { titulo: 'Cliente', authGuardPipe: redirectUnauthorizedToLogin }

      },
      { path: 'cliente/:id', component: VerClienteComponent, data: { titulo: 'Ver Cliente' } },
      { path: '', pathMatch: 'full', redirectTo: '/dashboard' },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

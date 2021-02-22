import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';

import {
  LoginService,
  SharedService,
  SettingsService,
  UsuarioService,
  SidebarService,
  AmbrosiaAuthGuard
} from './service.index';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
    LoginService,
    SharedService,
    SettingsService,
    UsuarioService,
    SidebarService,
    AmbrosiaAuthGuard
  ],
  exports: []
})
export class ServiceModule { }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = environment.urlServicios;

  constructor( private http: HttpClient,
               private loginService: LoginService) {
    this.verificarLogin();
  }

  verificarLogin() {
    if ( localStorage.getItem('token') ) {
      const urlUsuario = this.url + 'login?token=' + localStorage.getItem('token');
      this.http.get( urlUsuario )
        .subscribe( login => {}, error => {
          if ( error.status === 401 ) {
            this.loginService.logout();
          }
        });
    }
  }

}

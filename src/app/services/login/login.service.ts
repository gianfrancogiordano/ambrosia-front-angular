import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import UserCredential = firebase.auth.UserCredential;
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private auth: AngularFireAuth,
               private http: HttpClient,
               private router: Router) { }

  login( email: string, password: string ) {

    return new Promise( (resolve, reject) => {

      this.auth.signInWithEmailAndPassword( email, password )
        .then( ( login: UserCredential ) => {

          login.user.getIdToken()
            .then( idToken => {

              localStorage.setItem('token', idToken);
              const urlServicios = environment.urlServicios;
              const url = urlServicios + 'login?token=' + idToken;
              this.http.get(url)
                .subscribe( (servicioRes: any) => {
                  localStorage.setItem('usuario', JSON.stringify( servicioRes.body[0]) );
                  window.location.href = '/dashboard';
                  // this.router.navigate([ '/dashboard' ]); --> Da error al recargar el modulo
                });

            })
            .catch( errorToken => {
              reject( errorToken );
            });

        }).catch( (errorLogin: any) => {
          reject( errorLogin );
      });

    });

  }

  login2( email: string, password: string ) {
    return this.auth.signInWithEmailAndPassword( email, password );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.auth.signOut()
      .then( () => {
        this.router.navigate(['/login']);
      });
  }

}

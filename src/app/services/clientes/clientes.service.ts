import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  url = environment.urlServicios;
  constructor( private http: HttpClient ) { }

  nuevoCliente( nuevoCliente ) {

    if ( localStorage.getItem('token') ) {
      const urlclientes = this.url + 'cliente' + '?' + '&token=' + localStorage.getItem('token');
      return this.http.post( urlclientes, nuevoCliente );
    }

  }

  getCiudades() {

    if ( localStorage.getItem('token') ) {
      const urlclientes = this.url + 'ciudades' + '?' + '&token=' + localStorage.getItem('token');
      return this.http.get( urlclientes );
    }

  }

  getCliente( idCliente: number ) {

    let urlclientes;

    if ( localStorage.getItem('token' )) {

        urlclientes = this.url + 'cliente' + `/${ idCliente }` + '?' + '&token=' + localStorage.getItem('token');
        return this.http.get( urlclientes )
        .pipe(
          map( (resp: any ) => {
            return resp.body[0];
          })
        );
    }
  }

  getMarcadores() {

    let urlclientes;
    if ( localStorage.getItem('token' )) {

      urlclientes = this.url + 'cliente' + `/marcadores` + '?' + '&token=' + localStorage.getItem('token');
      return this.http.get( urlclientes )
        .pipe(
          map( (resp: any ) => {
            return resp;
          })
        );
    }
  }

  getZonas() {

    let urlclientes;
    if ( localStorage.getItem('token' )) {

      urlclientes = this.url + 'cliente' + `/zonas/` + '?' + '&token=' + localStorage.getItem('token');
      return this.http.get( urlclientes )
        .pipe(
          map( (resp: any ) => {
            return resp;
          })
        );
    }
  }

  getRutas( idzona: string ) {

    let urlclientes;
    if ( localStorage.getItem('token' )) {

      urlclientes = this.url + 'cliente' + `/rutas/${ idzona }` + '?' + '&token=' + localStorage.getItem('token');
      return this.http.get( urlclientes )
        .pipe(
          map( (resp: any ) => {
            return resp;
          })
        );
    }
  }

  changeRuta( idruta: string, idcliente: string ) {

    let urlclientes;
    if ( localStorage.getItem('token' )) {

      urlclientes = this.url + 'cliente' + `/cambiarruta/${ idruta }/${ idcliente }` + '?' + '&token=' + localStorage.getItem('token');
      return this.http.get( urlclientes )
        .pipe(
          map( (resp: any ) => {
            return resp;
          })
        );
    }
  }

  infoRuta( idruta: string ) {

    let urlclientes;
    if ( localStorage.getItem('token' )) {

      urlclientes = this.url + 'cliente' + `/inforuta/${ idruta }` + '?' + '&token=' + localStorage.getItem('token');
      return this.http.get( urlclientes )
        .pipe(
          map( (resp: any ) => {
            return resp;
          })
        );
    }
  }

  getClientes( pagina: number, porPagina: number, filtro?: string ) {

    let urlclientes;

    if ( localStorage.getItem('token' )) {
      if ( filtro ) {
        urlclientes = this.url + 'cliente' + '?' + 'pagina=' + pagina + '&porPagina=' + porPagina +
                                                '&filtro=' + filtro + '&token=' + localStorage.getItem('token');
      } else {
        urlclientes = this.url + 'cliente' + '?' + 'pagina=' + pagina + '&porPagina=' + porPagina +
                                                            '&token=' + localStorage.getItem('token');
      }

      return this.http.get( urlclientes )
        .pipe(
          map( (resp: any ) => {
            return resp.body;
          })
        );
    }
  }

}

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = environment.urlServicios;
  constructor( private http: HttpClient ) { }

  getData() {

    let urlDash;
    if ( localStorage.getItem('token' )) {

      urlDash = this.url + 'dashboard' + '?' + '&token=' + localStorage.getItem('token');
      return this.http.get( urlDash )
        .pipe(
          map( (resp: any ) => {
            return resp.body;
          })
        );
    }
  }

}

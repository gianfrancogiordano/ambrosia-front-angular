import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  url = environment.urlServicios;

  constructor( private http: HttpClient ) {
  }

  getMenu() {

    if ( localStorage.getItem('token') ) {
      const urlMenu = this.url + 'menu' + '?' + '&token=' + localStorage.getItem('token');
      return this.http.get( urlMenu );
    }

  }

}

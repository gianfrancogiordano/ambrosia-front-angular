import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login/login.service';
import UserCredential = firebase.auth.UserCredential;
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  constructor( private loginService: LoginService ) { }

  ngOnInit(): void {
    this.loginService.logout();
  }

  login() {

    const colombeiaMail = this.email + '@alimentoscolombeia.com';
    this.loginService.login( colombeiaMail, this.password );
  }

}

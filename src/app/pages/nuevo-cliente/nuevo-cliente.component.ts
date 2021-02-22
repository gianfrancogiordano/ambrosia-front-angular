import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes/clientes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit {

  ciudades: any;
  forma: FormGroup;
  currLat: number;
  currLng: number;
  accuracy: number;

  constructor( private clientesService: ClientesService,
               private loginService: LoginService,
               private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getCiudades();
    this.getCurrentLocation();
    this.crearFormularioNuevoCliente();
  }

  getCiudades() {
    this.clientesService.getCiudades().subscribe( (ciudades: any) => {
      this.ciudades = ciudades.body;
    }, error => {
      if ( error.status === 401 ) {
        this.loginService.logout();
      }
    });
  }

  crearFormularioNuevoCliente() {

    this.forma = this.fb.group({
      negocio   : ['', [Validators.required, Validators.minLength(4)] ],
      nombres   : ['', [Validators.required, Validators.minLength(4)] ],
      documento : ['', [Validators.required, Validators.minLength(3)] ],
      email     : ['', [Validators.required, Validators.pattern( '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$' ) ] ],
      telefono  : ['', [Validators.required, Validators.minLength(3)] ],
      direccion : ['', [Validators.required, Validators.minLength(5)] ],
      ciudad    : ['', Validators.required ],
    });
  }

  nuevoCliente() {

    if ( this.forma.invalid ) {

      return Object.values( this.forma.controls )
        .forEach( control => {
        control.markAsTouched();
      });
    }

    const nuevoCliente = {
      negocio: this.forma.value.negocio,
      nombres: this.forma.value.nombres,
      documento: this.forma.value.documento,
      email: this.forma.value.email,
      telefono: this.forma.value.telefono,
      direccion: this.forma.value.direccion,
      credito: 0,
      avatar: 'assets/img/avatar/administrador.png',
      latitude: this.currLat,
      longitude: this.currLng,
      accuracy: this.accuracy,
      ciudad: this.forma.value.ciudad,
    };

    this.clientesService.nuevoCliente( nuevoCliente ).subscribe( () => {
          swal.fire('Buenas noticias!', 'El cliente ha sido creado exitosamente!', 'success');
      }, (error) => {
          if ( error.status === 401 ) {
            this.loginService.logout();
          } else if ( error.error.body === 1062 ) {
            console.log( error );
            swal.fire('Uppss ... Ocurrio Un Error!', 'El documento ingresado ya esta registrado!', 'error');
          } else {
            console.log( error );
            swal.fire('Uppss ... Ocurrio Un Error!', 'Comunicate con el departamento de sistemas!', 'error');
          }
        });
  }

  getCurrentLocation() {
    if ( navigator.geolocation ) {
      navigator.geolocation.getCurrentPosition(position => {
          this.accuracy = position.coords.accuracy;
          this.currLat = position.coords.latitude;
          this.currLng = position.coords.longitude;
      });
    }
  }

  get negocioNoValido() {
    return this.forma.get('negocio').invalid && this.forma.get('negocio').touched;
  }

  get nombresNoValido() {
    return this.forma.get('nombres').invalid && this.forma.get('nombres').touched;
  }

  get documentoNoValido() {
    return this.forma.get('documento').invalid && this.forma.get('documento').touched;
  }

  get emailNoValido() {
    return this.forma.get('email').invalid && this.forma.get('email').touched;
  }

  get telefonoNoValido() {
    return this.forma.get('telefono').invalid && this.forma.get('telefono').touched;
  }

  get direccionNoValido() {
    return this.forma.get('direccion').invalid && this.forma.get('direccion').touched;
  }

  get ciudadNoValido() {
    return this.forma.get('ciudad').invalid && this.forma.get('ciudad').touched;
  }

}

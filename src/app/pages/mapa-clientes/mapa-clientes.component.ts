import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from '../../services/clientes/clientes.service';
import { LoginService } from '../../services/login/login.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import MapTypeStyle = google.maps.MapTypeStyle;
import swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {mark} from '@angular/compiler-cli/src/ngtsc/perf/src/clock';

@Component({
  selector: 'app-mapa-clientes',
  templateUrl: './mapa-clientes.component.html',
  styleUrls: ['./mapa-clientes.component.css']
})
export class MapaClientesComponent implements OnInit {

  @ViewChild('mapa', { static: true }) mapaElement: ElementRef;
  @Input() handling: google.maps.GestureHandlingOptions = 'greedy';
  vendedores: Observable<any[]>;
  map: google.maps.Map;
  marcadores: google.maps.Marker[] = [];
  ventasMarcadores: google.maps.Marker[] = [];
  infoWindows: google.maps.InfoWindow[] = [];
  centro = {
    lat: 7.8888312,
    lng: -72.5031527
  };
  vendedorMark = [
    {
    nombre: 'Vendedor 2',
    lat: 7.860,
    long: -72.47
  },
  {
    nombre: 'Pablo Ortega',
    lat: 7.860,
    long: -72.469
  }];
  stylesOpt: MapTypeStyle[] = [
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'transit',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }
  ];
  clienteClicked = {id: '', nombre: '', zona: '', ruta: '', dia: ''};
  zonas: any;
  rutas: any;
  forma: FormGroup;
  markerSelected: google.maps.Marker;
  infoRuta = {cantidadClientes: 0, presupuestoRuta: 0};

  constructor(private clientesService: ClientesService,
              private loginService: LoginService,
              private afs: AngularFirestore,
              private fb: FormBuilder) {
    this.vendedores = afs.collection('gpsventas').valueChanges();
  }

  ngOnInit(): void {
    this.cargarMapa();
    this.getDataClientes();
    this.inicioVendedores();
    this.actualizarVendedores();
    this.getDataZona();
    this.crearFormularioCambiarRuta();
  }

  crearFormularioCambiarRuta() {
    this.forma = this.fb.group({
      ruta : ['', Validators.required ],
    });
  }

  inicioVendedores() {
    this.vendedorMark.forEach( vendedor => this.agregarVendedores( vendedor ));
  }

  actualizarVendedores() {
    this.vendedores.subscribe( vendedores => {

      for ( let i = 0; i < vendedores.length; i++ ) {
        const latLng = new google.maps.LatLng( vendedores[i].lat, vendedores[i].long );
        this.ventasMarcadores[i].setPosition( latLng );
        this.map.setCenter( latLng );
      }

    });
  }

  getDataClientes() {

    this.clientesService.getMarcadores()
      .subscribe( (data: any) => {

        data.body.forEach( cliente => {

          const pinCliente = {
            nombre: cliente.negocio,
            direccion: cliente.direccion,
            encargado: cliente.nombres,
            telefono: cliente.telefono,
            lat: cliente.lat,
            lng: cliente.log,
            ruta: cliente.idruta,
            zona: cliente.zona,
            dia: cliente.dia,
            id: cliente.idclientes
          };
          this.agregarMarcador( pinCliente );

        });

      }, error => {
        if ( error.status === 401 ) {
          this.loginService.logout();
        }
      });
  }

  getDataZona() {

    this.clientesService.getZonas()
      .subscribe( (data: any) => {
        this.zonas = data.body;
      }, error => {
        if ( error.status === 401 ) {
          this.loginService.logout();
        }
      });
  }

  getDataRuta( event: any ) {

    if ( event.target.value === '0' ) {
      this.rutas = null;
    } else {

      this.clientesService.getRutas( event.target.value )
        .subscribe( (data: any) => {
          this.rutas = data.body;
        }, error => {
          if ( error.status === 401 ) {
            this.loginService.logout();
          }
        });
    }
  }

  getInfoRuta( idruta: string ) {

      this.clientesService.infoRuta( idruta )
        .subscribe( (data: any) => {

          this.infoRuta.cantidadClientes = data.body.cantidadClientes;
          this.infoRuta.presupuestoRuta = data.body.presupuestoRuta;

        }, error => {
          if ( error.status === 401 ) {
            this.loginService.logout();
          }
        });

  }

  cambiarRuta() {

    // Deberiamos de cambiarlo para que el crearFormulario lo valide .... TODO
    if ( this.forma.value.ruta === '0' ) {

      return Object.values( this.forma.controls )
        .forEach( control => {
          control.markAsTouched();
        });
    } else if ( this.forma.invalid ) {

      return Object.values( this.forma.controls )
        .forEach( control => {
          control.markAsTouched();
        });
    } else {

      this.clientesService.changeRuta( this.forma.value.ruta, this.clienteClicked.id )
        .subscribe( (data: any) => {

          if ( data.body.affectedRows  === 1) {
            swal.fire('Buenas noticias!', 'El cliente ha cambiado de ruta exitosamente!', 'success');

            // actualizamos el mapa
            this.limpiarMarcadores();
            this.getDataClientes();

          } else {
            swal.fire('Uppss ... Ocurrio Un Error!', 'No hay nada que actualizar ... ', 'error');
          }

        }, error => {
          if ( error.status === 401 ) {
            this.loginService.logout();
          }
        });

    }

  }

  cargarMapa() {

    const latLng = new google.maps.LatLng(this.centro.lat, this.centro.lng);
    const mapaOpciones: google.maps.MapOptions = {
      center: latLng,
      zoom: 16,
      styles: this.stylesOpt,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      fullscreenControl: true,
      gestureHandling: this.handling,
      zoomControl: true
    };

    this.map = new google.maps.Map( this.mapaElement.nativeElement, mapaOpciones );
  }

  agregarMarcador( marcador: any ) {

    let iconBase = '';
    switch ( marcador.ruta ) {
      case 0:
        iconBase = '../../../assets/img/gmap/pin-cliente-gmap.png';
        break;
      case 1:
        iconBase = '../../../assets/img/gmap/pin-cliente-gmap-1.png';
        break;
      case 2:
        iconBase = '../../../assets/img/gmap/pin-cliente-gmap-2.png';
        break;
      case 3:
        iconBase = '../../../assets/img/gmap/pin-cliente-gmap-3.png';
        break;
      case 4:
        iconBase = '../../../assets/img/gmap/pin-cliente-gmap-4.png';
        break;
      case 5:
        iconBase = '../../../assets/img/gmap/pin-cliente-gmap-5.png';
        break;
      case 6:
        iconBase = '../../../assets/img/gmap/pin-cliente-gmap-6.png';
        break;
      case 7:
        iconBase = '../../../assets/img/gmap/pin-cliente-gmap-7.png';
        break;
      case 8:
        iconBase = '../../../assets/img/gmap/pin-cliente-gmap.png';
        break;
    }

    const latLng = new google.maps.LatLng( marcador.lat, marcador.lng );

    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      draggable: true,
      icon: iconBase
    });

    marker.set('idcliente', marcador.id);
    marker.set('nombre', marcador.nombre);
    marker.set('ruta', marcador.ruta);
    marker.set('zona', marcador.zona);
    marker.set('dia', marcador.dia);

    this.marcadores.push( marker );
    // this.map.setCenter( latLng );

    const contenido = `<b>${ marcador.nombre }</b><br><br>${ marcador.direccion }<br>${ marcador.telefono }<br>${ marcador.encargado }<br><br>Zona: ${ marcador.zona }<br>Ruta: ${ marcador.ruta }<br>Día: ${ marcador.dia }<br>#Cliente: ${ marcador.id }`;
    const infoWindow = new google.maps.InfoWindow({
      content: contenido
    });

    this.infoWindows.push( infoWindow );

    google.maps.event.addDomListener( marker, 'click', (coors) => {

      this.markerSelected = marker;
      this.clienteClicked = {
        id: marker.get('idcliente'),
        nombre: marker.get('nombre'),
        zona: marker.get('zona'),
        ruta: marker.get('ruta'),
        dia: marker.get('dia')
      };

      this.getInfoRuta( marker.get('ruta') );

      this.infoWindows.forEach(infoW => infoW.close());
      infoWindow.open(this.map, marker);
    });

    google.maps.event.addDomListener( marker, 'dblclick', (coors) => {

      this.markerSelected = marker;
      this.cambiarRuta();
    });

    google.maps.event.addDomListener( marker, 'drag', (coors: any) => {

      const nuevoMarcador = {
        lat: coors.latLng.lat(),
        lng: coors.latLng.lng(),
        nombre: marcador.nombre
      };

      console.log(nuevoMarcador);
      // Disparar un evento de socket para mover el marcador;
    });

  }

  agregarVendedores( vendedor: any ) {

    const iconBase = '../../../assets/img/gmap/vendedor.png';
    const latLng = new google.maps.LatLng( vendedor.lat, vendedor.long );

    const marker = new google.maps.Marker({
      map: this.map,
      position: latLng,
      draggable: false,
      icon: iconBase
    });

    this.ventasMarcadores.push( marker );

    const contenido = `<b>${ vendedor.nombre }</b>`;
    const infoWindow = new google.maps.InfoWindow({
      content: contenido
    });

    this.infoWindows.push( infoWindow );

    google.maps.event.addDomListener(marker, 'click', (coors) => {

        this.infoWindows.forEach(infoW => infoW.close());
        infoWindow.open(this.map, marker);
    });

  }

  actualizaMapa() {
    this.limpiarMarcadores();
    this.getDataClientes();
  }

  limpiarMarcadores() {

    this.marcadores.forEach( marker => {
      marker.setMap(null);
    });
    this.marcadores = [];
  }

  get rutaNoValido() {
    return (this.forma.get('ruta').invalid && this.forma.get('ruta').touched) || (this.forma.get('ruta').value === '0');
  }

}

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from '../../services/clientes/clientes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  @ViewChild('mapa', { static: true }) mapaElement: ElementRef;
  @Input() idCliente: number;
  @Input() handling: google.maps.GestureHandlingOptions = 'greedy';

  map: google.maps.Map;
  marcadores: google.maps.Marker[] = [];
  infoWindows: google.maps.InfoWindow[] = [];

  centro = {
    lat: 7.8888312,
    lng: -72.5031527
  };

  stylesOpt: any = [
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

  constructor( private clientesService: ClientesService,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
    this.cargarMapa();
    this.cargarPines();
  }

  cargarPines() {
    this.activatedRoute.params.subscribe( params => {
      this.clientesService.getCliente( params.id )
        .subscribe( cliente => {

          const pinCliente = {
            nombre: cliente.nombres,
            lat: cliente.lat,
            lng: cliente.log
          };
          this.agregarMarcador( pinCliente );
        });
    });
  }

  cargarMapa() {

    const latLng = new google.maps.LatLng(this.centro.lat, this.centro.lng);
    const mapaOpciones: google.maps.MapOptions = {
      center: latLng,
      zoom: 16,
      styles: this.stylesOpt,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      fullscreenControl: false,
      gestureHandling: this.handling,
      zoomControl: false
    };

    this.map = new google.maps.Map( this.mapaElement.nativeElement, mapaOpciones );
  }

  agregarMarcador( marcador: any ) {

    const iconBase = '../../../assets/img/gmap/pin-cliente-gmap.png';
    const latLng = new google.maps.LatLng( marcador.lat, marcador.lng );

    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      draggable: false,
      icon: iconBase
    });

    this.marcadores.push( marker );
    this.map.setCenter( latLng );

    const contenido = `<b>${ marcador.nombre }</b>`;

    const infoWindow = new google.maps.InfoWindow({
      content: contenido
    });

    this.infoWindows.push( infoWindow );

    google.maps.event.addDomListener(marker, 'click', (coors) => {
      this.infoWindows.forEach(infoW => infoW.close());
      infoWindow.open(this.map, marker);
    });

  }

}

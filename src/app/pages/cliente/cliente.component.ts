import { Component, OnInit } from '@angular/core';
import {ActivationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  titulo: string;
  constructor( private router: Router) {

    this.getDataPipe()
      .subscribe( (data) => {

        // Titulo del card
        this.titulo = data.titulo;

      });
  }

  ngOnInit(): void {
  }

  getDataPipe() {

    return this.router.events.pipe(
      filter( evento => evento instanceof ActivationEnd ),
      filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
      map( (evento: ActivationEnd) => evento.snapshot.data )
    );

  }

}

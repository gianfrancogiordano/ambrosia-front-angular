import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  titulo = '';

  constructor( private router: Router, private title: Title) {

    this.getDataPipe()
      .subscribe( (data) => {

        // Titulo de los breadcrums
        this.titulo = data.titulo;

        // Titulo de cabecera
        this.title.setTitle( 'Ambrosia | ' + data.titulo );

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

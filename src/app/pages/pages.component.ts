import { Component, OnInit } from '@angular/core';

declare function theme();
declare function themeInit();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    theme();
    themeInit();
  }

}

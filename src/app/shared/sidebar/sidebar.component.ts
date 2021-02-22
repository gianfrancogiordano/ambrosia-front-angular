import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menu: any = [];

  constructor( private sbMenu: SidebarService ) {
  }

  ngOnInit(): void {
    this.getMenu();
  }

  getMenu() {
        this.sbMenu.getMenu()
              .subscribe( (menuResponse: any) => {
                this.menu = menuResponse.body;
              });
  }

}

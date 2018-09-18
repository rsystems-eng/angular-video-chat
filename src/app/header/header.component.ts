/**
* Summary: HeaderComponent Component
* Description: application header rendering logic
* @author Amit Tomar
* @date  05.09.2018
*/
import { Component, OnInit } from '@angular/core';
import { VydioClientService } from '../vydio-client.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private VydioClientService: VydioClientService) {
    console.log("[vc] vs is here in HeaderComponent");
  }

  /**
   * function call on initialization of the object
  */
  ngOnInit() {

  }

  /**
   * call to log out function of vidyoconnect library
  */
  logout() {
    console.log("[vc] logout  logout  logout  logout  logout  logout ");
    this.VydioClientService.logout();

  }

}

/**
* Summary: User List Header Component
* Description: User List Header related logic
* @author Amit Tomar
* @date  05.09.2018
*/
import { Component, OnInit } from '@angular/core';
import { VydioClientService } from '../vydio-client.service';
@Component({
  selector: 'app-user-list-header',
  templateUrl: './user-list-header.component.html',
  styleUrls: ['./user-list-header.component.css']
})
export class UserListHeaderComponent implements OnInit {

  constructor(private VydioClientService: VydioClientService) { }

  /**
  * initialize the component
  */
  ngOnInit() {
  }

}

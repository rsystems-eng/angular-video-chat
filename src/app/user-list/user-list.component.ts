/**
* Summary: User List Component
* Description: User list related logic
* @author Amit Tomar
* @date  05.09.2018
*/
import { Component, OnInit } from '@angular/core';
import { VydioClientService } from '../vydio-client.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private VydioClientService: VydioClientService) {
    console.log("[vc] vs is here in UserListComponent");
  }

  /**
  * initialize the component
  */
  ngOnInit() {
    // console.log("[vc] usersList = "+JSON.stringify(this.VydioClientService.users))
  }
}
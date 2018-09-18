/**
* Summary: LoginComponent Component
* Description: application login related logic
* @author Amit Tomar
* @date  05.09.2018
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VydioClientService } from '../vydio-client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * set username and password to empty
  */
  login = {
    userName: "",
    meetingRoom: ""
  };

  constructor(private VydioClientService: VydioClientService, public router: Router) {
  }

  ngOnInit() {
  }

  /**
   * function to execute after submit button click on successful login
  */
  onClickMe() {
    console.log("button is clicked" + this.login.userName + " meeting id is  " + this.login.meetingRoom);
    this.VydioClientService.setData(this.login.userName, this.login.meetingRoom);
    let redirect = '/chat';
    this.router.navigate([redirect]);
  }
}

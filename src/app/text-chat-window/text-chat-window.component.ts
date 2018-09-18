/**
* Summary: TextChatWindowComponent Component
* Description: application text chat related logic
* @author Amit Tomar
* @date  05.09.2018
*/
import { Component, OnInit } from '@angular/core';
import { VydioClientService } from '../vydio-client.service';

@Component({
  selector: 'app-text-chat-window',
  templateUrl: './text-chat-window.component.html',
  styleUrls: ['./text-chat-window.component.css']
})
export class TextChatWindowComponent implements OnInit {

  /**
   * set message array to empty
  */
  messageList = [];
  constructor(private VydioClientService: VydioClientService) {

    VydioClientService.messageRecievedConfirmed$.subscribe(
      data => {
        this.messageList.push(data);
      });

    VydioClientService.messageSendConfirmed$.subscribe(
      data => {
        this.messageList.push(data);
      });


  }

  /**
   * init method of the component
  */
  ngOnInit() {
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  /**
   * scroll chat to bottom on message reciept
  */
  scrollToBottom(): void {
    try {
      var chatLogsContainer = document.getElementById("chatLogs");
      chatLogsContainer.scrollTop = chatLogsContainer.scrollHeight;
     } catch (err) { }
  }

  /**
   * send chat message 
  */
  sendChatMsg() {
    this.VydioClientService.sendChatMsg("SendMessage");
  }
}

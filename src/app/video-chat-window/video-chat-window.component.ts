/**
* Summary: Video Chat Window Component
* Description: Video Chat Window related logic
* @author Amit Tomar
* @date  05.09.2018
*/
import { Component, OnInit } from '@angular/core';
import { VydioClientService } from '../vydio-client.service';

@Component({
  selector: 'app-video-chat-window',
  templateUrl: './video-chat-window.component.html',
  styleUrls: ['./video-chat-window.component.css']
})
export class VideoChatWindowComponent implements OnInit {
  /**
   * set the default value for properites
  */  
  showPreview: Boolean = false;
  isConnected: Boolean = false;
  preview: Boolean = true;
  muted: Boolean = true;
  constructor(private VydioClientService: VydioClientService) {
    VydioClientService.meetingJoinedConfirmed$.subscribe(
      data => {
        console.log(">>>>>>>>>>>>>>>>>>>>> i got the sucess event");
        this.showPreview = true;
      });
  }

  /**
  * initialize the component
  */
  ngOnInit() {
  }

  /**
  * Toggle the preview functionality
  */  
  togglePreview() {
    this.preview = this.VydioClientService.toggleCameraPrivacy();
    console.log(">>>>> preivew " + this.preview)
  }

  /**
  * Toggle the Mic functionality
  */
  toggleMic() {
    this.muted = this.VydioClientService.toggleMicPrivacy();
    console.log(">>>>> muted " + this.muted)
  }

  /**
  * Toggle the connecton on button click
  */
  toggleConnect() {
    if (this.isConnected) {
      this.VydioClientService.endVideoCall();
      this.isConnected = false;
    } else {
      this.VydioClientService.startVideoCall();
      this.isConnected = true;
      this.muted = false;
      this.preview = false;
    }
  }
}

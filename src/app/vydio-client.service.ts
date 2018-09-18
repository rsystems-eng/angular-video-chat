import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from "rxjs";
import { ScriptService } from './script.service';
import { Router } from '@angular/router';

// library to generate auth token
declare var jsSHA: any;
@Injectable({
    providedIn: 'root'
})



export class VydioClientService {
    vidyoConnector;
    tokendata;
    userName;
    meetingRoom;
    users;
    bgColor;
    isCameraAvailable;
    isMicAvailable;
    cameraPrivacy: Boolean = true;
    micPrivacy: Boolean = true;

    private key = "e4405bc75d744a03badbd7521d346743"; // application key
    private appID = "801b52.vidyo.io"; // application id
    private expiresInSeconds = 86400;


    private joinMeetingSubject = new Subject<string>();
    // Observable 
    meetingJoinedConfirmed$ = this.joinMeetingSubject.asObservable();


    private messageRecievedSubject = new Subject<any>();
    // Observable 
    messageRecievedConfirmed$ = this.messageRecievedSubject.asObservable();

    private messageSendSubject = new Subject<any>();
    // Observable 
    messageSendConfirmed$ = this.messageSendSubject.asObservable();


    constructor(private http: HttpClient, private ScriptService: ScriptService, public router: Router) {
        console.log("service is invoked");
        this.users = [];
        this.bgColor = ["#89d1fe", "#9a89fe", "#fe89e7", "#8dd28a", "#bcd04d", "#d389fe", "#e9b654", "#fe8989"];
        this.cameraPrivacy = true;
        this.micPrivacy = true;
    }

    setData(userName, meetingRoom) {
        this.userName = userName;
        this.meetingRoom = meetingRoom;
    }

    loadVydioSdk() {
        this.ScriptService.load('vydioClient');
    }


    generateToken(key, appID, userName, expiresInSeconds, vCard) {
        const EPOCH_SECONDS = 62167219200;
        const expires = Math.floor(Date.now() / 1000) + expiresInSeconds + EPOCH_SECONDS;
        const shaObj = new jsSHA("SHA-384", "TEXT");
        shaObj.setHMACKey(key, "TEXT");
        const jid = userName + '@' + appID;
        const body = 'provision' + '\x00' + jid + '\x00' + expires + '\x00' + vCard;
        shaObj.update(body);
        const mac = shaObj.getHMAC("HEX");
        const serialized = body + '\0' + mac;
        console.log("\nGenerated Token: \n" + btoa(serialized));
        return btoa(serialized);
      }

    initVydioConnector(VC, viewId, remoteViewId) {
        var cameras = {};
        var microphones = {};
        var speakers = {};

        window.onresize = function () {
            // self.showRenderer(viewId);
        };

        console.log(VC);
        console.log("view id is " + viewId)
        VC.CreateVidyoConnector({
            viewId: viewId, // Div ID where the composited video will be rendered, see VidyoConnector.html;
            viewStyle: "VIDYO_CONNECTORVIEWSTYLE_Default", // Visual style of the composited renderer
            remoteParticipants: 8,     // Maximum number of participants to render
            logFileFilter: "warning info@VidyoClient info@VidyoConnector",
            logFileName: "",
            userData: "",
        }).then((vc) => {
            this.vidyoConnector = vc;
            //  this.showRenderer(viewId);
            this.setCameraPrivacy(this.cameraPrivacy);
            this.setMicrophonePrivacy(this.micPrivacy);
            this.registerDeviceListeners(cameras, microphones, speakers, viewId, remoteViewId);
            this.handleDeviceChange(cameras, microphones, speakers);
            this.handleParticipantChange();
            this.registerMessageListener();

            let token = this.generateToken(this.key,this.appID,this.userName,this.expiresInSeconds, "");
            this.joinRoom(token, this.userName, this.meetingRoom);
           

        }).catch((err) => {
            console.error("CreateVidyoConnector Failed " + err);
            let redirect = '/chat';
            this.router.navigate([redirect]);

        });
    }



    registerMessageListener = () => {
        this.vidyoConnector.RegisterMessageEventListener({
            onChatMessageReceived: (participant, chatMessage) => {
                try {
                    var jsonObject = JSON.parse(chatMessage.body)
                    var mItem = { isUser: false, data: jsonObject };
                    //  this.mesageList.push(mItem);
                    this.messageRecievedSubject.next(mItem);
                }
                catch (e) {
                    console.log("Did not receive a valid Json: " + e);
                }

            }
        }).then(function () {
            console.log("RegisterMessageEventListener Success");
        }).catch(function () {
            console.log("RegisterMessageEventListener Failed");
        });

    }


    /**
* Description: function to broadcast the entered message from the user
* @param {null}
* @return {null}
*/
    sendChatMsg = (messageBox) => {
        var sendMessageInput = (<HTMLInputElement>document.getElementById(messageBox));
        var message = sendMessageInput.value;
        var message = '{ "type": "PublicChat",' +
            '"username": "' + this.userName + '",' +
            '"message": "' + message + '" }';
        this.vidyoConnector.SendChatMessage(message);
        let messageData = {
            username: this.userName,
            message: sendMessageInput.value

        }
        let mItem = { isUser: true, data: messageData };
        sendMessageInput.value = "";
        this.messageSendSubject.next(mItem);
    }

    registerDeviceListeners(cameras, microphones, speakers, viewId, remoteViewId) {
        // Map the "None" option (whose value is 0) in the camera, microphone, and speaker drop-down menus to null since
        // a null argument to SelectLocalCamera, SelectLocalMicrophone, and SelectLocalSpeaker releases the resource.
        cameras[0] = null;
        microphones[0] = null;
        speakers[0] = null;

        // Handle appearance and disappearance of camera devices in the system
        this.vidyoConnector.RegisterLocalCameraEventListener({
            onAdded: function (localCamera) {
                cameras[window.btoa(localCamera.id)] = localCamera;
            },
            onRemoved: function (localCamera) {
                // Existing camera became unavailable
                delete cameras[window.btoa(localCamera.id)];
            },
            onSelected: function (localCamera) {
                // Camera was selected/unselected by you or automatically
                if (localCamera) {
                }
            },
            onStateUpdated: function (localCamera, state) {
                // Camera state was updated
            }
        }).then(() => {
            console.log("RegisterLocalCameraEventListener Success");
        }).catch(() => {
            console.error("RegisterLocalCameraEventListener Failed");
        });

        // Handle appearance and disappearance of microphone devices in the system
        this.vidyoConnector.RegisterLocalMicrophoneEventListener({
            onAdded: (localMicrophone) => {
                // New microphone is available
                // $("#microphones").append("<option value='" + window.btoa(localMicrophone.id) + "'>" + localMicrophone.name + "</option>");
                microphones[window.btoa(localMicrophone.id)] = localMicrophone;
                console.log(">>>>>> microphone added");
            },
            onRemoved: (localMicrophone) => {
                // Existing microphone became unavailable
                //$("#microphones option[value='" + window.btoa(localMicrophone.id) + "']").remove();
                delete microphones[window.btoa(localMicrophone.id)];
                console.log(">>>>> microphone removed");
            },
            onSelected: (localMicrophone) => {
                // Microphone was selected/unselected by you or automatically
                if (localMicrophone) {
                    //$("#microphones option[value='" + window.btoa(localMicrophone.id) + "']").prop('selected', true);
                    console.log(">>>>>>>> microphone selected");
                }
            },
            onStateUpdated: (localMicrophone, state) => {
                // Microphone state was updated
            }
        }).then(() => {
            console.log(">>>>>>>> RegisterLocalMicrophoneEventListener Success");
        }).catch(() => {
            console.error(">>>>>>>  RegisterLocalMicrophoneEventListener Failed");
        });

        // Handle appearance and disappearance of speaker devices in the system
        this.vidyoConnector.RegisterLocalSpeakerEventListener({
            onAdded: (localSpeaker) => {
                // New speaker is available
                // $("#speakers").append("<option value='" + window.btoa(localSpeaker.id) + "'>" + localSpeaker.name + "</option>");
                speakers[window.btoa(localSpeaker.id)] = localSpeaker;
                console.log("speaker added");
            },
            onRemoved: (localSpeaker) => {
                // Existing speaker became unavailable
                //$("#speakers option[value='" + window.btoa(localSpeaker.id) + "']").remove();
                delete speakers[window.btoa(localSpeaker.id)];
                console.log("speaker removed");
            },
            onSelected: (localSpeaker) => {
                // Speaker was selected/unselected by you or automatically
                if (localSpeaker) {
                    // $("#speakers option[value='" + window.btoa(localSpeaker.id) + "']").prop('selected', true);
                    console.log("speaker selected");
                }
            },
            onStateUpdated: (localSpeaker, state) => {
                // Speaker state was updated
            }
        }).then(() => {
            console.log(">>>>>>>>> RegisterLocalSpeakerEventListener Success");
        }).catch(() => {
            console.error(">>>>>>>> RegisterLocalSpeakerEventListener Failed");
        });



    }
    handleDeviceChange(cameras, microphones, speakers) {

    }

    handleParticipantChange() {
        this.vidyoConnector.RegisterParticipantEventListener({
            onJoined: (participant) => {
                console.log("[vc] participant onJoined= " + JSON.stringify(participant))
                this.addUser(participant);
            },
            onLeft: (participant) => {
                console.log("[vc] participant onLeft= " + JSON.stringify(participant))
                this.removeUser(participant)
            },
            onDynamicChanged: (participants) => {
                console.log("[vc] participant onDynamicChanged= " + JSON.stringify(participants))
            },
            onLoudestChanged: (participant, audioOnly) => {
                participant.audioOnly = audioOnly
                console.log("[vc] participant onLoudestChanged= " + JSON.stringify(participant))
                console.log("[vc] participant onLoudestChanged audioOnly= " + JSON.stringify(audioOnly))
            }
        }).then(() => {
            console.log("[vc] RegisterParticipantEventListener Success");
        }).catch(() => {
            console.error("[vc] RegisterParticipantEventListener Failed");
        });
    }


    addUser(obj) {
        obj.bgColor = this.bgColor[this.users.length];
        obj.firstChar = obj.name.substr(0, 1).toUpperCase();
        this.users.push(obj);
        console.log("[vc] user=" + JSON.stringify(obj))
    }

    removeUser(obj) {
        this.users = this.users.filter((item) => {
            return item.name !== obj.name;
        })
    }

    getTokenData(userName) {
        return this.http.get("https://vod-demoserver.india.rsystems.com:7000/getAccessToken?username=" + userName);
    }



    showRenderer(viewId) {
        console.log("render called : ");
        let view = document.getElementById(viewId);
        console.log("render called : ", view);
        console.log("render called :", this.vidyoConnector);
        this.vidyoConnector.ShowViewAt(view.id, view.offsetLeft, view.offsetTop, view.offsetWidth, view.offsetHeight);
    }

    joinRoom(token, userName, meetingRoom) {
        console.log(">>>> token " + token + " username " + userName + " meeting room " + meetingRoom);
        let self = this;
        this.vidyoConnector.Connect({
            // Take input from options form
            host: 'prod.vidyo.io',
            token: token,
            displayName: userName,
            resourceId: meetingRoom,

            // Define handlers for connection events.
            onSuccess: () => {
                // Connected
                console.log("vidyoConnector.Connect : onSuccess callback received");
                let selfId = {name : this.userName +"(You)"};
                this.addUser(selfId);
                this.joinMeetingSubject.next();
                // this.showRenderer();
            },
            onFailure: (reason) => {
                // Failed
                console.error("vidyoConnector.Connect : onFailure callback received");
                console.error(reason);
                let redirect = '/login';
                this.router.navigate([redirect]);
            },
            onDisconnected: (reason) => {
                // Disconnected
                console.log("vidyoConnector.Connect : onDisconnected callback received");
                let redirect = '/login';
                this.router.navigate([redirect]);
            }
        }).then((status) => {
            if (status) {
                console.log("[vc] Connect Success");
                this.users = []
                this.handleParticipantChange();
            } else {
                console.error("[vc] Connect Failed");
            }
        }).catch(() => {
            console.error("Connect Failed");
            let redirect = '/login';
            this.router.navigate([redirect]);
        });
    }


    setCameraPrivacy(privacy) {
        this.vidyoConnector.SetCameraPrivacy({ privacy: privacy });
    }
    setMicrophonePrivacy(privacy) {
        this.vidyoConnector.SetMicrophonePrivacy({ privacy: privacy });
    }

    toggleCameraPrivacy() {
        this.cameraPrivacy = !this.cameraPrivacy;
        this.vidyoConnector.SetCameraPrivacy({ privacy: this.cameraPrivacy });
        return this.cameraPrivacy;
    }

    toggleMicPrivacy() {
        this.micPrivacy = !this.micPrivacy;
        this.vidyoConnector.SetMicrophonePrivacy({ privacy: this.micPrivacy });
        return this.micPrivacy;
    }
    isLocalCameraAvailable() {
        return this.isCameraAvailable;
    }

    isLocalMicAvailable() {
        return this.isMicAvailable;
    }



    startVideoCall() {
        this.cameraPrivacy = false;
        this.micPrivacy = false;
        this.setCameraPrivacy(this.cameraPrivacy);
        this.setMicrophonePrivacy(this.micPrivacy);
    }

    endVideoCall() {
        this.cameraPrivacy = true;
        this.micPrivacy = true;
        this.setCameraPrivacy(this.cameraPrivacy);
        this.setMicrophonePrivacy(this.micPrivacy);
    }


    logout=()=> {
        let self = this;
        this.vidyoConnector.Disconnect().then(function () {
            let redirect = '/login';
            self.router.navigate([redirect]);
        }).catch(function () {
            let redirect = '/login';
            self.router.navigate([redirect]);
        });
    }

}

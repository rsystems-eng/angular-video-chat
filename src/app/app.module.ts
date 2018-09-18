import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { HeaderComponent } from './header/header.component';

import { VideoChatWindowComponent } from './video-chat-window/video-chat-window.component';
import { AppRoutingModule } from './/app-routing.module';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { UserListHeaderComponent } from './user-list-header/user-list-header.component';
import { TextChatWindowComponent } from './text-chat-window/text-chat-window.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VideoChatWindowComponent,
    UserListComponent,
    HeaderComponent,
    ChatWindowComponent,
    UserListHeaderComponent,
    TextChatWindowComponent,
    ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
   ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

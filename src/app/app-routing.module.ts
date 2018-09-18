import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { ChatWindowComponent } from './chat-window/chat-window.component'

const appRoutes: Routes = [

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'chat',
    component: ChatWindowComponent,
  },


  { path: '', redirectTo: '/login', pathMatch: 'full' },
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true, // <-- debugging purposes only
      }
    )
  ],
  exports: [
    RouterModule
  ],

})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordRoutingModule } from './change-password.routing.module';
import { CommonModule } from '@angular/common';
import { ToasterModule } from 'angular2-toaster';
// import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

// Import your library
import { HomeService } from './../services/home.service';
import { NgxCarouselModule } from 'ngx-carousel';
import { DragScrollModule } from 'ngx-drag-scroll';
import 'hammerjs';
import { SharedModule } from '../helper/shared.module'
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";


@NgModule({
  imports: [
    ChangePasswordRoutingModule,
    NgxCarouselModule,
    ToasterModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    DragScrollModule
  ],
  declarations: [
    ChangePasswordComponent
  ],
  providers: [
    HomeService
  ]
})
export class ChangePasswordModule { }

import { NgModule } from '@angular/core';
import { DepositeBankComponent } from './deposite-bank.component';

import { DepositebankRoutingModule } from './deposite-bank.routing.module';
import { CommonModule } from '@angular/common';
import { ToasterModule } from 'angular2-toaster';

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
    DepositebankRoutingModule,
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
    DepositeBankComponent
  ],
  providers: [
    HomeService
  ]
})
export class DepositebankModule { }

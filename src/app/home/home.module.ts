import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';

import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';
import { ToasterModule } from 'angular2-toaster';
import {HalfCircleSpinnerModule} from 'angular-epic-spinners';

// Import your library
import { HomeService } from './../services/home.service';
import { NgxCarouselModule } from 'ngx-carousel';
import { DragScrollModule } from 'ngx-drag-scroll';
import 'hammerjs';
import { SharedModule } from '../helper/shared.module'
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  imports: [
    HomeRoutingModule,
    NgxCarouselModule,
    HalfCircleSpinnerModule,
    ToasterModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    DragScrollModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    HomeService
  ]
})
export class HomeModule { }

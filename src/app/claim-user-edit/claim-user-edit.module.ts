import { NgModule } from '@angular/core';
import { ClaimUserEditComponent } from './claim-user-edit.component';

import { ClaimusereditRoutingModule } from './claim-user-edit.routing.module';
import { CommonModule } from '@angular/common';
import { ToasterModule } from 'angular2-toaster';

// Import your library
import { HomeService } from './../services/home.service';
import { NgxCarouselModule } from 'ngx-carousel';
import { DragScrollModule } from 'ngx-drag-scroll';
import 'hammerjs';
import { SharedModule } from '../helper/shared.module'
import { ModalModule, RatingModule } from 'ngx-bootstrap';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";


@NgModule({
  imports: [
    ClaimusereditRoutingModule,
    NgxCarouselModule,
    ToasterModule.forRoot(),
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    DragScrollModule
  ],
  declarations: [
    ClaimUserEditComponent
  ],
  providers: [
    HomeService
  ]
})
export class ClaimusereditModule { }

import { NgModule } from '@angular/core';
import { PostListComponent } from './post-list.component';

import { PostlistRoutingModule } from './post-list.routing.module';
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
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {HalfCircleSpinnerModule} from 'angular-epic-spinners';

@NgModule({
  imports: [
    PostlistRoutingModule,
    NgxCarouselModule,
    HalfCircleSpinnerModule,
    ToasterModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    DragScrollModule
  ],
  declarations: [
    PostListComponent
  ],
  providers: [
    HomeService
  ]
})
export class PostlistModule { }

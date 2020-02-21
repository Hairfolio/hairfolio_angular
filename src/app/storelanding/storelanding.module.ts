import { NgModule } from '@angular/core';
import { StoreLandingComponent } from './storelanding.component';
import { StoreLandingRoutingModule } from './storelanding-routing.module';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap';
import { PostDetailsService } from './../services/postDetails.service';
import { ProductDetailsService } from './../services/productDetails.service';
import { ModalModule } from 'ngx-bootstrap';
// Import your library
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';
import { StoreService } from '../services/store.service';
import { DragScrollModule } from 'ngx-drag-scroll';
import { ToasterModule } from 'angular2-toaster';
import { SharedModule } from '../helper/shared.module'


@NgModule({
  imports: [
    StoreLandingRoutingModule,
    NgxCarouselModule,
    CommonModule,
    BsDropdownModule.forRoot(),
    ToasterModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    DragScrollModule,
    SharedModule
  ],
  declarations: [
    StoreLandingComponent
  ],
  providers: [
    PostDetailsService,
    ProductDetailsService,
    StoreService
  ]
})
export class StoreLandingModule { }

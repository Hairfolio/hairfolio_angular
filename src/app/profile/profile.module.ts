import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { CommonModule } from '@angular/common';
import { TabsModule, RatingModule } from 'ngx-bootstrap';
import { NgxCarouselModule } from 'ngx-carousel';
import { NguiMapModule } from '@ngui/map';
import { DragScrollModule } from 'ngx-drag-scroll';
import { ModalModule } from 'ngx-bootstrap';
import 'hammerjs';
import { ProfileService } from '../services/profile.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PostDetailsService } from '../services/postDetails.service';
import { ProductDetailsService } from './../services/productDetails.service';
import { ToasterModule } from 'angular2-toaster';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MomentPipe } from '../helper/moment.pipe';
import { AgmCoreModule } from '@agm/core';
import { SharedModule } from '../helper/shared.module'
import { FilterPipe } from '../helper/filter-activity.pipe';

@NgModule({
  imports: [
    ProfileRoutingModule,
    CommonModule,
    NgxCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    ToasterModule.forRoot(),
    TabsModule.forRoot(),
    RatingModule.forRoot(),
    PopoverModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    DragScrollModule,
    SharedModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyAvcDy5ZYc2ujCS6TTtI3RYX5QmuoV8Ffw'
    }),
    NguiMapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyDcAVeF9HQaIckxktsi0BZxW5hOCH6qwvc' })
  ],
  declarations: [
    ProfileComponent,
    MomentPipe,
    FilterPipe
  ],
  providers: [
    ProfileService,
    PostDetailsService,
    ProductDetailsService
  ]
})
export class ProfileModule { }

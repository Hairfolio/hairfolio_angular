import { NgModule } from '@angular/core';
import { StarredComponent } from './starred.component';
import { StarredRoutingModule } from './starred-routing.module';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { PostDetailsService } from '../services/postDetails.service';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// Import your library

import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';


@NgModule({
  imports: [
    StarredRoutingModule,
    NgxCarouselModule,
    CommonModule,
    TabsModule.forRoot(),
    // HttpClientModule
  ],
  declarations: [
    StarredComponent
  ],
  providers: [
    PostDetailsService,
    // HttpClient
  ]
})
export class StarredModule { }

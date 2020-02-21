import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BlogComponent } from './blog.component';
import { BlogRoutingModule } from './blog-routing.module';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap';
import { SharedModule } from '../helper/shared.module';

@NgModule({
  imports: [
    BlogRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    SharedModule

  ],
  declarations: [
    BlogComponent
  ]
})
export class BlogModule { }

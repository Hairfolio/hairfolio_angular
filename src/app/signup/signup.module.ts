import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SignUPComponent } from './signup.component';
import { SignUPRoutingModule } from './signup-routing.module';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';


@NgModule({
  imports: [
    SignUPRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [
    SignUPComponent
  ]
})

export class SignUPModule { }

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartComponent } from './cart.component';
import { CartRoutingModule } from './cart-routing.module';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';
import { SharedModule } from '../helper/shared.module'
import { ToasterModule } from 'angular2-toaster';
import { StoreService } from '../services/store.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';


@NgModule({
  imports: [
    CartRoutingModule,
    ModalModule.forRoot(),
    // BrowserAnimationsModule, 
    FormsModule,
    ReactiveFormsModule,
    ToasterModule.forRoot(),
    CommonModule,
    TabsModule.forRoot(),
    SharedModule,
  ],
  declarations: [
    CartComponent
  ],
  providers: [
    StoreService
  ]
})
export class CartModule { }

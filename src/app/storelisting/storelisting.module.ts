import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common"
// import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreListComponent } from './storelisting.component';
import { StoreListRouting } from './storelisting.routing.module';
import { ModalModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap';
import { AccordionModule } from 'ngx-bootstrap';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { StoreService } from '../services/store.service';
import { SharedModule } from '../helper/shared.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Ng5SliderModule } from 'ng5-slider';
import { ToasterModule } from 'angular2-toaster';
import { NgxSpinnerModule } from 'ngx-spinner';
import {AtomSpinnerModule} from 'angular-epic-spinners'
import {HollowDotsSpinnerModule} from 'angular-epic-spinners';
import {HalfCircleSpinnerModule} from 'angular-epic-spinners';

// HALF CIRCLE SPINNER

@NgModule({
    imports: [
        CommonModule,
        StoreListRouting,
        FormsModule,
        ReactiveFormsModule,
        AtomSpinnerModule,
        HollowDotsSpinnerModule,
        HalfCircleSpinnerModule,
        ToasterModule.forRoot(),
        // HttpClientModule,
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        PaginationModule.forRoot(),
        CollapseModule.forRoot(),
        AccordionModule.forRoot(),
        IonRangeSliderModule,
        SharedModule,
        Ng5SliderModule,
        NgxSpinnerModule
    ],
    exports: [],
    declarations: [
        StoreListComponent
    ],
    providers: [
        // HttpClient,
        StoreService
    ]
})

export class StoreListModule { }
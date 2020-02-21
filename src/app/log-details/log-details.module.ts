import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
import { PostDetailsService } from '../services/postDetails.service';
import { NgxGalleryModule } from 'ngx-gallery';
import { ModalModule, AccordionModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterModule } from 'angular2-toaster';
import { NgxCarouselModule } from 'ngx-carousel';
import { RatingModule } from 'ngx-bootstrap/rating';
import 'hammerjs';
import { SharedModule } from '../helper/shared.module'
import { LogDetailsComponent } from "./log-details.component";
import { LogDetailsRouting } from "./log-details.routing.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LogDetailsRouting,
        NgxGalleryModule,
        ModalModule.forRoot(),
        ToasterModule.forRoot(),
        NgxCarouselModule,
        AccordionModule.forRoot(),
        RatingModule.forRoot(),
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [],
    declarations: [
        LogDetailsComponent
    ],
    providers: [
        PostDetailsService
    ]
})

export class LogDetailsModule { }
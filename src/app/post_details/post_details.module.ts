import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
import { PostDetailsComponent } from './post_details.component';
import { PostDetailsRouting } from './post_details.routing.module';
import { PostDetailsService } from '../services/postDetails.service';
import { NgxGalleryModule } from 'ngx-gallery';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterModule } from 'angular2-toaster';

// Import your library
import { NgxCarouselModule } from 'ngx-carousel';
import { RatingModule } from 'ngx-bootstrap/rating';
import 'hammerjs';
import { SharedModule } from '../helper/shared.module'


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PostDetailsRouting,
        NgxGalleryModule,
        ModalModule.forRoot(),
        ToasterModule.forRoot(),
        NgxCarouselModule,
        RatingModule.forRoot(),
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [],
    declarations: [
        PostDetailsComponent
    ],
    providers: [
        PostDetailsService
    ]
})

export class PostDetailsModule { }
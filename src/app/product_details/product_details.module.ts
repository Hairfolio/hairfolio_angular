import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
import { ProductDetailsRoutingModule } from "./product_details.routing.module";
import { ProductDetailsComponent } from "./product_details.component";
import { ProductDetailsService } from "../services/productDetails.service";
import { NgxGalleryModule } from 'ngx-gallery';
import { ModalModule } from 'ngx-bootstrap';
import { ToasterModule } from 'angular2-toaster';
// Import your library
import { NgxCarouselModule } from 'ngx-carousel';
import { SharedModule } from '../helper/shared.module';
import 'hammerjs';

@NgModule({
    imports: [
        CommonModule,
        ProductDetailsRoutingModule,
        NgxGalleryModule,
        ToasterModule.forRoot(),
        ModalModule.forRoot(),
        NgxCarouselModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        ProductDetailsComponent
    ],
    providers: [
        ProductDetailsService
    ],
})

export class ProductDetailsModule { }
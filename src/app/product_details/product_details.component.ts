import { Component, OnInit,HostListener, Input, TemplateRef ,Inject, ElementRef} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ProductDetailsService } from "../services/productDetails.service";
import { SharedService } from './../services/shared.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxCarousel } from 'ngx-carousel';
import { environment } from './../../environments/environment';
import { StoreService } from '../services/store.service';
import { SeosearchService } from '../services/seosearch.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { LoginService } from '../services/login.service';
import { DOCUMENT } from '@angular/common';

@Component({
    templateUrl: './product_details.component.html'
})
export class ProductDetailsComponent implements OnInit {
    public defaultimg = environment.defaultImgUrl;
    private toasterService: ToasterService;
    public config: ToasterConfig =
        new ToasterConfig({
            tapToDismiss: false,
            timeout: 3000
        });
    count: number = 1;
   
    increment() {
        this.count++;
    }
    decrement() {
        this.count--;
    }
    public product_data;
    product_cart: Boolean = false;

    //model popup
    modalRef: BsModalRef;
    openModal(template: TemplateRef<any>, product) {
        this.product_cart = true;
        this.count = 1;
        this.product_data = product;
        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'modal-lg modal-big' })
        );
    }

    // images gallyer compenent 
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    public carouselTileItems: Array<any>;
    public carouselTile: NgxCarousel;
    public carouselOne: NgxCarousel;
    public carouselThree: NgxCarousel;
    public photos = [];
    public is_logged_in: Boolean = false;
    public related_flag: Boolean = false;
    public showss: Boolean = false;

    constructor(
        public elementRef:ElementRef,
        public prodService: ProductDetailsService,
        private route: ActivatedRoute,
        private router: Router,
        private shared: SharedService,
        toasterService: ToasterService,
        private modalService: BsModalService,
        private storeService: StoreService,
        public login: LoginService,
        private seo: SeosearchService,
        @Inject(DOCUMENT) private document: Document

    ) {
        this.toasterService = toasterService;
        this.shared.listen().subscribe((m: any) => {
            this.searchclick(m);
        })
        this.is_logged_in = login.loggedIn();
        this.collapsed = true;
        // production slider 
        this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        this.carouselOne = {
            grid: { xs: 2, sm: 3, md: 4, lg: 5, all: 0 },
            slide: 1,
            speed: 500,
            interval: 4000,
            point: {
                visible: false,
            },
            load: 1,
            loop: true,
            touch: true
        }
        this.carouselThree = {
            grid: { xs: 3, sm: 3, md: 4, lg: 5, all: 0 },
            slide: 2,
            speed: 400,
            animation: 'lazy',
            point: {
                visible: false,
            },
            load: 2,
            touch: true,
            loop: false,
            // easing: 'ease'
        }
    }
    @HostListener('mouseenter') onMouseEnter() {
        this.elementRef.nativeElement.classList.remove('hovrer_View:hover');
      }
    public product_id: any;
    public product_detail: any;
    public defaultImg = environment.apiUrl;

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });

        this.route.params.subscribe((param) => {
            this.product_id = param.product_id;
            this.viewProductDetails(this.product_id);
            this.showss = false;
        })
        // images gallery compenent
        this.galleryOptions = [
            {
                width: '100%',
                height: '950px',
                imagePercent: 100,
                thumbnailsColumns: 5,
                thumbnailsPercent: 24,
                imageAnimation: NgxGalleryAnimation.Slide,
                imageArrows: false,
                previewCloseOnEsc: true,
                arrowPrevIcon: 'fa fa-angle-left',
                arrowNextIcon: 'fa fa-angle-right',
                closeIcon: 'fa fa-times',
                imageSize: 'contain',
                // imageSwipe :true,
                thumbnailsSwipe: true,
                "thumbnailsMoveSize": 4
            },
            {
                breakpoint: 1024,
                width: '100%',
                height: '980px',
                imagePercent: 100,
                thumbnailsPercent: 30,
                thumbnailsMargin: 10,
                thumbnailMargin: 10,
                thumbnailsArrows: false
            },
            // max-width 800
            {
                breakpoint: 900,
                width: '100%',
                height: '800px',
                imagePercent: 100,
                thumbnailsPercent: 30,
                thumbnailsMargin: 10,
                thumbnailMargin: 10
            },

            // max-width 400
            {
                breakpoint: 600,
                width: '100%',
                height: '500px',
                thumbnailsColumns: 3,
                //preview: false
            }
        ];

    }
    // model popup
    public collapsed: boolean;

    public isCollapsed(): boolean {
        return this.collapsed;
    }
    public setCollapsed(): void {
        this.collapsed = false;
    }

    public toggleMenu(): void {
        this.collapsed = !this.collapsed;
    }

    @Input('shouldShow')
    public shouldShow: boolean = false;

    searchclick(value) {
        if (value == 'Search click') {
            this.shouldShow = !this.shouldShow;
        }
    }
    notaddproduct() {
        this.toasterService.pop('error', 'User Not Logged In', '');
        this.shared.store_clicked('stared_clilk');
    }

    viewProductDetails(productId) {
        this.prodService.getProductDetails(atob(productId))
            .subscribe(
                res => {
                    this.product_detail = res.product;
                    if (res.product.related_products.length > 0) {
                        this.related_flag = true;
                    }
                    this.photos = this.product_detail['product_galleries'];
                    let post_images = [];
                    if (this.product_detail.product_image != null) {
                        let gallaery_object = {
                            small: this.product_detail.product_image,
                            medium: this.product_detail.product_image,
                            big: this.product_detail.product_image
                        }
                        post_images.push(gallaery_object);
                        if (this.photos.length != 0) {
                            for (let i = 0; i < this.photos.length; i++) {
                                let image_object = {
                                    small: this.photos[i].image_url,
                                    medium: this.photos[i].image_url,
                                    big: this.photos[i].image_url
                                }
                                post_images.push(image_object);
                            }
                        }
                        this.galleryImages = post_images
                    } else {
                        let image_object = {
                            small: 'assets/images/productdetail/subairpic5.jpg',
                            medium: 'assets/images/productdetail/default.jpg',
                            big: 'assets/images/productdetail/default.jpg'
                        }
                        post_images.push(image_object)
                        this.galleryImages = post_images
                    }
                },
                err => {
                    console.log(err)
                }
            )
    }
    changeStyle(e){
        
        this.document.body.classList.remove('hovrer_View:hover');
    }
    addFavourite(productId) {
        this.prodService.addfavourites(productId)
            .subscribe(
                res => {
                    this.viewProductDetails(this.product_id);
                    this.toasterService.pop('info', 'Product', 'Add To Wishlist');
                },
                err => {
                    console.log(err)
                }
            )
    }
    removeFavourite(productId) {
        this.prodService.removefavourites(productId)
            .subscribe(
                res => {
                    this.viewProductDetails(this.product_id);
                    this.toasterService.pop('info', 'Product', 'Remove To Wishlist');
                },
                err => {
                    console.log(err)
                }
            )
    }
    seeProductDetails(e, product_id) {
        this.shared.store_clicked('product_details');
        this.modalRef.hide();
        this.router.navigate(['/productdetails', btoa(product_id)])
    }

    addToCart(productId, count) {
        let product_data = { 'product_id': productId, 'quantity': count }
        this.storeService.addCartProduct(product_data)
            .subscribe(
                res => {
                    this.toasterService.pop('success', 'Product', 'Add Cart sucessfully');
                    this.shared.store_clicked('cart_count');
                    if (this.product_cart == true) {
                        this.modalRef.hide();
                    }
                },
                err => {
                    this.toasterService.pop('error', 'Product Out Of Stock', '');
                }
            )
    }
    imgErrorHandler(event): void {
        event.target.src = this.defaultimg
    }

    onChange(e) {

    }
    seeProductDetails_screen(e, product_id) {
        this.shared.store_clicked('product_details');
        this.router.navigate(['/productdetails', btoa(product_id)])
      }
    previewOpen() {
        this.document.body.classList.add('body-scroll-hide');
    }
    previewClose() {
        this.document.body.classList.remove('body-scroll-hide');
    }
}
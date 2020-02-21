import { PostDetailsService } from '../services/postDetails.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit, Input, TemplateRef, Inject } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';
import { environment } from './../../environments/environment';
import { StoreService } from '../services/store.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { LoginService } from '../services/login.service';
import { ProductDetailsService } from './../services/productDetails.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { LogDetailsService } from '../services/logDetails.service ';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html'
})
export class LogDetailsComponent implements OnInit {
  private toasterService: ToasterService;
  public config: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: false,
      timeout: 3000
    });
  public count: number = 1;
  public modalRef: BsModalRef;
  public product_details;
  public isFirstOpen = true;
  public is_logged_in: Boolean = false;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];
  public carouselTileItems: Array<any>;
  public carouselTile: NgxCarousel;
  public carouselOne: NgxCarousel;
  public carouselThree: NgxCarousel;
  public submitted: Boolean = false;
  public post_id;
  public user;
  public posts_details: any;
  public products = [];
  public post_likes = [];
  public likes_count: any;
  public defaultImg = environment.defaultImgUrl;
  public profileImg = environment.profImgUrl;
  public user_datas = JSON.parse(localStorage.getItem('user_data'))
  public login_id;
  public unique_id = '';

  increment() { this.count++; }
  decrement() {  this.count--; }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public postDetailsService: PostDetailsService,
    private shared: SharedService,
    private logService: LogDetailsService,
    public fb: FormBuilder,
    private modalService: BsModalService,
    private prodService: ProductDetailsService,
    private storeService: StoreService,
    public login: LoginService,
    toasterService: ToasterService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.shared.listen().subscribe((m: any) => {
      this.searchclick(m);
    })
    this.is_logged_in = login.loggedIn();
    this.toasterService = toasterService;
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
      point: {
        visible: false,
      },
      load: 2,
      touch: true,
      loop: true,
    }
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

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    this.route.params.subscribe((param) => {
      this.post_id = param.log_id
      this.unique_id = param.uniq_code
      // this.post_id = 1
      this.logDetailList(this.post_id);
    })

    // this.route.queryParams.subscribe((queryParam) => {
    //   let user_id = queryParam.ref_code;
    //   if (user_id == undefined) {
    //   } else {
    //     this.unique_id = user_id;
    //   }
    // })
    
    // this.unique_id = 'd5c491e7311ef3';

    if (this.is_logged_in) {
      this.login_id = this.user_datas[0].token;
    }

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
        thumbnailsSwipe: true,
        "thumbnailsMoveSize": 4,
        "imageDescription": true
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
      {
        breakpoint: 900,
        width: '100%',
        height: '800px',
        imagePercent: 100,
        thumbnailsPercent: 30,
        thumbnailsMargin: 10,
        thumbnailMargin: 10
      },
      {
        breakpoint: 600,
        width: '100%',
        height: '500px',
        thumbnailsColumns: 3,
      }
    ];
  }

  logDetailList(logId) {
    this.logService.logDetailsPost(logId)
      .subscribe((res1) => {
        this.products = res1.products;
        this.user = res1.user;
        this.posts_details = res1;
      }, error => {
        this.toasterService.pop('error', '404 Not Found', '');
      });
  }

  imgErrorHandlers(event): void {
    event.target.src = 'assets/images/postdetail/postpic/subpic1.jpg';
  }

  openModal(template: TemplateRef<any>, productDetails, meassge) {
    this.product_details = productDetails;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-big' })
    );
  }

  salonProfile(user_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/profile', btoa(user_id)], { queryParams: { salon_title: 'salons' } });
  }

  seeProductDetails_screen(e, product_id) {
    this.shared.store_clicked('product_details');
    // this.router.navigate(['/productdetails', btoa(product_id)])
  }

  addFavourite(productId, isFavourite: Boolean) {
    if (isFavourite) {
      this.prodService.removefavourites(productId)
        .subscribe(
          res => {
            this.toasterService.pop('info', 'Product', 'Remove To Wishlist');
            this.logDetailList(this.post_id);
          },
          err => {
            console.log(err)
          }
        )
    } else {
      this.prodService.addfavourites(productId)
        .subscribe(
          res => {
            this.toasterService.pop('info', 'Product', 'Add To Wishlist');
            this.logDetailList(this.post_id);
          },
          err => {
            console.log(err)
          }
        )
    }
  }

  notaddcart(meassge) {
    this.toasterService.pop('error', 'User Not Logged In', '');
    if (meassge == 'cart') {
      this.modalRef.hide()
    }
    this.shared.store_clicked('stared_clilk');
  }

  goToProfile(user_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/profile', btoa(user_id)]);
  }

  imgErrorHandler(event): void {
    event.target.src = this.defaultImg
  }

  profileimgHandler(event): void {
    event.target.src = this.profileImg
  }

  addToCart(productId, count) {
    let product_data = { 'product_id': productId, 'quantity': count, 'unique_codes': this.unique_id != '' ? [this.unique_id] : [] }
    this.storeService.addCartProduct(product_data)
      .subscribe(
        res => {
          this.toasterService.pop('success', 'Product', 'Add Cart sucessfully');
          this.modalRef.hide()
          this.shared.store_clicked('cart_count');
        },
        err => {
          this.toasterService.pop('error', 'Product Out Of Stock', '');
        }
      )
  }

  seeProductDetails(e, product_id) {
    this.shared.store_clicked('product_details');
    this.modalRef.hide();
    this.router.navigate(['/productdetails', btoa(product_id)])
  }

  previewOpen() {
    this.document.body.classList.add('body-scroll-hide');
  }

  previewClose() {
    this.document.body.classList.remove('body-scroll-hide');
  }

}

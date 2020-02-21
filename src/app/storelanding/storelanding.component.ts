import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';
import { SharedService } from '../services/shared.service';
import { PostDetailsService } from './../services/postDetails.service';
import { ProductDetailsService } from './../services/productDetails.service';
import { environment } from './../../environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { StoreService } from '../services/store.service';
import { DragScrollComponent } from 'ngx-drag-scroll/lib';
import { LoginService } from '../services/login.service';
import { SeosearchService } from '../services/seosearch.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import Swal from 'sweetalert2'

@Component({
  templateUrl: 'storelanding.component.html',
})

export class StoreLandingComponent implements OnInit {
  private toasterService: ToasterService;
  public config: ToasterConfig =
    new ToasterConfig({
      // showCloseButton: true,
      // positionClass: 'toast-bottom-right',
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
  isCollapsed: boolean = true;
  isMobileshow: boolean = false;
  public is_logged_in: Boolean = false;

  //model popup
  modalRef: BsModalRef;
  public product_data = null;
  openModal(template: TemplateRef<any>, product) {
    this.count = 1;
    this.product_data = product;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-big-shop' })
    );
  }
  constructor(
    private router: Router,
    private shared: SharedService,
    private postService: PostDetailsService,
    private prodService: ProductDetailsService,
    private modalService: BsModalService,
    private storeService: StoreService,
    toasterService: ToasterService,
    public login: LoginService,
    private route: ActivatedRoute,
    private seo: SeosearchService
  ) {
    this.shared.listen().subscribe((m: any) => {
      // this.searchclick(m);
    })

    this.toasterService = toasterService;
    this.is_logged_in = login.loggedIn();
  }
  requestModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  public carouselTileItems: Array<any>;
  public carouselTile: NgxCarousel;
  public carouselOne: NgxCarousel;
  public carouselThree: NgxCarousel;
  public carouselShop: NgxCarousel;

  public products = [];
  public trendingproducts = [];
  public discountsliders;
  public storelandingsales = null;
  public storeshopits = [];
  public defaultImg = environment.defaultImgUrl;
  public banerdefaultImgUrl = environment.banerdefaultImgUrl;
  public banertopdefaultImgUrl = environment.banertopdefaultImgUrl;
  public apiUrl = environment.apiUrl;
  public categories = [];
  public store_header;
  public sale_error = '';

  @ViewChild('nav', { read: DragScrollComponent }) public ds: DragScrollComponent;

  moveRight() {
    this.ds.moveRight();
  }

  ngOnInit() {
    this.shared.saleproductSearchVal(null);
    let filterData = "";
    this.shared.catselect_clicked(filterData);

    this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    this.carouselTile = {
      grid: { xs: 1, sm: 2, md: 3, lg: 4, all: 0 },
      slide: 2,
      speed: 500,
      //animation: 'lazy',
      point: {
        visible: false,
        pointStyles: ""
      },
      load: 2,
      loop: false,
      touch: true,
      //easing: 'ease'
    }
    this.carouselOne = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: 1,
      speed: 500,
      interval: 4000,
      point: {
        visible: true,
      },
      load: 1,
      loop: false,
      touch: true
    }
    this.carouselThree = {
      grid: { xs: 1, sm: 1, md: 2, lg: 2, all: 0 },
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
    this.carouselShop = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
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
    this.prodService.requestDataFromMultipleSources(1, 10).subscribe(responseList => {
      this.store_header = responseList[0].header;
      this.discountsliders = responseList[1].discount_sliders[0];
      this.products = responseList[2].products;
      this.trendingproducts = responseList[3].products;
      this.storelandingsales = responseList[4].sale;
    });

  }

  @Input('shouldShow')
  public shouldShow: boolean = false;

  searchclick(value) {
    this.shouldShow = !this.shouldShow;
  }
  notaddproduct() {
    this.toasterService.pop('error', 'User Not Logged In', '');
    this.modalRef.hide()
    this.shared.store_clicked('stared_clilk');
  }

  liOpen(e) {
    this.isMobileshow = !this.isMobileshow
  }
  liOpen1(e) {
    this.isMobileshow = !this.isMobileshow
  }

  storeclilk() {
    this.shared.store_clicked('product_details');
    this.store_filters = [{ 'hai_type': 'new_arrivals', 'hai_name': 'New Arrivals' }]
    this.shared.catselect_clicked(this.store_filters);
    this.router.navigate(['/store']);
  }
  getProducts() {
    this.prodService.arrivalproducts(1, 10)
      .subscribe(
        res => {
          this.products = res.products;
        },
        err => {
          console.log(err)
        }
      )
  }

  decline() {
    this.modalRef.hide();
  }

  saleout(){
    Swal.fire({
      title: 'Info',
      text: 'Sale Is Over Wait Next Sale',
      type: 'info',
      confirmButtonText: 'Ok'
    })
  }

  bannerclilk(product_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/productdetails', btoa(product_id)])
  }

  saleovermodule() {
    this.toasterService.pop('info', 'Sale Is Over', '');
  }
  public store_filter;
  sub_cat_service(type, id, name) {
    this.shared.store_clicked('product_details');
    this.store_filter = [{ 'hai_type': type, 'hai_name': name, 'hai_id': id }]
    this.shared.catselect_clicked(this.store_filter);
    this.router.navigate(['/store']);
  }
  public store_filters;
  store_headers(header, name) {
    if (header == 'new_arrivals') {
      this.shared.store_clicked('product_details');
      this.store_filters = [{ 'hai_type': header, 'hai_name': name }]
      this.shared.catselect_clicked(this.store_filters);
      this.router.navigate(['/store']);
    } else if (header == 'top_sellers') {
      this.shared.store_clicked('product_details');
      this.store_filters = [{ 'hai_type': header, 'hai_name': name }]
      this.shared.catselect_clicked(this.store_filters);
      this.router.navigate(['/store']);
    }
  }

  salemodule(data) {
    this.shared.store_clicked('product_details');
    this.shared.saleproductSearchVal(data.id);
    this.router.navigate(['/store']);
  }

  addFavourite(productId, isFavourite: Boolean) {
    if (isFavourite) {
      this.prodService.removefavourites(productId)
        .subscribe(
          res => {
            this.toasterService.pop('info', 'Product', 'Remove To Wishlist');
            this.getProducts();
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
            this.getProducts();
          },
          err => {
            console.log(err)
          }
        )
    }
  }

  categoryClick(cat_id) {
    this.postService.getProductByCat(cat_id)
      .subscribe(
        res => {
          this.products = res.category.products;
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

  imgErrorHandler(event): void {
    event.target.src = this.defaultImg
  }
  bimgErrorHandler(event): void {
    event.target.src = this.banerdefaultImgUrl
  }
  bantopimgErrorHandler(event): void {
    event.target.src = this.banertopdefaultImgUrl
  }

  HairDry(e) {
    console.log('hairDr')
  }
  seeProductDetails_screen(e, product_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/productdetails', btoa(product_id)])
  }

  addToCart(productId, count) {
    this.shared.store_clicked('product_details');
    let product_data = { 'product_id': productId, 'quantity': count }
    this.storeService.addCartProduct(product_data)
      .subscribe(
        res => {
          if (res) {
            this.toasterService.pop('success', 'Product', 'Add Cart sucessfully');
            this.modalRef.hide()
            this.shared.store_clicked('cart_count');
          }
        },
        err => {
          this.toasterService.pop('error', 'Product Out Of Stock', '');
        }
      )
  }
}

import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, TemplateRef, } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { StoreService } from '../services/store.service';
import { environment } from './../../environments/environment';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ProductDetailsService } from './../services/productDetails.service';
import { SeosearchService } from '../services/seosearch.service';
import { Subscription } from 'rxjs';
import { Options, ChangeContext, PointerType } from 'ng5-slider';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { ISubscription } from 'rxjs/Subscription';
import { NgxSpinnerService } from 'ngx-spinner';
export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
  templateUrl: './storelisting.component.html',
  providers: [{ provide: AccordionConfig, useFactory: getAccordionConfig }],
  host: {
    '(window:scroll)': 'onScroll($event)'
  }

})
export class StoreListComponent implements OnInit {

  private toasterService: ToasterService;
  public config: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: false,
      timeout: 3000
    });
  minValue: number = 0;
  maxValue: number = 400;
  options: Options = {
    floor: 0,
    ceil: 400
  };
  public min_price: any = 0;
  public max_price: any = 400;
  public is_logged_in: Boolean = false;
  title_array: any = [];
  public sell_percent = null;

  onUserChangeEnd(context: ChangeContext): void {
    this.min_price = context.value;
    this.max_price = context.highValue;
    this.count_scroll_window = 901;
    this.filterproduct();
  }
  private productSearchSubscriber: ISubscription;
  private productSearchSubscribers: ISubscription;
  private arrivalSearchSubscribers: ISubscription;
  // productSearchSubscriber: Subscription
  // productSearchSubscribers: Subscription
  // arrivalSearchSubscribers: Subscription
  isCollapsed: boolean = true;
  isMobileshow: boolean = false;
  constructor(
    private router: Router,
    public fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private shared: SharedService,
    toasterService: ToasterService,
    private prodService: ProductDetailsService,
    private modalService: BsModalService,
    private storeService: StoreService,
    private seo: SeosearchService,
    public login: LoginService
  ) {
    this.is_logged_in = login.loggedIn();

    this.toasterService = toasterService;
    this.shared.listen().subscribe((m: any) => {
      this.searchclick(m);
    })
    this.sell_percent = null;
  }
  public product_page: number = 1;
  public product_limit: number = 6;
  public product_totalCount: number;
  public store_products = [];
  public post_products = [];
  public post_id: any;
  public subcateFormarray: any;
  public post_name: any;
  public store_category: any;
  public store_brand: any;
  catFormArray: Array<any> = [];
  brandFormArray: Array<any> = [];
  public defaultImg = environment.defaultImgUrl;
  public store_header;
  public store_sidebar;
  hairCareFormArray: Array<any> = [];
  hairTypeFormArray: Array<any> = [];
  preferencesFormArray: Array<any> = [];
  consitenceFormArray: Array<any> = [];
  ingredientsFormArray: Array<any> = [];
  styleFormArray: Array<any> = [];
  public item_choose;
  public item_choose1;
  public item_choose2;
  public item_choose3;
  public item_choose4;
  public item_name;
  public item_name1;
  public item_name2;
  public item_name3;
  public item_name4;
  public item_name5;
  filterForm: FormGroup;

  @Input('shouldShow')
  public shouldShow: boolean = false;
  public store_value: boolean = false;

  isFirstOpen = true;
  myMinVar = 10;
  count: number = 1;
  increment() {
    this.count++;
  }
  decrement() {
    this.count--;
  }

  //model popup
  modalRef: BsModalRef;
  public clicked_product_details = [];
  openModal(template: TemplateRef<any>, product_details) {
    this.count = 1;
    this.clicked_product_details = product_details;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-big' })
    );
  }

  searchclick(value) {
    if (value == 'Search click') {
      this.shouldShow = !this.shouldShow;
    } else if (value == 'filter_search') {
      this.shouldShow = false;
    }
  }

  public storepage: boolean = false;
  public filter_flag: boolean = false;
  public search_data = '';
  public filter_res = '';
  public sale_header = '';
  public dehh;

  ngOnInit() {
    window.scroll(0, 0);
    this.filterForm = this.fb.group({
      'hair_care_product_types': new FormControl("", []),
      'hair_types': new FormControl("", []),
      'preferences': new FormControl("", []),
      'consistency_types': new FormControl("", []),
      'ingredients': new FormControl("", []),
      'styling_tools': new FormControl("", []),
    });

    // public shouldShow: boolean = false;
    this.route.paramMap.subscribe(params => {
      let is_from_search = params.get("is_from_search");
      if (is_from_search) {
        this.shouldShow = true;
      }

    })
    this.store_menu();

    this.arrivalSearchSubscribers = this.shared.catSellSearchVal.subscribe(msg => {
      this.sell_percent = null
      this.dehh = msg ? msg : null;
      if (this.dehh != null) {
        if (this.dehh[0].hai_type == 'brands') {
          this.item_choose = this.dehh[0].hai_id;
          this.item_name = this.dehh[0].hai_name;
        } else if (this.dehh[0].hai_type == 'collection') {
          this.item_choose1 = this.dehh[0].hai_id;
          this.item_name1 = this.dehh[0].hai_name;
        } else if (this.dehh[0].hai_type == 'styling_product') {
          this.item_choose2 = this.dehh[0].hai_id;
          this.item_name2 = this.dehh[0].hai_name;
        } else if (this.dehh[0].hai_type == 'shampoo') {
          this.item_choose3 = this.dehh[0].hai_id;
          this.item_name3 = this.dehh[0].hai_name;
        } else if (this.dehh[0].hai_type == 'conditioner') {
          this.item_choose4 = this.dehh[0].hai_id;
          this.item_name4 = this.dehh[0].hai_name;
        } else if (this.dehh[0].hai_type == 'new_arrivals') {
          this.arrival_name = "New Arrivals";
          this.arrival = true;
        } else if (this.dehh[0].hai_type == 'top_sellers') {
          this.seller_name = "Top Sellers";
          this.treading = true;
        } else if (this.dehh[0].hai_type == 'styling_tools') {
          this.styleFormArray.push(this.dehh[0].hai_id);
          this.item_name5 = this.dehh[0].hai_name;
        }
        this.count_scroll_window = 901;
        this.filterproduct();
      }
    });
    if (this.dehh != null) {
      this.arrivalSearchSubscribers = this.shared.currentProductSearchVal.subscribe(searchVal => {
        this.search_data = searchVal ? searchVal : '';
        if (this.search_data != '') {
          this.product_page = 1;
          this.product_limit = 6;
          this.count_scroll_window = 901;
          this.filterproduct();
        }
      });
    }
    this.productSearchSubscribers = this.shared.currentSellSearchVal.subscribe(searchVal => {
      this.sell_percent = searchVal ? searchVal : null;
      if (this.sell_percent != null) {
        this.product_page = 1;
        this.product_limit = 6;
        this.sale_header = 'Sale Products';
        this.count_scroll_window = 901;
        this.filterproduct()
      }
    });
    if (this.sell_percent != null) {
      this.productSearchSubscribers = this.shared.currentProductSearchVal.subscribe(searchVal => {
        this.search_data = searchVal ? searchVal : '';
        if (this.search_data != '') {
          this.product_page = 1;
          this.product_limit = 6;
          this.count_scroll_window = 901;
          this.filterproduct();
        }
      });
    }
    if (this.dehh == null) {
      if (this.sell_percent == null) {
        this.productSearchSubscriber = this.shared.currentProductSearchVal.subscribe(searchVal => {
          this.search_data = searchVal ? searchVal : '';
          if (this.search_data != '') {
            this.product_page = 1;
            this.product_limit = 6;
            this.count_scroll_window = 901;
            this.filterproduct()
          } else {
            this.product_page = 1;
            this.product_limit = 6;
            this.count_scroll_window = 901;
            this.filterproduct();
          }
        });
      }
    }
  }
  public show_loader: Boolean = false;
  public count_scroll_window = null;
  onScroll(evt) {//window object can be wrapper in a service but for now we directly use it
    // this.count_scroll_window = 901;
    let fuhuh = this.count_scroll_window == null ? 901 : this.count_scroll_window;
    if (window.pageYOffset >= fuhuh) {
      this.show_loader = true;
      this.product_page += 1;
      this.filter_flag = true;

      let filter_data = { search: this.search_data, new_arrival: this.arrival == true ? this.arrival : null, is_trending: this.treading == true ? this.treading : null, price_start: this.min_price, price_end: this.max_price, brands: this.item_choose, hair_types: this.hairTypeFormArray, hair_care_product_types: this.hairCareFormArray, ingredients: this.ingredientsFormArray, preferences: this.preferencesFormArray, consistency_types: this.consitenceFormArray, styling_tools: this.styleFormArray, shampoo: this.item_choose3, collection: this.item_choose1, styling_product: this.item_choose2, conditioner: this.item_choose4, sale: this.sell_percent };
      this.storeService.filterSearch(filter_data, this.product_page, this.product_limit)
        .subscribe(
          res => {
            this.filter_res = res;
            let store_scroll_number = res.products;
            Array.prototype.push.apply(this.store_products, store_scroll_number);
            this.show_loader = false;
            this.product_page = res.meta.current_page;
            this.product_totalCount = res.meta.total_count;
          },
          err => {
            this.show_loader = false;
            console.log(err)
          }
        )
      this.count_scroll_window = this.count_scroll_window + 1200;
    }
  }
  arrow_tops() {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    // window.scroll(0, 0);
  }

  ngOnDestroy(): void {
    this.clearfilter();
    if (this.productSearchSubscriber) {
      this.productSearchSubscriber.unsubscribe();
    }
    if (this.productSearchSubscribers) {
      this.productSearchSubscribers.unsubscribe();
    }
    if (this.arrivalSearchSubscribers) {
      this.arrivalSearchSubscribers.unsubscribe();
    }
  }

  store_menu() {
    this.storeService.storeMenu()
      .subscribe(
        res => {
          this.store_header = res.header;
          this.store_sidebar = res.side_bar;
        },
        err => {
          console.log(err)
        }
      )
  }

  public arrival;
  public treading;
  public arrival_name;
  public seller_name;
  store_headers(header) {
    this.item_choose = null;
    this.item_choose1 = null;
    this.item_choose2 = null;
    this.item_choose3 = null;
    this.item_choose4 = null;
    this.item_name = null;
    this.item_name1 = null;
    this.item_name2 = null;
    this.item_name3 = null;
    this.item_name4 = null;
    this.treading = null;
    this.arrival = null;
    if (header == 'new_arrivals') {
      this.arrival_name = "New Arrivals";
      this.arrival = true;
      this.count_scroll_window = 901;
      this.filterproduct();
    } else if (header == 'top_sellers') {
      this.seller_name = "Top Sellers";
      this.treading = true;
      this.count_scroll_window = 901;
      this.filterproduct();
    }
  }
  notaddproduct() {
    this.toasterService.pop('error', 'User Not Logged In', '');
    this.modalRef.hide()
    this.shared.store_clicked('stared_clilk');
  }

  onChanges(cat_id, isChecked: boolean) {
    if (isChecked) {
      this.catFormArray.push(cat_id);
    } else {
      let index = this.catFormArray.indexOf(cat_id);
      this.catFormArray.splice(index, 1);
    }
    this.subcategory_list();
  }

  onChangess(cat_id, isChecked: boolean) {
    if (isChecked) {
      this.catFormArray.push(cat_id);
    } else {
      let index = this.catFormArray.indexOf(cat_id);
      this.catFormArray.splice(index, 1);
    }
  }

  selectChanges(cat_name, cat_id, isChecked: boolean) {
    this.treading = null;
    this.arrival = null;
    if (cat_name == 'hair_care_product_types') {
      if (isChecked) {
        this.hairCareFormArray.push(cat_id);
      } else {
        let index = this.hairCareFormArray.indexOf(cat_id);
        this.hairCareFormArray.splice(index, 1);
      }
    } else if (cat_name == 'hair_types') {
      if (isChecked) {
        this.hairTypeFormArray.push(cat_id);
      } else {
        let index = this.hairTypeFormArray.indexOf(cat_id);
        this.hairTypeFormArray.splice(index, 1);
      }
    } else if (cat_name == 'preferences') {
      if (isChecked) {
        this.preferencesFormArray.push(cat_id);
      } else {
        let index = this.preferencesFormArray.indexOf(cat_id);
        this.preferencesFormArray.splice(index, 1);
      }
    } else if (cat_name == 'consistency_types') {
      if (isChecked) {
        this.consitenceFormArray.push(cat_id);
      } else {
        let index = this.consitenceFormArray.indexOf(cat_id);
        this.consitenceFormArray.splice(index, 1);
      }
    } else if (cat_name == 'ingredients') {
      if (isChecked) {
        this.ingredientsFormArray.push(cat_id);
      } else {
        let index = this.ingredientsFormArray.indexOf(cat_id);
        this.ingredientsFormArray.splice(index, 1);
      }
    } else if (cat_name == 'styling_tools') {
      if (isChecked) {
        this.styleFormArray.push(cat_id);
      } else {
        let index = this.styleFormArray.indexOf(cat_id);
        this.styleFormArray.splice(index, 1);
      }
    }
    this.count_scroll_window = 901;
    this.filterproduct();
  }

  sub_cat_choose(header, id, name) {
    if (header == 'brands') {
      this.styleFormArray = [];
      this.item_choose = id;
      this.item_choose1 = null;
      this.item_choose2 = null;
      this.item_choose3 = null;
      this.item_choose4 = null;
      this.item_name = name;
      this.item_name1 = null;
      this.item_name2 = null;
      this.item_name3 = null;
      this.item_name4 = null;
      this.item_name5 = null;
    } else if (header == 'collection') {
      this.styleFormArray = [];
      this.item_choose1 = id;
      this.item_choose = null;
      this.item_choose2 = null;
      this.item_choose3 = null;
      this.item_choose4 = null;
      this.item_name = null;
      this.item_name2 = null;
      this.item_name3 = null;
      this.item_name4 = null;
      this.item_name5 = null;
      this.item_name1 = name;
    } else if (header == 'styling_product') {
      this.styleFormArray = [];
      this.item_choose2 = id;
      this.item_choose1 = null;
      this.item_choose = null;
      this.item_choose3 = null;
      this.item_choose4 = null;
      this.item_name1 = null;
      this.item_name = null;
      this.item_name3 = null;
      this.item_name4 = null;
      this.item_name2 = name;
      this.item_name5 = null;
    } else if (header == 'shampoo') {
      this.styleFormArray = [];
      this.item_choose3 = id;
      this.item_choose1 = null;
      this.item_choose2 = null;
      this.item_choose = null;
      this.item_choose4 = null;
      this.item_name3 = name;
      this.item_name1 = null;
      this.item_name2 = null;
      this.item_name = null;
      this.item_name4 = null;
      this.item_name5 = null;
    } else if (header == 'conditioner') {
      this.styleFormArray = [];
      this.item_choose4 = id;
      this.item_choose1 = null;
      this.item_choose2 = null;
      this.item_choose3 = null;
      this.item_choose = null;
      this.item_name4 = name;
      this.item_name1 = null;
      this.item_name2 = null;
      this.item_name3 = null;
      this.item_name = null;
      this.item_name5 = null;
    } else if (header == 'styling_tools') {
      this.styleFormArray.push(id);
      this.item_name1 = null;
      this.item_name2 = null;
      this.item_name3 = null;
      this.item_name = null;
      this.item_name4 = null;
      this.item_name5 = name;
    }
    this.count_scroll_window = 901;
    this.filterproduct();
  }

  subcategory_list() {
    let subcatFormarray = [];
    this.catFormArray.forEach(item => {
      this.storeService.getSubCategorie(item)
        .subscribe(
          res => {
            let cat_list = res.category.sub_categories;
            if (cat_list != null) {
              cat_list.forEach(demo => {
                subcatFormarray.push(demo);
              });
            }
          },
          err => {
            console.log(err)
          }
        )
    });
    this.subcateFormarray = subcatFormarray;
  }

  onBrand(brand_id, isChecked: boolean) {
    if (isChecked) {
      this.brandFormArray.push(brand_id);
    } else {
      let index = this.brandFormArray.indexOf(brand_id);
      this.brandFormArray.splice(index, 1);
    }
  }

  filterproduct(page?, limit?) {
    this.filter_flag = true;
    this.store_value = true;
    let filter_data = { search: this.search_data, new_arrival: this.arrival == true ? this.arrival : null, is_trending: this.treading == true ? this.treading : null, price_start: this.min_price, price_end: this.max_price, brands: this.item_choose, hair_types: this.hairTypeFormArray, hair_care_product_types: this.hairCareFormArray, ingredients: this.ingredientsFormArray, preferences: this.preferencesFormArray, consistency_types: this.consitenceFormArray, styling_tools: this.styleFormArray, shampoo: this.item_choose3, collection: this.item_choose1, styling_product: this.item_choose2, conditioner: this.item_choose4, sale: this.sell_percent };
    this.storeService.filterSearch(filter_data, page ? page : 1, limit ? limit : 6)
      .subscribe(
        res => {
          this.filter_res = res;
          this.store_products = res.products;
          this.product_page = res.meta.current_page;
          this.product_totalCount = res.meta.total_count;
          this.store_value = false;
        },
        err => {
          console.log(err)
        }
      )
  }

  clearfilter() {
    this.filterForm.reset();
    this.treading = null;
    this.arrival = null;
    this.search_data = '',
      this.catFormArray = [],
      this.min_price = '',
      this.max_price = '',
      this.item_choose = '',
      this.item_choose1 = '',
      this.item_choose2 = '',
      this.item_choose3 = '',
      this.item_choose4 = '',
      this.sale_header = '',
      this.brandFormArray = []
    this.subcateFormarray = [];
    this.hairCareFormArray = [];
    this.hairTypeFormArray = [];
    this.preferencesFormArray = [];
    this.consitenceFormArray = [];
    this.ingredientsFormArray = [];
    this.styleFormArray = [];
    this.product_page = 1;
    this.product_limit = 6;
    this.filter_flag = false;
    this.sell_percent = null;
    this.item_name1 = null;
    this.item_name = null;
    this.item_name2 = null;
    this.item_name3 = null;
    this.item_name4 = null;
    this.item_name5 = null;
    this.count_scroll_window = 901;
    this.filterproduct(this.product_page, this.product_limit);
  }

  pageChanged(event: PageChangedEvent): void {
    this.filterproduct(event.page, event.itemsPerPage);
    window.scroll(0, 0);
  }

  imgErrorHandler(event): void {
    event.target.src = this.defaultImg
  }

  seeProductDetails(e, product_id) {
    this.shared.store_clicked('product_details');
    this.modalRef.hide();
    this.router.navigate(['/productdetails', btoa(product_id)])
  }

  seeProductDetails_screen(e, product_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/productdetails', btoa(product_id)])
  }

  moreDetails(product_id, product_name) {
    this.modalRef.hide();
    this.router.navigate(['/productdetails', btoa(product_id)], { queryParams: { postname: btoa(product_name) } })
  }

  addFavourite(productId, isFavourite: Boolean) {
    if (isFavourite) {
      this.prodService.removefavourites(productId)
        .subscribe(
          res => {
            // this.count_scroll_window = 901;
            // this.filterproduct();
            // this.filterproduct(this.product_page, this.product_limit);
            this.filterproduct(1, this.store_products.length);
            this.product_page=2;
            this.toasterService.pop('info', 'Product', 'Remove To Wishlist');
          },
          err => {
            console.log(err)
          }
        )
    } else {
      this.prodService.addfavourites(productId)
        .subscribe(
          res => {
            // this.count_scroll_window = 901;
            // this.filterproduct();
            // this.filterproduct(this.product_page, this.product_limit);
            this.filterproduct(1, this.store_products.length);
            this.product_page=2;
            this.toasterService.pop('info', 'Product', 'Add To Wishlist');
          },
          err => {
            console.log(err)
          }
        )
    }
  }

  addToCart(productId, count) {
    let product_data = { 'product_id': productId, 'quantity': count }
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
}
import { Component, OnInit, Input, EventEmitter, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { SharedService } from '../services/shared.service';
import { StoreService } from '../services/store.service';
import { LoginService } from '../services/login.service';
import { DeviceDetectorService } from 'ngx-device-detector';
// social
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { MODULE_ROUTE, FEED_DROP_DOWN_OPTION, FEED_SEARCH_TYPE } from '../shared/define';
import { Subscription, Subject } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: {
    '(window:scroll)': 'onScroll($event)'
  }
})

export class HeaderComponent implements OnInit {

  productSearchTerm: string
  loginForm: FormGroup;
  forgetForm: FormGroup;
  ProfileChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isScrolled = false;
  public is_logged_in: Boolean = false;
  public insta_login = environment.insta_loginurl;
  public search_header_display = environment.search_display_width;
  public submitted: Boolean = false;
  public form_submitted: Boolean = false;
  public invalid: Boolean = false;
  public form_filled = [];
  private setLocalStorage = [];
  public error;
  public facebook_ids = null;
  public instagram_ids = null;
  public searchopens: Boolean = false;
  public forgetpopup: Boolean = false;
  public logigpopup: Boolean = false;
  public logoutpopup: Boolean = false;
  public searchopen: Boolean = false;
  public static_search: Boolean = false;
  public cart_product_count: Number;
  public currPos: any = 0;
  public changePos: any = 0;
  public storepage: Boolean = false;
  public lat = 23.01952;
  public long = 72.5475328;
  currentRoute: string;
  moduleRouteList = MODULE_ROUTE;
  //set drop down value and list
  dropdown_value: string = 'All Tags'
  feed_search_type: string = FEED_SEARCH_TYPE[3];
  feed_option_array: Array<any> = FEED_DROP_DOWN_OPTION;
  feed_search_value: string = "";

  public keyUp = new Subject<KeyboardEvent>();
  private searchSubscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public shared: SharedService,
    public login: LoginService,
    public store: StoreService,
    public fb: FormBuilder,
    private authService: AuthService,
    private deviceService: DeviceDetectorService
  ) {
    this.getScreenSize();
    this.is_logged_in = login.loggedIn();
    this.shared.store_listen().subscribe(message => this.onSampleServiceUpdate(message))

    //on route change hide search bar and change search box
    router.events.subscribe((url: any) => {
      this.currentRoute = url.url ? url.url : null;
      if (this.currentRoute == '/') {
        this.currentRoute = '/home';
      }
      if ((this.currentRoute == this.moduleRouteList.home) || (this.currentRoute && this.currentRoute.indexOf(this.moduleRouteList.store_search) > -1) || (this.currentRoute == this.moduleRouteList.store) || (this.currentRoute == this.moduleRouteList.storelanding)) {
        this.searchopens = true;
      } else {
        this.searchopens = false;
      }
      if ((this.currentRoute == this.moduleRouteList.home) || (this.currentRoute && this.currentRoute.indexOf(this.moduleRouteList.store_search) > -1) || (this.currentRoute == this.moduleRouteList.storelanding)) {
        this.searchopen = true;
        this.static_search = true;
        if (this.currentRoute == this.moduleRouteList.home) {
          // set search bar value and drop down for feed page
          this.dropdown_value = 'All Tags';
          this.feed_search_type = FEED_SEARCH_TYPE[3];
          this.feed_option_array = FEED_DROP_DOWN_OPTION;
          this.setFeedDropDownList();
        }
      }
    });
  }

  storeClick() {
    this.shared.changeProductSearchVal("");
  }

  searFeed() {
    this.shared.clicked('flag_maintain');
    if (this.feed_search_value.length > 2 || this.feed_search_value.length == 0) {
      if (this.currentRoute == this.moduleRouteList.home) {// this is for call feed page api with search         
        this.shared.changeFeedSearchVal(this.feed_search_type, this.feed_search_value);
      } else if (this.currentRoute == this.moduleRouteList.store || (this.currentRoute && this.currentRoute.indexOf(this.moduleRouteList.store_search) > -1)) {// this is for call store page api with search
        this.shared.changeProductSearchVal(this.feed_search_value);
      } else if (this.currentRoute == this.moduleRouteList.storelanding) {// this is for call store page api with search
        this.shared.changeProductSearchVal(this.feed_search_value);
        this.router.navigate(['/store', true])
      }
    }
  }

  setFeedDropDownList() {
    this.feed_option_array = this.feed_option_array.filter(obj => obj !== this.dropdown_value);
  }

  onSampleServiceUpdate(message) {
    if (message == 'product_details') {
      this.static_search = false;
      this.searchopen = false;
    } if (message == 'from_footer') {
      this.static_search = true;
      this.searchopen = true;
    } if (message == 'window_click') {
      this.logigpopup = false;
    } if (message == 'stared_clilk') {
      this.logigpopup = true;
    } if (message == 'cart_count') {
      this.productInCart();
    } if (message == 'clear_demo_search') {
      this.feed_search_value = "";
      this.router.navigate(['/home'])
    }
  }

  packageshow(e) {
    if (this.searchopen == true) {
      this.searchopen = false;
      this.shared.clicked('Search click');
    } if (this.logigpopup == true) {
      this.logigpopup = false;
    } else {
      this.logigpopup = true;
    }
  }

  logoutshow(e) {
    if (this.searchopen == true) {
      this.searchopen = false;
      this.shared.clicked('Search click');
    } if (this.logoutpopup == true) {
      this.logoutpopup = false;
    } else {
      this.logoutpopup = true;
    }
  }

  leave(e) {
    if (this.logigpopup == true && this.form_filled.length == 0) {
      this.loginForm.reset();
      this.submitted = false;
      this.logigpopup = false;
    } else {
      this.logigpopup = true;
    }
  }

  // search open div function
  searchclick(e) {
    this.logoutpopup = false;
    this.logigpopup = false;
    this.shared.clicked('Search click');
    this.searchopen = !this.searchopen;
  }

  searchDisableclick(e) {
    this.shared.clicked('flag_maintain');
    this.logoutpopup = false;
    this.static_search = false;
    this.logigpopup = false;
    if (this.searchopen == true) {
      this.searchopen = false;
      this.shared.clicked('Search click');
    }
  }

  searchEnableclick(e, url) {
    this.logoutpopup = false;
    this.static_search = true;
    this.shared.clicked('flag_maintain');
    if (url == 'storelanding') {
    } if (url == 'home') {
      this.feed_search_value = "";
      this.router.navigate(['/home'])
    }
  }

  // Declare height and width variables
  scrHeight: any;
  scrWidth: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }

  onScroll(evt) {//window object can be wrapper in a service but for now we directly use it
    this.changePos = ((window.pageYOffset || evt.target.scrollTop) - (evt.target.clientTop || 0)) || 0;
    if (this.changePos - this.currPos > 0) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
    const isDesktopDevice = this.deviceService.isTablet();

    if (this.deviceService.isTablet()) {
      if (this.changePos > 80 && this.changePos - this.currPos > 0) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
    }
    if (this.deviceService.isDesktop()) {

      if (this.changePos > 80 && this.changePos - this.currPos > 0) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
    }
    if (this.deviceService.isMobile()) {
      if (this.changePos > 80 && this.changePos - this.currPos > 0) {
        this.isScrolled = true;
      } else {
        this.isScrolled = false;
      }
    }
    this.currPos = this.changePos;
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
    });
    this.createLoginForm();
    if (this.is_logged_in) {
      this.productInCart();
      let user = JSON.parse(localStorage.user_data);
      this.facebook_ids = user[0].facebook_loginid;
      this.instagram_ids = user[0].instagram_loginid;
    }

    if (this.currentRoute == this.moduleRouteList.storelanding) {

    }
    this.shared.currentProductSearchVal.subscribe(message => {
      this.feed_search_value = message;
    });
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
    })
    this.forgetForm = this.fb.group({
      'email': new FormControl('', [Validators.required, Validators.email]),
    })
  }

  loginhere() {
    this.forgetpopup = !this.forgetpopup;
    this.error = '';
  }

  //login
  loginFormSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      let login_data = { session: { ...this.loginForm.value, latitude: this.lat, longitude: this.long } };
      this.login.login(login_data)
        .subscribe(
          res => {
            this.setLocalStorage = [{ 'email': res.user.email, 'token': res.user.id, 'user_type': res.user.account_type, 'user_salon': res.user.salon, 'facebook_loginid': res.user.facebook_id, 'instagram_loginid': res.user.instagram_id }]
            localStorage.setItem('user_data', JSON.stringify(this.setLocalStorage))
            localStorage.setItem('auth_token', res.user.auth_token)
            window.location.reload();
          }, err => {
            this.error = err.error.errors;
          }
        )
    }
  }

  chnage_pass() {
    this.static_search = false;
    if (this.searchopen == true) {
      this.searchopen = false;
    }
    let user = JSON.parse(localStorage.user_data);
    this.router.navigate(['/changepassword', btoa(user[0].token)])
  }

  //forget password
  forgetpasssubmit() {
    this.submitted = false;
    this.form_submitted = true;
    if (this.forgetForm.valid) {
      this.login.forgetPass(this.forgetForm.value)
        .subscribe(
          user => {
            this.forgetpopup = false;
            this.forgetForm.reset();
            this.form_submitted = false;
          }, err => {
            this.error = err.error.errors;
          }
        )
    }
  }

  public productInCart() {
    this.store.getCartProducts()
      .subscribe(
        res => {
          let count_array = []
          count_array = res.carts;
          this.cart_product_count = count_array.length;
        }, err => {
          console.log('err: ', err);
        }
      )
  }

  facebookLogin() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      const params = { 'facebook_token': user.authToken };
      this.login.facebook_login(params)
        .subscribe(user => {
          // if (user) {
          this.setLocalStorage = [{ 'email': user.user.email, 'token': user.user.id, 'facebook_loginid': user.user.facebook_id, 'instagram_loginid': user.user.instagram_id }]
          localStorage.setItem('user_data', JSON.stringify(this.setLocalStorage))
          localStorage.setItem('auth_token', user.user.auth_token)
          window.location.reload();
          // }
        }, err => {
          console.log('err: ', err);
        });
    });
  }
  inputText(e) {
    if (e.target.value) {
      this.form_filled = e.target.value
    } else {
      this.form_filled = [];
      this.logigpopup = true;
    }
    this.invalid = false;
  }

  changeFeedDropdownMenu(e) {
    this.feed_option_array.push(this.dropdown_value);
    this.dropdown_value = e;
    // set search type
    this.feed_search_type = this.dropdown_value == FEED_DROP_DOWN_OPTION[3] ? FEED_SEARCH_TYPE[3] : this.dropdown_value == FEED_DROP_DOWN_OPTION[2] ? FEED_SEARCH_TYPE[2] : this.dropdown_value == FEED_DROP_DOWN_OPTION[1] ? FEED_SEARCH_TYPE[1] : FEED_SEARCH_TYPE[0];
    // set drop down list
    this.setFeedDropDownList();
    //reset search value
    // call search feed value
    this.shared.changeFeedSearchVal(this.feed_search_type, this.feed_search_value);
  }

  goProfile() {
    this.static_search = false;
    if (this.searchopen == true) {
      this.searchopen = false;
      this.shared.clicked('Search click');
    }
    let user = JSON.parse(localStorage.user_data);
    if (user[0].user_type == 'owner') {
      this.router.navigate(['/profile', btoa(user[0].user_salon.id)], { queryParams: { salon_title: 'salons' } });
    } else {
      this.router.navigate(['/profile', btoa(user[0].token)]);
    }
  }

  doLogout() {
    let token = localStorage.getItem('auth_token');
    this.login.doLogout(token);
    localStorage.removeItem('user_data');
    if (localStorage.coupons) {
      localStorage.removeItem('coupons');
    }
    localStorage.removeItem('auth_token');
    this.activatedRoute.queryParams.subscribe((queryParam) => {
      if (!queryParam) {
        window.location.reload();
      } else if (this.currentRoute == '/cart') {
        this.router.navigate(['/home'])
        window.location.reload();
      } else {
        window.location.reload();
      }
    })
  }
}

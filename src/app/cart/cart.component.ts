import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { environment } from './../../environments/environment';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { StoreService } from '../services/store.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomValidation } from '../helper/customValidation';
import { ProfileService } from '../services/profile.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LoginService } from '../services/login.service';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  templateUrl: 'cart.component.html'
})

export class CartComponent implements OnInit {
  public is_logged_in: Boolean = false;

  private toasterService: ToasterService;
  public config: ToasterConfig =
    new ToasterConfig({
      // showCloseButton: true,
      // positionClass: 'toast-bottom-right',
      tapToDismiss: false,
      timeout: 3000
    });
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private shared: SharedService,
    toasterService: ToasterService,
    public store: StoreService,
    public fb: FormBuilder,
    public login: LoginService,
    private profileService: ProfileService,
    public customValidation: CustomValidation
  ) {
    this.toasterService = toasterService;
    this.shared.listen().subscribe((m: any) => {
      this.searchclick(m);
    })
    this.is_logged_in = login.loggedIn();
    if (!this.is_logged_in) {
      this.router.navigate(['/home']);
    }
  }

  count: number;
  product_id;
  public people;
  public cart_in_item: Boolean = false;
  public place_order: Boolean = false;
  public tab_address: Boolean = false;
  public order_summery: Boolean = false;
  public payment_tab: Boolean = false;
  public confirm_order: Boolean = false;
  public address_save: Boolean = false;
  public edit_clilk: Boolean = false;
  public select_coupon: Boolean = false;
  public biling_address: Boolean = false;
  public wallet: Boolean = false;
  public cart_products;
  public cart_total: number;
  public defaultImg = environment.defaultImgUrl;
  addressForm: FormGroup;
  cardForm: FormGroup;
  submitted: Boolean = false;
  payment_submit: Boolean = false;
  order_status: Boolean = false;
  public address_list;
  public single_add;
  public promocode_dis = 0;
  public get_coupon;
  public coupon_name = '';
  public cart_qty;
  public coupon_id;
  public adress_select: any;
  public radioSelected: string;
  modalRef: BsModalRef;
  public setCouponStorage;
  public cards_list;
  public order_created = new Date();
  public card_res;
  public place_data;
  public card_datas;
  public booking_order;
  public default_adress;
  public wallet_data;
  public pay_total;
  public error;
  public title;
  public coupon_percent;
  public updatate_cart_products;

  ngOnInit() {
    if (this.is_logged_in) {
      if (localStorage.coupons) {
        let coupon_data = JSON.parse(localStorage.coupons);
        this.coupon_name = coupon_data.coupons_name;
        this.coupon_id = coupon_data.coupons_id;
        this.select_coupon = coupon_data.selects_coupon;
        this.promocode_dis = coupon_data.coupons_discount;
        this.coupon_percent = coupon_data.coupon_per;
      }
      this.get_cart_products();
    }
    this.addressForm = this.fb.group({
      'first_name': new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.customValidation.alpha_spaces), this.trimValidator, this.lengthValidator]),
      'last_name': new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.customValidation.alpha_spaces), this.trimValidator, this.lengthValidator]),
      'city': new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.customValidation.alpha_spaces), this.trimValidator, this.lengthValidator]),
      'user_address': new FormControl("", [Validators.required, Validators.minLength(2), this.trimValidator, this.lengthValidator]),
      // 'landmark': new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(this.customValidation.alpha_spaces), this.trimValidator, this.lengthValidator]),
      'landmark': new FormControl(""),
      'phone': new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(this.customValidation.numeric)]),
      'zip_code': new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(6), Validators.pattern(this.customValidation.numeric)]),
      'email': new FormControl("", [Validators.required, Validators.email, Validators.pattern(this.customValidation.email_pattern)]),
    })

    this.cardForm = this.fb.group({
      'number': new FormControl("", [Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern(this.customValidation.numeric)]),
      'expiry_month': new FormControl("", [Validators.required, Validators.maxLength(2), Validators.pattern(this.customValidation.numeric)]),
      'expiry_year': new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(this.customValidation.numeric)]),
      'cvc': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern(this.customValidation.numeric)]),
    })


    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  trimValidator: ValidatorFn = (control: FormControl) => {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  };

  lengthValidator: ValidatorFn = (control: FormControl) => {
    let lengthCheck = (control.value || '').trim().length < 2;
    let isValid = !lengthCheck;
    return isValid ? null : { 'lengthCheck': true }
  };

  orderModal(template: TemplateRef<any>, titles) {
    this.title = titles;
    this.coupon_list();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-big-shop' })
    );
  }

  @Input('shouldShow')
  public shouldShow: boolean = false;

  searchclick(value) {
    if (value == 'Search click') {
      this.shouldShow = !this.shouldShow;
    }
  }

  wallet_amounts() {
    this.profileService.wallet_amount()
      .subscribe(
        res => {
          this.wallet_data = res.wallet;
          if (this.wallet_data.amount > this.cart_total) {
            this.wallet = true;
            this.pay_total = 0;
          } else if (this.wallet_data.amount < this.cart_total) {
            this.pay_total = this.cart_total - this.wallet_data.amount;
            this.wallet = false;
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  continue_shopping() {
    this.router.navigate(['/store']);
  }

  coupon_list() {
    this.profileService.coupon_list()
      .subscribe(
        res => {
          this.get_coupon = res.coupons;
        },
        err => {
          console.log(err)
        }
      )
  }

  coupon_sel(coupon) {
    this.coupon_name = coupon.coupon_code;
    this.coupon_id = coupon.id;
    this.coupon_percent = coupon.discount_percentage;
  }

  apply_cupon() {
    this.select_coupon = true;
    this.promocode_dis = this.cart_total * this.coupon_percent / 100;
    this.cart_total = this.cart_total - this.promocode_dis;
    this.setCouponStorage = { 'coupons_id': this.coupon_id, 'coupons_name': this.coupon_name, 'selects_coupon': this.select_coupon, 'coupons_discount': this.promocode_dis, 'coupon_per': this.coupon_percent }
    localStorage.setItem('coupons', JSON.stringify(this.setCouponStorage))
    this.modalRef.hide();
  }

  remove_coupon() {
    localStorage.removeItem('coupons');
    this.select_coupon = false;
    this.coupon_name = '';
    this.cart_total = this.cart_total + this.promocode_dis;
  }

  default_add() {
    this.address_save = true;
    this.adressFormSubmit();
  }

  cardFormSubmit() {
    this.payment_submit = true;
    if (this.cardForm.valid) {
      this.card_datas = { 'card': this.cardForm.value }
      this.profileService.pay_payment(this.card_datas)
        .subscribe(
          res => {
            this.card_res = res;
            this.cardForm.reset();
            this.payment_submit = false;
            this.order_finalpay('card');
            this.nextTab('payment_tab');
          },
          err => {
            this.error = err.error.errors;
          }
        )
    }
  }

  order_finalpay(data) {
    if (data == 'wallet') {
      this.nextTab('payment_tab');
    }
    this.place_data = { 'address_params': { "address_id": this.default_adress.id }, 'payment_params': this.card_res != null ? { "card_id": this.card_res.card.id } : {}, 'coupon_params': this.coupon_id != null ? { "coupon_id": this.coupon_id } : {}, 'wallet_params': { "use_wallet_money": true } }
    this.profileService.order_payment(this.place_data)
      .subscribe(
        res => {
          this.order_status = true;
          this.booking_order = res.order;
          localStorage.removeItem('coupons');
          this.shared.store_clicked('cart_count');
        },
        err => {
          console.log(err);
        }
      )
  }

  save_cardlist() {
    this.profileService.card_list()
      .subscribe(
        res => {
          this.cards_list = res.cards;
        },
        err => {
          console.log(err)
        }
      )
  }

  adressFormSubmit() {
    this.submitted = true;
    if (this.addressForm.valid) {
      let address_data = { ...this.addressForm.value, default_address: true };
      this.profileService.create_addresses(address_data)
        .subscribe(
          res => {
            this.addressForm.reset();
            this.submitted = false;
            this.get_adresses();
          },
          err => {
            console.log(err);
          }
        )
    }
  }

  delete_address(id) {
    this.profileService.delete_address(id)
      .subscribe(
        res => {
          this.get_adresses();
        },
        err => {
          console.log(err)
        }
      )
  }

  edit_address(id, title) {
    this.edit_clilk = true;
    if (title == 'demo') {
      this.biling_address = true;
      this.edit_clilk = false;
    }
    this.profileService.single_address(id)
      .subscribe(
        res => {
          this.single_add = res.address;
          if (this.biling_address == false) {
            this.addressForm.patchValue({
              first_name: this.single_add.first_name,
              last_name: this.single_add.last_name,
              city: this.single_add.city,
              user_address: this.single_add.user_address,
              landmark: this.single_add.landmark,
              phone: this.single_add.phone,
              zip_code: this.single_add.zip_code,
              email: this.single_add.email
            });
          } else if (this.biling_address == true) {
            let edit_data = {
              first_name: this.single_add.first_name,
              last_name: this.single_add.last_name,
              city: this.single_add.city,
              user_address: this.single_add.user_address,
              landmark: this.single_add.landmark,
              phone: this.single_add.phone,
              zip_code: this.single_add.zip_code,
              email: this.single_add.email,
              default_address: true
            };
            this.profileService.edit_addresses(id, edit_data)
              .subscribe(
                res => {
                  this.biling_address = false;
                  this.get_adresses();
                }
              )
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  onEditSubmit(id) {
    this.submitted = true;
    if (this.addressForm.valid) {
      let edit_data = {
        default_address: true,
        "city": this.addressForm.controls.city.value.trim(),
        "landmark": this.addressForm.controls.landmark.value.trim(),
        "email": this.addressForm.controls.email.value.trim(),
        "first_name": this.addressForm.controls.first_name.value.trim(),
        "phone": this.addressForm.controls.phone.value.trim(),
        "user_address": this.addressForm.controls.user_address.value.trim(),
        "last_name": this.addressForm.controls.last_name.value.trim(),
        "zip_code": this.addressForm.controls.zip_code.value.trim(),
      };
      this.profileService.edit_addresses(id, edit_data)
        .subscribe(
          res => {
            this.addressForm.reset();
            this.submitted = false;
            this.get_adresses();
            this.edit_clilk = false;
          },
          err => {
            console.log(err)
          }
        )
    }
  }

  tabClick(tab_type: string = ''): void {
    if (tab_type == 'place_order') {
      this.place_order = false;
      this.tab_address = false;
      this.order_summery = false;
      this.payment_tab = false;
    } else if (tab_type == 'tab_address') {
      this.place_order = true;
      this.tab_address = false;
      this.order_summery = false;
      this.payment_tab = false;
    } else if (tab_type == 'order_summery') {
      this.place_order = true;
      this.tab_address = true;
      this.order_summery = false;
      this.payment_tab = false;
    } else if (tab_type == 'payment_tab') {
      this.place_order = true;
      this.tab_address = true;
      this.order_summery = true;
      this.payment_tab = false;
    }
  }

  nextTab(tab_type: string = ''): void {
    this.payment_submit = false;
    if (tab_type == 'place_order') {
      this.store.getCartProducts()
        .subscribe(
          res => {
            this.updatate_cart_products = res.carts;
            this.updatate_cart_products = this.updatate_cart_products.map(cart_item => {
              cart_item['units'] = cart_item['units'];
              return cart_item
            });
            if (JSON.stringify(this.updatate_cart_products) == JSON.stringify(this.cart_products)) {
              this.place_order = true;
              window.scroll(0, 0);
            } else {
              this.place_order = false;
              this.cart_products = '';
              this.cart_products = this.updatate_cart_products;
              let cart_price = 0;
              let cart_qtys = 0;
              for (let i = 0; i < this.cart_products.length; i++) {
                cart_qtys += this.cart_products[i].units
                cart_price += this.cart_products[i].product.final_price * this.cart_products[i].units;
              }
              this.cart_total = cart_price;
              // if (this.promocode_dis != 0) {
              //   this.promocode_dis = this.cart_total * this.coupon_percent / 100;
              //   this.setCouponStorage = { 'coupons_id': this.coupon_id, 'coupons_name': this.coupon_name, 'selects_coupon': this.select_coupon, 'coupons_discount': this.promocode_dis, 'coupon_per': this.coupon_percent }
              //   localStorage.setItem('coupons', JSON.stringify(this.setCouponStorage))
              //   this.cart_total = this.cart_total - this.promocode_dis;
              // }
              if (this.promocode_dis != 0) {
                localStorage.removeItem('coupons');
                this.select_coupon = false;
                this.coupon_name = '';
              }
              this.cart_qty = cart_qtys;
              this.toasterService.pop('success', 'Cart', 'Upadted Sucessfully');
            }
          },
          err => {
            console.log(err)
          }
        )
      this.get_adresses();
    } else if ((tab_type == 'tab_address') && (this.place_order == true)) {
      this.tab_address = true;
      window.scroll(0, 0);
      this.wallet_amounts();
    } else if ((tab_type == 'order_summery') && (this.place_order == true) && (this.tab_address == true)) {
      this.store.getCartProducts()
        .subscribe(
          res => {
            this.updatate_cart_products = res.carts;
            this.updatate_cart_products = this.updatate_cart_products.map(cart_item => {
              cart_item['units'] = cart_item['units'];
              return cart_item
            });
            if (JSON.stringify(this.updatate_cart_products) == JSON.stringify(this.cart_products)) {
              this.order_summery = true;
              window.scroll(0, 0);
            } else {
              this.cart_products = '';
              this.cart_products = this.updatate_cart_products;
              let cart_price = 0;
              let cart_qtys = 0;
              for (let i = 0; i < this.cart_products.length; i++) {
                cart_qtys += this.cart_products[i].units
                cart_price += this.cart_products[i].product.final_price * this.cart_products[i].units;
              }
              this.cart_total = cart_price;
              if (this.promocode_dis != 0) {
                localStorage.removeItem('coupons');
                this.select_coupon = false;
                this.coupon_name = '';
              }
              this.cart_qty = cart_qtys;
              this.order_summery = false;
              this.tab_address = false;
              this.place_order = false;
              window.scroll(0, 0);
              this.toasterService.pop('success', 'Cart', 'Upadted Sucessfully');
            }
          },
          err => {
            console.log(err)
          }
        )
    } else if ((tab_type == 'payment_tab') && (this.place_order == true) && (this.tab_address == true)) {
      this.store.getCartProducts()
        .subscribe(
          res => {
            this.updatate_cart_products = res.carts;
            this.updatate_cart_products = this.updatate_cart_products.map(cart_item => {
              cart_item['units'] = cart_item['units'];
              return cart_item
            });
            if (JSON.stringify(this.updatate_cart_products) == JSON.stringify(this.cart_products)) {
              this.payment_tab = true;
              this.place_order = false;
              this.tab_address = false;
              this.order_summery = false;
              window.scroll(0, 0);
            } else {
              this.cart_products = '';
              this.cart_products = this.updatate_cart_products;
              let cart_price = 0;
              let cart_qtys = 0;
              for (let i = 0; i < this.cart_products.length; i++) {
                cart_qtys += this.cart_products[i].units
                cart_price += this.cart_products[i].product.final_price * this.cart_products[i].units;
              }
              this.cart_total = cart_price;
              if (this.promocode_dis != 0) {
                localStorage.removeItem('coupons');
                this.select_coupon = false;
                this.coupon_name = '';
              }
              this.cart_qty = cart_qtys;
              this.order_summery = false;
              this.tab_address = false;
              this.place_order = false;
              this.payment_tab = false;
              window.scroll(0, 0);
              this.toasterService.pop('success', 'Cart', 'Upadted Sucessfully');
            }
          },
          err => {
            console.log(err)
          }
        )
    }
  }

  get_adresses() {
    this.profileService.addresses()
      .subscribe(
        res => {
          this.address_list = res.addresses;
          if (this.address_list.length) {
            this.radioSelected = res.addresses[0].id;
            this.adress_select = res.addresses[0];
          }
          this.default_adress = this.address_list.find(add => add.default_address == true) ? this.address_list.find(add => add.default_address == true) : [];
        },
        err => {
          console.log(err)
        }
      )
  }

  onItemChange(item) {
    this.radioSelected = item.id;
    this.adress_select = this.address_list.find(add => add.id === this.radioSelected);
  }

  get_cart_products(): void {
    this.store.getCartProducts()
      .subscribe(
        res => {
          this.cart_products = res.carts;
          this.cart_products = this.cart_products.map(cart_item => {
            cart_item['units'] = cart_item['units'];
            return cart_item
          });
          this.cart_in_item = true;
          let cart_price = 0;
          let cart_qtys = 0;
          for (let i = 0; i < this.cart_products.length; i++) {
            cart_qtys += this.cart_products[i].units
            cart_price += this.cart_products[i].product.final_price * this.cart_products[i].units;
          }
          this.cart_total = cart_price;
          if (this.promocode_dis != 0) {
            this.promocode_dis = this.cart_total * this.coupon_percent / 100;
            this.setCouponStorage = { 'coupons_id': this.coupon_id, 'coupons_name': this.coupon_name, 'selects_coupon': this.select_coupon, 'coupons_discount': this.promocode_dis, 'coupon_per': this.coupon_percent }
            localStorage.setItem('coupons', JSON.stringify(this.setCouponStorage))
            this.cart_total = this.cart_total - this.promocode_dis;
          }
          this.cart_qty = cart_qtys;
        },
        err => {
          console.log(err)
        }
      )
  }

  imgErrorHandler(event): void {
    event.target.src = this.defaultImg
  }

  removeItem(productId) {
    let product_id = { 'product_id': productId }
    this.store.removeToCart(product_id)
      .subscribe(
        res => {
          this.toasterService.pop('success', 'Product', 'Remove From Cart');
          this.router.navigate(['/cart'])
          this.get_cart_products();
          this.shared.store_clicked('cart_count');
        },
        err => {
          console.log(err)
        }
      )
  }

  plus_qty(productId): void {
    let product_id = { 'product_id': productId };
    this.store.addToCart(product_id)
      .subscribe(
        res => {
          if (res) {
            this.get_cart_products();
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  minus_qty(productId) {
    let product_id = { 'product_id': productId };
    this.store.qty_minus(product_id)
      .subscribe(
        res => {
          this.get_cart_products();
        },
        err => {
          console.log(err)
        }
      )
  }

  updatecart(productId, numberQty) {
    this.disable_flag = null;
    let udate_cart_data = {};
    udate_cart_data = { product_id: productId, quantity: numberQty };
    this.store.updateToCart(udate_cart_data)
      .subscribe(
        res => {
          this.toasterService.pop('success', 'Cart Product', 'Upadted Sucessfully');
          this.get_cart_products();
          this.shared.store_clicked('cart_count');
        },
        err => {
          console.log(err)
        }
      )
  }
  public disable_flag;
  increment(index: number) {
    this.cart_products[index].units += 1;
    this.disable_flag = index;
  }

  decrement(index: number) {
    this.cart_products[index].units -= 1;
    this.disable_flag = index;
  }
  seeProductDetails(product_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/productdetails', btoa(product_id)])
  }

  onChange(e) {

  }

}

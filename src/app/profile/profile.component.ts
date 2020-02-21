import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxCarousel } from 'ngx-carousel';
import { DragScrollComponent } from 'ngx-drag-scroll/lib';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { trigger, state, animate, transition, style } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { environment } from './../../environments/environment';
import { NguiMapComponent } from '@ngui/map';
import { SharedService } from '../services/shared.service';
import { PostDetailsService } from '../services/postDetails.service';
import { StoreService } from '../services/store.service';
import { ProductDetailsService } from './../services/productDetails.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { LoginService } from '../services/login.service';
import { SeosearchService } from '../services/seosearch.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MouseEvent } from '@agm/core';
import { CustomValidation } from '../helper/customValidation';
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

export class Animations {
  public static slideInOut = trigger('slideInOut', [
    state('true', style({ height: '90px' })),
    state('false', style({ height: '300px' })),
    transition('1 => 0', animate('500ms ease-in')),
    transition('0 => 1', animate('500ms ease-out'))
  ]);
}
//  Default options
var options = {
  animationDuration: 0.5, // in seconds
  filter: 'all', // Initial filter
  callbacks: {
    onFilteringStart: function () { },
    onFilteringEnd: function () { },
    onShufflingStart: function () { },
    onShufflingEnd: function () { },
    onSortingStart: function () { },
    onSortingEnd: function () { }
  },
  controlsSelector: '', // Selector for custom controls
  delay: 0, // Transition delay in ms
  delayMode: 'progressive', // 'progressive' or 'alternate'
  easing: 'ease-out',
  filterOutCss: { // Filtering out animation
    opacity: 0,
    transform: 'scale(0.5)'
  },
  filterInCss: { // Filtering in animation
    opacity: 0,
    transform: 'scale(1)'
  },
  layout: 'sameSize', // See layouts
  multifilterLogicalOperator: 'or',
  selector: '.filtr-container',
  setupControls: true // Should be false if controlsSelector is set 
}

@Component({
  templateUrl: 'profile.component.html',
  animations: [Animations.slideInOut, trigger('fadeInOutTranslate', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate(300, style({ opacity: 1 }))
    ]),
    transition(':leave', [
      style({ transform: 'translate(0)' }),
      animate(300, style({ opacity: 0 }))
    ])
  ])],
})

export class ProfileComponent implements OnInit {
  zoom: number = 8;
  res3;
  str1;
  max = 5;
  rate = 0;
  isReadonly = true;
  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  markers: marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: true
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: 'B',
      draggable: false
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: 'C',
      draggable: true
    }
  ]
  private toasterService: ToasterService;
  public config: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: false,
      timeout: 3000
    });
  @ViewChild(NguiMapComponent) nguiMapComponent: NguiMapComponent;
  map: any;
  public hfbankheader: boolean = false;
  public is_logged_in: Boolean = false;
  images = [];
  public Order_title;
  public Order_detail;
  public product;
  public submitted: Boolean = false;
  public claim_submitted: Boolean = false;
  public send: Boolean = false;
  public comment_popup: Boolean = false;
  public showssed: Boolean = false;
  public userPosts;
  public userLikePosts;
  //model popup
  constructor(private router: Router,
    private modalService: BsModalService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    public shared: SharedService,
    public fb: FormBuilder,
    public postService: PostDetailsService,
    public login: LoginService,
    toasterService: ToasterService,
    private storeService: StoreService,
    private prodService: ProductDetailsService,
    private seo: SeosearchService,
    public customValidation: CustomValidation
  ) {
    this.toasterService = toasterService;
    this.is_logged_in = login.loggedIn();
    this.collapsed = true;
  }

  //model popup
  modalRef: BsModalRef;
  public product_data;
  openModal(template: TemplateRef<any>, product) {
    this.submitted = false;
    this.claimForm.reset();
    this.claim_submitted = false;
    this.count = 1;
    this.product_data = product;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-big-shop' })
    );
  }

  requestModal(template: TemplateRef<any>) {
    this.deposite_money();
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }
  onMapReady(map) {
    this.map = map;
  }
  count: number = 1;
  increment() {
    this.count++;
  }
  decrement() {
    this.count--;
  }
  public defaultProfileImg = environment.profImgUrl;
  public profile_image = environment.cloud_url;
  public defaultProdImg = environment.defaultImgUrl;
  public collapsed: boolean;
  public user_datas = JSON.parse(localStorage.getItem('user_data'))
  public carouselTile: NgxCarousel;
  public shouldShow: boolean = false;
  public chat_screen: boolean = false;
  public single_user_conversation;
  public message: string;
  public place_message: string;
  public maxSize: number;
  public bigTotalItems: number;
  public bigCurrentPage: number;
  public pastOrder: Array<any>;
  public placeOrder: Array<any>;
  public img_uploaded;
  public wallet_transfer;

  public isCollapsed(): boolean {
    return this.collapsed;
  }
  public setCollapsed(): void {
    this.collapsed = false;
  }

  public toggleMenu(): void {
    this.collapsed = !this.collapsed;

  }

  // tag drag slider
  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;
  @ViewChild('nav1', { read: DragScrollComponent }) ds1: DragScrollComponent;
  // moveLeft() {
  //   this.ds.moveLeft();
  // }
  moveRight() {
    this.ds.moveRight();
  }
  moveRight1() {
    this.ds1.moveRight();
  }
  log(event, str) {
    if (event instanceof MouseEvent) {
      return false;
    }
  }

  public carouselOne: NgxCarousel;
  public carouselTwo: NgxCarousel;
  public user_id;
  public user_data;
  public folios;
  public userFollow;
  public fav_posts;
  public list_certificate = [];
  public users_address;
  public totalCount: number;
  public page: number = 1;
  public limit: number = 4;
  public commision_page: number = 1;
  public commision_limit: number = 5;
  public delivered_page: number = 1;
  public delivered_limit: number = 4;
  public delivered_totalCount: number;
  public bank_page: number = 1;
  public bank_limit: number = 4;
  public bank_totalCount: number;
  public login_id;
  public user_profile;
  public service_list = [];
  public userLikePost;
  public follow_status;
  public follow_count;
  public list_message;
  public commision_list;
  public deposite_list;
  public commentSend: FormGroup;
  public list_comments: any;
  public comments_count: any;
  public user_notification: any;
  public conversation_id;
  public conversation_user;
  public single_conversation_id;
  public message_user;
  public receiver_id;
  public wallet_data;
  public email_error;
  claimForm: FormGroup;
  public convation_lists: Array<any>;
  public post_page: number = 1;
  public post_limit: number = 5;
  public salon_param: number = 0;
  public salon_screen: boolean = false;

  ngOnInit() {
    this.route.params.subscribe((param) => {
    window.scroll(0, 0);
      this.salon_param = 0;
      this.user_id = atob(param.user_id);
      this.route.queryParams.subscribe((queryParam) => {
        this.salon_param = Object.keys(queryParam).length;
      })
      if (this.salon_param == 0) {
        this.salon_screen = false;
        this.getUserBYid(this.user_id);
        this.getUserBYid_post(this.user_id, 'user_posts');
        this.getUserBYid_post(this.user_id, 'fav_posts');
      } else {
        this.salon_screen = true;
        this.getSalonBYid(this.user_id);
      }
    })

    this.shared.listen().subscribe((m: any) => {
      this.searchclick(m);
    })
    this.carouselTile = {
      grid: { xs: 1, sm: 2, md: 3, lg: 3, all: 0 },
      slide: 3,
      speed: 1500,
      // animation: 'lazy',
      interval: 1500,
      point: {
        visible: false,
        //pointStyles: ""
      },
      load: 2,
      touch: true,
      // easing: 'ease'
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
      loop: true,
      touch: true
    }
    this.carouselTwo = {
      grid: { xs: 1, sm: 2, md: 3, lg: 4, all: 0 },
      slide: 1,
      speed: 500,
      interval: 4000,
      point: {
        visible: false,
      },
      load: 1,
      loop: false,
      touch: true
    }
    this.claimForm = this.fb.group({
      'contact_number': new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(this.customValidation.numeric_specialchar)]),
      'email': new FormControl("", [Validators.required, Validators.email, Validators.pattern(this.customValidation.email_pattern)]),
    })

    if (this.is_logged_in) {
      this.login_id = this.user_datas[0].token;
    }
    this.commentSend = this.fb.group({
      'body': new FormControl("", Validators.required)
    })
  }

  public comment_daatasd;
  message_upload(data, con_id, body) {
    this.img_uploaded = '';
    this.comment_daatasd = '';
    if (data[0].type.slice(0, 5) == 'image' && data[0].name != null) {
      let formData = new FormData();
      formData.append("uploader[folder_name]", "message");
      formData.append("uploader[image_url]", data[0], data[0].name);
      this.login.imageupload(formData).subscribe(res => {
        this.img_uploaded = res.image_url.url;
        this.comment_daatasd = { message: { body: "", photo_asset_url: this.img_uploaded } }
        this.profileService.post_message(con_id, this.comment_daatasd)
          .subscribe(
            res => {
              if (body == 'single') {
                this.img_uploaded = '';
                this.comment_daatasd = '';
                this.get_message(con_id);
              }
              if (body == 'multiple') {
                this.img_uploaded = '';
                this.comment_daatasd = '';
                this.single_conversation(con_id);
              }
            }, err => {
              console.log('err: ', err);
            }
          )
      }, error => {
        console.log("error", error);
      });
    } else if (data[0].type.slice(0, 5) == 'video') {
      let formData = new FormData();
      formData.append("uploader[folder_name]", "message");
      formData.append("uploader[video_url]", data[0], data[0].name);
      this.login.videoupload(formData).subscribe(res => {
        this.img_uploaded = res.video_url.url;
        this.comment_daatasd = { message: { body: "", video_asset_url: this.img_uploaded } }
        this.profileService.post_message(con_id, this.comment_daatasd)
          .subscribe(
            res => {
              if (body == 'single') {
                this.img_uploaded = '';
                this.comment_daatasd = '';
                this.get_message(con_id);
              }
              if (body == 'multiple') {
                this.img_uploaded = '';
                this.comment_daatasd = '';
                this.single_conversation(con_id);
              }
            }, err => {
              console.log('err: ', err);
            }
          )
      }, error => {
        console.log("error", error);
      });
    }
  }

  orderModal(template: TemplateRef<any>, product, title) {
    if (title == 'comment') {
      this.comment_popup = true;
      this.submitted = false;
      this.comments(product);
    } if (title == 'message') {
      this.comment_popup = true;
      this.send = false;
      this.create_convertionid(product);
    } if (title == 'user_notification') {
      this.userNotifications();
    } if (title == 'user_message') {
      this.conversation_list();
    } this.product = product;
    this.Order_title = title;
    this.Order_detail = product.order_details;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-big-shop' })
    );
  }

  conversation_list() {
    this.send = false;
    this.chat_screen = false;
    this.profileService.user_conversation()
      .subscribe(
        res => {
          this.conversation_user = res.conversations;
          let convation_list = [];
          if (this.conversation_user.length) {
            for (let i = 0; i < this.conversation_user.length; i++) {
              let user = [];
              let chat_list = {
                body: this.conversation_user[i].last_message ? this.conversation_user[i].last_message : '',
                created_at: this.conversation_user[i].last_message ? this.conversation_user[i].last_message.created_at : '',
                conversation_id: this.conversation_user[i].last_message ? this.conversation_user[i].last_message.conversation_id : '',
                user: []
              }
              if (this.conversation_user[i].recipients.length) {
                for (let list_user of this.conversation_user[i].recipients) {
                  if (list_user.id != this.login_id) {
                    user.push(list_user);
                  }
                }
                chat_list.user = user
              }
              convation_list.push(chat_list);
            }
            this.convation_lists = convation_list;
          } else {
            this.convation_lists = convation_list;
          }
        },
        err => {
          console.log(err)
        }
      )
  }
  deposite_money() {
    this.profileService.depositemoney()
      .subscribe(
        res => {
          this.wallet_transfer = res;
        },
        err => {
          console.log(err)
        }
      )
  }

  decline() {
    this.modalRef.hide();
  }

  goToProfile(user_id) {
    if (this.comment_popup == true) {
      this.modalRef.hide();
    }
    this.router.navigate(['/profile', btoa(user_id)]);
  }
  salonProfile(user_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/profile', btoa(user_id)],{ queryParams: { salon_title: 'salons' } });
  }

  wallet_amounts() {
    this.profileService.wallet_amount()
      .subscribe(
        res => {
          this.wallet_data = res;
        },
        err => {
          console.log(err)
        }
      )
  }

  single_conversation(conversation_id) {
    this.single_conversation_id = conversation_id;
    this.chat_screen = true;
    this.profileService.single_conversation(conversation_id)
      .subscribe(
        res => {
          let messages = res.messages;
          messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          this.single_user_conversation = messages;
        },
        err => {
          console.log(err)
        }
      )
  }
  main_chatscreen() {
    this.chat_screen = false;
  }
  comments(post_id) {
    this.profileService.get_Comments(post_id)
      .subscribe(
        res => {
          let comments = res.comments;
          comments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          this.list_comments = comments;
          this.comments_count = res.meta.total_count;
        },
        err => {
          console.log(err)
        }
      )
  }

  create_convertionid(user_id) {
    this.receiver_id = user_id;
    let data = { "sender": this.login_id, "conversation": { "sender_id": this.login_id, "recipient_ids": [user_id, this.login_id] } }
    this.profileService.create_conversationid(data)
      .subscribe(
        res => {
          this.conversation_id = res.conversation.id;
          this.get_message(res.conversation.id);
        }, err => {
          console.log('err: ', err);
        }
      )
  }

  getUserBYid_post(id, data) {
    if (data == 'user_posts') {
      this.profileService.userPosts(id, this.post_page, this.post_limit)
        .subscribe(
          res => {
            this.userPosts = res.posts;
          },
          err => {
            console.log(err)
          }
        )
    } else if (data == 'fav_posts') {
      this.profileService.userFavPosts(id, this.post_page, this.post_limit)
        .subscribe(
          res => {
            this.userLikePosts = res.likes;
          },
          err => {
            console.log(err)
          }
        )
    }

  }

  get_message(coversation_id) {
    this.profileService.get_message(coversation_id)
      .subscribe(
        res => {
          let messages = res.messages;
          messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          this.list_message = messages;
        }, err => {
          console.log('err: ', err);
        }
      )
  }

  claimFormSubmit() {
    this.claim_submitted = true;
    if (this.claimForm.valid) {
      let claim_data = { claim: { ...this.claimForm.value, salon_id: this.user_data.id } };
      this.profileService.claim_salons(claim_data)
        .subscribe(
          res => {
            this.modalRef.hide()
            this.toasterService.pop('info', 'Salon Claim sucessfully watting for admin approval ', '');
            this.claimForm.reset();
            this.claim_submitted = false;
          },
          err => {
            this.email_error = err.error.errors[0];
          }
        )
    }
  }

  messageFormSubmit(conversation, body) {
    let conv_id = conversation;
    this.send = true;
    if (this.commentSend.valid) {
      this.profileService.post_message(conv_id, this.commentSend.value)
        .subscribe(
          res => {
            if (body == 'single') {
              this.img_uploaded = '';
              this.get_message(conv_id);
            }
            if (body == 'multiple') {
              this.img_uploaded = '';
              this.single_conversation(conv_id);
            }
            this.commentSend.reset();
            this.send = false;
          }, err => {
            console.log('err: ', err);
          }
        )
    }
  }

  commentFormSubmit() {
    this.submitted = true;
    if (this.commentSend.valid) {
      this.profileService.post_Comment(this.product, this.commentSend.value)
        .subscribe(
          res => {
            this.comments(this.product);
            this.commentSend.reset();
            this.submitted = false;
          }, err => {
            console.log('err: ', err);
          }
        )
    }
  }

  hfbankclilk() {
    this.hfbankheader = !this.hfbankheader;
    if (this.hfbankheader == true) {
      this.wallet_amounts();
      this.wallet_commision_list(this.commision_page, this.commision_limit);
      this.money_deposite_list(this.bank_page, this.bank_limit);
    }
  }

  getUserBYid(userID) {
    this.profileService.getUser(userID)
      .subscribe(
        res => {
          this.user_profile = res.user.avatar_cloudinary_id;
          // this.comments_count = res.meta.total_count;
          this.follow_status = res.user.is_followed_by_me;
          this.follow_count = res.user.followers_count;
          this.user_data = res.user;
          this.service_list = this.user_data.offerings;
          for (let i = 0, chunk = 5; i < this.user_data.certificates.length; i += chunk) {
            this.list_certificate.push(this.user_data.certificates.slice(i, i + chunk))
          }
        },
        err => {
          console.log(err)
        }
      )
  }
  // split_url(url){
  //     var str = url;//"https://www.yelp.com/biz_redir?url=http%3A%2F%2Fwww.doordyehairsalonpace.com&website_link_type=website&src_bizid=h_UyqtYwiaIeu2hrJ9wsbg&cachebuster=1558345146&s=53feb4811e8d1d456200526a08a3227fcb52746ff53638a206f838698b2688be";
  //     var res = str.split("url=");
  //     var res2 = res[1];
  //     this.res3 = res2.split("&");
  //     var temp = decodeURIComponent(this.res3[0]);
  //     this.res3[0] = temp;

  //   // return res3[0];
  // }

  getSalonBYid(userID) {
    this.profileService.getSalon(userID)
      .subscribe(
        res => {
          this.service_list = [];
          this.list_certificate = [];
          this.user_data = res.salon;
          if(this.user_data.website != '' ){
            this.str1 = this.user_data.website;
            if(this.str1.indexOf("url=")  != -1){
            //"https://www.yelp.com/biz_redir?url=http%3A%2F%2Fwww.doordyehairsalonpace.com&website_link_type=website&src_bizid=h_UyqtYwiaIeu2hrJ9wsbg&cachebuster=1558345146&s=53feb4811e8d1d456200526a08a3227fcb52746ff53638a206f838698b2688be";
            var res11 = this.str1.split("url=");
            var res2 = res11[1];
            this.res3 = res2.split("&");
            var temp = decodeURIComponent(this.res3[0]);
            this.str1 = temp;
            }
            // this.res3[0] = temp;
          }
          this.rate = this.user_data.rating;
          if (this.user_data.owner != null) {
            this.follow_status = this.user_data.owner.is_followed_by_me;
            this.follow_count =this.user_data.owner.followers_count;
            this.user_id = this.user_data.owner.id;
            this.getUserBYid_post(this.user_id, 'user_posts');
            this.getUserBYid_post(this.user_id, 'fav_posts');
            this.service_list = this.user_data.owner.offerings;
            for (let i = 0, chunk = 5; i < this.user_data.owner.certificates.length; i += chunk) {
              this.list_certificate.push(this.user_data.owner.certificates.slice(i, i + chunk))
            }
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  notlogin() {
    this.toasterService.pop('error', 'User Not Logged In', '');
    this.shared.store_clicked('stared_clilk');
  }

  // getFolios() {
  //   this.profileService.getFolios()
  //     .subscribe(
  //       res => {
  //         this.folios = res.folios;
  //       },
  //       err => {
  //         console.log(err)
  //       }
  //     )
  // }

  userNotifications() {
    this.profileService.userNotification()
      .subscribe(
        res => {
          this.user_notification = res.push_notifications;
        },
        err => {
          console.log(err)
        }
      )
  }

  followingYou() {
    this.profileService.followingYou()
      .subscribe(
        res => {
          this.userFollow = res.notifications;
        },
        err => {
          console.log(err)
        }
      )
  }

  likeyourpost() {
    this.profileService.likeYourPost()
      .subscribe(
        res => {
          this.userLikePost = res.notifications;
        },
        err => {
          console.log(err)
        }
      )
  }

  wallet_commision_list(page, limit) {
    this.profileService.wallet_commision(page, limit)
      .subscribe(
        res => {
          this.commision_list = res.wallet_commission_lists;
          this.commision_page = res.meta.current_page;
          this.totalCount = res.meta.total_count;
        },
        err => {
          console.log(err)
        }
      )
  }

  money_deposite_list(page, limit) {
    this.profileService.bank_commision(page, limit)
      .subscribe(
        res => {
          this.deposite_list = res.wallet_payment_transaction_histories;
          this.bank_page = res.meta.current_page;
          this.bank_totalCount = res.meta.total_count;
        },
        err => {
          console.log(err)
        }
      )
  }

  FollowsNewUser(usr_id) {
    this.profileService.FollowingUser(usr_id)
      .subscribe(
        res => {
          this.follow_status = true;
          this.follow_count = this.follow_count + 1;
        },
        err => {
          console.log(err)
        }
      )
  }
  imgErrorHandlers(event): void {
    event.target.src = 'assets/images/postdetail/postpic/subpic1.jpg';
  }
  removeUserFollowing(usr_id) {
    this.profileService.removeUserFollows(usr_id)
      .subscribe(
        res => {
          this.follow_status = false;
          this.follow_count = this.follow_count - 1;
        },
        err => {
          console.log(err)
        }
      )
  }

  toggleFollowing(id) {
    // Follow this profile if we aren't already
    if (!this.follow_status) {
      this.follow_status = true;
      this.profileService.FollowingUser(id)
        .subscribe(
          res => {
            this.follow_count = this.follow_count + 1;
          },
          err => {
            console.log(err);
          }
        )
      // Otherwise, unfollow this profile
    } else {
      this.follow_status = false;
      this.profileService.removeUserFollows(id)
        .subscribe(
          res => {
            this.follow_count = this.follow_count - 1;
          },
          err => {
            console.log(err);
          }
        )
    }
  }
  seeProductDetails_screen(e, product_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/productdetails', btoa(product_id)])
  }

  pastplaceorder(status: string, page: number, limit: number) {
    this.profileService.pastOrder(status, page, limit)
      .subscribe(
        res => {
          if (status == "pending") {
            this.pastOrder = res.orders;
            this.page = res.meta.current_page;
            this.totalCount = res.meta.total_count;
          } else {
            this.placeOrder = res.orders;
            this.delivered_page = res.meta.current_page;
            this.delivered_totalCount = res.meta.total_count;
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  pageChanged(event: PageChangedEvent, status: string): void {
    this.pastplaceorder(status, event.page, event.itemsPerPage);
  }

  pageComission(event: PageChangedEvent, status: string): void {
    this.wallet_commision_list(event.page, event.itemsPerPage);
  }

  pageComission_bank(event: PageChangedEvent, status: string): void {
    this.money_deposite_list(event.page, event.itemsPerPage);
  }

  imgErrorHandler(event): void {
    event.target.src = this.defaultProfileImg
  }

  productimgHandler(event): void {
    event.target.src = this.defaultProdImg
  }

  deposite_bank() {
    this.modalRef.hide();
    this.shared.store_clicked('product_details');
    this.router.navigate(['/depositebank'], { queryParams: { banksname: btoa(this.wallet_transfer.amount) } });
  }

  seeProductDetails(e, product_id) {
    this.shared.store_clicked('product_details');
    this.modalRef.hide();
    this.router.navigate(['/productdetails', btoa(product_id)])
  }
  ProductDetails(e, product_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/productdetails', btoa(product_id)])
  }
  moreDetails(product_id, product_name) {
    this.router.navigate(['/productdetails', btoa(product_id)], { queryParams: { postname: btoa(product_name) } })
  }
  postDetails(post_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/postdetails', post_id]);
  }
  edit_claimdetais(claim_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/editclaimdetail', claim_id]);
  }
  searchclick(value) {
    if (value == 'Search click') {
      this.shouldShow = !this.shouldShow;
    }
  }
  getPostByTypes(post_type = '') {
    let user_id = this.user_id;
    if (post_type == 'favourites') {
      this.postService.getPostsByType(post_type, user_id)
        .subscribe(
          fav => {
            this.fav_posts = fav.favourites;
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

  pagescroll(post_name, title?, posts_id?) {
    this.shared.store_clicked('product_details');
    if (post_name == 'User_post') {
      this.router.navigate(['/postlist'], { queryParams: { post_list: btoa(post_name), tag_id: this.user_id, tag_name: title } })
    } else if (post_name == 'Favorite_post') {
      this.router.navigate(['/postlist'], { queryParams: { post_list: btoa(post_name), tag_id: this.user_id, tag_name: title } })
    }
  }

  likepost(post_id, data) {
    this.postService.likePost(post_id)
      .subscribe(
        res => {
          if (data == 'user_posts') {
            this.getUserBYid_post(this.user_id, 'user_posts');
          } else if (data == 'fav_posts') {
            this.getUserBYid_post(this.user_id, 'fav_posts');
          }
          this.toasterService.pop('info', 'Post', 'Add To Favourite');
        },
        err => {
          console.log(err)
        }
      )
  }

  unlikepost(post_id, data) {
    this.postService.unLikePost(post_id)
      .subscribe(
        res => {
          if (data == 'user_posts') {
            this.getUserBYid_post(this.user_id, 'user_posts');
          } else if (data == 'fav_posts') {
            this.getUserBYid_post(this.user_id, 'fav_posts');
          }
          this.toasterService.pop('info', 'Post', 'Remove To Favourite');
        },
        err => {
          console.log(err)
        }
      )
  }
  //remove fav product
  removeFavourite(productId) {
    this.prodService.removefavourites(productId)
      .subscribe(
        res => {
          this.getPostByTypes("favourites");
          this.toasterService.pop('info', 'Product', 'Removed From Wishlist');
        },
        err => {
          console.log(err)
        }
      )
  }
}

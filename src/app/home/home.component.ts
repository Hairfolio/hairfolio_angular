import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';
import { HomeService } from './../services/home.service';
import { SharedService } from '../services/shared.service';
import { environment } from './../../environments/environment';
import { DragScrollComponent } from 'ngx-drag-scroll/lib';
import { LoginService } from '../services/login.service';
import { PostDetailsService } from '../services/postDetails.service';
import { SeosearchService } from '../services/seosearch.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ProfileService } from '../services/profile.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ShareButtons } from '@ngx-share/core';
import { Subscription } from 'rxjs';
import { FEED_SEARCH_TYPE } from '../shared/define';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  templateUrl: 'home.component.html',
  host: {
    '(window:scroll)': 'onScroll($event)'
  }
})

export class HomeComponent implements OnInit {
  public profile_image = environment.cloud_url;
  public user_profile;
  public list_comments: any;
  public product_page: number = 1;
  public product_limit: number = 12;
  public product_totalCount: number;
  postSearchSubscriber: Subscription;
  searchBoxSubscriber: Subscription;
  private toasterService: ToasterService;
  public config: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: false,
      timeout: 3000
    });
  public is_logged_in: Boolean = false;
  public carouselTileItems = [];
  public carouselTile: NgxCarousel;
  public products = [];
  public tags = [];
  public title1;
  public title2;
  public title3;
  public tag_id: any = 'all';
  public posts = [];
  public trendingposts = [];
  public editorpicsposts = [];
  public all_posts = [];
  public defaultImg = environment.defaultImgUrl;
  public add_class: Boolean = false;
  public tag_post: Boolean = false;
  public posted: string;
  public tag_page = 1;
  public profileImg = environment.profImgUrl;
  public tag_posts;
  public stylist_prof;
  public search_title;
  public tag_titles;
  public tags_scroll;
  feed_list: any;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: BsModalService,
    toasterService: ToasterService,
    public share: ShareButtons,
    private route: ActivatedRoute, private profileService: ProfileService, public fb: FormBuilder, public homeService: HomeService, private seo: SeosearchService, public postDetailsService: PostDetailsService, public login: LoginService, public shared: SharedService) {
    this.shared.listen().subscribe((m: any) => {
      this.searchclick(m);
    })
    this.toasterService = toasterService;
    this.is_logged_in = login.loggedIn();
  }

  // tag drag slider
  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
    if (this.ds.scrollReachesRightEnd) {
      this.homeService.getTags(this.tag_page)
        .subscribe(
          res => {
            let gfghh = res.tags;
            Array.prototype.push.apply(this.tags_scroll, gfghh);
            this.tag_page = this.tag_page + 1;
            this.ds.moveLeft();
          },
          err => {
            this.toasterService.pop('error', '404 Not Found', '');
          }
        )
    }
  }

  moveRights() {
    this.ds.moveRight();
  }

  log(event, str) {
    if (event instanceof MouseEvent) {
      return false;
    }
  }
  modalRef: BsModalRef;
  comment_popup: Boolean = false;
  search_box: Boolean = false;
  submitted: Boolean = false;
  tag_searches: Boolean = false;
  salon_searches: Boolean = false;
  page_change_value: Boolean = false;
  public product: any;
  public commentSend: FormGroup;
  public search_data;
  public search_type;
  public tag_name = 'demo';
  public lat = 23.01952;
  public long = 72.5475328;
  public show_loader: Boolean = false;
  public count_scroll_window = null;
  openModal(template: TemplateRef<any>, productDetails) {
    this.comment_popup = true;
    this.submitted = false;
    this.comments(productDetails);
    this.product = productDetails;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-big' })
    );
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.add_class = false;
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
    });
    this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    this.carouselTile = {
      grid: { xs: 1, sm: 2, md: 3, lg: 4, all: 0 },
      slide: 4,
      speed: 1500,
      animation: 'lazy',
      interval: 1500,
      point: {
        visible: false,
        pointStyles: ""
      },
      load: 2,
      touch: true,
      easing: 'ease'
    }

    this.homeService.requestDataFromMultipleSources(this.tag_page, this.lat, this.long).subscribe(responseList => {
      this.tags_scroll = responseList[0].tags;
      this.firstlist = responseList[1].homepage;
      this.stylist_prof = responseList[2].users;
      this.secondlist = responseList[3].homepage;

      this.title3 = "Stylist Near Me";
      this.tag_page = this.tag_page + 1;
    });

    this.commentSend = this.fb.group({
      'body': new FormControl("", Validators.required)
    })

    this.postSearchSubscriber = this.shared.currentFeedSearchVal.subscribe(searchVal => {
      if (searchVal.searchValue == '') {
        this.search_box = false;
      } else {
        // this.count_scroll_window = 901;
        this.feed_list = [];
        this.product_page = 1;
        this.product_limit = 12;
        this.search_data = searchVal.searchValue;
        this.search_type = searchVal.searchType;
        this.search_box = true;
        this.show_loader = false;
        if (searchVal.searchType == FEED_SEARCH_TYPE[3]) { // tag type 
          this.salon_searches = false;
          this.search_title = 'Tags';
          this.gettags(searchVal.searchValue, this.product_page, this.product_limit);
        } else if (searchVal.searchType == FEED_SEARCH_TYPE[2]) { // barnd type
          this.search_title = 'Brand Profile';
          this.salon_searches = false;
          this.tag_searches = false;
          this.getBrands(searchVal.searchValue, this.product_page, this.product_limit);
        } else if (searchVal.searchType == FEED_SEARCH_TYPE[1]) { // salon type
          this.search_title = 'Salon Profile';
          this.tag_searches = false;
          this.getSalons(searchVal.searchValue, this.product_page, this.product_limit);
        } else { // default hair style list get for search
          this.search_title = 'Hair Stylist Profile';
          this.salon_searches = false;
          this.tag_searches = false;
          this.getHairStylish(searchVal.searchValue, this.product_page, this.product_limit);
        }

      }
    });
  }

  onScroll(evt) {//window object can be wrapper in a service but for now we directly use it
    // this.count_scroll_window = 901;
    if (this.search_data != '') {
      let fuhuh = this.count_scroll_window == null ? 901 : this.count_scroll_window;
      if (window.pageYOffset >= fuhuh) {
        this.show_loader = true;
        this.product_page += 1;
        if (this.search_type == FEED_SEARCH_TYPE[3]) {
          // tag type 
          this.search_title = 'Tags';
          this.salon_searches = false;
          this.page_change_value = true;
          this.tag_searches = true;
          this.homeService.getTagList(this.search_data, this.product_page, this.product_limit).subscribe(res => {
            let store_scroll_number = res.posts;
            Array.prototype.push.apply(this.feed_list, store_scroll_number);
            this.show_loader = false;
            this.product_page = res.meta.current_page;
            this.product_totalCount = res.meta.total_count;
            this.page_change_value = false;
          }, error => {
            console.log("error", error);
            this.show_loader = false;
          });
        } else if (this.search_type == FEED_SEARCH_TYPE[2]) {
          // barnd type
          this.salon_searches = false;
          this.search_title = 'Brand Profile';
          this.tag_searches = false;
          this.page_change_value = true;
          this.homeService.getBrandList(this.search_data, this.product_page, this.product_limit).subscribe(res => {
            let store_scroll_number = res.users;
            Array.prototype.push.apply(this.feed_list, store_scroll_number);
            this.show_loader = false;
            this.product_page = res.meta.current_page;
            this.product_totalCount = res.meta.total_count;
            this.page_change_value = false;
          }, error => {
            console.log("error", error);
            this.show_loader = false;
          });
        } else if (this.search_type == FEED_SEARCH_TYPE[1]) {
          // salon type
          this.search_title = 'Salon Profile';
          this.tag_searches = false;
          this.salon_searches = true;
          this.page_change_value = true;
          this.homeService.getSalonsLists(this.search_data, this.product_page, this.product_limit).subscribe(res => {
            let store_scroll_number = res.salons;
            Array.prototype.push.apply(this.feed_list, store_scroll_number);
            this.show_loader = false;
            this.product_page = res.meta.current_page;
            this.product_totalCount = res.meta.total_count;
            this.page_change_value = false;
          }, error => {
            console.log("error", error);
            this.show_loader = false;
          });
        } else if (this.search_type == FEED_SEARCH_TYPE[0]) { // default hair style list get for search
          // this.show_loader = true;
          this.search_title = 'Hair Stylist Profile';
          this.salon_searches = false;
          this.tag_searches = false;
          this.page_change_value = true;
          this.title3 = "Stylist Near Me";
          this.homeService.gethairStyleList(this.search_data, this.product_page, this.product_limit).subscribe(res => {
            let store_scroll_number = res.users;
            Array.prototype.push.apply(this.feed_list, store_scroll_number);
            this.show_loader = false;
            this.product_page = res.meta.current_page;
            this.product_totalCount = res.meta.total_count;
            this.page_change_value = false;
          }, error => {
            console.log("error", error);
            this.show_loader = false;

          });
        }
        this.count_scroll_window = this.count_scroll_window + 1200;
      }
    }

  }
  arrow_tops() {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }
  clearbutton() {
    this.tagFormArray = [];
    let taglist = { "tag_ids": this.tagFormArray }
    this.homeService.multiple_tag(taglist, 1, 10)
      .subscribe(
        res => {
          this.tag_posts = res.posts;
          if (this.tag_posts == '') {
            this.tag_post = false;
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  backclilked() {
    this.show_loader = false;
    this.count_scroll_window = null;
    this.tagFormArray = [];
    let taglist = { "tag_ids": this.tagFormArray }
    this.homeService.multiple_tag(taglist, 1, 10)
      .subscribe(
        res => {
          this.tag_posts = res.posts;
          if (this.tag_posts == '') {
            this.tag_post = false;
          }
        },
        err => {
          console.log(err)
        }
      )
    this.search_box = false;
    window.scroll(0, 0);
    this.salon_searches = false;
    this.tag_searches = false;
    let feed_search_type = "";
    let feed_search_value = "";
    this.shared.changeFeedSearchVal(feed_search_type, feed_search_value);
    this.shared.store_clicked('clear_demo_search');
  }

  pageChanged(event: PageChangedEvent): void {
    if (this.search_type == 'salon') {
      this.getSalons(this.search_data, event.page, event.itemsPerPage)
    } else if (this.search_type == 'hair_stylist') {
      this.getHairStylish(this.search_data, event.page, event.itemsPerPage)
    } else if (this.search_type == 'brand') {
      this.getBrands(this.search_data, event.page, event.itemsPerPage)
    } else if (this.search_type == 'all_tags') {
      this.gettags(this.search_data, event.page, event.itemsPerPage)
    }
  }
  /**
   * Call service of search salon with search vale
   * @param searchVal : user search vale
   */
  gettags(searchVal, pages, limits) {
    this.page_change_value = true;
    this.tag_searches = true;
    this.homeService.getTagList(searchVal, pages, limits).subscribe(res => {
      this.feed_list = res.posts;
      this.product_page = res.meta.current_page;
      this.product_totalCount = res.meta.total_count;
      this.page_change_value = false;
    }, error => {
      console.log("error", error);
    });
  }
  getSalons(searchVal, pages, limits) {
    this.salon_searches = true;
    this.page_change_value = true;
    this.homeService.getSalonsLists(searchVal, pages, limits).subscribe(res => {
      this.feed_list = res.salons;
      this.product_page = res.meta.current_page;
      this.product_totalCount = res.meta.total_count;
      this.page_change_value = false;
    }, error => {
      console.log("error", error);
    });
  }
  /**
   * Call service of search hair stylish with search vale
   * @param searchVal user search vale
   */
  getHairStylish(searchVal, pages, limits) {
    this.page_change_value = true;
    this.title3 = "Stylist Near Me";
    this.homeService.gethairStyleList(searchVal, pages, limits).subscribe(res => {
      this.feed_list = res.users;
      this.product_page = res.meta.current_page;
      this.product_totalCount = res.meta.total_count;
      this.page_change_value = false;
    }, error => {
      console.log("error", error);
    });
  }
  /**
   * Call service of search brand with search vale
   * @param searchVal : user search vale
   */
  getBrands(searchVal, pages, limits) {
    this.page_change_value = true;
    this.homeService.getBrandList(searchVal, pages, limits).subscribe(res => {
      this.feed_list = res.users;
      this.product_page = res.meta.current_page;
      this.product_totalCount = res.meta.total_count;
      this.page_change_value = false;
    }, error => {
      console.log("error", error);
    });
  }

  comments(post_id) {
    this.profileService.get_Comments(post_id)
      .subscribe(
        res => {
          let comments = res.comments;
          comments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          this.list_comments = comments;
          this.homepagetrendlist();
          this.homepageeditlist();
          if (this.search_type == 'all_tags') {
            this.gettags(this.search_data, this.product_page, this.product_limit)
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  pagescroll(post_name, title?, posts_id?) {
    this.shared.store_clicked('product_details');
    if (post_name == 'tag') {
      this.router.navigate(['/postlist'], { queryParams: { post_list: btoa(post_name), tag_id: this.tagFormArray, tag_name: this.tagnameFormArray } })
    } else if (post_name == 'trending') {
      this.router.navigate(['/postlist'], { queryParams: { post_list: btoa(post_name), tag_id: posts_id, tag_name: title } })
    } else if (post_name == 'editor') {
      this.router.navigate(['/postlist'], { queryParams: { post_list: btoa(post_name), tag_id: posts_id, tag_name: title } })
    } else if (post_name == 'stylist') {
      this.router.navigate(['/postlist'], { queryParams: { post_list: btoa(post_name), tag_id: 0, tag_name: 'stylist' } })
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

  profileimgHandler(event): void {
    event.target.src = this.profileImg
  }

  getPosts() {
    this.homeService.getPosts()
      .subscribe(
        post => {
          this.posted = post.posts;
        },
        err => {
          console.log(err)
        }
      )
  }

  public firstlist;
  public secondlist;
 
  homepagetrendlist() {
    this.homeService.homePagetrendingList()
      .subscribe(
        res => {
          this.firstlist = res.homepage;
        },
        err => {
          console.log(err)
        }
      )
  }

  homepageeditlist() {
    this.homeService.homePageeditingList()
      .subscribe(
        res => {
          this.secondlist = res.homepage;
        },
        err => {
          console.log(err)
        }
      )
  }

  stylist_nears(lats, longs) {
    this.lat = lats;
    this.long = longs;
    this.homeService.stylist_near(this.lat, this.long, 1, 10)
      .subscribe(
        res => {
          this.title3 = "Stylist Near Me";
          this.stylist_prof = res.users;
        },
        err => {
          console.log(err)
        }
      )
  }

  getAllPostWithoutLogin() {
    this.homeService.getPostWithoutLogin()
      .subscribe(
        res => {
          this.posts = res.posts;
        },
        err => {
          this.toasterService.pop('error', '404 Not Found', '');
          console.log(err)
        }
      )
  }

  likepost(post_id, fetch) {
    this.postDetailsService.likePost(post_id)
      .subscribe(
        res => {
          if (fetch == 'thred') {
            this.homepagetrendlist();
          } else if (fetch == 'editor') {
            this.homepageeditlist();
          } else if (fetch == 'tag_post') {
            this.getPostByTag();
          } else if (fetch == 'tag_search') {
            this.gettags(this.search_data,1, this.feed_list.length);
            this.product_page=2;
            // this.gettags(this.search_data, this.product_page, this.product_limit)
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  unlikepost(post_id, fetch) {
    this.postDetailsService.unLikePost(post_id)
      .subscribe(
        res => {
          if (fetch == 'thred') {
            this.homepagetrendlist();
          } else if (fetch == 'editor') {
            this.homepageeditlist();
          } else if (fetch == 'tag_post') {
            this.getPostByTag();
          } else if (fetch == 'tag_search') {
            this.gettags(this.search_data,1, this.feed_list.length);
            this.product_page=2;
            // this.gettags(this.search_data, this.product_page, this.product_limit)
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  imgErrorHandler(event): void {
    event.target.src = this.defaultImg
  }

  imgErrorHandlers(event): void {
    event.target.src = 'assets/images/postdetail/postpic/subpic1.jpg';
  }

  // @Input('shouldShow')
  public shouldShow: boolean = false;

  getTags(num): void {
    this.homeService.getTags(num)
      .subscribe(
        res => {
          this.tags_scroll = res.tags;
          this.tag_page = this.tag_page + 1;
        },
        err => {
          this.toasterService.pop('error', '404 Not Found', '');
        }
      )
  }
  isActive(id) {
    return this.tagFormArray.findIndex(x => x == id) !== -1;
  }
  tagFormArray: Array<any> = [];
  tagnameFormArray: Array<any> = [];
  public tag_demo;
  public tag_images = [];

  getPostByTag(tag_id?, tag_name?): void {
    if (this.tagFormArray.indexOf(tag_id) != -1) {
      let index = this.tagFormArray.indexOf(tag_id);
      this.tagFormArray.splice(index, 1);
    } else {
      this.tagFormArray.push(tag_id);
    }
    if (this.tagnameFormArray.indexOf(tag_name) != -1) {
      let index = this.tagnameFormArray.indexOf(tag_name);
      this.tagnameFormArray.splice(index, 1);
    } else {
      this.tagnameFormArray.push(tag_name);
    }
    let taglist = { "tag_ids": this.tagFormArray }
    this.tag_name = tag_name
    this.add_class = !this.add_class
    this.homeService.multiple_tag(taglist, 1, 10)
      .subscribe(
        res => {
          this.tag_images = [];
          this.tag_post = true;
          this.tag_titles = "Tags";
          this.tag_posts = res.posts;
          for (let i = 0; i < this.tag_posts.length; i++) {
            this.tag_demo = this.tag_posts[i];
            if (this.tag_demo.photos != 0) {
              let tags = [];
              let image_object = {
                small: this.tag_demo,
                tags: []
              }
              if (this.tag_demo.photos[0].labels.length) {
                for (let label of this.tag_demo.photos[0].labels) {
                  if (label.tag != null) {
                    tags.push(label.tag.name);
                  }
                }
                image_object.tags = tags
              }
              this.tag_images.push(image_object)
            }
          }
          if (this.tag_posts == '') {
            this.tag_images = [];
            this.tag_post = false;
            this.search_box = false;
          }
        },
        err => {
          console.log(err)
        }
      )
  }
  searchclick(message) {
    if (message == 'window_click') {
      this.shouldShow = !this.shouldShow;
    } if (message == 'flag_maintain') {
      this.count_scroll_window = null;
      this.search_box = false;
      let feed_search_type = "";
      let feed_search_value = "";
      this.shared.changeFeedSearchVal(feed_search_type, feed_search_value);
    }
  }

  notloginstared() {
    this.toasterService.pop('error', 'User Not Logged In', '');
    this.shared.store_clicked('stared_clilk');
  }
  seeProductDetails(e, product_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/productdetails', btoa(product_id)])
  }

  goToProfile(user_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/profile', btoa(user_id)]);
  }

  salonProfile(user_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/profile', btoa(user_id)],{ queryParams: { salon_title: 'salons' } });
  }

  goToProfiles(user_id) {
    this.modalRef.hide();
    this.shared.store_clicked('product_details');
    this.router.navigate(['/profile', btoa(user_id)]);
  }

  postDetails(post_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/postdetails', post_id]);
  }

  prodDetails(product_id, postId, prodName) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/store'], { queryParams: { post: btoa(postId), postname: btoa(prodName) } })
  }
  moreDetails(product_id, product_name) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/productdetails', btoa(product_id)], { queryParams: { postname: btoa(product_name) } })
  }
}

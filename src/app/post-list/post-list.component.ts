import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { HomeService } from '../services/home.service';
import { NgxCarousel } from 'ngx-carousel';
import { environment } from './../../environments/environment';
import { SharedService } from '../services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, PageChangedEvent } from 'ngx-bootstrap';
import { PostDetailsService } from '../services/postDetails.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  host: {
    '(window:scroll)': 'onScroll($event)'
  }
})
export class PostListComponent implements OnInit {
  private toasterService: ToasterService;
  public config: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: false,
      timeout: 3000
    });
  public is_logged_in: Boolean = false;
  public product_page: number = 1;
  public product_limit: number = 12;
  public product_totalCount: number;
  public profile_image = environment.cloud_url;
  public user_profile;
  public title_post;
  public lat = 23.01952;
  public long = 72.5475328;
  constructor(
    private router: Router,
    public homeService: HomeService,
    private shared: SharedService,
    private profileService: ProfileService,
    public fb: FormBuilder,
    public login: LoginService,
    toasterService: ToasterService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    public postDetailsService: PostDetailsService
  ) {
    this.toasterService = toasterService;
    this.shared.listen().subscribe((m: any) => {
      this.searchclick(m);
    })
    this.is_logged_in = login.loggedIn();
  }
  public trendingposts = [];
  public trendingposts_array = [];
  public carouselTileItems = [];
  public carouselTile: NgxCarousel;
  public defaultImg = environment.defaultImgUrl;
  public profileImg = environment.profImgUrl;
  submitted: Boolean = false;
  public list_comments: any;
  public commentSend: FormGroup;

  // @Input('shouldShow')
  public shouldShow: boolean = false;
  searchclick(value) {
    if (value == 'Search click') {
      this.shouldShow = !this.shouldShow;
    }
  }
  comment_popup: Boolean = false;
  tag_searchesss: Boolean = false;

  public product: any;
  modalRef: BsModalRef;

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
  public post_title;
  public post_data;
  public post_name;
  ngOnInit() {
    this.trendingposts = [];
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
    });

    this.route.queryParams.subscribe((queryParam) => {
      this.post_title = atob(queryParam.post_list);
      this.post_data = queryParam.tag_id;
      this.post_name = queryParam.tag_name;
    })

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
    if (this.post_title == 'tag') {
      this.tag_searchesss = false;
      this.title_post = 'Tags';
      this.count_scroll_window = 901;
      this.getTagPost(this.post_data, this.product_page, this.product_limit);
    } else if (this.post_title == 'User_post') {
      this.tag_searchesss = false;
      this.title_post = this.post_name;
      this.count_scroll_window = 901;
      this.getUserPost(this.post_data, this.product_page, this.product_limit);
    } else if (this.post_title == 'Favorite_post') {
      this.tag_searchesss = false;
      this.title_post = this.post_name;
      this.count_scroll_window = 901;
      this.getFavUserPost(this.post_data, this.product_page, this.product_limit);
    } else if (this.post_title == 'trending') {
      this.tag_searchesss = false;
      this.title_post = this.post_name;
      this.count_scroll_window = 901;
      this.homepagelist(this.post_data, this.product_page, this.product_limit);
    } else if (this.post_title == 'editor') {
      this.tag_searchesss = false;
      this.title_post = this.post_name;
      this.count_scroll_window = 901;
      this.homepagelist(this.post_data, this.product_page, this.product_limit);
    } else if (this.post_title == 'stylist') {
      this.tag_searchesss = true;
      this.title_post = 'Stylist Near Me';
      this.count_scroll_window = 901;
      this.stylist_nears(this.lat, this.long, this.product_page, this.product_limit);
    }

    this.commentSend = this.fb.group({
      'body': new FormControl("", Validators.required)
    })
  }
  public show_loader: Boolean = false;
  public count_scroll_window = null;
  onScroll(evt) {//window object can be wrapper in a service but for now we directly use it
    let fuhuh = this.count_scroll_window == null ? 901 : this.count_scroll_window;
    if (window.pageYOffset >= fuhuh) {
      this.product_page += 1;
      // this.filterproduct(this.product_page, this.product_limit);
      this.show_loader = true;
      if (this.post_title == 'tag') {
        this.tag_searchesss = false;
        this.title_post = 'Tags';
        let taglist = { "tag_ids": this.post_data }
        this.homeService.multiple_tag(taglist, this.product_page, this.product_limit)
          .subscribe(
            res => {
              let store_scroll_number = res.posts;
              Array.prototype.push.apply(this.trendingposts, store_scroll_number);
              this.show_loader = false;
              this.product_page = res.meta.current_page;
              this.product_totalCount = res.meta.total_count;
            },
            err => {
              console.log(err)
            }
          )
      } else if (this.post_title == 'User_post') {
        this.tag_searchesss = false;
        this.title_post = this.post_name;
        this.profileService.userPosts(this.post_data, this.product_page, this.product_limit)
          .subscribe(
            res => {
              let store_scroll_number = res.posts;
              Array.prototype.push.apply(this.trendingposts, store_scroll_number);
              this.show_loader = false;
              this.product_page = res.meta.current_page;
              this.product_totalCount = res.meta.total_count;
            },
            err => {
              console.log(err)
            }
          )
      } else if (this.post_title == 'Favorite_post') {
        this.tag_searchesss = false;
        this.title_post = this.post_name;
        this.profileService.userFavPosts(this.post_data, this.product_page, this.product_limit)
          .subscribe(
            res => {
              for (let i = 0; i < res.likes.length; i++) {
                let gfghh = res.likes[i].post;
                this.trendingposts_array.push(gfghh);
              }
              // let store_scroll_number = res.likes;
              Array.prototype.push.apply(this.trendingposts, this.trendingposts_array);
              this.show_loader = false;
              this.product_page = res.meta.current_page;
              this.product_totalCount = res.meta.total_count;
            },
            err => {
              console.log(err)
            }
          )
      } else if (this.post_title == 'trending') {
        this.tag_searchesss = false;
        this.title_post = this.post_name;
        this.homeService.single_homepages(this.post_data, this.product_page, this.product_limit)
          .subscribe(
            res => {
              let store_scroll_number = res.posts;
              Array.prototype.push.apply(this.trendingposts, store_scroll_number);
              this.show_loader = false;
              this.product_page = res.meta.current_page;
              this.product_totalCount = res.meta.total_count;
            },
            err => {
              console.log(err)
            }
          )
      } else if (this.post_title == 'editor') {
        this.tag_searchesss = false;
        this.title_post = this.post_name;
        this.homeService.single_homepages(this.post_data, this.product_page, this.product_limit)
          .subscribe(
            res => {
              let store_scroll_number = res.posts;
              Array.prototype.push.apply(this.trendingposts, store_scroll_number);
              this.show_loader = false;
              this.product_page = res.meta.current_page;
              this.product_totalCount = res.meta.total_count;
            },
            err => {
              console.log(err)
            }
          )
      } else if (this.post_title == 'stylist') {
        this.tag_searchesss = true;
        this.title_post = 'Stylist Near Me';
        this.homeService.stylist_near(this.lat, this.long, this.product_page, this.product_limit)
          .subscribe(
            res => {
              let store_scroll_number = res.users;
              Array.prototype.push.apply(this.trendingposts, store_scroll_number);
              this.show_loader = false;
              this.product_page = res.meta.current_page;
              this.product_totalCount = res.meta.total_count;
            },
            err => {
              console.log(err)
            }
          )
      }
      this.count_scroll_window = this.count_scroll_window + 1200;
    }

  }
  arrow_tops() {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    // window.scroll(0, 0);
  }


  getTagPost(tag_id, page, limit) {
    let taglist = { "tag_ids": tag_id }
    this.homeService.multiple_tag(taglist, page, limit)
      .subscribe(
        res => {
          this.trendingposts = res.posts;
          this.product_page = res.meta.current_page;
          this.product_totalCount = res.meta.total_count;
        },
        err => {
          console.log(err)
        }
      )
  }
  getUserPost(tag_id, page, limit) {
    this.profileService.userPosts(tag_id, page, limit)
      .subscribe(
        res => {
          this.trendingposts = res.posts;
          this.product_page = res.meta.current_page;
          this.product_totalCount = res.meta.total_count;
        },
        err => {
          console.log(err)
        }
      )
  }
  getFavUserPost(tag_id, page, limit) {
    this.profileService.userFavPosts(tag_id, page, limit)
      .subscribe(
        res => {
          for (let i = 0; i < res.likes.length; i++) {
            let gfghh = res.likes[i].post;
            this.trendingposts.push(gfghh);
          }
          this.product_page = res.meta.current_page;
          this.product_totalCount = res.meta.total_count;
        },
        err => {
          console.log(err)
        }
      )
  }

  backclilked() {
    if (this.post_title == 'User_post') {
      this.router.navigate(['/profile', btoa(this.post_data)]);
    } else if (this.post_title == 'Favorite_post') {
      this.router.navigate(['/profile', btoa(this.post_data)]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  stylist_nears(lats, longs, page, limit) {
    this.lat = lats;
    this.long = longs;
    this.homeService.stylist_near(this.lat, this.long, page, limit)
      .subscribe(
        res => {
          this.trendingposts = res.users;
          this.product_page = res.meta.current_page;
          this.product_totalCount = res.meta.total_count;
        },
        err => {
          console.log(err)
        }
      )
  }

  comments(post_id) {
    this.profileService.get_Comments(post_id)
      .subscribe(
        res => {
          let comments = res.comments;
          comments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          this.list_comments = comments;
          if (this.post_title == 'trending') {
            this.homepagelist(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.homepagelist(this.post_data, this.product_page, this.product_limit);
          } else if (this.post_title == 'editor') {
            this.homepagelist(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.homepagelist(this.post_data, this.product_page, this.product_limit);
          } else if (this.post_title == 'tag') {
            this.getTagPost(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.getTagPost(this.post_data, this.product_page, this.product_limit)
          } else if (this.post_title == 'User_post') {
            this.getUserPost(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.getUserPost(this.post_data, this.product_page, this.product_limit)
          } else if (this.post_title == 'Favorite_post') {
            this.getFavUserPost(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.getUserPost(this.post_data, this.product_page, this.product_limit)
          }
        },
        err => {
          console.log(err)
        }
      )
  }
  notloginstared() {
    this.toasterService.pop('error', 'User Not Logged In', '');
    this.shared.store_clicked('stared_clilk');
  }
  profileimgHandler(event): void {
    event.target.src = this.profileImg
  }
  imgErrorHandlers(event): void {
    event.target.src = 'assets/images/postdetail/postpic/subpic1.jpg';
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

  homepagelist(data, page, limit) {
    this.homeService.single_homepages(data, page, limit)
      .subscribe(
        res => {
          if (this.post_title == 'trending') {
            this.trendingposts = res.posts;
            this.product_page = res.meta.current_page;
            this.product_totalCount = res.meta.total_count;
          } if (this.post_title == 'editor') {
            this.trendingposts = res.posts;
            this.product_page = res.meta.current_page;
            this.product_totalCount = res.meta.total_count;
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  pageChanged(event: PageChangedEvent): void {
    // this.getProductList(event.page, event.itemsPerPage);
    if (this.post_title == 'trending') {
      this.homepagelist(this.post_data, event.page, event.itemsPerPage)
    } else if (this.post_title == 'editor') {
      this.homepagelist(this.post_data, event.page, event.itemsPerPage)
    } else if (this.post_title == 'tag') {
      this.getTagPost(this.post_data, event.page, event.itemsPerPage)
    } else if (this.post_title == 'stylist') {
      this.getTagPost(this.post_data, event.page, event.itemsPerPage)
    }
  }

  likepost(post_id, fetch) {
    this.postDetailsService.likePost(post_id)
      .subscribe(
        res => {
          if (this.post_title == 'trending') {
            this.homepagelist(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.homepagelist(this.post_data, this.product_page, this.product_limit);
          } else if (this.post_title == 'editor') {
            this.homepagelist(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.homepagelist(this.post_data, this.product_page, this.product_limit);
          } else if (this.post_title == 'tag') {
            this.getTagPost(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.getTagPost(this.post_data, this.product_page, this.product_limit)
          } else if (this.post_title == 'User_post') {
            this.getUserPost(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.getUserPost(this.post_data, this.product_page, this.product_limit)
          } else if (this.post_title == 'Favorite_post') {
            this.getFavUserPost(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.getUserPost(this.post_data, this.product_page, this.product_limit)
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
          if (this.post_title == 'trending') {
            this.homepagelist(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.homepagelist(this.post_data, this.product_page, this.product_limit);
          } else if (this.post_title == 'editor') {
            this.homepagelist(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.homepagelist(this.post_data, this.product_page, this.product_limit);
          } else if (this.post_title == 'tag') {
            this.getTagPost(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.getTagPost(this.post_data, this.product_page, this.product_limit)
          } else if (this.post_title == 'User_post') {
            this.getUserPost(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.getUserPost(this.post_data, this.product_page, this.product_limit)
          } else if (this.post_title == 'Favorite_post') {
            this.getFavUserPost(this.post_data,1, this.trendingposts.length);
            this.product_page=2;
            // this.getUserPost(this.post_data, this.product_page, this.product_limit)
          }
        },
        err => {
          console.log(err)
        }
      )
  }
  postDetails(post_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/postdetails', post_id]);
  }
  seeProductDetails(e, product_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/productdetails', btoa(product_id)])
  }
  goToProfile(user_id) {
    this.shared.store_clicked('product_details');
    this.router.navigate(['/profile', btoa(user_id)]);
  }
  imgErrorHandler(event): void {
    event.target.src = this.defaultImg
  }


}

import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';
import { SharedService } from '../services/shared.service';
import { PostDetailsService } from '../services/postDetails.service';
import { environment } from './../../environments/environment';
import { LoginService } from '../services/login.service';

@Component({
  templateUrl: 'starred.component.html'
})

export class StarredComponent implements OnInit {

  constructor(private router: Router, private shared: SharedService, public login: LoginService, public postService: PostDetailsService) {
    this.shared.listen().subscribe((m: any) => {
      this.searchclick(m);
    })
  }

  public carouselTileItems: Array<any>;
  public carouselTile: NgxCarousel;

  public posts = [];
  public fav_posts = [];
  public defaultImg = environment.defaultImgUrl;
  public user_data = JSON.parse(localStorage.getItem('user_data'))

  ngOnInit() {
    this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    this.carouselTile = {
      grid: { xs: 1, sm: 2, md: 3, lg: 4, all: 0 },
      slide: 2,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: false,
        pointStyles: ""
      },
      load: 2,
      touch: true,
      easing: 'ease'
    }
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    if (this.login.loggedIn()) {
      this.getFavourites();
    }
  }
  @Input('shouldShow')
  public shouldShow: boolean = false;

  searchclick(value: boolean) {
    this.shouldShow = !this.shouldShow;
  }

  getFavourites() {
    if (this.login.loggedIn()) {
      let user_id = this.user_data[0].token;
      let post_type = 'favourites';
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
  }

  imgErrorHandler(event): void {
    event.target.src = this.defaultImg
  }

  getPostByTypes(post_type = '') {
    let user_id = this.user_data[0].token;
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

  prodDetails(product_id, product_name) {
    this.router.navigate(['/productdetails', btoa(product_id)], { queryParams: { postname: btoa(product_name) } })
  }
}

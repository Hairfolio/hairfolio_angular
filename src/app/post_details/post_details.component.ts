import { PostDetailsService } from '../services/postDetails.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit, Input, TemplateRef, Inject } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';
import { environment } from './../../environments/environment';
import { ProfileService } from '../services/profile.service';
import { SeosearchService } from '../services/seosearch.service';
import { StoreService } from '../services/store.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { LoginService } from '../services/login.service';
import { ProductDetailsService } from './../services/productDetails.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DOCUMENT } from '@angular/common';

@Component({
    templateUrl: './post_details.component.html'
})

export class PostDetailsComponent implements OnInit {
    public profile_image = environment.cloud_url;
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

    //model popup
    modalRef: BsModalRef;
    public product_details;
    max = 5;
    rate = 2;
    isReadonly = false;
    public is_logged_in: Boolean = false;
    public commentSend: FormGroup;
    // images gallyer compenent 
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    public carouselTileItems: Array<any>;
    public carouselTile: NgxCarousel;
    public carouselOne: NgxCarousel;
    public carouselThree: NgxCarousel;
    public tags: any[] = [];
    public services: any[] = [];
    public colors: any[] = [];
    submitted: Boolean = false;
    comment_popup: Boolean = false;
    public post_id;
    public user_profile;
    public posts_details: any;
    public list_comments: any;
    public products = [];
    public photos = [];
    public post_comments = [];
    public comments_count: any;
    public post_likes = [];
    public likes_count: any;
    public defaultImg = environment.defaultImgUrl;
    public profileImg = environment.profImgUrl;
    public user_datas = JSON.parse(localStorage.getItem('user_data'))
    public login_id;
    public unique_id = '';
    public product_page: number = 1;
    public product_limit: number = 10;
    public stylist_totalCount: number;
    public list_stylist;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public postDetailsService: PostDetailsService,
        private shared: SharedService,
        public fb: FormBuilder,
        private modalService: BsModalService,
        private profileService: ProfileService,
        private prodService: ProductDetailsService,
        private storeService: StoreService,
        private seo: SeosearchService,
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
            //animation: 'lazy',
            point: {
                visible: false,
            },
            load: 2,
            touch: true,
            loop: true,
            //easing: 'ease'
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
            this.post_id = param.post_id
            forkJoin(
                this.postDetailsService.stylistOtherPost(this.post_id, this.product_page, this.product_limit),
                this.postDetailsService.getDetailsPost(this.post_id)
            ).subscribe(([res, res1]) => {
                this.list_stylist = res.posts;
                this.product_page = res.meta.current_page;
                this.stylist_totalCount = res.meta.total_count;
                this.user_profile = res1.post.user.avatar_cloudinary_id;
                this.comments_count = res1.post.comments_count;
                this.posts_details = res1.post;
                this.photos = this.posts_details.photos;
                this.products = this.posts_details.products;
                let post_images = [];
                if (this.photos.length != 0) {
                    for (let i = 0; i < this.photos.length; i++) {
                        let tags = [];
                        let services = [];
                        let colors = [];
                        let image_object = {
                            small: this.photos[i].asset_url,
                            medium: this.photos[i].asset_url,
                            big: this.photos[i].asset_url,
                            description: this.posts_details.description.length > 79 ? this.posts_details.description.substr(0, 79).concat("....") : this.posts_details.description,
                            services: [],
                            colors: [],
                            tags: []
                        }
                        if (this.photos[i].labels.length) {
                            for (let label of this.photos[i].labels) {
                                if (label.tag != null) {
                                    tags.push(label.tag.name);
                                }
                                if (label.formulas.length) {
                                    services.push(label.formulas[0].service.name);
                                    colors.push({ colorname: label.formulas[0].line.name, colorcode: label.formulas[0].treatments });
                                }
                            }
                            image_object.tags = tags
                            image_object.services = services
                            image_object.colors = colors
                        }
                        post_images.push(image_object)
                    }
                    this.galleryImages = post_images
                    this.tags = post_images[0].tags
                    this.services = post_images[0].services
                    this.colors = post_images[0].colors
                } else {
                    let image_object = {
                        small: 'assets/images/postdetail/postpic/subpic1.jpg',
                        medium: 'assets/images/postdetail/postpic/postpic1.jpg',
                        big: 'assets/images/postdetail/postpic/postpic1.jpg',
                    }
                    post_images.push(image_object)
                    this.galleryImages = post_images
                }
            }, error => {
                this.toasterService.pop('error', '404 Not Found', '');
            });
        })
        this.route.queryParams.subscribe((queryParam) => {
            let user_id = queryParam.ref_code;
            if (user_id == undefined) {
            } else {
                this.unique_id = user_id;
            }
        })
        // this.unique_id = 'd5c491e7311ef3';

        if (this.is_logged_in) {
            this.login_id = this.user_datas[0].token;
        }

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
                // imageSwipe :true,
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
        this.commentSend = this.fb.group({
            'body': new FormControl("", Validators.required)
        })

    }
    imgErrorHandlers(event): void {
        event.target.src = 'assets/images/postdetail/postpic/subpic1.jpg';
    }
    openModal(template: TemplateRef<any>, productDetails, meassge) {
        if (meassge == 'comment') {
            this.comment_popup = true;
            this.submitted = false;
            this.comments(this.post_id);
        }
        this.product_details = productDetails;
        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'modal-lg modal-big' })
        );
    }
    confirmSelection(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.isReadonly = true;
        }
    }

    commentFormSubmit() {
        this.submitted = true;
        let post_Id = this.post_id;
        if (this.commentSend.valid) {
            this.profileService.post_Comment(post_Id, this.commentSend.value)
                .subscribe(
                    res => {
                        this.comments(this.post_id);
                        this.commentSend.reset();
                        this.submitted = false;
                    }, err => {
                        console.log('err: ', err);
                    }
                )
        }
    }

    resetStars() {
        this.rate = 0;
        this.isReadonly = false;
    }
    salonProfile(user_id) {
        this.shared.store_clicked('product_details');
        this.router.navigate(['/profile', btoa(user_id)],{ queryParams: { salon_title: 'salons' } });
      }

    getDetailsOfPost(postId) {
        this.postDetailsService.getDetailsPost(postId)
            .subscribe(
                res => {
                    this.user_profile = res.post.user.avatar_cloudinary_id;
                    this.comments_count = res.post.comments_count;
                    this.posts_details = res.post;
                    this.photos = this.posts_details.photos;
                    this.products = this.posts_details.products;
                    let post_images = [];

                    if (this.photos.length != 0) {
                        for (let i = 0; i < this.photos.length; i++) {
                            let tags = [];
                            let services = [];
                            let colors = [];
                            let image_object = {
                                small: this.photos[i].asset_url,
                                medium: this.photos[i].asset_url,
                                big: this.photos[i].asset_url,
                                description: this.posts_details.description.length > 79 ? this.posts_details.description.substr(0, 79).concat("....") : this.posts_details.description,
                                services: [],
                                colors: [],
                                tags: []
                            }

                            if (this.photos[i].labels.length) {
                                for (let label of this.photos[i].labels) {
                                    if (label.tag != null) {
                                        tags.push(label.tag.name);
                                    }
                                    if (label.formulas.length) {
                                        services.push(label.formulas[0].service.name);
                                        colors.push({ colorname: label.formulas[0].line.name, colorcode: label.formulas[0].treatments });
                                    }
                                }

                                image_object.tags = tags
                                image_object.services = services
                                image_object.colors = colors
                            }
                            post_images.push(image_object)
                        }

                        this.galleryImages = post_images
                        this.tags = post_images[0].tags
                        this.services = post_images[0].services
                        this.colors = post_images[0].colors
                    }
                    else {
                        let image_object = {
                            small: 'assets/images/postdetail/postpic/subpic1.jpg',
                            medium: 'assets/images/postdetail/postpic/postpic1.jpg',
                            big: 'assets/images/postdetail/postpic/postpic1.jpg',
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
    seeProductDetails_screen(e, product_id) {
        this.shared.store_clicked('product_details');
        this.router.navigate(['/productdetails', btoa(product_id)])
      }
    addFavourite(productId, isFavourite: Boolean) {
        if (isFavourite) {
            this.prodService.removefavourites(productId)
                .subscribe(
                    res => {
                        this.toasterService.pop('info', 'Product', 'Remove To Wishlist');
                        this.getDetailsOfPost(this.post_id);
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
                        this.getDetailsOfPost(this.post_id);
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
        if (this.comment_popup == true) {
            this.modalRef.hide();
        }
        this.router.navigate(['/profile', btoa(user_id)]);
    }

    imgErrorHandler(event): void {
        event.target.src = this.defaultImg
    }

    profileimgHandler(event): void {
        event.target.src = this.profileImg
    }

    likepost(post_id, data) {
        this.postDetailsService.likePost(post_id)
            .subscribe(
                res => {
                    if (data == 'profile_like') {
                        this.getDetailsOfPost(this.post_id);
                    } else if (data == 'stylenear_like') {
                        this.stylistPost(this.post_id, this.product_page, this.product_limit);
                    }
                },
                err => {
                    console.log(err)
                }
            )
    }

    unlikepost(post_id, data) {
        this.postDetailsService.unLikePost(post_id)
            .subscribe(
                res => {
                    if (data == 'profile_like') {
                        this.getDetailsOfPost(this.post_id);
                    } else if (data == 'stylenear_like') {
                        this.stylistPost(this.post_id, this.product_page, this.product_limit);
                    }
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
                    let image = environment.cloud_url + res.comments.avatar_cloudinary_id + '.jpg';
                    this.list_comments = comments;
                    this.comments_count = res.meta.total_count;
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
                    this.getDetailsOfPost(this.post_id);
                },
                err => {
                    console.log(err)
                }
            )
    }

    removeUserFollowing(usr_id) {
        this.profileService.removeUserFollows(usr_id)
            .subscribe(
                res => {
                    this.getDetailsOfPost(this.post_id);
                },
                err => {
                    console.log(err)
                }
            )
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

    stylistPost(data, page, limit) {
        this.postDetailsService.stylistOtherPost(data, page, limit)
            .subscribe(
                res => {
                    this.list_stylist = res.posts;
                    this.product_page = res.meta.current_page;
                    this.stylist_totalCount = res.meta.total_count;
                },
                err => {
                    console.log(err)
                }
            )
    }

    previewChange(data: any): void {
        this.services = data.image.services
        this.colors = data.image.colors
        this.tags = data.image.tags
    }

    previewOpen() {
        this.document.body.classList.add('body-scroll-hide');
    }
    previewClose() {
        this.document.body.classList.remove('body-scroll-hide');
    }
}
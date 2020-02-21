import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

// lay outs 
import { LayoutComponent } from './layout/layout.component';
import { BlankComponent } from './blanklayout/blanklayout.component';
import { HomeModule } from './home/home.module';
import { SignUPModule } from './signup/signup.module';
import { ProfileModule } from './profile/profile.module';
import { StoreLandingModule } from './storelanding/storelanding.module';
import { PostDetailsModule } from './post_details/post_details.module';
import { ProductDetailsModule } from './product_details/product_details.module';
import { StoreListModule } from './storelisting/storelisting.module';
import { BlogModule } from './blog/blog.module';
import { StarredModule } from './starred/starred.module';
import { CartModule } from './cart/cart.module';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

import { InstaRedirectComponent } from './insta-redirect/insta-redirect.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    data: {
      title: 'Home',
      description: 'Hairfolio product selling website',
      slug: 'home'
    },
    children: [
      {
        path: 'home',
        loadChildren: './home/home.module#HomeModule',
        data: {
          title: 'homepage',
          description: 'Hairfolio product selling website',
          slug: 'home'
        }
      },
      {
        path: 'profile/:user_id',
        loadChildren: './profile/profile.module#ProfileModule',
        data: {
          title: 'Profile',
          description: 'Hairfolio product selling website',
          slug: 'profile'
        }
      },
      {
        path: 'starred',
        loadChildren: './starred/starred.module#StarredModule',
        data: {
          title: 'Starred',
          description: 'Hairfolio product selling website',
          slug: 'starred'
        }
      },
      {
        path: 'postlist',
        loadChildren: './post-list/post-list.module#PostlistModule',
        data: {
          title: 'Post List',
          description: 'Hairfolio product selling website',
          slug: 'postlist'
        }
      },
      {
        path: 'depositebank',
        loadChildren: './deposite_bank/deposite-bank.module#DepositebankModule',
        data: {
          title: 'Deposite Bank',
          description: 'Hairfolio product selling website',
          slug: 'depositebank'
        }
      },
      {
        path: 'changepassword/:user_id',
        loadChildren: './change-password/change-password.module#ChangePasswordModule',
        data: {
          title: 'Change Password',
          description: 'Hairfolio product selling website',
          slug: 'changepassword'
        }
      },
      {
        path: 'storelanding',
        loadChildren: './storelanding/storelanding.module#StoreLandingModule',
        data: {
          title: 'Store Landing',
          description: 'Hairfolio product selling website',
          slug: 'storelanding'
        }
      },
      {
        path: 'blog',
        loadChildren: './blog/blog.module#BlogModule',
        data: {
          title: 'Blog',
          description: 'Description Meta Tag Content',
          slug: 'blog'
        }
      },
      {
        path: 'cart',
        loadChildren: './cart/cart.module#CartModule',
        data: {
          title: 'Cart',
          description: 'Description Meta Tag Content',
          slug: 'cart'
        }
      },
      {
        path: 'postdetails/:post_id',
        // path: 'post_details',
        loadChildren: './post_details/post_details.module#PostDetailsModule',
        data: {
          title: 'Post Details',
          description: 'Description Meta Tag Content',
          slug: 'postdetails'
        }
      },
      {
        path: 'logdetails/:uniq_code/:log_id',
        loadChildren: './log-details/log-details.module#LogDetailsModule',
        data: {
          title: 'Log Details',
          description: 'Description Meta Tag Content',
          slug: 'logdetails'
        }
      },
      {
        path: 'editclaimdetail/:post_id',
        loadChildren: './claim-user-edit/claim-user-edit.module#ClaimusereditModule',
        data: {
          title: 'Claim user Details',
          description: 'Description Meta Tag Content',
          slug: 'editclaimdetail'
        }
      },
      {
        path: 'productdetails/:product_id',
        loadChildren: './product_details/product_details.module#ProductDetailsModule',
        data: {
          title: 'Product Details',
          description: 'Description Meta Tag Content',
          slug: 'postdetails'
        }
      },
      {
        path: 'store',
        loadChildren: './storelisting/storelisting.module#StoreListModule',
        data: {
          title: 'Store Listing',
          description: 'Description Meta Tag Content',
          slug: 'store'
        }
      },
      {
        path: 'store/:is_from_search',
        loadChildren: './storelisting/storelisting.module#StoreListModule',
        data: {
          title: 'Store Listing',
          description: 'Description Meta Tag Content',
          slug: 'store'
        }
      }
    ]
  },
  {
    path: '',
    'component': BlankComponent,
    data: {
      title: 'Pages'
    },
    children: [
      {
        path: 'signup',
        loadChildren: './signup/signup.module#SignUPModule',
        data: {
          title: 'signup',
          description: 'Description Meta Tag Content',
          slug: 'signup'
        }
      }
    ]
  },
  {
    path: 'insta_auth_callback',
    component: InstaRedirectComponent
  },
  {
    path: 'PrivacyPolicy',
    component: PrivacyPolicyComponent
  },
  {
    path: '**',
    component: PagenotfoundComponent,
    data: {
      title: 'Page 404'
    }
  }
];
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)

  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
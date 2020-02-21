import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from './../environments/environment';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { BlankComponent } from './blanklayout/blanklayout.component';
import { AppRoutingModule } from './app.routing';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProductDetailsService } from './services/productDetails.service';
import { ProfileService } from './services/profile.service';
import { SeosearchService } from './services/seosearch.service';
import { SharedService } from './services/shared.service';
import { LoginService } from './services/login.service';
import { SignupService } from './services/signup.service';
import { HomeService } from './services/home.service';
import { StoreService } from './services/store.service';
import { PostDetailsService } from './services/postDetails.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './helper/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap';
import { AuthGuard } from './authenticate/auth.guard';
import { MyHttpInterceptor, HTTPStatus } from './authenticate/token.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
// Custom Validation
import { CustomValidation } from './helper/customValidation';
import { FileValidator } from './helper/fileInputValidator';
// Social
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { InstaRedirectComponent } from './insta-redirect/insta-redirect.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ShareModule } from '@ngx-share/core';
import { Ng5SliderModule } from 'ng5-slider';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LogDetailsService } from './services/logDetails.service ';
const fbLoginOptions: LoginOpt = {
  // scope: 'publish_pages,manage_pages,publish_to_groups,pages_messaging,user_posts,pages_manage_cta,pages_manage_instant_articles,pages_show_list',
  return_scopes: true,
  enable_profile_selector: true
};
let config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.facebook_api_key)
    // provider: new FacebookLoginProvider(environment.facebook_api_key, fbLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    BlankComponent,
    InstaRedirectComponent,
    FileValidator,
    PagenotfoundComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    SocialLoginModule,
    NgxSpinnerModule,
    Ng5SliderModule,
    DeviceDetectorModule.forRoot(),
    ShareModule.forRoot()
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
      // useClass: HashLocationStrategy
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true
    },
    HTTPStatus,
    SharedService,
    SignupService,
    LoginService,
    HomeService,
    LogDetailsService,
    StoreService,
    ProfileService,
    PostDetailsService,
    ProductDetailsService,
    SeosearchService,
    AuthGuard,
    CustomValidation,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

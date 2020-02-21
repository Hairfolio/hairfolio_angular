import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { LoginService } from './../services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'app-insta-redirect',
	templateUrl: './insta-redirect.component.html',
	styleUrls: ['./insta-redirect.component.css']
})
export class InstaRedirectComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public login: LoginService,
		private spinner: NgxSpinnerService
	) { }
	public url = window.location.href;
	private setLocalStorage = [];

	ngOnInit() {
		if (this.url.includes('#')) {
			this.spinner.show();
			const httpParams = new HttpParams({ fromString: this.url.split('#')[1] });
			let paramValue = httpParams.get('access_token');
			// const params = new HttpParams()
			// 	.set('instagram_token', paramValue);
			const params = {'instagram_token' : paramValue}
			this.login.insta_login(params)
				.subscribe(user => {
					if (user) {
						this.setLocalStorage = [{ 'email': user.user.email, 'token': user.user.id,'facebook_loginid': user.user.facebook_id, 'instagram_loginid': user.user.instagram_id  }]
						localStorage.setItem('user_data', JSON.stringify(this.setLocalStorage))
						localStorage.setItem('auth_token', user.user.auth_token)
						this.spinner.hide();
						this.router.navigate(['/home'])
					}
				}, err => {
					console.log('err: ', err);
				});

		} else {
			this.router.navigate(['/home']);
		}
	}
}

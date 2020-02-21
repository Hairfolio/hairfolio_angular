import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { HTTPStatus } from './authenticate/token.interceptor';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeosearchService } from './services/seosearch.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from './services/shared.service';

@Component({
	selector: 'body',
	template: `<router-outlet>
				</router-outlet>`
})
export class AppComponent implements AfterViewInit {

	constructor(
		private httpStatus: HTTPStatus,
		private spinner: NgxSpinnerService,
		private elementRef: ElementRef,
		private shared: SharedService,
		private seo: SeosearchService,
		private router: Router,
		private route: ActivatedRoute) {
	}

	ngAfterViewInit() {
		this.elementRef
			.nativeElement
			.addEventListener('click', (event) => {
				if (!event.target.closest(".loginpopdropdown") && !event.target.closest(".join-login-btn") && !event.target.closest(".demp")) {
					this.shared.clicked('window_click');
				}
			});
	}
}


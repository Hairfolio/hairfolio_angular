import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpHeaders
} from '@angular/common/http';
import { map, catchError, finalize } from 'rxjs/operators';
import 'rxjs/add/observable/throw'
import { Router } from '@angular/router';

@Injectable()
export class HTTPStatus {
    private requestInFlight$: BehaviorSubject<boolean>;
    constructor() {
        this.requestInFlight$ = new BehaviorSubject(false);
    }

    setHttpStatus(inFlight: boolean) {
        this.requestInFlight$.next(inFlight);
    }

    getHttpStatus(): Observable<boolean> {
        return this.requestInFlight$.asObservable();
    }
}

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
    constructor(private status: HTTPStatus, private route: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header.
        const authToken = localStorage.getItem('auth_token');
        if (authToken) {
            req = req.clone({
                headers: new HttpHeaders({
                    'Authorization': authToken
                    // 'Accept-Encoding': 'gzip'
                })
            });
        } else {
            req = req.clone();
        }

        return next.handle(req).pipe(
            map(event => {
                this.status.setHttpStatus(true);
                return event;
            }),
            catchError(error => {
                if (error.status === 401) {
                    // console.log('error', error.status, this.route);
                    localStorage.removeItem('user_data');
                    localStorage.removeItem('auth_token');
                    this.route.navigate(['/home']);
                    window.location.reload();
                }
                return Observable.throw(error);
            }),
            finalize(() => {
                this.status.setHttpStatus(false);
            })
        )
    }
}
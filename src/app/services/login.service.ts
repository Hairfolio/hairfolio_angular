import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()

export class LoginService {
    public token = localStorage.getItem('auth_token');

    constructor(
        private http: HttpClient
    ) { }

    imageupload(login_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}file_upload`, login_data);
    }
    videoupload(login_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}video_upload`, login_data);
    }

    login(login_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}sessions`, login_data);
    }

    insta_login(login_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}sessions/instagram`, login_data);
    }

    facebook_login(login_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}sessions/facebook`, login_data);
    }

    register(data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}users`, data);
    }

    doLogout(auth_token): Observable<any> {
        return this.http.delete(`${environment.apiUrl}sessions/` + auth_token);
    }

    getToken() {
        return localStorage.getItem('auth_token')
    }

    loggedIn() {
        return !!localStorage.getItem('auth_token')
    }

    forgetPass(data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}sessions/recover`, data);
    }

    chnagePass(data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}change_password`, data);
    }

    blogList(page,limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}blogs?page=${page}&limit=${limit}`)
    }
}
import { Injectable } from "@angular/core";
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()

export class SignupService {
    constructor(
        private http: HttpClient
    ) {
    }

    uploadProfileImage(FormData): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}file_upload`, FormData);
    }
    register(data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}users`, data);
    }
    promocheck(promocod): Observable<any> {
        return this.http.get(`${environment.apiUrl}users/check_referral_code_existence?referral_code=` + promocod);
    }


}
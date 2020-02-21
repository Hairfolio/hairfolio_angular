import { Injectable } from "@angular/core";
import { environment } from './../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()

export class LogDetailsService {
   
    constructor(
        private http: HttpClient
    ) { }

    getPosts(): Observable<any> {
        return this.http.get(`${environment.apiUrl}posts`);
    }

    logDetailsPost(logId): Observable<any> {
        return this.http.get(`${environment.apiUrl}angular_log_web_page/` + logId);
    }

    getCommentsPost(postId): Observable<any> {
        return this.http.get(`${environment.apiUrl}posts/` + postId + `/comments`);
    }

    getLikesPost(postId): Observable<any> {
        return this.http.get(`${environment.apiUrl}posts/` + postId + `/likes`);
    }

    likePost(postId): Observable<any> {
        return this.http.post(`${environment.apiUrl}posts/` + postId + `/likes`,{});
    }

    unLikePost(postId): Observable<any> {
        return this.http.delete(`${environment.apiUrl}posts/` + postId + `/likes`);
    }
    
    stylistOtherPost(data,page,limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}posts/${data}/stylist_other_posts?page=${page}&limit=${limit}`)
    }

    getCategories(): Observable<any> {
        return this.http.get(`${environment.apiUrl}categories`);
    }

    getProductByCat(cat_id): Observable<any> {
        return this.http.get(`${environment.apiUrl}categories/` + cat_id);
    }

    getPostsByType(post_type, user_id): Observable<any> {
        return this.http.get(`${environment.apiUrl}user/` + post_type + `/` + user_id)
    }
}
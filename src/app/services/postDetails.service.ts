import { Injectable } from "@angular/core";
import { environment } from './../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()

export class PostDetailsService {
    // public token = JSON.parse(localStorage.getItem('auth_token'));
    // httpOptions: any = {
    //     headers: new HttpHeaders({
    //         "Authorization": (this.token != null) ? this.token : '',
    //         'Content-Type': 'application/json',
    //     })
    // }
    constructor(
        private http: HttpClient
    ) { }

    getPosts(): Observable<any> {
        return this.http.get(`${environment.apiUrl}posts`);
    }

    getDetailsPost(postId): Observable<any> {
        return this.http.get(`${environment.apiUrl}posts/` + postId);
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
import { Injectable } from "@angular/core";
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FEED_SEARCH_API_URL } from "../shared/define";
import { forkJoin } from 'rxjs/observable/forkJoin';



@Injectable()

export class HomeService {
    constructor(
        private http: HttpClient
    ) { }

    public requestDataFromMultipleSources(num, lat, long, page = 1, limit = 10): Observable<any[]> {
        let response1 = this.http.get(`${environment.apiUrl}tags/all_tags?page=` + num + `&&limit=` + 31);
        let response2 = this.http.get(`${environment.apiUrl}homepages?query=trending`);
        let response3 = this.http.get(`${environment.apiUrl}/users/stylist_near_me?latitude=${lat}&longitude=${long}&page=${page}&per_page=${limit}`);
        let response4 = this.http.get(`${environment.apiUrl}homepages?query=editor`);

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([response1, response2, response3,response4]);
    }

    homePageList(): Observable<any> {
        return this.http.get(`${environment.apiUrl}homepages`);
    }

    homePagetrendingList(): Observable<any> {
        return this.http.get(`${environment.apiUrl}homepages?query=trending `);
    }
    homePageeditingList(): Observable<any> {
        return this.http.get(`${environment.apiUrl}homepages?query=editor `);
    }

    getProducts(): Observable<any> {
        return this.http.get(`${environment.apiUrl}products`);
    }

    multiple_tag(data, page, limit): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}posts/hashtag_posts?page=${page}&per_page=${limit}`, data);
    }

    getTags(num): Observable<any> {
        return this.http.get(`${environment.apiUrl}tags/all_tags?page=` + num + `&&limit=` + 31);
    }

    stylist_near(lat, long, page, limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}/users/stylist_near_me?latitude=${lat}&longitude=${long}&page=${page}&per_page=${limit}`);
    }

    getTagsPosts(tag_id): Observable<any> {
        return this.http.get(`${environment.apiUrl}tags/` + tag_id + `/posts`);
    }

    getSearchSalon_old(value): Observable<any> {
        return this.http.get(`${environment.apiUrl}salons?q=${value}`);
    }

    single_homepages(value, num, limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}homepages_posts?id=${value}&page=${num}&per_page=${limit}`);
    }

    getTagPosts(tag_id): Observable<any> {
        return this.http.get(`${environment.apiUrl}posts/posts_by_tag?tag_id=${tag_id}`);
    }

    getPosts(): Observable<any> {
        return this.http.get(`${environment.apiUrl}posts`);
    }
    trendingposts(): Observable<any> {
        return this.http.get(`${environment.apiUrl}trending_posts`);
    }
    editorpicsposts(): Observable<any> {
        return this.http.get(`${environment.apiUrl}editor_pics_posts`);
    }

    getPostWithoutLogin(): Observable<any> {
        return this.http.get(`${environment.apiUrl}all_posts?page=1&limit=15`);
    }

    getPostsByPage(num): Observable<any> {
        let limit = 36;
        return this.http.get(`${environment.apiUrl}posts?page=` + num + `&&limit=` + limit);
    }
    /**
     * This api used for get salon list with search value
     * @param searchValue : value passs from search
     */
    // getSalonsList(searchValue, num, limit): Observable<any> {
    //     return this.http.get(`${FEED_SEARCH_API_URL.salon}&q=${searchValue}&page=${num}&limit=${limit}`);
    // }

    getSalonsLists(searchValue, num, limit): Observable<any> {
        // return this.http.get(`${FEED_SEARCH_API_URL.salon}&q=${searchValue}`);
        return this.http.get(`${FEED_SEARCH_API_URL.salon}?q=${searchValue}&page=${num}&per_page=${limit}`);
    }

    getTagList(searchValue, num, limit): Observable<any> {
        // return this.http.get(`${FEED_SEARCH_API_URL.salon}&q=${searchValue}`);
        return this.http.get(`${FEED_SEARCH_API_URL.all_tags}?term=${searchValue}&page=${num}&per_page=${limit}`);
    }
    /**
     * This api used for get barnd list with search value
     * @param searchValue : value passs from search
     */
    getBrandList(searchValue, num, limit): Observable<any> {
        // return this.http.get(`${FEED_SEARCH_API_URL.brand}&q=${searchValue}`);
        return this.http.get(`${FEED_SEARCH_API_URL.brand}&q=${searchValue}&page=${num}&limit=${limit}`);
    }
    /**
     * This api used for get hair style list with search value
     * @param searchValue : value passs from search
     */
    gethairStyleList(searchValue, num, limit): Observable<any> {
        // return this.http.get(`${FEED_SEARCH_API_URL.hair_style}&q=${searchValue}`);
        return this.http.get(`${FEED_SEARCH_API_URL.hair_style}&q=${searchValue}&page=${num}&limit=${limit}`);
    }
}
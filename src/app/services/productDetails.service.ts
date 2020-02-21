import { Injectable } from "@angular/core";
import { environment } from './../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()

export class ProductDetailsService {
    constructor(
        private http: HttpClient
    ) { }

    public requestDataFromMultipleSources(page, limit): Observable<any[]> {
        let response1 = this.http.get(`${environment.apiUrl}menu`);
        let response2 = this.http.get(`${environment.apiUrl}top_banner_image`);
        let response5 = this.http.get(`${environment.apiUrl}newarrival_products?page=${page}&limit=${limit}`);
        let response3 = this.http.get(`${environment.apiUrl}trending_products`);
        let response4 = this.http.get(`${environment.apiUrl}sales/fetch_sale`);

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([response1, response2, response5, response3, response4]);
    }

    getAllProducts(): Observable<any> {
        return this.http.get(`${environment.apiUrl}products`)
    }

    search_Products(data, page, limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}searches/search_products?search=${data}&page=${page}&limit=${limit}`)
    }

    getProductDetails(productId): Observable<any> {
        return this.http.get(`${environment.apiUrl}products/` + productId)
    }

    getPostDetails(postId): Observable<any> {
        return this.http.get(`${environment.apiUrl}posts/` + postId);
    }
    storelandingsales(): Observable<any> {
        return this.http.get(`${environment.apiUrl}sales/fetch_sale`);
    }
    trendingproducts(): Observable<any> {
        return this.http.get(`${environment.apiUrl}trending_products`);
    }
    arrivalproducts(page, limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}newarrival_products?page=${page}&limit=${limit}`);
    }
    discountsliders(): Observable<any> {
        return this.http.get(`${environment.apiUrl}top_banner_image`);
    }
    storeshopits(): Observable<any> {
        return this.http.get(`${environment.apiUrl}store_shop_its`);
    }
    addfavourites(productId): Observable<any> {
        return this.http.post(`${environment.apiUrl}products/` + productId + `/favourites`, {});
    }
    removefavourites(productId): Observable<any> {
        return this.http.delete(`${environment.apiUrl}products/` + productId + `/favourites`, {});
    }

}
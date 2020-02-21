import { Injectable } from "@angular/core";
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// import { SharedService } from "./shared.service";

@Injectable()

export class StoreService {
    // public token = JSON.parse(localStorage.getItem('auth_token'));
    // httpOptions: any = {
    //     headers: new HttpHeaders({
    //         "Authorization": (this.token != null) ? this.token : '',
    //         'Content-Type': 'application/json',
    //     })
    // }
    constructor(
        // public shared: SharedService,
        private http: HttpClient,
    ) { }

    getAllProducts(): Observable<any> {
        return this.http.get(`${environment.apiUrl}products`)
    }

    storeMenu(): Observable<any> {
        return this.http.get(`${environment.apiUrl}menu`)
    }
    
    getCategorie(): Observable<any> {
        return this.http.get(`${environment.apiUrl}categories`);
        // return this.http.get(`${environment.apiUrl}categories?page=${page}&limit=${limit}`);
    }

    getSubCategorie(id): Observable<any> {
        return this.http.get(`${environment.apiUrl}categories/`+ id);
    }

    getBrand(): Observable<any> {
        return this.http.get(`${environment.apiUrl}searches/product_brands`);
        // return this.http.get(`${environment.apiUrl}categories?page=${page}&limit=${limit}`);
    }

    filterSearch(data,page,limit): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}searches/filter_products?page=${page}&limit=${limit}`, data);
    }
    
    getAllProduct(page,limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}products?page=${page}&limit=${limit}`);
    }

    getDetailsPost(postId): Observable<any> {
        return this.http.get(`${environment.apiUrl}posts/` + postId);
    }

    addToFav(product_id): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}products/` + product_id + `/favourites`, {});
    }

    getCartProducts(): Observable<any> {
        return this.http.get(`${environment.apiUrl}carts/`);
    }
    addCartProduct(product_data): Observable<any> {
        return this.http.post(`${environment.apiUrl}carts/`,product_data);
    }

    addToCart(product_id): Observable<any> {
        // this.shared.clicked("cart_count");
        return this.http.post<any>(`${environment.apiUrl}cart/plus_to_cart`, product_id);
    }
    qty_minus(product_id): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}cart/minus_from_cart`, product_id);
    }

    removeToCart(product_id): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}remove_from_cart`, product_id);
    }

    updateToCart(cart_data): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}update_cart`, cart_data);
    }
}
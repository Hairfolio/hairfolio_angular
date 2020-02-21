import { Injectable } from "@angular/core";
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class ProfileService {
    constructor(
        private http: HttpClient
    ) { }

    getUser(user_id): Observable<any> {
        // return this.http.get(`${environment.apiUrl}users/` + user_id, this.httpOptions);
        return this.http.get(`${environment.apiUrl}users/` + user_id);
    }

    getSalon(salon_id): Observable<any> {
        return this.http.get(`${environment.apiUrl}salons/` + salon_id);
    }

    getuserPosts(user_id): Observable<any> {
        return this.http.get(`${environment.apiUrl}users/:id/posts/`);
    }

    userNotification(): Observable<any> {
        return this.http.get(`${environment.apiUrl}push_notifications`);
    }

    getFolios(): Observable<any> {
        return this.http.get(`${environment.apiUrl}folios/`);
    }

    depositemoney(): Observable<any> {
        return this.http.get(`${environment.apiUrl}wallets/wallet_transfer_info`);
    }

    getUserFolios(user_id): Observable<any> {
        return this.http.get(`${environment.apiUrl}users/` + user_id + `/folios`);
    }

    // follow
    getuserFollows(user_id): Observable<any> {
        return this.http.get(`${environment.apiUrl}users/` + user_id + `/follows`);
    }

    FollowingUser(user_id): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}users/` + user_id + `/follows`, {});
    }

    servicesUser(user_id): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}users/` + user_id + `/offerings`, {});
    }

    removeUserFollows(user_id): Observable<any> {
        return this.http.delete(`${environment.apiUrl}users/` + user_id + `/follows`);
    }

    pastOrder(order_status, page, limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}orders?status=${order_status}&page=${page}&limit=${limit}`);
    }
    userPosts(user_id, page, limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}user/userposts/${user_id}?page=${page}&limit=${limit}`);
    }
    userFavPosts(user_id, page, limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}user/likes/${user_id}?page=${page}&limit=${limit}`);
    }

    placeOrder(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}orders` , {});
    }

    followingYou(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}notifications?following=true` );
    }

    likeYourPost(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}notifications` );
    }

    certificateList(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}certificates` );
    }

    addresses(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}addresses` );
    }

    coupon_list(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}coupons` );
    }

    wallet_amount(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}users/fetch_wallet` );
    }

    wallet_commision( page, limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}wallets/commission_list?page=${page}&per_page=${limit}`);
    }

    bank_commision( page, limit): Observable<any> {
        return this.http.get(`${environment.apiUrl}wallet_payment_transaction_histories?page=${page}&limit=${limit}`);
    }

    order_payment(order_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}orders`,order_data );
    }

    add_bankaccount(bank_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}bank_accounts`,bank_data );
    }
 
    wallet_payment(bank_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}wallets/payout`,bank_data );
    }

    claim_salons(cliam_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}claims`,cliam_data );
    }
    claim_salons_edit(cliam_data,salon_id): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}salons/${salon_id}`,cliam_data );
    }

    bank_list(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}bank_accounts` );
        // return this.http.get<any>(`${environment.apiUrl}bank_accounts/get_bank_details` );
    }

    delete_bank(id): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}bank_accounts/${id}` );
    }

    edit_bank(id,bank_data): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}bank_accounts/${id}`,bank_data );
    }

    pay_payment(payment_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}cards`,payment_data );
    }

    card_list(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}cards` );
    }

    delete_address(id): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}addresses/${id}` );
    }

    single_address(id): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}addresses/${id}` );
    }

    create_addresses(adress_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}addresses`,adress_data );
    }

    edit_addresses(id,adress_data): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}addresses/${id}`,adress_data );
    }

    user_conversation(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}conversations`);
    }

    single_conversation(conversationid): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}conversations/${conversationid}/messages`);
    }

    create_conversationid(post_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}conversations`,post_data );
    }

    get_message(post_id): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}conversations/` + post_id + `/messages`);
    }

    post_message(post_id,post_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}conversations/`+ post_id + `/messages`,post_data );
    }

    get_Comments(post_id): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}posts/` + post_id + `/comments` );
    }

    post_Comment(post_id,post_data): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}posts/` + post_id + `/comments`,post_data );
    }

}
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
// import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store.service';


@Injectable()

export class SharedService {
      private search_box = new BehaviorSubject('');
      search_box_value = this.search_box.asObservable();
      private productSearchSource = new BehaviorSubject('');
      currentProductSearchVal = this.productSearchSource.asObservable();
      private sellSearchSource = new BehaviorSubject('');
      currentSellSearchVal = this.sellSearchSource.asObservable();
      private catSearchSource = new BehaviorSubject('');
      catSellSearchVal = this.catSearchSource.asObservable();
      private feedSearchSource = new BehaviorSubject({
            searchType: 'hair_stylist',
            searchValue: ''
      });
      currentFeedSearchVal = this.feedSearchSource.asObservable();

      constructor(
            // private route: ActivatedRoute,
            // private router: Router,
            // private shared: SharedService,
            private storeService: StoreService,
      ) { }
      private _listners = new Subject<any>();
      private _filterlistners = new Subject<any>();
      listen(): Observable<any> {
            return this._listners.asObservable();
      }

      clicked(filterBy: string) {
            this._listners.next(filterBy);
      }

      store_listen(): Observable<any> {
            return this._listners.asObservable();
      }
      filter_listen(): Observable<any> {
            return this._listners.asObservable();
      }

      store_clicked(filterBy: string) {
            this._listners.next(filterBy);
      }
      filter_clicked(filterBy: string) {
            this._listners.next(filterBy);
      }


      qty_listen(): Observable<any> {
            return this._listners.asObservable();
      }
      qty_clicked(filterBy: string) {
            this._listners.next(filterBy);
      }

      addToCartss(productId, count) {
            let product_data = { 'product_id': productId, 'quantity': count }
            this.storeService.addCartProduct(product_data)
                  .subscribe(
                        res => {
                              return res;
                        },
                        err => {
                              console.log(err)
                        }
                  )
      }


      changeProductSearchVal(searchVal: string) {
            this.productSearchSource.next(searchVal);
            //currentProductSearchVal
      }

      changSearchBoxValue(value) {
            this.search_box.next(value);
      }

      saleproductSearchVal(searchVal: string) {
            this.sellSearchSource.next(searchVal);
      }

      catselect_clicked(searchVal: string) {
            this.catSearchSource.next(searchVal);
      }

      // from header set feed search value based on drop down
      changeFeedSearchVal(searchType, searchVal: string) {
            const newVal = {
                  searchType: searchType,
                  searchValue: searchVal
            };
            this.feedSearchSource.next(newVal);
      }

}
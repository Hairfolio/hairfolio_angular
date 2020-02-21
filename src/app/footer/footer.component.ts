import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public store_filters;

  constructor(
    public router: Router,
    public shared: SharedService
  ) { }

  ngOnInit() {
  }
  newarrivalclilk() {
    this.shared.store_clicked('product_details');
    this.store_filters = [{ 'hai_type': 'new_arrivals', 'hai_name': 'New Arrivals' }]
    this.shared.catselect_clicked(this.store_filters);
    this.router.navigate(['/store']);
  }
  topsellerclilk() {
    this.shared.store_clicked('product_details');
    this.store_filters = [{ 'hai_type': 'top_sellers', 'hai_name': 'Top Sellers' }]
    this.shared.catselect_clicked(this.store_filters);
    this.router.navigate(['/store']);
  }

  footerLogoClick(e) {
    this.shared.store_clicked('from_footer');
    this.router.navigate(['/home']);
  }
}

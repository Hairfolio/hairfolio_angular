import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { LoginService } from '../services/login.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  templateUrl: 'blog.component.html',
})

export class BlogComponent implements OnInit {
  @Input('shouldShow')
  public shouldShow: boolean = false;
  public blog_list;
  public blog_details;
  modalRef: BsModalRef;
  public page: number = 1;
  public limit: number = 4;
  constructor(private router: Router, private shared: SharedService, public login: LoginService, private modalService: BsModalService) {
    this.collapsed = true;
    this.shared.listen().subscribe((m: any) => {
      this.searchclick(m);
    })
  }

  openModal(template: TemplateRef<any>, blogDetails) {
    this.blog_details = blogDetails;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-big' })
    );
  }

  searchclick(value) {
    if (value == 'Search click') {
      this.shouldShow = !this.shouldShow;
    }
  }
  private collapsed: boolean;
  public isCollapsed(): boolean {
    return this.collapsed;
  }
  public setCollapsed(): void {
    this.collapsed = false;
  }
  public toggleMenu(): void {
    this.collapsed = !this.collapsed;
  }

  ngOnInit() {
    this.bloglist(this.page, this.limit)
  }

  bloglist(page: number, limit: number) {
    this.login.blogList(page, limit)
      .subscribe(
        res => {
          this.blog_list = res.blogs;
          this.page = res.meta.current_page;
          this.limit = res.meta.total_count;
        },
        err => {
          console.log(err)
        }
      )
  }
}

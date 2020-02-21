import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  public is_logged_in: Boolean = false;
  private toasterService: ToasterService;
  public config: ToasterConfig =
    new ToasterConfig({
      // tapToDismiss: false,
      showCloseButton: true,
            // timeout: 0
      timeout: 3000
    });
  changepassForm: FormGroup;
  public submitted: Boolean = false;
  public sucess_chnage: Boolean = false;
  public chnage_passed;
  public user_id;
  public error;
  constructor(
    public fb: FormBuilder,
    public login: LoginService,
    private route: ActivatedRoute,
    toasterService: ToasterService,
    private router: Router
  ) {
    this.toasterService = toasterService;
    this.is_logged_in = login.loggedIn();
    if (!this.is_logged_in) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.sucess_chnage = false;
    this.route.params.subscribe((param) => {
      this.user_id = atob(param.user_id);
    });
    this.changepassForm = this.fb.group({
      'current_password': new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16), this.noWhitespaceValidator]),
      'password': new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16), this.noWhitespaceValidator]),
      'password_confirmation': new FormControl("", [Validators.required, this.noWhitespaceValidator]),
    })
  }

  noWhitespaceValidator(control: FormControl) {
    let passwordRE = /\s/;
    return passwordRE.test(control.value || '') ? { 'whitespace': true } : null;
  }

  changepassFormSubmit() {
    this.submitted = true;
    if (this.changepassForm.valid) {
      this.chnage_passed = { 'user': this.changepassForm.value }
      this.login.chnagePass(this.chnage_passed)
        .subscribe(
          res => {
            // this.sucess_chnage = true;
            this.changepassForm.reset();
            this.submitted = false;
            // this.toasterService.pop('success', 'Password', 'Updated Sucessfully');
            // window.alert('Password Updated Sucessfully');
              Swal.fire({
                title: 'Success',
                text: 'Password Updated Successfully!!',
                type: 'success',
                confirmButtonText: 'Ok'
              }).then((success)=> {
            this.router.navigate(['/home'])
            });

          },
          err => {
            this.error = err.error.errors;
          }
        )
    }
  }
}

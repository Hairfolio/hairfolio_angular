import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { CustomValidation } from '../helper/customValidation';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FileValidator } from '../helper/fileInputValidator';

@Component({
  templateUrl: 'signup.component.html'
})

export class SignUPComponent implements OnInit {
  private setLocalStorage = [];
  signupForm: FormGroup;
  public error;
  public res_status;
  public referral_name;
  public submitted: Boolean = false;
  public avilable_promo: Boolean = false;
  public aply_code: Boolean = false;
  public emptyreferral;
  public modalRef: BsModalRef;
  public url;
  public validImageType: boolean = true;
  public selectedFile: File;
  public imagePath: any;
  public imageUrl;
  public ext = "";
  public lat = 23.01952;
  public long = 72.5475328;
  public isfileselected: boolean = false;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    public signup: SignupService,
    public fb: FormBuilder,
    public customValidation: CustomValidation
  ) { }

  orderModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg modal-big-shop' })
    );
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
    });
    this.signupForm = this.fb.group({
      'account_type': new FormControl("", Validators.required),
      'email': new FormControl("", [Validators.required, Validators.email, Validators.pattern(this.customValidation.email_pattern)]),
      'password': new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16), this.noWhitespaceValidator]),
      'password_confirmation': new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      'term_check': new FormControl("", Validators.required),
      // 'profile_img': new FormControl("", FileValidator.validate),
      'profile_img': new FormControl(""),
    })
  }

  noWhitespaceValidator(control: FormControl) {
    let passwordRE = /\s/;
    return passwordRE.test(control.value || '') ? { 'whitespace': true } : null;
  }

  checkTerms(event: Event): void {
    if (event.target['checked'] == false) {
      this.signupForm.controls['term_check'].setValue('');
    }
  }

  selectChange(e) {
    this.url = '';
    this.avilable_promo = false;
    for (let control in this.signupForm.controls) {
      if (control !== "account_type") {
        this.signupForm.controls[control].reset();
      }
    }
    this.signupForm.addControl('first_name', new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]));
    this.signupForm.addControl('last_name', new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]));
    this.signupForm.addControl('salonname', new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(this.customValidation.alpha_spaces)]));
    this.signupForm.addControl('brandname', new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(this.customValidation.alpha_spaces)]));

    if (this.signupForm.value.account_type === "consumer") {
      this.signupForm.removeControl('salonname');
      this.signupForm.removeControl('brandname');
    } else if (this.signupForm.value.account_type === "owner") {
      this.signupForm.removeControl('first_name');
      this.signupForm.removeControl('last_name');
      this.signupForm.removeControl('brandname');
    } else if (this.signupForm.value.account_type === "stylist") {
      this.signupForm.removeControl('salonname');
      this.signupForm.removeControl('brandname');
    } else if (this.signupForm.value.account_type === 'ambassador') {
      this.signupForm.removeControl('first_name');
      this.signupForm.removeControl('last_name');
      this.signupForm.removeControl('salonname');
    }
  }

  promocode_remove() {
    this.avilable_promo = false;
    this.signupForm.removeControl('referral_code');
  }

  apply_promo(title) {
    this.aply_code = false;
    this.referral_name = title;
    if (this.referral_name == '') {
      this.emptyreferral = 'Please enter referral code.';
    } else {
      this.aply_code = true;
      this.signup.promocheck(title)
        .subscribe(
          res => {
            this.res_status = res.referral_code_exist;
            if (this.res_status == true) {
              this.modalRef.hide();
              this.avilable_promo = true;
              this.signupForm.addControl('referral_code', new FormControl('', [Validators.required]));
            }
          })
    }
  }

  onFileChange(event) {
    this.ext = "";
    this.validImageType = true;
    this.url = "";
    if (event.target.files[0]) {
      let files = event.target.files;
      this.ext = files[0].name.substring(files[0].name.lastIndexOf('.') + 1);
      this.ext = this.ext.toLowerCase();
      var array = ["jpg", "png", "jpeg"];
      if (array.includes(this.ext)) {
        this.validImageType = true;
      }
      else {
        this.validImageType = false;
        return false;
      }
      this.selectedFile = <File>event.target.files;
      this.isfileselected = true;
      var reader = new FileReader();
      this.imagePath = event.target.files;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.url = reader.result;
      }
    }
  }

  signupFormSubmit() {
    let signup_data = {};
    this.submitted = true;
    if (!this.validImageType) {
      return;
    }
    if (this.signupForm.invalid) {
      return;
    } else {
      var currentDate = (new Date).getTime() + '_';
      const formData: FormData = new FormData();
      formData.append('uploader[image_url]', this.selectedFile[0], `upload_${currentDate}.${this.ext}`);
      formData.append('uploader[folder_name]', 'user');

      this.signup.uploadProfileImage(formData)
        .subscribe(
          imageUrlAmazone => {
            this.imageUrl = imageUrlAmazone.image_url.url;
            if (this.imageUrl) {
              if (this.signupForm.value.account_type === "consumer") {
                // signup_data = { user: { ...this.signupForm.value, avatar_cloudinary_id: `${this.imageUrl}` }, referral_code: this.signupForm.value.referral_code ? this.signupForm.value.referral_code : '',latitude: this.lat, longitude: this.long };
                signup_data = { user: { ...this.signupForm.value, avatar_cloudinary_id: `${this.imageUrl}` }, referral_code: this.signupForm.value.referral_code ? this.signupForm.value.referral_code : '' };
              } else if (this.signupForm.value.account_type === "owner") {
                signup_data = { user: { ...this.signupForm.value, salon_attributes: { name: this.signupForm.value.salonname }, avatar_cloudinary_id: `${this.imageUrl}` }, referral_code: this.signupForm.value.referral_code ? this.signupForm.value.referral_code : '' };
              } else if (this.signupForm.value.account_type === "stylist") {
                signup_data = { user: { ...this.signupForm.value, avatar_cloudinary_id: `${this.imageUrl}` }, referral_code: this.signupForm.value.referral_code ? this.signupForm.value.referral_code : '' };
              } else if (this.signupForm.value.account_type === 'ambassador') {
                signup_data = { user: { ...this.signupForm.value, brand_attributes: { name: this.signupForm.value.brandname }, avatar_cloudinary_id: `${this.imageUrl}` }, referral_code: this.signupForm.value.referral_code ? this.signupForm.value.referral_code : '' };
              }
              this.signup.register(signup_data)
                .subscribe(
                  res => {
                    this.setLocalStorage = [{ 'email': res.user.email, 'token': res.user.id, 'user_type': res.user.account_type, 'user_salon': res.user.salon }]
                    // this.setLocalStorage = [{ 'email': res.user.email, 'token': res.user.id }]
                    localStorage.setItem('user_data', JSON.stringify(this.setLocalStorage))
                    localStorage.setItem('auth_token', res.user.auth_token)
                    this.router.navigate(['/home']);
                    this.isfileselected = false;
                  },
                  err => {
                    this.error = err.error.errors.email[0];
                  }
                )
            }
          },
          err => {
            console.log(err)
          }
        )
    }
  }
}

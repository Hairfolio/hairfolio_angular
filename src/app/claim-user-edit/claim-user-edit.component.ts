import { Component, OnInit } from '@angular/core';
import { SignupService } from '../services/signup.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidation } from '../helper/customValidation';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-claim-user-edit',
  templateUrl: './claim-user-edit.component.html'
})
export class ClaimUserEditComponent implements OnInit {
  max = 5;
  rate = 0;
  isReadonly = false;
  ext = "";
  validImageType: boolean = true;
  submitted: boolean = false;
  url;
  selectedFile: File;
  imagePath: any;
  imageUrl = "";
  info_available = "Yes";
  info_name_available = "Accepts Credit Cards";
  salon_month = "mon";
  salon_open = "2000-01-01T03:30:00.000Z";
  salon_closed = "2000-01-01T03:30:00.000Z";
  claimForm: FormGroup;
  public user_id;
  public user_data;
  public img_uploaded = '';
  public claim_edit_data;
  public salon_timing = [];
  public update_timing = [];
  public update_gallery = [];
  public update_business = [];
  public salon_gallery = [];
  public salon_business = [];

  confirmSelection(event: KeyboardEvent) {
    // console.log('----', this.rate);
  }
  private toasterService: ToasterService;
  public config: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: false,
      timeout: 3000
    });
  constructor(
    public signup: SignupService,
    public fb: FormBuilder,
    private router: Router,
    toasterService: ToasterService,
    private shared: SharedService,
    public customValidation: CustomValidation,
    private route: ActivatedRoute,
    private profileService: ProfileService,
  ) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.route.params.subscribe((param) => {
      this.user_id = param.post_id;
      this.getSalonBYid(this.user_id);
    });
    this.claimForm = this.fb.group({
      'name': new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.customValidation.alpha_spaces), this.trimValidator, this.lengthValidator]),
      'city': new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(this.customValidation.alpha_spaces), this.trimValidator, this.lengthValidator]),
      'info': new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(300), this.trimValidator, this.lengthValidator]),
      'address': new FormControl("", [Validators.required, Validators.minLength(2), this.trimValidator, this.lengthValidator]),
      'specialities': new FormControl("", [Validators.required, Validators.minLength(2), this.trimValidator, this.lengthValidator]),
      'state': new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(this.customValidation.alpha_spaces), this.trimValidator, this.lengthValidator]),
      'phone': new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(this.customValidation.numeric_specialchar)]),
      'website': new FormControl("", [Validators.required]),
      'zip': new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(6), Validators.pattern(this.customValidation.numeric)]),
    })
    this.update_timing = [];
    this.update_gallery = [];
    this.update_business = [];
  }

  trimValidator: ValidatorFn = (control: FormControl) => {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  };

  lengthValidator: ValidatorFn = (control: FormControl) => {
    let lengthCheck = (control.value || '').trim().length < 2;
    let isValid = !lengthCheck;
    return isValid ? null : { 'lengthCheck': true }
  };

  onFileGalleryChange(data) {
    this.img_uploaded = '';
    if (data[0].type.slice(0, 5) == 'image' && data[0].name != null) {
      let formData = new FormData();
      formData.append("uploader[folder_name]", "user");
      formData.append("uploader[image_url]", data[0], data[0].name);
      this.signup.uploadProfileImage(formData).subscribe(res => {
        this.img_uploaded = res.image_url.url;
        this.salon_gallery.push({ "image_url": this.img_uploaded })
        this.update_gallery.push({ "image_url": this.img_uploaded })
      });
    }
  }

  onFileChange(event) {
    this.imageUrl = "";
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
      } else {
        this.validImageType = false;
        return false;
      }
      this.selectedFile = <File>event.target.files;
      var reader = new FileReader();
      this.imagePath = event.target.files;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.url = reader.result;
      }
    }
  }

  getSalonBYid(userID) {
    this.profileService.getSalon(userID)
      .subscribe(
        res => {
          this.user_data = res.salon;
          this.claimForm.patchValue({
            name: this.user_data.name,
            city: this.user_data.city,
            address: this.user_data.address,
            info: this.user_data.info,
            state: this.user_data.state,
            specialities: this.user_data.specialities,
            phone: this.user_data.phone,
            website: this.user_data.website,
            zip: this.user_data.zip,
          });
          this.rate = this.user_data.rating;
          if (this.user_data.owner.avatar_cloudinary_id != '' || null) {
            this.url = this.user_data.owner.avatar_cloudinary_id;
            this.imageUrl = this.user_data.owner.avatar_cloudinary_id;
          }
          this.salon_timing = this.user_data.salon_timings;
          this.salon_gallery = this.user_data.salon_images;
          this.salon_business = this.user_data.salon_business_infos;
        },
        err => {
          console.log(err)
        }
      )
  }

  timing_remove(item, time_id) {
    this.salon_timing.splice(item, 1);
    this.update_timing.push({ "id": time_id, "_destroy": true })
  }

  business_remove(item, info_id) {
    this.salon_business.splice(item, 1);
    this.update_business.push({ "id": info_id, "_destroy": true })
  }

  gallery_remove(item, gallery_id) {
    this.salon_gallery.splice(item, 1);
    this.update_gallery.push({ "id": gallery_id, "_destroy": true })
  }

  selectChange(e) {
    this.salon_month = e.target.value;
  }

  selectChange_value(e) {
    this.info_available = e.target.value;
  }

  selectChange_value_service(e) {
    this.info_name_available = e.target.value;
  }

  selectChange_open(e) {
    this.salon_open = e.target.value;
  }

  selectChange_closed(e) {
    this.salon_closed = e.target.value;
  }

  hores_add() {
    this.salon_timing.push({ "week_day": this.salon_month, "open_time": this.salon_open, "close_time": this.salon_closed })
    this.update_timing.push({ "week_day": this.salon_month, "open_time": this.salon_open, "close_time": this.salon_closed })
  }

  info_add() {
    this.salon_business.push({ "info_name": this.info_name_available, "info_value": this.info_available })
    this.update_business.push({ "info_name": this.info_name_available, "info_value": this.info_available })
  }

  onClaimEdit(id) {
    this.submitted = true;
    if (this.claimForm.valid) {
      if (this.url && this.imageUrl == '') {
        var currentDate = (new Date).getTime() + '_';
        const formData: FormData = new FormData();
        formData.append('uploader[image_url]', this.selectedFile[0], `upload_${currentDate}.${this.ext}`);
        formData.append('uploader[folder_name]', 'user');
        this.signup.uploadProfileImage(formData)
          .subscribe(
            imageUrlAmazone => {
              this.imageUrl = imageUrlAmazone.image_url.url;
              this.claim_edit_data = {
                "salon": {
                  "city": this.claimForm.controls.city.value.trim(),
                  "state": this.claimForm.controls.state.value.trim(),
                  "info": this.claimForm.controls.info.value.trim(),
                  "name": this.claimForm.controls.name.value.trim(),
                  "phone": this.claimForm.controls.phone.value.trim(),
                  "address": this.claimForm.controls.address.value.trim(),
                  "specialities": this.claimForm.controls.specialities.value.trim(),
                  "website": this.claimForm.controls.website.value.trim(),
                  "zip": this.claimForm.controls.zip.value.trim(),
                  // "rating": this.rate,
                  "salon_timings_attributes": this.update_timing,
                  "salon_business_infos_attributes": this.update_business,
                  "salon_images_attributes": this.update_gallery,
                  "owner_attributes": {
                    "id": this.user_data.owner.id,
                    "avatar_cloudinary_id": this.imageUrl
                  }
                }
              };
              this.profileService.claim_salons_edit(this.claim_edit_data, id)
                .subscribe(
                  res => {
                    this.submitted = false;
                    Swal.fire({
                      title: 'Success',
                      text: 'Claim Info Updated Successfully!!',
                      type: 'success',
                      confirmButtonText: `Ok`
                    }).then((success) => {
                      this.router.navigate(['/profile', btoa(this.user_id)], { queryParams: { salon_title: 'salons' } });
                    });
                  },
                  err => {
                    console.log(err)
                  }
                )
            });

      } else {
        this.claim_edit_data = {
          "salon": {
            "city": this.claimForm.controls.city.value.trim(),
            "state": this.claimForm.controls.state.value.trim(),
            "info": this.claimForm.controls.info.value.trim(),
            "name": this.claimForm.controls.name.value.trim(),
            "phone": this.claimForm.controls.phone.value.trim(),
            "address": this.claimForm.controls.address.value.trim(),
            "specialities": this.claimForm.controls.specialities.value.trim(),
            "website": this.claimForm.controls.website.value.trim(),
            "zip": this.claimForm.controls.zip.value.trim(),
            // "rating": this.rate,
            "salon_timings_attributes": this.update_timing,
            "salon_images_attributes": this.update_gallery,
            "salon_business_infos_attributes": this.update_business
          }
        };
        this.profileService.claim_salons_edit(this.claim_edit_data, id)
          .subscribe(
            res => {
              // this.toasterService.pop('success', 'Claim Info', 'Upadted Sucessfully');
              // this.claimForm.reset();
              this.submitted = false;
              // window.alert('Claim Info Updated Sucessfully');
              // this.router.navigate(['/profile', btoa(this.user_id)], { queryParams: { salon_title: 'salons' } });
              Swal.fire({
                title: 'Success',
                text: 'Claim Info Updated Successfully!!',
                type: 'success',
                // confirmButtonText: `<a href="/profile/${this.user_id}?salon_title=salons">Ok</a>`
                confirmButtonText: `Ok`
              }).then((success) => {
                this.router.navigate(['/profile', btoa(this.user_id)], { queryParams: { salon_title: 'salons' } });
              });
            },
            err => {
              console.log(err)
            }
          )
      }
    }
  }

}

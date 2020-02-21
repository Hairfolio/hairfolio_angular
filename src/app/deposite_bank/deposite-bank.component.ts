import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomValidation } from '../helper/customValidation';
import { ProfileService } from '../services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deposite-bank',
  templateUrl: './deposite-bank.component.html'
})
export class DepositeBankComponent implements OnInit {

  bankForm: FormGroup;
  public bank_datas;
  public bank_res;
  public error;
  public wallet_data;
  public list_bank;
  public bankname;
  public deposite_amount;
  public order_created = new Date();
  public obj_length;
  bank_submit: Boolean = false;
  payment_sucess: Boolean = false;
  payment_sucess_button: Boolean = false;
  edit_clilk: Boolean = false;
  errorss: Boolean = false;

  constructor(
    public fb: FormBuilder,
    public customValidation: CustomValidation,
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParam) => {
      this.deposite_amount = atob(queryParam.banksname);
    })
    this.wallet_amounts();
    this.bank_lists();
    this.bankForm = this.fb.group({
      'country': new FormControl('US', Validators.required),
      'currency': new FormControl('USD', Validators.required),
      'account_holder_name': new FormControl("", [Validators.required, Validators.minLength(2), Validators.pattern(this.customValidation.alpha_spaces)]),
      'account_number': new FormControl("", [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(this.customValidation.numeric)]),
      'routing_number': new FormControl("", [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(this.customValidation.numeric)]),
    })
  }

  bank_lists() {
    this.profileService.bank_list()
      .subscribe(
        res => {
          this.list_bank = res.bank_accounts;
          this.bankname = 'stirpe bank';
          // this.bankname = res.bank_name;
          // this.obj_length = Object.keys(this.list_bank).length;
        },
        err => {
          console.log(err)
        }
      )
  }

  edit_account() {
    this.edit_clilk = true;
    this.bankForm.patchValue({
      account_holder_name: this.list_bank.account_holder_name,
      account_holder_type: this.list_bank.account_holder_type
    });
  }

  onEditSubmit() {
    this.bank_submit = true;
    let bank_data = { 'bank_account': { 'account_holder_name': this.bankForm.value.account_holder_name, 'account_holder_type': this.bankForm.value.account_holder_type } }
    this.profileService.edit_bank(this.list_bank.id, bank_data)
      .subscribe(
        res => {
          this.bankForm.controls['account_holder_name'].reset();
          this.bankForm.controls['account_holder_type'].reset();
          this.bank_submit = false;
          this.edit_clilk = false;
          this.bank_lists();
        }
      )
  }

  radioSelect(data) {
    let bank_data = { 'bank_account': { 'account_holder_name': data.account_holder_name, 'account_holder_type': "individual", 'default_for_currency': true } }
    this.profileService.edit_bank(data.id, bank_data)
      .subscribe(
        res => {
          this.bank_lists();
        }
      )
  }

  wallet_amounts() {
    this.profileService.wallet_amount()
      .subscribe(
        res => {
          this.wallet_data = res.wallet;
        },
        err => {
          console.log(err)
        }
      )
  }

  back_home() {
    this.router.navigate(['/home']);
  }

  delete_account(id) {
    this.profileService.delete_bank(id)
      .subscribe(
        res => {
          this.bank_lists();
        },
        err => {
          console.log(err)
        }
      )
  }

  bankFormSubmit() {
    this.bank_submit = true;
    if (this.bankForm.valid) {
    this.payment_sucess_button = true;
      this.bank_datas = { 'bank_account': { ...this.bankForm.value, account_holder_type: 'individual' } }
      this.profileService.add_bankaccount(this.bank_datas)
        .subscribe(
          res => {
            this.bank_res = res;
            this.bankname = res.bank_name;
            this.bankForm.reset();
            this.bank_submit = false;
            this.pay_wallet(this.bank_res.id);
          },
          err => {
            this.error = err.error.errors;
          }
        )
    }
  }

  pay_wallet(pay_id) {
    this.payment_sucess_button = true;
    let payment_data = { 'bank_account_id': pay_id }
    this.profileService.wallet_payment(payment_data)
      .subscribe(
        res => {
          this.payment_sucess = true;
          this.payment_sucess_button = false;
        },
        err => {
          this.errorss = err.error.errors;
        }
      )
  }

}

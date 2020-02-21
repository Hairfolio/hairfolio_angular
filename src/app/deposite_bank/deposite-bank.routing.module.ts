import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepositeBankComponent } from './deposite-bank.component';


const routes: Routes = [
  {
    path: '',
    component: DepositeBankComponent,
    data: {
      title: 'depositebank'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositebankRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUPComponent } from './signup.component';

const routes: Routes = [
  {
    path: '',
    component: SignUPComponent,
    data: {
      title: 'signup'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUPRoutingModule { }

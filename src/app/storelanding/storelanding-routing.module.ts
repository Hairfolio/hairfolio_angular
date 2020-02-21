import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreLandingComponent } from './storelanding.component';

const routes: Routes = [
  {
    path: '',
    component: StoreLandingComponent,
    data: {
      title: 'Home'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreLandingRoutingModule { }

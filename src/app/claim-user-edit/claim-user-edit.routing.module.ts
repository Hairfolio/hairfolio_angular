import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimUserEditComponent } from './claim-user-edit.component';


const routes: Routes = [
  {
    path: '',
    component: ClaimUserEditComponent,
    data: {
      title: 'depositebank'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimusereditRoutingModule { }

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { StoreListComponent } from './storelisting.component';

const routes: Routes = [
    {
        path: '',
        component: StoreListComponent,
        data: {
            title: 'Store Listing'
        }
    },
    {
        path: '/:is_from_search',
        component: StoreListComponent,
        data: {
            title: 'Store Listing'
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [],
    providers: []
})

export class StoreListRouting { }
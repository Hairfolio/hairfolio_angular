import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { PostDetailsComponent } from './post_details.component';

const routes: Routes = [
    {
        path: '',
        component: PostDetailsComponent,
        data: {
            title: 'Post Details'
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [],
    providers: []
})

export class PostDetailsRouting { }
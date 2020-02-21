import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { LogDetailsComponent } from "./log-details.component";

const routes: Routes = [
    {
        path: '',
        component: LogDetailsComponent,
        data: {
            title: 'Log Details'
        }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [],
    providers: []
})

export class LogDetailsRouting { }
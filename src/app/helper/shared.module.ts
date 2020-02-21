import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { CustomFilter}         from './customFilter';
import { NumberDirective } from '../directive/numbers-only.directive';
import { ImagePreloader } from './img-preload';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NumberDirective,
    ImagePreloader
  ],
  exports: [
    NumberDirective,
    ImagePreloader
  ],
  providers: [
    // Providers here...
  ]
})
export class SharedModule { }
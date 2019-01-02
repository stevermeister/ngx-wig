import { NgModule } from '@angular/core';
import { NgxWigComponent } from './ngx-wig.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NgxWigComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [NgxWigComponent]
})
export class NgxWigModule { }

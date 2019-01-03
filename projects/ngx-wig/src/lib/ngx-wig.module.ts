import { NgModule } from '@angular/core';
import { NgxWigComponent } from './ngx-wig.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [NgxWigComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [NgxWigComponent]
})
export class NgxWigModule { }

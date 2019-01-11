import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxWigComponent } from './ngx-wig.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


export function getWindowObject(): Window {
  return window;
}

@NgModule({
  declarations: [
    NgxWigComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [NgxWigComponent],
  providers: [
    { provide: 'WINDOW', useFactory: getWindowObject },
  ]
})
export class NgxWigModule { }

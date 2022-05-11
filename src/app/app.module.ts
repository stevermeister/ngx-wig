import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxWigComponent, NgxWigModule } from 'ngx-wig';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const DEFAULT_LIBRARY_BUTTONS = {
  bold: {
    label: 'B',
    title: 'Bold',
    command: 'bold',
    styleClass: 'bold',
    icon: 'icon-bold'
  },
  italic: {
    label: 'I',
    title: 'Italic',
    command: 'italic',
    styleClass: 'italic',
    icon: 'icon-italic'
  },
  fontName: {
    label: 'F',
    title: 'Font name',
    command: (ctx: NgxWigComponent, valueToSet: string) => {
      ctx.execCommand('fontName',valueToSet)
    },
    styleClass: 'italic',
    options: [
      'Arial',
      'Courier',
      'Times'
    ]
  },
  headings: {
    label: 'H',
    title: 'Headings',
    command: (ctx: NgxWigComponent, valueToSet: string) => {
      ctx.execCommand('formatBlock', valueToSet);
    },
    options: [
      'h1', 'h2', 'h3'
    ]
  }
};


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxWigModule.forRoot({ buttonsConfig: DEFAULT_LIBRARY_BUTTONS } ),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

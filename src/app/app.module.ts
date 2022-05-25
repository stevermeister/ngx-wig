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
      {label: 'Arial', value: 'Arial'},
      {label: 'Courier', value: 'Courier'},
      {label: 'Times', value:'Times'}
    ]
  },
  headings: {
    label: 'H',
    title: 'Headings',
    command: (ctx: NgxWigComponent, valueToSet: string) => {
      ctx.execCommand('formatBlock', valueToSet);
    },
    options: [
      {label: 'Paragraph', value: 'p'},
      {label: 'Heading 1', value: 'h1'},
      {label: 'Heading 2', value: 'h2'},
      {label: 'Heading 3', value: 'h3'},
      {label: 'Heading 4', value: 'h4'},
      {label: 'Heading 5', value: 'h5'},
    ]
  },
  specialChar: {
    label: 'à',
    title: 'Accented Characters',
    command: (ctx: NgxWigComponent, valueToSet: string) => {
      ctx.execCommand('insertText', valueToSet)
    },
    options: [
      {label: 'à', value: 'à'},
      {label: 'è', value: 'è'},
      {label: 'é', value: 'é'},
      {label: 'ì', value: 'ì'},
      {label: 'ò', value: 'ò'},
      {label: 'ù', value: 'ù'}
    ],
    isDropdown: true,
    visibleDropdown: false
  },
  removeFormatting: {
    label: 'R',
    title: 'Remove formatting',
    command: 'removeFormat'
  },
  smallcaps: {
    label: 'S',
    title: 'Small-caps',
    command: (ctx: NgxWigComponent) => {
      setSmallcaps(ctx);
    }
  }
};

function setSmallcaps(ctx: NgxWigComponent) {
  console.log(ctx);
  let selection = window?.getSelection()?.getRangeAt(0).cloneContents();
  if (selection !== undefined) {
      if (window.getSelection()?.getRangeAt(0).startOffset !== window.getSelection()?.getRangeAt(0).endOffset) {
          // console.log(window?.getSelection()?.getRangeAt(0).commonAncestorContainer.parentElement)
          if (window?.getSelection()?.getRangeAt(0).commonAncestorContainer.parentElement?.className === 'smallcaps') {
              // console.log(window?.getSelection()?.getRangeAt(0).commonAncestorContainer.parentElement?.innerHTML)
              window.getSelection()?.getRangeAt(0).commonAncestorContainer.parentElement?.remove();
              ctx.execCommand('insertHTML', selection?.textContent ? selection.textContent : '');
          } else {
              let span = document.createElement('span');
              span.appendChild(selection);
              let wrappedselection = '<span class="smallcaps" style="font-variant: small-caps;">' + span.innerHTML + '</span>';
              ctx.execCommand('insertHTML', wrappedselection);
          }
      }
  }
}


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

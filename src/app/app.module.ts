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
    children: [
      {
        label: 'Arial',
        title: 'Arial',
        command: (ctx: NgxWigComponent) => {
          ctx.execCommand('fontName', 'Arial')
        },
        styleClass: 'font-arial'
      },
      {
        label: 'Courier',
        title: 'Courier',
        command: (ctx: NgxWigComponent) => {
          ctx.execCommand('fontName', 'Courier')
        },
        styleClass: 'font-courier'
      },
      {
        label: 'Times',
        title: 'Times',
        command: (ctx: NgxWigComponent) => {
          ctx.execCommand('fontName', 'Times')
        },
        styleClass: 'font-times'
      }
    ]
  },
  specialChar: {
    label: 'à',
    title: 'Accented Characters',
    children: [
      {
        label: 'à',
        title: 'à',
        command: (ctx: NgxWigComponent) => {
          ctx.execCommand('insertText', 'à')
        }
      },
      {
        label: 'è',
        title: 'è',
        command: (ctx: NgxWigComponent) => {
          ctx.execCommand('insertText', 'è')
        }
      },
      {
        label: 'é',
        title: 'é',
        command: (ctx: NgxWigComponent) => {
          ctx.execCommand('insertText', 'é')
        }
      },
      {
        label: 'ì',
        title: 'ì',
        command: (ctx: NgxWigComponent) => {
          ctx.execCommand('insertText', 'ì')
        }
      },
      {
        label: 'ò',
        title: 'ò',
        command: (ctx: NgxWigComponent) => {
          ctx.execCommand('insertText', 'ò')
        }
      },
      {
        label: 'ù',
        title: 'ù',
        command: (ctx: NgxWigComponent) => {
          ctx.execCommand('insertText', 'ù')
        }
      },
    ],
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
          if (window?.getSelection()?.getRangeAt(0).commonAncestorContainer.parentElement?.className === 'smallcaps') {
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

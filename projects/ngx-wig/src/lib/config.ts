import { InjectionToken } from '@angular/core';
import { NgxWigComponent } from './ngx-wig.component';

export type CommandFunction = (ctx: NgxWigComponent) => void;

export interface TButton {
  label?: string;
  icon?: string;
  title?: string;
  children?: TButton[];
  command?: string | CommandFunction;
  styleClass?: string;
  visibleDropdown?: boolean;
}

export interface TButtonLibrary {
  [name: string]: TButton;
}

export const DEFAULT_LIBRARY_BUTTONS: TButtonLibrary = {
  list1: {
    label: 'UL',
    title: 'Unordered List',
    command: 'insertunorderedlist',
    styleClass: 'nw-list-ul',
    icon: 'nwicon-list-ul'
  },
  list2: {
    label: 'OL',
    title: 'Ordered List',
    command: 'insertorderedlist',
    styleClass: 'nw-list-ol',
    icon: 'nwicon-list-ol'
  },
  bold: {
    label: 'B',
    title: 'Bold',
    command: 'bold',
    styleClass: 'nw-bold',
    icon: 'nwicon-bold'
  },
  italic: {
    label: 'I',
    title: 'Italic',
    command: 'italic',
    styleClass: 'nw-italic',
    icon: 'nwicon-italic'
  },
  link: {
    label: 'Link',
    title: 'Link',
    command: 'createlink',
    styleClass: 'nw-link',
    icon: 'nwicon-link'
  },
  underline: {
    label: 'U',
    title: 'Underline',
    command: 'underline',
    styleClass: 'nw-format-underlined',
    icon: 'nwicon-underline'
  }
};

export const CUSTOM_LIBRARY_BUTTONS: TButtonLibrary = {
  edithtml: {
    label: 'Edit HTML',
    title: 'Edit HTML',
    command: (ctx: NgxWigComponent) => {
      ctx.editMode = !ctx.editMode;
    },
    styleClass: 'nw-button--source',
    icon: '',
  }
};


export const BUTTONS = new InjectionToken<TButton[][]>('BUTTONS');

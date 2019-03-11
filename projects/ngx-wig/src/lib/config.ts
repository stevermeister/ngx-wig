import { InjectionToken } from '@angular/core';

export type TButton = {
  label?: string;
  icon?: string;
  title?: string;
  command?: string;
  styleClass?: string;
  pluginName?: string;
  isComplex?: boolean;
};

export type TButtonLibrary = {
  [name: string]: TButton;
};

export const DEFAULT_LIBRARY_BUTTONS: TButtonLibrary = {
  list1: {
    label: 'UL',
    title: 'Unordered List',
    command: 'insertunorderedlist',
    styleClass: 'list-ul',
    icon: 'icon-list-ul'
  },
  list2: {
    label: 'OL',
    title: 'Ordered List',
    command: 'insertorderedlist',
    styleClass: 'list-ol',
    icon: 'icon-list-ol'
  },
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
  link: {
    label: 'Link',
    title: 'Link',
    command: 'createlink',
    styleClass: 'link',
    icon: 'icon-link'
  },
  underline: {
    label: 'U',
    title: 'Underline',
    command: 'underline',
    styleClass: 'format-underlined',
    icon: 'icon-underline'
  }
};

export const BUTTONS = new InjectionToken<TButton[][]>('BUTTONS');

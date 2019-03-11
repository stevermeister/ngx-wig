import { Injectable } from '@angular/core';

export type TButton = {
    label?:string,
    icon?: string,
    title?: string,
    command?: string,
    styleClass?: string,
    pluginName?: string,
    isComplex?: boolean
  };

  export type TButtonLibrary = {
    [name: string]: TButton
  };

  @Injectable({
    providedIn: 'root'
  })
  export class NgxWigToolbarService {

    private _buttonLibrary: TButtonLibrary = {
      list1: { label: 'UL', title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'list-ul', icon: 'icon-list-ul' },
      list2: { label: 'OL', title: 'Ordered List', command: 'insertorderedlist', styleClass: 'list-ol', icon: 'icon-list-ol'},
      bold: { label: 'B', title: 'Bold', command: 'bold', styleClass: 'bold', icon: 'icon-bold' },
      italic: { label: 'I', title: 'Italic', command: 'italic', styleClass: 'italic', icon: 'icon-italic' },
      link: { label: 'Link', title: 'Link', command: 'createlink', styleClass: 'link', icon: 'icon-link'},
      underline: { label: 'U', title: 'Underline', command: 'underline', styleClass: 'format-underlined', icon: 'icon-underline' }
    };

    private _defaultButtonsList = ['list1', 'list2', 'bold', 'italic', 'link'];

    public setButtons(buttons: string[]): void {
      // if(!angular.isArray(buttons)) {
      //   throw 'Argument "buttons" should be an array';
      // }

      this._defaultButtonsList = buttons;
    };

    public addStandardButton(
      name: string,
      title: string,
      command: string,
      styleClass: string,
      icon: string
    ) {

      if (!name || !title || !command) {
        throw 'Arguments "name", "title" and "command" are required';
      }

      styleClass = styleClass || '';
      this._buttonLibrary[name] = { title, command, styleClass, icon};
      this._defaultButtonsList.push(name);
    }

    public addCustomButton(name: string, pluginName: string): void {
      if (!name || !pluginName) {
        throw 'Arguments "name" and "pluginName" are required';
      }

      this._buttonLibrary[name] = {pluginName: pluginName, isComplex: true};
      this._defaultButtonsList.push(name);
    }

    public getToolbarButtons(buttonsList?: string): {}[] {
      let buttons = this._defaultButtonsList;
      const toolbarButtons: TButton[] = [];

      if (typeof buttonsList !== 'undefined') {
        buttons = string2array(buttonsList);
      }

      buttons.forEach(buttonKey => {
        if (!buttonKey) {
          return;
        }

        if (!this._buttonLibrary[buttonKey]) {
          throw 'There is no "' + buttonKey + '" in your library. Possible variants: ' + Object.keys(this._buttonLibrary);
        }

        let button = Object.assign({}, this._buttonLibrary[buttonKey]);
        // button.isActive = () => {return !!this.command && document.queryCommandState(this.command);}
        toolbarButtons.push(button);
      });

      return toolbarButtons;
    }

  }

  function string2array(keysString: string) {
    return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
  }
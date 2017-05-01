import { Injectable } from '@angular/core';

@Injectable()
export class Ng2WigToolbarService {

  private _buttonLibrary = {
  list1: {title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'list-ul'},
  list2: {title: 'Ordered List', command: 'insertorderedlist', styleClass: 'list-ol'},
  bold: {title: 'Bold', command: 'bold', styleClass: 'bold'},
  italic: {title: 'Italic', command: 'italic', styleClass: 'italic'},
  link: {title: 'Link', command: 'createlink', styleClass: 'link'}
};
  private _defaultButtonsList = ['list1', 'list2', 'bold', 'italic', 'link'];

  constructor() { }

  setButtons(buttons: string[]) {
    // if(!angular.isArray(buttons)) {
    //   throw 'Argument "buttons" should be an array';
    // }

    this._defaultButtonsList = buttons;
  };

  addStandardButton(name: string, title: string, command: string, styleClass: string) {
    if(!name || !title || !command) {
      throw 'Arguments "name", "title" and "command" are required';
    }

    styleClass = styleClass || '';
    this._buttonLibrary[name] = {title: title, command: command, styleClass: styleClass};
    this._defaultButtonsList.push(name);
  }

  addCustomButton(name: string, pluginName: string) {
    if (!name || !pluginName) {
      throw 'Arguments "name" and "pluginName" are required';
    }

    this._buttonLibrary[name] = {pluginName: pluginName, isComplex: true};
    this._defaultButtonsList.push(name);
  }

  getToolbarButtons(buttonsList?: string): string[] {
    let buttons = this._defaultButtonsList;
    const toolbarButtons: string[] = [];

    if (typeof buttonsList !== 'undefined') {
      buttons = buttonsList.split(',');
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

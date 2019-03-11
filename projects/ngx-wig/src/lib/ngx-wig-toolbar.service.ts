import { Injectable, Inject } from '@angular/core';
import { TButtonLibrary, TButton, BUTTONS } from './config';

@Injectable({
  providedIn: 'root'
})
export class NgxWigToolbarService {
  private _defaultButtonsList: string[] = []
  private _buttonLibrary: TButtonLibrary;

  constructor( @Inject(BUTTONS) buttonLibraryConfig: TButtonLibrary[]) {
    this._buttonLibrary = buttonLibraryConfig.reduce((acc:TButtonLibrary, val:TButtonLibrary) => Object.assign({}, acc, val));
    this._defaultButtonsList = Object.keys(this._buttonLibrary);
  }

  public setButtons(buttons: string[]): void {
    // if(!angular.isArray(buttons)) {
    //   throw 'Argument "buttons" should be an array';
    // }

    this._defaultButtonsList = buttons;
  }

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
    this._buttonLibrary[name] = { title, command, styleClass, icon };
    this._defaultButtonsList.push(name);
  }

  public addCustomButton(name: string, pluginName: string): void {
    if (!name || !pluginName) {
      throw 'Arguments "name" and "pluginName" are required';
    }

    this._buttonLibrary[name] = { pluginName: pluginName, isComplex: true };
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
        throw 'There is no "' +
          buttonKey +
          '" in your library. Possible variants: ' +
          Object.keys(this._buttonLibrary);
      }

      let button = Object.assign({}, this._buttonLibrary[buttonKey]);
      // button.isActive = () => {return !!this.command && document.queryCommandState(this.command);}
      toolbarButtons.push(button);
    });

    return toolbarButtons;
  }
}

function string2array(keysString: string) {
  return keysString
    .split(',')
    .map(Function.prototype.call, String.prototype.trim);
}

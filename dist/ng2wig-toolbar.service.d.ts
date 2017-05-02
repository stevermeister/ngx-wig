export declare class Ng2WigToolbarService {
    private _buttonLibrary;
    private _defaultButtonsList;
    constructor();
    setButtons(buttons: string[]): void;
    addStandardButton(name: string, title: string, command: string, styleClass: string): void;
    addCustomButton(name: string, pluginName: string): void;
    getToolbarButtons(buttonsList?: string): {}[];
}

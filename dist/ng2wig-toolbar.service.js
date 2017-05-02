import { Injectable } from '@angular/core';
var Ng2WigToolbarService = (function () {
    function Ng2WigToolbarService() {
        this._buttonLibrary = {
            list1: { title: 'Unordered List', command: 'insertunorderedlist', styleClass: 'list-ul' },
            list2: { title: 'Ordered List', command: 'insertorderedlist', styleClass: 'list-ol' },
            bold: { title: 'Bold', command: 'bold', styleClass: 'bold' },
            italic: { title: 'Italic', command: 'italic', styleClass: 'italic' },
            link: { title: 'Link', command: 'createlink', styleClass: 'link' }
        };
        this._defaultButtonsList = ['list1', 'list2', 'bold', 'italic', 'link'];
    }
    Ng2WigToolbarService.prototype.setButtons = function (buttons) {
        // if(!angular.isArray(buttons)) {
        //   throw 'Argument "buttons" should be an array';
        // }
        this._defaultButtonsList = buttons;
    };
    ;
    Ng2WigToolbarService.prototype.addStandardButton = function (name, title, command, styleClass) {
        if (!name || !title || !command) {
            throw 'Arguments "name", "title" and "command" are required';
        }
        styleClass = styleClass || '';
        this._buttonLibrary[name] = { title: title, command: command, styleClass: styleClass };
        this._defaultButtonsList.push(name);
    };
    Ng2WigToolbarService.prototype.addCustomButton = function (name, pluginName) {
        if (!name || !pluginName) {
            throw 'Arguments "name" and "pluginName" are required';
        }
        this._buttonLibrary[name] = { pluginName: pluginName, isComplex: true };
        this._defaultButtonsList.push(name);
    };
    Ng2WigToolbarService.prototype.getToolbarButtons = function (buttonsList) {
        var _this = this;
        var buttons = this._defaultButtonsList;
        var toolbarButtons = [];
        if (typeof buttonsList !== 'undefined') {
            buttons = buttonsList.split(',');
        }
        buttons.forEach(function (buttonKey) {
            if (!buttonKey) {
                return;
            }
            if (!_this._buttonLibrary[buttonKey]) {
                throw 'There is no "' + buttonKey + '" in your library. Possible variants: ' + Object.keys(_this._buttonLibrary);
            }
            var button = Object.assign({}, _this._buttonLibrary[buttonKey]);
            // button.isActive = () => {return !!this.command && document.queryCommandState(this.command);}
            toolbarButtons.push(button);
        });
        return toolbarButtons;
    };
    return Ng2WigToolbarService;
}());
export { Ng2WigToolbarService };
Ng2WigToolbarService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Ng2WigToolbarService.ctorParameters = function () { return []; };

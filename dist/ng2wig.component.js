import { Component, Input, ViewEncapsulation, forwardRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Ng2WigToolbarService } from './ng2wig-toolbar.service';
var Ng2WigComponent = (function () {
    function Ng2WigComponent(_ngWigToolbarService) {
        this._ngWigToolbarService = _ngWigToolbarService;
        this.contentChange = new EventEmitter();
        this.isSourceModeAllowed = true;
        this.editMode = false;
        this.toolbarButtons = [];
        this.hasFocus = false;
        this.propagateChange = function (_) { };
    }
    Ng2WigComponent.prototype.toggleEditMode = function () {
        this.editMode = !this.editMode;
    };
    Ng2WigComponent.prototype.execCommand = function (command, options) {
        if (this.editMode) {
            return false;
        }
        if (document.queryCommandSupported && !document.queryCommandSupported(command)) {
            throw 'The command "' + command + '" is not supported';
        }
        if (command === 'createlink' || command === 'insertImage') {
            options = window.prompt('Please enter the URL', 'http://');
            if (!options) {
                return;
            }
        }
        // use insertHtml for `createlink` command to account for IE/Edge purposes, in case there is no selection
        var selection = document.getSelection().toString();
        if (command === 'createlink' && selection === '') {
            document.execCommand('insertHtml', false, '<a href="' + options + '">' + options + '</a>');
        }
        else {
            document.execCommand(command, false, options);
        }
    };
    Ng2WigComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.toolbarButtons = this._ngWigToolbarService.getToolbarButtons(this.buttons);
        function string2array(keysString) {
            return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
        }
        this.container = this.ng2wigEditable.nativeElement;
        if (this.content) {
            this.container.innerHTML = this.content;
        }
        // view --> model
        ('keyup change focus click'.split(' ')).forEach(function (event) {
            return _this.container.addEventListener(event, function () {
                _this.content = _this.container.innerHTML;
                _this.contentChange.emit(_this.content);
            }, false);
        });
    };
    Ng2WigComponent.prototype.ngOnChanges = function (changes) {
        if (this.container) {
            this.container.innerHTML = changes['content'].currentValue;
        }
    };
    Ng2WigComponent.prototype.onChange = function (event) {
        // model -> view
        this.container.innerHTML = this.content;
    };
    Ng2WigComponent.prototype.writeValue = function (value) {
        if (value) {
            this.content = value;
        }
    };
    Ng2WigComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    Ng2WigComponent.prototype.registerOnTouched = function () { };
    Ng2WigComponent.prototype.shouldShowPlaceholder = function () {
        return this.placeholder
            && !this.hasFocus
            && !this.container.innerText;
    };
    return Ng2WigComponent;
}());
export { Ng2WigComponent };
Ng2WigComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng2wig',
                template: "\n              <div class=\"ng-wig\">\n                <ul class=\"nw-toolbar\"\n                    *ngIf=\"toolbarButtons.length\">\n                  <li class=\"nw-toolbar__item\" *ngFor=\"let button of toolbarButtons\">\n                    <div *ngIf=\"!button.isComplex\">\n                      <button type=\"button\"\n                              class=\"nw-button\"\n                              [ngClass]=\"button.styleClass\"\n                              [title]=\"button.title\"\n                              (click)=\"execCommand(button.command)\">\n                        {{ button.title }}\n                      </button>\n                    </div>\n                  </li><!--\n                  --><li class=\"nw-toolbar__item\">\n                  <button type=\"button\"\n                          class=\"nw-button nw-button--source\"\n                          title=\"Edit HTML\"\n                          [ngClass]=\"{ 'nw-button--active': editMode }\"\n                          *ngIf=\"isSourceModeAllowed\"\n                          (click)=\"toggleEditMode()\">\n                    Edit HTML\n                  </button>\n                </li>\n                </ul>\n\n                <div class=\"nw-editor-container\"\n                     (click)=\"container.focus()\"\n                     [ngClass]=\"{ 'nw-editor-container--with-toolbar': toolbarButtons.length }\">\n                  <div class=\"nw-editor__src-container\"\n                       *ngIf=\"editMode\">\n                    <textarea [(ngModel)]=\"content\"\n                              (ngModelChange)=\"onChange($event)\"\n                              class=\"nw-editor__src\">\n                    </textarea>\n                  </div>\n                  <div class=\"nw-editor\"\n                       [ngClass]=\"{'nw-invisible': editMode}\">\n                    <div class=\"nw-editor__placeholder\"\n                         [innerText]=\"placeholder\"\n                         *ngIf=\"shouldShowPlaceholder()\">\n                    </div>\n                    <div #ngWigEditable\n                         class=\"nw-editor__res\"\n                         contenteditable\n                         (focus)=\"hasFocus = true\"\n                         (blur)=\"hasFocus = false\">\n                    </div>\n                  </div>\n                </div>\n              </div>",
                styles: [
                    "\n              /* -------- NG-WIG -------- */\n        /**\n         *\n         *  RESET BOX MODEL\n         *\n         */\n        .ng-wig,\n        [class^=\"nw-\"] {\n            -webkit-box-sizing: border-box;\n            -moz-box-sizing: border-box;\n            -o-box-sizing: border-box;\n            -ms-box-sizing: border-box;\n            box-sizing: border-box;\n        }\n\n\n        /**\n         *   main wrapper for the editor\n         *\n         *  .ng2wig\n         *\n         */\n        .ng-wig {\n            display: block;\n            padding: 0;\n            margin: 0;\n        }\n\n\n        /**\n         *  styling for toolbar and its items\n         *\n         *  .nw-toolbar\n         *    &__item\n         *\n         */\n        .nw-toolbar {\n            display: block;\n            margin: 0 !important;\n            padding: 0 !important;\n            list-style: none !important;\n            font-size: 12px;\n            color: #6B7277;\n\n            background: -webkit-linear-gradient(90deg, #ffffff 0%, #f9f9f9 100%);\n            background:    -moz-linear-gradient(90deg, #ffffff 0%, #f9f9f9 100%);\n            background:         linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);\n            border: 1px solid #CCCCCC;\n            border-radius: 3px 3px 0 0;\n        }\n\n        .nw-toolbar__item {\n            display: inline-block;\n            vertical-align: top;\n            margin: 0;\n\n            border-right: 1px solid #DEDEDE;\n        }\n\n        .nw-toolbar label {\n            line-height: 30px;\n            display: inline-block;\n            padding: 0 6px 0 3px;\n        }\n\n        .nw-toolbar input[type=checkbox] {\n            vertical-align: -3px;\n            margin-right: -1px;\n        }\n\n        /**\n         *  styling for the editor part: source code (original textarea) and resulting div\n         *\n         *  .nw-editor\n         *    &__src\n         *    &__res\n         *\n         */\n        .nw-editor {\n            display: table;\n            /* Default when height is not set */\n            height: 300px;\n            background: #fff;\n            cursor: text;\n            width:100%;\n        }\n\n        .nw-editor-container {\n            border: 1px solid #CCCCCC;\n            border-radius: 0 0 3px 3px;\n            position: relative;\n        }\n\n        .nw-editor-container--with-toolbar {\n            border-top: none;\n        }\n\n        .nw-editor__res {\n            min-height: 100%;\n            padding: 0 8px;\n            display: table-cell;\n        }\n\n        .nw-editor__placeholder {\n            padding: 1px 8px;\n            color: lightgray;\n            display: table-cell;\n            width: 100%;\n        }\n\n        .nw-editor__src,\n        .nw-editor__res {\n            width: 100%;\n            outline: none;\n            box-sizing: border-box;\n            border: none;\n            margin: 0;\n        }\n\n        .nw-editor__src-container {\n            position: absolute;\n            left: 0;\n            top: 0;\n            right: 0;\n            bottom: 0;\n        }\n\n        .nw-editor__src {\n            height: 100%;\n            resize: none;\n            padding: 0 8px;\n        }\n\n        .nw-editor--fixed .nw-editor {\n            display:block;\n            overflow-y: auto;\n        }\n\n        .nw-editor--fixed .nw-editor__res {\n            padding: 1px 8px;\n            display:block;\n        }\n\n        .nw-invisible {\n            visibility: hidden;\n        }\n\n        .nw-editor--fixed .nw-invisible {\n            display: none;\n        }\n\n        .nw-editor.nw-disabled {\n            cursor: default;\n        }\n\n        /**\n         *  styling for toolbar button, has two modifiers: active and type of icon for background\n         *\n         *  .nw-button\n         *    &--active\n         *    &--{button type}\n         *\n         */\n        .nw-button {\n            -webkit-appearance: none;\n            -moz-appearance:    none;\n            appearance:         none;\n\n            display: block;\n            width: 30px;\n            height: 30px;\n            margin: 0;\n            padding: 0;\n            opacity: 0.5;\n\n            background-color: transparent;\n            background-position: center center;\n            background-repeat: no-repeat;\n            border: none;\n            border-radius: 2px;\n\n            font-size: 0;\n\n            cursor: pointer;\n        }\n\n        .nw-button:before {\n            font-size: 12px;\n            font-family: FontAwesome;\n        }\n\n        .nw-button.bold:before {\n            content: '\\f032';\n        }\n\n        .nw-button.italic:before {\n            content: '\\f033';\n        }\n\n        .nw-button.list-ul:before {\n            content: '\\f0ca';\n        }\n\n        .nw-button.list-ol:before {\n            content: '\\f0cb';\n        }\n\n        .nw-button.link:before {\n            content: '\\f0c1';\n        }\n\n        .nw-button.font-color:before {\n            content: '\\f031';\n        }\n\n        .nw-button.nw-button--source:before {\n            content: '\\f040';\n        }\n\n        .nw-button.clear-styles:before {\n            content: '\\f12d';\n        }\n\n        .nw-button:focus {\n            outline: none;\n        }\n\n        .nw-button:hover,\n        .nw-button.nw-button--active {\n            opacity: 1\n        }\n\n        .nw-button--active {\n            background-color: #EEEEEE;\n        }\n\n        .nw-button:disabled {\n            cursor: default;\n        }\n        .nw-button:disabled:hover {\n            opacity: 0.5;\n        }\n\n        /**\n         *  styling & formatting of content inside contenteditable div\n         *\n         *  .nw-content\n         *\n         */\n        .nw-content {\n            padding: 12px;\n            margin: 0;\n\n            font-family: sans-serif;\n            font-size: 14px;\n            line-height: 24px;\n        }\n\n        .nw-select {\n            height: 30px;\n            padding: 6px;\n            color: #555;\n            background-color: inherit;\n            border: 0;\n        }\n\n        .nw-select:disabled {\n            opacity: 0.5;\n        }\n\n        .nw-select:focus { outline: none; }\n\n        .nw-button:focus {\n            border-color: lightgray;\n            border-style: solid;\n        }\n\n        [contenteditable]:empty:before {\n            content: attr(placeholder);\n            color: grey;\n            display: inline-block;\n        }\n    "
                ],
                providers: [
                    Ng2WigToolbarService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(function () { return Ng2WigComponent; }),
                        multi: true
                    }
                ],
                encapsulation: ViewEncapsulation.None
            },] },
];
/** @nocollapse */
Ng2WigComponent.ctorParameters = function () { return [
    { type: Ng2WigToolbarService, },
]; };
Ng2WigComponent.propDecorators = {
    'content': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'buttons': [{ type: Input },],
    'contentChange': [{ type: Output },],
    'ng2wigEditable': [{ type: ViewChild, args: ['ngWigEditable',] },],
};

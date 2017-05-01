import {
  Component,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  forwardRef,
  SimpleChanges,
  Output,
  ViewChild,
  EventEmitter
} from '@angular/core';

import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Ng2WigToolbarService} from './ng2wig-toolbar.service';

@Component({
  selector: 'ng2wig',
  template: `
              <div class="ng-wig">
                <ul class="nw-toolbar"
                    *ngIf="toolbarButtons.length">
                  <li class="nw-toolbar__item" *ngFor="let button of toolbarButtons">
                    <div *ngIf="!button.isComplex">
                      <button type="button"
                              class="nw-button"
                              [ngClass]="button.styleClass"
                              [title]="button.title"
                              (click)="execCommand(button.command)">
                        {{ button.title }}
                      </button>
                    </div>
                  </li><!--
                  --><li class="nw-toolbar__item">
                  <button type="button"
                          class="nw-button nw-button--source"
                          title="Edit HTML"
                          [ngClass]="{ 'nw-button--active': editMode }"
                          *ngIf="isSourceModeAllowed"
                          (click)="toggleEditMode()">
                    Edit HTML
                  </button>
                </li>
                </ul>

                <div class="nw-editor-container"
                     [ngClass]="{ 'nw-editor-container--with-toolbar': toolbarButtons.length }">
                  <div class="nw-editor__src-container"
                       *ngIf="editMode">
                    <textarea [(ngModel)]="content"
                              (ngModelChange)="onChange($event)"
                              class="nw-editor__src">
                    </textarea>
                  </div>
                  <div class="nw-editor"
                       [ngClass]="{'nw-invisible': editMode}">
                    <div class="nw-editor__placeholder"
                         [innerText]="placeholder"
                         (click)="container.focus()"
                         *ngIf="shouldShowPlaceholder()">
                    </div>
                    <div #ngWigEditable
                         class="nw-editor__res"

                         contenteditable
                         (focus)="hasFocus = true"
                         (blur)="hasFocus = false">
                    </div>
                  </div>
                </div>
              </div>`,
  styles: [
    `
              /* -------- NG-WIG -------- */
        /**
         *
         *  RESET BOX MODEL
         *
         */
        .ng-wig,
        [class^="nw-"] {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            -ms-box-sizing: border-box;
            box-sizing: border-box;
        }


        /**
         *   main wrapper for the editor
         *
         *  .ng2wig
         *
         */
        .ng-wig {
            display: block;
            padding: 0;
            margin: 0;
        }


        /**
         *  styling for toolbar and its items
         *
         *  .nw-toolbar
         *    &__item
         *
         */
        .nw-toolbar {
            display: block;
            margin: 0 !important;
            padding: 0 !important;
            list-style: none !important;
            font-size: 12px;
            color: #6B7277;

            background: -webkit-linear-gradient(90deg, #ffffff 0%, #f9f9f9 100%);
            background:    -moz-linear-gradient(90deg, #ffffff 0%, #f9f9f9 100%);
            background:         linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%);
            border: 1px solid #CCCCCC;
            border-radius: 3px 3px 0 0;
        }

        .nw-toolbar__item {
            display: inline-block;
            vertical-align: top;
            margin: 0;

            border-right: 1px solid #DEDEDE;
        }

        .nw-toolbar label {
            line-height: 30px;
            display: inline-block;
            padding: 0 6px 0 3px;
        }

        .nw-toolbar input[type=checkbox] {
            vertical-align: -3px;
            margin-right: -1px;
        }

        /**
         *  styling for the editor part: source code (original textarea) and resulting div
         *
         *  .nw-editor
         *    &__src
         *    &__res
         *
         */
        .nw-editor {
            display: table;
            /* Default when height is not set */
            height: 300px;
            background: #fff;
            cursor: text;
            width:100%;
        }

        .nw-editor-container {
            border: 1px solid #CCCCCC;
            border-radius: 0 0 3px 3px;
            position: relative;
        }

        .nw-editor-container--with-toolbar {
            border-top: none;
        }

        .nw-editor__res {
            min-height: 100%;
            padding: 0 8px;
            display: table-cell;
        }

        .nw-editor__placeholder {
            padding: 1px 8px;
            color: lightgray;
            display: table-cell;
            width: 100%;
        }

        .nw-editor__src,
        .nw-editor__res {
            width: 100%;
            outline: none;
            box-sizing: border-box;
            border: none;
            margin: 0;
        }

        .nw-editor__src-container {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }

        .nw-editor__src {
            height: 100%;
            resize: none;
            padding: 0 8px;
        }

        .nw-editor--fixed .nw-editor {
            display:block;
            overflow-y: auto;
        }

        .nw-editor--fixed .nw-editor__res {
            padding: 1px 8px;
            display:block;
        }

        .nw-invisible {
            visibility: hidden;
        }

        .nw-editor--fixed .nw-invisible {
            display: none;
        }

        .nw-editor.nw-disabled {
            cursor: default;
        }

        /**
         *  styling for toolbar button, has two modifiers: active and type of icon for background
         *
         *  .nw-button
         *    &--active
         *    &--{button type}
         *
         */
        .nw-button {
            -webkit-appearance: none;
            -moz-appearance:    none;
            appearance:         none;

            display: block;
            width: 30px;
            height: 30px;
            margin: 0;
            padding: 0;
            opacity: 0.5;

            background-color: transparent;
            background-position: center center;
            background-repeat: no-repeat;
            border: none;
            border-radius: 2px;

            font-size: 0;

            cursor: pointer;
        }

        .nw-button:before {
            font-size: 12px;
            font-family: FontAwesome;
        }

        .nw-button.bold:before {
            content: '\\f032';
        }

        .nw-button.italic:before {
            content: '\\f033';
        }

        .nw-button.list-ul:before {
            content: '\\f0ca';
        }

        .nw-button.list-ol:before {
            content: '\\f0cb';
        }

        .nw-button.link:before {
            content: '\\f0c1';
        }

        .nw-button.font-color:before {
            content: '\\f031';
        }

        .nw-button.nw-button--source:before {
            content: '\\f040';
        }

        .nw-button.clear-styles:before {
            content: '\\f12d';
        }

        .nw-button:focus {
            outline: none;
        }

        .nw-button:hover,
        .nw-button.nw-button--active {
            opacity: 1
        }

        .nw-button--active {
            background-color: #EEEEEE;
        }

        .nw-button:disabled {
            cursor: default;
        }
        .nw-button:disabled:hover {
            opacity: 0.5;
        }

        /**
         *  styling & formatting of content inside contenteditable div
         *
         *  .nw-content
         *
         */
        .nw-content {
            padding: 12px;
            margin: 0;

            font-family: sans-serif;
            font-size: 14px;
            line-height: 24px;
        }

        .nw-select {
            height: 30px;
            padding: 6px;
            color: #555;
            background-color: inherit;
            border: 0;
        }

        .nw-select:disabled {
            opacity: 0.5;
        }

        .nw-select:focus { outline: none; }

        .nw-button:focus {
            border-color: lightgray;
            border-style: solid;
        }

        [contenteditable]:empty:before {
            content: attr(placeholder);
            color: grey;
            display: inline-block;
        }
    `
  ],
  providers: [
    Ng2WigToolbarService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng2WigComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class Ng2WigComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() content: string;

  @Input() placeholder: string;

  @Input() buttons: string;

  @Output() contentChange = new EventEmitter();

  @ViewChild('ngWigEditable')
  ng2wigEditable: ElementRef;

  public isSourceModeAllowed: boolean = true;
  public editMode: boolean = false;
  public container: HTMLElement;
  public toolbarButtons: Object[] = [];
  public hasFocus: boolean = false;
  private propagateChange: any = (_: any) => { };

  public constructor(private _ngWigToolbarService: Ng2WigToolbarService) {}

  public toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  public execCommand(command: string, options: string): boolean {
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
    let selection = document.getSelection().toString();
    if (command === 'createlink' && selection === '') {
      document.execCommand('insertHtml', false, '<a href="' + options + '">' + options + '</a>');
    }
    else {
      document.execCommand(command, false, options);
    }
  }

  public ngOnInit(): void {
    this.toolbarButtons = this._ngWigToolbarService.getToolbarButtons(this.buttons);
    function string2array(keysString: string) {
      return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
    }

    this.container = this.ng2wigEditable.nativeElement;
    if (this.content) {
      this.container.innerHTML = this.content;
    }

    // view --> model
    ('keyup change focus click'.split(' ')).forEach(event =>
      this.container.addEventListener(event, () => {
        this.content = this.container.innerHTML;
        this.contentChange.emit(this.content);
      }, false)
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.container) {
      this.container.innerHTML = changes['content'].currentValue;
    }
  }

  public onChange(event: Event): void {
    // model -> view
    this.container.innerHTML = this.content;
  }

  public writeValue(value: any): void {
    if (value) {
      this.content = value;
    }
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {  }

  public shouldShowPlaceholder(): boolean {
    return this.placeholder
        && !this.hasFocus
        && !this.container.innerText;
  }
}

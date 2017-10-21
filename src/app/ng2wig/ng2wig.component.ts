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
  EventEmitter,
  Optional,
} from '@angular/core';

import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Ng2WigToolbarService} from './ng2wig-toolbar.service';
import { Ng2WigConfig } from './ng2wig-config';

@Component({
  selector: 'ng2wig',
  templateUrl: './ng2wig.component.html',
  styleUrls: ['./ng2wig.component.css'],
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
  @Input()
  public content: string;

  @Input()
  public placeholder: string;

  @Input()
  public buttons: string;

  @Output()
  public contentChange = new EventEmitter();

  @ViewChild('ngWigEditable')
  public ng2wigEditable: ElementRef;

  public isSourceModeAllowed: boolean = true;
  public editMode: boolean = false;
  public container: HTMLElement;
  public toolbarButtons: Object[] = [];
  public hasFocus: boolean = false;
  public iconsTheme: string;

  public constructor(
    private _ngWigToolbarService: Ng2WigToolbarService,
    config: Ng2WigConfig
  ) {
    this.iconsTheme = `nw-button-${config.iconsTheme}`;
  }


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
    if (this.container && changes['content']) {
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

  private propagateChange: any = (_: any) => { };
}

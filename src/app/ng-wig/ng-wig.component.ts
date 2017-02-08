import {Component, Input, OnInit, OnChanges, ViewEncapsulation, forwardRef} from '@angular/core';
import {NgWigToolbarService} from './ng-wig-toolbar.service';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS} from '@angular/forms';

@Component({
  selector: 'ng-wig',
  templateUrl: './ng-wig.component.html',
  styleUrls: ['./ng-wig.component.css'],
  providers: [
    NgWigToolbarService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgWigComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class NgWigComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() content: string;

  public isSourceModeAllowed: boolean = true;
  public editMode: boolean = false;
  public container: HTMLElement;
  public toolbarButtons: Object[] = [];
  private propagateChange: any = (_: any) => { };

  constructor(private _ngWigToolbarService: NgWigToolbarService) {
    this.toolbarButtons = this._ngWigToolbarService.getToolbarButtons();
    function string2array(keysString) {
      return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
    }

  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  execCommand(command, options) {
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

  ngOnInit() {
    this.container = document.querySelector('#ng-wig-editable') as HTMLElement;

    if (this.content) {
      this.container.innerHTML = this.content;
    }

    // view --> model
    ('keyup change focus click'.split(' ')).forEach(event =>
      this.container.addEventListener(event, () => {
        this.content = this.container.innerHTML;
      }, false)
    );
  }

  ngOnChanges(changes) {
    if (this.container) {
      this.container.innerHTML = changes.content.currentValue;
    }
  }

  onChange(event) {
    // model -> view
    this.container.innerHTML = this.content;
  }

  writeValue(value: any) {
    if (value) {
      this.content = value;
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {  }

}

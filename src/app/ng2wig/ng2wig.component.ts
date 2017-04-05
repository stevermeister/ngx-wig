import {Component, Input, OnInit, OnChanges, ViewEncapsulation, forwardRef, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Ng2WigToolbarService} from './ng2wig-toolbar.service';

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
  @Input() content: string;
  @Output() contentChange = new EventEmitter();

  public isSourceModeAllowed: boolean = true;
  public editMode: boolean = false;
  public container: HTMLElement;
  public toolbarButtons: Object[] = [];
  private propagateChange: any = (_: any) => { };

  constructor(private _ngWigToolbarService: Ng2WigToolbarService) {
    this.toolbarButtons = this._ngWigToolbarService.getToolbarButtons();
    function string2array(keysString: string) {
      return keysString.split(',').map(Function.prototype.call, String.prototype.trim);
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  execCommand(command: string, options: string) {
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
        this.contentChange.emit(this.content);
      }, false)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.container) {
      this.container.innerHTML = changes['content'].currentValue;
    }
  }

  onChange(event: Event) {
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

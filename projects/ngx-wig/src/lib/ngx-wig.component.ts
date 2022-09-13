import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
  Inject,
  OnDestroy,
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgxWigToolbarService } from './ngx-wig-toolbar.service';
import { DOCUMENT } from '@angular/common';
import { TButton, CommandFunction } from './config';

/** @dynamic */
@Component({
  selector: 'ngx-wig',
  templateUrl: './ngx-wig-component.html',
  styleUrls: ['./ngx-wig-component.css'],
  providers: [
    NgxWigToolbarService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxWigComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NgxWigComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input()
  public content: string;

  @Input()
  public placeholder: string;

  @Input()
  public buttons: string;

  @Input()
  public disabled: boolean;

  @Output()
  public contentChange = new EventEmitter();

  @ViewChild('ngWigEditable', { read: ElementRef, static: true })
  public ngxWigEditable: ElementRef;

  public editMode = false;
  public container: HTMLElement;
  public toolbarButtons: TButton[] = [];
  public hasFocus = false;

  private _mutationObserver: MutationObserver;

  public constructor(
    private _ngWigToolbarService: NgxWigToolbarService,
    @Inject(DOCUMENT) private document: any, // cannot set Document here - Angular issue - https://github.com/angular/angular/issues/20351
    @Inject('WINDOW') private window
  ) {}

  public execCommand(
    command: string | CommandFunction,
    options?: string
  ): boolean {
    if (typeof command === 'function') {
      command(this);
      return true;
    }

    if (this.editMode) {
      return false;
    }

    if (
      this.document.queryCommandSupported &&
      !this.document.queryCommandSupported(command)
    ) {
      throw new Error(`The command "${command}" is not supported`);
    }
    if (command === 'createlink' || command === 'insertImage') {
      options = window.prompt('Please enter the URL', 'http://') || '';
      if (!options) {
        return false;
      }
    }

    this.container.focus();

    // use insertHtml for `createlink` command to account for IE/Edge purposes, in case there is no selection
    const selection = this.document.getSelection().toString();

    if (command === 'createlink' && selection === '') {
      this.document.execCommand(
        'insertHtml',
        false,
        '<a href="' + options + '">' + options + '</a>'
      );
    } else {
      this.document.execCommand(command, false, options);
    }

    this.onContentChange(this.container.innerHTML);
    return true;
  }

  public ngOnInit(): void {
    this.toolbarButtons = this._ngWigToolbarService.getToolbarButtons(
      this.buttons
    );
    this.container = this.ngxWigEditable.nativeElement;

    if (this.content) {
      this.container.innerHTML = this.content;
    }
  }

  public ngOnDestroy(): void {
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
    }
  }

  public onContentChange(newContent: string): void {
    this.content = this.isInnerTextEmpty(newContent) ? '' : newContent;

    this.contentChange.emit(this.content);
    this.propagateChange(this.content);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.container && changes['content']) {
      // we need to focus the container before pasting at the caret
      this.container.focus();

      // clear the previous content
      this.container.innerHTML = '';

      // add the new content
      this.pasteHtmlAtCaret(changes['content'].currentValue);
    }
  }

  public onTextareaChange(newContent: string): void {
    // model -> view
    this.container.innerHTML = newContent;
    this.onContentChange(newContent);
  }

  public writeValue(value: any): void {
    if (!value) {
      value = '';
    }

    this.container.innerHTML = value;
    this.content = value;
  }

  public shouldShowPlaceholder(): boolean {
    return !!this.placeholder && !this.container.innerText;
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }

  public propagateTouched = () => {};

  public onBlur() {
    this.hasFocus = false;
    this.propagateTouched();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public isInnerTextEmpty(content: string): boolean {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(content, 'text/html');

    return htmlDoc.documentElement?.innerText === '';
  }

  private pasteHtmlAtCaret(html) {
    let sel;
    let range;

    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        // append the content in a temporary div
        const el = this.document.createElement('div');
        el.innerHTML = html;

        const frag = this.document.createDocumentFragment();
        let node;
        let lastNode;

        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }

  private propagateChange: any = (_: any) => {};
}

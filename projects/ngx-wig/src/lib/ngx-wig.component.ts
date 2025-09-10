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
  ViewChildren,
  QueryList,
  ViewEncapsulation,
  forwardRef,
  Inject,
  OnDestroy,
  Optional,
  DOCUMENT
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgxWigToolbarService } from './ngx-wig-toolbar.service';
import { TButton, CommandFunction } from './config';
import { NgxWigFilterService } from './ngx-wig-filter.service';

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
        }
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: false
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
  public toolbarButtonIndex = 0;

  private readonly _mutationObserver: MutationObserver;

  @ViewChildren('toolbarButton', { read: ElementRef })
  private toolbarButtonElems: QueryList<ElementRef>;

  public constructor(
    private readonly _ngWigToolbarService: NgxWigToolbarService,
    @Optional() private readonly _filterService: NgxWigFilterService,
    @Inject(DOCUMENT) private readonly document: Document, // cannot set Document here - Angular issue - https://github.com/angular/angular/issues/20351
    @Inject('WINDOW') private readonly window
  ) {}

  private executeCommand(command: string, value: string = ''): boolean {
    try {
      if (this.container.contentEditable !== 'true') {
        return false;
      }

      // For now, use execCommand for backward compatibility
      // TODO: Replace with modern APIs when execCommand is fully deprecated
      if (command === 'unlink') {
        this.document.execCommand(command, false);
      } else {
        this.document.execCommand(command, false, value);
      }
      return true;
    } catch (error) {
      console.warn(`Command execution failed: ${command}`, error);
      return false;
    }
  }

  public execCommand(command: string | CommandFunction | undefined, options?: string): boolean {
    if (typeof command === 'function') {
      command(this);
      return true;
    }

    if (this.editMode) {
      return false;
    }

    if (typeof command !== 'string' || !command) {
      return false;
    }

    if (!this.isSupportedCommand(command)) {
      throw new Error(`The command "${command}" is not supported`);
    }

    if ((command === 'createlink' && !this.isLinkSelected()) || command === 'insertImage') {
      options = window.prompt('Please enter the URL', 'http://') ?? '';
      if (!options) {
        return false;
      }
    }

    this.container.focus();

    let success = false;
    if (command === 'createlink' && this.isLinkSelected()) {
      success = this.executeCommand('unlink');
    } else {
      success = this.executeCommand(command, options ?? '');
    }

    if (success) {
      this.onContentChange(this.container.innerHTML);
    }
    
    return success;
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
      if (this._filterService){
        this.pasteHtmlAtCaret(this._filterService.filter(changes['content'].currentValue));
      } else {
        this.pasteHtmlAtCaret(changes['content'].currentValue);
      }

    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const text = event.clipboardData?.getData('text/html') || event.clipboardData?.getData('text/plain') || '';

    if (this._filterService){
      this.pasteHtmlAtCaret(this._filterService.filter(text));
    } else {
      this.pasteHtmlAtCaret(text);
    }

    this.onContentChange(this.container.innerHTML);
  }

  public onTextareaChange(newContent: string): void {
    // model -> view
    this.container.innerHTML = newContent;
    this.onContentChange(newContent);
  }

  public writeValue(value: any): void {
    value = value ?? '';
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

  public isLinkSelected(): boolean {
    if (window.getSelection()?.toString() === '')
      return false;

    const selection = window.getSelection();
    if (!selection) return false;

    return (
      selection.focusNode?.parentNode?.nodeName === 'A' ||
      selection.anchorNode?.parentNode?.nodeName === 'A'
    );
  }

  public onDropdownButtonSelected(button: TButton, event?: Event): void {
    event?.preventDefault()

    if (button.isOpenOnMouseOver) return;
    button.visibleDropdown = !button.visibleDropdown;
  }

  public onToolbarKeydown(event: KeyboardEvent, index: number): void {
    const buttons = this.toolbarButtonElems?.toArray();
    if (!buttons || buttons.length === 0) {
      return;
    }
    const lastIndex = buttons.length - 1;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.toolbarButtonIndex = (index + 1) % buttons.length;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.toolbarButtonIndex = (index - 1 + buttons.length) % buttons.length;
        break;
      case 'Tab':
        if (event.shiftKey) {
          if (index === 0) {
            return;
          }
          event.preventDefault();
          this.toolbarButtonIndex = index - 1;
        } else {
          if (index === lastIndex) {
            return; // Allow Tab to move focus out of the toolbar
          }
          event.preventDefault();
          this.toolbarButtonIndex = index + 1;
        }
        break;
      default:
        return;
    }

    buttons[this.toolbarButtonIndex].nativeElement.focus();
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

  private isSupportedCommand(command: string): boolean {
    // List of commonly supported commands across modern browsers
    const supportedCommands = [
      'bold', 'italic', 'underline',
      'strikethrough', 'subscript', 'superscript',
      'justifycenter', 'justifyfull', 'justifyleft', 'justifyright',
      'indent', 'outdent',
      'insertorderedlist', 'insertunorderedlist',
      'createlink', 'unlink',
      'inserthtml', 'insertimage',
      'formatblock',
      'removeformat'
    ];

    return supportedCommands.includes(command.toLowerCase());
  }

  private propagateChange: any = (_: any) => {};
}

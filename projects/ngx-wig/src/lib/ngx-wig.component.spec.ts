import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { NgxWigToolbarService } from './ngx-wig-toolbar.service';
import { NgxWigComponent } from './ngx-wig.component';

let fixture: ComponentFixture<NgxWigComponent>;
let page: Page;
let component: NgxWigComponent;
const mockWindow = {};

describe('NgxWigComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [NgxWigComponent],
      providers: [
        NgxWigToolbarService,
        { provide: 'WINDOW', useValue: mockWindow }
      ]
    });

    fixture = TestBed.createComponent(NgxWigComponent);

    component = fixture.componentInstance;
    component.content = '<p>Hello World</p>';
    component.isSourceModeAllowed = true;

    page = new Page();

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have six toolbar buttons', () => {
    expect(page.toolbarItemsLi.length).toBe(6);
  });

  it('should have a standard button', () => {
    expect(page.unorderedListBtn.classList.contains('list-ul')).toBe(true);
    expect(page.unorderedListBtn.getAttribute('title')).toBe('Unordered List');
    expect(page.unorderedListBtn.tabIndex).toBe(-1);
    expect(page.iconsEl[0].classList.contains('icon-list-ul')).toBe(true);
  });

  it('should have a standard button without icon', () => {
    component.toolbarButtons[0].icon = undefined;
    fixture.detectChanges();
    expect(page.unorderedListBtn.textContent).toBe('UL');
    expect(page.iconsEl[0].classList.contains('icon-list-ul')).toBe(false);
  });

  it('should not allow edit mode', () => {
    component.isSourceModeAllowed = false;
    fixture.detectChanges();
    expect(page.editHTMLBtn).toBeNull();
  });

  it('should have an editor container', () => {
    expect(page.editContainerDiv.classList.contains('nw-editor-container--with-toolbar')).toBeDefined();
  });

  it('should toggle edit mode', () => {
    page.editHTMLBtn.click();
    fixture.detectChanges();
    expect(page.editHTMLTxt).toBeDefined();
    expect(page.editHTMLBtn.classList.contains('nw-button--active')).toBe(true);
    expect(page.editorDiv.classList.contains('nw-invisible')).toBeDefined();
    expect(page.editorSrcContainerDiv).toBeDefined();
  });

  it('should have a content', () => {
    expect(page.editableDiv.innerHTML).toBe('<p>Hello World</p>');
  });

  it('should show a placeholder', () => {
    component.placeholder = 'Insert text here';
    page.editableDiv.innerHTML = '';
    fixture.detectChanges();
    expect(page.placeholderEl.innerText).toBe('Insert text here');
  });

  describe('focus', () => {
    let spy: jasmine.Spy;

    beforeEach(() => spy = spyOn(page.editableDiv, 'focus'));

    it('when container click', () => {
      page.editContainerDiv.click();
      expect(spy.calls.any()).toBe(true);
    });

    it('when button click', () => {
      page.unorderedListBtn.click();
      expect(spy.calls.any()).toBe(true);
    });

    it('when execCommand', () => {
      component.execCommand('bold', '');
      expect(spy.calls.any()).toBe(true);
    });
  });

  describe('disabled property', () => {
    it('should enable the editor', () => {
      expect(page.unorderedListBtn.disabled).toBe(false);
      expect(page.editHTMLBtn.disabled).toBe(false);
      expect(page.editorDiv.classList.contains('nw-disabled')).toBe(false);
      expect(page.editableDiv.classList.contains('disabled')).toBe(false);
      expect(page.editableDiv.getAttribute('contenteditable')).toBe('true');
    });

    it('should disable the editor', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(page.unorderedListBtn.disabled).toBe(true);
      expect(page.editHTMLBtn.disabled).toBe(true);
      expect(page.editorDiv.classList.contains('nw-disabled')).toBe(true);
      expect(page.editableDiv.classList.contains('disabled')).toBe(true);
      expect(page.editableDiv.getAttribute('contenteditable')).toBe('false');
    });
  });

  describe('execCommand', () => {
    it('should call execCommand', () => {
      const spy = spyOn(component, 'execCommand');
      page.unorderedListBtn.click();
      const execArgs = spy.calls.first().args;
      expect(execArgs[0]).toBe('insertunorderedlist');
      expect(execArgs[1]).toBeUndefined();
    });

    it('should return false', () => {
      component.editMode = true;
      expect(component.execCommand('insertunorderedlist', '')).toBe(false);
    });

    it('should execute the BOLD command', () => {
      component.execCommand('bold', '');
      const documentArgs = page.execCommandSpy.calls.first().args;
      expect(documentArgs[0]).toBe('bold');
      expect(documentArgs[1]).toBe(false);
      expect(documentArgs[2]).toBe('');
    });

    it('should use insertHtml to create a link for IE', () => {
      page.promptSpy.and.returnValue('http://fakeLink');
      spyOn(document, 'getSelection').and.returnValue('');
      component.execCommand('createlink', 'http://fakeLink');
      const documentArgs = page.execCommandSpy.calls.first().args;
      expect(documentArgs[0]).toBe('insertHtml');
      expect(documentArgs[1]).toBe(false);
      expect(documentArgs[2]).toBe('<a href="http://fakeLink">http://fakeLink</a>');
    });

    it('should fail if command is unknown', () => {
      expect(() => {
        component.execCommand('fakeCmd', '');
      }).toThrow('The command "fakeCmd" is not supported');
    });

    it('should show a prompt when the command name is createlink', () => {
      page.promptSpy.and.returnValue('http://fakeLink');
      component.execCommand('createlink', '');
      const promptArgs = page.promptSpy.calls.first().args;
      expect(promptArgs[0]).toBe('Please enter the URL');
      expect(promptArgs[1]).toBe('http://');
    });

    it('should show a prompt when the command name is insertImage', () => {
      page.promptSpy.and.returnValue('http://fakeImage');
      component.execCommand('insertImage', '');
      const promptArgs = page.promptSpy.calls.first().args;
      expect(promptArgs[0]).toBe('Please enter the URL');
      expect(promptArgs[1]).toBe('http://');
    });

    it('should not show a prompt when the command is not createlink or insertImage', () => {
      component.execCommand('bold', '');
      expect(page.promptSpy.calls.any()).toBe(false);
    });

    it('should return if the prompt is cancelled', () => {
      page.promptSpy.and.returnValue(undefined);
      component.execCommand('createlink', '');
      expect(page.execCommandSpy.calls.any()).toBe(false);
    });
  });
});

class Page {
  get buttons()  { return this.queryAll<HTMLButtonElement>('.nw-button'); }
  get unorderedListBtn() { return this.buttons[0]; }
  get editHTMLBtn() { return this.query<HTMLButtonElement>('.nw-button.nw-button--source'); }
  get editorDiv() { return this.query<HTMLElement>('.nw-editor'); }
  get editContainerDiv() { return this.query<HTMLElement>('.nw-editor-container'); }
  get editorSrcContainerDiv() { return this.query<HTMLElement>('.nw-editor__src-container'); }
  get editableDiv() { return this.query<HTMLElement>('.nw-editor__res'); }
  get toolbarItemsLi() { return this.queryAll<HTMLElement>('.nw-toolbar__item'); }
  get iconsEl() { return this.queryAll<HTMLElement>('.icon'); }
  get editHTMLTxt() { return this.query<HTMLElement>('textarea'); }
  get placeholderEl() { return this.query<HTMLElement>('.nw-editor__placeholder'); }

  execCommandSpy: jasmine.Spy;
  promptSpy: jasmine.Spy;

  constructor() {
    this.execCommandSpy = spyOn(document, 'execCommand');
    this.promptSpy = spyOn(window, 'prompt');
  }

  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }

  private queryAll<T>(selector: string): T[] {
    return fixture.nativeElement.querySelectorAll(selector);
  }
}

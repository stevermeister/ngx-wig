import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NgxWigComponent } from './ngx-wig.component';
import { NgxWigToolbarService } from './ngx-wig-toolbar.service';

let fixture: ComponentFixture<NgxWigComponent>;
let toolbarService: NgxWigToolbarService;
let page: Page;
let comp: NgxWigComponent;

describe('NgxWigComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [NgxWigComponent],
      providers: [NgxWigToolbarService]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(NgxWigComponent);
      page = new Page();
      fixture.detectChanges();
      page.addPageElements();
    });
  }));

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  it('should create a standard button', () => {
    expect(page.unorderedListBtn.nativeElement.getAttribute('title')).toBe('Unordered List');
    // expect(page.unorderedListBtn.nativeElement.textContent).toContain('UL');
  });

  it('should enable edit mode', () => {
    page.editHTMLBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    const editHTMLTxt = fixture.debugElement.query(By.css('textarea'));
    expect(editHTMLTxt).toBeDefined();
    expect(page.editHTMLBtn.classes['nw-button--active']).toBeDefined();
    expect(page.editorDiv.classes['nw-invisible']).toBeDefined();
    expect(page.editorSrcContainerDiv).toBeDefined();
  });

  describe('execCommand', () => {
    it('should call execCommand', () => {
      const spy = spyOn(comp, 'execCommand');
      page.unorderedListBtn.triggerEventHandler('click', null);

      const execArgs = spy.calls.first().args;
      expect(execArgs[0]).toBe('insertunorderedlist');
      expect(execArgs[1]).toBeUndefined();
    });

    it('should return false', () => {
      comp.editMode = true;
      expect(comp.execCommand('insertunorderedlist', '')).toBe(false);
    });

    it('should execute the BOLD command', () => {
      comp.execCommand('bold', '');
      const documentArgs = page.execCommandSpy.calls.first().args;
      expect(documentArgs[0]).toBe('bold');
      expect(documentArgs[1]).toBe(false);
      expect(documentArgs[2]).toBe('');
    });

    it('should use insertHtml to create a link for IE', () => {
      page.promptSpy.and.returnValue('http://fakeLink');
      spyOn(document, 'getSelection').and.returnValue('');
      comp.execCommand('createlink', 'http://fakeLink');
      const documentArgs = page.execCommandSpy.calls.first().args;
      expect(documentArgs[0]).toBe('insertHtml');
      expect(documentArgs[1]).toBe(false);
      expect(documentArgs[2]).toBe('<a href="http://fakeLink">http://fakeLink</a>');
    });

    it('should fail if command is unknown', function(){
      expect(() => {comp.execCommand('fakeCmd', '')}).toThrow('The command "fakeCmd" is not supported');
    });

    it('should show a prompt when the command name is createlink', () => {
      page.promptSpy.and.returnValue('http://fakeLink');
      comp.execCommand('createlink', '');
      const promptArgs = page.promptSpy.calls.first().args;
      expect(promptArgs[0]).toBe('Please enter the URL');
      expect(promptArgs[1]).toBe('http://');
    });

    it('should show a prompt when the command name is insertImage', () => {
      page.promptSpy.and.returnValue('http://fakeImage');
      comp.execCommand('insertImage', '');
      const promptArgs = page.promptSpy.calls.first().args;
      expect(promptArgs[0]).toBe('Please enter the URL');
      expect(promptArgs[1]).toBe('http://');
    });

    it('should not show a prompt when the command is not createlink or insertImage', () => {
      comp.execCommand('bold', '');
      expect(page.promptSpy.calls.any()).toBe(false);
    });

    it('should return if the prompt is cancelled', () => {
      page.promptSpy.and.returnValue(undefined);
      comp.execCommand('createlink', '');
      expect(page.execCommandSpy.calls.any()).toBe(false);
    });

    describe('focus', () => {
      let spy: jasmine.Spy;

      beforeEach(() => spy = spyOn(page.editableDiv.nativeElement, 'focus'));

      it('with user interaction', () => {
        page.unorderedListBtn.triggerEventHandler('click', null);

        expect(spy.calls.any()).toBe(true);
      });

      it('automatically', () => {
        comp.execCommand('bold', '');

        expect(spy.calls.any()).toBe(true);
      });
    })
  });

  it('should have an editor container with a toolbar of buttons', () => {
    expect(page.editContainerDiv.classes['nw-editor-container--with-toolbar']).toBeDefined();
    expect(page.toolbarUl).toBeDefined();
    expect(page.toolbarItemsLi.length).toBe(6);
  });

  it('should have a content', () => {
    expect(page.editableDiv.nativeElement.innerHTML).toBe('<p>Hello World</p>');
  });

  it('should show a placeholder', () => {
    comp.placeholder = 'Insert text here';
    page.editableDiv.nativeElement.innerHTML = '';
    fixture.detectChanges();
    const placeholderEl = fixture.debugElement.query(By.css('.nw-editor__placeholder'));
    expect(placeholderEl.nativeElement.innerText).toBe('Insert text here');
  });

  xdescribe('disabled property', () => {
    it('should enable the editor', () => {
      expect(page.unorderedListBtn.nativeElement.disabled).toBe(false);
      expect(page.editHTMLBtn.nativeElement.disabled).toBe(false);
      expect(page.editorDiv.classes['nw-disabled']).toBe(false);
      expect(page.editableDiv.classes['disabled']).toBe(false);
      expect(page.editableDiv.nativeElement.getAttribute('contenteditable')).toBe('true');
    });

    it('should disable the editor', () => {
      comp.setDisabledState(true);
      fixture.detectChanges();
      expect(page.unorderedListBtn.nativeElement.disabled).toBe(true);
      expect(page.editHTMLBtn.nativeElement.disabled).toBe(true);
      expect(page.editorDiv.classes['nw-disabled']).toBe(true);
      expect(page.editableDiv.classes['disabled']).toBe(true);
      expect(page.editableDiv.nativeElement.getAttribute('contenteditable')).toBe('false');
    });
  });
});

class Page {
  unorderedListBtn: DebugElement;
  editHTMLBtn: DebugElement;
  editorDiv: DebugElement;
  editContainerDiv: DebugElement;
  editorSrcContainerDiv: DebugElement;
  editableDiv: DebugElement;
  toolbarUl: DebugElement;
  toolbarItemsLi: DebugElement[];
  execCommandSpy: jasmine.Spy;
  promptSpy: jasmine.Spy;

  constructor() {
    comp = fixture.debugElement.componentInstance;
    this.execCommandSpy = spyOn(document, 'execCommand');
    this.promptSpy = spyOn(window, 'prompt');
    comp.content = '<p>Hello World</p>';
    comp.isSourceModeAllowed = true;
  }

  addPageElements() {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    this.unorderedListBtn = buttons[0];
    this.editHTMLBtn = buttons[5];
    this.editorDiv = fixture.debugElement.query(By.css('.nw-editor'));
    this.editContainerDiv = fixture.debugElement.query(By.css('.nw-editor-container'));
    this.editorSrcContainerDiv = fixture.debugElement.query(By.css('.nw-editor__src-container'));
    this.editableDiv = fixture.debugElement.query(By.css('.nw-editor__res'));
    this.toolbarUl = fixture.debugElement.query(By.css('.nw-toolbar'));
    this.toolbarItemsLi = fixture.debugElement.queryAll(By.css('.nw-toolbar__item'));
  }
}

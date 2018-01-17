import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NgxWigComponent } from './ngx-wig.component';
import { NgxWigToolbarService } from './ngx-wig-toolbar.service';

let fixture: ComponentFixture<NgxWigComponent>;
let toolbarService: NgxWigToolbarService;
let page: Page;

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
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should create a standard button', () => {
    expect(page.unorderedListBtn.classes['nw-button-mdi']).toBeDefined();
    expect(page.unorderedListBtn.nativeElement.getAttribute('title')).toBe('Unordered List');
    expect(page.unorderedListBtn.nativeElement.textContent).toContain('Unordered List');
  });

  it('should configure the EditHTML button', () => {
    expect(page.editHTMLBtn.classes['nw-button-mdi']).toBeDefined();
  });

  it('should enable edit mode', () => {
    page.editHTMLBtn.triggerEventHandler('click', null);
    fixture.detectChanges();
    const editHTMLTxt = fixture.debugElement.query(By.css('textarea'));
    expect(editHTMLTxt).toBeDefined();
    expect(page.editHTMLBtn.classes['nw-button--active']).toBeDefined();
    expect(page.editorDiv.classes['nw-invisible']).toBeDefined();
  });
});

class Page {
  unorderedListBtn: DebugElement;
  editHTMLBtn: DebugElement;
  editorDiv: DebugElement;

  addPageElements() {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    this.unorderedListBtn = buttons[0];
    this.editHTMLBtn = buttons[5];
    this.editorDiv = fixture.debugElement.query(By.css('.nw-editor'));
  }
}

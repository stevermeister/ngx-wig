import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxWigComponent } from './ngx-wig.component';

describe('NgxWigComponent', () => {
  let component: NgxWigComponent;
  let fixture: ComponentFixture<NgxWigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxWigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxWigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

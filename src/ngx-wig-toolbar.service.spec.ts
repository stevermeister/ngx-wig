import { TestBed, inject } from '@angular/core/testing';

import { NgxWigToolbarService } from './ngx-wig-toolbar.service';

describe('NgxWigToolbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxWigToolbarService]
    });
  });

  it('should be created', inject([NgxWigToolbarService], (service: NgxWigToolbarService) => {
    expect(service).toBeTruthy();
  }));
});

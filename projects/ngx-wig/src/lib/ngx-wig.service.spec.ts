import { TestBed } from '@angular/core/testing';

import { NgxWigService } from './ngx-wig.service';

describe('NgxWigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxWigService = TestBed.get(NgxWigService);
    expect(service).toBeTruthy();
  });
});

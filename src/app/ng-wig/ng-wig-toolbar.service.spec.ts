/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NgWigToolbarService } from './ng-wig-toolbar.service';

describe('Service: NgWigToolbar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgWigToolbarService]
    });
  });

  it('should ...', inject([NgWigToolbarService], (service: NgWigToolbarService) => {
    expect(service).toBeTruthy();
  }));
});

import { NgxWigFilterService } from './ngx-wig-filter.service';

describe('NgxWigFilterService', () => {
  let service: NgxWigFilterService;

  beforeEach(() => {
    service = new NgxWigFilterService();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should return the same content when filtering', () => {
    const content = 'Hello, world!';
    expect(service.filter(content)).toEqual(content);
  });
});
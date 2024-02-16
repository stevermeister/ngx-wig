import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgxWigFilterService {
  constructor() {}
  public filter(content: string): string {
    return content;
  }
}

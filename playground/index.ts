/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { NgxWigModule }  from 'ngx-wig';

@Component({
  selector: 'app',
  template: `<ngx-wig [isSourceModeAllowed]="true"></ngx-wig>`
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, NgxWigModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

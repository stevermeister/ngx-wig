import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NgWigComponent } from './ng-wig/ng-wig.component';
import { NgWigToolbarService } from './ng-wig/ng-wig-toolbar.service'

@NgModule({
  declarations: [
    AppComponent,
    NgWigComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [NgWigToolbarService],
  bootstrap: [AppComponent]
})
export class AppModule { }

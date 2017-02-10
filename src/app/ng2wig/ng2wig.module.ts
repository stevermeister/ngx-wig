import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2WigComponent } from './ng2wig.component';
import { Ng2WigToolbarService } from './ng2wig-toolbar.service';

@NgModule({
  declarations: [
    Ng2WigComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Ng2WigToolbarService],
  bootstrap: [Ng2WigComponent],
  exports: [Ng2WigComponent]
})
export class Ng2WigModule { }

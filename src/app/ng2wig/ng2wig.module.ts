import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Ng2WigComponent } from './ng2wig.component';
import { Ng2WigToolbarService } from './ng2wig-toolbar.service';
import { ResizableComponent } from './resizable/resizable.component';

@NgModule({
  declarations: [
    Ng2WigComponent,
    ResizableComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [Ng2WigToolbarService],
  bootstrap: [Ng2WigComponent],
  exports: [Ng2WigComponent]
})
export class Ng2WigModule { }

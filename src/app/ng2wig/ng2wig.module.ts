import {
  ModuleWithProviders,
  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Ng2WigComponent } from './ng2wig.component';
import { Ng2WigToolbarService } from './ng2wig-toolbar.service';
import { Ng2WigConfig } from './ng2wig-config';


@NgModule({
  declarations: [
    Ng2WigComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [Ng2WigToolbarService],
  bootstrap: [Ng2WigComponent],
  exports: [Ng2WigComponent]
})

export class Ng2WigModule {

  public static forRoot(config: Ng2WigConfig): ModuleWithProviders {
    return {
      ngModule: Ng2WigModule,
      providers: [
        { provide: Ng2WigConfig, useValue: config }
      ]
    };
  }
}

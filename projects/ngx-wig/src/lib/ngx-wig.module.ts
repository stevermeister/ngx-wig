import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxWigComponent } from './ngx-wig.component';
import { FormsModule } from '@angular/forms';
import { TButtonLibrary, DEFAULT_LIBRARY_BUTTONS, BUTTONS, CUSTOM_LIBRARY_BUTTONS } from './config';

export function getWindowObject(): Window {
  return window;
}

@NgModule({
  declarations: [
    NgxWigComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [NgxWigComponent],
  providers: [
    { provide: BUTTONS, multi: true, useValue: DEFAULT_LIBRARY_BUTTONS },
    { provide: BUTTONS, multi: true, useValue: CUSTOM_LIBRARY_BUTTONS },
    { provide: 'WINDOW', useFactory: getWindowObject },
  ]
})
export class NgxWigModule {

  static forRoot(config?: { buttonsConfig: TButtonLibrary } ): ModuleWithProviders<NgxWigModule> {
    return {
      ngModule: NgxWigModule,
      providers: [
        provideButtons(config),
        { provide: 'WINDOW', useFactory: getWindowObject },
      ],
    };
  }

  static forChild(): ModuleWithProviders<NgxWigModule> {
    return {ngModule: NgxWigModule };
  }
}


export function provideButtons(config?: { buttonsConfig: TButtonLibrary }): any {
  if (!config || !config.buttonsConfig) {
    return [
      {provide: BUTTONS, multi: true, useValue: DEFAULT_LIBRARY_BUTTONS},
    ];
  }

  return [
    {provide: BUTTONS, multi: true, useValue: config.buttonsConfig},
  ];
}

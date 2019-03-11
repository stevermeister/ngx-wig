import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ModuleWithProviders, InjectionToken } from '@angular/core';
import { NgxWigComponent } from './ngx-wig.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TButtonLibrary, DEFAULT_LIBRARY_BUTTONS, BUTTONS } from './config';

export function getWindowObject(): Window {
  return window;
}

@NgModule({
  declarations: [
    NgxWigComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [NgxWigComponent],
  providers: [
    {provide: BUTTONS, multi: true, useValue: DEFAULT_LIBRARY_BUTTONS},
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
  if(!config || !config.buttonsConfig) {
    return [
      {provide: BUTTONS, multi: true, useValue: DEFAULT_LIBRARY_BUTTONS},
    ];
  }

  return [
    {provide: BUTTONS, multi: true, useValue: config.buttonsConfig},
  ];
}
import { Type } from '@angular/core';

import { PluginOptions } from './plugin-options.model';

export class Plugin {
  constructor(public name: string, public component: Type<any>, public options?: PluginOptions) {}
}

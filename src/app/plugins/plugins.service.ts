import { Injectable } from '@angular/core';

import { DemoComponent } from './demo.component';
import { Plugin } from './plugin.model';

@Injectable()
export class PluginsService {

    private plugins = [
        new Plugin('demo', DemoComponent)
    ];

    getPlugin(name: string) {
        return this.plugins.find(plugin => plugin.name === name);
    }
}
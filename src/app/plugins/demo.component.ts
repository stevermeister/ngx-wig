import { Component, Input } from '@angular/core';

import { PluginComponent } from './plugin.component';
import { PluginOptions } from './plugin-options.model';

@Component({
    template: '<li class="nw-toolbar__item"><button class="nw-button my-custom fa fa-cubes" title="My Custom Button">My Custom Button</button></li>'
})
export class DemoComponent implements PluginComponent {
    @Input() options: PluginOptions;
}
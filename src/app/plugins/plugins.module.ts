import { NgModule } from '@angular/core';

import { DemoComponent } from './demo.component';
import { PluginDirective } from './plugin.directive';
import { PluginsService } from './plugins.service';

@NgModule({
    imports: [],
    exports: [PluginDirective],
    declarations: [
        DemoComponent,
        PluginDirective
    ],
    providers: [PluginsService],
})
export class PluginsModule { }

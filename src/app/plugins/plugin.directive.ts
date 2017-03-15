import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[ng2wigPluginHost]'})
export class PluginDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

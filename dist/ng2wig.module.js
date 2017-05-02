import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ng2WigComponent } from './ng2wig.component';
import { Ng2WigToolbarService } from './ng2wig-toolbar.service';
var Ng2WigModule = (function () {
    function Ng2WigModule() {
    }
    return Ng2WigModule;
}());
export { Ng2WigModule };
Ng2WigModule.decorators = [
    { type: NgModule, args: [{
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
            },] },
];
/** @nocollapse */
Ng2WigModule.ctorParameters = function () { return []; };

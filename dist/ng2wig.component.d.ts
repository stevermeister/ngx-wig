import { ElementRef, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Ng2WigToolbarService } from './ng2wig-toolbar.service';
export declare class Ng2WigComponent implements OnInit, OnChanges, ControlValueAccessor {
    private _ngWigToolbarService;
    content: string;
    placeholder: string;
    buttons: string;
    contentChange: EventEmitter<{}>;
    ng2wigEditable: ElementRef;
    isSourceModeAllowed: boolean;
    editMode: boolean;
    container: HTMLElement;
    toolbarButtons: Object[];
    hasFocus: boolean;
    constructor(_ngWigToolbarService: Ng2WigToolbarService);
    toggleEditMode(): void;
    execCommand(command: string, options: string): boolean;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    onChange(event: Event): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(): void;
    shouldShowPlaceholder(): boolean;
    private propagateChange;
}

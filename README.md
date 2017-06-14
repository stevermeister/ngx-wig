ng2Wig
=====

## Dependencies

*it's only Angular! No jQuery or other WYSIWYG monsters*
 
 
## Installation

ng2Wig could be simply installed via npm:

    npm install ng2wig --save


## Usage

First, import the ng2wig to your module:

    import {Ng2WigModule} from 'ng2wig';
    
    @NgModule({
      imports: [ Ng2WigModule]
    });
   

it's just attribute directive for textarea:

    <ng2wig [content]="text1"></ng2wig>



## Examples

### Quick start

    <ng2wig [content]="text1"></ng2wig>

### Placeholder

    <ng2wig  [content]="text1" [placeholder]="'Enter instructions here.'"></ng2wig>

### Set buttons

    <ng2wig  [content]="text1" [buttons]="formats, bold, italic"></ng2wig>

### Output changed content
    
    import { Component } from '@angular/core';

    @Component({
        selector: 'app',
        template: `
                <ng2wig
                    [content]="text1" 
                    (contentChange)="updateResult($event)">
                </ng2wig>
                <h1 [innerHTML]="result"></h1>   
        `
    })
    export class AppComponent {
        public updateResult(content: string): void {
            this.result = content;
        }
    }
    

## Contribution (Development Setup)

    npm install
    npm start



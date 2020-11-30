ngx-wig
=====

[![Build Status](https://travis-ci.org/stevermeister/ngx-wig.svg?branch=master)](https://travis-ci.org/stevermeister/ngx-wig)

![screen shot 2017-12-12 at 14 52 51](https://user-images.githubusercontent.com/1526680/33888069-37bde1f0-df4c-11e7-993e-d48ffe0fffbf.png)

## Dependencies

*it's only Angular! No jQuery or other WYSIWYG monsters*


## Angular Support

For **Angular 11** `ngx-wig@11.0.0`
For **Angular 10** `ngx-wig@10.0.0` 
For **Angular 9** `ngx-wig@9.0.0` 
Since **Angular 8** we sync the version and now for each AngularX you will be able to use ngx-wig version X.
For **Angular 7** `ngx-wig@2.0.0` 
For **Angular 6** `ngx-wig@1.6.0`  
For **Angular 4** and **Angular = ^5** - use version `ngx-wig@1.2.7`  




## Icons

Icons are not in the pack!
You can use the icons that you like.
We recommend to use [Material Design Icons](https://cdn.materialdesignicons.com/2.1.19/css/materialdesignicons.min.css)


## Installation

ngx-wig could be simply installed via npm:

    npm install ngx-wig --save

### Important note:

The last version on ngx-wig that was built for Angular 4.x is 0.3.6.
Any higher version may be not fully compatible with Angular version lower than 5.0.0.


## Usage

First, import the ngx-wig to your module:

```typescript
import {NgxWigModule} from 'ngx-wig';

@NgModule({
  imports: [ NgxWigModule ]
});
```

it's just attribute directive for textarea:

```html
<link href="https://cdn.materialdesignicons.com/2.1.19/css/materialdesignicons.min.css" rel="stylesheet" />
...
<ngx-wig [content]="text1"></ngx-wig>
```

## Examples

### Quick start ( [demo](https://stackblitz.com/edit/ngx-wig-sample2?file=src%2Fapp.ts) )

```html
<ngx-wig [content]="text1"></ngx-wig>
```

### Placeholder  ( [demo](https://stackblitz.com/edit/ngx-wig-sample3?file=src/app.ts) )

```html
<ngx-wig  [content]="text1" [placeholder]="'Enter instructions here.'"></ngx-wig>
```

### ngModel sync ( [demo](https://stackblitz.com/edit/ngx-wig-sample4?file=src/app.ts) )

```html
<ngx-wig [(ngModel)]="text1"></ngx-wig>
<ngx-wig [(ngModel)]="text1"></ngx-wig>
```

### Set buttons ( [demo](https://stackblitz.com/edit/ngx-wig-sample5?file=src/app.ts) )

```html
<ngx-wig  [content]="text1" [buttons]="'bold, italic'"></ngx-wig>
```

### onContentChange Hook  ( [demo](https://stackblitz.com/edit/ngx-wig-sample6?file=src/app.ts) )

```html
<ngx-wig [content]="text1" (contentChange)="result = $event"></ngx-wig>
<div [innerHTML]="result"></div>
```

### Reactive FormControl ( [demo](https://stackblitz.com/edit/ngx-wig-sample7?file=src/app.ts) )

```html
<ngx-wig  [formControl]="text1"></ngx-wig>
```

### Two-way binding ( [demo](https://stackblitz.com/edit/ngx-wig-sample8?file=src/app.ts) )

```html
<ngx-wig [(ngModel)]="text1"></ngx-wig>
```

### Adding own buttons

Please check an example here
https://stackblitz.com/edit/ngx-wig-sample-plugins?file=src/app.ts


## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

To run all tests:

```bash
$ npm run test
```

## License

MIT © [Stepan Suvorov](https://github.com/stevermeister)

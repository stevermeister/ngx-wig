ngx-wig
=====

## Dependencies

*it's only Angular! No jQuery or other WYSIWYG monsters*


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
<ngx-wig [content]="text1"></ngx-wig>
```

## Examples

### Quick start

```html
<ngx-wig [content]="text1"></ngx-wig>
```

### Placeholder

```html
<ngx-wig  [content]="text1" [placeholder]="'Enter instructions here.'"></ngx-wig>
```

### ngModel sync

```html
<ngx-wig [content]="text1"></ngx-wig>
<ngx-wig [content]="text1"></ngx-wig>
```

### Set buttons

```html
<ngx-wig  [content]="text1" [buttons]="formats, bold, italic"></ngx-wig>
```

### onContentChange Hook

```html
<ngx-wig [content]="text1" (contentChange)="update($event)"></ngx-wig>
```


## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Stepan Suvorov](https://github.com/stevermeister)

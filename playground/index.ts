/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { NgxWigModule }  from 'ngx-wig';

@Component({
  selector: 'my-app',
  template: `<ngx-wig [content]="text" [isSourceModeAllowed]="true"></ngx-wig>`
})
class AppComponent {
  public text = `There are a few options for making a WYSIWYG editor that works in the browser.

  Pure DHTML/JavaScript. Capture mouse input, buttons, keystrokes, etc., and actually edit the HTML of the current document. It's not trivial, but possible.
  Create a custom browser plug-in, Java applet, ActiveX control. This would probably be workable, but would take quite a bit of hackery, and may or may not work. Requiring users to install any sort of plugin is very undesirable.
  Imho, limited approach. Only Java applet is (possibly) cross-browser compatible. But not all users have Java on their machines and JavaScript is supported by all popular browsers (well, maybe except text-based, but I think that Java wouldn't work there too)... --Shtriter 07:20, 26 July 2006 (UTC)
  Users using text based browsers don't matter for WYSIWIG. They are going to be happier editing in Creole --Kevin Holzer (see hlzr.net for contact) 12:38, g29 December 2010 (PST)
  Both Mozilla and Internet Explorer have included ways to make sections of a page editable. IE 5.5 had the MSHTML Editing Platform (archive.org), and Mozilla has its Rich Text Editing API. Both technologies allow Web developers to make parts of a page editable -- in slightly different ways, of course.
  Most current in-browser WYSIWYG editors use the third option.`;
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, NgxWigModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

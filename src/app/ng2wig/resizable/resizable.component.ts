import { Component, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-resizable',
  templateUrl: './resizable.component.html',
  styleUrls: ['./resizable.component.css']
})
export class ResizableComponent implements OnInit {

  @Input() container: ElementRef;
  @Input() min: number = 300;
  @Input() max: number = null;

  currentHeight: number;

  public constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('mouseenter') onMouseEnter() {
    // this.highlight(this.highlightColor || 'red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    // this.highlight(null);
  }

  public ngOnInit(): void {
    this.currentHeight = this.min;
    this.container = this.container
      ? this.container
      : this.renderer.parentNode(this.el);
    console.log(this.container);
  }
}

import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appCopyClipboard]'
})
export class CopyClipboardDirective {
  @Input('appCopyClipboard') public payload: string;
  @Output() public copied: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.payload) {
      return;
    }

    const listener = (clipboardEvent: ClipboardEvent) => {
      const clipboard = clipboardEvent.clipboardData || window['clipboardData'];
      clipboard.setData('text', this.payload.toString());
      clipboardEvent.preventDefault();
      this.copied.emit(this.payload);
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }
}

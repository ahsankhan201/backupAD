import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[appDocumentClick]'
})
export class DocumentClickDirective {
    constructor() {
    }

    @Output()
    public clickOutside = new EventEmitter<MouseEvent>();

    @HostListener('document:click', ['$event', '$event.target'])
    public onClick(event: MouseEvent, targetElement: HTMLElement): void {
        this.clickOutside.emit(event);
    }
}

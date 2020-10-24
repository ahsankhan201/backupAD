import {
    Component, OnInit, Output,
    EventEmitter, ElementRef,
    ViewChild, OnDestroy
} from '@angular/core';

import { TRANSACTION_GRID_TEXT } from '../../global-constants';

@Component({
    selector: 'app-infinite-scroll',
    template: `<ng-content></ng-content><div #scrollWrapper></div>`,
    styles: [':host {  display: block;}']
})
export class InfiniteScrollComponent implements OnInit, OnDestroy {
    @Output() scrolled = new EventEmitter();
    @ViewChild('scrollWrapper', { static: true }) scrollWrapper: ElementRef<HTMLElement>;

    private observer$: IntersectionObserver;

    constructor(private host: ElementRef) { }

    get element() {
        return this.host.nativeElement;
    }

    ngOnInit() {
        this.addScrollSubscription();
    }

    /**
     * @methodName addScrollSubscription
     * @description used to the subscription to the scroll container
     * @parameters none
     * @return none
     */
    addScrollSubscription(): void {
        // these options are used for adding smooth scrolling beahviour
        const options = {
            root: this.isHostScrollable() ? this.host.nativeElement : null
        };
        // It'll emit the value when the user scrolls to the end
        this.observer$ = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                this.scrolled.emit();
            }
        }, options);
        // It'll add the abserver to the scroll container
        this.observer$.observe(this.scrollWrapper.nativeElement);
    }
    /**
     * @methodName isHostScrollable
     * @description used to get host container is scrollabe or not
     * @parameters none
     * @return boolean
     */
    isHostScrollable(): boolean {
        const style = window.getComputedStyle(this.element);
        return style.getPropertyValue('overflow') === TRANSACTION_GRID_TEXT.SCROLL_AUTO_TEXT ||
            style.getPropertyValue('overflow-y') === TRANSACTION_GRID_TEXT.SCROLL_OVERFLOW_TEXT;
    }

    ngOnDestroy() {
        this.observer$.disconnect();
    }
}

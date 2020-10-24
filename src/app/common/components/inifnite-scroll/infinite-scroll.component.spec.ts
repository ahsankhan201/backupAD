import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollComponent } from '../inifnite-scroll/infinite-scroll.component';

describe('InfiniteScrollComponent', () => {
  let component: InfiniteScrollComponent;
  let fixture: ComponentFixture<InfiniteScrollComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfiniteScrollComponent],
    })
      .compileComponents();
    fixture = TestBed.createComponent(InfiniteScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checking component creation method
  it('should create', () => {
    const isContentScrollable = component.isHostScrollable();
    expect(isContentScrollable).toBeFalsy();
  });
});

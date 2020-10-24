import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyClipboardDirective } from './copy-clipboard.directive';
import { Component } from '@angular/core';

@Component({
  template: `<input [appCopyClipboard]="'this is the passed string'" role="button" type="button">`
})

class MockCopyToClipboardComponent { }

describe('CopyClipboardDirective', () => {

  let fixture: ComponentFixture<MockCopyToClipboardComponent>;
  let component: MockCopyToClipboardComponent;
  let element;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CopyClipboardDirective, MockCopyToClipboardComponent]
    });
    fixture = TestBed.createComponent(MockCopyToClipboardComponent);
    element = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new CopyClipboardDirective();
    expect(directive).toBeTruthy();
  });

  it('should run the copy command', () => {
    spyOn(document, 'execCommand');
    element.querySelector('input').click();
    expect(document.execCommand).toHaveBeenCalled();
  });

});

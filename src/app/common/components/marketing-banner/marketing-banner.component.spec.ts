import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingBannerComponent } from './marketing-banner.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('MarketingBannerComponent', () => {
  let component: MarketingBannerComponent;
  let fixture: ComponentFixture<MarketingBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketingBannerComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

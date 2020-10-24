import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderComponent } from './service-provider.component';
import { RtaSelectionComponent } from '../rta-selection/rta-selection.component';
import { TelecomSelectionComponent } from '../telecom-selection/telecom-selection.component';
import { WaterElectricitySelectionComponent } from '../water-electricity-selection/water-electricity-selection.component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ServiceProviderComponent', () => {
  let component: ServiceProviderComponent;
  let fixture: ComponentFixture<ServiceProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonAppModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [
        ServiceProviderComponent,
        RtaSelectionComponent,
        TelecomSelectionComponent,
        WaterElectricitySelectionComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

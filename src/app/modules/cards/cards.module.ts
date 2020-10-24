import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { CardsRoutingModule } from './cards-routing.module';

import { CardsComponent } from './components/cards.component';
import { CardsListComponent } from './components/cards-list/cards-list.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { DebitCardDetailsComponent } from './components/debit-card-details/debit-card-details.component';
import { CoverLimitComponent } from './components/cover-limit/cover-limit.component';
import { LinkAccountComponent } from './components/link-account/link-account.component';
import { CoverCardDetailsComponent } from './components/cover-card-details/cover-card-details.component';
import { ActivateCardComponent } from './components/activate-card/activate-card.component';

@NgModule({
  declarations: [
    CardsComponent,
    CardsListComponent,
    DebitCardDetailsComponent,
    CoverCardDetailsComponent,
    ActivateCardComponent,
    CoverLimitComponent,
    CardsComponent, CardsListComponent, DebitCardDetailsComponent,
    CoverCardDetailsComponent, ActivateCardComponent, LinkAccountComponent
  ],
  imports: [
    CommonModule,
    CardsRoutingModule,
    CommonAppModule,
    SharedDirectiveModule,
    TranslateModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class CardsModule {}

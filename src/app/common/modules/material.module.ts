import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// including material modules

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatStepperModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatMenuModule} from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatStepperModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatSliderModule,
  ],
  exports: [
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatStepperModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatSliderModule,
  ]
})

export class MaterialModule { }

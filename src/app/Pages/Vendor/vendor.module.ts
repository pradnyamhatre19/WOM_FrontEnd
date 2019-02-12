import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ButtonModule } from 'primeng/button';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor/vendor.component';
import { VendorListingComponent } from './vendor-listing/vendor-listing.component';
import { VendorScreenComponent } from './vendor-screen/vendor-screen.component';
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  imports: [
    CommonModule,
    VendorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    AutoCompleteModule,
    NgMultiSelectDropDownModule.forRoot(),
    ButtonModule,
    TooltipModule
  ],
  declarations: [
    VendorComponent,
    VendorListingComponent,
    VendorScreenComponent
  ]
})
export class VendorModule { }

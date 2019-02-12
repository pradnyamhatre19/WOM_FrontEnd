import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee/employee.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeListingComponent } from './employee-listing/employee-listing.component';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    AutoCompleteModule,
    ButtonModule,
    TooltipModule
  ],
  declarations: [
    EmployeeComponent,
    EmployeeListingComponent,
    AddEmployeeComponent
  ]
})
export class EmployeeModule { }

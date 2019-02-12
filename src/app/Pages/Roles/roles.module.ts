import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles/roles.component';
import { ManagePrivilagesComponent } from './manage-privilages/manage-privilages.component';
import { ManageRolesComponent } from './manage-roles/manage-roles.component';
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  imports: [
    CommonModule,
    RolesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    AutoCompleteModule,
    ButtonModule,
    TooltipModule
  ],
  declarations: [
    RolesComponent,
    ManagePrivilagesComponent,
    ManageRolesComponent
  ]
})
export class RolesModule { }

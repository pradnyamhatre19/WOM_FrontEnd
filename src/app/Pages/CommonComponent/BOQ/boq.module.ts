import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';

import { AddBOQComponent } from './add-boq/add-boq.component';
import { BOQListingComponent } from './boqlisting/boqlisting.component';
import { BoqComponent } from './boq/boq.component';
import { BoqRoutingModule } from './boq-routing.module';
import {TooltipModule} from 'primeng/tooltip';
import { ApplicationPipeModule } from 'src/app/Shared/Module/application-pipe/application-pipe.module';


@NgModule({
  imports: [
    CommonModule,
    BoqRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    AutoCompleteModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    ApplicationPipeModule
  ],
  declarations: [
    BoqComponent,
    BOQListingComponent,
    AddBOQComponent
  ]
})
export class BoqModule { }

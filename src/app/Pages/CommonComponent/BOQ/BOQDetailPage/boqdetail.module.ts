import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { OrderByPipe } from 'src/app/Shared/Pipe/order-by.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule} from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { BOQDetailRoutingModule } from './boqdetail-routing.module';
import { BOQDetailComponent } from './boqdetail/boqdetail.component';
import { CreateEstimatePageComponent } from './create-estimate-page/create-estimate-page.component';
import { ApplicationPipeModule } from 'src/app/Shared/Module/application-pipe/application-pipe.module';
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  imports: [
    CommonModule,
    BOQDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    AccordionModule,
    CalendarModule,
    DialogModule,
    AutoCompleteModule,
    ApplicationPipeModule,
    TooltipModule
  ],
  declarations: [
    BOQDetailComponent,
    CreateEstimatePageComponent,
    OrderByPipe
  ]
})
export class BOQDetailModule { }

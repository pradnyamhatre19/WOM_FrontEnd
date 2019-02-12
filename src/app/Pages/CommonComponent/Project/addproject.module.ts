import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ButtonModule } from 'primeng/button';
import { CalendarModule} from 'primeng/calendar';
import { DropdownModule} from 'primeng/dropdown';

import { AddprojectRoutingModule } from './addproject-routing.module';
import { AddNewProjectPageComponent } from './add-new-project-page/add-new-project-page.component';
// import { LoaderComponent } from 'src/app/Shared/Components/loader/loader.component';
import { AddprojectComponent } from './addproject/addproject.component';
import { AddnewclientModule } from '../../Client/clientinformation/addnewclient/addnewclient.module';
import {TooltipModule} from 'primeng/tooltip';
import { ApplicationPipeModule } from 'src/app/Shared/Module/application-pipe/application-pipe.module';



@NgModule({
  imports: [
    CommonModule,
    AddprojectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    NgMultiSelectDropDownModule,
    AddnewclientModule,
    TooltipModule,
    ApplicationPipeModule
  ],
  declarations: [
    AddprojectComponent,
    AddNewProjectPageComponent,
    // LoaderComponent,
  ]
})
export class AddprojectModule { }

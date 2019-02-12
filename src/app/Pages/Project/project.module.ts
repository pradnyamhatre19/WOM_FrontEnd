import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ButtonModule } from 'primeng/button';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project/project.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { ProjectPlanningComponent } from './project-planning/project-planning.component';
import { PlanningTableComponent } from './project-planning/planning-table/planning-table.component';
import { ProjectsTableComponent } from './project-page/projects-table/projects-table.component';
import {TooltipModule} from 'primeng/tooltip';
import { ApplicationPipeModule } from 'src/app/Shared/Module/application-pipe/application-pipe.module';


@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    AutoCompleteModule,
    NgMultiSelectDropDownModule.forRoot(),
    ButtonModule,
    TooltipModule,
    ApplicationPipeModule
  ],
  declarations: [
    ProjectComponent,
    ProjectPageComponent,
    ProjectsTableComponent,
    ProjectPlanningComponent,
    PlanningTableComponent  
  ]
})
export class ProjectModule { }

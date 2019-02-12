import { ButtonModule } from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule} from 'primeng/autocomplete';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category/category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddParametersComponent } from './add-parameters/add-parameters.component';
import { CategoryListingComponent } from './category-listing/category-listing.component';
import {TooltipModule} from 'primeng/tooltip';
import { ApplicationPipeModule } from 'src/app/Shared/Module/application-pipe/application-pipe.module';


@NgModule({
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    AutoCompleteModule,
    ButtonModule,
    TooltipModule,
    ApplicationPipeModule
  ],
  declarations: [
    CategoryComponent,
    AddCategoryComponent,
    CategoryListingComponent,
    AddParametersComponent
  ]
})
export class CategoryModule { }

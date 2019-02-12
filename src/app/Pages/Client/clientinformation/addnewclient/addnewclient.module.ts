import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientinformationComponent } from '../clientinformation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    DialogModule,
    TableModule,
    ButtonModule,
    TooltipModule
  ],
  declarations: [
    ClientinformationComponent
  ],
    exports:[
      ClientinformationComponent
    ]
})
export class AddnewclientModule { }

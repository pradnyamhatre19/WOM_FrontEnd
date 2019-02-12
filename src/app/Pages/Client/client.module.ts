
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client/client.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { ClientinformationComponent } from './clientinformation/clientinformation.component';
import { AddnewclientModule } from './clientinformation/addnewclient/addnewclient.module';
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    DialogModule,
    TableModule,
    ButtonModule,
    AddnewclientModule,
    TooltipModule
  ],
  declarations: [
    ClientComponent,
    // ClientinformationComponent,
    ClientDashboardComponent
  ]
})
export class ClientModule { }

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { InplaceModule } from 'primeng/inplace';
import { CheckboxModule } from 'primeng/checkbox';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AccordionModule } from 'primeng/accordion';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule, 
    InputTextModule,
    DialogModule,
    AngularFontAwesomeModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    CalendarModule,
    InplaceModule,
    AppRoutingModule,
    CheckboxModule,
    ChartModule,
    MultiSelectModule,
    AccordionModule,
    SidebarModule
  ],
  declarations: [],
  exports:[
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule, 
    InputTextModule,
    DialogModule,
    AngularFontAwesomeModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    CalendarModule,
    InplaceModule,
    AppRoutingModule,
    CheckboxModule,
    ChartModule,
    MultiSelectModule,
    AccordionModule,
    SidebarModule
  ]
})
export  class SharedModule { 
  // static forRoot(): ModuleWithProviders{
  //   return {
  //     ngModule: SharedModule
  //   };
  // }
}

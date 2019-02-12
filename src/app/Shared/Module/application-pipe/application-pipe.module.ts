import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewcurrencyPipe } from '../../Pipe/newcurrency.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NewcurrencyPipe
  ],
  exports: [
    NewcurrencyPipe
  ]
})
export class ApplicationPipeModule { }

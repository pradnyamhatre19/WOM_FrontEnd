import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product/product.component';
import { ProductSkuListingComponent } from './product-sku-listing/product-sku-listing.component';
import { AddProductComponent } from './add-product/add-product.component';
import {TooltipModule} from 'primeng/tooltip';
import { ApplicationPipeModule } from 'src/app/Shared/Module/application-pipe/application-pipe.module';


@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
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
    ProductComponent,
    AddProductComponent,
    ProductSkuListingComponent
  ]
})
export class ProductModule { }

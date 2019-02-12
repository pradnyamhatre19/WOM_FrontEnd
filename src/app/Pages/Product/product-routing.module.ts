import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ProductSkuListingComponent } from './product-sku-listing/product-sku-listing.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path:'',
    component:ProductComponent,
    canActivate :[AuthGuard],
    children:[
   {
      path:'product',
      component:ProductSkuListingComponent
    },
    {
      path: '', 
      redirectTo: 'product', 
      pathMatch: 'full' 
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

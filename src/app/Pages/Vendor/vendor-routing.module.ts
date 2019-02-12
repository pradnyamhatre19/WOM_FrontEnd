import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorComponent } from './vendor/vendor.component';
import { VendorListingComponent } from './vendor-listing/vendor-listing.component';
import { VendorScreenComponent } from './vendor-screen/vendor-screen.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
      path:'',
      component:VendorComponent,
      canActivate :[AuthGuard],
      children:[
    {
        path:'vendorListing',
        component:VendorListingComponent
      },
      {
        path:'vendorinformation',
        component:VendorScreenComponent
      },
      {
        path: '', 
        redirectTo: 'vendorListing', 
        pathMatch: 'full' 
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }

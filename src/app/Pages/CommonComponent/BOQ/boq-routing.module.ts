import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BOQListingComponent } from './boqlisting/boqlisting.component';
import { BoqComponent } from './boq/boq.component';
import { AuthGuard } from 'src/app/auth.guard';


const routes: Routes = [
  {
      path:'',
      component:BoqComponent,
      canActivate :[AuthGuard],
      children:[
        {
          path: '', 
          redirectTo: 'BoQList', 
          pathMatch: 'full' 
        },
        {
          path:'BoQList',
          component:BOQListingComponent
        },{
          path:'BOQDetailPage',
          loadChildren:'./BOQDetailPage/boqdetail.module#BOQDetailModule'
        }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoqRoutingModule { }

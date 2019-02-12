import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client/client.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { ClientinformationComponent } from './clientinformation/clientinformation.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path:'',
    component:ClientComponent,
    canActivate :[AuthGuard],
    children:[
   {
      path:'client',
      component:ClientDashboardComponent
    },
    {
      path:'clientinformation',
      component:ClientinformationComponent
    },
    {
      path: '', 
      redirectTo: 'client', 
      pathMatch: 'full' 
    }
  ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }

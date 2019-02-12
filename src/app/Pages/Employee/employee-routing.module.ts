import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeComponent } from './employee/employee.component';
import { EmployeeListingComponent } from './employee-listing/employee-listing.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
      path:'',
      component:EmployeeComponent,
      canActivate :[AuthGuard],
      children:[
        {
          path: '', 
          redirectTo: 'employeeListing', 
          pathMatch: 'full' 
        },
        {
            path:'employeeListing',
            component:EmployeeListingComponent
          },
      {
        path:'add_category',
        component:AddEmployeeComponent
      }

    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }

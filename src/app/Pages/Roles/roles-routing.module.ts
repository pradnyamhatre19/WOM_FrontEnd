import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { ManageRolesComponent } from './manage-roles/manage-roles.component';
import { ManagePrivilagesComponent } from './manage-privilages/manage-privilages.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
  path:'',
  component:RolesComponent,
  canActivate :[AuthGuard],
  children:[
 {
    path:'ManageRoles',
    component:ManageRolesComponent
  },
  {
    path:'ManagePrivilages',
    component:ManagePrivilagesComponent
  },
  {
    path: '', 
    redirectTo: 'ManageRoles', 
    pathMatch: 'full' 
  }
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }

import { AddprojectComponent } from './addproject/addproject.component';
import { AddNewProjectPageComponent } from './add-new-project-page/add-new-project-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [  
    {
    path:'',
    component:AddprojectComponent,
    canActivate :[AuthGuard],
    children:[
        {
          path: '', 
          redirectTo: 'add_new_projects', 
          pathMatch: 'full' 
        },
        {
          path:'add_new_projects',
          component:AddNewProjectPageComponent
        }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddprojectRoutingModule { }

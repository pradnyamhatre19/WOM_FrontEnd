import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { ProjectPlanningComponent } from './project-planning/project-planning.component';
import { AuthGuard } from 'src/app/auth.guard';


const routes: Routes = [
  {
      path:'',
      component:ProjectComponent,
      canActivate :[AuthGuard],
      children:[
      {
        path:'Budgeting', 
        data: { breadcrumb: 'Budgeting'},
        component:ProjectPageComponent
      },
      {
        path:'show_planning_table', 
        data: { breadcrumb: 'show_planning_table'},
        component:ProjectPlanningComponent
      },  
      {
        path:'AddProject', 
        data: { breadcrumb: 'AddProject'},
        loadChildren:'../CommonComponent/Project/addproject.module#AddprojectModule'
      },
      { 
        path:'BOQ', 
        data: { breadcrumb: 'BOQ'},
        loadChildren:'../CommonComponent/BOQ/boq.module#BoqModule'},
      {
        path: '', 
        redirectTo: 'Budgeting', 
        pathMatch: 'full' 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }

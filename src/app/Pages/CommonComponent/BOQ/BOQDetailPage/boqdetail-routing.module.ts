import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BOQDetailComponent } from './boqdetail/boqdetail.component';
import { CreateEstimatePageComponent } from './create-estimate-page/create-estimate-page.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [{
  path:'',
  component:BOQDetailComponent,
  canActivate :[AuthGuard],
  children:[
    {
      path:'create_project_estimate',
      component:CreateEstimatePageComponent
    },{
        path: '', 
        redirectTo: 'create_project_estimate', 
        pathMatch: 'full' 
    }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BOQDetailRoutingModule { }

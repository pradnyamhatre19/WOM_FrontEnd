import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { CategoryListingComponent } from './category-listing/category-listing.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddParametersComponent } from './add-parameters/add-parameters.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path:'',
    component:CategoryComponent,
    canActivate :[AuthGuard],
    children:[
   {
      path:'category',
      component:CategoryListingComponent
    },
    {
      path:'add_category',
      component:AddCategoryComponent
    },
    {
      path:'parameters',
      component:AddParametersComponent
    },
    {
      path: '', 
      redirectTo: 'category', 
      pathMatch: 'full' 
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }

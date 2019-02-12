import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './Login/login/login.component';
import { ResetpasswordComponent } from './Login/resetpassword/resetpassword.component';
import { ChangepasswordComponent } from './Login/changepassword/changepassword.component';
import { FooterComponent } from './Shared/Components/footer/footer.component';
import { EmpinformationComponent } from './Pages/empinformation/empinformation.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
    { path: '',  redirectTo: 'login', pathMatch: 'full' },
    { path: 'login',
     component: LoginComponent
    },
    { path: 'resetpassword',
     component: ResetpasswordComponent,
    },
    { path: 'changepassword',
     component: ChangepasswordComponent,
     canActivate :[AuthGuard]
    },
    { path: 'footer',
     component: FooterComponent,
    },
    { path: 'empinformation',
     component: EmpinformationComponent,
     canActivate :[AuthGuard]
    },
    { path: 'dashboard',
     component: DashboardComponent,
     canActivate :[AuthGuard]
    },
    { path:'Project',loadChildren:'./Pages/Project/project.module#ProjectModule',},
    { path:'category',loadChildren:'./Pages/Category/category.module#CategoryModule'},
    { path:'employee',loadChildren:'./Pages/Employee/employee.module#EmployeeModule'},
    { path:'client',loadChildren:'./Pages/Client/client.module#ClientModule'},
    { path:'vendor',loadChildren:'./Pages/Vendor/vendor.module#VendorModule'},
    { path:'ManageRoles',loadChildren:'./Pages/Roles/roles.module#RolesModule'},
    { path:'product',loadChildren:'./Pages/Product/product.module#ProductModule'},    
    { path: '**', redirectTo: 'login' },
   
];


const config: ExtraOptions = {
    useHash: true,
  };

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {
  }
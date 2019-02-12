import { LoaderComponent } from './Shared/Components/loader/loader.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Shared/Components/header/header.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DropdownModule} from 'primeng/dropdown';
import { CalendarModule} from 'primeng/calendar';
import { HttpModule} from "@angular/http";
import { AutoCompleteModule} from 'primeng/autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './Login/login/login.component';
import { ReactiveFormsModule }   from '@angular/forms';
import { ResetpasswordComponent } from './Login/resetpassword/resetpassword.component';
import { ChangepasswordComponent } from './Login/changepassword/changepassword.component';
import { FooterComponent } from './Shared/Components/footer/footer.component';
import { LoginService } from './services/Login/login.service';
import { EmpinformationComponent } from './Pages/empinformation/empinformation.component';
import { InplaceModule} from 'primeng/inplace';
import { CommunicateService } from './services/Communication/communicate.service';

import { CheckboxModule} from 'primeng/checkbox';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import {ChartModule} from 'primeng/chart';
import { CommonCallService } from './services/CommonNodeCall/common-call.service';
/**Added by Amol for Multiple File Upload */
import { UploadfileService } from '../app/services/FileUpload/uploadfile.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { LoginHeaderComponent } from './Shared/Components/login-header/login-header.component';

import { AccordionModule } from 'primeng/accordion';
import { SidebarModule } from 'primeng/sidebar';
import { ErrorPopupComponent } from './Shared/Components/error-popup/error-popup.component';
import {BreadcrumbsModule} from "ng2-breadcrumbs";
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { NgHttpLoaderModule } from 'ng-http-loader';
import {TooltipModule} from 'primeng/tooltip';
import { ApplicationPipeModule } from './Shared/Module/application-pipe/application-pipe.module';



@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        LoginComponent,
        ResetpasswordComponent,
        ChangepasswordComponent,
        FooterComponent,
        EmpinformationComponent,
        DashboardComponent,
        LoginHeaderComponent,
        ErrorPopupComponent,
        LoaderComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        HttpClientModule,
        HttpModule,
        InputTextModule,
        DialogModule,
        AngularFontAwesomeModule,
        ButtonModule,
        DropdownModule,
        AutoCompleteModule,
        CalendarModule,
        InplaceModule,
        AppRoutingModule,
        CheckboxModule,
        NgMultiSelectDropDownModule.forRoot(),
        ChartModule,
        MultiSelectModule,
        AccordionModule,
        SidebarModule,
        BreadcrumbsModule,
        TooltipModule,
        ApplicationPipeModule,
        NgHttpLoaderModule.forRoot()
        ],
    providers: [
        LoginService,
        CommunicateService,
        CommonCallService,
        UploadfileService,
        AuthService,
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
    schemas: [ NO_ERRORS_SCHEMA ],
    // entryComponents: [
    //     LoaderComponent
    // ],
})
export class AppModule { }

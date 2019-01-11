// export module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AlertModule, DatepickerModule, TabsModule, AccordionModule } from 'ng2-bootstrap';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { environment } from '../environments/environment';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';


const DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: environment.api_base_url,
    maxFilesize: 25,
    timeout: environment.set_timeout_sec
};

let modules = [
    AlertModule.forRoot(),
    DatepickerModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ToasterModule,
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    TabsModule.forRoot(),
    AccordionModule.forRoot()
];

// export Component

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './widgets/app-header';
import { AppFooterComponent } from './widgets/app-footer';
import { MenuAsideComponent } from './widgets/menu-aside';
import { UserBoxComponent } from './widgets/user-box';

let widgets = [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    MenuAsideComponent,
    UserBoxComponent
];

// export Service
import { UtilitiesHelper } from './services/utilities.service';
import { UserService } from './services/user.service';
import { MessagesService } from './services/messages.service';
import { CanActivateGuard } from './services/guard.service';
import { NotificationService } from './services/notification.service';
import { DisbursementService } from './services/disbursement.service';
import { InventoryMasterService } from './services/inventory-master.service';
import { OrderInventoryServiceService } from './services/order-inventory-service.service';
import { DlmsBillingService } from './services/dlms-billing.service';
import { BranchService } from './services/branch.service';
import { VendorsService } from './services/vendors.service';
import { DeliverablesService } from './services/deliverables.service';
import { UsersMasterService } from './services/users-master.service';


let services = [
    UtilitiesHelper,
    UserService,
    MessagesService,
    CanActivateGuard,
    NotificationService,
    DisbursementService,
    InventoryMasterService,
    OrderInventoryServiceService,
    DlmsBillingService,
    BranchService,
    VendorsService,
    DeliverablesService,
    UsersMasterService
];

// les pages
import { LayoutsAuthComponent } from './pages/layouts/auth/auth';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/pageNotFound/pageNotFound.component';

let pages = [
    LayoutsAuthComponent,
    LoginComponent,
    PageNotFoundComponent
];

// main bootstrap
import { routing } from './app.routes';

let directive = [];

let pipes = [];


@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        ...widgets,
        ...pages,
        ...pipes,
        ...directive,
    ],
    imports: [
        ...modules,
        routing
    ],
    providers: [
        ...services
    ]
})
export class AppModule { }

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuard } from './services/guard.service';

// Components
import { HomeComponent } from './pages/home/home.component';
import { LayoutsAuthComponent } from './pages/layouts/auth/auth';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/pageNotFound/pageNotFound.component';


const routes: Routes = [
    // logged routes
    {
        canActivate: [CanActivateGuard],
        children: [
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/home/home.module#HomeModule',
                path: 'my-profile'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/home/home.module#HomeModule',
                path: 'home'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/deliverables-fdr/deliverables-fdr.module#DeliverablesFdrModule',
                path: 'deliverables/track'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/upload-files/upload-files.module#UploadFilesModule',
                path: 'deliverables/upload'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/users-master/users-master.module#UsersMasterModule',
                path: 'users/list'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/deliverables-reports/deliverables-reports.module#DeliverablesReportsModule',
                path: 'deliverables/reports/:id'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/my-profile/my-profile.module#MyProfileModule',
                path: 'profile/change-password'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/disbursement/disbursement.module#DisbursementModule',
                path: 'disbursement'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/disbursement-report/disbursement-report.module#DisbursementReportModule',
                path: 'disbursement/Reports'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/deliverables-couriervendor-billing/deliverables-couriervendor-billing.module#DeliverablesCouriervendorBillingModule',
                path: 'deliverables/courier-billing'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/deliverables-productionvendor-billing/deliverables-productionvendor-billing.module#DeliverablesProductionvendorBillingModule',
                path: 'deliverables/production-billing'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/order-inventory/order-inventory.module#OrderInventoryModule',
                path: 'order-inventory'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/admin-inventory/admin-inventory.module#AdminInventoryModule',
                path: 'admin-inventory'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/order-inventory/order-inventory.module#OrderInventoryModule',
                path: 'order-inventory/:id'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/orders-list/order-list.module#OrderListModule',
                path: 'orders-list'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/order-received/order-received.module#OrderReceivedModule',
                path: 'order-received'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/vendor-billing/vendor-billing.module#VendorBillingModule',
                path: 'vendor-billing'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/admin-billing/admin-billing.module#AdminBillingModule',
                path: 'admin-billing'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/cpu-billing/cpu-billing.module#CpuBillingModule',
                path: 'cpu-billing'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/inventory-master/inventory-master.module#InventoryMasterModule',
                path: 'inventory'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/inventory-master/inventory-master.module#InventoryMasterModule',
                path: 'inventory/:id'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/inventory-limit/inventory-limit.module#InventoryLimitModule',
                path: 'inventory-limit'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/vendors/vendors.module#VendorsModule',
                path: 'vendors'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/vendors/vendors.module#VendorsModule',
                path: 'vendors/:id'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/couriors/couriors.module#CouriorsModule',
                path: 'couriors'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/couriors/couriors.module#CouriorsModule',
                path: 'couriors/:id'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/delvi-dist/delvi-dist.module#DelviDistModule',
                path: 'deliverables/destruction'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/inventory-report/inventory-report.module#InventoryReportModule',
                path: 'inventory-report'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recordmgm-report/recordmgm-report.module#RecordmgmReportModule',
                path: 'recordmgm-report'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/add-branch/add-branch.module#AddBranchModule',
                path: 'branch/add'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/add-branch-vendor/add-branch-vendor.module#AddBranchVendorModule',
                path: 'branch-add-vendor'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/add-branch-vendor/add-branch-vendor.module#AddBranchVendorModule',
                path: 'branch-add-vendor/:id'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/add-branch-details/add-branch-details.module#AddBranchDetailsModule',
                path: 'branch/add/details'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/branch-details/branch-details.module#BranchDetailsModule',
                path: 'branch/details'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/add-br-property/add-br-property.module#AddBrPropertyModule',
                path: 'branch/add/property'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/loi/loi.module#LoiModule',
                path: 'branch/loi'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/add-br-fitouts/add-br-fitouts.module#AddBrFitoutsModule',
                path: 'branch/add/fitouts'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/add-assets/add-assets.module#AddAssetsModule',
                path: 'branch/add/assets'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/br-billing/br-billing.module#BrBillingModule',
                path: 'branch/billing'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/prereq-validate/prereq-validate.module#PrereqValidateModule',
                path: 'branch/validate-prereq'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/update-assets/update-assets.module#UpdateAssetsModule',
                path: 'branch/updated-assets'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/branch-report/branch-report.module#BranchReportModule',
                path: 'branch/reports'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/create-sms-temp/create-sms-temp.module#CreateSmsTempModule',
                path: 'sms/create-template'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/edit-sms-temp/edit-sms-temp.module#EditSmsTempModule',
                path: 'sms/edit-template/:id'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/department/department.module#DepartmentModule',
                path: 'department'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/users-mapping/users-mapping.module#UsersMappingModule',
                path: 'users-mapping'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/temp-list/temp-list.module#TempListModule',
                path: 'template-approved'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/temp-list-reject/temp-list-reject.module#TempListRejectModule',
                path: 'template-rejected'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/dept-temp-list/dept-temp-list.module#DeptTempListModule',
                path: 'template-upload'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/temp-list-approved/temp-list-approved.module#TempListApprovedModule',
                path: 'template-list'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/sms-report/sms-report.module#SmsReportModule',
                path: 'sms-report'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recd-branch/recd-branch.module#RecdBranchModule',
                path: 'branch-record'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recd-init/recd-init.module#RecdInitModule',
                path: 'record-init'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recd-cpu/recd-cpu.module#RecdCpuModule',
                path: 'cpu-record'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recod-cpu/recod-cpu.module#RecodCpuModule',
                path: 'cpu-vouchar'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recd-query/recd-query.module#RecdQueryModule',
                path: 'query-record'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recd-query-cpu/recd-query-cpu.module#RecdQueryCpuModule',
                path: 'query-record-cpu'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recod-query-cpu/recod-query-cpu.module#RecodQueryCpuModule',
                path: 'query-record-cpu-voucher'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recd-query-branch/recd-query-branch.module#RecdQueryBranchModule',
                path: 'query-record-branch'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recod-query-branch/recod-query-branch.module#RecodQueryBranchModule',
                path: 'query-record-branch-voucher'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recd-vendor/recd-vendor.module#RecdVendorModule',
                path: 'vendor-record'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/recod-vendor/recod-vendor.module#RecodVendorModule',
                path: 'vendor-vouchar'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/documenttype/documenttype.module#DocumenttypeModule',
                path: 'document-type'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/order-visitingcard/order-visitingcard.module#OrderVisitingcardModule',
                path: 'order-visiting-card'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/user-matrix/user-matrix.module#UserMatrixModule',
                path: 'user-matrix'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/user-matrix-approval/user-matrix-approval.module#UserMatrixApprovalModule',
                path: 'user-matrix-approval'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/users-report/users-report.module#UsersReportModule',
                path: 'users-report'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/instakit-records/instakit-records.module#InstakitRecordsModule',
                path: 'instakit-frfc'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/instakit-return/instakit-return.module#InstakitReturnModule',
                path: 'instakit-status-update'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
                path: 'dashboard'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/user-matrix-review/user-matrix-review.module#UserMatrixReviewModule',
                path: 'user-matrix-review'
            },
            {
                canActivate: [CanActivateGuard],
                loadChildren: './pages/app-master/app-master.module#AppMasterModule',
                path: 'application-master'
            }
        ],
        component: LayoutsAuthComponent,
        path: '',
    },
    // not logged routes
    {
        component: LoginComponent,
        path: 'login'
    },
    // does not match any path in url redirect to home
    {
        component: PageNotFoundComponent,
        path: '**'
    },

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

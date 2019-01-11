import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-layouts-auth',
    templateUrl: './auth.html'
})
export class LayoutsAuthComponent implements OnInit {
    private toastrConfig: ToasterConfig;
    private mylinks: Array<any> = [];
    private currentUser: User = new User();

    constructor(
        private userServ: UserService,
        private toastr: ToasterService
    ) {

        this.userServ.currentUser.subscribe((user: User) => this.currentUser = user);

        this.toastrConfig = new ToasterConfig({
            newestOnTop: true,
            showCloseButton: true,
            tapToDismiss: false
        });

    }

    public ngOnInit() {
        //  sedding the resize event, for AdminLTE to place the height
        let ie = this.detectIE();
        if (!ie) {
            window.dispatchEvent(new Event('resize'));
        } else {
            // solution for IE from @hakonamatata
            let event = document.createEvent('Event');
            event.initEvent('resize', false, true);
            window.dispatchEvent(event);
        }

        // define here your own links menu structure
        this.mylinks = [
            {
                'title': 'Dashboard',
                'icon': 'dashboard',
                'canAccess': [],
                'link': ['/home']
            },
            {
                'title': 'Disbursement',
                'icon': 'inr',
                'canAccess': ['DISBMT_AUDIT_OFFICER', 'DISBMT_EXECUTIVE_OPERATIONS', 'DISBMT_BRANCH_MANAGER'],
                'sublinks': [
                    {
                        'title': 'File Upload',
                        'link': ['/disbursement/Upload'],
                        'canAccess': ['DISBMT_EXECUTIVE_OPERATIONS']
                    },
                    {
                        'title': 'Reports',
                        'link': ['/disbursement/Reports'],
                        'canAccess': ['DISBMT_EXECUTIVE_OPERATIONS']
                    },
                    {
                        'title': 'Upload Photo/Receipt',
                        'link': ['/disbursement/Photo_Receipt'],
                        'canAccess': ['DISBMT_AUDIT_OFFICER']
                    },
                    {
                        'title': 'Verify Photo/Receipt',
                        'link': ['/disbursement/Verify'],
                        'canAccess': ['DISBMT_BRANCH_MANAGER']
                    }
                ]
            },
            {
                'title': 'Inventory Module',
                'icon': 'truck',
                'canAccess': ['STATIC_INVENTORY_CAN_ORDER', 'STATIC_INVENTORY_CAN_VERIFY_ORDER', 'STATIC_INVENTORY_CAN_UPLOAD_ORDER_DETAILS', 'STATIC_INVENTORY_ADMIN', 'STATIC_INVENTORY_VIEW_REPORT'],
                'sublinks': [
                    {
                        'title': 'Inventory (Add/Approve-Reject)',
                        'link': ['/order-inventory/pending'],
                        'canAccess': ['STATIC_INVENTORY_CAN_ORDER', 'STATIC_INVENTORY_CAN_VERIFY_ORDER']
                    },
                    {
                        'title': 'Visiting Card (Add/List)',
                        'link': ['/order-visiting-card'],
                        'canAccess': ['STATIC_INVENTORY_CAN_ORDER', 'STATIC_INVENTORY_CAN_VERIFY_ORDER']
                    },
                    {
                        'title': 'Upload Order Details',
                        'link': ['/order-received'],
                        'canAccess': ['STATIC_INVENTORY_CAN_UPLOAD_ORDER_DETAILS']
                    },
                    {
                        'title': 'Order Receipt',
                        'link': ['/order-inventory'],
                        'canAccess': ['STATIC_INVENTORY_CAN_ORDER', 'STATIC_INVENTORY_CAN_VERIFY_ORDER']
                    },
                    {
                        'title': 'Inventory (Admin Screen)',
                        'link': ['/admin-inventory'],
                        'canAccess': ['STATIC_INVENTORY_ADMIN']
                    },
                    {
                        'title': 'Inventory Report',
                        'link': ['/inventory-report'],
                        'canAccess': ['STATIC_INVENTORY_VIEW_REPORT']
                    },
                    {
                        'title': 'Instakit FRFC (Assign to Employee)',
                        'link': ['/instakit-frfc'],
                        'canAccess': ['STATIC_INVENTORY_CAN_ORDER', 'STATIC_INVENTORY_CAN_UPLOAD_ORDER_DETAILS']
                    },
                    {
                        'title': 'Instakit FRFC (Update status)',
                        'link': ['/instakit-status-update'],
                        'canAccess': ['STATIC_INVENTORY_CAN_ORDER', 'STATIC_INVENTORY_CAN_UPLOAD_ORDER_DETAILS']
                    }
                ]
            },
            {
                'title': 'Record Management Module',
                'icon': 'truck',
                'canAccess': ['RECORD_MGM_MODULE_BRANCH_USER', 'RECORD_MGM_MODULE_CPU_USER', 'RECORD_MGM_MODULE_VENDOR_USER', 'RECORD_MGM_MODULE_ADMIN_USER'],
                'sublinks': [
                    {
                        'title': 'Add/Update Records',
                        'link': ['/record-init'],
                        'canAccess': ['RECORD_MGM_MODULE_BRANCH_USER', 'RECORD_MGM_MODULE_CPU_USER']
                    },
                    {
                        'title': 'CPU (AOF/SR)',
                        'link': ['/cpu-record'],
                        'canAccess': ['RECORD_MGM_MODULE_CPU_USER']
                    },
                    {
                        'title': 'CPU (Record/voucher)',
                        'link': ['/cpu-vouchar'],
                        'canAccess': ['RECORD_MGM_MODULE_CPU_USER']
                    },
                    {
                        'title': 'RM vendor (AOF/SR)',
                        'link': ['/vendor-record'],
                        'canAccess': ['RECORD_MGM_MODULE_VENDOR_USER']
                    },
                    {
                        'title': 'RM vendor (Record/voucher)',
                        'link': ['/vendor-vouchar'],
                        'canAccess': ['RECORD_MGM_MODULE_VENDOR_USER']
                    },
                    {
                        'title': 'Retrieval records',
                        'link': ['/query-record'],
                        'canAccess': ['RECORD_MGM_MODULE_BRANCH_USER']
                    },
                    {
                        'title': 'CPU Retrieval (AOF/SR)',
                        'link': ['/query-record-cpu'],
                        'canAccess': ['RECORD_MGM_MODULE_CPU_USER']
                    },
                    {
                        'title': 'CPU Retrieval (Record/voucher)',
                        'link': ['/query-record-cpu-voucher'],
                        'canAccess': ['RECORD_MGM_MODULE_CPU_USER']
                    },
                    {
                        'title': 'Branch Retrieval (AOF/SR)',
                        'link': ['/query-record-branch'],
                        'canAccess': ['RECORD_MGM_MODULE_BRANCH_USER']
                    },
                    {
                        'title': 'Branch Retrieval (Record/voucher)',
                        'link': ['/query-record-branch-voucher'],
                        'canAccess': ['RECORD_MGM_MODULE_BRANCH_USER']
                    },
                    {
                        'title': 'Document Type Master',
                        'link': ['/document-type'],
                        'canAccess': ['RECORD_MGM_MODULE_ADMIN_USER']
                    },
                    {
                        'title': 'Report',
                        'link': ['/recordmgm-report'],
                        'canAccess': ['RECORD_MGM_MODULE_ADMIN_USER', 'RECORD_MGM_MODULE_BRANCH_USER', 'RECORD_MGM_MODULE_CPU_USER']
                    }
                ]
            },
            {
                'title': 'Deliverables Tracking',
                'icon': 'truck',
                'canAccess': ['CAN_VIEW_DELIVERABLES'],
                'link': ['/deliverables/track']
            },
            {
                'title': 'Deliverables Destruction',
                'icon': 'truck',
                'canAccess': ['CAN_DESTROY_DELIVERABLES'],
                'link': ['/deliverables/destruction']
            },
            {
                'title': 'Reports',
                'icon': 'bar-chart',
                'canAccess': ['CAN_VIEW_DELIVERABLES_REPORTS', 'CAN_VIEW_DELIVERABLES_REPORTS_HO', 'CAN_VIEW_DELIVERABLES_REPORTS_BRANCH'],
                'sublinks': [
                    {
                        'title': 'Deliverables Report ( HO )',
                        'link': ['/deliverables/reports/ho'],
                        'canAccess': ['CAN_VIEW_DELIVERABLES_REPORTS_HO']
                    },
                    {
                        'title': 'Deliverables Report ( Branch )',
                        'link': ['/deliverables/reports/branch'],
                        'canAccess': ['CAN_VIEW_DELIVERABLES_REPORTS_BRANCH']
                    }
                ]
            },
            {
                'title': 'Deliverables Billing',
                'icon': 'bar-chart',
                'canAccess': ['CAN_VIEW_DELIVERABLES_PRODUCTION_BILLING', 'CAN_VIEW_DELIVERABLES_COURIER_BILLING'],
                'sublinks': [
                    {
                        'title': 'Courier Billing',
                        'link': ['/deliverables/courier-billing'],
                        'canAccess': ['CAN_VIEW_DELIVERABLES_PRODUCTION_BILLING']
                    },
                    {
                        'title': 'Production',
                        'link': ['/deliverables/production-billing'],
                        'canAccess': ['CAN_VIEW_DELIVERABLES_COURIER_BILLING']
                    }
                ]
            },
            {
                'title': 'Users',
                'icon': 'users',
                'canAccess': ['CAN_ACCESS_USER_MODULE', 'CAN_REVIEW_USER_APPLICATION_ROLE'],
                'sublinks': [
                    {
                        'title': 'Search User',
                        'link': ['/users/list'],
                        'canAccess': ['CAN_ACCESS_USER_MODULE']
                    },
                    {
                        'title': 'Users Maxtrix',
                        'link': ['/user-matrix'],
                        'canAccess': ['CAN_ACCESS_USER_MODULE']
                    },
                    {
                        'title': 'Users Role Approval',
                        'link': ['/user-matrix-approval'],
                        'canAccess': ['CAN_ACCESS_USER_MODULE']
                    },
                    {
                        'title': 'Users Role Review',
                        'link': ['/user-matrix-review'],
                        'canAccess': ['CAN_REVIEW_USER_APPLICATION_ROLE']
                    },
                    {
                        'title': 'Reports',
                        'link': ['/users-report'],
                        'canAccess': ['CAN_ACCESS_USER_MODULE', 'CAN_REVIEW_USER_APPLICATION_ROLE']
                    }
                ]
            },
            {
                'title': 'My Profile',
                'icon': 'user-o',
                'canAccess': ['CAN_ACCESS_MY_PROFILE_CHANGE_PASSWORD'],
                'sublinks': [
                    {
                        'title': 'Profile',
                        'link': ['/my-profile'],
                        'canAccess': ['CAN_ACCESS_MY_PROFILE_CHANGE_PASSWORD']
                    }
                ]
            },
            {
                'title': 'Inventory Masters',
                'icon': 'cogs',
                'canAccess': ['CAN_VIEW_UPLOAD_DELIVERABLES_FILES', 'MASTER_CAN_ADD_INVENTORY', 'MASTER_CAN_VERIFY_INVENTORY', 'MASTER_CAN_ADD_VENDORS', 'MASTER_CAN_VERIFY_VENDORS', 'CAN_VIEW_UPLOAD_DELIVERABLES_FILES', 'CAN_UPLOAD_USER_FILE'],
                'sublinks': [
                    {
                        'title': 'Inventory list',
                        'link': ['/inventory'],
                        'canAccess': ['MASTER_CAN_ADD_INVENTORY']
                    },
                    {
                        'title': 'Inventory list ( Approval Pending )',
                        'link': ['/inventory/pending'],
                        'canAccess': ['MASTER_CAN_VERIFY_INVENTORY']
                    },
                    {
                        'title': 'Vendors list',
                        'link': ['/vendors'],
                        'canAccess': ['MASTER_CAN_ADD_VENDORS']
                    },
                    {
                        'title': 'Vendors list ( Approval Pending )',
                        'link': ['/vendors/pending'],
                        'canAccess': ['MASTER_CAN_VERIFY_VENDORS']
                    },
                    {
                        'title': 'Courier list',
                        'link': ['/couriors'],
                        'canAccess': ['MASTER_CAN_ADD_VENDORS']
                    },
                    {
                        'title': 'Courior list ( Approval Pending )',
                        'link': ['/couriors/pending'],
                        'canAccess': ['MASTER_CAN_VERIFY_VENDORS']
                    },
                    {
                        'title': 'Upload Files',
                        'link': ['/deliverables/upload'],
                        'canAccess': ['CAN_VIEW_UPLOAD_DELIVERABLES_FILES', 'CAN_UPLOAD_USER_FILE']
                    },
                ]
            },
            {
                'title': 'Masters',
                'icon': 'cogs',
                'canAccess': ['MASTER_ACCESS_TO_APPLICATION_MASTER'],
                'sublinks': [
                    {
                        'title': 'Application Master',
                        'link': ['/application-master'],
                        'canAccess': ['MASTER_ACCESS_TO_APPLICATION_MASTER']
                    }
                ]
            },
            {
                'title': 'Branch',
                'icon': 'cogs',
                'canAccess': ['BRANCH_BANKING_TEAM', 'COMPLIANCE_TEAM', 'ADMIN_INFRA_TEAM', 'IT_INFRA_TEAM', 'CHIEF_SERVICE_OFFICER', 'CHIEF_FINANCIAL_OFFICER', 'BUSINESS_HEAD', 'MD_AND_CEO'],
                'sublinks': [
                    {
                        'title': 'Add/Update Branch',
                        'link': ['/branch/add'],
                        'canAccess': ['COMPLIANCE_TEAM', 'BRANCH_BANKING_TEAM']
                    },
                    {
                        'title': 'Additional Branch Details',
                        'link': ['/branch/add/details'],
                        'canAccess': ['BRANCH_BANKING_TEAM']
                    },
                    {
                        'title': 'App Instl Status',
                        'link': ['/branch/details'],
                        'canAccess': ['COMPLIANCE_TEAM_DELETE']
                    },
                    {
                        'title': 'Premises Details',
                        'link': ['/branch/add/property'],
                        'canAccess': ['ADMIN_INFRA_TEAM', 'IT_INFRA_TEAM', 'CHIEF_SERVICE_OFFICER', 'CHIEF_FINANCIAL_OFFICER', 'BUSINESS_HEAD', 'MD_AND_CEO']
                    },
                    {
                        'title': 'Branch LOI',
                        'link': ['/branch/loi'],
                        'canAccess': ['ADMIN_INFRA_TEAM']
                    },
                    {
                        'title': 'Fitouts Details',
                        'link': ['/branch/add/fitouts'],
                        'canAccess': ['ADMIN_INFRA_TEAM', 'CHIEF_SERVICE_OFFICER', 'CHIEF_FINANCIAL_OFFICER', 'BUSINESS_HEAD', 'MD_AND_CEO']
                    },
                    {
                        'title': 'Assets Projection',
                        'link': ['/branch/add/assets'],
                        'canAccess': ['IT_INFRA_TEAM']
                    },
                    {
                        'title': 'Validate Pre-requisites',
                        'link': ['/branch/validate-prereq'],
                        'canAccess': ['BRANCH_BANKING_TEAM', 'IT_INFRA_TEAM']
                    },
                    {
                        'title': 'Update Assets Status',
                        'link': ['/branch/updated-assets'],
                        'canAccess': ['BRANCH_BANKING_TEAM']
                    },
                    {
                        'title': 'Report',
                        'link': ['/branch/reports'],
                        'canAccess': ['BRANCH_BANKING_TEAM', 'COMPLIANCE_TEAM', 'ADMIN_INFRA_TEAM', 'IT_INFRA_TEAM', 'CHIEF_SERVICE_OFFICER', 'CHIEF_FINANCIAL_OFFICER', 'BUSINESS_HEAD', 'MD_AND_CEO']
                    }
                ]
            },
            {
                'title': 'SMS Tools',
                'icon': 'envelope-open-o',
                'canAccess': ['SMS_MODULE_ADMIN_USER', 'SMS_MODULE_DEPT_USER'],
                'sublinks': [
                    {
                        'title': 'Create Template',
                        'link': ['/sms/create-template'],
                        'canAccess': ['SMS_MODULE_ADMIN_USER']
                    },
                    {
                        'title': 'Approved Template List',
                        'link': ['/template-list'],
                        'canAccess': ['SMS_MODULE_ADMIN_USER', 'SMS_MODULE_DEPT_USER']
                    },
                    {
                        'title': 'Rejected Template List',
                        'link': ['/template-rejected'],
                        'canAccess': ['SMS_MODULE_ADMIN_USER', 'SMS_MODULE_DEPT_USER']
                    },
                    {
                        'title': 'Pending For Approval',
                        'link': ['/template-approved'],
                        'canAccess': ['SMS_MODULE_ADMIN_USER']
                    },
                    {
                        'title': 'Adhoc Reqest',
                        'link': ['/template-upload'],
                        'canAccess': ['SMS_MODULE_DEPT_USER', 'SMS_MODULE_USER']
                    },
                    {
                        'title': 'Map Users',
                        'link': ['/users-mapping'],
                        'canAccess': ['SMS_MODULE_ADMIN_USER']
                    },
                    {
                        'title': 'Department List',
                        'link': ['/department'],
                        'canAccess': ['SMS_MODULE_ADMIN_USER']
                    },
                    {
                        'title': 'Reports',
                        'link': ['/sms-report'],
                        'canAccess': ['SMS_MODULE_ADMIN_USER']
                    }
                ]
            }
        ];

    }


    protected detectIE(): any {
        let ua = window.navigator.userAgent;

        // Test values; Uncomment to check result …
        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
        // IE 12 / Spartan
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
        // Edge (IE 12+)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)
        // Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        let msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        let trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            let rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        let edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }

}

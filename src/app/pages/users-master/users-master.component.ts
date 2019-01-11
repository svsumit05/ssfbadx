import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersMasterService } from '../../services/users-master.service';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { BranchService } from '../../services/branch.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-users-master',
    templateUrl: './users-master.component.html',
    styleUrls: ['./users-master.component.css']
})
export class UsersMasterComponent implements OnInit, AfterViewInit {

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    private currentUser: User = new User();
    branchDropDown: any;
    roleDropDown: any;
    userEmployeeID: any;

    permissions: any = [
        { name: 'DISBMT_AUDIT_OFFICER', value: 'DISBMT_AUDIT_OFFICER', checked: false },
        { name: 'DISBMT_EXECUTIVE_OPERATIONS', value: 'DISBMT_EXECUTIVE_OPERATIONS', checked: false },
        { name: 'DISBMT_BRANCH_MANAGER', value: 'DISBMT_BRANCH_MANAGER', checked: false },
        { name: 'CAN_VIEW_DELIVERABLES', value: 'CAN_VIEW_DELIVERABLES', checked: false },
        { name: 'CAN_VIEW_UPLOAD_DELIVERABLES_FILES', value: 'CAN_VIEW_UPLOAD_DELIVERABLES_FILES', checked: false },
        { name: 'CAN_ACCESS_USER_MODULE', value: 'CAN_ACCESS_USER_MODULE', checked: false },
        { name: 'CAN_APPROVE_APPLICATION_ROLE_LEVEL_ONE', value: 'CAN_APPROVE_APPLICATION_ROLE_LEVEL_ONE', checked: false },
        { name: 'CAN_APPROVE_APPLICATION_ROLE_LEVEL_TWO', value: 'CAN_APPROVE_APPLICATION_ROLE_LEVEL_TWO', checked: false },
        { name: 'CAN_REVIEW_USER_APPLICATION_ROLE', value: 'CAN_REVIEW_USER_APPLICATION_ROLE', checked: false },
        { name: 'CAN_UPLOAD_USER_FILE', value: 'CAN_UPLOAD_USER_FILE', checked: false },
        { name: 'STATIC_INVENTORY_CAN_ORDER', value: 'STATIC_INVENTORY_CAN_ORDER', checked: false },
        { name: 'STATIC_INVENTORY_CAN_VERIFY_ORDER', value: 'STATIC_INVENTORY_CAN_VERIFY_ORDER', checked: false },
        { name: 'STATIC_INVENTORY_CAN_UPLOAD_ORDER_DETAILS', value: 'STATIC_INVENTORY_CAN_UPLOAD_ORDER_DETAILS', checked: false },
        { name: 'STATIC_INVENTORY_ADMIN', value: 'STATIC_INVENTORY_ADMIN', checked: false },
        { name: 'STATIC_INVENTORY_VIEW_REPORT', value: 'STATIC_INVENTORY_VIEW_REPORT', checked: false },
        { name: 'MASTER_CAN_ADD_INVENTORY', value: 'MASTER_CAN_ADD_INVENTORY', checked: false },
        { name: 'MASTER_CAN_VERIFY_INVENTORY', value: 'MASTER_CAN_VERIFY_INVENTORY', checked: false },
        { name: 'MASTER_CAN_ADD_VENDORS', value: 'MASTER_CAN_ADD_VENDORS', checked: false },
        { name: 'MASTER_CAN_VERIFY_VENDORS', value: 'MASTER_CAN_VERIFY_VENDORS', checked: false },
        { name: 'MASTER_CAN_ADD_COURIER', value: 'MASTER_CAN_ADD_COURIER', checked: false },
        { name: 'MASTER_CAN_VERIFY_COURIER', value: 'MASTER_CAN_VERIFY_COURIER', checked: false },
        { name: 'MASTER_ACCESS_TO_APPLICATION_MASTER', value: 'MASTER_ACCESS_TO_APPLICATION_MASTER', checked: false },
        { name: 'CAN_VIEW_DELIVERABLES_REPORTS', value: 'CAN_VIEW_DELIVERABLES_REPORTS', checked: false },
        { name: 'CAN_VIEW_DELIVERABLES_REPORTS_HO', value: 'CAN_VIEW_DELIVERABLES_REPORTS_HO', checked: false },
        { name: 'CAN_VIEW_DELIVERABLES_REPORTS_BRANCH', value: 'CAN_VIEW_DELIVERABLES_REPORTS_BRANCH', checked: false },
        { name: 'CAN_VIEW_DELIVERABLES_PRODUCTION_BILLING', value: 'CAN_VIEW_DELIVERABLES_PRODUCTION_BILLING', checked: false },
        { name: 'CAN_VIEW_DELIVERABLES_COURIER_BILLING', value: 'CAN_VIEW_DELIVERABLES_COURIER_BILLING', checked: false },
        { name: 'CAN_DESTROY_DELIVERABLES', value: 'CAN_DESTROY_DELIVERABLES', checked: false },
        { name: 'CAN_VIEW_STATIC_DELIVERABLES_REPORTS', value: 'CAN_VIEW_STATIC_DELIVERABLES_REPORTS', checked: false },
        { name: 'COMPLIANCE_TEAM', value: 'COMPLIANCE_TEAM', checked: false },
        { name: 'BRANCH_BANKING_TEAM', value: 'BRANCH_BANKING_TEAM', checked: false },
        { name: 'ADMIN_INFRA_TEAM', value: 'ADMIN_INFRA_TEAM', checked: false },
        { name: 'IT_INFRA_TEAM', value: 'IT_INFRA_TEAM', checked: false },
        { name: 'CHIEF_SERVICE_OFFICER', value: 'CHIEF_SERVICE_OFFICER', checked: false },
        { name: 'CHIEF_FINANCIAL_OFFICER', value: 'CHIEF_FINANCIAL_OFFICER', checked: false },
        { name: 'BUSINESS_HEAD', value: 'BUSINESS_HEAD', checked: false },
        { name: 'MD_AND_CEO', value: 'MD_AND_CEO', checked: false },
        { name: 'SMS_MODULE_ADMIN_USER', value: 'SMS_MODULE_ADMIN_USER', checked: false },
        { name: 'SMS_MODULE_DEPT_USER', value: 'SMS_MODULE_DEPT_USER', checked: false },
        { name: 'RECORD_MGM_MODULE_BRANCH_USER', value: 'RECORD_MGM_MODULE_BRANCH_USER', checked: false },
        { name: 'RECORD_MGM_MODULE_CPU_USER', value: 'RECORD_MGM_MODULE_CPU_USER', checked: false },
        { name: 'RECORD_MGM_MODULE_VENDOR_USER', value: 'RECORD_MGM_MODULE_VENDOR_USER', checked: false },
        { name: 'RECORD_MGM_MODULE_ADMIN_USER', value: 'RECORD_MGM_MODULE_ADMIN_USER', checked: false }
    ];

    editUserData = {
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        designation: '',
        product: '',
        business: '',
        permissions: [],
        isAdmin: false,
        branch: '',
        branchCode: '',
        alfrescoEmail: '',
    };

    updateUserInfo = {
        employeeId: '',
        role: {
            roleID: 0
        },
        department: {
            departmentId: ''
        },
        branch: '',
        alfrescoEmail: ''
    };


    constructor(private route: ActivatedRoute, private router: Router, private usersMasterService: UsersMasterService, private _userServ: UserService, private _utilService: UtilitiesHelper, private toastr: ToasterService, private branchServ: BranchService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

        this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => {
            this.branchServ.getAllRole().subscribe(resdata => this.roleDropDown = resdata, () => { }, () => {
            });
        });

    }

    @ViewChild('updateUserPopup') updateUserPopup: Popup;

    ngOnInit(): void {
        this.dtOptions = {
            ajax: {
                url: environment.api_base_url + 'alfresco/s/suryoday/userModule/searchUser?alf_ticket=' + this.currentUser.ticket,
                method: 'POST',
                data: { employeeId: '0' },
                dataSrc: function (json) {
                    let return_array = [];
                    if (json.data.employeeId != '') {
                        return_array.push(json.data);
                    }
                    return return_array;
                }
            },
            columns: [{
                title: 'Emp ID',
                data: 'employeeId',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            }, {
                title: 'First name',
                data: 'firstName'
            }, {
                title: 'Last name',
                data: 'lastName'
            }, {
                title: 'Branch',
                data: 'branch'
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    return data;
                }
            }],
            columnDefs: [
                {
                    'targets': [-1],
                    'data': null,
                    'visible': true,
                    'defaultContent': '<button>Delete</button>'
                }
            ],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;
                $('td:last-child', row).unbind('click');
                $('td:last-child', row).bind('click', () => {
                    self.deleteRowHandler(row, data);
                });

                $('td:first-child', row).unbind('click');
                $('td:first-child', row).bind('click', () => {
                    self.editRowHandler(data);
                });
                return row;
            },
            searching: true, 
            language: {
                emptyTable: 'Enter User Id and Hit Search Button'
            }
        };
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
        $.fn.dataTable.ext.errMode = 'none';
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();

            this.dtOptions.ajax = {
                url: environment.api_base_url + 'alfresco/s/suryoday/userModule/searchUser?alf_ticket=' + this.currentUser.ticket,
                method: 'POST',
                data: { employeeId: this.userEmployeeID },
                dataSrc: function (json) {
                    let return_array = [];
                    if (json.data.employeeId != '') {
                        return_array.push(json.data);
                    }
                    return return_array;
                }
            };

            this.dtTrigger.next();
        });
    }

    editRowHandler(info: any): void {
        let pre_permissions;
        let get_latest_permissions = [];

        this.editUserData.alfrescoEmail = info.alfrescoEmail;
        this.editUserData.branchCode = info.branchCode;
        this.editUserData.branch = info.branch;
        this.usersMasterService.getUser(info.employeeId).subscribe(resdata => this.editUserData = resdata, reserror => { }, () => {

            if (this.editUserData.extraInfo != null) {

                this.updateUserInfo.role.roleID = this.editUserData.extraInfo.role.roleID;
            }

            if (this.editUserData.permissions == null || this.editUserData.permissions.length == 0) {
                this.editUserData.permissions = this.permissions;
            } else {
                pre_permissions = JSON.parse(this.editUserData.permissions);

                pre_permissions.forEach(element => {

                    if (element.checked == true) {
                        get_latest_permissions.push(element.value);
                    }
                });

                this.permissions.forEach(element => {
                    if (get_latest_permissions.indexOf(element.value) != -1) {
                        element.checked = true;
                    } else {
                        element.checked = false;
                    }
                });

                this.editUserData.permissions = this.permissions;
            }

            setTimeout(() => {
                this.updateUser();
            }, 1000);

        });

    }

    deleteRowHandler(row: any, info: any): void {

        if (info.employeeId == this.currentUser.userId) {
            this.toastr.pop('error', 'Error', 'Can not update own data.');
        } else {
            this.usersMasterService.deleteUser(info.employeeId).subscribe(resdata => { }, reserror => { }, () => {
                row.remove();
                this.toastr.pop('success', 'Successful', 'an record deleted successfully.');
            });
        }


    }

    createUser() {

    }

    updateUser() {

        this.updateUserPopup.options = {
            cancleBtnClass: 'btn btn-default',
            confirmBtnClass: 'btn btn-mbe-attack',
            color: '#363794',
            header: 'Update User Permission',
            widthProsentage: 80,
            showButtons: false,
            animation: 'bounceInDown',
        };
        this.updateUserPopup.show(this.updateUserPopup.options);

    }

    onInput(event) {
        this.editUserData.branch = event.target.value;
        this.branchDropDown.forEach(element => {
            if (element.branchCode == event.target.value) {
                this.editUserData.branch = element.branchName;
                this.editUserData.branchCode = element.branchCode;
            }
        });
    }

    setRole(event) {
        this.updateUserInfo.role.roleID = event.target.value;
    }

    updateUserData(value: any) {

        this.editUserData.alfrescoEmail = value.alfrescoEmail;
        this.editUserData.isAdmin = false;
        this.editUserData.branchCode = value.branchCode;
        this.usersMasterService.updateUser(this.editUserData).subscribe(resdata => { }, reserror => { }, () => {

            this.updateUserInfo.employeeId = this.editUserData.employeeId;

            this.updateUserInfo.department.departmentId = '';

            if (value.branchCode != null) {
                this.updateUserInfo.branch = value.branchCode;
            } else {
                this.updateUserInfo.branch = '';
            }
            this.updateUserInfo.role.roleID = value.roleID;

            this.updateUserInfo.alfrescoEmail = value.alfrescoEmail;

            this.usersMasterService.updateUserInformation(this.updateUserInfo).subscribe(() => { }, () => { }, () => {
                this.toastr.pop('success', 'Success', 'User Updated Successfully.');
                this.updateUserPopup.hide();
                this.resetData();
                this.rerender();
            });
        });

    }

    closePopup() {
        this.updateUserPopup.hide();
        this.resetData();
    }

    get selectedOptions() {
        return this.permissions
            .filter(opt => opt.checked)
            .map(opt => opt.value);
    }

    changeCheckbox(tags, i) {
        if (tags) {
            this.editUserData.permissions[i].checked = !this.editUserData.permissions[i].checked;
        }
    }

    resetData() {
        this.editUserData = {
            employeeId: '',
            firstName: '',
            lastName: '',
            email: '',
            designation: '',
            product: '',
            business: '',
            permissions: [],
            isAdmin: false,
            branch: '',
            branchCode: '',
            alfrescoEmail: '',
        };

        this.updateUserInfo = {
            employeeId: '',
            role: {
                roleID: 0
            },
            department: {
                departmentId: ''
            },
            branch: ''
        };

        this.permissions.forEach(element => {
            element.checked = false;
        });
    }


}

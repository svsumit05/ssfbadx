import { AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Popup } from 'ng2-opd-popup';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { VendorsService } from '../../services/vendors.service';
import { BranchService } from '../../services/branch.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { OrderInventoryServiceService } from '../../services/order-inventory-service.service';


@Component({
    selector: 'app-instakit-records',
    templateUrl: './instakit-records.component.html',
    styleUrls: ['./instakit-records.component.css']
})
export class InstakitRecordsComponent implements OnInit, AfterViewInit {

    errorMsg = '';
    responceData: any;

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();
    private currentUser: User = new User();
    lisingUrl = '';
    navID: string;
    private sub: any;
    columnDefs: any = [];

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _orderinvservice: OrderInventoryServiceService, private toastr: ToasterService, private branchServ: BranchService) {
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    someClickHandler(info: any, row) {

        let employeeId = document.getElementById('user_id_' + info.instaKitBeanId).value;
        let employeeName = document.getElementById('user_name_' + info.instaKitBeanId).value;

        if (employeeId == '' || employeeName == '') {
            this.toastr.pop('warning', 'Warning', 'Kindly enter employee id and employee name');
            return false;
        }

        // this.getDetailRowInfo();
        let postdata = {
            instaKitId: info.instaKitBeanId,
            employeeId: employeeId,
            employeeName: employeeName
        };

        this._orderinvservice.assignInstaKitRecordsToEmployee(postdata).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
            this.toastr.pop('success', 'success', this.responceData.statusMessge);
            row.remove();
        });
    }


    ngOnInit() {

        let dataString = {};


        this.lisingUrl = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchAllInstaKitRecordsPendinginFRC?alf_ticket=' + this.currentUser.ticket;
        dataString = {
            loggedInUserName: this.currentUser.userId
        };


        this.dtOptions = {
            ajax: {
                url: this.lisingUrl,
                method: 'POST',
                data: dataString,
                dataSrc: function (json) {
                    let return_array = [];
                    return_array = json;
                    return return_array;
                }
            },
            columns: [{
                title: 'A/C No',
                data: 'acNo',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            }, {
                title: 'Product Name',
                data: 'productName'
            }, {
                title: 'Receipt Date',
                data: 'receiptDate'
            }, {
                title: 'Remark',
                data: 'remark'
            }, {
                title: 'Employee Id',
                data: '',
                render: function (data, type, row) {
                    return '<input type="text" class="form-control" name="user_id_' + row.instaKitBeanId + '" id="user_id_' + row.instaKitBeanId + '" >';
                }
            }, {
                title: 'Employee Name',
                data: '',
                render: function (data, type, row) {
                    return '<input type="text" class="form-control" name="user_name_' + row.instaKitBeanId + '" id="user_name_' + row.instaKitBeanId + '" >';
                }
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    return '<button type="submit" class="btn btn-success">Assign</button>';
                }
            }],
            columnDefs: this.columnDefs,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;

                $('td:last-child', row).unbind('click');
                $('td:last-child', row).bind('click', () => {
                    self.someClickHandler(data, row);
                });

                return row;
            },

        };

    }


    ngAfterViewInit(): void {
        this.dtTrigger.next();
        $.fn.dataTable.ext.errMode = 'none';
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    resetData() {

    }

    closeForm() {

    }




}

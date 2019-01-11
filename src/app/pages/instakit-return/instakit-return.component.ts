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
    selector: 'app-instakit-return',
    templateUrl: './instakit-return.component.html',
    styleUrls: ['./instakit-return.component.css']
})
export class InstakitReturnComponent implements OnInit, AfterViewInit {

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

    someClickHandler(info: any, row): void {

        let status = document.getElementById('instakit_status_' + info.acNo).value;

        let postdata = {
            instaKitId: info.instaKitBeanId,
            action: status
        };

        this._orderinvservice.updateFRFCStatus(postdata).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
            this.toastr.pop('success', 'success', this.responceData.statusMessge);
            row.remove();
        });
    }


    ngOnInit() {

        let dataString = {};

        this.lisingUrl = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchAllInstaKitRecordsAssignedToEmployee?alf_ticket=' + this.currentUser.ticket;
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
                data: 'employeeId'
            }, {
                title: 'Employee Name',
                data: 'employeeName'
            }, {
                title: '',
                data: '',
                render: function (data, type, row) {
                    return '<select class="form-control" name="instakit_status_' + row.acNo + '" id="instakit_status"><option value="Utilized">Utilized</option><option value="Non-Utilized">Non-Utilized</option><option value="Received in bad condition">Received in bad condition</option></select>';
                }
            }, {
                title: 'Action',
                data: '',
                render: function (data, type, row) {
                    return '<button type="submit" class="btn">Submit</button>';
                }
            }],
            columnDefs: this.columnDefs,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;

                $('td:nth-child(8)', row).unbind('click');
                $('td:nth-child(8)', row).bind('click', () => {
                    self.someClickHandler(data, row);
                });

                return row;
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
            this.dtTrigger.next();
        });
    }

    resetData() {

    }

    closeForm() {

    }

}

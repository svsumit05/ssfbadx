import { AfterViewInit, Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderInventoryServiceService } from '../../services/order-inventory-service.service';
import { Popup } from 'ng2-opd-popup';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { BranchService } from '../../services/branch.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-order-visitingcard',
    templateUrl: './order-visitingcard.component.html',
    styleUrls: ['./order-visitingcard.component.css']
})
export class OrderVisitingcardComponent implements OnInit, AfterViewInit {

    approvedInvData: any;
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: DataTables.Settings = {};

    dtTrigger: Subject<any> = new Subject();

    branchDropDown: any;
    errorMsg: any;
    responceData: any;

    addorderDetails = {
        orderIndentId: '',
        dateOfReqest: '',
        empCode: '',
        nameOfEmployee: '',
        designation: '',
        officeAddress: '',
        empID: '',
        mobNo: '',
        landlineNo: ''
    };

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    };

    datepickerOptsArray = [];

    showDatePicker = false;

    fromDate = new Date();
    toDate = new Date();
    branch = '';

    private currentUser: User = new User();
    private _listingURL;
    private columns: any;
    private columnDefs: any;
    navID: string;
    private sub: any;

    constructor(private route: ActivatedRoute, private zone: NgZone, private _userServ: UserService, private _orderInventService: OrderInventoryServiceService, private toastr: ToasterService, private _utilService: UtilitiesHelper, private branchServ: BranchService) {

        this.sub = this.route.params.subscribe(params => {
            this.navID = params['id'];
        });

        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);

        this.branchServ.getAllBranch().subscribe(resdata => this.branchDropDown = resdata, () => { }, () => { });

    }

    @ViewChild('orderVisitingCard') orderVisitingCard: Popup;

    ngOnInit(): void {
        let dataString = {};
        this.branch = this.currentUser.user_extra_info.branch;


        this._listingURL = environment.api_base_url_new + 'BranchCreation/inventoryController/fetchVisitngcardByOrderIndentId?alf_ticket=' + this.currentUser.ticket;
        dataString = {
            orderIndentId: null
        };

        this.columns = [
            {
                title: 'Order No',
                data: 'orderIndentId',
                render: function (data, type, row) {
                    return '<a href="javascript:void(0)"><strong>' + data + '</strong><a>';
                }
            },
            {
                title: 'Employee Code',
                data: 'empCode'
            },
            {
                title: 'Employee Name',
                data: 'nameOfEmployee'
            },
            {
                title: 'Mobile Number',
                data: 'mobNo'
            },
            {
                title: 'Designation',
                data: 'designation'
            }
        ];

        this.columnDefs = [];

        this.dtOptions = {
            ajax: {
                url: this._listingURL,
                method: 'POST',
                data: dataString,
                dataSrc: function (json) {
                    let return_array = [];
                    return_array = json;
                    return return_array;
                }
            },
            columns: this.columns,
            searching: true,
            columnDefs: this.columnDefs,
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                const self = this;

                $('td:first-child', row).unbind('click');
                $('td:first-child', row).bind('click', () => {
                    self.someClickHandler(data);
                });
                return row;
            },
            dom: 'lfrtip',
            oLanguage: {
                sSearch: 'Global search'
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

            let dataString = {
                orderIndentId: null
            };

            this.dtOptions.ajax = {
                url: this._listingURL,
                method: 'POST',
                data: dataString,
                dataSrc: function (json) {
                    let return_array = [];
                    return_array = json;
                    return return_array;
                }
            };

            this.dtTrigger.next();
        });
    }


    someClickHandler(info: any): void {

        this.approvedInvData = info;

        this.orderVisitingCard.options = {
            color: '#363794',
            header: 'Add Order',
            showButtons: false,
            widthProsentage: 99,
            animation: 'bounceInDown',
        };
        this.orderVisitingCard.show(this.orderVisitingCard.options);
    }



    requestVisitingCard() {

        this.orderVisitingCard.options = {
            color: '#363794',
            header: 'Add Order',
            showButtons: false,
            widthProsentage: 99,
            animation: 'bounceInDown',
        };

    }





    onOrderPlace(value: any) {

        this.addorderDetails = {
            orderIndentId: value.orderIndentId,
            dateOfReqest: value.dateOfReqest,
            empCode: value.empCode,
            nameOfEmployee: value.nameOfEmployee,
            designation: value.designation,
            officeAddress: value.officeAddress,
            empID: value.empID,
            mobNo: value.mobNo,
            landlineNo: value.landlineNo
        };

        this._orderInventService.inserVisitingCardDetails(this.addorderDetails).subscribe(res => this.responceData = res, reserror => this.errorMsg = reserror, () => {
            if (this.responceData.status == '200') {
                this.orderVisitingCard.hide();
                this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
                this.rerender();
            } else {
                this.orderVisitingCard.hide();
                this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
                this.rerender();
            }
        });

    }



    onOrderReset() {
        this.orderVisitingCard.hide();
        this.resetForm();
    }




    resetForm() {

        this.addorderDetails = {
            orderIndentId: '',
            dateOfReqest: '',
            empCode: '',
            nameOfEmployee: '',
            designation: '',
            officeAddress: '',
            empID: '',
            mobNo: '',
            landlineNo: ''
        };

    }




}

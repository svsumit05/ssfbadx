import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {TabsetComponent} from 'ng2-bootstrap';
import {UtilitiesHelper} from '../../services/utilities.service';
import {DeliverablesService} from '../../services/deliverables.service'
import {ToasterService} from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'app-deliverables-fdr',
    templateUrl: './deliverables-fdr.component.html',
    styleUrls: ['./deliverables-fdr.component.css']
})
export class DeliverablesFdrComponent implements OnInit {

    errorMsg: any;
    displaySubType = false;
    canDistroyAtBranch = false;
    api_responce_server: any;
    api_responce_temp: any;
    showBranchActionDate = false;
    showBranchActionReason = false;
    temp_rtoReceiptTime = '';
    temp_rtoReceipt = '';

    deliverables_data = {
        deliverables_type: '',
        search_by: '',
        search_id: '',
        ACNO: '',
        customerId: '',
        awb_no: ''
    }

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    }

    rtoData = {
        id: 0,
        rtoStep: 0,
        rtoAcNo: '',
        rtoReceipt: '',
        rtoReceiptTime: '',
        rtoAction: '',
        deliverables_type: '',
        action_aws_no: '',
        action_courier_name: '',
        branch_action: '',
        branchActionTime2: '',
        branch_action_date: '',
        branch_action_reason: '',
        remark: ''
    }

    rtoDataPart2 = {
        id: 0,
        rtoStep: 0,
        rtoAcNo: '',
        deliverables_type: '',
        rtoAction: '',
        rtoActionDate: '',
        rtoAWBNO: '',
        rtoCourierName: '',
    }

    api_responce = {
        id: '',
        cust_id: '',
        ac_no: '',
        deposite_type: '',
        branch_name: '',
        branch_address: '',
        value_date: '',
        date_of_deposite: '',
        cust_address: '',
        cust_name: '',
        cust_mobile_no: '',
        principal_amount: '',
        rate_of_interest: '',
        term: '',
        maturity_date: '',
        maturity_value: '',
        auto_renewal: '',
        auto_closer: '',
        nominee_registered: '',
        nominee_name: '',
        pan: '',
        amount_in_words: '',
        mode_of_operation: '',
        collation_date: '',
        dispatch_date: '',
        courier_name: '',
        vendor_name: '',
        deliverable_type: '',
        awb_no: '',
        booking_date: '',
        status: '',
        delivery_date: '',
        rto_date: '',
        rto_delivery_date: '',
        rto_forwarded_date: '',
        rto_receipt: '',
        action: '',
        canDistroy: true,
        isDeliveredToCustomer: false
    }

    @ViewChild('staticTabs') staticTabs: TabsetComponent;

    constructor(private _utilService: UtilitiesHelper, private _deliverablesService: DeliverablesService, private toastr: ToasterService, private elementRef: ElementRef) {}

    ngOnInit() {

    }


    public tab_deliverables(): void {
    }

    public tab_collision(): void {
    }

    public tab_dispatch(): void {
    }

    public tab_rto(): void {
    }

    public tab_branch_dispatch(): void {
    }

    public tab_deliverables_destruction(): void {
    }


    fatchDeliverablesData() {

        this.resetAction();
        this.rtoData.deliverables_type = this.deliverables_data.deliverables_type;
        this.rtoData.rtoStep = 0;
        this.rtoData.id = 0;


        this._deliverablesService.getDeliverablesById(this.deliverables_data).subscribe(resdata => this.api_responce_temp = resdata, () => this.toastr.pop('error', 'Falied', 'Something went wrong please try again.'), () => {
            this.api_responce_server = this.api_responce_temp.data;

            var index = 0;
            for (let item of this.api_responce_server) {

                if (item.status == 'DELIVERED') {
                    this.staticTabs.tabs[3].disabled = true;
                    this.staticTabs.tabs[4].disabled = true;
                } else if ((item.status == 'NA' || item.status == '') && (item.courier_name == 'speedPost' || item.courier_name == 'Speedpost' || item.courier_name == 'SpeedPost' || item.courier_name == 'Speed Post' || item.courier_name == 'speed post' || item.courier_name == 'speedpost')) {
                    this.staticTabs.tabs[3].disabled = false;
                    this.staticTabs.tabs[4].disabled = true;
                    this.api_responce_server[index]['status'] = '   ';

                } else if (item.status == 'NA') {
                    this.staticTabs.tabs[3].disabled = true;
                    this.staticTabs.tabs[4].disabled = true;
                } else if (item.status == '') {
                    this.staticTabs.tabs[3].disabled = true;
                    this.staticTabs.tabs[4].disabled = true;
                } else {
                    this.staticTabs.tabs[3].disabled = false;
                    this.staticTabs.tabs[4].disabled = true;
                }

                if (item.rto_receipt == 'Yes') {
                    this.staticTabs.tabs[4].disabled = false;
                }

                if (item.branch_action == 'RTO') {
                    this.staticTabs.tabs[5].disabled = false;
                } else {
                    this.staticTabs.tabs[5].disabled = true;
                }

                if (item.action == 'Send To CPU') {
                    this.staticTabs.tabs[5].disabled = false;
                    this.rtoDataPart2.rtoAction = item.action;
                }

                this.api_responce.ac_no = item.ac_no;
                this.api_responce.cust_id = item.cust_id;
                this.api_responce_server[index]['isActive'] = true;

                this.api_responce_server[index]['canDistroy'] = true;

                index++;
            }

            if (this.api_responce_server.length == 0) {
                this.toastr.pop('warning', '', 'No record found.')
            }
        });

    }

    setRTOStatus(ev, accountNo: any, id: number) {

        console.log(this.temp_rtoReceipt);

        if (this.rtoData.rtoReceipt != '') {

            var s = confirm('Do you want to save the changes ???');

            if (s == true) {

                this.rtoData.id = id;
                this.rtoData.rtoStep = 1;
                this.rtoData.rtoAcNo = accountNo;
                this.rtoData.rtoReceiptTime = ev;
                this.rtoData.deliverables_type = this.deliverables_data.deliverables_type;


                this._deliverablesService.updateRTOStatus(this.rtoData).subscribe(resdata => {}, reserror => this.errorMsg = reserror, () => {
                    this.toastr.pop('success', 'Successful', 'an status Updated successfully.');
                    this.fatchDeliverablesData();
                });

            } else {
                this.toastr.pop('warning', 'Cancelled', 'Operation cancelled successfully.');
                this.fatchDeliverablesData();

            }
        }
    }

    u_RTOStatus(ev) {
        this.rtoData.rtoReceipt = ev.target.value;
    }

    updateRtoBranchStatus(ev) {

        this.rtoData.rtoAction = ev.target.value;
        this.rtoData.branchActionTime2 = ' ';

    }

    updateRtoStatus(ev, accountNo: any, id: number) {

        if (ev !== undefined) {


            this.rtoData.deliverables_type = this.deliverables_data.deliverables_type;
            this.rtoData.rtoAcNo = this.api_responce.ac_no;
            this.rtoData.rtoStep = 2;
            this.rtoData.id = id;

            if (this.rtoData.rtoAction != 'Dispatched to customer') {

                var t = confirm('Do you want to save the changes ?');

                if (t == true) {

                    var action_aws_no = this.elementRef.nativeElement.querySelector('#action_aws_no_' + accountNo);
                    action_aws_no.removeAttribute('disabled');
                    var action_courier_name = this.elementRef.nativeElement.querySelector('#action_courier_name_' + accountNo);
                    action_courier_name.removeAttribute('disabled');

                    this.rtoData.rtoAcNo = accountNo;
                    this.rtoData.branchActionTime2 = ev;
                    this.rtoData.deliverables_type = this.deliverables_data.deliverables_type;

                    this._deliverablesService.updateRTOStatus(this.rtoData).subscribe(resdata => {}, reserror => this.errorMsg = reserror, () => {
                        this.toastr.pop('success', 'Successful', 'an status Updated successfully.');
                        this.fatchDeliverablesData();
                    });

                } else {
                    this.toastr.pop('warning', 'Cancelled', 'Operation cancelled successfully.');
                    this.fatchDeliverablesData();
                }

            } else {
                this.rtoData.branchActionTime2 = this._utilService.formatDate(ev);

                var action_aws_no = this.elementRef.nativeElement.querySelector('#action_aws_no_' + accountNo);
                action_aws_no.removeAttribute('disabled');
                var action_courier_name = this.elementRef.nativeElement.querySelector('#action_courier_name_' + accountNo);
                action_courier_name.removeAttribute('disabled');
            }
        }

    }

    updateCourierStatus(ev, accountNo: any, id: number) {

        this.rtoData.deliverables_type = this.deliverables_data.deliverables_type;
        this.rtoData.rtoAcNo = this.api_responce.ac_no;
        this.rtoData.rtoStep = 2;
        this.rtoData.id = id;


        var r = confirm('Save AWB No & Courier Name ?');

        if (r == true) {

            this.rtoData.action_aws_no = this.elementRef.nativeElement.querySelector('#action_aws_no_' + accountNo).value;
            this.rtoData.action_courier_name = this.elementRef.nativeElement.querySelector('#action_courier_name_' + accountNo).value;

            this._deliverablesService.updateRTOStatus(this.rtoData).subscribe(resdata => {}, reserror => this.errorMsg = reserror, () => {
                this.toastr.pop('success', 'Successful', 'an status Updated successfully.');
                this.fatchDeliverablesData();
            });

        } else {
            this.toastr.pop('warning', 'Cancelled', 'Operation cancelled successfully.');
        }
    }


    selectBranchAction(ev, accountNo: any, id: number) {

        this.rtoData.deliverables_type = this.deliverables_data.deliverables_type;
        this.rtoData.rtoAcNo = this.api_responce.ac_no;
        this.rtoData.branch_action = ev.target.value;
        this.rtoData.id = id;

        if (this.rtoData.branch_action == 'Delivered') {

            this.showBranchActionDate = true;
            this.showBranchActionReason = false;

        } else {

            this.showBranchActionDate = false;
            this.showBranchActionReason = true;

        }

    }

    updateBranchAction(ev, accountNo: any, byType, id: number) {

        if (ev == null)
            return false;

        if (this.rtoData.branch_action == '') {
            alert('Kindly Select Action status');
            this.resetAction();
            return false;
        }

        var r = confirm('Save branch action details ?');

        this.rtoData.deliverables_type = this.deliverables_data.deliverables_type;
        this.rtoData.rtoAcNo = this.api_responce.ac_no;
        this.rtoData.rtoStep = 3;
        this.rtoData.id = id;

        if (r == true) {

            if (byType == 'byDate') {
                this.rtoData.branch_action_date = ev;
            } else {
                this.rtoData.branch_action_reason = ev.target.value;
            }

            this._deliverablesService.updateRTOStatus(this.rtoData).subscribe(resdata => {}, reserror => this.errorMsg = reserror, () => {
                this.toastr.pop('success', 'Successful', 'an status Updated successfully.');
                this.fatchDeliverablesData();
            });

        } else {

            this.toastr.pop('warning', 'Cancelled', 'Operation cancelled successfully.');

        }
    }

    updateRemark(ev, accountNo: any, id: number) {

        this.rtoData.deliverables_type = this.deliverables_data.deliverables_type;
        this.rtoData.rtoAcNo = this.api_responce.ac_no;
        this.rtoData.remark = ev.target.value;
        this.rtoData.rtoStep = 4;
        this.rtoData.id = id;


        var re = confirm('Save Remark ?');

        if (re == true) {

            this._deliverablesService.updateRTOStatus(this.rtoData).subscribe(resdata => {}, reserror => this.errorMsg = reserror, () => {
                this.toastr.pop('success', 'Successful', 'Updated successfully.');
                this.fatchDeliverablesData();
            });

        } else {
            this.toastr.pop('warning', 'Cancelled', 'Operation cancelled successfully.');
        }

    }

    resetInfo() {
        this.staticTabs.tabs[3].disabled = true;
        this.staticTabs.tabs[4].disabled = true;
        this.staticTabs.tabs[5].disabled = true;
        this.staticTabs.tabs[0].active = true;
        this.api_responce_server = [];
    }

    resetACID() {
        this.staticTabs.tabs[3].disabled = true;
        this.staticTabs.tabs[4].disabled = true;
        this.deliverables_data.search_id = '';
    }

    resetAction() {

        this.rtoData = {
            id: 0,
            rtoStep: 0,
            rtoAcNo: '',
            rtoReceipt: '',
            rtoReceiptTime: '',
            rtoAction: '',
            deliverables_type: '',
            action_aws_no: '',
            action_courier_name: '',
            branch_action: '',
            branchActionTime2: '',
            branch_action_date: '',
            branch_action_reason: '',
            remark: ''
        };

        this.rtoDataPart2 = {
            id: 0,
            rtoStep: 0,
            rtoAcNo: '',
            deliverables_type: '',
            rtoAction: '',
            rtoActionDate: '',
            rtoAWBNO: '',
            rtoCourierName: '',
        };

    }

    updateDestructionStatus(id, ac_no) {


        this.rtoDataPart2.rtoStep = 5;
        this.rtoDataPart2.id = id;
        this.rtoDataPart2.rtoAcNo = ac_no;
        this.rtoDataPart2.deliverables_type = this.deliverables_data.deliverables_type;

        var re = confirm('Save destruction data ?');

        if (re == true) {

            this._deliverablesService.updateDestructionStatus(this.rtoDataPart2).subscribe(resdata => {}, reserror => this.errorMsg = reserror, () => {
                this.toastr.pop('success', 'Successful', 'Updated successfully.');
                this.fatchDeliverablesData();
            });

        } else {
            this.toastr.pop('warning', 'Cancelled', 'Operation cancelled successfully.');
        }

    }

}

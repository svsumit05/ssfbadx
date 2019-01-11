import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Popup} from 'ng2-opd-popup';
import {UserService} from "../../services/user.service";
import {environment} from '../../../environments/environment';
import {User} from '../../models/user';
import {UtilitiesHelper} from '../../services/utilities.service';
import {ToasterService} from 'angular2-toaster/angular2-toaster';
import {DeliverablesService} from '../../services/deliverables.service';
import {Printd} from 'printd'

@Component({
    selector: 'app-deliverables-couriervendor-billing',
    templateUrl: './deliverables-couriervendor-billing.component.html',
    styleUrls: ['./deliverables-couriervendor-billing.component.css']
})
export class DeliverablesCouriervendorBillingComponent implements OnInit, AfterViewInit {


    private currentUser: User = new User();

    showCreateInvoice: boolean = false;
    showSubmitButton: boolean = false;
    showPrintInvoice: boolean = false;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    }

    deliverablesFdr = {
        mumbaiCount: 0,
        otherThanMumbaiCount: 0,
        totalCount: 0,
        totalAmount: 0
    };

    deliverablesChequebook = {
        mumbaiCount: 0,
        otherThanMumbaiCount: 0,
        totalCount: 0,
        totalAmount: 0
    };

    deliverablesDebitCard = {
        mumbaiCount: 0,
        otherThanMumbaiCount: 0,
        totalCount: 0,
        totalAmount: 0
    };

    deliverablesWelcomeKit = {
        mumbaiCount: 0,
        otherThanMumbaiCount: 0,
        totalCount: 0,
        totalAmount: 0
    };
    
    deliverablesDD = {
        mumbaiCount: 0,
        otherThanMumbaiCount: 0,
        totalCount: 0,
        totalAmount: 0
    };

    deliverablesFile: any;

    api_responce_temp: any;
    send_api_request: any;
    disableFileUpload: boolean = false;

    invoice_data = {
        prod_from_date: new Date(),
        prod_to_date: new Date(),
        inputFiles: '',
        invoice_for_period: '',
        prod_vendor: '',
        deliverables_type: '',
        invoiceamount: 0,
        invoice_number: '',
        bill_amount: 0,
        penalty_amount: 0,
        invoiceMode: 'Open',
        final_amount_to_pay: 0,
        fuel_surcharge: 0,
        tax_amount: 0,
        mumbaiRate: 0,
        otherThanMumbaiRate: 0
    }

    invoice_form_data = {
        prod_from_date: new Date(),
        prod_to_date: new Date(),
        inputFiles: '',
        invoice_for_period: '',
        prod_vendor: '',
        deliverables_type: '',
        invoiceamount: 0,
        invoice_number: '',
        bill_amount: 0,
        penalty_amount: 0,
        invoiceMode: 'Open',
        final_amount_to_pay: 0,
        fuel_surcharge: 0,
        tax_amount: 0,
        mumbaiRate: 0,
        otherThanMumbaiRate: 0
    }


    constructor(private _userServ: UserService, private _utilService: UtilitiesHelper, private toastr: ToasterService, private elementRef: ElementRef, private _deliverablesService: DeliverablesService) {
        // Connect to the current user's change #currentUser.token
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    @ViewChild('createinvoice') createinvoice: Popup;


    ngOnInit(): void {

    }

    getFinalPay(ev) {
        let penalty_amount = ev;
        this.invoice_data.final_amount_to_pay = (this.invoice_data.bill_amount - penalty_amount);
    }

    ordfileEvent(fileInput: any) {
        let file = fileInput.target.files[0];
        this.deliverablesFile = file;
    }

    getCourierData() {


        let postData = {
            'fromDate': this.invoice_data.prod_from_date,
            'toDate': this.invoice_data.prod_to_date,
            'vendorName': this.invoice_data.prod_vendor
        };




        this._deliverablesService.getCourierDeliverables(postData).subscribe(resdata => this.api_responce_temp = resdata, () => this.toastr.pop('error', 'Falied', 'Something went wrong please try again.'), () => {


            this.invoice_data.invoiceMode = this.api_responce_temp.data[0].InvoiceDetails[0].invoiceMode;
            this.invoice_data.mumbaiRate = this.api_responce_temp.data[0].InvoiceDetails[0].mumbaiRate;
            this.invoice_data.otherThanMumbaiRate = this.api_responce_temp.data[0].InvoiceDetails[0].otherThanMumbaiRate;

            this.invoice_data.invoice_for_period = this.formatDate(this.invoice_data.prod_from_date) + ' To ' + this.formatDate(this.invoice_data.prod_to_date);



            if (this.invoice_data.invoiceMode == 'View') {

                this.disableFileUpload = false;
                this.showSubmitButton = false;
                this.showCreateInvoice = false;
                this.showPrintInvoice = true;

            } else {
                this.showPrintInvoice = false;
                this.disableFileUpload = true;
                this.showSubmitButton = true;
                this.invoice_data.invoiceMode = 'Edit';
            }



            this.deliverablesFdr.mumbaiCount = this.api_responce_temp.data[0].FDR[0].FDRMumbaiCount;
            this.deliverablesFdr.otherThanMumbaiCount = this.api_responce_temp.data[0].FDR[0].FDROtherThanMumbaiCount;
            this.deliverablesFdr.totalCount = parseInt(this.deliverablesFdr.mumbaiCount) + parseInt(this.deliverablesFdr.otherThanMumbaiCount);
            this.deliverablesFdr.totalAmount = (parseInt(this.deliverablesFdr.mumbaiCount * this.api_responce_temp.data[0].InvoiceDetails[0].mumbaiRate)) + (parseInt(this.deliverablesFdr.otherThanMumbaiCount * this.api_responce_temp.data[0].InvoiceDetails[0].otherThanMumbaiRate));


            this.deliverablesChequebook.mumbaiCount = this.api_responce_temp.data[0].Chequebook[0].chequebookMumbaiCount;
            this.deliverablesChequebook.otherThanMumbaiCount = this.api_responce_temp.data[0].Chequebook[0].chequebookOtherThanMumbaiCount;
            this.deliverablesChequebook.totalCount = parseInt(this.deliverablesChequebook.mumbaiCount) + parseInt(this.deliverablesChequebook.otherThanMumbaiCount);
            this.deliverablesChequebook.totalAmount = (parseInt(this.deliverablesChequebook.mumbaiCount * this.api_responce_temp.data[0].InvoiceDetails[0].mumbaiRate)) + (parseInt(this.deliverablesChequebook.otherThanMumbaiCount * this.api_responce_temp.data[0].InvoiceDetails[0].otherThanMumbaiRate));



            this.deliverablesDebitCard.mumbaiCount = this.api_responce_temp.data[0].DebitCard[0].debitCardMumbaiCount;
            this.deliverablesDebitCard.otherThanMumbaiCount = this.api_responce_temp.data[0].DebitCard[0].debitCardOtherThanMumbaiCount;
            this.deliverablesDebitCard.totalCount = parseInt(this.deliverablesDebitCard.mumbaiCount) + parseInt(this.deliverablesDebitCard.otherThanMumbaiCount);
            this.deliverablesDebitCard.totalAmount = (parseInt(this.deliverablesDebitCard.mumbaiCount * this.api_responce_temp.data[0].InvoiceDetails[0].mumbaiRate)) + (parseInt(this.deliverablesDebitCard.otherThanMumbaiCount * this.api_responce_temp.data[0].InvoiceDetails[0].otherThanMumbaiRate));


            this.deliverablesWelcomeKit.mumbaiCount = this.api_responce_temp.data[0].WelcomeKit[0].welcomeKitMumbaiCount;
            this.deliverablesWelcomeKit.otherThanMumbaiCount = this.api_responce_temp.data[0].WelcomeKit[0].welcomeKitOtherThanMumbaiCount;
            this.deliverablesWelcomeKit.totalCount = parseInt(this.deliverablesWelcomeKit.mumbaiCount) + parseInt(this.deliverablesWelcomeKit.otherThanMumbaiCount);
            this.deliverablesWelcomeKit.totalAmount = (parseInt(this.deliverablesWelcomeKit.mumbaiCount * this.api_responce_temp.data[0].InvoiceDetails[0].mumbaiRate)) + (parseInt(this.deliverablesWelcomeKit.otherThanMumbaiCount * this.api_responce_temp.data[0].InvoiceDetails[0].otherThanMumbaiRate));


            
            this.deliverablesDD.mumbaiCount = this.api_responce_temp.data[0].DD[0].ddMumbaiCount;
            this.deliverablesDD.otherThanMumbaiCount = this.api_responce_temp.data[0].DD[0].ddOtherThanMumbaiCount;
            this.deliverablesDD.totalCount = parseInt(this.deliverablesDD.mumbaiCount) + parseInt(this.deliverablesDD.otherThanMumbaiCount);
            this.deliverablesDD.totalAmount = (parseInt(this.deliverablesDD.mumbaiCount * this.api_responce_temp.data[0].InvoiceDetails[0].mumbaiRate)) + (parseInt(this.deliverablesDD.otherThanMumbaiCount * this.api_responce_temp.data[0].InvoiceDetails[0].otherThanMumbaiRate));
            


            this.invoice_data.bill_amount = parseFloat(this.deliverablesFdr.totalAmount) + parseFloat(this.deliverablesChequebook.totalAmount) + parseFloat(this.deliverablesDebitCard.totalAmount) + parseFloat(this.deliverablesWelcomeKit.totalAmount) + parseFloat(this.deliverablesDD.totalAmount);
            
            let fuel_surcharge = (parseFloat(this.invoice_data.bill_amount) * 15) / 100;

            let tax_amount = ((parseFloat(this.invoice_data.bill_amount) + parseFloat(fuel_surcharge)) * 18) / 100;

            this.invoice_data.fuel_surcharge = Math.round(fuel_surcharge);
            this.invoice_data.tax_amount = Math.round(tax_amount);

        });

    }

    misFileUpload() {

        var res_data;

        let postData = {
            'fromDate': this.invoice_data.prod_from_date,
            'toDate': this.invoice_data.prod_to_date,
            'vendorName': this.invoice_data.prod_vendor,
            'inputFiles': this.deliverablesFile
        };
        this._deliverablesService.updateVendorFile(postData).subscribe(resdata => res_data = resdata,
            () => {}, () => {

                if (res_data.message == 'Total system AWB no is not matched with excel AWB no') {

                    this.toastr.pop('error', 'Error', 'Total system AWB no is not matched with excel AWB no.');
                } else {
                    this.toastr.pop('success', 'Successful', 'Matched Successful.');
                    this.showCreateInvoice = true;
                }

            });
        this.showCreateInvoice = true;

    }

    openCreateInvoice() {


        this.createinvoice.options = {
            cancleBtnClass: "btn btn-default",
            confirmBtnClass: "btn btn-mbe-attack",
            color: "#363794",
            header: "Create Invoice",
            widthProsentage: 95,
            animation: "bounceInDown",
            confirmBtnContent: "Submit"
        }
        this.createinvoice.show(this.createinvoice.options);

        const cssText: string = `
                .large-checkbox {
                    width: 30px;
                    height: 30px;
                }

                .invoice-heading {
                    text-align: center;
                }  
                 
                .form-control {
                    display: block;
                    width: 93%;
                    height: 34px;
                    padding: 6px 12px;
                    font-size: 14px;
                    line-height: 1.42857143;
                    text-align: center;
                    color: #555;
                    background-color: #fff;
                    background-image: none;
                    border: 1px solid #ccc;
                    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
                            box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
                    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
                         -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
                            transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
                }
                
                .col-md-12 {
                    position: relative;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                }  
                
                .table {
                  width: 100%;
                  max-width: 100%;
                  margin-bottom: 20px;
                }
                .table > thead > tr > th,
                .table > tbody > tr > th,
                .table > tfoot > tr > th,
                .table > thead > tr > td,
                .table > tbody > tr > td,
                .table > tfoot > tr > td {
                  padding: 7px;
                  line-height: 1.42857143;
                  vertical-align: top;
                  border-top: 1px solid #ddd;
                }
                .table > thead > tr > th {
                  vertical-align: bottom;
                  border-bottom: 2px solid #ddd;
                }
                .table > caption + thead > tr:first-child > th,
                .table > colgroup + thead > tr:first-child > th,
                .table > thead:first-child > tr:first-child > th,
                .table > caption + thead > tr:first-child > td,
                .table > colgroup + thead > tr:first-child > td,
                .table > thead:first-child > tr:first-child > td {
                  border-top: 0;
                }
                .table > tbody + tbody {
                  border-top: 2px solid #ddd;
                }
                .table .table {
                  background-color: #fff;
                }
                .table-condensed > thead > tr > th,
                .table-condensed > tbody > tr > th,
                .table-condensed > tfoot > tr > th,
                .table-condensed > thead > tr > td,
                .table-condensed > tbody > tr > td,
                .table-condensed > tfoot > tr > td {
                  padding: 5px;
                }
                .table-bordered {
                  border: 1px solid #ddd;
                }
                .table-bordered > thead > tr > th,
                .table-bordered > tbody > tr > th,
                .table-bordered > tfoot > tr > th,
                .table-bordered > thead > tr > td,
                .table-bordered > tbody > tr > td,
                .table-bordered > tfoot > tr > td {
                  border: 1px solid #ddd;
                }
                .table-bordered > thead > tr > th,
                .table-bordered > thead > tr > td {
                  border-bottom-width: 2px;
                }
                .table-striped > tbody > tr:nth-of-type(odd) {
                  background-color: #f9f9f9;
                }
                .table-hover > tbody > tr:hover {
                  background-color: #f5f5f5;
                }

                .table > thead > tr > td.active,
                .table > tbody > tr > td.active,
                .table > tfoot > tr > td.active,
                .table > thead > tr > th.active,
                .table > tbody > tr > th.active,
                .table > tfoot > tr > th.active,
                .table > thead > tr.active > td,
                .table > tbody > tr.active > td,
                .table > tfoot > tr.active > td,
                .table > thead > tr.active > th,
                .table > tbody > tr.active > th,
                .table > tfoot > tr.active > th {
                  background-color: #f5f5f5;
                }
                .table-hover > tbody > tr > td.active:hover,
                .table-hover > tbody > tr > th.active:hover,
                .table-hover > tbody > tr.active:hover > td,
                .table-hover > tbody > tr:hover > .active,
                .table-hover > tbody > tr.active:hover > th {
                  background-color: #e8e8e8;
                }
                .table > thead > tr > td.success,
                .table > tbody > tr > td.success,
                .table > tfoot > tr > td.success,
                .table > thead > tr > th.success,
                .table > tbody > tr > th.success,
                .table > tfoot > tr > th.success,
                .table > thead > tr.success > td,
                .table > tbody > tr.success > td,
                .table > tfoot > tr.success > td,
                .table > thead > tr.success > th,
                .table > tbody > tr.success > th,
                .table > tfoot > tr.success > th {
                  background-color: #dff0d8;
                }
                .table-hover > tbody > tr > td.success:hover,
                .table-hover > tbody > tr > th.success:hover,
                .table-hover > tbody > tr.success:hover > td,
                .table-hover > tbody > tr:hover > .success,
                .table-hover > tbody > tr.success:hover > th {
                  background-color: #d0e9c6;
                }
                .table > thead > tr > td.info,
                .table > tbody > tr > td.info,
                .table > tfoot > tr > td.info,
                .table > thead > tr > th.info,
                .table > tbody > tr > th.info,
                .table > tfoot > tr > th.info,
                .table > thead > tr.info > td,
                .table > tbody > tr.info > td,
                .table > tfoot > tr.info > td,
                .table > thead > tr.info > th,
                .table > tbody > tr.info > th,
                .table > tfoot > tr.info > th {
                  background-color: #d9edf7;
                }
                .table-hover > tbody > tr > td.info:hover,
                .table-hover > tbody > tr > th.info:hover,
                .table-hover > tbody > tr.info:hover > td,
                .table-hover > tbody > tr:hover > .info,
                .table-hover > tbody > tr.info:hover > th {
                  background-color: #c4e3f3;
                }
                .table > thead > tr > td.warning,
                .table > tbody > tr > td.warning,
                .table > tfoot > tr > td.warning,
                .table > thead > tr > th.warning,
                .table > tbody > tr > th.warning,
                .table > tfoot > tr > th.warning,
                .table > thead > tr.warning > td,
                .table > tbody > tr.warning > td,
                .table > tfoot > tr.warning > td,
                .table > thead > tr.warning > th,
                .table > tbody > tr.warning > th,
                .table > tfoot > tr.warning > th {
                  background-color: #fcf8e3;
                }
                .table-hover > tbody > tr > td.warning:hover,
                .table-hover > tbody > tr > th.warning:hover,
                .table-hover > tbody > tr.warning:hover > td,
                .table-hover > tbody > tr:hover > .warning,
                .table-hover > tbody > tr.warning:hover > th {
                  background-color: #faf2cc;
                }
                .table > thead > tr > td.danger,
                .table > tbody > tr > td.danger,
                .table > tfoot > tr > td.danger,
                .table > thead > tr > th.danger,
                .table > tbody > tr > th.danger,
                .table > tfoot > tr > th.danger,
                .table > thead > tr.danger > td,
                .table > tbody > tr.danger > td,
                .table > tfoot > tr.danger > td,
                .table > thead > tr.danger > th,
                .table > tbody > tr.danger > th,
                .table > tfoot > tr.danger > th {
                  background-color: #f2dede;
                }
                .table-hover > tbody > tr > td.danger:hover,
                .table-hover > tbody > tr > th.danger:hover,
                .table-hover > tbody > tr.danger:hover > td,
                .table-hover > tbody > tr:hover > .danger,
                .table-hover > tbody > tr.danger:hover > th {
                  background-color: #ebcccc;
                }
                .table-responsive {
                  min-height: .01%;
                  overflow-x: auto;
                }
                table {
                    border-collapse: collapse;
                }
                table {
                    width: 100%;
                }
                input.form-control {
                   border: none;
                }
                input.form-control.approver1{
                    width: 43%;
                    float: left;
                    border-right: 0.5px solid #000;
                }
                input.form-control.approver2{
                    width: 43%;
                    float: right;                    
                }
                
        }`;

        const d: Printd = new Printd();

        setTimeout(() => {
            d.print(document.getElementById('print-invoice-section'), cssText);
            this.createinvoice.hide();
        }, 1000);
    }

    createInvoice() {


        this.createinvoice.options = {
            cancleBtnClass: "btn btn-default",
            confirmBtnClass: "btn btn-mbe-attack",
            color: "#363794",
            header: "Create Invoice",
            widthProsentage: 95,
            animation: "bounceInDown",
            confirmBtnContent: "Submit"
        }
        this.createinvoice.show(this.createinvoice.options);

    }

    submitInvoice() {

        this.send_api_request = {
            data: [
                {
                    FDR: [
                        {
                            FDRMumbaiCount: this.deliverablesFdr.mumbaiCount,
                            FDROtherThanMumbaiCount: this.deliverablesFdr.otherThanMumbaiCount
                        }
                    ],
                    Chequebook: [
                        {
                            chequebookMumbaiCount: this.deliverablesChequebook.mumbaiCount,
                            chequebookOtherThanMumbaiCount: this.deliverablesChequebook.otherThanMumbaiCount
                        }
                    ],
                    DebitCard: [
                        {
                            debitCardMumbaiCount: this.deliverablesDebitCard.mumbaiCount,
                            debitCardOtherThanMumbaiCount: this.deliverablesDebitCard.otherThanMumbaiCount
                        }
                    ],
                    WelcomeKit: [
                        {
                            welcomeKitMumbaiCount: this.deliverablesWelcomeKit.mumbaiCount,
                            welcomeKitOtherThanMumbaiCount: this.deliverablesWelcomeKit.otherThanMumbaiCount
                        }
                    ],
                    DD: [
                        {
                            ddMumbaiCount: this.deliverablesDD.mumbaiCount,
                            ddOtherThanMumbaiCount: this.deliverablesDD.otherThanMumbaiCount
                        }
                    ],
                    InvoiceDetails: [
                        {
                            fromDate: this.formatDate(this.invoice_data.prod_from_date),
                            toDate: this.formatDate(this.invoice_data.prod_to_date),
                            invoiceMode: 'Edit',
                            invoiceNumber: this.invoice_form_data.invoice_number,
                            totalMumbaiCount: 0,
                            totalOtherThanMumbaiCount: 0,
                            mumbaiRate: this.invoice_data.mumbaiRate,
                            otherThanMumbaiRate: this.invoice_data.otherThanMumbaiRate,
                            totalAmount: this.invoice_form_data.bill_amount,
                            penalty_amount: this.invoice_form_data.penalty_amount,
                            final_amount_to_pay: this.invoice_data.final_amount_to_pay,
                            vendorName: this.invoice_data.prod_vendor
                        }
                    ]
                }
            ]
        }


        this._deliverablesService.saveCourierDeliverables(this.send_api_request).subscribe(resdata => {

        }, () => this.toastr.pop('error', 'Falied', 'Something went wrong please try again.')
            , () => {
                this.createinvoice.hide();
                this.toastr.pop('success', 'Success', 'Invoice Details Saved Sucessfully.');
                this.getCourierData();
            });
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    resetData() {


        this.showCreateInvoice = false;
        this.showSubmitButton = false;

        this.deliverablesFdr = {
            mumbaiCount: 0,
            otherThanMumbaiCount: 0,
            totalCount: 0,
            totalAmount: 0
        };

        this.deliverablesChequebook = {
            mumbaiCount: 0,
            otherThanMumbaiCount: 0,
            totalCount: 0,
            totalAmount: 0
        };

        this.deliverablesDebitCard = {
            mumbaiCount: 0,
            otherThanMumbaiCount: 0,
            totalCount: 0,
            totalAmount: 0
        };

        this.deliverablesWelcomeKit = {
            mumbaiCount: 0,
            otherThanMumbaiCount: 0,
            totalCount: 0,
            totalAmount: 0
        };

        this.deliverablesFile;

        this.api_responce_temp;
        this.send_api_request;
        this.disableFileUpload = false;

        this.invoice_data = {
            prod_from_date: new Date(),
            prod_to_date: new Date(),
            inputFiles: '',
            invoice_for_period: '',
            prod_vendor: '',
            deliverables_type: '',
            invoiceamount: 0,
            invoice_number: '',
            bill_amount: 0,
            penalty_amount: 0,
            invoiceMode: 'Open',
            final_amount_to_pay: 0,
            fuel_surcharge: 0,
            tax_amount: 0,
            mumbaiRate: 0,
            otherThanMumbaiRate: 0
        }

        this.invoice_form_data = {
            prod_from_date: new Date(),
            prod_to_date: new Date(),
            inputFiles: '',
            invoice_for_period: '',
            prod_vendor: '',
            deliverables_type: '',
            invoiceamount: 0,
            invoice_number: '',
            bill_amount: 0,
            penalty_amount: 0,
            invoiceMode: 'Open',
            final_amount_to_pay: 0,
            fuel_surcharge: 0,
            tax_amount: 0,
            mumbaiRate: 0,
            otherThanMumbaiRate: 0
        }
    }

    downloadCourier() {

        let prod_from_date = this.formatDate(this.invoice_data.prod_from_date);
        let prod_to_date = this.formatDate(this.invoice_data.prod_to_date);

        let downloadUrlFDR = environment.api_base_url + 'alfresco/s/suryoday/downloadCourierBillData?alf_ticket=' + this.currentUser.ticket + '&fromDate=' + prod_from_date + '&toDate=' + prod_to_date + '&courierName=' + this.invoice_data.prod_vendor + '&deliverableType=FDR';

        let downloadUrlWelcomeKit = environment.api_base_url + 'alfresco/s/suryoday/downloadCourierBillData?alf_ticket=' + this.currentUser.ticket + '&fromDate=' + prod_from_date + '&toDate=' + prod_to_date + '&courierName=' + this.invoice_data.prod_vendor + '&deliverableType=WelcomeKit';

        let downloadUrlChequeBook = environment.api_base_url + 'alfresco/s/suryoday/downloadCourierBillData?alf_ticket=' + this.currentUser.ticket + '&fromDate=' + prod_from_date + '&toDate=' + prod_to_date + '&courierName=' + this.invoice_data.prod_vendor + '&deliverableType=ChequeBook';

        let downloadUrlDebitCard = environment.api_base_url + 'alfresco/s/suryoday/downloadCourierBillData?alf_ticket=' + this.currentUser.ticket + '&fromDate=' + prod_from_date + '&toDate=' + prod_to_date + '&courierName=' + this.invoice_data.prod_vendor + '&deliverableType=DebitCard';
        
        let downloadUrlDD = environment.api_base_url + 'alfresco/s/suryoday/downloadCourierBillData?alf_ticket=' + this.currentUser.ticket + '&fromDate=' + prod_from_date + '&toDate=' + prod_to_date + '&courierName=' + this.invoice_data.prod_vendor + '&deliverableType=DD';

        window.open(downloadUrlFDR, '_blank');
        window.open(downloadUrlWelcomeKit, '_blank');
        window.open(downloadUrlChequeBook, '_blank');
        window.open(downloadUrlDebitCard, '_blank');
        window.open(downloadUrlDD, '_blank');

        return false;
    }

    filterInt(value) {
        var temp_value = value.replace(/,/g, '').trim();
        if (/^(\-|\+)?([0-9]+|Infinity)$/.test(temp_value)) {
            return Number(temp_value);
        } else {
            return 0;
        }
    }



}

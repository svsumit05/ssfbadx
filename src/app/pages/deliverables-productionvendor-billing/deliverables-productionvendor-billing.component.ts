import {AfterViewInit, Component, NgZone, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Popup} from 'ng2-opd-popup';
import {UserService} from "../../services/user.service";
import {environment} from '../../../environments/environment';
import {User} from '../../models/user';
import {UtilitiesHelper} from '../../services/utilities.service';
import {ToasterService} from 'angular2-toaster/angular2-toaster';
import {DeliverablesService} from '../../services/deliverables.service';
import {Printd} from 'printd'


@Component({
    selector: 'app-deliverables-productionvendor-billing',
    templateUrl: './deliverables-productionvendor-billing.component.html',
    styleUrls: ['./deliverables-productionvendor-billing.component.css']
})
export class DeliverablesProductionvendorBillingComponent implements OnInit {

    private currentUser: User = new User();


    deliverablesTypeData: string = "";

    deliverablesSubType1 = {
        part1BankCount: 0,
        part1VendorCount: 0,
        part1Rate: 0,
        part1Amount: 0
    };

    deliverablesSubType2 = {
        part2BankCount: 0,
        part2VendorCount: 0,
        part2Rate: 0,
        part2Amount: 0
    };

    deliverablesSubType3 = {
        part3BankCount: 0,
        part3VendorCount: 0,
        part3Rate: 0,
        part3Amount: 0
    };

    deliverablesSubType4 = {
        part4BankCount: 0,
        part4VendorCount: 0,
        part4Rate: 0,
        part4Amount: 0
    };

    api_responce_temp: any;
    send_api_request: any;

    showCreateInvoice: boolean = false;
    disableEditMode: boolean = false;

    invoice_data = {
        prod_from_date: new Date(),
        prod_to_date: new Date(),
        invoice_for_period: '',
        prod_vendor: 'Seshaasai',
        deliverables_type: '',
        invoiceamount: 0,
        invoice_number: '',
        bill_amount: 0,
        penalty_amount: 0,
        invoiceMode: 'Open',
        final_amount_to_pay: 0
    }


    constructor(private route: ActivatedRoute, private router: Router, private zone: NgZone, private _userServ: UserService, private _utilService: UtilitiesHelper, private toastr: ToasterService, private _deliverablesService: DeliverablesService, private popup: Popup) {
        // Connect to the current user's change #currentUser.token
        this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
    }

    @ViewChild('createinvoice') createinvoice: Popup;

    ngOnInit() {


    }

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'd-mm-yyyy'
    }


    onChange(newValue, maxValue) {
        var newValueInt = parseInt(newValue.target.value);

        let r_maxValue = maxValue.replace(/,/g, '').trim();
        var i_maxValue = parseInt(r_maxValue);

        if (newValueInt > i_maxValue) {
            alert('Invalid Count');
            newValue.target.value = 0;
        } else {
            console.log(newValueInt);
            console.log(i_maxValue);
        }
    }

    createInvoice() {

        this.invoice_data.invoice_for_period = this.formatDate(this.invoice_data.prod_from_date) + ' To ' + this.formatDate(this.invoice_data.prod_to_date);

        let amt1 = (this.deliverablesSubType1.part1VendorCount * this.deliverablesSubType1.part1Rate);
        let amt2 = (this.deliverablesSubType2.part2VendorCount * this.deliverablesSubType2.part2Rate);
        let amt3 = (this.deliverablesSubType3.part3VendorCount * this.deliverablesSubType3.part3Rate);
        let amt4 = (this.deliverablesSubType4.part4VendorCount * this.deliverablesSubType4.part4Rate);

        this.invoice_data.bill_amount = parseInt(amt1) + parseInt(amt2) + parseInt(amt3) + parseInt(amt4) + (((parseFloat(amt1) + parseFloat(amt2) + parseFloat(amt3) + parseFloat(amt4)) * 18) / 100);

        this.invoice_data.final_amount_to_pay = Math.round(this.invoice_data.bill_amount);

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

    onDelChange() {
        this.resetData();
    }

    getFinalPay(ev) {
        let penalty_amount = ev;
        this.invoice_data.final_amount_to_pay = (this.invoice_data.bill_amount - penalty_amount);
    }


    getProductionData() {


        let postData = {
            'fromDate': this.invoice_data.prod_from_date,
            'toDate': this.invoice_data.prod_to_date,
            'vendorName': 'Seshaasai',
            'deliverableType': this.invoice_data.deliverables_type
        };


        this._deliverablesService.getProdDeliverables(postData).subscribe(resdata => this.api_responce_temp = resdata, () => this.toastr.pop('error', 'Falied', 'Something went wrong please try again.'), () => {

            this.invoice_data.invoiceMode = this.api_responce_temp.data[0].InvoiceDetails[0].invoiceMode;

            if (this.invoice_data.invoiceMode == 'View') {
                this.disableEditMode = true;


                this.invoice_data.invoice_for_period = this.api_responce_temp.data[0].InvoiceDetails[0].fromDate + ' TO ' + this.api_responce_temp.data[0].InvoiceDetails[0].toDate,
                    this.invoice_data.invoiceMode = this.invoice_data.invoiceMode,
                    this.invoice_data.invoiceamount = this.api_responce_temp.data[0].InvoiceDetails[0].invoiceAmount,
                    this.invoice_data.invoice_number = this.api_responce_temp.data[0].InvoiceDetails[0].invoiceNumber,
                    this.invoice_data.bill_amount = this.api_responce_temp.data[0].InvoiceDetails[0].invoiceAmount,
                    this.invoice_data.penalty_amount = this.api_responce_temp.data[0].InvoiceDetails[0].penalty_amount,
                    this.invoice_data.final_amount_to_pay = this.api_responce_temp.data[0].InvoiceDetails[0].final_amount_to_pay

            } else {
                this.disableEditMode = false;
                this.invoice_data.invoiceMode = 'Edit';
            }

            if (this.invoice_data.deliverables_type == 'FDR') {


                this.deliverablesSubType1.part1BankCount = this.api_responce_temp.data[0].FDR[0].FDR_printing[0].part1BankCount;
                this.deliverablesSubType1.part1VendorCount = this.api_responce_temp.data[0].FDR[0].FDR_printing[0].part1VendorCount;
                this.deliverablesSubType1.part1Rate = this.api_responce_temp.data[0].FDR[0].FDR_printing[0].part1Rate;
                this.deliverablesSubType1.part1Amount = this.api_responce_temp.data[0].FDR[0].FDR_printing[0].part1Amount;


                this.deliverablesSubType2.part2BankCount = this.api_responce_temp.data[0].FDR[0].FDR_envelope[0].part2BankCount;
                this.deliverablesSubType2.part2VendorCount = this.api_responce_temp.data[0].FDR[0].FDR_envelope[0].part2VendorCount;
                this.deliverablesSubType2.part2Rate = this.api_responce_temp.data[0].FDR[0].FDR_envelope[0].part2Rate;
                this.deliverablesSubType2.part2Amount = this.api_responce_temp.data[0].FDR[0].FDR_envelope[0].part2Amount;

            }

            if (this.invoice_data.deliverables_type == 'WelcomeKit') {

                this.deliverablesSubType1.part1BankCount = this.api_responce_temp.data[0].WelcomeKit[0].Welcome_letter_printing[0].part1BankCount;
                this.deliverablesSubType1.part1VendorCount = this.api_responce_temp.data[0].WelcomeKit[0].Welcome_letter_printing[0].part1VendorCount;
                this.deliverablesSubType1.part1Rate = this.api_responce_temp.data[0].WelcomeKit[0].Welcome_letter_printing[0].part1Rate;
                this.deliverablesSubType1.part1Amount = this.api_responce_temp.data[0].WelcomeKit[0].Welcome_letter_printing[0].part1Amount;



                this.deliverablesSubType2.part2BankCount = this.api_responce_temp.data[0].WelcomeKit[0].Welcome_kit_collation[0].part2BankCount;
                this.deliverablesSubType2.part2VendorCount = this.api_responce_temp.data[0].WelcomeKit[0].Welcome_kit_collation[0].part2VendorCount;
                this.deliverablesSubType2.part2Rate = this.api_responce_temp.data[0].WelcomeKit[0].Welcome_kit_collation[0].part2Rate;
                this.deliverablesSubType2.part2Amount = this.api_responce_temp.data[0].WelcomeKit[0].Welcome_kit_collation[0].part2Amount;

            }

            if (this.invoice_data.deliverables_type == 'ChequeBook') {

                this.deliverablesSubType1.part1BankCount = this.api_responce_temp.data[0].ChequeBook[0].Cheuqebook_20_Lvs[0].part1BankCount;
                this.deliverablesSubType1.part1VendorCount = this.api_responce_temp.data[0].ChequeBook[0].Cheuqebook_20_Lvs[0].part1VendorCount;
                this.deliverablesSubType1.part1Rate = this.api_responce_temp.data[0].ChequeBook[0].Cheuqebook_20_Lvs[0].part1Rate;
                this.deliverablesSubType1.part1Amount = this.api_responce_temp.data[0].ChequeBook[0].Cheuqebook_20_Lvs[0].part1Amount;


                this.deliverablesSubType2.part2BankCount = this.api_responce_temp.data[0].ChequeBook[0].Cheuqebook_25_Lvs[0].part2BankCount;
                this.deliverablesSubType2.part2VendorCount = this.api_responce_temp.data[0].ChequeBook[0].Cheuqebook_25_Lvs[0].part2VendorCount;
                this.deliverablesSubType2.part2Rate = this.api_responce_temp.data[0].ChequeBook[0].Cheuqebook_25_Lvs[0].part2Rate;
                this.deliverablesSubType2.part2Amount = this.api_responce_temp.data[0].ChequeBook[0].Cheuqebook_25_Lvs[0].part2Amount;


                this.deliverablesSubType3.part3BankCount = (this.api_responce_temp.data[0].ChequeBook[0].Staffing[0].part3BankCount || 0);
                this.deliverablesSubType3.part3VendorCount = (this.api_responce_temp.data[0].ChequeBook[0].Staffing[0].part3VendorCount || 0);
                this.deliverablesSubType3.part3Rate = (this.api_responce_temp.data[0].ChequeBook[0].Staffing[0].part3Rate || 0);
                this.deliverablesSubType3.part3Amount = (this.api_responce_temp.data[0].ChequeBook[0].Staffing[0].part3Amount || 0);


                this.deliverablesSubType4.part4BankCount = (this.api_responce_temp.data[0].ChequeBook[0].Collation[0].part4BankCount || 0);
                this.deliverablesSubType4.part4VendorCount = (this.api_responce_temp.data[0].ChequeBook[0].Collation[0].part4VendorCount || 0);
                this.deliverablesSubType4.part4Rate = (this.api_responce_temp.data[0].ChequeBook[0].Collation[0].part4Rate || 0);
                this.deliverablesSubType4.part4Amount = (this.api_responce_temp.data[0].ChequeBook[0].Collation[0].part4Amount || 0);


            }

            if (this.invoice_data.deliverables_type == 'DebitCard') {


                this.deliverablesSubType1.part1BankCount = this.api_responce_temp.data[0].DebitCard[0].Debit_card_608054[0].part1BankCount;
                this.deliverablesSubType1.part1VendorCount = this.api_responce_temp.data[0].DebitCard[0].Debit_card_608054[0].part1VendorCount;
                this.deliverablesSubType1.part1Rate = this.api_responce_temp.data[0].DebitCard[0].Debit_card_608054[0].part1Rate;
                this.deliverablesSubType1.part1Amount = this.api_responce_temp.data[0].DebitCard[0].Debit_card_608054[0].part1Amount;


                this.deliverablesSubType2.part2BankCount = this.api_responce_temp.data[0].DebitCard[0].Debit_card_608022[0].part2BankCount;
                this.deliverablesSubType2.part2VendorCount = this.api_responce_temp.data[0].DebitCard[0].Debit_card_608022[0].part2VendorCount;
                this.deliverablesSubType2.part2Rate = this.api_responce_temp.data[0].DebitCard[0].Debit_card_608022[0].part2Rate;
                this.deliverablesSubType2.part2Amount = this.api_responce_temp.data[0].DebitCard[0].Debit_card_608022[0].part2Amount;

            }

            this.showCreateInvoice = true;

        });

    }

    submitInvoice() {

        var part1BankCount_r = this.deliverablesSubType1.part1BankCount;
        let part1BankCount_s = part1BankCount_r.replace(/,/g, '').trim();
        var part1BankCount_i = parseInt(part1BankCount_s);

        this.deliverablesSubType1.part1BankCount = part1BankCount_i;

        var part2BankCount_r = this.deliverablesSubType2.part2BankCount;
        let part2BankCount_s = part2BankCount_r.replace(/,/g, '').trim();
        var part2BankCount_i = parseInt(part2BankCount_s);

        this.deliverablesSubType2.part2BankCount = part2BankCount_i;


        if (this.invoice_data.deliverables_type == 'FDR') {
            this.send_api_request = {
                data: [
                    {
                        FDR: [
                            {
                                FDR_printing: [
                                    {
                                        part1BankCount: this.deliverablesSubType1.part1BankCount,
                                        part1VendorCount: this.deliverablesSubType1.part1VendorCount,
                                        part1Rate: this.deliverablesSubType1.part1Rate,
                                        part1Amount: this.deliverablesSubType1.part1Amount
                                    }
                                ],
                                FDR_envelope: [
                                    {
                                        part2BankCount: this.deliverablesSubType2.part2BankCount,
                                        part2VendorCount: this.deliverablesSubType2.part2VendorCount,
                                        part2Rate: this.deliverablesSubType2.part2Rate,
                                        part2Amount: this.deliverablesSubType2.part2Amount
                                    }
                                ]
                            }
                        ],
                        InvoiceDetails: [
                            {
                                fromDate: this.formatDate(this.invoice_data.prod_from_date),
                                toDate: this.formatDate(this.invoice_data.prod_to_date),
                                invoiceAmount: this.invoice_data.bill_amount,
                                vendorName: this.invoice_data.prod_vendor,
                                invoiceMode: 'Edit',
                                invoiceNumber: this.invoice_data.invoice_number,
                                penalty_amount: this.invoice_data.penalty_amount,
                                final_amount_to_pay: this.invoice_data.final_amount_to_pay,
                                deliverableType: 'FDR',
                                deliverableTypePart1: 'FDR_printing',
                                deliverableTypePart2: 'FDR_envelope'
                            }
                        ]
                    }
                ]
            }
        }

        if (this.invoice_data.deliverables_type == 'WelcomeKit') {
            this.send_api_request = {
                data: [
                    {
                        WelcomeKit: [
                            {
                                Welcome_letter_printing: [
                                    {
                                        part1BankCount: this.deliverablesSubType1.part1BankCount,
                                        part1VendorCount: this.deliverablesSubType1.part1VendorCount,
                                        part1Rate: this.deliverablesSubType1.part1Rate,
                                        part1Amount: this.deliverablesSubType1.part1Amount
                                    }
                                ],
                                Welcome_kit_collation: [
                                    {
                                        part2BankCount: this.deliverablesSubType2.part2BankCount,
                                        part2VendorCount: this.deliverablesSubType2.part2VendorCount,
                                        part2Rate: this.deliverablesSubType2.part2Rate,
                                        part2Amount: this.deliverablesSubType2.part2Amount
                                    }
                                ]
                            }
                        ],
                        InvoiceDetails: [
                            {
                                fromDate: this.formatDate(this.invoice_data.prod_from_date),
                                toDate: this.formatDate(this.invoice_data.prod_to_date),
                                invoiceAmount: this.invoice_data.bill_amount,
                                vendorName: this.invoice_data.prod_vendor,
                                invoiceMode: 'Edit',
                                invoiceNumber: this.invoice_data.invoice_number,
                                penalty_amount: this.invoice_data.penalty_amount,
                                final_amount_to_pay: this.invoice_data.final_amount_to_pay,
                                deliverableType: 'WelcomeKit',
                                deliverableTypePart1: 'Welcome_letter_printing',
                                deliverableTypePart2: 'Welcome_kit_collation'
                            }
                        ]
                    }
                ]
            }
        }

        if (this.invoice_data.deliverables_type == 'ChequeBook') {
            this.send_api_request = {
                data: [
                    {
                        ChequeBook: [
                            {
                                Cheuqebook_20_Lvs: [
                                    {
                                        part1BankCount: this.deliverablesSubType1.part1BankCount,
                                        part1VendorCount: this.deliverablesSubType1.part1VendorCount,
                                        part1Rate: this.deliverablesSubType1.part1Rate,
                                        part1Amount: this.deliverablesSubType1.part1Amount
                                    }
                                ],
                                Cheuqebook_25_Lvs: [
                                    {
                                        part2BankCount: this.deliverablesSubType2.part2BankCount,
                                        part2VendorCount: this.deliverablesSubType2.part2VendorCount,
                                        part2Rate: this.deliverablesSubType2.part2Rate,
                                        part2Amount: this.deliverablesSubType2.part2Amount
                                    }
                                ],
                                Staffing: [
                                    {
                                        part3BankCount: this.deliverablesSubType3.part3BankCount,
                                        part3VendorCount: this.deliverablesSubType3.part3VendorCount,
                                        part3Rate: this.deliverablesSubType3.part3Rate,
                                        part3Amount: this.deliverablesSubType3.part3Amount
                                    }
                                ],
                                Collation: [
                                    {
                                        part4BankCount: this.deliverablesSubType4.part4BankCount,
                                        part4VendorCount: this.deliverablesSubType4.part4VendorCount,
                                        part4Rate: this.deliverablesSubType4.part4Rate,
                                        part4Amount: this.deliverablesSubType4.part4Amount
                                    }
                                ]
                            }
                        ],
                        InvoiceDetails: [
                            {
                                fromDate: this.formatDate(this.invoice_data.prod_from_date),
                                toDate: this.formatDate(this.invoice_data.prod_to_date),
                                invoiceAmount: this.invoice_data.bill_amount,
                                vendorName: this.invoice_data.prod_vendor,
                                invoiceMode: 'Edit',
                                invoiceNumber: this.invoice_data.invoice_number,
                                penalty_amount: this.invoice_data.penalty_amount,
                                final_amount_to_pay: this.invoice_data.final_amount_to_pay,
                                deliverableType: 'ChequeBook',
                                deliverableTypePart1: 'Cheuqebook_20_Lvs',
                                deliverableTypePart2: 'Cheuqebook_25_Lvs',
                                deliverableTypePart3: 'Staffing',
                                deliverableTypePart4: 'Collation'
                            }
                        ]
                    }
                ]
            }
        }

        if (this.invoice_data.deliverables_type == 'DebitCard') {
            this.send_api_request = {
                data: [
                    {
                        DebitCard: [
                            {
                                Debit_card_608054: [
                                    {
                                        part1BankCount: this.deliverablesSubType1.part1BankCount,
                                        part1VendorCount: this.deliverablesSubType1.part1VendorCount,
                                        part1Rate: this.deliverablesSubType1.part1Rate,
                                        part1Amount: this.deliverablesSubType1.part1Amount
                                    }
                                ],
                                Debit_card_608022: [
                                    {
                                        part2BankCount: this.deliverablesSubType2.part2BankCount,
                                        part2VendorCount: this.deliverablesSubType2.part2VendorCount,
                                        part2Rate: this.deliverablesSubType2.part2Rate,
                                        part2Amount: this.deliverablesSubType2.part2Amount
                                    }
                                ]
                            }
                        ],
                        InvoiceDetails: [
                            {
                                fromDate: this.formatDate(this.invoice_data.prod_from_date),
                                toDate: this.formatDate(this.invoice_data.prod_to_date),
                                invoiceAmount: this.invoice_data.bill_amount,
                                vendorName: this.invoice_data.prod_vendor,
                                invoiceMode: 'Edit',
                                invoiceNumber: this.invoice_data.invoice_number,
                                penalty_amount: this.invoice_data.penalty_amount,
                                final_amount_to_pay: this.invoice_data.final_amount_to_pay,
                                deliverableType: 'DebitCard',
                                deliverableTypePart1: 'Debit_card_608054',
                                deliverableTypePart2: 'Debit_card_608022'
                            }
                        ]
                    }
                ]
            }
        }


        this._deliverablesService.saveProdDeliverables(this.send_api_request).subscribe(resdata => {

        }, () => this.toastr.pop('error', 'Falied', 'Something went wrong please try again.')
            , () => {
                this.createinvoice.hide();
                this.toastr.pop('success', 'Success', 'Invoice Details Saved Sucessfully.');
                this.getProductionData();
            })



    }

    printInvoice() {

        this.getProductionData();

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

    closePopup() {

    }

    resetData() {


        this.deliverablesSubType1 = {
            part1BankCount: 0,
            part1VendorCount: 0,
            part1Rate: 0,
            part1Amount: 0
        };

        this.deliverablesSubType2 = {
            part2BankCount: 0,
            part2VendorCount: 0,
            part2Rate: 0,
            part2Amount: 0
        };

        this.api_responce_temp;
        this.send_api_request;

        this.showCreateInvoice = false;
        this.disableEditMode = false;


        this.invoice_data.prod_from_date = new Date();
        this.invoice_data.prod_to_date = new Date();
        this.invoice_data.invoice_for_period = '';
        this.invoice_data.prod_vendor = 'Seshaasai';
        this.invoice_data.invoiceamount = 0;
        this.invoice_data.invoice_number = '';
        this.invoice_data.bill_amount = 0;
        this.invoice_data.penalty_amount = 0;
        this.invoice_data.invoiceMode = 'Open';
        this.invoice_data.final_amount_to_pay = 0;


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

    downloadProductionReport(type) {
        
        let prod_from_date = this.formatDate(this.invoice_data.prod_from_date)
        let prod_to_date = this.formatDate(this.invoice_data.prod_to_date)
       
        let downloadUrl = environment.api_base_url + 'alfresco/s/suryoday/downloadProductionBillData?alf_ticket=' + this.currentUser.ticket + '&fromDate='+prod_from_date+'&toDate='+ prod_to_date +'&vendorName='+this.invoice_data.prod_vendor+'&deliverableType='+this.invoice_data.deliverables_type+'&type='+ type;        
        window.open(downloadUrl, '_blank');
        return false;
    }



}

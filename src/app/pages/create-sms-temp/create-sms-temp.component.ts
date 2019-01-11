import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModule, TypeaheadModule } from 'ng2-bootstrap';
import { TypeaheadMatch } from 'ng2-bootstrap/typeahead';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { SmsTempService } from '../../services/sms-temp.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-create-sms-temp',
  templateUrl: './create-sms-temp.component.html',
  styleUrls: ['./create-sms-temp.component.css']
})
export class CreateSmsTempComponent implements OnInit {

  private currentUser: User = new User();
  userInformation;
  variableTextbox = [];
  variableTextBoxValue = [];

  adhocType;
  currentYear = new Date().getFullYear();
  saveVariableTextBoxValue = [];
  dynamicList = [];
  isConditional = false;
  errorMsg: any;
  responceData: any;
  isConditionalArray: any;
  conditionalSelectList = [];
  conditionalSelectOperatorList = [];
  dynamicConditionsList = [];
  dynamicConditionsText = [];
  dynamicConditionsTextSelect = [];
  dynamicConditionsTextCondition = [];
  addLinkCount = 0;
  sourceSystemId = 0;
  departmentList = [];
  removedList = [];
  conSelect = [];
  conOperator = [];
  conText = [];
  frequency;
  scheduledDate = '';
  employeeIDS = [];
  users: string[] = ['admin'];
  sourceSystemList = [];
  messageTextLenght = 0;

  conditionCounter = 0;

  constructor(private route: ActivatedRoute, private router: Router, private _userServ: UserService, private _utilService: UtilitiesHelper, private smsService: SmsTempService, private toastr: ToasterService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
  }

  ngOnInit() {
    let userId = this.currentUser.userId;
    this.smsService.getUserInformation(userId).subscribe(resdata => this.userInformation = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.userInformation.role == null) {
        this.toastr.pop('error', 'Error', 'Failed to get user information, Please Log a ticket to resolve the same.');
      }
      this.smsService.fetchAllDepartment().subscribe(resdata => this.departmentList = resdata, reserror => this.errorMsg = reserror, () => {
        this.smsService.fetchAllSourceSystem().subscribe(resdata => this.sourceSystemList = resdata, reserror => this.errorMsg = reserror, () => { });
      });
    });
  }

  getVariableBox(event) {
    this.variableTextbox = [];
    let smsType = $('input[name=textType]:checked').val();
    let input_sourceSystemId = $('input[name=sourceSystemId]:checked').val();
    let input_textType = $('input[name=textType]:checked').val();

    if (input_sourceSystemId == '' || input_textType == '') {
      alert('Please Select Source System Id and SMS Text Type');
      return true;
    }
    this.messageTextLenght = 0;

    let s = event.target.value;

    if (smsType == 'Dynamic') {

      let openTag = (s.match(/<</g) || []).length;
      let closeTag = (s.match(/>>/g) || []).length;
      let field =  (s.match(/<<Field\d{1}>>/g) || []).length;

      openTag = parseInt(openTag, 10);
      closeTag = parseInt(closeTag, 10);
      field = parseInt(field, 10);

      if (openTag === closeTag && field === openTag && field === closeTag) {
        $('.has-error').html('');
        this.variableTextbox = ' '.repeat(openTag).split('');
      } else if (openTag > closeTag) {
        $('.has-error').html('please close the subsequent closing tag');
      } else if (closeTag > openTag) {
        $('.has-error').html('please close the subsequent opening tag');
      } else if (openTag === 0 && closeTag === 0) {
        $('.has-error').html('Please enter varibale values or select SMS type to Static text.');
      } else {
        $('.has-error').html('Please check placeholder string ( Field ).');
      }

      this.messageTextLenght = s.length;

    } else {
      this.messageTextLenght = s.length;
    }

  }

  changeFrq(event) {
    let feq = event.target.value;
    this.scheduledDate = '';
    if (feq == 'Adhoc') {

      let departmentId = $('#departmentId').val();

      this.smsService.fetchDepartmentUser(departmentId).subscribe(resdata => this.users = resdata, reserror => this.errorMsg = reserror, () => {
        let userArray = [];
        for (let user of this.users) {
          userArray.push(user.employeeId);
        }
        this.users = [];
        this.users = userArray;
      });

      this.frequency = feq;

    } else {
      this.users = [];
      this.employeeIDS = [];
      this.adhocType = '';
      this.frequency = feq;
    }

  }

  adddynamicList(event) {
    let currentSelectedValue = event.target.value;

    this.saveVariableTextBoxValue.push(currentSelectedValue);

    let new_arr = this.variableTextBoxValue.filter(item => {
      if (this.dynamicList.indexOf(item.value) >= 0) {
        item.isDisable = true;
      } else {
        item.isDisable = false;
      }
      return item;
    });

    this.variableTextBoxValue = new_arr;
  }

  fatchConditionalTemp(event) {

    let isconditionalValue = this.isConditional;
    this.conditionalSelectList = [];

    if (isconditionalValue) {
      this.smsService.fetchConditionalParameterList(this.sourceSystemId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
        let isConditionalArray = this.responceData;
        this.isConditionalArray = this.responceData;
        for (let item of isConditionalArray) {
          let con_obj = {
            name: item.parameterDesc,
            value: item.parameterField
          };
          this.conditionalSelectList.push(con_obj);
        }
      });
    } else {
      this.addLinkCount = 0;
    }
  }

  adddynamicConditions(event) {

    let selectField = event.target.value;

    let createPermission;
    let createSelectIn;

    for (let c_obj in this.isConditionalArray) {
      if (this.isConditionalArray[c_obj].parameterField == selectField) {
        createPermission = this.isConditionalArray[c_obj].condition;
        createSelectIn = this.isConditionalArray[c_obj].keyvaluePairList;
        this.dynamicConditionsText[this.addLinkCount] = this.isConditionalArray[c_obj].dataType;
      }
    }

    createPermission = createPermission.split(',');
    if (createSelectIn != null) {
    } else {
      createSelectIn = [];
    }
    this.dynamicConditionsList[this.addLinkCount] = createPermission;
    this.dynamicConditionsTextSelect[this.addLinkCount] = createSelectIn;

  }

  addSubDynamicConditions(event, feildCount) {

    let selectField = event.target.value;

    if (selectField == 'in') {
      this.dynamicConditionsTextCondition[feildCount] = 'SELECT_IN';
    } else if (selectField == 'between') {
      this.dynamicConditionsTextCondition[feildCount] = 'DOUBLE';
    } else if (selectField == 'next' || selectField == 'previous') {
      this.dynamicConditionsTextCondition[feildCount] = 'DATE_CONDTIONS';
    } else if (selectField == 'today') {
      this.dynamicConditionsTextCondition[feildCount] = 'CURRENT_DATE';
    } else {
      this.dynamicConditionsTextCondition[feildCount] = 'NO_CHANGE';
    }

  }

  addLink() {
    if (this.conditionCounter >= 5) {
      this.toastr.pop('warning', 'Warning', 'Can not add more than 5 Condtions.');
    } else {
      setTimeout(() => {
        this.addLinkCount = this.addLinkCount + 1;
        this.conditionCounter = this.conditionCounter + 1;
      }, 1000);
    }

  }

  removeLink(feildCount) {
    this.removedList.push('conSelect_' + feildCount);
    $('#dy_' + feildCount).hide();
    this.conditionCounter = this.conditionCounter - 1;
  }

  getSource(event) {
    this.sourceSystemId = event.target.value;
    this.variableTextBoxValue = [];
    this.smsService.fetchFieldParameterList(this.sourceSystemId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      let variable_Text_Box_Value = this.responceData;
      for (let item of variable_Text_Box_Value) {
        let con_obj = {
          name: item.parameterDesc,
          value: item.parameterField,
          isDisable: false
        };
        this.variableTextBoxValue.push(con_obj);
      }
    });
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    let empObj = {
      employeeId: e.value
    };
    this.employeeIDS.push(empObj);
    this.scheduledDate = '';
  }

  onSubmit(values) {

    let scheduledDate;
    if (this.frequency == 'Yearly') {
      scheduledDate = this.scheduledDate.split('-');
      scheduledDate = scheduledDate[2] + '-' + scheduledDate[1];
    } else {
      scheduledDate = this.scheduledDate;
    }

    let dynamicListArray = [];

    let index_i = 1;
    this.dynamicList.forEach(element => {
      console.log(element);
      let obj_cpl = {
        key: 'field' + index_i,
        value: element
      };
      dynamicListArray.push(obj_cpl);
      index_i++;
    });


    let conditionalParameterList = [];

    for (let index = 1; index <= this.addLinkCount; index++) {
      let conSelect = eval('values.conSelect_' + index);
      let conOperator = eval('values.conOperator_' + index);
      let conText = eval('values.conText_' + index);

      if (conOperator == 'between') {
        conText = eval('values.conText_' + index + '_1') + ',' + eval('values.conText_' + index + '_2');
      }

      if (conOperator == 'in') {
        conText = eval('values.conText_' + index);
        conText = conText.join();
      }

      this.removedList.forEach(element => {
        let matchText = 'conSelect_' + index;
        if (element == matchText) {
          conSelect = '';
        }
      });


      if (conSelect != '' && conSelect != undefined) {

        let obj_cpl = {
          parameterName: conSelect,
          condition: conOperator,
          value: conText
        };
        conditionalParameterList.push(obj_cpl);

      }
    }

    let sendPostData = {
      templateName: values.templateName || null,
      templateTypeId: 1,
      scheduledDate: (values.frequency != 'Adhoc') ? scheduledDate : null,
      departmentId: values.departmentId || null,
      notificationType: values.notificationType || null,
      frequency: values.frequency || null,
      processingType: values.processingType || 'Manual',
      textType: values.textType || null,
      messageText: values.messageText || null,
      sourceSystemId: values.sourceSystemId || null,
      dynamicList: dynamicListArray,
      conditionalParameterList: conditionalParameterList,
      isActive: 1,
      createdBy: this.currentUser.userId || null,
      userRole: this.userInformation.role.roleID || null,
      userList: this.employeeIDS,
      startDate: this._utilService.convertToDate(values.startDate),
      endDate: this._utilService.convertToDate(values.endDate),
      responseEmailId: values.responseEmailId || null,
      adhocType: (values.frequency != 'Adhoc') ? null : this.adhocType,
      queryCriteria: values.queryCriteria ? values.queryCriteria : null
    };


    this.smsService.addTemplate(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {

      if (this.responceData.status == 400) {
        this.frequency = '';
        this.toastr.pop('error', 'Error', this.responceData.statusMessge);
      } else {
        this.frequency = '';
        this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
        this.router.navigate(['/template-list']);
      }

    });

  }

  removeEmployeeID(em) {
    this.employeeIDS.splice(em, 1);
  }

  checkTemplateNameExistance(event) {
    let text = event.target.value;

    this.smsService.checkTemplateNameExistance(text).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.responceData.status == 400) {
        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
        document.getElementById('templateName').value = '';
      }
    });
  }



}

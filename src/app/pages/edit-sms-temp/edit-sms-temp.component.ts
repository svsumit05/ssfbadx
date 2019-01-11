import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeaheadModule } from 'ng2-bootstrap';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { UtilitiesHelper } from '../../services/utilities.service';
import { SmsTempService } from '../../services/sms-temp.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-edit-sms-temp',
  templateUrl: './edit-sms-temp.component.html',
  styleUrls: ['./edit-sms-temp.component.css']
})
export class EditSmsTempComponent implements OnInit, AfterViewInit, OnDestroy {

  private currentUser: User = new User();
  userInformation;
  adhocType;
  editUserData = {
    templateModId: 0,
    templateName: '',
    templateTypeId: '',
    departmentId: '',
    notificationType: '',
    frequency: '',
    processingType: '',
    textType: '',
    sourceSystemId: 0,
    isActive: 1,
    messageText: '',
    scheduledDate: '',
    scheduledtime: null,
    templateType: {
      templateTypeid: 0,
      templateTypeName: '',
      isActive: 1
    },
    department: {
      departmentId: 0,
      departmentName: '',
      isActive: 1
    },
    sourceSystem: {
      sourceSystemid: 0,
      sourceSystemName: ''
    },
    dynamicList: [],
    conditionalParameterList: [],
    createdBy: '',
    createdOn: null,
    approvedBy: null,
    approvedOn: null,
    userRole: null,
    status: null,
    action: null,
    templateId: null,
    lastUpdatedBy: null,
    lastUpdatedOn: null,
    userList: null,
    startDate: '',
    endDate: '',
    queryCriteria: null,
    adhocType: null,
    responseEmailId: null,
    refTemplateModId: null
  };

  variableTextbox = [];
  variableTextBoxValue = [];
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
  editCounter = 1;
  routeId = 0;
  sourceSystemList = [];

  conditionCounter = 0;

  constructor(private route: ActivatedRoute, private router: Router, private _userServ: UserService, private _utilService: UtilitiesHelper, private smsService: SmsTempService, private toastr: ToasterService) {
    this._userServ.currentUser.subscribe((user: User) => this.currentUser = user);
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.routeId = params['id'];
      let sessionData = sessionStorage.getItem('edit_temp_' + this.routeId);
      this.editUserData = JSON.parse(sessionData);
    });

    let userId = this.currentUser.userId;
    this.smsService.getUserInformation(userId).subscribe(resdata => this.userInformation = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.userInformation.role == null) {
        this.toastr.pop('error', 'Error', 'Failed to get user information, Please Log a ticket to resolve the same.');
      }
      this.smsService.fetchAllDepartment().subscribe(resdata => this.departmentList = resdata, reserror => this.errorMsg = reserror, () => {
        this.smsService.fetchAllSourceSystem().subscribe(resdata => this.sourceSystemList = resdata, reserror => this.errorMsg = reserror, () => {
          this.fatchConditionalTemp(1);
        });
      });
    });
  }

  ngAfterViewInit() {

  }

  getEditTemplate() {
    setTimeout(() => {

      this.editUserData.startDate = this._utilService.convertToDateToString(this.editUserData.startDate);

      this.editUserData.endDate = this._utilService.convertToDateToString(this.editUserData.endDate);

      this.scheduledDate = this.editUserData.scheduledDate;

      this.getSource();

      this.adhocType = this.editUserData.adhocType;

      if (this.editUserData.conditionalParameterList == null) {
        this.addLinkCount = 0;
        this.conditionCounter = 0;
      } else {
        this.addLinkCount = this.editUserData.conditionalParameterList.length;
        this.conditionCounter = this.editUserData.conditionalParameterList.length;
      }

      if (this.editUserData.dynamicList != null) {
        for (let index = 0; index < this.editUserData.dynamicList.length; index++) {
          let dvalue = this.editUserData.dynamicList[index].value;
          this.dynamicList.push(dvalue);
        }
      }

      this.changeFrq('NO_EVENT');

      if (this.editUserData.userList != null) {
        this.employeeIDS = this.editUserData.userList;
      }

      this.getVariableBox('NO_EVENT');

      if (this.editUserData.conditionalParameterList != null) {
        for (let index = 0; index < this.editUserData.conditionalParameterList.length; index++) {

          let parameterName = this.editUserData.conditionalParameterList[index].parameterName;
          let condition = this.editUserData.conditionalParameterList[index].condition;
          let value = this.editUserData.conditionalParameterList[index].value;
          let id = (index + 1);

          this.adddynamicConditions(parameterName, 1);

          setTimeout(() => {
            $('#conSelect_' + id).val(parameterName);
            $('#conSelect_' + id).attr('disabled', 'disabled');

            $('#conOperator_' + id).val(condition);
            $('#conOperator_' + id).attr('disabled', 'disabled');


            if (condition == 'in') {
              let options_array = value.split(',');

              options_array.forEach(element => {
                $('#conText_' + id + ' option').filter(function () {
                  return ($(this).text() == element);
                }).prop('selected', true);
              });

              $('#conText_' + id).attr('disabled', 'disabled');

            } else if (condition == 'between') {

              value = value.split(',');
              $('#conText_' + id + '_1').val(value[0]);
              $('#conText_' + id + '_2').val(value[1]);
              $('#conText_' + id + '_1').attr('disabled', 'disabled');
              $('#conText_' + id + '_2').attr('disabled', 'disabled');

            } else if (condition == 'next' || condition == 'previous') {

              $('#conText_' + id).val(value);
              $('#conText_' + id).attr('disabled', 'disabled');

            } else if (condition == 'today') {

              $('#conText_' + id).val(value);
              $('#conText_' + id).attr('disabled', 'disabled');

            } else {

              $('#conText_' + id).val(value);
              $('#conText_' + id).attr('disabled', 'disabled');

            }
          }, 1000);

        }
      }
      document.getElementById('overlay').style.display = 'none';

    }, 3000);
  }

  getVariableBox(event) {

    if (event != 'NO_EVENT') {
      if (event.key == 'Backspace') {
        this.dynamicList = [];
        this.editUserData.dynamicList = [];
      }
    }

    let smsType = this.editUserData.textType;
    let input_sourceSystemId = this.editUserData.sourceSystemId;
    let input_textType = this.editUserData.textType;

    if (input_sourceSystemId == '' || input_textType == '') {
      alert('Please Select Source System Id and SMS Text Type');
      return true;
    }

    if (smsType == 'Dynamic') {

      let s = this.editUserData.messageText;

      let openTag = (s.match(/<</g) || []).length;
      let closeTag = (s.match(/>>/g) || []).length;
      let field = (s.match(/<<Field\d{1}>>/g) || []).length;

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

    }

  }

  changeFrq(event) {
    let feq;

    if (event == 'NO_EVENT') {
      feq = this.editUserData.frequency;
    } else {
      feq = event.target.value;
    }

    this.scheduledDate = '';
    if (feq == 'Adhoc') {
      this.smsService.fetchAllUsers().subscribe(resdata => this.users = resdata.data, reserror => this.errorMsg = reserror, () => {
        let userArray = [];
        for (let user of this.users) {
          userArray.push(user.employeeId);
        }
        this.users = [];
        this.users = userArray;
      });
      this.frequency = feq;
    } else {
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

  fatchConditionalTemp(conditional = 0) {
    let isconditionalValue;

    if (this.editUserData.conditionalParameterList != null) {
      isconditionalValue = (this.editUserData.conditionalParameterList.length > 0) ? true : false;
    } else {
      isconditionalValue = false;
    }

    if (conditional == 0) {
      this.isConditional = true;
      isconditionalValue = true;
    } else {
      this.isConditional = isconditionalValue;
    }
    this.conditionalSelectList = [];

    if (isconditionalValue) {
      this.smsService.fetchConditionalParameterList(this.editUserData.sourceSystemId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
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
    if (conditional == 1) {
      this.getEditTemplate();
    } else if (conditional == 0) {

    }
  }

  adddynamicConditions(event, source) {

    let selectField;
    if (source == 0) {
      selectField = event.target.value;
    } else {
      selectField = event;
    }
    let createPermission;
    let createSelectIn;

    for (let c_obj in this.isConditionalArray) {

      if (this.isConditionalArray[c_obj].parameterField == selectField) {

        createPermission = this.isConditionalArray[c_obj].condition;
        createSelectIn = this.isConditionalArray[c_obj].keyvaluePairList;
        this.dynamicConditionsText[this.addLinkCount] = this.isConditionalArray[c_obj].dataType;

        if (source == 1) {

          createPermission = createPermission.split(',');
          if (createSelectIn != null) {
          } else {
            createSelectIn = [];
          }
          let editc = (parseInt(this.editCounter) - parseInt(1));

          this.dynamicConditionsList[this.editCounter] = createPermission;
          this.dynamicConditionsTextSelect[this.editCounter] = createSelectIn;
          $('#conOperator_' + this.editCounter).val(this.editUserData.conditionalParameterList[editc].condition);

          if (this.editUserData.conditionalParameterList[editc].condition == 'in') {
            this.dynamicConditionsTextCondition[this.editCounter] = 'SELECT_IN';
          } else if (this.editUserData.conditionalParameterList[editc].condition == 'between') {
            this.dynamicConditionsTextCondition[this.editCounter] = 'DOUBLE';
          } else if (this.editUserData.conditionalParameterList[editc].condition == 'next' || this.editUserData.conditionalParameterList[editc].condition == 'previous') {
            this.dynamicConditionsTextCondition[this.editCounter] = 'DATE_CONDTIONS';
          } else if (this.editUserData.conditionalParameterList[editc].condition == 'today') {
            this.dynamicConditionsTextCondition[this.editCounter] = 'CURRENT_DATE';
          } else {
            this.dynamicConditionsTextCondition[this.editCounter] = 'NO_CHANGE';
          }

          this.editCounter++;
        }

      }
    }

    if (source == 0) {
      createPermission = createPermission.split(',');
      if (createSelectIn != null) {
      } else {
        createSelectIn = [];
      }
      this.dynamicConditionsList[this.addLinkCount] = createPermission;
      this.dynamicConditionsTextSelect[this.addLinkCount] = createSelectIn;
    }

  }

  addSubDynamicConditions(event, feildCount, source) {
    let selectField;
    if (source == 0) {
      selectField = event.target.value;
    } else {
      selectField = event;
    }

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
    this.editUserData.conditionalParameterList.splice((feildCount - 1), 1);
    $('#dy_' + feildCount).hide();
    this.conditionCounter = this.conditionCounter - 1;
  }

  getSource() {
    this.variableTextBoxValue = [];
    this.smsService.fetchFieldParameterList(this.editUserData.sourceSystemId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
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

  onSubmit(values) {

    let scheduledDate;
    if (this.editUserData.frequency == 'Yearly') {
      scheduledDate = this.editUserData.scheduledDate.split('-');
      scheduledDate = scheduledDate[2] + '-' + scheduledDate[1];
    } else {
      scheduledDate = this.editUserData.scheduledDate;
    }

    let dynamicListArray = [];

    let index_i = 1;
    this.dynamicList.forEach(element => {
      let obj_cpl = {
        key: 'field' + index_i,
        value: element
      };
      dynamicListArray.push(obj_cpl);
      index_i++;
    });

    this.editUserData.dynamicList = dynamicListArray;

    this.editUserData.lastUpdatedBy = this.currentUser.userId;
    this.editUserData.userRole = this.userInformation.role.roleID;

    let conditionalParameterList = [];
    conditionalParameterList = this.editUserData.conditionalParameterList;
    this.editUserData.conditionalParameterList = [];

    for (let index = 1; index <= this.addLinkCount; index++) {
      let conSelect = eval('values.conSelect_' + index);
      let conOperator = eval('values.conOperator_' + index);
      let conText = eval('values.conText_' + index);

      if (conOperator == 'between') {
        conText = eval('values.conText_' + index + '_1') + ',' + eval('values.conText_' + index + '_2')
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

    let employeeIDSArray = [];

    this.employeeIDS.forEach(element => {
      let empObj = {
        employeeId: element.employeeId
      };
      employeeIDSArray.push(empObj);
    });

    let sendPostData = {
      templateName: this.editUserData.templateName || null,
      templateTypeId: 1,
      scheduledDate: (this.editUserData.frequency != 'Adhoc') ? scheduledDate : null,
      departmentId: this.editUserData.departmentId || null,
      notificationType: this.editUserData.notificationType || null,
      frequency: this.editUserData.frequency || null,
      processingType: this.editUserData.processingType || 'Manual',
      textType: this.editUserData.textType || null,
      messageText: this.editUserData.messageText || null,
      sourceSystemId: this.editUserData.sourceSystemId || null,
      dynamicList: dynamicListArray,
      conditionalParameterList: conditionalParameterList,
      isActive: 1,
      userRole: this.userInformation.role.roleID || null,
      userList: employeeIDSArray,
      startDate: this._utilService.convertToDate(this.editUserData.startDate),
      endDate: this._utilService.convertToDate(this.editUserData.endDate),
      responseEmailId: this.editUserData.responseEmailId || null,
      refTemplateModId: this.editUserData.templateModId || null,
      lastUpdatedBy: this.currentUser.userId,
      adhocType: (this.editUserData.frequency != 'Adhoc') ? null : this.adhocType,
      createdBy: this.editUserData.createdBy || null,
      queryCriteria: this.editUserData.queryCriteria ? this.editUserData.queryCriteria : null
    };

    this.smsService.checkTemplatePresentForApproval(this.editUserData.templateId).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
      if (this.responceData.status == '200') {

        this.smsService.editTemplate(sendPostData).subscribe(resdata => this.responceData = resdata, reserror => this.errorMsg = reserror, () => {
          if (this.responceData.status == 400) {
            this.frequency = '';
            this.toastr.pop('error', 'Error', this.responceData.statusMessge);
          } else {
            this.frequency = '';
            this.toastr.pop('success', 'Successful', this.responceData.statusMessge);
            // this.router.navigate(['/template-rejected']);
            window.history.back();
          }
        });

      } else {
        this.toastr.pop('warning', 'Warning', this.responceData.statusMessge);
        this.frequency = '';
        // this.router.navigate(['/template-rejected']);
        window.history.back();
      }

    });


  }

  closeEditTemp() {
    // this.router.navigate(['/template-rejected']);
    window.history.back();
  }

  removeEmployeeID(em) {
    this.employeeIDS.splice(em, 1);
  }

  ngOnDestroy() {
    sessionStorage.removeItem('edit_temp_' + this.routeId);
  }

}

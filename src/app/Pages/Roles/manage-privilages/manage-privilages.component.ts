import { Component, OnInit } from '@angular/core';
import { Router } from 'node_modules/@angular/router';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';

@Component({
  selector: 'app-manage-privilages',
  templateUrl: './manage-privilages.component.html',
  styleUrls: ['./manage-privilages.component.css']
})
export class ManagePrivilagesComponent implements OnInit {

  constructor(private router: Router, public _communicationservice: CommunicateService, private _formbuilder: FormBuilder,
    private _commonNodeCallService: CommonCallService) {
    this._communicationservice.backendError = false;
  }
  RoleName;
  DisplayName;
  edit = false;
  Dynamicform: FormGroup;
  ipnutBox: boolean = false;
  functionalityArr = [];
  static Finalarr = [];
  formerror: boolean = false;
  idForupdate;
  display_message_for_role: Boolean;
  message;
  errorMsg: boolean = false;
  ngOnInit() {
    this.form.reset();
    this.ipnutBox = true;
    console.log("on init call at manage previlages")
    this._communicationservice.rolesdata.subscribe(data => {
      console.log(data);
      if (data == "") {
        this.edit = false;
        this.RoleName = "";
        this.DisplayName = "";

      } else {
        this.edit = true;
        // while (this.Parameter.length !== 0) {
        //   this.Parameter.removeAt(0)
        // }
        //console.log("this.functionalityArr" + JSON.stringify(this.Parameter));
        this.idForupdate = data;

        this._commonNodeCallService.roledataById(data).subscribe(res => {
          if (res['success']) {
            const arr = <FormArray>this.form.controls.Parameter;
            arr.controls = [];
            this._communicationservice.backendError = false;
            console.log("=========data is============ ", JSON.stringify(res['results'][0].FinalfunctionalityArr[0].functionalityName))
            this._communicationservice.loader = false;

            this.form.patchValue({
              role: res['results'][0].role_name,
              display_name: res['results'][0].display_name

            });
            // while (this.Parameter.length !== 0) {
            //   this.Parameter.removeAt(0)
            // }
            for (var i = 0; i < res['results'][0].FinalfunctionalityArr.length; i++) {
              //console.log(" res['results'][0].FinalprivilegeArray[i]", res['results'][0].FinalprivilegeArray[i])
              const parameter0 =
                this._formbuilder.group({
                  functionalityname: res['results'][0].FinalprivilegeArray[i].functionalityId,
                  Chk1: res['results'][0].FinalprivilegeArray[i].pr_listing,
                  Chk2: res['results'][0].FinalprivilegeArray[i].pr_add,
                  Chk3: res['results'][0].FinalprivilegeArray[i].pr_edit,
                  Chk4: res['results'][0].FinalprivilegeArray[i].pr_delete
                })
              this.Parameter.push(parameter0);
              //console.log("param operation" + JSON.stringify(parameter0.value))
            }
            console.log("param operation" + this.Parameter)
          } else {
            if(res['statusCode'] === 401){
              this.router.navigateByUrl('/login');
            }else{
              this._communicationservice.backendError = true;
            }
          }
          this._communicationservice.loader = false;
        });

      }
    })
  }

  form = this._formbuilder.group({
    'role': ['', [Validators.required,Validators.pattern(this._communicationservice.pattern.alphanumericWithSpaceApostrophe)]],
     'display_name': ['', [Validators.required,Validators.pattern(this._communicationservice.pattern.alphanumericWithSpaceApostrophe)]],
    Parameter: this._formbuilder.array([])
  })

  createParameter(functionalityArr): FormGroup {
    return this._formbuilder.group({
      functionalityname: functionalityArr,
      Chk1: '',
      Chk2: '',
      Chk3: '',
      Chk4: ''
    })
  }
  addParameter(functionalityArr) {
    const parameter = this.createParameter(functionalityArr);
    this.Parameter.push(parameter);
  }

  get Parameter(): FormArray {
    return this.form.get('Parameter') as FormArray;
  }

  cancel() {
    //this.form.reset()
    this._communicationservice.backendError = false;
    this.functionalityArr = []
    console.log("this.Parameter.length before", this.Parameter.length)
    // while (this.Parameter.length !== 0) {
    //   this.Parameter.removeAt(0)
    // }
    const arr = <FormArray>this.form.controls.Parameter;
    arr.controls = [];
    console.log("this.Parameter.length aftere", this.Parameter.length)
    this.formerror = false;
    this.errorMsg = false;
    this.form.valid;
    this.display_name.valid
    this.form.reset();
    this._communicationservice.PrivilageCancel(false);
  }
  add(data) {
    if (this.form.invalid) {
      this.formerror = true;
    }
    else {
      // giving action
      data.actionType = "submit";
      //var data;
      this._communicationservice.loader = true;
      data.createdBy = sessionStorage.getItem('userid');
      data.status = "active";
      data.functionalityName = this.functionalityArr;
      console.log("role ka data" + JSON.stringify(data));
      this._commonNodeCallService.AddRole(data).subscribe(res => {
        console.log(res);
        if (res['success']) {
          this._communicationservice.backendError = false;
          this.display_message_for_role = true;
          this.message = res['message'];
        }
        else {
          if (res['statusCode'] === 500) {
            this._communicationservice.backendError = true;
          } else {
            if(res['statusCode'] === 401){
              this.router.navigateByUrl('/login');
            }else{
              console.log("In else");
            this.message = res['message'];
            this.errorMsg = true;
            }
          }
        }
        this._communicationservice.loader = false;
      })
    }
  }
  update(data) {
    if (this.form.invalid) {
      this.formerror = true;
    }
    else {
      // giving action
      this._communicationservice.loader = true;
      data.actionType = "update";
      data.updateId = this.idForupdate;
      data.updatedBy = sessionStorage.getItem('userid');
      data.status = "active";
      data.functionalityName = this.functionalityArr;
      console.log("data", JSON.stringify(data))
      this._commonNodeCallService.UpdateRole(data).subscribe(res => {
        if (res['success']) {
          this._communicationservice.backendError = false;
          this.display_message_for_role = true;
          this.message = res['message'];
        }
        else {
          if (res['statusCode'] === 500) {
            this._communicationservice.backendError = true;
          } else {
            if(res['statusCode'] === 401){
              this.router.navigateByUrl('/login');
            }else{
              console.log("In else");
            this.message = res['message'];
            this.errorMsg = true;
            }
          }
        }
        this._communicationservice.loader = false;
      })
    }
  }
  // autocomplete dropdown for Department
  departments = ['Department 1', 'Department 2', 'Department 3', 'Department 4', 'Department 5', 'Department 6', 'Department 7', 'Department 8', 'Department 9', 'Department 10'];
  department;
  filtereddepartment = [];

  filterddepartment(event) {
    this.filtereddepartment = [];
    for (let i = 0; i < this.departments.length; i++) {
      let department = this.departments[i];
      if (department.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filtereddepartment.push(department);
      }
    }
  }

  addLabel() {
    //this.form.reset();
    this.form.patchValue({
      role: '',
      display_name: ''
    });
    console.log("this.Parameter.length before", this.Parameter.length)
    while (this.Parameter.length !== 0) {
      this.Parameter.removeAt(0)
    }
    console.log("this.Parameter.length after", this.Parameter.length)

    this._commonNodeCallService.GetFunctionality().subscribe(res => {
      for (var j = 0; j < res['results'].length; j++) {

        this.functionalityArr.push({ id: res['results'][j].id, name: res['results'][j].name })
      }
      for (var i = 0; i < this.functionalityArr.length; i++) {
        this.addParameter(this.functionalityArr[i])
      }

    });
  }

  okMessageForRole() {
    this.display_message_for_role = false;
    window.location.reload();
  }
  get role() {
    return this.form.get('role');
  }

  get display_name() {
    return this.form.get('display_name');
  }
  onkeyDownAllFields() {
    this.formerror = false;
    this.errorMsg = false;
    this._communicationservice.backendError = false;
  }

}

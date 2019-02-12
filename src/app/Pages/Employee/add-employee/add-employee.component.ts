import { Component, OnInit, Input, Output } from '@angular/core';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { FrontEndValidationService } from 'src/app/services/Validation/front-end-validation.service';
import { Router } from '@angular/router';
// import { EventEmitter } from 'events';
import { EventEmitter } from '@angular/core';

export class labelid {
    label: string
    id: number
}

@Component({
    selector: 'app-add-employee',
    templateUrl: './add-employee.component.html',
    styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
    form: FormGroup;
    sbupresent: boolean =false;
    storingid;
    message;
    displayaddnewvariant: boolean;
    userId;
    errorArrray =[];
    edit = false;
    formerror: boolean = false;
    displayDialog;
    display_message_for_edit: boolean;
    @Input('parentToChild') childEmpId: string;
    @Output() childToParent = new EventEmitter();

    constructor(public _communicationService: CommunicateService,
        private _commonNodeCallService: CommonCallService,
        private validationService: FrontEndValidationService,
        private router: Router) {
        this.form = new FormGroup({
            name: new FormControl('', [
                Validators.required,Validators.minLength(3),Validators.pattern(this._communicationService.pattern.onlycharWithSpace)
            ]),
            email: new FormControl('', [
                Validators.required,Validators.pattern(this._communicationService.pattern.emailAddress)
            ]),
            mobileno: new FormControl('', [
                Validators.required,Validators.minLength(10),Validators.pattern(this._communicationService.pattern.mobileNo)
            ]),
            departmentName: new FormControl('', [
                Validators.required
            ]),
            designation: new FormControl('', [
                Validators.required
            ]),
            phone: new FormControl('',[Validators.minLength(8),Validators.maxLength(12)]),

            roles: new FormControl('', [
                Validators.required
            ]),
            sbu: new FormControl('', [
                Validators.required,Validators.pattern(this._communicationService.pattern.alphanumericWithSpaceApostrophe)
            ])
        })
        this._communicationService.backendError = false;
    }

    ngOnInit() {
        console.log("rohit init called");
		this.userId = sessionStorage.getItem('userid');

        console.log("Add Employee Component");
        // this._communicationService.subjectobjemp.subscribe(data => {
            if (this.childEmpId === '') {
                console.log("ADD EMPLOYEE PAGE");
                this.form.get('sbu').setValidators([Validators.required, Validators.pattern(this._communicationService.pattern.alphanumericWithSpaceApostrophe)]);
                this.form.get('sbu').updateValueAndValidity();
                this.edit = false;
                this.form.patchValue({
                    designation: '',
                    departmentName: '',
                    roles: '',
                    sbu: '',
                    name: '',
                    email: '',
                    mobileno: '',
                    phone: ''
                });
            }
            else {
                console.log("EDIT EMPLOYEE PAGE");                
                // console.log("data from listing page brought here" + JSON.stringify(data));
                this.form.get('sbu').clearValidators();
                this.form.get('sbu').updateValueAndValidity();
                this.edit = true;
                // console.log(data)
                var objid = { id: this.childEmpId };
                this._commonNodeCallService.GetEmployeesWithId(objid).subscribe(res => {
                    console.log(res);
                    this._communicationService.loader = false;
                    if (res['success']) {
                        var objdepartment = { label: res['results'][0].dept_name, id: res['results'][0].deptid }
                        var objdesignation = { label: res['results'][0].desg_name, id: res['results'][0].desgid }
                        var objrole = { label: res['results'][0].role_name, id: res['results'][0].roleid }
                        var objsbu = { label: res['results'][0].sbu_name, id: res['results'][0].sbuid }
                        // // storing id in local variable so that it can be used in updating database    
                        this.storingid = res['results'][0].id
                        this.form.patchValue({
                            designation: objdesignation,
                            departmentName: objdepartment,
                            roles: objrole,
                            sbu: objsbu,
                            name: res['results'][0].name,
                            email: res['results'][0].email,
                            mobileno: res['results'][0].mobile,
                            phone: res['results'][0].phone
                        });
                    }else{
                        if(res['statusCode'] === 401){
                            this.router.navigateByUrl('/login');
                        }else{
                            this._communicationService.backendError = true;
                        }
                    }
                })
            }
        // });

        // getting roles from database
        let data = {getdata:null};
        this._commonNodeCallService.GetRoleList(data).subscribe(res => {
            console.log(res);
            if (res['success']) {
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
                        this.rolesresults.push({ label: element.display_name, id: element.id });
                    });
                }
            }else{
                this._communicationService.backendError = true;
            }
        });

        // getting department from database
        this._commonNodeCallService.GetDepartment().subscribe(res => {
            console.log(res);
            if (res['success']) {
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
                        this.departmentresults.push({ label: element.dept_name, id: element.id });
                    });
                }
            }else{
                this._communicationService.backendError = true;
            }
        });

        // getting designationList from database
        this._commonNodeCallService.GetDesignation().subscribe(res => {
            console.log(res);
            if (res['success']) {
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
                        this.designationresults.push({ label: element.desg_name, id: element.id });
                    });
                }
            }else{
                this._communicationService.backendError = true;
            }
        });

        // getting sbu from database
        this._commonNodeCallService.GetSbu().subscribe(res => {
            console.log(res);
            if (res['success']) {
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
                        this.sburesults.push({ label: element.sbu_name, id: element.id });
                    });
                }
            }else{
                this._communicationService.backendError = true;
            }
        });

        this.form.get('sbu').valueChanges.subscribe( x =>{
            if(x){
                this.form.get('sbu').setValidators([Validators.required, Validators.pattern(this._communicationService.pattern.alphanumericWithSpaceApostrophe)])
            }
        })
            
    }

    //   SUBMIT
    submit(data) {
        if (this.form.invalid) {
            this.formerror = true;
        }
        else {
            console.log(data);
            data.actionType = "submit";
            data.userId = this.userId;
            this._communicationService.loader = true;
            console.log("data(SUBMIT)==>",data);
            this._commonNodeCallService.UpdateEmployee(data).subscribe(res => {
                console.log(res);
                console.log("res['!success']",res['!success'])
                console.log("res['success']",res['success'])
                if (res['success'] === true) {
                this._communicationService.backendError = false;
                    console.log("inside TRUE");            
                    this._communicationService.loader = false;
                    this.sbupresent=false;
                    this.display_message_for_edit = true;
                    this.form.reset();
                    this.message =res['message'];                
                    // this._communicationService.EmployeeSubmit(false);
                    
                }
                else if(res['success'] === false){
                    console.log("inside FALSE");            
                    console.log("email or sbu name is already present");
                    this.errorArrray = res['message'];
                    this.sbupresent = true;
                    this._communicationService.loader = false;
                }
                else {
                    if(res['statusCode'] === 401){
                        this.router.navigateByUrl('/login');
                    }else{
                        this._communicationService.loader = false;
                    console.log("else block-internal server error");
                    this._communicationService.backendError = true;
                    // this._communicationService.loader = false;
                    }
                }

            })
        }


    }

    //   UPDATE
    Update(data) {
        console.log(data);
        // giving action
        data.actionType = "update";
        // storing id in data
        data.id = this.storingid;
        console.log("data after storing id in it >>" + data.id);
        console.log(data);
        data.userId = this.userId;
        this._communicationService.loader = true;
        console.log("data==(UPDATE)>",data);
        // updating database with particular id
        this._commonNodeCallService.UpdateEmployee(data).subscribe(res => {
            // this._communicationService.EmployeeCancel(false);
            console.log(res);
            if (res['success'] === true) {
                this._communicationService.backendError = false;
                console.log("updated successfully");
                this._communicationService.loader = false;
                this.display_message_for_edit = true;
                this.sbupresent=false;
                this.form.reset();
                this.message =res['message'];                                
            }
            else if(res['success'] === false){
                console.log("inside FALSE");            
                console.log("email or sbu name is already present");
                this.errorArrray = res['message'];
                this.sbupresent = true;
                this._communicationService.loader = false;
            }
            else {
                if(res['statusCode'] === 401){
                    this.router.navigateByUrl('/login');
                }else{
                    console.log("else block-internal server error")
                    this._communicationService.backendError = true;
                // this._communicationService.loader = false;
                }
            }
        });
    }

    Cancel() {
        this.form.get('sbu').setValidators([Validators.required, Validators.pattern(this._communicationService.pattern.alphanumericWithSpaceApostrophe)]);
        this.form.get('sbu').updateValueAndValidity();
        this._communicationService.backendError = false;
        this.form.reset();     
        this.formerror=false;
        this.sbupresent=false;  
        this.childToParent.emit('false');         
        // this._communicationService.EmployeeCancel(false);
    }



    get name() {
        return this.form.get('name');
    }
    get email() {
        return this.form.get('email');
    }
    get mobileno() {
        return this.form.get('mobileno');
    }
    get departmentName() {
        return this.form.get('departmentName');
    }
    get designation() {
        return this.form.get('designation');
    }
    get phone() {
        return this.form.get('phone');
    }
    get roles() {
        return this.form.get('roles');
    }
    get sbu() {
        return this.form.get('sbu');
    }

    // ***designation autocomplete dropdown***
    designationresults: labelid[] = [];
    filtereddesignation: labelid[] = [];
    searchdesignation(event) {
        this.filtereddesignation = this.designationresults
            .filter(data => data.label.toString()
                .toLowerCase()
                .indexOf(event.query.toString().toLowerCase()) !== -1);
    }
    designationDropdown() {
        this.filtereddesignation;
    }

    // ***department autocomplete dropdown***
    departmentresults: labelid[] = [];
    filtereddepartmentresults: labelid[] = [];
    searchfiltereddepartment(event) {
        this.filtereddepartmentresults = this.departmentresults
            .filter(data => data.label.toString()
                .toLowerCase()
                .indexOf(event.query.toString().toLowerCase()) !== -1);
    }
    departmentDropdown() {
        this.filtereddepartmentresults;
    }

    // *** roles autocomplete dropdown ***
    rolesresults: labelid[] = [];
    filteredrolesresults: labelid[] = [];
    searchfilteredroles(event) {
        this.filteredrolesresults = this.rolesresults
            .filter(data => data.label.toString()
                .toLowerCase()
                .indexOf(event.query.toString().toLowerCase()) !== -1);
    }
    rolesDropdown() {
        this.filteredrolesresults;
    }

    // *** sbu autocomplete dropdown ***
    sburesults: labelid[] = [];
    filteredsbusresults: labelid[] = [];
    searchsbu(event) {
        this.filteredsbusresults = this.sburesults
            .filter(data => data.label.toString()
                .toLowerCase()
                .indexOf(event.query.toString().toLowerCase()) !== -1);
    }
    sbudropdown() {
        this.filteredsbusresults;
    }

    onkeyup(evt, type) {
        evt.target.value = this.validationService.KeyUpValidation(type, evt.target.value);
    }

    keyUpMultipleSpaceValidation(evt){
        evt.target.value = this.validationService.keyUpMultipleSpaceValidation(evt.target.value);
    }
    // edit message pop-up
    okMessageForEdit() {
        this.form.get('sbu').setValidators([Validators.required, Validators.pattern(this._communicationService.pattern.alphanumericWithSpaceApostrophe)]);
        this.form.get('sbu').updateValueAndValidity();
        this.display_message_for_edit = false;
        this.sbupresent =false;
        window.location.reload();
    }

    deleteValidations(){
        this._communicationService.backendError = false;
        this.sbupresent =false;
    }
    clearVal(){
        this.form.get('sbu').clearValidators();
        this.form.get('sbu').updateValueAndValidity();
    }
    setVal(){
        this.form.get('sbu').setValidators([Validators.required, Validators.pattern(this._communicationService.pattern.alphanumericWithSpaceApostrophe)]);
        this.form.get('sbu').updateValueAndValidity();
    }
}
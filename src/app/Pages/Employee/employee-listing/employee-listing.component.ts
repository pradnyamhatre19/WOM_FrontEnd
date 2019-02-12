import { Component, OnInit, Input } from '@angular/core';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employee-listing',
    templateUrl: './employee-listing.component.html',
    styleUrls: ['./employee-listing.component.css']
})
export class EmployeeListingComponent implements OnInit {
    norecords: boolean = false;
    deleteId;
    objdelete = {};
    employeeslength;

    cols: any[];
    employees: any[] = [];
    edit = false;
    isEdit = false;
    isListing = false;
    isDelete = false;
    isAdd = false;
    employeepresent :boolean =false;
    message;
    // popup open close
    displayopenclose: boolean =false;
    displayaddnewvariant: boolean = false;
    sendEmpIdToChild : string;
    onEdit;
    EmployeeName;
    Department;
    EmpDesignation;
    MobileNumber;
    Email;

    constructor(public _communicateService: CommunicateService,
        private _commonNodeCallService: CommonCallService,
        private router: Router) {
            var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
            sessionStorage.setItem('selectedFunctionality', 'Employees Master');
            if(!privillageArray){
            this.router.navigateByUrl('/login');
      }
	  this._communicateService.backendError = false;
         }

    ngOnInit() {
        console.log("Listing page");
        this._communicateService.loader = true;
        var data = {sbuId : 0}
        this._commonNodeCallService.GetEmployees(data).subscribe(res => {
            console.log(res);
            console.log("all employees details are fetched");
            this._communicateService.loader = false;
            if(res['success']){
                this._communicateService.backendError = false;
                if (res['results'].length > 0) {
                    res['results'].forEach(element => {
                        var empObj = {
                            "EmployeeName": element.name,
                            "MobileNumber": element.mobile,
                            "Department": element.dept_name,
                            "Designation": element.desg_name,
                            "Email": element.email,
                            "id": element.id,
                            "desgid": element.desgid,
                            "deptid": element.deptid,
                            "roleid": element.roleid,
                            "sbuid": element.sbuid,
                            "phone": element.phone,
                            "Role": element.role_name,
                            "Sbuname": element.sbu_name
                        }
                        this.employees.push(empObj);
                    });
                    console.log("$$$$$$$$$$$" + JSON.stringify(this.employees))
                    this.employeeslength = this.employees.length;
                    console.log("emp length", this.employeeslength)
                }
                else {
                    console.log("No records to display here");
                        this.norecords = true;
                }
            }else{
                if(res['statusCode'] === 401){
                    this.router.navigateByUrl('/login');
                }else{
                    this._communicateService.backendError = true;
                }
            }
        });
       
        this.cols = [
            { field: 'EmployeeName', header: 'Employee Name', width: '15%' },
            { field: 'MobileNumber', header: 'Mobile Number', width: '15%' },
            { field: 'Department', header: 'Department', width: '15%' },
            { field: 'Designation', header: 'Designation', width: '15%' },
            { field: 'Email', header: 'Email', width: '20%' },
            { field: 'Action', header: 'Action', width: '15%' }
        ];

    }
    ngDoCheck() {
        var pageName = sessionStorage.getItem('selectedFunctionality')
        var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
        if (privillageArray.length > 0) {
            for (var i = 0; i < privillageArray.length; i++) {
                var funObj = privillageArray[i];
                if (funObj.fname === pageName) {
                    if (funObj.pr_add === 1) {
                        this.isAdd = true;
                    }
                    if (funObj.pr_delete) {
                        this.isDelete = true;
                    }
                    if (funObj.pr_edit) {
                        this.isEdit = true;
                    }
                    if (funObj.pr_listing) {
                        this.isListing = true;
                    }
                }
            }
        }
    }
   

    
    editEmployeeData(dt, index) {
        const empData = dt.filteredValue ? dt.filteredValue : this.employees;
        console.log("employee id", empData[index].id);
        // this._communicateService.saveDataEmp(empData[index].id);
        // send id to child component
        this.sendEmpIdToChild = empData[index].id;
        this._communicateService.loader = true;
        this.displayaddnewvariant = true;
    }

    delete(dt, index) {
        console.log("delet clicked");
        //this.displayDialog = false;     
        const empData = dt.filteredValue ? dt.filteredValue : this.employees;
        this.objdelete = { id: empData[index].id }
        console.log("checking obj to be deleted" + JSON.stringify(this.objdelete));
        this.displayopenclose = true;
    }
    showDialogToAdd() {
        // this._communicateService.backendError = false;
        // this._communicateService.saveDataEmp("");
        this.sendEmpIdToChild = '';
        this.displayaddnewvariant = true;
    }


    showOpenCloseDialog() {
        this._commonNodeCallService.DeleteEmployee(this.objdelete).subscribe(res => {
            console.log(res);
            if(res['success']){
                this._communicateService.backendError = false;
                this.displayopenclose = false;
                this.display_message_for_delete = true;
                this.message =res['message'];
            }else if(res['employeepresent']){
                this.displayopenclose = false;
                this.display_message_for_delete = true;
                this.employeepresent =true;
                this.message =res['message'];
            }else{
                if(res['statusCode'] === 401){
                    this.router.navigateByUrl('/login');
                }else{
                    this.displayopenclose = false;
                    this._communicateService.backendError = true;
                }
            }
        });
        

    }
    closeOpenCloseDialog() {
        this.displayopenclose = false;
    }

    // delete message pop-up
    display_message_for_delete: boolean;

    okMessageForDelete() {
        this.display_message_for_delete = false;
        this._communicateService.backendError = false;
        window.location.reload();
    }
    close_display_message_for_delete(){
        this._communicateService.backendError = false;
        this.employeepresent =false;
        this.display_message_for_delete =false;
    }
    //Getting value from child
  childToParent(childvariable){
      console.log("value from child",childvariable);
    if(childvariable === 'false'){
        this.displayaddnewvariant =false;
    }
  }

}

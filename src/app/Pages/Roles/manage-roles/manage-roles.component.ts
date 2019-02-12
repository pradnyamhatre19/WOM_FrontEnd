import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { ManagePrivilagesComponent } from '../manage-privilages/manage-privilages.component';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.css']
})
export class ManageRolesComponent implements OnInit {
  @ViewChild('loadlabel') loadlabel: ManagePrivilagesComponent
  constructor(private router:Router,public _communicationservice:CommunicateService,private _commonNodeCallService: CommonCallService) { 
    var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
      sessionStorage.setItem('selectedFunctionality', 'Manage Roles');
      if(!privillageArray){
        this.router.navigateByUrl('/login');
      }
      this._communicationservice.backendError = false;
  }
  
  cols: any[];
  Roles:any[] = [];
  displayDialog=false;
  objdelete = {};
  displayopenclose: boolean;
  roleLength;
  message;
  isEdit = false;
  isListing = false;
  isDelete = false;
  isAdd = false;
  norecords: boolean = false;

  deleteFlag :boolean =false;;
    // delete message pop-up
    display_message_for_delete: boolean;
  ngOnInit() {
      // showing Roles
      this._communicationservice.loader =  true;
      let data = {getdata:'all'};

      this._commonNodeCallService.GetRoleList(data).subscribe(res => {
        this._communicationservice.loader =  false;
        if(res['success']){
        this._communicationservice.backendError = false
          if (res['results'].length > 0) {
            console.log("============Role",JSON.stringify(res['results'][0]))
              res['results'].forEach(element => {
                  this.Roles.push({
                      RoleName: element.role_name, 
                      Id: element.id,
                      DisplayName: element.display_name
                  });
              });
              this.roleLength = this.Roles.length;
          }
          else {
            console.log("No records to display here");
            this.norecords = true;
          }
        }else{
          if(res['statusCode'] === 401){
            this.router.navigateByUrl('/login');
        }else{
            this._communicationservice.backendError = true;
        }
        }
        
    });
   
    this.cols = [
        { field: 'RoleName', header: 'Role Name',width: '10%' },
        { field: 'DisplayName', header: 'Display Name',width: '10%' },
        { field: 'Action', header: 'Action', width: '5%' }
    ];

      this._communicationservice.manageprivilage.subscribe(data=>{
        if(data==false){
          this.manageprivilages=false;
          this.displayDialog=false;
          this.addPrivilages=false;

        }
      })
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
  manageprivilages=false;

  editPrivilages(dt,index){
    const rolesData=dt.filteredValue?dt.filteredValue:this.Roles;     
    console.log("rolesData id",rolesData[index].Id);
    this._communicationservice.RoleasData(rolesData[index].Id);
    this.manageprivilages=true;
    this._communicationservice.loader = true;
   this.loadlabel.addLabel();
  }

  delete(dt,index){
    const rolesData=dt.filteredValue?dt.filteredValue:this.Roles;     
    console.log("rolesData id",rolesData[index].Id);
    this.objdelete = { id: rolesData[index].Id }
    this.displayopenclose = true;
  }

    showOpenCloseDialog() {
      this._commonNodeCallService.DeleteRole(this.objdelete).subscribe(res => {
          if (res['success']) {
          this._communicationservice.backendError = false
            this.displayopenclose = false;
            this.display_message_for_delete = true;
            this.message = res['message'];
            this.deleteFlag = true;
          }
          else if(res['rolepresent']){
              this.deleteFlag = false;
            }else{
              if(res['statusCode'] === 401){
                this.router.navigateByUrl('/login');
              }else{
              this._communicationservice.backendError = true;
              }
            }
      });
    }
    closeOpenCloseDialog() {
      this.displayopenclose = false;
    }

    okMessageForDelete() {
        this._communicationservice.backendError = false;
      this.display_message_for_delete = false;
      window.location.reload();
  }
  close_display_message_for_delete(){
    this._communicationservice.backendError = false
    this.display_message_for_delete = false;
  }
  Close(){
    this.displayDialog=false;
  }
  addPrivilages=false;
  showDialogToAdd(){
    this._communicationservice.RoleasData("");
	this.addPrivilages=true;
    this.manageprivilages=true;
   this.loadlabel.addLabel();
  }

}

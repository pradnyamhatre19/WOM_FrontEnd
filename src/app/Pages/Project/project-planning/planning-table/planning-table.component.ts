import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';



@Component({
  selector: 'planning-table',
  templateUrl: './planning-table.component.html',
  styleUrls: ['./planning-table.component.css']
})
export class PlanningTableComponent implements OnInit {
  budgetingSelected: boolean = false;
  planningSelected: boolean = true;
  activeSelected: boolean = false;
  archivedSelected: boolean = false;

  //dialogbox
  displayplanning: boolean = false;


  planningtabledata: any[] = [];
  planningtablelength;

  colsplanning: any[];
  norecords: boolean = false;
  dataPlan = {};
  obj;
  display: boolean = false;
  successfull_pop_up: boolean = false;
  message;
  budgetingvalue;
  budgeting;
  planning;
  SessionSbuId;
  isEdit = false;
  isListing = false;
  isDelete = false;
  isAdd = false;
  
  constructor(
    private router: Router,
    private _commonNodeCallService: CommonCallService,public commonService:CommunicateService) {
      var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
      sessionStorage.setItem('selectedFunctionality', 'Projects Planning Page');
      if(!privillageArray){
        this.router.navigateByUrl('/login');
      }
      this.commonService.backendError = false;
     }

  ngOnInit() {
    // getting sbu id from session
    var sessionSbuId = JSON.parse(sessionStorage.getItem('userinfo'))
    this.SessionSbuId = sessionSbuId[0]['sbu_id']
    console.log("SessionSbuId in Planning===>",this.SessionSbuId);

    console.log("inside planning table")
    // this.carService.getCarsSmall().then(cars => this.cars = cars);
    // this.carService.getPlanningData().then(cars => this.planningtabledata = cars);

    if (sessionStorage.getItem("projectDetails") !== null) {
      sessionStorage.removeItem('projectDetails');
    }

    this.colsplanning = [
      { field: 'Name', header: 'Name & Area', width: '30%' },
      { field: 'Client', header: 'Client Name', width: '20%' },
      { field: 'ProjectDate', header: 'Project Dates', width: '28%' },
      { field: 'Budget', header: 'Budget', width: '10%' },
      { field: 'Action', header: 'Action', width: '12%' }
    ];

    // getting count
    var data ={};
    data['sbuId'] =this.SessionSbuId;
    console.log("getting project count with data in planning ==>",data)
   this._commonNodeCallService.GetProjectCount(data).subscribe(res => {
    console.log("res",res['results']);
    if(res['success']){
      this.budgeting=res['results'].budgetcount
      this.planning=res['results'].planningcount        
    }else{
      if(res['statusCode'] === 401){
        this.router.navigateByUrl('/login');
    }else{
        this.commonService.backendError = true;
    }
    }
    })

    if (sessionStorage.getItem("projectDetails") !== null) {
      sessionStorage.removeItem('projectDetails');
    }

    if (sessionStorage.getItem("planningTable") == "planningTable") {
      console.log("inside SESSION==> planningTable matched");      
      
      // table data
      this.dataPlan = { actionType: "planning" };
      this.dataPlan['sbuId'] =this.SessionSbuId;
      this._commonNodeCallService.GetProjectListing(this.dataPlan).subscribe(res => {
        console.log("project listing with planning", res)
        this.commonService.loader = false;
        if(res['success']){
          if (res['results'].length > 0) {
            res['results'].forEach(element => {
              var newstartDate = element.start_Date;
              var newendDate = element.end_Date;
              if(element.start_Date === "null"){
                newstartDate = '';
              }
              if(element.end_Date === "null"){
                newendDate = '';
              }
              var projectObj = {
                "Name": element.project_name + " (" + element.Area + " Sq.Ft)",
                "projectName": element.project_name,
                "Client": element.name,
                "ProjectDate": newstartDate + " - " + newendDate,
                "Budget": element.tentative_value,
                "id": element.id
              }
              this.planningtabledata.push(projectObj);
            });
            console.log("$$$$$$$$$$$" + JSON.stringify(this.planningtabledata))
            this.planningtablelength = this.planningtabledata.length;
            console.log("projects length", this.planningtablelength)
          }
          else {
            console.log("No records to display here");
              this.norecords = true;
          }
        }else{
          if(res['statusCode'] === 401){
            this.router.navigateByUrl('/login');
          }else{
          this.commonService.backendError = true;
          }
        }
      })
    }
  }

  budgeting_button() {
    this.budgetingSelected = true;
    this.planningSelected = false;
    this.activeSelected = false;
    this.archivedSelected = false;
    sessionStorage.setItem('selectedFunctionality', 'Project');
    this.router.navigateByUrl('/Project');
  }
  planning_button() {
    this.planningSelected = true;
    this.budgetingSelected = false;
    this.activeSelected = false;
    this.archivedSelected = false;

  }
  active_button() {
    this.activeSelected = true;
    this.budgetingSelected = false;
    this.planningSelected = false;
    this.archivedSelected = false;
    this.router.navigateByUrl('/Project/show_active_table');
  }
  archived_button() {
    this.archivedSelected = true;
    this.budgetingSelected = false;
    this.planningSelected = false;
    this.activeSelected = false;
  }

  onRowSelect(event) {
    // console.log(event);
    //this.displayplanning = true; create POW Pop UP 
    this.commonService.AddBOQSetHtml = true;
    this.commonService.projectSpecificBOQData = event.data;
    event.data['ProjectJourney'] = 'Planning';
    event.data['finalize'] = false;
    sessionStorage.setItem('projectDetails', JSON.stringify(event.data));
    this.router.navigateByUrl('/Project/BOQ');
  }
  // planning dialog box
  planning_dialog_cancel() {
    this.displayplanning = false;
  }
  create_pi_wi() {
    this.router.navigateByUrl('/create_items');
  }
  view_items() {
    this.router.navigateByUrl('/view_items');
  }

  ngDoCheck() {
    var pageName = sessionStorage.getItem('selectedFunctionality')
   // console.log("pageName on project table==",pageName)
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
  // create_po(){
  //   this.router.navigateByUrl('/finalise_purchase_order');          
  // }
  editProjectData(dt, index) {
    const projectData = dt.filteredValue ? dt.filteredValue : this.planningtabledata;
    console.log("project id number in planning", projectData[index].id);
    var projectObj = { id: projectData[index].id, action: "editProject" }
    console.log("projectObj in planning", projectObj);
    // storing data in session
    sessionStorage.setItem('projectid', projectData[index].id);
    this.commonService.loader = true;
    // session ends here
    this.router.navigateByUrl('/Project/AddProject');
  }

  delete(dt, index) {
    console.log("delete in planning", dt, index)
    const projectData = dt.filteredValue ? dt.filteredValue : this.planningtabledata;
    console.log(projectData[index].id);
    this.obj = { id: projectData[index].id , userId : sessionStorage.getItem('userid')}
    this.display = true;
  }
  deleteProject() {
    console.log("in planning delete");
    this._commonNodeCallService.DeleteProject(this.obj).subscribe(res => {
      if (res['success']) {
        this.display = false;
        this.successfull_pop_up = true;
        this.message = res['message'];
      }else{
        if(res['statusCode'] === 401){
          this.router.navigateByUrl('/login');
        }else{
          this.display = false;
        this.commonService.backendError = true;
        }
        
      }
    })
  }
  close() {
    this.display = false;
  }
  okMessage() {
    console.log("in planning close");
    this.commonService.backendError = false;
    this.successfull_pop_up = false;
    window.location.reload();
  }
}

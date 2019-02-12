import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';



@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.css']
})
export class ProjectsTableComponent implements OnInit {
	
  // @Input('isEdit') isEdit;
  // @Input('isDelet') isDelet;
  

  budgetingSelected: boolean = true;
  planningSelected: boolean = false;
  activeSelected: boolean = false;
  archivedSelected: boolean = false;

  //dialogbox
  displaybudgeting: boolean = false;
  displayplanning: boolean = false;

  display: boolean = false;
  successfull_pop_up: boolean = false;


  cols: any[];

  projects: any[] = [];
  norecords: boolean = false;
  message;

  projectslength;
  obj;
  data = {};
  budgeting;
  planning;
  isEdit = false;
  isListing = false;
  isDelete = false;
  isAdd = false;
  SessionSbuId;
  
  constructor( private router: Router,
    public commonService: CommunicateService,
    private _commonNodeCallService: CommonCallService) { 
      var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
      sessionStorage.setItem('selectedFunctionality', 'Project');
      if(!privillageArray){
        this.router.navigateByUrl('/login');
      }
      this.commonService.backendError = false;
    }

  ngOnInit() {
    
    this.commonService.loader = true;
    console.log("inside budgetting table")

    // getting sbu id from session
    var sessionSbuId = JSON.parse(sessionStorage.getItem('userinfo'))
    this.SessionSbuId = sessionSbuId[0]['sbu_id']
    console.log("SessionSbuId in Budgeting===>",this.SessionSbuId);

    // this.carService.getCarsSmall().then(cars => this.cars = cars);

    this.cols = [
      { field: 'Name', header: 'Name & Area', width: '30%' },
      { field: 'Client', header: 'Client Name', width: '20%' },
      { field: 'ProjectDate', header: 'Project Dates', width: '28%' },
      { field: 'Budget', header: 'Budget', width: '10%' },
      { field: 'Action', header: 'Action', width: '12%' }
    ];
    
    // getting count
    var data ={};
    data['sbuId'] =this.SessionSbuId;
    console.log("getting project count with data in budgeting==>",data)
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

    if (sessionStorage.getItem("budgetingTable") == "budgetingTable") {
     // console.log("inside SESSION ==>Budgeting matched");      
      // table data
      this.data = { actionType: "budgeting" }
      this.data['sbuId'] =this.SessionSbuId;
      this._commonNodeCallService.GetProjectListing(this.data).subscribe(res => {
        console.log("project listing with Budgeting", res)
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
								"id": element.id,
								"sbuId" : element.sbuId
              }
              this.projects.push(projectObj);
            });
            //console.log("$$$$$$$$$$$" + JSON.stringify(this.projects))
            this.projectslength = this.projects.length;
            //console.log("projects length", this.projectslength)
          }
          else {
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

  budgeting_button() {
    this.budgetingSelected = true;
    this.planningSelected = false;
    this.activeSelected = false;
    this.archivedSelected = false;
  }
  planning_button() {
    this.planningSelected = true;
    this.budgetingSelected = false;
    this.activeSelected = false;
    this.archivedSelected = false;
    sessionStorage.setItem('selectedFunctionality', 'Projects Planning Page');
    this.router.navigateByUrl('/Project/show_planning_table');
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
    console.log(event);
    console.log("sbuid",event.data.sbuId);
    this.commonService.AddBOQSetHtml = true;
    this.commonService.projectSpecificBOQData = event.data;
    event.data['ProjectJourney'] = 'Budgeting';
    sessionStorage.setItem('projectDetails', JSON.stringify(event.data));
    this.commonService.loader = true;
    // this.commonService.ProjectJourney = 'Budgeting'
    this.router.navigateByUrl('/Project/BOQ');
    sessionStorage.setItem('selectedFunctionality', 'BOQ List');
  }

  editProjectData(dt, index) {
    const projectData = dt.filteredValue ? dt.filteredValue : this.projects;
    console.log("project id number", projectData[index].id);
    var projectObj = { id: projectData[index].id, action: "editProject" }
    console.log("projectObj", projectObj);
    
    this.commonService.loader = true;
    // storing data in session
    sessionStorage.setItem('projectid', projectData[index].id);
    // session ends here
    this.commonService.saveProjectId(projectObj);
    this.router.navigateByUrl('/Project/AddProject');
  }
  
  

  delete(dt, index) {
    console.log("delete", dt, index)
    const projectData = dt.filteredValue ? dt.filteredValue : this.projects;
    console.log(projectData[index].id);
    this.obj = { id: projectData[index].id , userId : sessionStorage.getItem('userid')}
    this.display = true;
  }

  deleteProject() {
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
    this.commonService.backendError = false;
    this.successfull_pop_up = false;
    window.location.reload();
  }
}

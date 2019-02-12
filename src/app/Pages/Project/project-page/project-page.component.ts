import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';

@Component({
  selector: 'project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class ProjectPageComponent implements OnInit {

  constructor(private router:Router,private _communicationService: CommunicateService) {
    //console.log("in constructor.....")
    var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
      sessionStorage.setItem('selectedFunctionality', 'Project');
      if(!privillageArray){
        this.router.navigateByUrl('/login');
      }
   }

   
  isEdit = false;
  isListing = false;
  isDelete = false;
  isAdd = false;
  
  ngOnInit() {
      this._communicationService.loader = true;
    console.log("in projects page html layout setting session for budgeting.....")
    
    // removing planning table session
    sessionStorage.removeItem('planningTable');

    // setting session for Budgeting table
    sessionStorage.setItem('budgetingTable', "budgetingTable");        
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
  
  gotoAddnewproject(){
    // storing data in session
    sessionStorage.setItem('projectid', "addProject");
    // session ends here
    var obj={action:"addProject"}
    this._communicationService.saveProjectId(obj);
    this.router.navigateByUrl('/Project/AddProject');
  }
}

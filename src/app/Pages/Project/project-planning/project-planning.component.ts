import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
@Component({
  selector: 'app-project-planning',
  templateUrl: './project-planning.component.html',
  styleUrls: ['./project-planning.component.css']
})
export class ProjectPlanningComponent implements OnInit {


  isEdit = false;
  isListing = false;
  isDelete = false;
  isAdd = false;

  constructor(private router: Router,public communicateService:CommunicateService) { 
    var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
    sessionStorage.setItem('selectedFunctionality', 'Projects Planning Page');
    if(!privillageArray){
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
      this.communicateService.loader = true;
    console.log("in Planning Table page html layout setting session for Planning.....")
    
    // removing budgetingTable table session
    sessionStorage.removeItem('budgetingTable');

    // setting planning table session
    sessionStorage.setItem('planningTable', "planningTable");            
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
    console.log("planning table add button clicked")
    sessionStorage.setItem('projectid', "addProject");
    this.router.navigateByUrl('/Project/AddProject');
  }
}

//import { Component, OnInit } from '@angular/core';
import { THIS_EXPR } from 'node_modules/@angular/compiler/src/output/output_ast';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientinformationComponent } from '../clientinformation/clientinformation.component';
import { flatten } from '@angular/compiler';
import { Router } from '@angular/router';
@Component({
    selector: 'app-client-dashboard',
    templateUrl: './client-dashboard.component.html',
    styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
    @ViewChild('removeContact') removeContact: ClientinformationComponent
    client: any[] = [];
    clientLength;
    cols: any[];
    objdelete = {};
	gotPrivillages ;
    constructor(public _communicationservice: CommunicateService,
        private _commonNodeCallService: CommonCallService,
        private router: Router) { 
            this.gotPrivillages = false;

            var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
            sessionStorage.setItem('selectedFunctionality', 'Clients Master');
            if(!privillageArray){
            this.router.navigateByUrl('/login');
        }
        this._communicationservice.backendError = false;
        }
    edit = false;
    displayopenclose: boolean;
    Isactive: boolean;
    isEdit = false;
    isListing = false;
    isDelete = false;
    isAdd = false;
    message;
    clientpresent :boolean =false;
    norecords: boolean = false;

    ngOnInit() {
        console.log("Listing page");
        // showing employees
        this._communicationservice.loader = true;
        this._commonNodeCallService.GetClientList().subscribe(res => {
            this._communicationservice.loader = false;
            if(res['success']){
                if (res['results'].length > 0) {
                    res['results'].forEach(element => {
                        this.client.push({
                            ClientName: element.name, Id: element.id,
                            Industry: element.indnm,
                            City: element.ctnm, cityId: element.city,
                            Category: element.catnm, categoryId: element.category,
                            Action: element.status,
                            Address: element.address,
                            typeofspaceName: element.spname, typeofspaceId: element.spacetype,
                            industryName: element.indnm, industryId: element.industry,
                            status: element.status
                        });
                    });
                    this.clientLength = this.client.length;
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
            { field: 'ClientName', header: 'Client Name', width: '10%' },
            { field: 'Industry', header: 'Industry', width: '10%' },
            { field: 'City', header: 'City', width: '10%' },
            { field: 'Category', header: 'Category', width: '10%' },
            { field: 'Action', header: 'Action', width: '15%' }
        ];

        this._communicationservice.clientedit.subscribe(data => {
            if (data == false) {
                this.edit = false;
                this.displayaddnewvariant = false;
            }
        })
        this._communicationservice.clientupdate.subscribe(data => {
            if (data == false) {
                this.edit = false;
                this.displayopenclose = false;
                window.location.reload();
            }
        })
    }

    ngDoCheck(){
       var pageName = sessionStorage.getItem('selectedFunctionality')
       var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
       //console.log("privillageArray==>",privillageArray);
         if(privillageArray.length>0){ 
                for(var i=0; i<privillageArray.length; i++){
                    var funObj = privillageArray[i];
                    if(funObj.fname === pageName){
                        if(funObj.pr_add === 1){
                            this.isAdd = true;
                        }
                        if(funObj.pr_delete){
                            this.isDelete = true;
                        }
                        if(funObj.pr_edit){
                            this.isEdit = true;
                        }
                        if(funObj.pr_listing){
                            this.isListing = true;
                        }
                    }
                }
			}
	}

    abc = 1800;
    // autocomplete dropdown for city
    // cities = ['Mumbai', 'Pune', 'Delhi'];
    // city;
    // filteredcity = [];
    // filtercity(event) {
    //     this.filteredcity = [];
    //     for (let i = 0; i < this.cities.length; i++) {
    //         let city = this.cities[i];
    //         if (city.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //             this.filteredcity.push(city);
    //         }
    //     }
    // }

    getCellData(row: any, col: any): any {
        const nestedProperties: string[] = col.field.split('.');
        let value: any = row;
        for (const prop of nestedProperties) {
          value = value[prop];
        }  
        return value;
      }

    // autocomplete dropdown for category
    // categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6', 'Category 7', 'Category 8', 'Category 9', 'Category 10'];
    // category;
    // filteredcategory = [];

    // filtercategory(event) {
    //     this.filteredcategory = [];
    //     for (let i = 0; i < this.categories.length; i++) {
    //         let category = this.categories[i];
    //         if (category.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //             this.filteredcategory.push(category);
    //         }
    //     }
    // }

    // autocomplete dropdown for Designations
    // Designations = ['Designations 1', 'Designations 2', 'Designations 3', 'Designations 4', 'Designations 5', 'Designations 6', 'Designations 7', 'Designations 8', 'Designations 9', 'Designations 10'];
    // Designation;
    // filteredDesignation = [];

    // filterdDesignation(event) {
    //     this.filteredDesignation = [];
    //     for (let i = 0; i < this.Designations.length; i++) {
    //         let destination = this.Designations[i];
    //         if (destination.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //             this.filteredDesignation.push(destination);
    //         }
    //     }
    // }

    // autocomplete dropdown for industry
    // industries = ['Industry 1', 'Industry 2', 'Industry 3', 'Industry 4', 'Industry 5', 'Industry 6', 'Industry 7', 'Industry 8', 'Industry 9', 'Industry 10'];
    // industry;
    // filteredIndustry = [];

    // filterdIndustry(event) {
    //     this.filteredIndustry = [];
    //     for (let i = 0; i < this.industries.length; i++) {
    //         let industry = this.industries[i];
    //         if (industry.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //             this.filteredIndustry.push(industry);
    //         }
    //     }
    // }



    // autocomplete dropdown for spaces
    // spaces: string[] = ['ABC', 'XYX', 'PQR'];
    // space: string;
    // filteredspaces: any[];

    // filterspaces(event) {
    //     this.filteredspaces = [];
    //     for (let i = 0; i < this.spaces.length; i++) {
    //         let space = this.spaces[i];
    //         if (space.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //             this.filteredspaces.push(space);
    //         }
    //     }
    // }

    editClientData(dt,index) {
        const clientData=dt.filteredValue?dt.filteredValue:this.client;     
        console.log("clientData id",clientData[index].Id);
        this._communicationservice.clientdata(clientData[index].Id);
        this.displayaddnewvariant = true;
    }

    delete(dt,index) {
        const clientData=dt.filteredValue?dt.filteredValue:this.client;     
        console.log("clientData id",clientData[index].Id);

        this.objdelete = { id: clientData[index].Id }
        this.displayopenclose = true;
    }

    displayaddnewvariant: boolean;

    showOpenCloseDialog() {
        this._commonNodeCallService.DeleteClient(this.objdelete).subscribe(res => {
            if(res['success']){
                this.message= res['message'];
                this.displayopenclose = false;
                this.display_message_for_delete = true;
            }else if(res['clientpresent']){
                this.clientpresent =true;
            }else{
                if(res['statusCode'] === 401){
                    this.router.navigateByUrl('/login');
                }else{
                    this.displayopenclose = false;
                this._communicationservice.backendError = true;
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
        this._communicationservice.backendError = false;
        window.location.reload();
    }
    showDialogToAdd() {
        this._communicationservice.clientdata("");
        this.displayaddnewvariant = true;
        this.removeContact.removeParam();
    }
    Close() {
        this.displayopenclose = false;
    }
    closeAdd() {
        this.displayaddnewvariant = false;
    }
    close_display_message_for_delete(){
        this._communicationservice.backendError = false;
        this.display_message_for_delete=false;
        this.clientpresent =false;
    }
}

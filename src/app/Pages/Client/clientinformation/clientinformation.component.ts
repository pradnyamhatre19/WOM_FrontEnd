import { Component, OnInit } from '@angular/core';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from 'node_modules/@angular/forms';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { MIN_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';
import { inspect } from 'util'
import { utils, element } from 'protractor';
import { Router } from '@angular/router';
export class labelId {
    label: string
    id: number
}

@Component({
    selector: 'app-clientinformation',
    templateUrl: './clientinformation.component.html',
    styleUrls: ['./clientinformation.component.css']
})
export class ClientinformationComponent implements OnInit {
    storingid;
    form: FormGroup;
    ClientAddress: any;
    Plus: boolean = false;
    display_message_for_client_add: Boolean;
    message;
   formerror:boolean=false;
    isEdit = false;
	isListing = false;
	isDelete = false;
    isAdd = false;
    display:boolean =false;
    clientDeleteIndex;

    constructor(public _communicationservice: CommunicateService, private _formbuilder: FormBuilder,
       private _commonNodeCallService: CommonCallService,private router:Router) {
        this._communicationservice.backendError = false;
        this._communicationservice.checkClient(false);
       }

    // ***Industry autocomplete dropdown***
    getindustries: labelId[] = [];
    filteredIndustry: labelId[] = [];
    filterIndustry(event) {
        // console.log("checking event "+ event);
        this.filteredIndustry = this.getindustries
            .filter(data => data.label.toString()
                .toLowerCase()
                .indexOf(event.query.toString().toLowerCase()) !== -1);
    }

    IndustryDropdown() {
        this.filteredIndustry;
    }
    // autocomplete dropdown for type of spaces
    gettypeofspace: labelId[] = [];
    filteredspaces: labelId[] = [];
    filterspaces(event) {
        // console.log("checking event "+ event);
        this.filteredspaces = this.gettypeofspace
            .filter(data => data.label.toString()
                .toLowerCase()
                .indexOf(event.query.toString().toLowerCase()) !== -1);
    }

    Type_Of_Space_Dropdown() {
        this.filteredspaces;
    }


    // autocomplete dropdown for city
    cityresults: labelId[] = [];
    filteredcity: labelId[] = [];
    filtercity(event) {
        // console.log("checking event "+ event);
        this.filteredcity = this.cityresults
            .filter(data => data.label.toString()
                .toLowerCase()
                .indexOf(event.query.toString().toLowerCase()) !== -1);

    }

    cityDropdown() {
        this.filteredcity;
    }

    // autocomplete dropdown for category
    categoryresults: labelId[] = [];
    filteredcategory: labelId[] = [];
    filtercategory(event) {
        this.filteredcategory = this.categoryresults
            .filter(data => data.label.toString()
                .toLowerCase()
                .indexOf(event.query.toString().toLowerCase()) !== -1);

    }

    // autocomplete dropdown for state
    getstate: labelId[] = [];
    filteredstate: labelId[] = [];
    filterstate(event) {
        if (this.getstate == null) { console.log("do nothing!!"); this.filteredstate = null } else {
            this.filteredstate = this.getstate
                .filter(data => data.label.toString()
                    .toLowerCase()
                    .indexOf(event.query.toString().toLowerCase()) !== -1);
        }
    }
    stateDropdown() {
        this.filteredstate;
    }
	
	categoryDropdown() {
        this.filteredcategory;
    }
    designationresults: labelId[] = [];
    filtereddesignation: labelId[] = [];
    searchdesignation(event) {
        // console.log("checking event "+ event);
        this.filtereddesignation = this.designationresults
            .filter(data => data.label.toString()
                .toLowerCase()
                .indexOf(event.query.toString().toLowerCase()) !== -1);
    }

    designationDropdown() {
        this.filtereddesignation;
    }
    Category;
    City;
    ClientName;
    ContactName;
    edit = false;
    idForupdate;
    cancelReload : boolean =false ;

    ngOnInit() {
        this.form = this._formbuilder.group({
            'clientName': ['', [Validators.required,Validators.pattern(this._communicationservice.pattern.onlycharWithSpace)]],
            'categoryName': ['', Validators.required],
            'cityName': ['', Validators.required],
            'spacesName': ['', Validators.required],
            'industryName': ['', Validators.required],
            'stateName': ['', Validators.required],
            'address1': ['', [Validators.required,Validators.pattern(this._communicationservice.pattern.alphanumericWithSpacehyphen)]],
            'address2': ['',Validators.pattern(this._communicationservice.pattern.alphanumericWithSpacehyphen)],
            'pincode': ['',Validators.pattern(this._communicationservice.pattern.pincode)],
            Parameter: this._formbuilder.array([this.createParameter()])
        })

        this._communicationservice.clientData.subscribe(data => {
            if (data == "") {
                this.edit = false;
                this.form.patchValue({
                    clientName: "",
                    categoryName: "",
                    cityName: "",
                    spacesName: "",
                    industryName: "",
                    address1: "",
                    address2: "",
                    pincode: "",
                    stateName: ""
                })
            }
            else {
                this.onEditData(data);
            }
        })
            
        // getting state from databse
        var data = { "id": 1, "actionType": 'showState' }
        // var data = { "id": evt.id, "actionType": 'showState' }
        this._commonNodeCallService.GetStateCity(data).subscribe(res => {
            if (res['success'] == true) {
                this.getstate = [];
                res['results'].forEach(element => {
                    this.getstate.push({ label: element.name, id: element.id });
                });
            }
            else {
                this.getstate = null;
            }

        })

        // getting Industry from databse
        this._commonNodeCallService.GetIndustry().subscribe(res => {
            console.log(res);
            if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
                        this.getindustries.push({ label: element.Industry_name, id: element.id });
                    });
                }
            }else{
                this._communicationservice.backendError = true;                        
            }
        });
        // getting category from databse
        this._commonNodeCallService.GetCategoryListing().subscribe(res => {
            console.log(res);
            if(res['success']){
                if(res['results'].length > 0){
                    let catList = res['results'];
                    catList.forEach(element=>{
                        console.log("element",element)
                        this.categoryresults.push({ label: element.name, id: element.id });
                    })
                }
            }else{
                this._communicationservice.backendError = true;                        
            }
        });

        // getting Type of space from databse
        this._commonNodeCallService.GetTypeofspace().subscribe(res => {
            console.log(res);
            if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
                        this.gettypeofspace.push({ label: element.spaces_name, id: element.id });
                    });
                }
            }else{
                this._communicationservice.backendError = true;                        
            }
        });

        // getting designationList from databse
        this._commonNodeCallService.GetClientSideDesignation().subscribe(res => {
            console.log(res);
            if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
                        if(element.desg_name !== 'Other'){
                            this.designationresults.push({ label: element.desg_name, id: element.id });
                        }
                    });
                }
            }else {
                this._communicationservice.backendError = true;      
            }
        });
    }
	
	ngDoCheck() {
		var pageName = sessionStorage.getItem('selectedFunctionality')
		//console.log("this._communicationservice.privillageArray", this._communicationService.privillageArray)
        //console.log("this.pageName==========", pageName)
        var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
		if (privillageArray.length > 0) {
			for (var i = 0; i < privillageArray.length; i++) {
				var funObj = privillageArray[i];
				//console.log("funObj", funObj)
				if (funObj.fname === pageName) {
					// console.log("matched==", funObj.fname)
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
	
	//city from database on the basis of state
    showCity(evt) {
        this.form.patchValue({
            cityName:''
        })
        var data = { "id": evt.id, "actionType": 'showCity' }
        this._commonNodeCallService.GetStateCity(data).subscribe(res => {
            if (res['success'] == true) {
                this.cityresults = [];
                res['results'].forEach(element => {
                    this.cityresults.push({ label: element.city_name, id: element.id });
                });
            }
            else {
                this.cityresults = null;
            }
        })
    }
    createParameter(): FormGroup {
        return this._formbuilder.group({
            contactName: ['',[Validators.required,Validators.pattern(this._communicationservice.pattern.onlycharWithSpace)]],
            designation: '',
            email: ['',[Validators.pattern(this._communicationservice.pattern.emailAddress)]],
            mobileno: ['',[Validators.pattern(this._communicationservice.pattern.mobileNo)]],
        })
    }
    addParameter() {
        const parameter = this.createParameter();
        this.Parameter.push(parameter);
    }
    removeParamter(index) {
        this.display = true;
        this.clientDeleteIndex = index;
    }

    get Parameter(): FormArray {
        return this.form.get('Parameter') as FormArray;

    }
    
    Submit(data) {
      
        if (this.form.invalid) {
            console.log("data if")
            this.formerror = true;
        }
        else {

            console.log("data else")
            // giving action
            data.actionType = "submit";
            //var data;
            data.createdBy = sessionStorage.getItem('userid');
            data.status = "active";
            console.log("data", JSON.stringify(data))
		    this._communicationservice.loader = true;
            // console.log("mera client ka data =========== after " + JSON.stringify(data));
            this._commonNodeCallService.AddClient(data).subscribe(res => {
                console.log(res);
                if(res['statusCode'] === 200){
                if (res['success']) {
                    console.log("details added in clientmaster table");
                    this.display_message_for_client_add = true;
                    this.message = res['message'];
                    
                if(this._communicationservice.addnewClientJourney === "addnewProject"){
                    this._communicationservice.clientSubjectId = res['clientId'];
                }
		            this._communicationservice.loader = false;
                    if(res.hasOwnProperty('isErrorPresent')) {
                        this.cancelReload = true;
                    }else{
                        this.cancelReload = false;
                    }
                }
            }else {
                if(res['statusCode'] === 401){
                    this.router.navigateByUrl('/login');
                }else{
                    this._communicationservice.loader = false;
                // this.display_message_for_client_add = true;
                // this.message =  res['message'];
                this._communicationservice.backendError = true;
                }
            }
            })
        }
    }
    Update(data) {
         if (this.form.invalid) {
            this.formerror = true;
        }
        else {
            //console.log("=========="+JSON.stringify(data))
            data.actionType = "update";
            data.updateId = this.idForupdate;
            data.updatedBy = sessionStorage.getItem('userid');
            console.log("==========update ka data  " + JSON.stringify(data))
            
            this._communicationservice.loader = true;
            this._commonNodeCallService.UpdateClient(data).subscribe(res => {
                console.log(res);
                if (res['success']) {
		            this._communicationservice.loader = false;
                    this.display_message_for_client_add = true;
                    this.message = res['message'];
                    if(res.hasOwnProperty('isErrorPresent')) {
                        this.cancelReload = true;
                    }else{
                        this.cancelReload = false;
                    }
                }else{
                    if(res['statusCode'] === 401){
                        this.router.navigateByUrl('/login');
                    }else{
                        this._communicationservice.backendError = true;
                    setTimeout(()=>{    //<<<---    using ()=> syntax
                    this.onEditData(this.idForupdate)                             
                   }, 3000);
                    }
                }
            })
        }
    }
    Cancel() {
        this._communicationservice.backendError = false;
        while (this.Parameter.length !== 0) {
            this.Parameter.removeAt(0)
        }
        this.form.reset();
          this.formerror= false;
        this._communicationservice.ClientEdit(false);
    }

    get clientName() {
        return this.form.get('clientName');
    }
    get contactName() {
        return this.form.get('contactName');
    }
    get designation() {
        return this.form.get('designation');
    }
    get email() {
        return this.form.get('email');
    }
    get cityName() {
        return this.form.get('cityName');
    }
    get spacesName() {
        return this.form.get('spacesName');
    }
    get industryName() {
        return this.form.get('industryName');
    }
    get categoryName() {
        return this.form.get('categoryName');
    }
     // get clientAddress() {
    //     return this.form.get('clientAddress');

    // }
	
    get mobileno() {
        return this.form.get('mobileno');
    }
    get stateName() {
        return this.form.get('stateName');
    }
    get address1() {
        return this.form.get('address1');
    }
    get address2() {
        return this.form.get('address2');
    }
    get pincode() {
        return this.form.get('pincode');
    }
  okMessageForClientAdd() {
    this._communicationservice.backendError = false;     
        this.display_message_for_client_add = false;
        if(this._communicationservice.addnewClientJourney !== "addnewProject"){
            if(this.cancelReload === false) {
                window.location.reload();
            }
        }else{
            // saving TRUE to subject for ADD NEW PROJECT
            if(!this.edit && this.cancelReload === false){
                this._communicationservice.checkClient(true);
            }
            this._communicationservice.backendError = false;
            while (this.Parameter.length !== 0) {
                this.Parameter.removeAt(0)
             }
            this.form.reset();
            this.formerror= false;
            this._communicationservice.ClientEdit(false);
        }
        
    }
    removeParam() {
        while (this.Parameter.length !== 0) {
            this.Parameter.removeAt(0)
        }
    }

    onEditData(data){
        this.idForupdate = data;
                console.log("param operation" + JSON.stringify(data))
                this.Plus = true;
                this.edit = true;
                this._commonNodeCallService.GetDataForEdit(data).subscribe(res => {
                    if(res['success']){
                    this._communicationservice.backendError = false;
                        var getClientdata = res['results'][0];
                        this.ClientAddress = getClientdata.clientaddr;
                        var objCategory = { label: getClientdata.categoryname, id: getClientdata.categoryid }
                        var objcity = { label: getClientdata.cityname, id: getClientdata.cityid }
                        var objtypeofspace = { label: getClientdata.spacename, id: getClientdata.spaceid }
                        var objIndustry = { label: getClientdata.industryname, id: getClientdata.industryid }
                        var objDesig = { label: getClientdata.contactdetailsdesig, id: getClientdata.designationid }
    
                        var objState = { label: getClientdata.state, id: getClientdata.stateid }
                        var address2Db = getClientdata.address2
                        if(getClientdata.address2 === "null"){
                            address2Db = '';
                        }
                        this.form.patchValue({
                            clientName: getClientdata.clientname,
                            categoryName: objCategory,
                            cityName: objcity,
                            spacesName: objtypeofspace,
                            industryName: objIndustry,
                            stateName: objState,
                            address1: getClientdata.address1,
                            address2: address2Db,
                            pincode: getClientdata.pincode
                        });
                        while (this.Parameter.length !== 0) {
                            this.Parameter.removeAt(0)
                        }
    
                        for (var i = 0; i < res['results'][0].ContactArray.length; i++) {

                            var email = res['results'][0].ContactArray[i].contactdetailsemail;
                            if (res['results'][0].ContactArray[i].contactdetailsemail === "null"){
                                email = ''
                            }
                            var mobile = res['results'][0].ContactArray[i].contactdetailsmobile;
                            if (res['results'][0].ContactArray[i].contactdetailsmobile === "null"){
                                mobile = ''
                            }
                            const parameter0 =
                                this._formbuilder.group({
                                    // contactName: res['results'][0].ContactArray[i].contactdetailsnm,
                                    // designation: res['results'][0].ContactArray[i].desObj,
                                    // email: email,
                                    // mobileno: mobile
                                    contactName: [res['results'][0].ContactArray[i].contactdetailsnm,[Validators.required,Validators.pattern(this._communicationservice.pattern.onlycharWithSpace)]],
                                    designation: res['results'][0].ContactArray[i].desObj,
                                    email: [email,[Validators.pattern(this._communicationservice.pattern.emailAddress)]],
                                    mobileno: [mobile,[Validators.pattern(this._communicationservice.pattern.mobileNo)]],
                                })
                            this.Parameter.push(parameter0);
                            console.log("param operation" + JSON.stringify(parameter0.value))
                        }
                        this._communicationservice.loader = false;
                    }else{
                        if(res['statusCode'] === 401){
                            this.router.navigateByUrl('/login');
                        }else{
                            this._communicationservice.backendError = true;
                        }
                    }
                    
                });
    }

    callDelete(){
        this.Parameter.removeAt(this.clientDeleteIndex);
        this.display =false;
    }
    closeDialog(){
        this.display =false;
    }
}


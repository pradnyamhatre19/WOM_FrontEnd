import { Component, OnInit } from '@angular/core';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { FormGroup, FormControl, Validators } from 'node_modules/@angular/forms';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';


export class labelId {
	label: string
	id: number
}
export class Multiselect {
	id: number
	name: string
}
@Component({
	selector: 'app-vendor-screen',
	templateUrl: './vendor-screen.component.html',
	styleUrls: ['./vendor-screen.component.css']
})
export class VendorScreenComponent implements OnInit {
	cityoperations1;
	category1;


	dropdownList: Multiselect[] = [];
	display_message_for_vendor_add: Boolean;
	message;
	myarr = [];
	myarr1 = [];
	MydropdownList: SelectItem[];
	dropdownList1 = [];

	// autocomplete dropdown for country
	getcountry: labelId[] = [];
	filteredcountry: labelId[] = [];

	// autocomplete dropdown for state
	getstate: labelId[] = [];
	filteredstate: labelId[] = [];


	// autocomplete dropdown for city
	cityresults: labelId[] = [];
	filteredcity: labelId[] = [];

	Category;
	City;
	ContactName;
	ContactNumber;
	VendorName;
	Address;
	edit = false;
	idForupdate;
	duplicatevendor :boolean = false;


	form = new FormGroup({
		vendorName: new FormControl('', [Validators.required,Validators.pattern(this._communicationservice.pattern.onlycharWithSpace)]),
		address1: new FormControl('', [Validators.required,Validators.pattern(this._communicationservice.pattern.alphanumericWithSpacehyphen)]),
		address2: new FormControl('',Validators.pattern(this._communicationservice.pattern.alphanumericWithSpacehyphen)),
		//countryName: new FormControl('', [Validators.required]),
		stateName: new FormControl('', [Validators.required]),
		homeCity: new FormControl('', [Validators.required]),
		pincode: new FormControl('', [Validators.required, Validators.pattern(this._communicationservice.pattern.pincode)]),
		cityoperations: new FormControl('', [Validators.required]),
		contactName: new FormControl('', [Validators.required, Validators.pattern(this._communicationservice.pattern.onlycharWithSpace)]),
		contactNo: new FormControl('', [Validators.required,Validators.minLength(10), Validators.pattern(this._communicationservice.pattern.numeric)]),
		gstin: new FormControl('', [Validators.required, Validators.pattern(this._communicationservice.pattern.gstin)]),
		category: new FormControl('', []),
		siteCapacity: new FormControl('',Validators.pattern(this._communicationservice.pattern.numeric)),
		workforce: new FormControl('',Validators.pattern(this._communicationservice.pattern.numeric))
	})

	dropdownSettings = {
		singleSelection: false,
		idField: 'id',
		textField: 'name',
		selectAllText: 'Select All',
		unSelectAllText: 'UnSelect All',
		itemsShowLimit: 1,
		allowSearchFilter: true
	};

	constructor(public _communicationservice: CommunicateService,
		private _commonNodeCallService: CommonCallService,
		private router:Router) {
		this._communicationservice.backendError = false;
	}
	filtercountry(event) {
		this.filteredcountry = this.getcountry
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}
	countryDropdown() {
		this.filteredcountry;
	}

	filterstate(event) {
		if (this.getstate == null) { console.log("do nothing!!"); this.filteredstate = null } else {
			this.filteredstate = this.getstate
				.filter(data => data.label.toString()
					.toLowerCase()
					.indexOf(event.query.toString().toLowerCase()) !== -1);
		}
	}
	stateDropdown() {
		console.log("this.filteredstate", this.filteredstate)
		this.filteredstate;
	}

	filtercity(event) {
		if (this.cityresults == null) { console.log("do nothing"); this.filteredcity = null } else {
			console.log("this.cityresults", this.cityresults)
			this.filteredcity = this.cityresults
				.filter(data => data.label.toString()
					.toLowerCase()
					.indexOf(event.query.toString().toLowerCase()) !== -1);
		}
	}

	cityDropdown() {
		console.log("this.filteredcity", this.filteredcity)
		this.filteredcity;
	}

	ngOnInit() {
		this.getDropdowns();
		this._communicationservice.vendorData.subscribe(data => {
			console.log("here=========================" + JSON.stringify(data))
			if (data == "") {
				this.edit = false;
				this.form.patchValue({
					vendorName: "",
					//countryName: "",
					stateName: "",
					homeCity: "",
					pincode: "",
					cityoperations: [],
					contactName: "",
					contactNo: "",
					gstin: "",
					category: [],
					siteCapacity: "",
					workforce: "",
					address1: "",
					address2: ""
				});
			} else {
				this.edit = true;
				this.idForupdate = data;
				this._commonNodeCallService.GetVendorDataForEdit(data).subscribe(res => {
					if(res['success']){
						this._communicationservice.backendError = false;
						var formData = res['results'][0]
						this.form.patchValue({
							vendorName: formData.vendorName,
							//countryName: formData.countryName,
							stateName: formData.state,
							homeCity: formData.homeCity,
							pincode: formData.pincode,
							cityoperations: formData.cityOfOperations,
							contactName: formData.contactName,
							contactNo: formData.contactNo,
							gstin: formData.gstin,
							category: formData.catNameArray,
							siteCapacity: formData.siteCapacity,
							workforce: formData.workforce,
							address1: formData.address1,
							address2: formData.address2
						})
					}else{
						if(res['statusCode'] === 401){
							this.router.navigateByUrl('/login');
						}else{
							this._communicationservice.backendError = true;
						}
					}
					this._communicationservice.loader = false;
				})
			}
		})
	}

	showState(evt) {
		var data = { "id": evt.id, "actionType": 'showState' }
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
	}

	showCity(evt) {
		this.form.patchValue({
			homeCity:''
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
	onItemSelect(item: any) {
		this._commonNodeCallService.GetCategoryListing().subscribe(res => {
			if(res['success']){
				this._communicationservice.backendError = false;
				if(res['results'].length > 0){
					for (var i = 0; i < res['results'].length; i++) {
						let obj = {}
						obj['id'] = res['results'][i].id;
						obj['name'] = res['results'][i].name;
						this.myarr1.push(obj)
					}
					this.dropdownList1 = this.myarr1;
				}
			}else{
				this._communicationservice.backendError = true;
			}
		})
	}
	onSelectAll(items: any) {
		console.log(items);
	}

	formerror: boolean = false;
	Submit(data) {
		this.formerror = false;
		if (this.form.invalid) {
			this.formerror = true;
		}else {
			this._communicationservice.loader = true;
			data.actionType = "submit";
			data.userId = sessionStorage.getItem('userid');
			//data.status = "active"
			this._communicationservice.loader = true;
			//console.log("data===", data)
			this._commonNodeCallService.AddVendor(data).subscribe(res => {
				//console.log(res);
				if (res['success']) {
				this.duplicatevendor = false;
				this._communicationservice.backendError = false;
					console.log("details added in clientmaster table");
					this.display_message_for_vendor_add = true;
					this.message = res['message'];
				}else{
					if(res['isErrorPresent']){
					this.duplicatevendor = true;
						this.message = res['message'];
					}else{
						if(res['statusCode'] === 401){
							this.router.navigateByUrl('/login');
						}else{
					this._communicationservice.backendError = true;
						}
					}
				}
			this._communicationservice.loader = false;
			})
		}
	}
	Update(data) {
		data.actionType = "update";
		data.userId = sessionStorage.getItem('userid');
		data.updateId = this.idForupdate;
		this._communicationservice.loader = true;
		this._commonNodeCallService.UpdateVendor(data).subscribe(res => {
			this._communicationservice.loader = false;
			if (res['success']) {
				this.duplicatevendor = false;
				this._communicationservice.backendError = false;
				this.display_message_for_vendor_add = true;
				this.message = res['message'];
			}else{
				if(res['isErrorPresent']){
					this.duplicatevendor = true;
					this.message = res['message'];
				}else{
					if(res['statusCode'] === 401){
						this.router.navigateByUrl('/login');
					}else{
						this._communicationservice.backendError = true;
					}
				}
			}
			this._communicationservice.loader = false;
		})
	}

	Cancel() {
		this._communicationservice.backendError = false;
		this._communicationservice.loader = false;
		this.edit = false;
		this.duplicatevendor = false;
		this._communicationservice.VendorCancel(false);
		this.form.reset();
	}

	get vendorName() {
		return this.form.get('vendorName');
	}
	// get countryName() {
	// 	return this.form.get('countryName');
	// }
	get stateName() {
		return this.form.get('stateName');
	}
	get homeCity() {
		return this.form.get('homeCity');
	}
	get pincode() {
		return this.form.get('pincode');
	}
	get cityoperations() {
		console.log("cityoperations===>", this.form.get('cityoperations').value);
		return this.form.get('cityoperations');
	}
	get contactName() {
		return this.form.get('contactName');
	}
	get contactNo() {
		return this.form.get('contactNo');
	}
	get gstin() {
		return this.form.get('gstin');
	}
	get category() {
		return this.form.get('category');
	}
	get siteCapacity() {
		return this.form.get('siteCapacity');
	}
	get workforce() {
		return this.form.get('workforce');
	}
	get address1() {
		return this.form.get('address1');
	}
	get address2() {
		return this.form.get('address2');
	}
	okMessageForVendorAdd() {
		this.duplicatevendor = false;
		this.display_message_for_vendor_add = false;
		window.location.reload();
	}

	onCityOfOprrationsSelect(item: any){
		this._commonNodeCallService.GetCity().subscribe(res => {
			if(res['success']){
				this._communicationservice.backendError = false;
				if(res['results'].length > 0){
					console.log("res['results'][0]", res['results'])
					for (var i = 0; i < res['results'].length; i++) {
						this.myarr.push(res['results'][i])
					}
					this.dropdownList = this.myarr;
				}
			}else{
				this._communicationservice.backendError = true;
			}
		});
	}
	getDropdowns() {
		//Getting city of operation from databse
		this._commonNodeCallService.GetCity().subscribe(res => {
			console.log("res['results'][0]", res['results'])
			for (var i = 0; i < res['results'].length; i++) {
				this.myarr.push(res['results'][i])
			}
			this.dropdownList = this.myarr;
		});

		//Getting MultiSelect Category Fromdatabase 
		this._commonNodeCallService.GetCategoryListing().subscribe(res => {
			if(res['success']){
				this._communicationservice.backendError = false;
				if(res['results'].length > 0){
					for (var i = 0; i < res['results'].length; i++) {
						let obj = {}
						obj['id'] = res['results'][i].id;
						obj['name'] = res['results'][i].name;
						this.myarr1.push(obj)
					}
					this.dropdownList1 = this.myarr1;
				}
			}else{
				this._communicationservice.backendError = true;
			}
			
		})
		// getting Country from databse
		// this._commonNodeCallService.GetCountry().subscribe(res => {
		//   if (res['results'] != "") {
		//     this.getcountry=[]
		//     res['results'].forEach(element => {
		//       this.getcountry.push({ label: element.name, id: element.id });
		//     });
		//   }
		// });

		var data = { "id": 1, "actionType": 'showState' } //id 1 is for 'India'
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
	}

	demo(data) {
		console.log("data", data);
	}
	onkeyDownAllFields(){
		this.duplicatevendor = false;
	}
}

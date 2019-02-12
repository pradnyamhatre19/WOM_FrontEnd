import { Component, OnInit, ViewChild } from '@angular/core';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { VendorScreenComponent } from '../vendor-screen/vendor-screen.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-vendor-listing',
	templateUrl: './vendor-listing.component.html',
	styleUrls: ['./vendor-listing.component.css']


})
export class VendorListingComponent implements OnInit {
	@ViewChild('getDropdowns') getDropdowns: VendorScreenComponent

	constructor(public _communicationservice: CommunicateService,
		private _commonNodeCallService: CommonCallService, private router: Router) {
		var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
		sessionStorage.setItem('selectedFunctionality', 'Vendors Master');
		if (!privillageArray) {
			this.router.navigateByUrl('/login');
		}
		this._communicationservice.backendError = false;
	}
	vendorLength;
	cols: any[];
	vendors: any[] = [];
	edit = false;
	displayDialog: boolean;

	objdelete = {};
	displayopenclose: boolean;
	isEdit = false;
	isListing = false;
	isDelete = false;
	isAdd = false;
    norecords: boolean = false;
	message;
	vendorpresent :boolean =false;

	ngOnInit() {
		this._communicationservice.loader = true;
		this._commonNodeCallService.GetVendorList().subscribe(res => {
			this._communicationservice.loader = false;
			if(res['success']){
				if (res['results'].length > 0) {
					var abc = [];
					res['results'].forEach(element => {
						this.vendors.push({
							VendorName: element.name, Id: element.id,
							ContactName: element.contactName,
							ContactNumber: element.contactNo,
							City: element.cityOfOperations,
							Category: element.catFinalArray,
							Action: ""
						});
					});
					this.vendorLength = this.vendors.length;
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
			{ field: 'VendorName', header: 'Vendor Name', width: '10%' },
			{ field: 'ContactName', header: 'Contact Name', width: '10%' },
			{ field: 'ContactNumber', header: 'Contact Number', width: '10%' },
			{ field: 'City', header: 'City Of Operations', width: '10%' },
			{ field: 'Category', header: 'Category', width: '10%' },
			{ field: 'Action', header: 'Action', width: '15%' }
		];

		this._communicationservice.vendorcancel.subscribe(data => {
			if (data == false) {
				this.displayaddnewvariant = false;
				this.edit = false;
			}
		})
		this._communicationservice.vendorUpdate.subscribe(data => {
			if (data == false) {
				this.edit = false;
				this.displayDialog = false;
			}
		})
		this._communicationservice.vendorSubmit.subscribe(data => {
			if (data == false) {
				this.displayaddnewvariant = false;
			}
		})
	}
	ngDoCheck() {
		var pageName = sessionStorage.getItem('selectedFunctionality')
		//console.log("pageName",pageName)
		var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
		//console.log("privillageArray",privillageArray)
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
	// editVendorData(index) {
	//   //this.getDropdowns.getDropdowns();
	//   this.edit = true;
	//   this.displayaddnewvariant = true
	//   this._communicationservice.vendordata(this.vendors[index].Id);
	// }
	onItemSelect(item: any) {
		console.log(item);
	}
	onSelectAll(items: any) {
		console.log(items);
	}

	Close() {
		this.displayDialog = false;
	}
	closeAdd() {
		this.displayaddnewvariant = false;
	}
	// delete(data) {
	//   this.objdelete = { id: this.vendors[data].Id }
	//   this.displayopenclose = true;
	// }

	displayaddnewvariant: boolean;

	showOpenCloseDialog() {
		this._commonNodeCallService.DeleteVendor(this.objdelete).subscribe(res => {
			console.log(res);
			if (res['success']) {
				this.message= res['message'];
				console.log("vendor  details are deleted")
				this.vendorpresent = false;
				this.displayopenclose = false;
				this.display_message_for_delete = true;
			}else if(res['vendorpresent']){
				this.displayopenclose = false;
				this.display_message_for_delete = true;
				this.vendorpresent = true;
			}else{
				if(res['statusCode'] === 401){
					this.router.navigateByUrl('/login');
				}else{
					this._communicationservice.backendError = true;
					this.displayopenclose =false;
				// this._communicationservice.backendError = true;
				}
			}
		})

	}
	closeOpenCloseDialog() {
		this.displayopenclose = false;
	}
	// delete message pop-up
	display_message_for_delete: boolean;

	okMessageForDelete() {
		this._communicationservice.backendError = false;
		this.display_message_for_delete = false;
		window.location.reload();
	}
	close_display_message_for_delete(){
		this._communicationservice.backendError = false;
		this.display_message_for_delete = false;
	}
	showDialogToAdd() {
		this._communicationservice.vendordata("");
		//this._communicationservice.getMultiselect("");
		this.displayaddnewvariant = true;
		this.getDropdowns.getDropdowns();
	}
	delete(dt, index) {
		const vendorData = dt.filteredValue ? dt.filteredValue : this.vendors;
		console.log("vendorData id", vendorData[index].Id);
		this.objdelete = { id: vendorData[index].Id }
		this.displayopenclose = true;
	}

	editVendorData(dt, index) {
		const vendorData = dt.filteredValue ? dt.filteredValue : this.vendors;
		console.log("vendorData id", vendorData[index].Id);
		this.edit = true;
		this.displayaddnewvariant = true
		this._communicationservice.vendordata(vendorData[index].Id);
	}
}

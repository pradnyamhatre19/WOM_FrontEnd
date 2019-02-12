import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { Component, OnInit } from '@angular/core';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { Router } from '@angular/router';

@Component({
	selector: 'boqlisting',
	templateUrl: './boqlisting.component.html',
	styleUrls: ['./boqlisting.component.css']
})
export class BOQListingComponent implements OnInit {

	boqlength;
	BOQ;
	norecords;
	cols;
	displayaddnewvariant;
	onEdit;
	gotPrivillages ;
	message;
	constructor(private _commonNodeCallService: CommonCallService, private router: Router, public _communicateService: CommunicateService) {
		this.gotPrivillages = false;
		var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
      	sessionStorage.setItem('selectedFunctionality', 'BOQ List');
      	if(!privillageArray){
        this.router.navigateByUrl('/login');
		  }
		  this._communicateService.backendError = false;
	}
	pId;
	isEdit = false;
	isListing = false;
	isDelete = false;
	isAdd = false;
	sessionData
	pdfIndex;
	viewonly = false;
	ngOnInit() {
		//console.log("=in ngOnInit================>>>>>>>>>>==>")
		this._communicateService.loader = true;
		this.pdfGen = false;
		this._communicateService.boqcancel.subscribe(data => {
			if (data == false) {
				this.onEdit = false;
				this.displayaddnewvariant = false;
			}
		})
		this.BOQ = [];
		//this.pId = this._communicateService.projectSpecificBOQData['id'];
		this.sessionData=  JSON.parse( sessionStorage.getItem('projectDetails'));
		this.pId = this.sessionData['id'];
		//console.log("pId==",this.pId)
		this._commonNodeCallService.GetBOQListing(this.pId).subscribe(res => {
			if(res['success']){
				this._communicateService.backendError = false;
				if (res['results'].length > 0) {
					let counter = 0;
					res['results'].forEach(element => {
						var empObj = {
							"BOQName": element.BOQ_name,
							"id": element.id,
							"status":element.finalize_status
						};
						if(element.finalize_status === 'final') {
							this.pdfIndex = counter;
							this.sessionData['finalize'] = true; 
							sessionStorage.setItem("projectDetails", JSON.stringify(this.sessionData));
							this.viewonly = true;
						}
						counter++;
						this.BOQ.push(empObj);
					})
					console.log(this.pdfIndex)
					console.log(this.BOQ);
				this.boqlength = this.BOQ.length;
				}
			}else{
				if(res['statusCode'] === 401){
					this.router.navigateByUrl('/login');
				}else{
					this._communicateService.backendError = true;
				}
			}
			this._communicateService.loader = false;			
		})
		this.cols = [
			{ field: 'BOQName', header: 'BOQ Name', width: '15%' },
			{ field: 'Action', header: 'Action', width: '15%' }
		];
	}

	ngDoCheck(){
		var pageName = sessionStorage.getItem('selectedFunctionality')
		var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
		if (privillageArray.length > 0) {
			for (var i = 0; i < privillageArray.length; i++) {
				var funObj = privillageArray[i];
				//console.log("funObj", funObj)
				if (funObj.fname === pageName) {
					// console.log("matched==", funObj.fname)
					if (funObj.pr_add === 1) {
						if(this.sessionData['ProjectJourney'] !== undefined && this.sessionData['ProjectJourney'] === 'Planning') {
							this.isAdd = false;
						}else{
							this.isAdd = true;
						}
					}
					if (funObj.pr_delete) {
						this.isDelete = true;
					}
					if (funObj.pr_edit) {
						if(this.pdfIndex === undefined) {
							this.isEdit = true;
						}
					}
					if (funObj.pr_listing) {
						this.isListing = true;
					}
				}
			}
		}
	}

	showDialogToAdd() {
		this._communicateService.BOQAdd = true;
		this._communicateService.BOQEdit = false;
		this._communicateService.saveData("");
		this.displayaddnewvariant = true;
	}
	
	editEmployeeData(data) {
		this._communicateService.BOQEdit = true;
		this._communicateService.BOQAdd = false;
		this._communicateService.saveData(data);
		this.displayaddnewvariant = true;
	}
	/**Added by Amol */
	delete(index,data) {
		// this.objdelete = {id: this.BOQ[data].id};
		console.log(data);
		let tempObj = data.value[index].id;
		console.log(tempObj)
		this.storeindex = tempObj;
		this.deleteFromList = true;
	}
	deleteFromList;
	storeindex;
	display_message_for_delete = false;
	deleteFromBoQList() {
		this.deleteFromList = false;
		var data = { "id": this.storeindex }
		this._commonNodeCallService.DeleteBOQ(data).subscribe(res => {
			console.log(" after delete res==", res)
			if(res['success']){
			this._communicateService.backendError = false;
				this.display_message_for_delete = true
				this.message =res['message']
			}else{
				if(res['statusCode'] === 401){
					this.router.navigateByUrl('/login');
				}else{
					this._communicateService.backendError = true;                        
				}
			}
		})
	}

	okMessageForDelete(){
		this._communicateService.backendError = false;
		this.display_message_for_delete = false;
		window.location.reload();
	}

	closedeleteBoQListDialog() {
		this.deleteFromList = false;
	}
	employees: any[]=[];
	editBOQData(index,data) {
		let tempObj = {};
		tempObj['boqId'] = this.BOQ[index].id;
		tempObj['boqName'] = data.value[index].BOQName
		//console.log(this.BOQ[index].name)
		//console.log(data)
		sessionStorage.setItem('boqDetails',JSON.stringify(tempObj));
		//console.log('Edit BoQ Index', data);
		this._communicateService.saveData(this.BOQ[index].id);
		//console.log("checking clicked id=====>" + this.BOQ[index].id);
		this._communicateService.loader = true;
        this.displayaddnewvariant = true;
	}

	viewBOQDetails(index,data) {
		let tempObj = {};
		tempObj['boqId'] = this.BOQ[index].id;
		tempObj['boqName'] = data.value[index].BOQName;
		sessionStorage.setItem('boqDetails',JSON.stringify(tempObj));
		this._communicateService.saveData(this.BOQ[index].id);
		this._communicateService.loader = true;
        this.displayaddnewvariant = true;
	}

		/**BOQ Detail Page  */

		isBOQDetail = true;
		// BOQDetailPage(index,data) {
		// 	let tempObj = {};
		// 	tempObj['boqId'] = this.BOQ[index].id;
		// 	tempObj['boqName'] = data.value[index].BOQName
		// 	tempObj['BoqDetailAction'] = 'Edit';
		// 	console.log(this.BOQ[index].name)
		// 	console.log(tempObj
		// 		)
		// 	sessionStorage.setItem('boqDetails',JSON.stringify(tempObj));
		// 	// this.router.navigate(['/Project/BOQ/BOQDetailPage/create_project_estimate'])
		// }

		BOQDetailPage(data) {
			console.log("data",data)
			console.log("index",data.data.id)
			console.log("BOQName",data.data.BOQName)
			let tempObj = {};
			tempObj['boqId'] = data.data.id;
			tempObj['boqName'] = data.data.BOQName
			tempObj['BoqDetailAction'] = 'Edit';
			console.log(tempObj)
			sessionStorage.setItem('boqDetails',JSON.stringify(tempObj));
			this.router.navigate(['/Project/BOQ/BOQDetailPage/create_project_estimate'])
		}
		pdfGen = false;
		s3pdflink 
		
		callPdfGen(index, data) {
		console.log(data);
		let objData = {};
		this._communicateService.loader = true;
		objData['BOQName'] = data.value[this.pdfIndex]['BOQName'];
		objData['id'] = data.value[this.pdfIndex]['id'];
		this._commonNodeCallService.GeneratePDF(objData).subscribe(res => {
			console.log("res", res);
			if (res['statusCode'] === 200) {
				this.s3pdflink = res['result'];
				this._communicateService.loader = false;		
				this.pdfGen = true;
			} else {
				this._communicateService.loader = false;
			}
		});
	
	}

	closepdf() {
		console.log("closepdf==")
		//setTimeout(function () {
			var downld = this.downloadPdf()
		//	if(downld)
		  this.s3pdflink = "";
			this.pdfGen = false;
	//	}, 3000);
	}

	downloadPdf(){
		window.open('http://s3.amazonaws.com/wom-documents/' +this.s3pdflink, '_blank');
		return true
	}
		
}

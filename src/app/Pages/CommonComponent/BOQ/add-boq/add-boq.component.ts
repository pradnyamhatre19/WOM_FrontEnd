import { CommonCallService } from "src/app/services/CommonNodeCall/common-call.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormGroup,	Validators,	FormBuilder, FormArray } from "@angular/forms";
import { CommunicateService } from "src/app/services/Communication/communicate.service";
import { UploadfileService } from "src/app/services/FileUpload/uploadfile.service";
import { SpinnerVisibilityService } from "ng-http-loader";

// tslint:disable-next-line:class-name
export class labelid {
	label: string;
	id: number;
}

@Component({
	selector: "app-add-boq",
	templateUrl: "./add-boq.component.html",
	styleUrls: ["./add-boq.component.css"]
})
export class AddBOQComponent implements OnInit {
	form: FormGroup;
	displayaddnewvariant: boolean;
	selectedFiles: FileList; // created for fileUpload contain all files in array of Object format
	fileslist = {};
	fileupload = {};
	edit;
	filefromdb; // to store response object in edit mode
	updateModeFileupload = []; // created to store only files
	finalize:boolean = false;
	duplicateBoqName:boolean =false;
	message = '';
	editModeBoqName;

	// tslint:disable-next-line:max-line-length
	constructor(
		private router: Router,
		private formbuilder: FormBuilder,
		private _commonNodeCallService: CommonCallService,
		public _communicationService: CommunicateService,
		private uploadService: UploadfileService,
		private spinner: SpinnerVisibilityService
	) {
		this.fileupload = [];
		this.layout = []; // created to store edit journey layout object.
		this.DbRenderdata = []; // created to store edit journey Render object.
		this.DbsiteImagesdata = []; // created to store edit journey siteImage object.
		this.fileLenderArr = [];
		this.fileLenderArrlength = [];
		this._communicationService.backendError = false;
	}

	editJourney; // use to distinguish between wdit journey /Normal journey
	idForupdate;
	layout = []; // created to store edit journey layout object.
	DbRenderdata = []; // created to store edit journey Render object.
	DbsiteImagesdata = []; // created to store edit journey siteImage object.
	userId;
	projectDetailSession;//Project related data in session storage
	ngOnInit() {
		this.userId = sessionStorage.getItem('userid');
		this.projectDetailSession = JSON.parse(sessionStorage.getItem('projectDetails'));
		this.editJourney = false;
		this.form = this.formbuilder.group({
			Boqname: "",
			boqType: ["", [Validators.required]],
			Renderspace: this.formbuilder.array([this.createRenderSpace()]),
			Space: this.formbuilder.array([this.createSpace()]),
			SiteImages: this.formbuilder.array([this.createSite()]),
			Layout: this.formbuilder.array([this.createLayout()])
		});
		this.form.controls['Boqname'].enable();
		while (this.Layout.length !== 0) {
			this.Layout.removeAt(0);
		}

		while (this.Space.length !== 0) {
			this.Space.removeAt(0);
		}

		while (this.SiteImages.length !== 0) {
			this.SiteImages.removeAt(0);
		}

		while (this.Renderspace.length !== 0) {
			this.Renderspace.removeAt(0);
		}
		this._communicationService.subjectobj.subscribe(data => {
			if (data === "" || data === null) {
				this.edit = false;
				this.form.patchValue({
					Boqname: "",
					boqType: ""
				});
			} else {
				this.idForupdate = data;
				this.reloadDataById()
			}
		});
		
		this._commonNodeCallService.GetBOQTypes().subscribe(res => {
			if(res['success']){
                this._communicationService.backendError = false;				
                if(res['results'].length > 0){
                    res["results"].forEach(element => {
						this.BOQtyperesults.push({ label: element.type, id: element.id });
					});
					//console.log("boqTypeResult==",this.boqTypeResult)
                }
            }else{
                this._communicationService.backendError = true;                        
            }
		});

		this._commonNodeCallService.GetBOQSpaceListing().subscribe(res => {
			if(res['success']){
                this._communicationService.backendError = false;				
                if(res['results'].length > 0){
                    res["results"].forEach(element => {
						this.renderSpaceresult.push({
							label: element.space_name,
							id: element.id
						});
					});
					//console.log(this.boqSpaceType)
                }
            }else{
                this._communicationService.backendError = true;                        
            }
		});

		// this.renderSpaceresult = [{ label: 'Space 1', id: 1 }, { label: 'Space 2', id: 2 },
		// { label: 'Space 3', id: 3 }, { label: 'Space 4', id: 4 }];
		this._commonNodeCallService.GetSeatingSpaceListing().subscribe(res => {
			if(res['success']){
                this._communicationService.backendError = false;				
                if(res['results'].length > 0){
                    res["results"].forEach(element => {
						this.seatingSpaceresults.push({
							label: element.name,
							id: element.id
						});
					});
					// console.log("filteredSeatingSpacelist===============", this.filteredSeatingSpacelist)
                }
            }else{
                this._communicationService.backendError = true;                        
            }
		});
	}

	/**Get Method */
	get Boqname() {
		return this.form.get("Boqname");
	}
	get boqType() {
		return this.form.get("boqType");
	}
	get uploadfile() {
		return this.form.get("uploadfile");
	}
	get spacedetails() {
		return this.form.get("spacedetails");
	}
	/**get to add Space in render */
	get Renderspace(): FormArray {
		return this.form.get("Renderspace") as FormArray;
	}
	/**get to add Space in render */
	/**get to add multiple Space Details */
	get Space(): FormArray {
		return this.form.get("Space") as FormArray;
	}
	/**get to add multiple Space Details */
	/**Site Images */
	get SiteImages(): FormArray {
		return this.form.get("SiteImages") as FormArray;
	}
	get ProjectName() {
		return this.form.get("ProjectName");
	}
	/**Site Images */
	/**Layout */
	get Layout(): FormArray {
		return this.form.get("Layout") as FormArray;
	}
	/**Get Method */

	/**SUBMIT */
	// tslint:disable-next-line:member-ordering
	formerror = false;
	submit(data, action) {
		this.duplicateBoqName = false;
		this.initialCounterSubArrylst = 0;
		this.arrayListInitialCount = 0;
		// console.log("this.form", this.form.invalid);
		// console.log("data", data);
		if (this.form.invalid) {
			this.formerror = true;
		} else {
			data["actionType"] = action;
			if(this.idForupdate !== undefined) {
				data['boqId'] = this.idForupdate;
			}
			if(this.editJourney){
				data.Boqname = this.editModeBoqName;
				this.boqnm = this.editModeBoqName;
			}else{
				this.boqnm = this.Boqname.value;
			}
			data.userId= this.userId;
			this._communicationService.loader = true;
			let arraylist = Object.keys(this.fileupload); // ['Render' ,'SiteImages' ,'Layout']
			let ProjectData = JSON.parse(sessionStorage.getItem("projectDetails"));
			data["projectName"] = ProjectData.Name;
			data["projectId"] = ProjectData.id;
			this.Finaldata = data;
			this.ProjName = ProjectData.projectName;
			// this.ProjName = ProjectData.Name;
			if (arraylist.length > 0) {
				this.arrayListTotalCount = arraylist.length
				this.saveFile(this.fileupload[arraylist[0]], arraylist[0]);
			} else {
				this._communicationService.LoaderMsg = "Storing data into Database";
				console.log("BOQ data for DB");
				console.log(data);
				this.callDB(data);
			}
		}
	}

	Indleng: any; // ['0','2','3'] of fileupload['RenderGroup'],fileupload['SiteImages'],fileupload['Layout']
	Finaldata; //Form Data
	ProjName; //Project Name for Particular BOQ.
	initialCounterSubArrylst = 0;
	finalCounterSubArrylst;
	arrayListInitialCount = 0;
	arrayListTotalCount;
	onS3ErrorDeluploadFile = [];// created to delete files from s3 on error
	boqnm;// for file upload folder name

	saveFile(data, name) {
		const optParam = {};
		optParam["name"] = name;
		this.uploadService.FOLDER = "upload/Projects/" + this.ProjName + "/BOQ/" + this.boqnm + "/" + name + "/";
		this.Indleng = Object.keys(data)
		optParam["index"] = this.Indleng[0];
		optParam["finalCounter"] = this.arrayListInitialCount;
		let subArray = Object.keys(this.fileupload[name])
		let tempvar = this.fileupload[name][this.Indleng[0]];
		if (tempvar.length === undefined) {
			tempvar = Object.assign([], tempvar);
		}
		this.finalCounterSubArrylst = subArray.length;
		this.selectedFiles = tempvar;
		this.callS3Upload(optParam, this.selectedFiles);
	}

	callS3Upload(optParam, fileListCounter) {
		try{
			// added spinner manually
			this.spinner.show();
			this.uploadService.uploadfile(fileListCounter, optParam, res => {
			// added spinner manually
				this.spinner.hide();
				console.log("res===",res)
				if (res["success"]) {
						this.initialCounterSubArrylst++;
						for (let n = 0; n < res['respArray'].length; n++) {
							this.onS3ErrorDeluploadFile.push(res['respArray'][n].path);
						}
						const DataName = res["resName"];
						const counter = res["Counter"];
						if (DataName === "RenderGroup") {
							this.Renderspace.value[counter]["uploadfile1"] = res["respArray"];
						} else if (DataName === "SiteImages") {
							this.SiteImages.value[counter]["projectImages"] = res["respArray"];
						} else if (DataName === "Layout") {
							this.Layout.value[counter]["uploadfile"] = res["respArray"];
						}
						if (this.finalCounterSubArrylst === this.initialCounterSubArrylst) {
							this.initialCounterSubArrylst = 0;
							let arraylist = Object.keys(this.fileupload);
							++this.arrayListInitialCount;
							let datafrSaveFile
							if (arraylist[this.arrayListInitialCount] !== undefined) {
								datafrSaveFile = this.fileupload[arraylist[this.arrayListInitialCount]];
							}
							if (this.arrayListInitialCount !== this.arrayListTotalCount) {
								this.saveFile(datafrSaveFile, arraylist[this.arrayListInitialCount]);
							} else if (this.arrayListInitialCount === this.arrayListTotalCount) {
			
								this.callDB(this.Finaldata);
							}
						} else {
							let optParamdata = {};
							optParamdata["name"] = DataName;
							let tempvar = this.fileupload[DataName][this.Indleng[this.initialCounterSubArrylst]];
							if (tempvar.length === undefined) {
								tempvar = Object.assign([], tempvar);
							}
							this.selectedFiles = tempvar;
							optParamdata["index"] = this.Indleng[this.initialCounterSubArrylst];
							optParamdata["finalCounter"] = this.arrayListInitialCount;
							this.callS3Upload(optParamdata, this.selectedFiles);
						}
		
				} else {
					for (let l = 0; l < this.onS3ErrorDeluploadFile.length; l++) {
						let extaParam = {}
						extaParam['finalDeleteCounter'] = l;
						this.uploadService.deleteFile([], {}, this.onS3ErrorDeluploadFile[l], res => {
							if (res["success"]) {
								if (this.onS3ErrorDeluploadFile.length === res['finalDeleteCounter']) {
									this._communicationService.loader = false;
								}
								console.log("file Deleted Successfully");
							}else{
								this._communicationService.backendError = true;
							}
						});
					}
				}
			});
		}catch(e) {
			this._communicationService.loader = false;
			// this._communicationService.commonErrorPopup = true;
			// this._communicationService.redirect = false;
			//this._communicationService.commonErrorPopupMsg =  'Dynamic text';
			// this._communicationService.reDirectionURL = "/BoQList";
			//show error msg on same page without closing popups
			this._communicationService.backendError = true;
		}
	}

	deleteS3Arr = []; // delete path  
	callDB(data) {
		try{ 
		if (this.editJourney) {
			this.handleEditFileStoreage();
		}
		console.log("data====",data);
		if(data.hasOwnProperty('Layout')){
			if(data['Layout'] !== undefined && data['Layout'].length > 0){
				for(let i=data['Layout'].length-1;i >=0 ;i--){
					if(data['Layout'][i].uploadfile === ""){
							data['Layout'].splice(i,1);
					}
				}
			}
		}
		this._commonNodeCallService.SaveOrUpdateBOQ(data).subscribe(resData => {
			if (resData["success"]) {
			this._communicationService.backendError = false;
				if(resData.hasOwnProperty('result')){
					if(resData['result'].hasOwnProperty('BOQId')) {
						let sessionObj = {};
						sessionObj['boqId'] = resData['result'].BOQId;
						sessionObj['boqName'] = resData['result'].BOQName;
						sessionObj['BoqDetailAction'] = 'Add';
						sessionStorage.setItem('boqDetails',JSON.stringify(sessionObj));
					}
				}
				if (this.editJourney) {
					let Delete = Object.keys(this.delAwsDbfiles)
					if (Delete !== undefined) {
						if (Delete.length > 0) {
							for (let i = 0; i < Delete.length; i++) {
								for (let j = 0; j < this.delAwsDbfiles[Delete[i]].length; j++) {
									if (this.delAwsDbfiles[Delete[i]][j].hasOwnProperty('fileObj')) {
										this.deleteS3Arr.push(this.delAwsDbfiles[Delete[i]][j].fileObj.path);
									}
								}
							}
							this.delfrmAws();
						}else{
							this._communicationService.BoQcancel(false);
							this._communicationService.loader = false;
							this.router.navigateByUrl("/Project/BOQ/BOQDetailPage/create_project_estimate");
						}
					}
				} else {
					this._communicationService.loader = false;
					//sessionStorage.removeItem('ProjectDetails');
					this.router.navigateByUrl("/Project/BOQ/BOQDetailPage/create_project_estimate");
				}
			} else {
				if(resData['statusCode'] === 401){
					this.router.navigateByUrl('/login');
				}else{
					console.log("ERROR ==> inside success false");
			this.initialCounterSubArrylst = 0;
			this.arrayListInitialCount = 0;

			// clear the uploaded data on error from s3
				if(this.onS3ErrorDeluploadFile.length > 0){
					for (let l = 0; l < this.onS3ErrorDeluploadFile.length; l++) {
						let extaParam = {}
						extaParam['finalDeleteCounter'] = l;
						this.uploadService.deleteFile([], {}, this.onS3ErrorDeluploadFile[l], res => {
							if (res["success"]) {
								if (this.onS3ErrorDeluploadFile.length === res['finalDeleteCounter']) {
								console.log("file Deleted Successfully");
								}
							}else{
								this._communicationService.backendError = true;
							}
						});
					}
				}
			// ******** CHANGE TIME 20000 TO 2000 ****************************
			if (this.editJourney) {
				if(resData['statusCode'] === 500){
					// reload the page with edit mode data in it ==> EDIT MODE
					this._communicationService.backendError = true;
					setTimeout(() => {
					this._communicationService.loader = false;
						this.setAllEmpty();	
						this.reloadDataById();
					}, 2000);
				}else{
					// duplicate BOQ NAME ==> EDIT MODE
				this._communicationService.loader = false;
				this.message = resData['message'];
				this.duplicateBoqName = true; 
				}
				
			}else{
				if(resData['statusCode'] === 500){
					// reload the page to listing page ==> ADD MODE
					this._communicationService.backendError = true;
					setTimeout(() => {
				this._communicationService.loader = false;
					window.location.reload();															
					}, 2000);
				}else{
					// duplicate BOQ NAME ==> ADD MODE
				this._communicationService.loader = false;
				this.message = resData['message'];
				this.duplicateBoqName = true; 
				}
			}
				
				// this._communicationService.commonErrorPopup = true;
				// this._communicationService.redirect = false;
				//this._communicationService.commonErrorPopupMsg =  'Dynamic text';
				// this._communicationService.reDirectionURL = "/BoQList";
				//show error msg on same page without closing popup
				}
			}
		});
	}catch(e) {
		console.log("inside catch");
		console.log(e);
		this._communicationService.loader = false;
		this._communicationService.backendError = true;
		this.initialCounterSubArrylst = 0;
		this.arrayListInitialCount = 0;
		setTimeout(() => {
			this._communicationService.loader = false;
				window.location.reload();															
				}, 2000);
		// this._communicationService.commonErrorPopup = true;
		// this._communicationService.redirect = false;
		//this._communicationService.commonErrorPopupMsg =  'Dynamic text';
		// this._communicationService.reDirectionURL = "/BoQList";
	  }
	}

	delfrmAws() {
		this.uploadService.deleteFile({}, [], this.deleteS3Arr[0], res => {
			if (res["success"]) {
				this.deleteS3Arr.shift();
				if (this.deleteS3Arr.length === 0) {
					sessionStorage.removeItem("ProjectDetails");
					this._communicationService.loader = false;
					this._communicationService.BoQcancel(false);
					this.router.navigateByUrl("/Project/BOQ/BOQDetailPage/create_project_estimate");
				} else {
					this.delfrmAws();
				}
			} else {
				//Push the "this.deleteS3Arr" Array  in Db
				this._communicationService.loader = false;
			this._communicationService.backendError = true;
				// this._communicationService.BoQcancel(false);
				// this.router.navigateByUrl("/Project/BOQ/BOQDetailPage/create_project_estimate");
			}
		})
	}

	Cancel() {
		this.formerror= false;
		this._communicationService.backendError = false;
		this.fileupload = [];
		this.layout = []; // created to store edit journey layout object.
		this.DbRenderdata = []; // created to store edit journey Render object.
		this.DbsiteImagesdata = []; // created to store edit journey siteImage object.
		this.fileLenderArr = [];
		this.fileLenderArrlength = [];
		this.fileSiteArr = [];
		this.fileSiteArrlength = [];
		this.updateModeFileupload= [];
		while (this.Layout.length !== 0) {
			this.Layout.removeAt(0);
		}

		while (this.Space.length !== 0) {
			this.Space.removeAt(0);
		}

		while (this.SiteImages.length !== 0) {
			this.SiteImages.removeAt(0);
		}

		while (this.Renderspace.length !== 0) {
			this.Renderspace.removeAt(0);
		}
		this.editJourney = false;
		this.smallerDeleteFrom = '';
		this.dbImageItem = '';
		this.deleteFrom = '';
		this.storeindex = '';
		this.form.reset();
		this.form.controls['Boqname'].enable();
		this._communicationService.BoQcancel(false);
	}

	display;

	storeindex;
	deleteFrom;

	addRenderSpace() {
		const parameter = this.createRenderSpace();
		this.Renderspace.push(parameter);
	}
	createRenderSpace(): FormGroup {
		return this.formbuilder.group({
			fileName1: "",
			spacedetails: ["" ,[Validators.required]],
			uploadfile1: ""
		});
	}

	selectedItem2Delete: any; // created to store item data on popup of delete
	removeRenderSpace(index, item) {
		this.display = true;
		this.selectedItem2Delete = item;
		this.deleteFrom = "RenderGroup";
		this.storeindex = index;
	}
	deleteattachfile() {
		if(this.deleteFrom === 'LayoutAttachment'){
			this.removeLayoutNew(this.storeindex);
		}else if(this.deleteFrom === 'Space'){
			this.removeSpaceNew(this.storeindex);
		}
		else if(this.deleteFrom === "RenderGroup"){
			this.deleteattachfileNew();
		}else if(this.deleteFrom === "SiteImages"){
			this.deleteattachfileNew();
		}
		else if(this.smallerDeleteFrom === 'SiteImages'){
			this.deletefromDBnAWSNew('SiteImages',this.dbImageItem);
		}
		else if(this.smallerDeleteFrom === 'Layout'){
			this.deletefromDBnAWSNew('Layout',this.dbImageItem);
		}
		else if(this.smallerDeleteFrom === 'RenderGroup'){
			this.deletefromDBnAWSNew('RenderGroup',this.dbImageItem);
		}
		else if(this.smallerDeleteFrom === 'freshSiteImage'){
			this.deleteASiteImageFileNew(this.dbImageItem, this.storeindex)
		}
		else if(this.smallerDeleteFrom === 'freshRenderImage'){
			this.deleteARenderFileNew(this.dbImageItem, this.storeindex)
		}

	}
	closeDialog() {
		this.display = false;
	}
	/**File upload listing in render Screen */


	public hasBaseDropZoneOver: boolean = false;

	public hasAnotherDropZoneOver: boolean = false;

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	public fileOverAnother(e: any): void {
		this.hasAnotherDropZoneOver = e;
	}

	storePopContent;
	deleteConfirmationPopup(item) {
		this.display = true;
		this.storePopContent = item;
	}

	// tslint:disable-next-line:member-ordering
	public renderSpaceresult: labelid[] = [];
	// tslint:disable-next-line:member-ordering
	filteredRenderSpacelist: labelid[] = [];
	searchRenderSpace(event) {
		// console.log("checking event "+ event);
		this.filteredRenderSpacelist = this.renderSpaceresult.filter(
			data =>
				data.label
					.toString()
					.toLowerCase()
					.indexOf(event.query.toString().toLowerCase()) !== -1
		);
	}
	selectRenderdropdown() {
		// tslint:disable-next-line:no-unused-expression
		this.filteredRenderSpacelist;
	}
	/**File upload listing in render Screen */
	/**Space Details  */
	createSpace(): FormGroup {
		return this.formbuilder.group({
			seatingdetails: ["", Validators.required],
			noofSeat: ["", [Validators.required, Validators.pattern(this._communicationService.pattern.numeric)]]
		});
	}
	addSpace() {
		const parameter = this.createSpace();
		this.Space.push(parameter);
	}

	removeSpace(index) {
		this.display = true;
		this.deleteFrom = 'Space';
		this.storeindex = index;
		// this.Space.removeAt(index);
	}

	/**Space Details  */

	/**Site Images */
	createSite(): FormGroup {
		return this.formbuilder.group({
			projectName: [
				"",
				[
					Validators.required,
					Validators.minLength(3),
					
				]
			],
			projectImages: ""
		});
	}
	addSite() {
		const parameter = this.createSite();
		this.SiteImages.push(parameter);
	}
	removeSite(index) {
		this.deleteFrom = "SiteImages";
		this.display = true;
		this.storeindex = index;

	}
	/**Site Images */
	/**Layout  */
	createLayout(): FormGroup {
		return this.formbuilder.group({
			uploadfile: ""
		});
	}
	addLayout() {
		const parameter = this.createLayout();
		this.Layout.push(parameter);
	}
	removeLayout(index) {
		this.display = true;
		this.deleteFrom = 'LayoutAttachment';
		this.storeindex = index;
	}
	/**Layout  */

	/**File Upload */
	// tslint:disable-next-line:member-ordering
	fileLenderArr = [];
	// tslint:disable-next-line:member-ordering
	fileLenderArrlength;

	// tslint:disable-next-line:member-ordering
	fileSiteArr = [];

	// tslint:disable-next-line:member-ordering
	siteCounter = 0;

	// tslint:disable-next-line:member-ordering
	fileSiteArrlength = [];
	uploadfiledata(evt, index, Uploadfrom) {
		// tslint:disable-next-line:prefer-const
		if (Uploadfrom === "RenderGroup") {
			let Count = 0;
			if (
				this.fileLenderArr[index] !== undefined &&
				this.fileLenderArr[index].length !== 0
			) {
				let fileLength = this.fileLenderArr[index].length;
				for (let i = 0; i < evt.target["files"].length; i++) {
					if (
						this.fileLenderArr[index][Count].name !==
						evt.target["files"][i].name
					) {
						Count++;
						this.fileLenderArr[index][fileLength] = evt.target["files"][i];
						fileLength = this.fileLenderArr[index].length;
					}
					if (this.fileLenderArr[index].length > 0) {
						this.fileLenderArrlength[index] = true;
					}
				}
				this.fileupload["RenderGroup"][index] = Object.assign(
					{},
					this.fileLenderArr[index]
				);
			} else {
				if (this.fileupload["RenderGroup"] === undefined) {
					this.fileupload["RenderGroup"] = {};
				}
				this.fileupload["RenderGroup"][index] = evt.target["files"];
				this.fileLenderArr[index] = Array.from(evt.target["files"]);
				if (this.fileLenderArr[index].length > 0) {
					this.fileLenderArrlength[index] = true;
				}
			}
		} else if (Uploadfrom === "SiteImages") {
			let Count = 0;
			if (
				this.fileSiteArr[index] !== undefined &&
				this.fileSiteArr[index].length !== 0
			) {
				let fileLength = this.fileSiteArr[index].length;
				for (let i = 0; i < evt.target["files"].length; i++) {
					if (
						this.fileSiteArr[index][Count].name !== evt.target["files"][i].name
					) {
						Count++;
						this.fileSiteArr[index][fileLength] = evt.target["files"][i];
						fileLength = this.fileSiteArr[index].length;
					}
					if (this.fileSiteArr[index].length > 0) {
						this.fileSiteArrlength[index] = true;
					}
				}
				this.fileupload["SiteImages"][index] = Object.assign(
					{},
					this.fileSiteArr[index]
				);
			} else {
				if (this.fileupload["SiteImages"] === undefined) {
					this.fileupload["SiteImages"] = {};
				}
				this.fileupload["SiteImages"][index] = evt.target["files"];
				this.fileSiteArr[index] = Array.from(evt.target["files"]);
				if (this.fileSiteArr[index].length > 0) {
					this.fileSiteArrlength[index] = true;
				}
			}
		} else if (Uploadfrom === "layout") {
			if (this.fileupload["Layout"] === undefined) {
				this.fileupload["Layout"] = {};
			}
			this.fileupload["Layout"][index] = evt.target["files"];
		}
	}
	deleteARenderFile(file2DelInd, spaceIndex) {
		this.display = true;
		// always making whole (outer) Delete empty as it may conflict while deleting
		this.deleteFrom = '';
		this.smallerDeleteFrom = 'freshRenderImage';
		this.storeindex = spaceIndex;
		this.dbImageItem = file2DelInd;
	}
	deleteASiteImageFile(file2DelInd, spaceIndex) {
		this.display = true;
		// always making whole (outer) Delete empty as it may conflict while deleting
		this.deleteFrom = '';
		this.smallerDeleteFrom = 'freshSiteImage';
		this.storeindex = spaceIndex;
		this.dbImageItem = file2DelInd;
	}

	BOQtyperesults: labelid[] = [];

	filteredBOQ: labelid[] = [];
	searchBOQ(event) {
		this.filteredBOQ = this.BOQtyperesults.filter(
			data =>
				data.label
					.toString()
					.toLowerCase()
					.indexOf(event.query.toString().toLowerCase()) !== -1
		);
	}
	BOQDropdown() {
		this.filteredBOQ;
	}

	// Space Details
	// tslint:disable-next-line:member-ordering
	seatingSpaceresults: labelid[] = [];
	filteredSeatingSpace: labelid[] = [];
	searchSeatingSpace(event) {
		this.filteredSeatingSpace = this.seatingSpaceresults.filter(
			data =>
				data.label
					.toString()
					.toLowerCase()
					.indexOf(event.query.toString().toLowerCase()) !== -1
		);

	}
	seatingSpaceDropdown() {
		this.filteredSeatingSpace;
	}

	// tslint:disable-next-line:member-ordering
	delAwsDbfiles = {};
	dbImageItem;
	smallerDeleteFrom;

	deletefromDBnAWS(deletefrom, item) {
		this.display = true;
		// always making whole (outer) Delete empty as it may conflict while deleting
		this.deleteFrom = '';
		this.smallerDeleteFrom = deletefrom;
		this.dbImageItem = item;
	}
	deleteDbArr = [];
	
	handleEditFileStoreage() {
		//let executeOnce = true;
		if (this.Renderspace.value.length > 0) {
			for (let i = 0; i < this.Renderspace.value.length; i++) {
				if (
					this.updateModeFileupload["RenderGroup"] !== undefined &&
					this.updateModeFileupload["RenderGroup"].length > 0
				) {
					if (this.Renderspace.value[i]["uploadfile1"] === "") {
						this.Renderspace.value[i]["uploadfile1"] = [];
					}
					let paramData = this.Renderspace.value[i]["uploadfile1"];
					if (this.updateModeFileupload["RenderGroup"][i] !== undefined) {
						let tempArray = this.updateModeFileupload["RenderGroup"][i];
						for (let j = 0; j < tempArray.length; j++) {
							paramData.push(tempArray[j].fileObj);
						}
					}
					this.Renderspace.value[i]["uploadfile1"] = paramData;
				}
			}
		}

		if (this.SiteImages.value.length > 0) {
			for (let i = 0; i < this.SiteImages.value.length; i++) {
				if (
					this.updateModeFileupload["SiteImages"] !== undefined &&
					this.updateModeFileupload["SiteImages"].length > 0
				) {
					if (this.SiteImages.value[i]["projectImages"] === "") {
						this.SiteImages.value[i]["projectImages"] = [];
					}
					let paramData = this.SiteImages.value[i]["projectImages"];
					if (this.updateModeFileupload["SiteImages"][i] !== undefined) {
						let tempArray = this.updateModeFileupload["SiteImages"][i];
						for (let j = 0; j < tempArray.length; j++) {
							paramData.push(tempArray[j].fileObj);
						}
					}
					this.SiteImages.value[i]["projectImages"] = paramData;
				}
			}
		}
		if (this.Layout.length > 0) {
			if (this.Layout.value[0].uploadfile === "") {
				this.Layout.value.pop(0);
			}
			if (
				this.updateModeFileupload["Layout"] !== undefined &&
				this.updateModeFileupload["Layout"].length > 0
			) {
				let tempArray = this.updateModeFileupload["Layout"];
				for (let j = 0; j < tempArray.length; j++) {
					var obj = {};
					var arr = [];
					arr.push(tempArray[j].fileObj);
					obj["uploadfile"] = arr;
					this.Layout.value.push(obj);
				}
			}
		} else {
			if (
				this.updateModeFileupload["Layout"] !== undefined &&
				this.updateModeFileupload["Layout"].length > 0
			) {
				let tempArray = this.updateModeFileupload["Layout"];
				for (let j = 0; j < tempArray.length; j++) {
					if (this.Layout.value[j] === undefined) {
						this.Layout.value[j] = [];
					}
					this.Layout.value[j]["uploadfile"].push(tempArray[j].fileObj);
				}
			}
		}
	}
// modification done for adding pop up
	removeLayoutNew(index) {
		this.display = false;
		this.Layout.removeAt(index);
		if (this.fileupload.hasOwnProperty("Layout")) {
			if (this.fileupload["Layout"].hasOwnProperty(index)) {
				delete this.fileupload["Layout"][index];
			}
			let layoutlength = Object.keys(this.fileupload["Layout"]);
			if (layoutlength.length === 0) {
				delete this.fileupload["Layout"];
			}
		}
		this.smallerDeleteFrom = '';
		this.dbImageItem = '';
		this.deleteFrom = '';
		this.storeindex = '';
		this.display = false;	
	}
	removeSpaceNew(index) {
		this.Space.removeAt(index);
		this.smallerDeleteFrom = '';
		this.dbImageItem = '';
		this.deleteFrom = '';
		this.storeindex = '';
		this.display = false;		
	}

	deleteattachfileNew() {
		if (this.deleteFrom === "RenderGroup") {
			this.Renderspace.removeAt(this.storeindex);
			if (
				this.fileupload["RenderGroup"] !== undefined &&
				this.fileupload["RenderGroup"][this.storeindex] !== undefined
			) {
				delete this.fileupload["RenderGroup"][this.storeindex];
				this.fileLenderArr.splice(this.storeindex, 1);
				this.fileLenderArrlength[this.storeindex] = false;
			}
			if (this.fileupload.hasOwnProperty('RenderGroup')) {
				let renderlength = Object.keys(this.fileupload["RenderGroup"]);
				if (renderlength.length === 0) {
					delete this.fileupload["RenderGroup"];
				}
			}
			if (this.editJourney) {
				let uniquedata;
				if (this.updateModeFileupload.hasOwnProperty("RenderGroup")) {
					if (this.updateModeFileupload["RenderGroup"][this.storeindex].length > 0) {
						uniquedata = this.updateModeFileupload["RenderGroup"].splice(
							this.storeindex,
							1
						);
						if (this.delAwsDbfiles["RenderGroup"] === undefined) {
							this.delAwsDbfiles["RenderGroup"] = [];
						}
					}
				}
				if (uniquedata !== undefined && uniquedata[0].length > 0) {
					for (let i = 0; i < uniquedata[0].length; i++) {
						this.delAwsDbfiles["RenderGroup"].push(uniquedata[0][i]);
					}
					this.DbRenderdata = this.updateModeFileupload["RenderGroup"];
				}
			}
		} else if (this.deleteFrom === "SiteImages") {
			this.SiteImages.removeAt(this.storeindex);
			if(this.fileupload["SiteImages"] !== undefined ){
				let lengthCheck = Object.keys(this.fileupload["SiteImages"]);
				if (lengthCheck !== undefined &&
					this.storeindex < lengthCheck.length
				) {
					let tempArr = Object.assign([],this.fileupload["SiteImages"]);
					tempArr.splice(this.storeindex, 1);
					this.fileupload["SiteImages"] = Object.assign({},tempArr);
					this.fileSiteArr.splice(this.storeindex, 1);
					this.fileSiteArrlength.splice(this.storeindex, 1);
				}
				if (this.fileupload.hasOwnProperty('SiteImages')) {
					let renderlength = Object.keys(this.fileupload["SiteImages"]);
					if (renderlength.length === 0) {
						delete this.fileupload["SiteImages"];
					}
				}
			}
			if (this.editJourney) {
				let uniquedata;
				if (this.updateModeFileupload.hasOwnProperty("SiteImages")) {
					if(this.updateModeFileupload["SiteImages"][this.storeindex]!==undefined){
						if (this.updateModeFileupload["SiteImages"][this.storeindex].length > 0) {
							uniquedata = this.updateModeFileupload["SiteImages"].splice(
								this.storeindex,
								1
							);
							if (this.delAwsDbfiles["SiteImages"] === undefined) {
								this.delAwsDbfiles["SiteImages"] = [];
							}
						}else{
							this.updateModeFileupload["SiteImages"].splice(this.storeindex,1);
						}
					}
				}
				if (uniquedata !== undefined && uniquedata.length[0] > 0) {
					for (let i = 0; i < uniquedata[0].length; i++) {
						this.delAwsDbfiles["SiteImages"].push(uniquedata[0][i]);
					}
				}
				this.DbsiteImagesdata = this.updateModeFileupload["SiteImages"];
			}
		}
		// this.storePopContent.remove();
		this.smallerDeleteFrom = '';
		this.dbImageItem = '';
		this.deleteFrom = '';
		this.storeindex = '';
		this.display = false;
	}

	deletefromDBnAWSNew(deletefrom, item) {
		if (this.delAwsDbfiles[deletefrom] === undefined) {
			this.delAwsDbfiles[deletefrom] = [];
		}
		if (deletefrom === "SiteImages") {
			if (this.delAwsDbfiles[deletefrom] === undefined) {
				this.delAwsDbfiles[deletefrom] = [];
			}
			for (let i = 0; i < this.DbsiteImagesdata.length; i++) {
				for (let j = 0; j < this.DbsiteImagesdata[i].length; j++) {
					if (this.DbsiteImagesdata[i][j].id === item.id) {
						this.DbsiteImagesdata[i].splice(j, 1);
					}
				}
			}
			for (let i = 0; i < this.updateModeFileupload["SiteImages"].length; i++) {
				for (
					let j = 0;
					j < this.updateModeFileupload["SiteImages"][i].length;
					j++
				) {
					if (this.updateModeFileupload["SiteImages"][i][j].id === item.id) {
						this.updateModeFileupload["SiteImages"][i].splice(j, 1);
					}
				}
			}
			//Object.assign(this.delAwsDbfiles[deletefrom], item);
			this.delAwsDbfiles[deletefrom].push(item);
		} else if (deletefrom === "RenderGroup") {
			if (this.delAwsDbfiles[deletefrom] === undefined) {
				this.delAwsDbfiles[deletefrom] = [];
			}
			for (let i = 0; i < this.DbRenderdata.length; i++) {
				for (let j = 0; j < this.DbRenderdata[i].length; j++) {
					if (this.DbRenderdata[i][j].id === item.id) {
						this.DbRenderdata[i].splice(j, 1);
					}
				}
			}
			for (
				let i = 0;
				i < this.updateModeFileupload["RenderGroup"].length;
				i++
			) {
				for (
					let j = 0;
					j < this.updateModeFileupload["RenderGroup"][i].length;
					j++
				) {
					if (this.updateModeFileupload["RenderGroup"][i][j].id === item.id) {
						this.updateModeFileupload["RenderGroup"][i].splice(j, 1);
					}
				}
			}
			//Object.assign(this.delAwsDbfiles[deletefrom], item);
			this.delAwsDbfiles[deletefrom].push(item);
		} else if (deletefrom === "Layout") {
			if (this.delAwsDbfiles["Layout"] === undefined) {
				this.delAwsDbfiles["Layout"] = [];
			}
			this.delAwsDbfiles[deletefrom] = [];
			for (let i = 0; i < this.layout.length; i++) {
				if (this.layout[i].id === item.id) {
					this.layout.splice(i, 1);
				}
			}
			for (let j = 0; j < this.updateModeFileupload["Layout"].length; j++) {
				if (this.updateModeFileupload["Layout"][j].id === item.id) {
					this.updateModeFileupload["Layout"].splice(j, 1);
				}
			}
			//	Object.assign(this.delAwsDbfiles[deletefrom], item);
			this.delAwsDbfiles["Layout"].push(item);
		}
		this.smallerDeleteFrom = '';
		this.dbImageItem = '';
		this.deleteFrom = '';
		this.storeindex = '';
		this.display = false;
	}
	deleteASiteImageFileNew(file2DelInd, spaceIndex) {
		
		let data1;
		for (let i = 0; i < this.fileSiteArr[spaceIndex].length; i++) {
			if (this.fileSiteArr[spaceIndex][i].name === file2DelInd.name) {
				data1 = i;
				break;
			}
		}
		this.fileSiteArr[spaceIndex].splice(data1, 1);
		if (this.fileSiteArr[spaceIndex].length <= 0) {
			this.fileSiteArrlength[spaceIndex] = false;
		}
		this.fileupload["SiteImages"][spaceIndex] = Object.assign(
			{},
			this.fileSiteArr[spaceIndex]
		);
		if (this.fileSiteArr[spaceIndex].length === 0) {
			delete this.fileupload["SiteImages"][spaceIndex];
		}
		let renderlength = Object.keys(this.fileupload["SiteImages"]);
		if (renderlength.length === 0) {
			delete this.fileupload["SiteImages"];
		}
		this.smallerDeleteFrom = '';
		this.dbImageItem = '';
		this.deleteFrom = '';
		this.storeindex = '';
		this.display =false;
	}
	deleteARenderFileNew(file2DelInd, spaceIndex) {
		
		let data1;
		for (let i = 0; i < this.fileLenderArr[spaceIndex].length; i++) {
			if (this.fileLenderArr[spaceIndex][i].name === file2DelInd.name) {
				data1 = i;
				break;
			}
		}
		this.fileLenderArr[spaceIndex].splice(data1, 1);
		if (this.fileLenderArr[spaceIndex].length <= 0) {
			this.fileLenderArrlength[spaceIndex] = false;
		}
		this.fileupload["RenderGroup"][spaceIndex] = Object.assign(
			{},
			this.fileLenderArr[spaceIndex]
		);
		if (this.fileLenderArr[spaceIndex].length === 0) {
			delete this.fileupload["RenderGroup"][spaceIndex];
		}
		let renderlength = Object.keys(this.fileupload["RenderGroup"]);
		if (renderlength.length === 0) {
			delete this.fileupload["RenderGroup"];
		}
		this.smallerDeleteFrom = '';
		this.dbImageItem = '';
		this.deleteFrom = '';
		this.storeindex = '';
		this.display = false;
	}

	reloadDataById(){
		// console.log('param operation' + JSON.stringify(data));
		this.editJourney = true;
		this._commonNodeCallService.GetBOQById(this.idForupdate).subscribe(res => {
			if (res['statusCode'] === 200) {
				this._communicationService.loader = false;
				this.finalize = this.projectDetailSession['finalize'];
				this.filefromdb = res["results"];
				for (let i = 0; i < this.filefromdb["layout"].length; i++) {
					if (this.updateModeFileupload["Layout"] === undefined) {
						this.updateModeFileupload["Layout"] = [];
					}
					this.updateModeFileupload["Layout"][i] = this.filefromdb["layout"][i];
				}

				for (let i = 0; i < this.filefromdb["RederSpace"].length; i++) {
					if (this.updateModeFileupload["RenderGroup"] === undefined) {
						this.updateModeFileupload["RenderGroup"] = [];
					}
					this.updateModeFileupload["RenderGroup"][i] = this.filefromdb["RederSpace"][i].imgArray;
				}

				for (let i = 0; i < this.filefromdb["siteImages"].length; i++) {
					if (this.updateModeFileupload["SiteImages"] === undefined) {
						this.updateModeFileupload["SiteImages"] = [];
					}
					this.updateModeFileupload["SiteImages"][i] = this.filefromdb["siteImages"][i].imges;
				}
				const getBOQdata = res;
				while (this.Layout.length !== 0) {
					this.Layout.removeAt(0);
				}
				while (this.Space.length !== 0) {
					this.Space.removeAt(0);
				}

				while (this.SiteImages.length !== 0) {
					this.SiteImages.removeAt(0);
				}

				while (this.Renderspace.length !== 0) {
					this.Renderspace.removeAt(0);
				}
				// const objCategory = { label: getBOQdata.type['label'], id: getBOQdata.type['id'] };
				const objCategory = {
					label: getBOQdata["results"].type.label,
					id: getBOQdata["results"].type["id"]
				};
				this.editModeBoqName = getBOQdata["results"].boqName;
				this.form.patchValue({
					Boqname: getBOQdata["results"].boqName,
					boqType: objCategory
				});
				this.form.controls['Boqname'].disable();

				if (getBOQdata["results"].layout.length > 0) {
					const parameter = this.createLayout();
					this.Layout.push(parameter);
					this.layout = getBOQdata["results"]["layout"];
				}

				if (getBOQdata["results"].spaceDetails.length > 0) {
					for (
						let i = 0;
						i < getBOQdata["results"].spaceDetails.length;
						i++
					) {
						// tslint:disable-next-line:max-line-length
						const spacedropdown = {
							label:
								getBOQdata["results"].spaceDetails[i].seatingSpace["label"],
							id: getBOQdata["results"].spaceDetails[i].seatingSpace["id"]
						};
						const parameter0 = this.formbuilder.group({
							seatingdetails: spacedropdown,
							noofSeat: getBOQdata["results"].spaceDetails[i].value
						});
						this.Space.push(parameter0);
						// console.log('Space Data Entered' + JSON.stringify(parameter0.value));
					}
				}

				if (getBOQdata["results"].RederSpace.length > 0) {
					for (let j = 0; j < getBOQdata["results"].RederSpace.length; j++) {
						// tslint:disable-next-line:max-line-length
						const SelectSpaceDropdown = {
							label: getBOQdata["results"].RederSpace[j].space["label"],
							id: getBOQdata["results"].RederSpace[j].space["id"]
						};
						const name =
							getBOQdata["results"].RederSpace[j].name === null
								? ""
								: getBOQdata["results"].RederSpace[j].name;
						const parameter0 = this.formbuilder.group({
							fileName1: name,
							spacedetails: SelectSpaceDropdown,
							uploadfile1: ""
						});
						this.Renderspace.push(parameter0);
						// console.log('Render Data Entered' + JSON.stringify(parameter0.value));
						this.DbRenderdata[j] =
							getBOQdata["results"].RederSpace[j]["imgArray"];
					}
				}

				if (getBOQdata["results"].siteImages.length > 0) {
					for (let k = 0; k < getBOQdata["results"].siteImages.length; k++) {
						const parameter0 = this.formbuilder.group({
							projectName: getBOQdata["results"].siteImages[k].projectName,
							projectImages: ""
						});
						this.SiteImages.push(parameter0);
						// console.log('Site Image Data Entered' + JSON.stringify(parameter0.value));
						this.DbsiteImagesdata[k] =
							getBOQdata["results"].siteImages[k]["imges"];
					}
				}
				
				if(this.finalize) {
					this.form.disable();
						if(this.Renderspace.length > 0) {
							this.form.get('Renderspace')['controls'].forEach(control => {
								control.disable();
							});
						}
						if(this.SiteImages.length > 0) {
							this.form.get('SiteImages')['controls'].forEach(control => {
								control.disable();
							});
						}
						if(this.Space.length > 0) {
							this.form.get('Space')['controls'].forEach(control => {
								control.disable();
							});
					}
				}
			} else {
				if(res['statusCode'] === 401){
					this.router.navigateByUrl('/login');
				}else{
					this._communicationService.loader =false
				this._communicationService.backendError = true;
				// window.location.reload();
				}
			}
		});
	}

	setAllEmpty(){
		this.fileupload = [];
		this.layout = []; // created to store edit journey layout object.
		this.DbRenderdata = []; // created to store edit journey Render object.
		this.DbsiteImagesdata = []; // created to store edit journey siteImage object.
		this.fileLenderArr = [];
		this.fileLenderArrlength = [];
		this._communicationService.backendError = false;
		this.fileslist = {};
		this.fileupload = {};
		this.filefromdb = null; // to store response object in edit mode
		this.updateModeFileupload = []; // created to store only files
		this.finalize = false;
	}

	focusBoqName(){
		this.duplicateBoqName = false;
	}
}

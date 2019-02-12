import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { FrontEndValidationService } from 'src/app/services/Validation/front-end-validation.service';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { UploadfileService } from 'src/app/services/FileUpload/uploadfile.service';
import { SelectItem } from 'primeng/api';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { SpinnerVisibilityService } from 'ng-http-loader';

export class labelid {
	label: string
	id: number
}

@Component({
	selector: 'app-add-new-project-page',
	templateUrl: './add-new-project-page.component.html',
	styleUrls: ['./add-new-project-page.component.css'],
	// encapsulation : ViewEncapsulation.None
})
export class AddNewProjectPageComponent implements OnInit {

	/**trial Purpose */
	Email1flag = [];
	Email1Errormsg = [];
	ErrormsgType = [];
	/**trial Purpose */


	form: FormGroup;

	dropdownList = [];
	dropdownList1 = [];
	//  team  data dropdown
	teamNamelist = [];
	teamNamelist2 = [];
	design_team_member_data: SelectItem[] = [];
	design_team_member_data1: SelectItem[] = [];
	design_team_designation_data: SelectItem[] = [];
	design_team_designation_data1: SelectItem[] = [];

	procurement_team_member_data: SelectItem[] = [];
	procurement_team_member_data1: SelectItem[] = [];
	procurement_team_designation_data: SelectItem[] = [];
	procurement_team_designation_data1: SelectItem[] = [];

	kam_team_member_data: SelectItem[] = [];
	kam_team_member_data1: SelectItem[] = [];
	kam_team_designation_data: SelectItem[] = [];
	kam_team_designation_data1: SelectItem[] = [];

	projectmanager_team_member_data: SelectItem[] = [];
	projectmanager_team_member_data1: SelectItem[] = [];
	projectmanager_team_designation_data: SelectItem[] = [];
	projectmanager_team_designation_data1: SelectItem[] = [];

	sbu_data_options: SelectItem[] = [];
	sbu_data_options1: SelectItem[] = [];

	multiarray: SelectItem[] = [];
	multiarray1: SelectItem[] = [];

	// multiselect
	projectsupervisor = [];
	designlead = [];
	siteengineer = [];
	dropdownSettings = {};

	// booleans
	disableProjectToDuplicate: boolean = false;

	objstatedata = {};
	objcitydata = {};

	DbRenderdata = []; // created to store edit journey Render object.
	editJourney; // use to distinguish between wdit journey /Normal journey

	addprojected: boolean = false;
	updatedproject : boolean =false;
	// files
	selectedFiles: FileList; // created for fileUpload contain all files in array of Object format
	selectedLogoFiles :FileList

	// change this later
	// addData = "addProject";
	editData = "editProject";
	// editData = "";
	addData;
	filepopup: boolean;
	cliensidepopup: boolean;
	// Activeindex
	Activeindex = [];

	duplicateDataBoj = {};

	otherDesignationDuplicate: boolean = false;
	clientNameDuplicate: boolean =false;
	fileNameDuplicate:boolean =false;
	projectid;
	addProject: boolean;
	clientRemoveIndex;

	useryearStart;
	usermonthStart;
	userdayStart;
	commonStartdate;
	userId;
	updateModeFileupload = []; // created to store only files
	startdate;
	enddate;
	projectLocalId;
	updateCalenderJourney: boolean;
	arrayListTotalCount;

	startNgPrimeDate = new Date();
	endNgPrimeDate = new Date();
	ProjectName;
	newObj={};
	message;
	minDateValue;
	S3image:boolean =false;
	S3imagename;
	imageArrayEdit:any;
	updateModeLogoDeleted : boolean =false;
	multiselectdataArray = [];
	submitProjectLogo ='';
	updateProjectLogo = '';
	duplicateProjectErrorMsg = '';
	duplicateProject :boolean =false;
	// categories between delete
	fileDelete;
	editModeProjectName;

	constructor(private router: Router, private formbuilder: FormBuilder,
		private validationService: FrontEndValidationService,
		private _commonNodeCallService: CommonCallService,
		private uploadService: UploadfileService,
		public _communicationService: CommunicateService,
		private spinner: SpinnerVisibilityService) {
		this.DbRenderdata = [];
		this.updateCalenderJourney = false;
		console.log("in constructor", this.updateCalenderJourney)
		this._communicationService.backendError = false;
		this._communicationService.checkClient(false);
		this._communicationService.clientSubjectId = '';
	}


	ngOnInit() {
		this._communicationService.clientedit.subscribe(data => {
            if (data == false) {
                this.displayaddnewvariant = false;
            }
        })
		this.userId = sessionStorage.getItem('userid');

		this.addprojected = false;
		this.updatedproject = false;		
		
		this.editJourney = false;

		this.form = this.formbuilder.group({
			'clientName': ['', [Validators.required]],
			'duplicateProject': '',
			'Date3': [''],
			'Date4': [''],
			'siteName': ['', [Validators.required]],
			'addressLine1': ['', [Validators.required]],
			'addressLine2': ['', [Validators.required]],
			'initialCity': ['', [Validators.required]],
			'initialState': ['', [Validators.required]],
			'initialPincode': ['',Validators.pattern(this._communicationService.pattern.pincode)],
			'salesManager': '',
			'clientDesignation': '',
			'sqFt': ['', [Validators.required, Validators.pattern(this._communicationService.pattern.decimalwithcommas)]],
			'Project': ['', [Validators.required]],
			'tentValProj': ['',Validators.pattern(this._communicationService.pattern.decimalwithcommas)],
			'viewDesignMemberAction1': '',
			'viewDesignDesignationAction1': '',
			'viewDesignMemberAction2': '',
			'viewDesignDesignationAction2': '',
			'viewDesignMemberAction3': '',
			'viewDesignDesignationAction3': '',
			'viewDesignMemberAction4': '',
			'viewDesignDesignationAction4': '',
			'fileName1': '',
			'fileDesc1': '',
			'sbuname': ['', [Validators.required]],
			'projectlogo': ['', [Validators.required]],
			'BoqAddressName': ['', [Validators.required]],
			'builtupsqFt': ['', [Validators.required, Validators.pattern(this._communicationService.pattern.decimalwithcommas)]],
			Parameter: this.formbuilder.array([]),
			fileData: this.formbuilder.array([])
		});

		this.form.controls['Date3'].valueChanges.subscribe(
			(selectedValue) => {
			  console.log("Date3",selectedValue);
			  this.minDateValue = selectedValue;
			  console.log("this.minDateValue",this.minDateValue);			    
			}
		);

		// GetClientsName
		this._commonNodeCallService.GetClientsName().subscribe(res => {
			console.log("client name and id", res)
			if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
						this.clientNameresults.push({ label: element.name, id: element.id });
					});
                }
            }else{
                this._communicationService.backendError = true;                        
            }
		})

		// sales manager from employee master
		var sbudataobj = {sbuId : 0}
		this._commonNodeCallService.GetEmployees(sbudataobj).subscribe(res => {
			console.log("employees details", res)
			if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
						this.salesManagerdropdownresults.push({ label: element.name, id: element.id });
					});
                }
            }else{
                this._communicationService.backendError = true;                        
            }
			
		})

		// GetStateCity
		// id=1 is for india 
		// this.objstatedata = {id:1}
		this.objstatedata = { actionType: "showState", id: 1 }
		console.log("this.objstatedata", this.objstatedata)
		this._commonNodeCallService.GetStateCity(this.objstatedata).subscribe(res => {
			console.log("state details", res)
			if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
						this.initialStateresults.push({ label: element.name, id: element.id });
					});
                }
            }else{
                this._communicationService.backendError = true;                        
            }
		})

		// GetSbu
		this._commonNodeCallService.GetSbu().subscribe(res => {
			console.log("sbu name and id", res)
			if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
						this.sbu_data_options1.push({ label: element.sbu_name, value: element.id });
					});
                }
            }else{
                this._communicationService.backendError = true;                        
            }
			this.sbu_data_options = this.sbu_data_options1;
			console.log("===", this.sbu_data_options)
		})

		// GetProjectType
		this._commonNodeCallService.GetProjectType().subscribe(res => {
			console.log("Project Type fetched", res)
			if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
						this.projecttyperesults.push({ label: element.project_type_name, id: element.id });
					});
                }
            }else{
                this._communicationService.backendError = true;                        
            }
		})

		// GetDesignation for ng-multiselect-dropdown
		this._commonNodeCallService.GetClientSideDesignation().subscribe(res => {
			console.log("Designations fetched", res)
			if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
						this.dropdownList1.push({ label: element.desg_name, value: element.id });
						this.multiselectdataArray.push(element.desg_name);
					});
					this.dropdownSettings = {
						singleSelection: false,
						idField: 'value',
						textField: 'label',
						selectAllText: 'Select All',
						unSelectAllText: 'UnSelect All',
						itemsShowLimit: 1,
						allowSearchFilter: true
					};
					this.dropdownList = this.dropdownList1;
                }
            }else{
                this._communicationService.backendError = true;                        
            }
		})
		
		// CHECKING DATA IF IT CONTAINS ID OR NOT
		this.projectid = sessionStorage.getItem('projectid');
		console.log("session storage projectID", this.projectid)

		// ADD SCREEN
		if (this.projectid == "addProject") {
			this.form.controls['siteName'].enable();

			this.addProject = true;
			console.log("add project screen =========================================================>");

			this.duplicateDataBoj = { actionType: "add" };
			this._commonNodeCallService.GetProjectName(this.duplicateDataBoj).subscribe(res => {
				console.log("duplicate =====> project name and id", res)
				if(res['success']){
					if(res['results'].length > 0){
						this.disableProjectToDuplicate = false;
					res['results'].forEach(element => {
						this.duplicateProjectresults.push({ label: element.project_name, id: element.id });
					});
					}else {
						console.log("no projects present for add screen")
						this.disableProjectToDuplicate = true;
					}
				}else{
					this._communicationService.backendError = true;                        
				}
			})
		}
		// Update screen
		else {
			this.addProject = false;
			console.log("update project screen=====================================================>");
			this.editJourney = true;
			// duplicate dropdown
			console.log("update project");
			this.duplicateDataBoj = { actionType: "edit" };
			// index stored here	
			console.log({ id: this.projectid })
			this.duplicateDataBoj = { id: this.projectid };
			this._commonNodeCallService.GetProjectName(this.duplicateDataBoj).subscribe(res => {
				console.log("project name and id", res)
				if(res['success']){
					if(res['results'].length > 0){
						this.disableProjectToDuplicate = false;
					res['results'].forEach(element => {
						this.duplicateProjectresults.push({ label: element.project_name, id: element.id });
					});
					}else {
						console.log("no projects present")
						this.disableProjectToDuplicate = true;
					}
				}else{
					this._communicationService.backendError = true;                        
				}
			})

			// Bringing all listing data
			// index stored here
			var idData = { id: this.projectid }
			this._commonNodeCallService.GetProjectListingById(idData).subscribe(res => {
				console.log("Project details fetched for edit screen=========>", res)
				if (res['success'] ) {		
				this.form.patchValue({
					BoqAddressName:res['results'][0].BoqAddressName,
					builtupsqFt:res['results'][0].built_up_area 
				})
				// 
				// if (res['results'] ) {
					// ============bringing members============================================>
					var resId = res['results'][0].sbu_id;
					var resobjdata = { id: resId }
					this._commonNodeCallService.GetEmployeeBySbu(resobjdata).subscribe(res => {
						console.log("(Members)employees by sbu id for edit screen", res)
						if (res['results'] != "") {
							res['results'].forEach(element => {
								this.design_team_member_data1.push({ label: element.name, value: element.id });
								this.procurement_team_member_data1.push({ label: element.name, value: element.id });
								this.kam_team_member_data1.push({ label: element.name, value: element.id });
								this.projectmanager_team_member_data1.push({ label: element.name, value: element.id });
							});
							this.design_team_member_data = this.design_team_member_data1;
							this.procurement_team_member_data = this.procurement_team_member_data1;
							this.kam_team_member_data = this.kam_team_member_data1;
							this.projectmanager_team_member_data = this.projectmanager_team_member_data1;
						}
					})
					// ================bringing designations=======================>
					this._commonNodeCallService.GetDesignation().subscribe(res => {
						console.log("Designations fetched for edit screen", res)
						if (res['results'] != "") {
							res['results'].forEach(element => {
								this.design_team_designation_data1.push({ label: element.desg_name, value: element.id });
								this.procurement_team_designation_data1.push({ label: element.desg_name, value: element.id });
								this.kam_team_designation_data1.push({ label: element.desg_name, value: element.id });
								this.projectmanager_team_designation_data1.push({ label: element.desg_name, value: element.id });

							});
							this.design_team_designation_data = this.design_team_designation_data1;
							this.procurement_team_designation_data = this.procurement_team_designation_data1;
							this.kam_team_designation_data = this.kam_team_designation_data1;
							this.projectmanager_team_designation_data = this.projectmanager_team_designation_data1;
						}
					})
					// =======================================================================================>
					console.log("==============>response from db", res)
					var assignValue = res['results'][0];
					var clientAssignValue = res['results'][0].clientData;
					// console.log("==============>clientAssignValue=========>",clientAssignValue.length)				
					var fileAssignValue = res['results'][0].fileArray;
					console.log("==============>fileAssignValue========>", fileAssignValue)
					var objclientName = { label: null, id: null };
					if(res['results'][0].client_name !== null){
						objclientName = { label: assignValue.client_name, id: assignValue.client_id };
					}
					var objduplicateProject = { label: null, id: null };
					if(res['results'][0].duplicateProject !== null){
						objduplicateProject = { label: assignValue.duplicateProject_id_name, id: assignValue.duplicateProject_id };
					}
					var objstateName = { label: assignValue.state_name, id: assignValue.state };
					var objcityName = { label: assignValue.city_name, id: assignValue.city };
					var objsalesManager = { label: assignValue.sales_manager_name, id: assignValue.sales_manager };
					var objProjectName = { label: assignValue.project_type_name, id: assignValue.project_type };
					var objSbuname = { label: assignValue.sbu_name, value: assignValue.sbu_id };
					var objDesignTeamMember = { label: assignValue.design_team_member_name, value: assignValue.design_team_member };
					var objKamTeamMemberName = { label: assignValue.kam_team_member_name, value: assignValue.kam_team_member };
					var objProcurementTeamDesignationName = { label: assignValue.procurement_team_member_name, value: assignValue.procurement_team_member };
					var objProjectManagementTeamMemberName = { label: assignValue.project_management_team_member_name, value: assignValue.project_management_team_member };
					var objDesignTeamDesignation = { label: assignValue.design_team_designation_name, value: assignValue.design_team_designation };
					var objKamTeamMemberDesignation = { label: assignValue.kam_team_designation_name, value: assignValue.kam_team_designation };
					var objProcurementTeamDesignationDesignation = { label: assignValue.procurement_team_designation_name, value: assignValue.procurement_team_designation };
					var objProjectManagementTeamMemberDesignation = { label: assignValue.project_management_team_designation_name, value: assignValue.project_management_team_designation };
					console.log("objSbuname==>" + JSON.stringify(objSbuname));
					if(assignValue.start_Date !== "null"){
						this.form.patchValue({
							Date3: new Date(assignValue.start_Date)
						})
					}
					if(assignValue.end_Date !== "null"){
						this.form.patchValue({
							Date4: new Date(assignValue.end_Date)
						})
					}
					this.editModeProjectName = assignValue.project_name
					this.form.patchValue({
						clientName: objclientName,
						duplicateProject: objduplicateProject,
						// Date3: newStartDate,
						// Date4: newendtDate,
						siteName: assignValue.project_name,
						addressLine1: assignValue.address1,
						addressLine2: assignValue.address2,
						initialState: objstateName,
						initialCity: objcityName,
						initialPincode: assignValue.pincode,
						salesManager: objsalesManager,
						sqFt: assignValue.Area,
						Project: objProjectName,
						tentValProj: assignValue.tentative_value,
						sbuname: objSbuname,
						viewDesignMemberAction1: objDesignTeamMember,
						viewDesignMemberAction2: objKamTeamMemberName,
						viewDesignMemberAction3: objProcurementTeamDesignationName,
						viewDesignMemberAction4: objProjectManagementTeamMemberName,
						viewDesignDesignationAction1: objDesignTeamDesignation,
						viewDesignDesignationAction2: objKamTeamMemberDesignation,
						viewDesignDesignationAction3: objProcurementTeamDesignationDesignation,
						viewDesignDesignationAction4: objProjectManagementTeamMemberDesignation,
					})
					this.form.controls['siteName'].disable();
					// storing date in another local varible
					this.startdate = assignValue.start_Date;
					this.enddate = assignValue.end_Date;
					this.minDateValue = new Date(assignValue.start_Date);
					// storing id
					this.projectLocalId = assignValue.id;

					// client side data
					if (clientAssignValue != undefined) {
						for (let i = 0; i < clientAssignValue.length; i++) {
							var clientobj = clientAssignValue[i]
							console.log("clientobj.desgArray===>", clientobj.desgArray);
							const clientDesignation = clientobj.desgArray;
							console.log("clientDesignation===>", clientDesignation);
							const teamDataName = clientobj.name;
							var teamDataEmail = '';
							if(clientobj.email !== "null"){
								teamDataEmail = clientobj.email;
							}
							var teamDataMobile = '';
							if(clientobj.mobile !== "null"){
								teamDataMobile = clientobj.mobile;
							}
							// assigning values to multiselect BY SKIPPING OTHER DESIGNATION
							var multiSelectArray =[];													
							if(clientobj.desgArray.length !== undefined){
								for (var j=0 ;j < clientobj.desgArray.length;j++){
									var desgArrayObject = clientobj.desgArray[j];
									console.log("desgArrayObject==>",desgArrayObject)								
									if(desgArrayObject.label != "Other"){
										multiSelectArray.push({label:desgArrayObject.label,value :desgArrayObject.value})
									}
									
								}
							}
							console.log("multiSelectArray==>",multiSelectArray)
							
							
							const parameter0 =
								this.formbuilder.group({
									clientDesignation: [multiSelectArray],
									teamDataName: teamDataName,
									teamDataEmail: teamDataEmail,
									teamDataMobile: teamDataMobile,
									clientotherDesignation: ''
								});

							this.parameters.push(parameter0);

							// REMOVING formcontrol of other designation
							this.form.controls.Parameter['controls'][i].removeControl('clientotherDesignation');
							
						}
					}

					// clienT ends here

					// file side data
					// console.log("fileAssignValue.length",fileAssignValue.length)					
					if (fileAssignValue != undefined) {
						for (let i = 0; i < fileAssignValue.length; i++) {
							var fileobj = fileAssignValue[i]
							const fileName1 = fileobj.name;
							var fileDesc1 = '';							
							if(fileobj.description !== "null"){
								fileDesc1 = fileobj.description;
							}

							const parameter1 =
								this.formbuilder.group({
									fileName1: fileName1,
									fileDesc1: fileDesc1,
									uploadfile: ''
								});
							this.filedataarray.push(parameter1);
							this.DbRenderdata[i] = fileobj['filedemoarray'];
							console.log("Rohit data from database'" + JSON.stringify(this.DbRenderdata[i]))
							// console.log("rohit timestamp===", fileobj['filedemoarray'][i].obj.displayFileName)
						}
						// file ends here

						// edit--upload file saving data
						console.log("fileAssignValue.length edit-upload copy data",fileAssignValue.length)
					if (fileAssignValue != undefined) {
						for (let i = 0; i < fileAssignValue.length; i++) {
							var fileobjUpload = fileAssignValue[i]
							if (this.updateModeFileupload['FileSideGroup'] === undefined) {
								this.updateModeFileupload['FileSideGroup'] = [];
							}
							this.updateModeFileupload['FileSideGroup'][i] = fileobjUpload['filedemoarray'];
							console.log("Rohit UPLOAD=============", this.updateModeFileupload['FileSideGroup'][i])
						}
					}							
						// edit--upload file saving data ends here
					}

					this._communicationService.loader = false;
				}else{
					if(res['statusCode'] === 401){
						this.router.navigateByUrl('/login');
					}else{
						this._communicationService.loader = false;
					console.log("error while fetching data")
					this._communicationService.backendError = true; 
					}
					                       
				}
				// project logo
			let imageObj = {};
			
			imageObj['projectLogoName'] = res["results"][0].projectLogoName; 
			imageObj['projectLogoType'] = res["results"][0].projectLogoType;
			imageObj['projectLogoSrc'] = res["results"][0].projectLogoSrc;
			imageObj = Object.assign([],imageObj);
			console.log("imageObj==>",imageObj)
			this.form.get('projectlogo').clearValidators();
			this.form.patchValue({
			  projectlogo: imageObj
			})
			this.imageArrayEdit = imageObj;
			console.log("=>",this.imageArrayEdit['projectLogoSrc'])
			console.log(imageObj);
			this.S3imagename =  imageObj['projectLogoName'].substring(imageObj['projectLogoName'].indexOf('_')+1,imageObj['projectLogoName'].length);
			//   this.S3imagename =  imageObj['projectLogoName'];
		  //   this.form.get('projectlogo').setValidators([Validators.required]);
			  this.S3image = true;
			  this.form.get('projectlogo').updateValueAndValidity();
			  // 
			})
		}
		// SUBJECT ON CLIENT(CHEKING IF CLIENT IS ADDED AND ASSIGNING VALUE)
		this._communicationService.clientSubject.subscribe(data =>{
			console.log("client subject check in ad parameter");
			console.log("data==>",data);
			if(data){
				this.form.patchValue({
					clientName:''
				})
				console.log("client is TRUE");
				this.clientNameresults =[];
				this.filteredclientName =[];
				// GetClientsName 
				var clientsubObj = {};
				this._commonNodeCallService.GetClientsName().subscribe(res => {
			console.log("client name and id", res)
			if(res['success']){
				
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
						console.log("this._communicationService.clientSubjectId",this._communicationService.clientSubjectId);
						if(element.id === this._communicationService.clientSubjectId){
							clientsubObj = { label: element.name, id: element.id }
						}
						this.clientNameresults.push({ label: element.name, id: element.id });
					});
				}
				this.form.patchValue({
					clientName: clientsubObj
				})
            }else{
                this._communicationService.backendError = true;                        
            }
		})
			}else{
				console.log("client is FALSE");
			
			}
		})
	}
	createParameter(): FormGroup {
		return this.formbuilder.group({
			clientDesignation: ['', [Validators.required]],
			teamDataName: ['', [Validators.required]],
			teamDataEmail: ['', [Validators.pattern(this._communicationService.pattern.emailAddress)]],
			teamDataMobile: ['',[Validators.pattern(this._communicationService.pattern.mobileNo)]],
			clientotherDesignation: ['', [Validators.required,this.validateClientName.bind(this)]]
		});
	}
	addParameter() {
		const parameter = this.createParameter();
		this.parameters.push(parameter);
	}
	removeParamter(index) {
		this.clientRemoveIndex = index;
		this.display = true;
		this.cliensidepopup = true;
		// this.parameters.removeAt(index);
	}

	get parameters(): FormArray {
		return this.form.get('Parameter') as FormArray;
	}

	createfileData(): FormGroup {
		return this.formbuilder.group({
			fileName1: ['', [Validators.required]],
			fileDesc1: '',
			uploadfile: ['', [Validators.required]]
		})
	}

	addfiles() {
		const parameter = this.createfileData();
		this.filedataarray.push(parameter);
	}
	storeindex;

	selectedItem2Delete: any; // created to store item data on popup of delete	
	removefiles(index, item) {
		this.fileDelete = "outerfileDelete"
		this.display = true;
		this.filepopup = true;
		this.selectedItem2Delete = item;
		this.deleteFrom = 'FileSideGroup';
		this.storeindex = index;
	}

	get filedataarray(): FormArray {
		return this.form.get('fileData') as FormArray;
	}


	Cancel() {
		this.duplicateProject = false;
		this._communicationService.backendError = false;
		sessionStorage.removeItem('projectid');
		this.DbRenderdata = []; // created to store edit journey Render object.		
		this.updateCalenderJourney = false;
		this.editJourney =false;
		this.updateModeLogoDeleted = false;
		this.router.navigateByUrl('/Project');
	}


	formerror: boolean = false;

	Submit(data,action) {
		console.log("data",data);
	this.initialCounterSubArrylst = 0;
	this.arrayListInitialCount = 0;
		console.log("actionTYPE===>",action);
		if (this.form.invalid) {
			this.formerror = true;
		}
		else {
			// checking duplicates for clientotherDesignation
			var valueArr = data.Parameter.map(function (item,index) {
				if(item.clientotherDesignation !== undefined){
					return item.clientotherDesignation
				}else{
					return index;
				}
			});
			var isDuplicate = valueArr.some(function (item, idx) {
				return valueArr.indexOf(item) != idx
			});
			console.log("other duplicates contains duplicates clientotherDesignation  while submit", isDuplicate);
			if (isDuplicate) {
				this.otherDesignationDuplicate = true;
				console.log("in isduplicate block og other designation")
			}
			else {
				// checking duplicates for client name
			var valueArr1 = data.Parameter.map(function (item) {
			   return item.teamDataName
		   });
		   var isDuplicate1 = valueArr1.some(function (item, idx) {
			   return valueArr1.indexOf(item) != idx
		   });
		//    console.log("other duplicates contains duplicates client name while submit", isDuplicate1);
		   if (isDuplicate1) {
			   this.clientNameDuplicate = true;
			   console.log("in isduplicate block on client name")
		   }else{
				// checking duplicates for fILE name
				var valueArr2 = data.fileData.map(function (item) {
					return item.fileName1
				});
				var isDuplicate2 = valueArr2.some(function (item, idx) {
					return valueArr2.indexOf(item) != idx
				});
			 //    console.log("other duplicates contains duplicates fILE name while submit", isDuplicate2);
				if (isDuplicate2) {
					this.fileNameDuplicate = true;
					console.log("in isduplicate block on fILE name")
				}else{
					this.formerror = false;
					console.log(data);
					if(data.Date3 === ""){
						this.commonStartdate = null;
					}else{
						this.ValidateDateStart(data.Date3);
					}
					data.Date3 = this.commonStartdate;
					if(data.Date4 === ""){
						this.Enddate = null;
					}else{
						this.ValidateDateEnd(data.Date4)
					}
					data.tentValProj = this._communicationService.removeCommas(data.tentValProj);
					data.sqFt = this._communicationService.removeCommas(data.sqFt);
					data.builtupsqFt = this._communicationService.removeCommas(data.builtupsqFt);
					data.Date4 = this.Enddate;
					console.log("SUBMIT>>start date", data.Date3);
					console.log("SUBMIT>>end date", data.Date4);
					data.actionType = action;
					data.userId = this.userId;
					this.Finaldata = data;
					console.log("Form data with formatted date", data);
					let arraylist = Object.keys(this.fileupload);
					let SuccessCount = {};
					let InitialCount1 = {};
					this._communicationService.loader = true;
					this.ProjectName =data.siteName
					data['projectId'] = null;
					// EDIT JOURNEY
					if(this.editJourney){
					this.ProjectName = this.editModeProjectName;
					data.siteName = this.editModeProjectName;
					this.updateCalenderJourney = true;
					data['projectId'] = this.projectLocalId;
					}
					// ADDED TODAY
					console.log("line 675<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",arraylist.length);
					if (arraylist.length > 0) {
					console.log("line 677<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",this.fileupload[arraylist[0]]);
						this.arrayListTotalCount = arraylist.length
						this.saveFile(this.fileupload[arraylist[0]], arraylist[0]);
					} else {
						this._communicationService.LoaderMsg = "Storing data into Database";
						console.log("project data for DB");
						console.log(data);
						this.callDB(data);
					}
				}
			
		   }
			}
		}
	}


	// ADDED TODAY
	
	Indleng: any; // ['0','2','3'] of fileupload['RenderGroup'],fileupload['SiteImages'],fileupload['Layout']
	Finaldata; //Form Data
	initialCounterSubArrylst = 0;
	finalCounterSubArrylst;
	arrayListInitialCount = 0;
	onS3ErrorDeluploadFile = [];// created to delete files from s3 on error

	// 
	// ADDED TODAY
	saveFile(data, name) { 
		const optParam = {};
		optParam["name"] = name;
		console.log("ProjectName",this.ProjectName)
		this.uploadService.FOLDER = 'upload/Projects/' + this.ProjectName + '/';
		this.Indleng = Object.keys(data)
		optParam["index"] = this.Indleng[0];
		optParam["finalCounter"] = this.arrayListInitialCount;
		console.log("this.fileupload===>",this.fileupload)
		let subArray = Object.keys(this.fileupload[name])
		let tempvar = this.fileupload[name][this.Indleng[0]];
		console.log("line 718 subArray======>",subArray)
		console.log("line 719 tempvar======>",tempvar)
		if (tempvar.length === undefined) {
			tempvar = Object.assign([], tempvar);
		}
		this.finalCounterSubArrylst = subArray.length;
		this.selectedFiles = tempvar;
		this.callS3Upload(optParam, this.selectedFiles);
	}

	// 
	// ADDED TODAY
	callS3Upload(optParam, fileListCounter) {
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
					const DataName = "FileSideGroup";
					const counter = res["Counter"];
					// if (DataName === "FileSideGroup") {
						// this.Renderspace.value[counter]["uploadfile1"] = res["respArray"]; AMols code
						this.filedataarray.value[counter]['uploadfile'] = res["respArray"];
					// }
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
							console.log("error in deletinf rile from aws")
						this._communicationService.backendError = true;
						}
					});
				}
			}
		});
}
	// 

	deleteS3Arr = []; // delete path  
	// ADDED TODAY
	callDB(data) {
		if (this.editJourney) {
			this.handleEditFileStoreage();
		}
		console.log("data to be sent to API====",data)

		// PRocedure data
		if(this.editJourney){
		this.newObj['projectId'] = data.projectId;
		this.newObj['actionType']= 'update';
		}else{
		this.newObj['projectId'] = null;
		this.newObj['actionType']= 'insert';
		}
		this.newObj['clientId'] = data.clientName.id;
		if(data.duplicateProject === "" || data.duplicateProject === null){ 
		this.newObj['duplicateProjectId'] = null
		}else{
		this.newObj['duplicateProjectId'] = data.duplicateProject.id;
		}
		this.newObj['startDate'] = data.Date3;
		this.newObj['endDate'] = data.Date4;
		this.newObj['projectName'] = data.siteName;
		this.newObj['addressLine1'] = data.addressLine1;
		this.newObj['addressLine2'] = data.addressLine2;
		this.newObj['stateId'] = data.initialState.id;
		this.newObj['cityId'] = data.initialCity.id;
		if(data.initialPincode === "" || data.initialPincode === null){ 
			this.newObj['pincode'] = null;          
		}else{
			this.newObj['pincode'] = data.initialPincode;          
		}
		if(data.salesManager === "" || data.salesManager === null){ 
			this.newObj['salesManagerId'] =  null;			     
		}else{
			this.newObj['salesManagerId'] =  data.salesManager.id;      
		}
		this.newObj['area'] = data.sqFt;
		this.newObj['projectTypeId'] = data.Project.id;
		if(data.tentValProj === "" || data.tentValProj === null ){
			this.newObj['tentValProj'] = null;
		}else{
			this.newObj['tentValProj'] = data.tentValProj;        		
		}
		this.newObj['sbunameId'] = data.sbuname.value;
		// member
		if(data.viewDesignMemberAction1 === "" || data.viewDesignMemberAction1 === null){
			this.newObj['designMemberId'] =  null
		}else{
			this.newObj['designMemberId'] =  data.viewDesignMemberAction1.value;          
		}
		if(data.viewDesignMemberAction2 === "" || data.viewDesignMemberAction2 === null){
			this.newObj['procurementMemberId'] = null;
		}else{
			this.newObj['procurementMemberId'] = data.viewDesignMemberAction2.value;
		}
		if(data.viewDesignMemberAction3 === "" || data.viewDesignMemberAction3 === null){
			this.newObj['keyaccountMemberId'] = null
		}else{
			this.newObj['keyaccountMemberId'] = data.viewDesignMemberAction3.value;
		}
		if(data.viewDesignMemberAction4 === "" || data.viewDesignMemberAction4 === null){
			this.newObj['projectmanagementMemberId'] = null
		}else{
			this.newObj['projectmanagementMemberId'] = data.viewDesignMemberAction4.value;
		}     
		//designation
		if(data.viewDesignDesignationAction1 === "" || data.viewDesignDesignationAction1 === null){
			this.newObj['designDesignationId'] =  null  
		}else{
			this.newObj['designDesignationId'] =  data.viewDesignDesignationAction1.value;          
		}
		if(data.viewDesignDesignationAction2 === "" || data.viewDesignDesignationAction2 === null){
			this.newObj['procurementDesignationId'] = null;
		}else{
			this.newObj['procurementDesignationId'] = data.viewDesignDesignationAction2.value;
		}
		if(data.viewDesignDesignationAction3 === "" || data.viewDesignDesignationAction3 === null){
			this.newObj['keyaccountDesignationId'] = null
		}else{
			this.newObj['keyaccountDesignationId'] = data.viewDesignDesignationAction3.value;
		}
		if(data.viewDesignDesignationAction4 === "" || data.viewDesignDesignationAction4 === null){
			this.newObj['projectManagementDesignationId'] = null
		}else{
			this.newObj['projectManagementDesignationId'] = data.viewDesignDesignationAction4.value;
		}
		this.newObj['BoqAddressName'] = data.BoqAddressName;
		this.newObj['builtUpArea'] = data.builtupsqFt;
		this.newObj['status']= "active";
		// this.newObj['fileId'] = 0;
		this.newObj['userId'] = data.userId;
		// FOR LOOP for CLIENT
		this.newObj['clientsideData'] =[];
		if(data.Parameter.length > 0){
			for(var i=0;i<data.Parameter.length;i++){
				var dataOBj = data.Parameter[i];
				var obj ={}
				var strclientDesignationName =null;
				var strclientDesignationIds =null;
				for(var j=0;j<dataOBj.clientDesignation.length;j++){
					var data2Obj = dataOBj.clientDesignation[j];
					if(j === 0){
						strclientDesignationName = data2Obj.label
						strclientDesignationIds = data2Obj.value
					}else{
						strclientDesignationName+= ',' + data2Obj.label
						strclientDesignationIds+= ',' + data2Obj.value
					}
				} 
				obj['clientDesignationId'] = strclientDesignationIds;
				obj['clientDesignationName'] = strclientDesignationName;
				if(dataOBj.clientotherDesignation === "" || dataOBj.clientotherDesignation === null || dataOBj.clientotherDesignation === undefined){
					obj['clientotherDesignation'] = null;
				}else{
					obj['clientotherDesignation'] = dataOBj.clientotherDesignation;
				}
				if(dataOBj.teamDataEmail ==="" || dataOBj.teamDataEmail === null){
					obj['clientEmail'] = null;
				}else{
					obj['clientEmail'] = dataOBj.teamDataEmail;
				}
				if(dataOBj.teamDataMobile === "" || dataOBj.teamDataMobile === null){
					obj['clientMobile'] = null;
				}else{
					obj['clientMobile'] = dataOBj.teamDataMobile;
				}
				obj['clientName'] = dataOBj.teamDataName;
				this.newObj['clientsideData'].push(obj);
			  }
		}
		// FILE SIDE DATA
		this.newObj['fileData'] =[];
		if(data.fileData.length > 0){
			for(var i=0;i<data.fileData.length;i++){
				var dataOBj = data.fileData[i];
				var obj ={};
				if(dataOBj.fileDesc1 === "" || dataOBj.fileDesc1 === null){
					obj['fileDescription'] = null;
				}else{
					obj['fileDescription'] = dataOBj.fileDesc1;
				}
				// obj['fileId'] = 0;
				obj['fileName'] = dataOBj.fileName1;
				var childList2 = []; 
				for(var j= 0 ; j < dataOBj.uploadfile.length;j++){
					var data2Obj = dataOBj.uploadfile[j];
					var itemObj = {};
					if(data2Obj.hasOwnProperty('filePath')){
						itemObj['uploadfilePath'] = data2Obj.filePath																		
					}
					if(data2Obj.hasOwnProperty('path')){
						itemObj['uploadfilePath'] = data2Obj.path																		
					}
					if(data2Obj.hasOwnProperty('filename')){
						itemObj['uploadfileName'] = data2Obj.filename																		
					}
					if(data2Obj.hasOwnProperty('fileName')){
						itemObj['uploadfileName'] = data2Obj.fileName																		
					}
					itemObj['contentType'] = data2Obj.contentType
					// itemObj['fileId'] = 0;
					childList2.push(itemObj)
					obj['uploadFile'] = childList2;
				  }
                  this.newObj['fileData'].push(obj)
			}
		}
		// 
		// procedure data ends here
		
	  // Project Logo code
	  if(this.newObj['actionType'] === 'insert'){
		if (data.projectlogo !== "") {
			this.updateModeLogoDeleted = false;
			const logoFilePath = 'upload/Projects/' + data.siteName + '/ProjectLogo/';
			this.uploadService.FOLDER = logoFilePath;
			const logoFile = this.selectedLogoFiles;
			const optParam = '';
			// added spinner manually
			this.spinner.show();
			this.uploadService.uploadfile(logoFile, optParam, res => {
				// added spinner manually
				this.spinner.hide();
			  console.log("res", res);
			  if (res['success']) {
				// this.newObj['projectLogoName'] = this.selectedLogoFiles['0'].name;
				this.submitProjectLogo = res.respArray[0].path;
				this.newObj['projectLogoName'] = res.respArray[0].fileName;
				this.newObj['projectLogoSrc'] = res.respArray[0].path;  
				this.newObj['projectLogoType'] = res.respArray[0].contentType;
				// call api from this method
				this.apiCallMethod(this.newObj);
			  }
			  })
			  }
	}else{
		if(this.selectedLogoFiles !== undefined && this.selectedLogoFiles.length > 0){
			const logoFilePath = 'upload/Projects/' + data.siteName + '/ProjectLogo/';
			this.uploadService.FOLDER = logoFilePath;
			const logoFile = this.selectedLogoFiles;
			const optParam = '';
			// added spinner manually
			this.spinner.show();
			this.uploadService.uploadfile(logoFile, optParam, logoRes => {
				// added spinner manually
				this.spinner.hide();
			  console.log("logoRes", logoRes);
			  if (logoRes['success']) {
				  this.updateModeLogoDeleted =true;
				// this.newObj['projectLogoName'] = this.selectedLogoFiles['0'].name;
				this.updateProjectLogo = logoRes.respArray[0].path;
				this.newObj['projectLogoName'] = logoRes.respArray[0].fileName;
				this.newObj['projectLogoSrc'] = logoRes.respArray[0].path;  
				this.newObj['projectLogoType'] = logoRes.respArray[0].contentType;
				// call api from this method
				this.apiCallMethod(this.newObj);
			  }else{
				//   this.addprojected = true;
				//   this.message = 'Error in uploading file from AWS'
		this._communicationService.backendError = true;
			  }
			  })
		}else{
			this.updateModeLogoDeleted =false;
			this.newObj['projectLogoName'] = this.imageArrayEdit['projectLogoName'];
			this.newObj['projectLogoSrc'] = this.imageArrayEdit['projectLogoSrc'];
			this.newObj['projectLogoType'] = this.imageArrayEdit['projectLogoType'];
			// call api from this method
			this.apiCallMethod(this.newObj);						  
		}
	}
	//logo ends here
	}

	delfrmAws() {
		this.uploadService.deleteFile({}, [], this.deleteS3Arr[0], res => {
			if (res["success"]) {
				this.deleteS3Arr.shift();
				if (this.deleteS3Arr.length === 0) {
					this._communicationService.loader = false;
				this.message = "Project Updated Successfully"				
					this.addprojected = true;
				} else {
					this.delfrmAws();
				}
				console.log("inside 829==>deleted");
			} else {
				//Push the "this.deleteS3Arr" Array  in Db
				this._communicationService.loader = false;
				// this.addprojected = true;
				// this.message = "line 952--Error in Deleting Files from Aws "				
				console.log("inside 833== error in deleting")
		this._communicationService.backendError = true;
			}
		})
	}

	/**Added by Amol */

	get clientName() {
		return this.form.get('clientName');
	}
	get addressLine1() {
		return this.form.get('addressLine1');
	}
	get addressLine2() {
		return this.form.get('addressLine2');
	}
	get Date3() {
		return this.form.get('Date3');
	}
	get Date4() {
		return this.form.get('Date4');
	}
	get siteName() {
		return this.form.get('siteName');
	}
	get initialCity() {
		return this.form.get('initialCity');
	}

	get initialState() {
		return this.form.get('initialState');
	}
	get sqFt() {
		// console.log("checking sq.ft change ==============>");
		return this.form.get('sqFt');
	}
	get Project() {
		return this.form.get('Project');
	}

	get fileName1() {
		return this.form.get('fileName1');
	}
	get fileDesc1() {
		return this.form.get('fileDesc1');
	}

	get clientDesignation() {
		return this.form.get('clientDesignation');
	}
	get teamDataName() {
		return this.form.get('teamDataName');
	}

	get clientotherDesignation() {
		return this.form.get('clientotherDesignation');
	}
	get teamDataOtherDesc() {
		return this.form.get('teamDataOtherDesc');
	}

	get teamDataEmail() {
		return this.form.get('teamDataEmail');
	}

	get teamDataMobile() {
		return this.form.get('teamDataMobile');
	}
	get projectlogo(){
		return this.form.get('projectlogo');
	}
	get BoqAddressName(){
		return this.form.get('BoqAddressName');
	}
	get builtupsqFt(){
		return this.form.get('builtupsqFt')
	}
	get tentValProj(){
		return this.form.get('tentValProj')
	}
	get initialPincode(){
		return this.form.get('initialPincode')
	}
	/** For File Upload */


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

	// popup Code
	display: boolean = false;
	deleteFrom;

	closeDialog() {
		this.filepopup = false;
		this.display = false;
	}

	onkeyup(evt, type) {
		evt.target.value = this.validationService.KeyUpValidation(type, evt.target.value);
	}


	onBlurvalidation(evt, type, index) {
		console.log(evt);
		let error = [];
		error = this.validationService.BlurValidation(type, evt.target.value);
		if (type === 'Email') {
			if (error != undefined) {
				this.Email1flag[index] = error['validationFlag'];
				this.Email1Errormsg[index] = error['msg'];
				this.ErrormsgType[index] = error['type'];
			}
		}
	}

	// new autocomplete code

	// clientName autocomplete dropdown***
	// clientNameresults: labelid[] = [{label:"airtel",id:1},{label:"jio",id:2}];
	clientNameresults: labelid[] = [];
	filteredclientName: labelid[] = [];
	searchclientName(event) {
		this.filteredclientName = this.clientNameresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}
	clientNamedropdown() {
		console.log("rohit check");
		this.filteredclientName;
	}

	// duplicateProject autocomplete dropdown***
	// duplicateProjectresults: labelid[] = [{label:"vodafone",id:1},{label:"uninor",id:2}];
	duplicateProjectresults: labelid[] = [];
	filteredduplicateProject: labelid[] = [];
	searchduplicateProject(event) {
		this.filteredduplicateProject = this.duplicateProjectresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}
	duplicateProjectdropdown() {
		this.filteredduplicateProject;
	}

	// City autocomplete dropdown***
	Cityresults: labelid[] = [{ label: "mumbai", id: 1 }, { label: "delhi", id: 2 }];
	filteredCityarray: labelid[] = [];
	searchCity(event) {
		this.filteredCityarray = this.Cityresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}
	Citydropdown() {
		this.filteredCityarray;
	}

	// initialCity autocomplete dropdown***
	// initialCityresults: labelid[] = [{label:"initial mumbai",id:1},{label:"initial delhi",id:2}];
	initialCityresults: labelid[] = [];
	filteredinitialCity: labelid[] = [];
	searchinitialCity(event) {
		this.filteredinitialCity = this.initialCityresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}
	initialCitydropdown() {
		this.filteredinitialCity;
	}

	// initialState autocomplete dropdown***
	// initialStateresults: labelid[] = [{label:"initial mumbai",id:1},{label:"initial delhi",id:2}];
	initialStateresults: labelid[] = [];
	filteredinitialState: labelid[] = [];
	searchinitialState(event) {
		this.filteredinitialState = this.initialStateresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}
	initialStatedropdown() {
		this.filteredinitialState;
	}

	// salesmanager autocomplete dropdown***
	// salesManagerdropdownresults: labelid[] = [{label:"sales manager",id:1},{label:"sales manager2",id:2}];
	salesManagerdropdownresults: labelid[] = [];
	filteredsalesManager: labelid[] = [];
	searchsalesManager(event) {
		this.filteredsalesManager = this.salesManagerdropdownresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}
	salesManagerdropdown() {
		this.filteredsalesManager;
	}

	// area autocomplete dropdown***
	// arearesults: labelid[] = [{label:"100sqft",id:1},{label:"200sqft",id:2}];
	// filteredarearesults: labelid[] = [];
	// searcharea(event) {
	//     this.filteredarearesults = this.arearesults
	//         .filter(data => data.label.toString()
	//             .toLowerCase()
	//             .indexOf(event.query.toString().toLowerCase()) !== -1);
	// }
	// areadropdown() {
	//     this.filteredarearesults;
	// }

	// projecttype autocomplete dropdown***
	// projecttyperesults: labelid[] = [{label:"project1",id:1},{label:"project2",id:2}];
	projecttyperesults: labelid[] = [];
	filteredprojecttype: labelid[] = [];
	searchprojecttype(event) {
		this.filteredprojecttype = this.projecttyperesults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}
	projecttypedropdown() {
		this.filteredprojecttype;
	}

	fileLenderArr = [];
	uploadfiledata(evt, index, FileSideGroup) {
		console.log("inside upload")
		let Count = 0;
		// if ( this.fileLenderArrlength === undefined && this.fileLenderArrlength[index] === undefined ) {
		// this.fileLenderArrlength[index] = false;
		// }
		if (this.fileLenderArr[index] !== undefined && this.fileLenderArr[index].length !== 0) {
			let fileLength = this.fileLenderArr[index].length;
			for (let i = 0; i < evt.target['files'].length; i++) {
				if (this.fileLenderArr[index][Count].name !== evt.target['files'][i].name) {
					Count++;
					this.fileLenderArr[index][fileLength] = evt.target['files'][i];
					fileLength = this.fileLenderArr[index].length;
				}
				// console.log(this.fileupload);
				if (this.fileLenderArr[index].length > 0) {
					this.fileLenderArrlength[index] = true;
				}
			}
			this.fileupload['FileSideGroup'][index] = Object.assign({}, this.fileLenderArr[index]);
			// this.fileupload[index] = Object.assign({}, this.fileLenderArr[index]);
		} else {
			if (this.fileupload['FileSideGroup'] === undefined) {
				this.fileupload['FileSideGroup'] = {};
			}
			this.fileupload['FileSideGroup'][index] = evt.target['files'];
			this.fileLenderArr[index] = Array.from(evt.target['files']);
			if (this.fileLenderArr[index].length > 0) {
				this.fileLenderArrlength[index] = true;
			}
		}
		console.log("inside upload==>this.fileupload['FileSideGroup'][index]",this.fileupload['FileSideGroup'][index])
	}

	fileupload = {};

	fileLenderArrlength = [];
	newfile2DelInd;
	newObject;
	callDelete(){
		if(this.fileDelete === "s3fileDelete"){
			this.deletefromDBnAWSNew(this.newdeletefrom, this.newevt, this.newitem, this.newindex)
		}else if(this.fileDelete === "outerfileDelete"){ 
			this.deleteattachfileNew();
		} else if( this.fileDelete === "innerfileDelete") {
			this.deleteARenderFileNew(this.newfile2DelInd, this.newObject);
		}


	}
	deleteARenderFile(file2DelInd, fileIndex) {
		this.newfile2DelInd = file2DelInd;
		this.newObject = fileIndex;
		this.fileDelete = "innerfileDelete";
		this.display = true;
		this.filepopup = true;
		console.log(this.newfile2DelInd,this.newObject )

	}

	// city
	showcity(data) {
		this.form.patchValue({
			initialCity: ''
		})
		this.initialCityresults = [];
		console.log("on click of state details", data)
		this.objcitydata = { actionType: "showCity", id: data.id }
		console.log("this.objcitydata", this.objcitydata)
		this._commonNodeCallService.GetStateCity(this.objcitydata).subscribe(res => {
			console.log("city details", res)
			if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
						this.initialCityresults.push({ label: element.city_name, id: element.id });
					});
                }
            }else{
                this._communicationService.backendError = true;                        
            }
		})
	}

	sbuDropdownSelected(data) {
		this.form.patchValue({
			viewDesignMemberAction1: '',
			viewDesignMemberAction2: '',
			viewDesignMemberAction3: '',
			viewDesignMemberAction4: '',
			viewDesignDesignationAction1: '',
			viewDesignDesignationAction2: '',
			viewDesignDesignationAction3: '',
			viewDesignDesignationAction4: '',
		})
		this.design_team_member_data = [];
		this.design_team_member_data1 = [];
		this.procurement_team_member_data = [];
		this.procurement_team_member_data1 = [];
		this.kam_team_member_data = [];
		this.kam_team_member_data1 = [];
		this.projectmanager_team_member_data = [];
		this.projectmanager_team_member_data1 = [];

		this.design_team_designation_data = [];
		this.design_team_designation_data1 = [];
		this.procurement_team_designation_data = [];
		this.procurement_team_designation_data1 = [];
		this.kam_team_designation_data = [];
		this.kam_team_designation_data1 = [];
		this.projectmanager_team_designation_data = [];
		this.projectmanager_team_designation_data1 = [];

		// id to be sent ==> GetEmployeeBySbu
		console.log("sbu dropdown value", data.value.value)
		var sbuidobj = { id: data.value.value }
		console.log("sbuidobj", sbuidobj);
		this._commonNodeCallService.GetEmployeeBySbu(sbuidobj).subscribe(res => {
			console.log("(Members)employees by sbu id", res)
			if(res['success']){
                if(res['results'].length > 0){
                    res['results'].forEach(element => {
						this.design_team_member_data1.push({ label: element.name, value: element.id });
						this.procurement_team_member_data1.push({ label: element.name, value: element.id });
						this.kam_team_member_data1.push({ label: element.name, value: element.id });
						this.projectmanager_team_member_data1.push({ label: element.name, value: element.id });
					});
					this.design_team_member_data = this.design_team_member_data1;
					this.procurement_team_member_data = this.procurement_team_member_data1;
					this.kam_team_member_data = this.kam_team_member_data1;
					this.projectmanager_team_member_data = this.projectmanager_team_member_data1;
                }
            }else{
                this._communicationService.backendError = true;                        
            }
		})
		// designation
		this._commonNodeCallService.GetDesignation().subscribe(res => {
			console.log("Designations fetched", res)
			if(res['success']){
                if(res['results'].length > 0){
					res['results'].forEach(element => {
						this.design_team_designation_data1.push({ label: element.desg_name, value: element.id });
						this.procurement_team_designation_data1.push({ label: element.desg_name, value: element.id });
						this.kam_team_designation_data1.push({ label: element.desg_name, value: element.id });
						this.projectmanager_team_designation_data1.push({ label: element.desg_name, value: element.id });
	
					});
					this.design_team_designation_data = this.design_team_designation_data1;
					this.procurement_team_designation_data = this.procurement_team_designation_data1;
					this.kam_team_designation_data = this.kam_team_designation_data1;
					this.projectmanager_team_designation_data = this.projectmanager_team_designation_data1; 
                }
            }else{
                this._communicationService.backendError = true;                        
            }
		})
	}


	ValidateDateStart(value) {
		//getting user selected date
		var userdate = new Date(value);
		this.useryearStart = userdate.getFullYear(),
			this.usermonthStart = ("0" + (userdate.getMonth() + 1)).slice(-2),
			this.userdayStart = ("0" + userdate.getDate()).slice(-2);
		console.log("userdate", userdate)
		console.log("useryearStart", this.useryearStart)
		console.log("usermonthStart", this.usermonthStart)
		console.log("userdayStart", this.userdayStart)
		if (this.usermonthStart == "01") {
			this.usermonthStart = "January"
		}
		else if (this.usermonthStart == "02") {
			this.usermonthStart = "February"
		}
		else if (this.usermonthStart == "03") {
			this.usermonthStart = "March"
		} else if (this.usermonthStart == "04") {
			this.usermonthStart = "April"
		} else if (this.usermonthStart == "05") {
			this.usermonthStart = "May"
		} else if (this.usermonthStart == "06") {
			this.usermonthStart = "June"
		} else if (this.usermonthStart == "07") {
			this.usermonthStart = "July"
		} else if (this.usermonthStart == "08") {
			this.usermonthStart = "August"
		} else if (this.usermonthStart == "09") {
			this.usermonthStart = "September"
		} else if (this.usermonthStart == "10") {
			this.usermonthStart = "October"
		} else if (this.usermonthStart == "11") {
			this.usermonthStart = "November"
		} else if (this.usermonthStart == "12") {
			this.usermonthStart = "December"
		}
		this.commonStartdate = this.userdayStart + " " + this.usermonthStart + " " + this.useryearStart;
		// update mode
		// if(this.updateCalenderJourney == true){
		// this.commonStartdate=this.userdayStart+" "+this.usermonthStart+" "+this.useryearStart;
		// console.log("UPDATE===commonStartdate",this.commonStartdate)		
		// }
		// // save mode
		// else{
		// this.commonStartdate=this.userdayStart+" "+this.usermonthStart+" "+this.useryearStart;
		// console.log("SUBMIT===commonStartdate",this.commonStartdate)
		// }



	}
	useryearEnd;
	usermonthEnd;
	userdayEnd;
	Enddate;
	ValidateDateEnd(value) {
		//getting user selected date
		var userdate = new Date(value);
		this.useryearEnd = userdate.getFullYear(),
			this.usermonthEnd = ("0" + (userdate.getMonth() + 1)).slice(-2),
			this.userdayEnd = ("0" + userdate.getDate()).slice(-2);
		console.log("useryearEnd", this.useryearEnd)
		console.log("usermonthEnd", this.usermonthEnd)
		console.log("userdayEnd", this.userdayEnd);
		if (this.usermonthEnd == "01") {
			this.usermonthEnd = "January"
		}
		else if (this.usermonthEnd == "02") {
			this.usermonthEnd = "February"
		}
		else if (this.usermonthEnd == "03") {
			this.usermonthEnd = "March"
		} else if (this.usermonthEnd == "04") {
			this.usermonthEnd = "April"
		} else if (this.usermonthEnd == "05") {
			this.usermonthEnd = "May"
		} else if (this.usermonthEnd == "06") {
			this.usermonthStart = "June"
		} else if (this.usermonthEnd == "07") {
			this.usermonthEnd = "July"
		} else if (this.usermonthEnd == "08") {
			this.usermonthEnd = "August"
		} else if (this.usermonthEnd == "09") {
			this.usermonthEnd = "September"
		} else if (this.usermonthEnd == "10") {
			this.usermonthEnd = "October"
		} else if (this.usermonthEnd == "11") {
			this.usermonthEnd = "November"
		} else if (this.usermonthEnd == "12") {
			this.usermonthEnd = "December"
		}
		this.Enddate = this.userdayEnd + " " + this.usermonthEnd + " " + this.useryearEnd;
		// if(this.updateCalenderJourney == true){
		// 	this.Enddate=this.userdayEnd+" "+this.usermonthEnd+" "+this.useryearEnd;	
		// 	console.log("UPDATE===Enddate",this.Enddate)							
		// }else{
		// 	this.Enddate=this.userdayEnd+" "+this.usermonthEnd+" "+this.useryearEnd;
		// 	console.log("SUBMIT===Enddate",this.Enddate)			
		// }		
	}

	multiselectfun(data, index) {
		console.log("multi value", data.value.length)
		if (data.value.length > 0) {
			for (var i = 0; i < data.value.length; i++) {
				if (data.value[i].label == "Other") {
					console.log("Other is selected")
					this.Activeindex.push(index);
					console.log("OTHER selected", this.Activeindex);
					// ADD FORMCONTROL 
					this.form.controls.Parameter['controls'][index].addControl('clientotherDesignation', new FormControl("", [Validators.required,this.validateClientName.bind(this)]));
					break;
				}
				else {
					this.Activeindex = this.Activeindex.filter(item => item !== index)
					console.log("Not selected", this.Activeindex);
					//REMOVE FORMCONTROL             
					this.form.controls.Parameter['controls'][index].removeControl('clientotherDesignation');
				}
			}
		}
		else {
			this.Activeindex = this.Activeindex.filter(item => item !== index)
			console.log("Not selected", this.Activeindex);
			//REMOVE FORMCONTROL                        
			this.form.controls.Parameter['controls'][index].removeControl('clientotherDesignation');
		}
	}


	onkeyDownAllFields() {
		this._communicationService.backendError = false;
		this.formerror = false;
		this.addprojected = false;
		this.otherDesignationDuplicate = false;
		this.clientNameDuplicate =false;
		this.fileNameDuplicate =false;
		
	}
	focusProjectName(){
		this.duplicateProject = false;
	}
	// client delete popup
	deleteClient() {
		this.onkeyDownAllFields();
		this.parameters.removeAt(this.clientRemoveIndex);
		this.cliensidepopup = false;
		this.display = false;
	}
	closeDialogClient() {
		this.cliensidepopup = false;
		this.display = false;
	}

	delAwsDbfiles = {};
	newdeletefrom;
	newevt;
	newitem;
	newindex;
	deletefromDBnAWS(deletefrom, evt, item, index) {
		this.fileDelete = "s3fileDelete";
		this.newdeletefrom = deletefrom;
		this.newevt = evt;
		this.newitem = item;
		this.newindex = index
		this.display= true;
		this.filepopup = true;
	}

	// Handler
	handleEditFileStoreage() {
		//let executeOnce = true;
		if (this.filedataarray.value.length > 0) {
			for (let i = 0; i < this.filedataarray.value.length; i++) {
				if (this.updateModeFileupload['FileSideGroup'] !== undefined && this.updateModeFileupload['FileSideGroup'].length > 0) {
					if (this.filedataarray.value[i]['uploadfile'] === "") {
						this.filedataarray.value[i]['uploadfile'] = [];
					}
					let paramData = this.filedataarray.value[i]['uploadfile'];
					if (this.updateModeFileupload['FileSideGroup'][i] !== undefined) {
						let tempArray = this.updateModeFileupload['FileSideGroup'][i];
						for (let j = 0; j < tempArray.length; j++) {
							paramData.push(tempArray[j].obj);
						}
					}
					this.filedataarray.value[i]['uploadfile'] = paramData;
				}
			}
		}
	}
	// 

	// multiselect onlick to show other designation
	changeValue(data, index) {
		console.log("data and index", data, index)
		// var obj ={}
		// this.multiselectdataArray = data;
		if (data.length > 0) {
			console.log("data is greater than 0 in if block")
			for (var i = 0; i < data.length; i++) {
				var dataobj = data[i];
				if (dataobj.label === "Other") {
					// add control
					console.log("OTHER selected", this.Activeindex);
					this.Activeindex.push(index);
					this.form.controls.Parameter['controls'][index].addControl('clientotherDesignation', new FormControl("", [Validators.required,this.validateClientName.bind(this)]));
					break;
				}
				else {
					this.Activeindex = this.Activeindex.filter(item => item !== index)
					console.log("Not selected", this.Activeindex);
					//REMOVE FORMCONTROL             
					this.form.controls.Parameter['controls'][index].removeControl('clientotherDesignation');
				}
			}
		} else {
			console.log("data is 0 so remove  in else block")
			this.Activeindex = this.Activeindex.filter(item => item !== index)
			console.log("Not selected", this.Activeindex);
			//REMOVE FORMCONTROL             
			this.form.controls.Parameter['controls'][index].removeControl('clientotherDesignation');
		}
	}

	redirectOkButton(){
		sessionStorage.removeItem('projectid');
		this.DbRenderdata = []; // created to store edit journey Render object.		
		this.updateCalenderJourney = false;
		this.editJourney =false;
		this.addprojected =false;
		this.updateModeLogoDeleted = false;
		this.router.navigateByUrl('/Project');
	}

	setEndDateEmpty(){
		this.form.patchValue({
			Date4:''
		})
	}

	uploadlogodata(event) {
		this.S3image = false;
		this.selectedLogoFiles = event.target.files;
  }
  
  apiCallMethod(apidata){
	console.log("data to be sent to Procedure API inside apiCallMethod method",this.newObj);
	this._commonNodeCallService.saveProjectProcedureCall(apidata).subscribe(resData => {
		console.log(resData);
		if (resData["success"]) {
			
			if (this.editJourney) {
				if(this.updateModeLogoDeleted){
					console.log("project logo updated mode deleted src path",this.imageArrayEdit['projectLogoSrc'])
					this.uploadService.deleteFile([], {}, this.imageArrayEdit['projectLogoSrc'], resp => {
						if (resp["success"]) {
							this.updateModeLogoDeleted = false;
						}else{
							this.updateModeLogoDeleted = false;
							this.addprojected = true;
							this.message = 'Error in Deleting Project Logo from AWS'
						}
					})
				}
				console.log("update mode project logo deleted,now go forward to delete remaining images");
				let Delete = Object.keys(this.delAwsDbfiles)
				if (Delete !== undefined) {
					if (Delete.length > 0) {
						for (let i = 0; i < Delete.length; i++) {
							for (let j = 0; j < this.delAwsDbfiles[Delete[i]].length; j++) {
								if (this.delAwsDbfiles[Delete[i]][j].hasOwnProperty('obj')) {
									this.deleteS3Arr.push(this.delAwsDbfiles[Delete[i]][j].obj.filePath);
								}
							}
						}
						this.delfrmAws();
					}else{
						this._communicationService.loader = false;
						this.message = resData['message'];
						this.addprojected = true;
						// check this if you eant to remove or keep
						sessionStorage.removeItem('projectid');
						this.form.reset();
						while (this.parameters.length !== 0) {
							this.parameters.removeAt(0)
						}
						while (this.filedataarray.length !== 0) {
							this.filedataarray.removeAt(0)
						}
					}
				}
			} else {
				this._communicationService.loader = false;
				this.message = resData['message'];
						this.addprojected = true;
						// check this if you eant to remove or keep
						sessionStorage.removeItem('projectid');
						this.form.reset();
						while (this.parameters.length !== 0) {
							this.parameters.removeAt(0)
						}
						while (this.filedataarray.length !== 0) {
							this.filedataarray.removeAt(0)
						}
			}
		} else {
			// this._communicationService.loader = false;
			// this._communicationService.commonErrorPopup = true;
			// this._communicationService.commonErrorPopupMsg = resData['message'];
			// this._communicationService.reDirectionURL = '/projects_page';
			if(resData['duplicateProject']){
				this.duplicateProject = true;
				this.duplicateProjectErrorMsg =resData['message'];
			}else{
				if(resData['statusCode'] === 401){
					this.router.navigateByUrl('/login');
				}else{
				this._communicationService.backendError = true;
				setTimeout(()=>{    //<<<---    using ()=> syntax
					window.location.reload();				
			   }, 3000); 
				}
			}
			console.log("this.onS3ErrorDeluploadFile==>",this.onS3ErrorDeluploadFile);
			// delete files which are uploaded
			if(this.onS3ErrorDeluploadFile.length > 0){
				for (let l = 0; l < this.onS3ErrorDeluploadFile.length; l++) {
					let extaParam = {}
					extaParam['finalDeleteCounter'] = l;
					this.uploadService.deleteFile([], {}, this.onS3ErrorDeluploadFile[l], res => {
						if (res["success"]) {
							if (this.onS3ErrorDeluploadFile.length === res['finalDeleteCounter']) {
							console.log("all files deleted sucessfully after error from db");
							}
						}else{
							console.log("error in deletinf file from aws after error from db")
						this._communicationService.backendError = true;
						}
					});
				}
			}
			// LOGO CHECK for DELETING in Insert or Update Mode
			if(this.updateModeLogoDeleted){
				// in edit mode logo has been uploaded- then delete it on error from db
				this.uploadService.deleteFile([], {}, this.updateProjectLogo, resp =>{
					if(resp['success']){
						console.log("deleted logo successfully from aws after error from db");
					}else{
						this._communicationService.backendError = true;
					}
				})
			}else{
				// in insert mode logo has been uploaded- then delete it on error from db
				console.log("this.submitProjectLogo==>",this.submitProjectLogo)
				if(this.submitProjectLogo !== ''){
					this.uploadService.deleteFile([], {}, this.submitProjectLogo, res =>{
						if(res['success']){
							console.log("submit mode logo deleted after error from db")
						}else{
							// error on deleting logo upload on submit
							console.log("error on deleting logo which was uploaded on submit"); 
							this._communicationService.backendError = true;
						}
					})
				}
			}
			// if(resData['duplicateProject']){
			// 	// this.initialCounterSubArrylst = 0;
			// }else{
			// 	setTimeout(()=>{    //<<<---    using ()=> syntax
			// 		window.location.reload();				
			//    }, 3000);
			// }
			this._communicationService.loader = false;
			
		}
	});
  }

  //   custom validator for clientOtherdesignation
 validateClientName(control : AbstractControl) : { [key: string]:boolean | null } {
	const clientName = control.value;
	console.log("custom validator clientName",clientName);
	if(clientName !== ''){
		for(var i= 0;i< this.multiselectdataArray.length;i++){
			if(clientName === this.multiselectdataArray[i]){
			return { 'validateClientName': true};
		}
		}
		return null;
	}else{
		return null;
	}
	}

	deletefromDBnAWSNew(deletefrom, evt, item, index) {
		this.onkeyDownAllFields();
		console.log('Rohit  deletefrom', deletefrom);
		// console.log('Event', evt);
		console.log('Rohit item to delete', item);
		if (this.delAwsDbfiles[deletefrom] === undefined) {
			this.delAwsDbfiles[deletefrom] = [];
		}
		if (deletefrom === 'FileSideGroup') {
			if (this.delAwsDbfiles[deletefrom] === undefined) {
				this.delAwsDbfiles[deletefrom] = [];
			}
			for (let i = 0; i < this.DbRenderdata.length; i++) {
				for (let j = 0; j < this.DbRenderdata[i].length; j++) {
					if (this.DbRenderdata[i][j].id === item.id) {
						console.log("Rohit forloop id matched = =", this.DbRenderdata[i][j].id, item.id)
						this.DbRenderdata[i].splice(j, 1);
						console.log("Rohit DbRenderdata", this.DbRenderdata[i])
						console.log("Rohit files to be deleted from s3===>", this.delAwsDbfiles)
					}
				}

			}
			for (let i = 0; i < this.updateModeFileupload["FileSideGroup"].length; i++) {
				for (let j = 0; j < this.updateModeFileupload["FileSideGroup"][i].length; j++) {
					if (this.updateModeFileupload["FileSideGroup"][i][j].id === item.id) {
						this.updateModeFileupload["FileSideGroup"][i].splice(j, 1);
						// ROHIT REMOVED TODAY*******************************
						// if(this.updateModeFileupload["FileSideGroup"][i]===undefined){
						// 	this.updateModeFileupload["FileSideGroup"].splice(i,1);
						// }
					}
				}
			}
			//Object.assign(this.delAwsDbfiles[deletefrom], item);
			this.delAwsDbfiles[deletefrom].push(item);
			console.log("AWS FILES TO BE DELETED ", this.delAwsDbfiles)
		}
		// rohit required validation
		console.log(this.DbRenderdata);
		if(this.DbRenderdata[index].length === 0){
			if(this.fileLenderArr[index] === undefined){
				console.log("LENGTH IS 0 deletefromDBnAWS ===>inside UNDEFINED");
				// PUT VALIDATIONS HERE
				this.form.controls.fileData['controls'][index].controls.uploadfile.clearValidators();
					this.form.controls.fileData['controls'][index].controls.uploadfile.value = '';
					this.form.controls.fileData['controls'][index].controls.uploadfile.setValidators([Validators.required]);
					this.form.controls.fileData['controls'][index].controls.uploadfile.updateValueAndValidity();
			}else{
				if(this.fileLenderArr[index].length === 0){
					console.log("LENGH IS 0 deletefromDBnAWS ===>inside LENGTH 0 CHECK");
				// PUT VALIDATIONS HERE
				this.form.controls.fileData['controls'][index].controls.uploadfile.clearValidators();
					this.form.controls.fileData['controls'][index].controls.uploadfile.value = '';
					this.form.controls.fileData['controls'][index].controls.uploadfile.setValidators([Validators.required]);
					this.form.controls.fileData['controls'][index].controls.uploadfile.updateValueAndValidity();
				}
			}
		}
		// 
		this.filepopup = false;
		this.display = false;
	}

	
	deleteARenderFileNew(file2DelInd, fileIndex) {
		console.log(this.newfile2DelInd,this.newObject )
		this.onkeyDownAllFields();
		console.log("inside smaller delete")
		let data1;
		for (let i = 0; i < this.fileLenderArr[fileIndex].length; i++) {
			if (this.fileLenderArr[fileIndex][i].name === file2DelInd.name) {
				data1 = i;
				break;
			}
		}
		this.fileLenderArr[fileIndex].splice(data1, 1);
		if (this.fileLenderArr[fileIndex].length <= 0) {
			this.fileLenderArrlength[fileIndex] = false;

		}
		this.fileupload['FileSideGroup'][fileIndex] = Object.assign({}, this.fileLenderArr[fileIndex]);
		console.log("deleteARenderFile==>this.fileupload['FileSideGroup'][spaceIndex]",this.fileupload['FileSideGroup'][fileIndex])
	
		// ADDED TODAY
		if (this.fileLenderArr[fileIndex].length === 0) {
			delete this.fileupload["FileSideGroup"][fileIndex];
		}
		let renderlength = Object.keys(this.fileupload["FileSideGroup"]);
		if (renderlength.length === 0) {
			delete this.fileupload["FileSideGroup"];
		}

		//rohit  required validation 
		if(this.fileLenderArr[fileIndex].length === 0){
			// this.form.controls.fileData['controls'][fileIndex].value.uploadfile = '';
			//  this.form.controls.fileData['controls'][fileIndex].controls.uploadfile.clearValidators();
			// this.form.controls.fileData['controls'][fileIndex].controls.uploadfile.setValidators([Validators.required]);
			// this.form.controls.fileData['controls'][fileIndex].value.uploadfile.clearValidators();			
			// this.filedataarray.at(0).patchValue({
			// 	uploadfile:''
			// });
			// this.form.controls.fileData['controls'][fileIndex].value.uploadfile = '';
			console.log("FRESH--",this.fileLenderArr[fileIndex])
			console.log(">>>>>>>deleteARenderFile length is 0");
		}
		if(this.fileLenderArr[fileIndex].length === 0){
			if(this.DbRenderdata[fileIndex] === undefined){
				console.log("LENGTH IS 0 deleteARenderFile ===>inside UNDEFINED");
				this.form.controls.fileData['controls'][fileIndex].controls.uploadfile.clearValidators();
				this.form.controls.fileData['controls'][fileIndex].controls.uploadfile.value = '';
				this.form.controls.fileData['controls'][fileIndex].controls.uploadfile.setValidators([Validators.required]);
				this.form.controls.fileData['controls'][fileIndex].controls.uploadfile.updateValueAndValidity();
				// PUT VALIDATIONS HERE
			}else{
				if(this.DbRenderdata[fileIndex].length === 0){
					console.log("LENGH IS 0 deleteARenderFile ===>inside LENGTH 0 CHECK");
					this.form.controls.fileData['controls'][fileIndex].controls.uploadfile.clearValidators();
					this.form.controls.fileData['controls'][fileIndex].controls.uploadfile.value = '';
					this.form.controls.fileData['controls'][fileIndex].controls.uploadfile.setValidators([Validators.required]);
					this.form.controls.fileData['controls'][fileIndex].controls.uploadfile.updateValueAndValidity();
				// PUT VALIDATIONS HERE
				}
			}
		}
		this.filepopup = false;
		this.display = false;
	}
	deleteattachfileNew() {
		this.onkeyDownAllFields();
		console.log("inside edit mode bigger delete")
		console.log("deleteFrom",this.deleteFrom)	;		
		console.log("editJourney",this.editJourney)	;
		
		// latest code
		if (this.deleteFrom === "FileSideGroup") {
			this.filedataarray.removeAt(this.storeindex);
			if(this.fileupload["FileSideGroup"] !== undefined ){
				let lengthCheck = Object.keys(this.fileupload["FileSideGroup"]);
				if (lengthCheck !== undefined &&
					this.storeindex < lengthCheck.length
				) {
					let tempArr = Object.assign([],this.fileupload["FileSideGroup"]);
					tempArr.splice(this.storeindex, 1);
					this.fileupload["FileSideGroup"] = Object.assign({},tempArr);
					this.fileLenderArr.splice(this.storeindex, 1);
					this.fileLenderArrlength.splice(this.storeindex, 1);
				}
				if (this.fileupload.hasOwnProperty('FileSideGroup')) {
					let renderlength = Object.keys(this.fileupload["FileSideGroup"]);
					if (renderlength.length === 0) {
						delete this.fileupload["FileSideGroup"];
					}
				}
			}
			if (this.editJourney) {
				let uniquedata;
				if (this.updateModeFileupload.hasOwnProperty("FileSideGroup")) {
					if(this.updateModeFileupload["FileSideGroup"][this.storeindex]!==undefined){
						if (this.updateModeFileupload["FileSideGroup"][this.storeindex].length > 0) {
							uniquedata = this.updateModeFileupload["FileSideGroup"].splice(
								this.storeindex,
								1
							);
							if (this.delAwsDbfiles["FileSideGroup"] === undefined) {
								this.delAwsDbfiles["FileSideGroup"] = [];
							}
						}else{
							this.updateModeFileupload["FileSideGroup"].splice(this.storeindex,1);
						}
					}
				}
				if (uniquedata !== undefined && uniquedata.length[0] > 0) {
					for (let i = 0; i < uniquedata[0].length; i++) {
						this.delAwsDbfiles["FileSideGroup"].push(uniquedata[0][i]);
					}
				}
				this.DbRenderdata = this.updateModeFileupload["FileSideGroup"];
			}
		}
		this.filepopup = false;
		this.display = false;
		// latest code ends here
	}

	/**Add Client */
	displayaddnewvariant = false;
	AddClient(){
		this._communicationService.addnewClientJourney = "addnewProject";
		this.displayaddnewvariant = true;
	}
}


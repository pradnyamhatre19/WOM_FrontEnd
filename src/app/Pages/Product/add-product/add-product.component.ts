import { FrontEndValidationService } from "src/app/services/Validation/front-end-validation.service";
import { Component, OnInit } from "@angular/core";
import { CommunicateService } from "src/app/services/Communication/communicate.service";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { CommonCallService } from "src/app/services/CommonNodeCall/common-call.service";
import { UploadfileService } from "src/app/services/FileUpload/uploadfile.service";
import { Boolean } from "aws-sdk/clients/redshift";
import { SpinnerVisibilityService } from "ng-http-loader";
import { Router } from "@angular/router";

export class labelid {
	label: string
	id: number
}

@Component({
	selector: "app-add-product",
	templateUrl: "./add-product.component.html",
	styleUrls: ["./add-product.component.css"]
})
export class AddProductComponent implements OnInit {
	multipler: any = [];
	imageArrayEdit: any;
	form: FormGroup;
	formerror;
	imagedata;
	imageName;
	catId;
	subCatId;
	selectedFiles: FileList; // created for fileUpload contain all files in array of Object format
	errorList: any[] = [];
	pId;
	display_message_for_product_msg: boolean = false;
	message;
	editBoolean: Boolean = false;

	constructor(
		public _communicationService: CommunicateService,
		private validationService: FrontEndValidationService,
		private _commonNodeCallService: CommonCallService,
		private uploadService: UploadfileService,
		private spinner: SpinnerVisibilityService,
		private router:Router
	) {
		this.formerror = false;
		this.form = new FormGroup({
			category: new FormControl('', [Validators.required]),
			subcategory: new FormControl('', [Validators.required]),
			productName: new FormControl('', [Validators.required, Validators.minLength(3)]),
			sku: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(this._communicationService.pattern.alphanumericWithUnderscore)]),
			type: new FormControl('', [Validators.required]),
			image: new FormControl(''),
			initialQuantity: new FormControl('', [Validators.required]),
			// price: new FormControl('', [Validators.required, Validators.pattern(this._communicationService.pattern.decimal)]),
			// costprice: new FormControl(this._communicationService.productCost),
			// retailprice: new FormControl('', [Validators.required, Validators.pattern(this._communicationService.pattern.decimal)]),
			// saleprice: new FormControl('', [Validators.pattern(this._communicationService.pattern.decimal)]),
			price: new FormControl('', [Validators.required, Validators.pattern(this._communicationService.pattern.decimalwithcommas)]),
			costprice: new FormControl(this._communicationService.productCost),
			retailprice: new FormControl('', [Validators.required, Validators.pattern(this._communicationService.pattern.decimalwithcommas)]),
			saleprice: new FormControl('', [Validators.pattern(this._communicationService.pattern.decimalwithcommas)]),
			weight: new FormControl('', [Validators.pattern('')]),
			width: new FormControl('', [Validators.pattern(this._communicationService.pattern.unit)]),
			height: new FormControl('', [Validators.pattern(this._communicationService.pattern.unit)]),
			dept: new FormControl('', [Validators.pattern(this._communicationService.pattern.unit)]),
			description: new FormControl('', [Validators.required]),
			viewdescription: new FormControl(''),
			item: new FormControl('', [Validators.required])
		})
		this._communicationService.backendError = false;
	}
	edit = false;
	ProductName;
	CategoryName;
	SubCategoryName;
	viewdescription = "";
	showdescription: boolean = false;
	paramData = [];
	S3imagename;
	S3image = false;
	UserDetails;
	ngOnInit() {
		let catId = 0;
		let subCatId = 0;
		let itemId = 0;
		this.UserDetails = JSON.parse(sessionStorage.getItem('userinfo'))[0];
		this._communicationService.productupdate.subscribe(data => {
			if (data != "") {
				this.editBoolean = true;
				var idObj = { 'id': data.id }
				this.pId = data.id;
				this._commonNodeCallService.GetProductById(idObj).subscribe(data => {
					if (data['success']) {
						this._communicationService.backendError = false;
						this._communicationService.loader = false;
						let imageObj = {};
						this._communicationService.paramDetails = data["results"][0].paramData
						imageObj['image_name'] = data["results"][0]['image_name'];
						imageObj['image_type'] = data["results"][0]['image_type'];
						imageObj['product_src'] = data["results"][0]['product_src'];
						imageObj = Object.assign([], imageObj);
						var dataToDisplay = data['results'][0];
						catId = dataToDisplay.category_id;
						subCatId = dataToDisplay.subCategory_id;
						itemId = dataToDisplay.item_id;
						var nestedProperties = dataToDisplay.image_name.split('_');
						this.form.get('image').clearValidators();
						var dbWidth = dataToDisplay.width;
						var dbWeight = dataToDisplay.weight;
						var dbHeight = dataToDisplay.height;
						var dbDept = dataToDisplay.dept;

						if(dataToDisplay.width === "null"){
							dbWidth = ''
						}
						if(dataToDisplay.weight === "null"){
							dbWeight = ''
						}
						if(dataToDisplay.height === "null"){
							dbHeight = ''
						}
						if(dataToDisplay.dept === "null"){
							dbDept = ''
						}
						this.form.patchValue({
							category: { 'label': dataToDisplay.catName, 'id': dataToDisplay.category_id },
							subcategory: { 'label': dataToDisplay.subcatName, 'id': dataToDisplay.subCategory_id },
							item: { 'label': dataToDisplay.itemName, 'id': dataToDisplay.item_id },
							productName: dataToDisplay.name,
							sku: dataToDisplay.sku_no,
							type: { 'label': dataToDisplay.type },
							image: imageObj,
							initialQuantity: dataToDisplay.initial_quantity,
							price: dataToDisplay.price,
							costprice: dataToDisplay.cost_price,
							retailprice: dataToDisplay.reatil_price,
							saleprice: dataToDisplay.sale_price,
							weight: dbWeight,
							width: dbWidth,
							height: dbHeight,
							dept: dbDept,
							description: dataToDisplay.decsription,
							viewdescription: dataToDisplay.view_description
						})
						this.form.get('image').setValidators([Validators.required]);
						this.imageArrayEdit = imageObj;
						this.S3image = true;
						this.S3imagename = imageObj['image_name'].substring(imageObj['image_name'].indexOf('_') + 1, imageObj['image_name'].length);
						this.viewdescription = dataToDisplay.view_description;
						this.showdescription = true;
						var bodyData = { "subCategoryId": subCatId }
						bodyData['categoryId'] = catId;
						bodyData['itemId'] = itemId;

						this.globalArr = []
						this._commonNodeCallService.GetParameters(bodyData).subscribe(res => {
							if(res['success']){
						this._communicationService.backendError = false;
								if (res['results'].length > 0) {
									//this.subCatresults = []
									this.globalArr = [];
									//console.log("res['results']==", res['results'])
									this._communicationService.paramList = [];
									this.paramList = []
									res['results'].forEach(element => {
										let paramCost = 0
										if (element.input != 'String Dropdown') {
											paramCost = element.cost
										}
										this.paramList.push({ "parameter": element.param_name, "options": element.param_option, "input": element.inputTypeName, "cost": paramCost, "id": element.id });
										if (element.paramArray.length > 0) {
											var obj = {}
											var valArr = [{ label: "Select", value: null, id: null }]
											obj['name'] = element.param_name;
					
											element.paramArray.forEach(item => {
												valArr.push({ label: item.addvaluesname, id: item.id, value: item.cost })
											})
											obj['value'] = valArr;
											this.globalArr.push(obj)
											//console.log("this.globalArr==", this.globalArr)
											this._communicationService.globalStrDropDown = this.globalArr;
										}
									});
									this._communicationService.paramList = this.paramList;
								} else {
									this.warning_popup = true;
								}
							}else{
								if(data['statusCode'] === 401){
									this.router.navigateByUrl('/login');
								}else{
								this._communicationService.backendError = true;					
								}
							}
								
							// if (res['results'] != "") {
							// 	this._communicationService.paramList = [];
							// 	this.paramList = []
							// 	res['results'].forEach(element => {
							// 		this.paramList.push({ "parameter": element.param_name, "options": element.param_option, "input": element.inputTypeName });
							// 		var obj = {}
							// 		var valArr = [{ label: "Select", value: null, id: null }]
							// 		obj['name'] = element.param_name;

							// 		element.paramArray.forEach(item => {
							// 			valArr.push({ label: item.addvaluesname, value: item.cost, id: item.id })
							// 		})
							// 		obj['value'] = valArr;
							// 		this.globalArr.push(obj)
							// 		console.log("this.globalArr==", this.globalArr)
							// 		this._communicationService.globalStrDropDown = this.globalArr;
							// 	});
							// 	this._communicationService.paramList = this.paramList;
							// 	console.log(this._communicationService.paramList);
							// }
						});
					}else{
						if(data['statusCode'] === 401){
							this.router.navigateByUrl('/login');
						}else{
						this._communicationService.backendError = true;					
						}
					}
				})
				this.edit = true;
				// this.ProductName = data.ProductName;
				// this.CategoryName = "Category 1";
				// this.SubCategoryName = "Sub-Category 1";
				this._commonNodeCallService.GetCategoryListing().subscribe(res => {
			
					if (res['results'] != "") {
						res['results'].forEach(element => {
							this.catresults.push({ label: element.name, id: element.id });
						});
						var data = { "id": catId }
						this._commonNodeCallService.GetSubCategory(data).subscribe(res => {
							if (res['results'] != "") {
								//this.subCatresults = []
								res['results'].forEach(element => {
									this.subCatresults.push({ label: element.name, id: element.id });
								});
									var data = {}
									data['categoryId'] = catId;
									data['subCategoryId'] = subCatId;

									this._commonNodeCallService.GetItemListingBySubCatId(data).subscribe(res => {
										//console.log("item", res)
										if(res['success']){
											this._communicationService.backendError = false;					
											this.itemresults = []
											if (res['results'].length > 0) {
												console.log(res['results'])
												this.multipler = [];
												res['results'].forEach(element => {
													let tempObj = {};
													this.itemresults.push({ label: element.item_name, id: element.id })
													tempObj['id'] = element.id;
													tempObj['multiplier'] = element.multiplier;
													this.multipler.push(tempObj);
													
													// console.log("multiplier");
													// console.log(this.multipler);
												});
												this.currentmultiplier = this.multipler.find(item => { if (item.id === itemId) { return item.multiplier } });
											}
										}else{
											if(data['statusCode'] === 401){
												this.router.navigateByUrl('/login');
											}else{
											this._communicationService.backendError = true;					
											}
										}
										
									})
							}else{
								if(data['statusCode'] === 401){
									this.router.navigateByUrl('/login');
								}
							}
						});
					}else{
						if(data['statusCode'] === 401){
							this.router.navigateByUrl('/login');
						}
					}
				})
			} else {
				this.form.reset();
				this.paramList = [];
				this.itemresults = []
				this.editBoolean = false;
				this.edit = false;
				this.ProductName = "";
				this.CategoryName = "";
				this.SubCategoryName = "";
				this.warning_popup = false;
				this._commonNodeCallService.GetCategoryListing().subscribe(res => {
					if(res['success']){
						this._communicationService.backendError = false;					
						if (res['results'].length > 0) {
							res['results'].forEach(element => {
								this.catresults.push({ label: element.name, id: element.id });
							});
						}
					}else{
						if(data['statusCode'] === 401){
							this.router.navigateByUrl('/login');
						}else{
						this._communicationService.backendError = true;					
						}
					}			
				})
			}
			this._communicationService.loader = false;
			this._communicationService.productdescdata.subscribe(data => {
				if (data != "") {
					//console.log(data);
					//console.log(this.viewdescription);
					this.viewdescription = data;
					this.form.patchValue({
						viewdescription: data,
						costprice: this._communicationService.productCost,
						retailprice: this._communicationService.productCost * this.currentmultiplier.multiplier
					})
					this.showdescription = true;
				}
			})
		});

		
		///console.log(this.productList);

		// getting category from databse
		// this._commonNodeCallService.GetCategorys().subscribe(res => {
		// 	if (res['results'] != "") {
		// 		res['results'].forEach(element => {
		// 			this.catresults.push({ label: element.name, id: element.id });
		// 		});
		// 	}
		// });

	}

	//   autocomplete for categories
	Categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6', 'Category 7', 'Category 8', 'Category 9', 'Category 10'];
	Category;
	filteredCategory = [];
	showtable = false;
	filterdCategory(event) {
		this.filteredCategory = [];
		for (let i = 0; i < this.Categories.length; i++) {
			let Category = this.Categories[i];
			if (Category.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				this.filteredCategory.push(Category);
			}
		}
	}

	//   autocomplete for Price
	Prices = ['Service', 'Product'];
	Price;
	PriceCategory = [];
	priceCategory(event) {
		this.PriceCategory = [];
		for (let i = 0; i < this.Prices.length; i++) {
			let Price = this.Prices[i];
			if (Price.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				this.PriceCategory.push(Price);
			}
		}
	}

	// autocomplete for sub-categories
	SubCategories = ['Sub-Category 1', 'Sub-Category 2', 'Sub-Category 3', 'Sub-Category 4', 'Sub-Category 5', 'Sub-Category 6', 'Sub-Category 7', 'Sub-Category 8', 'Sub-Category 9', 'Sub-Category 10'];
	SubCategory;
	filteredSubCategory = [];

	filterdSubCategory(event) {
		this.filteredSubCategory = [];
		for (let i = 0; i < this.SubCategories.length; i++) {
			let SubCategory = this.SubCategories[i];
			if (SubCategory.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				this.filteredSubCategory.push(SubCategory);
			}
		}
	}

	Cancel() {
		this._communicationService.backendError = false;					
		this.form.reset();
		//console.log("check",this.form)
		this.edit = false;
		this.formerror = false;
		this.catresults = [];
		this.filteredCatresults = [];
		this._communicationService.CancelProduct(false);
	}
	Submit(data) {
		//console.log("=====================",this._communicationService.paramDetails);
		data.paramData = this._communicationService.paramDetails;
		//console.log(data);
		let date = new Date();
		let timestamp = date.getTime();
		data['pId'] = 1;
		data['userId'] = this.UserDetails['user_id'];
		if (this.form.invalid) {
			this.formerror = true;
		} else {
			// to convert comma(,) seperated values to numeric values
			data.price = this._communicationService.removeCommas(data.price);
			data.costprice = this._communicationService.removeCommas(data.costprice);
			data.retailprice = this._communicationService.removeCommas(data.retailprice);
			data.saleprice = this._communicationService.removeCommas(data.saleprice);
			// 
			const filePath = 'upload/product/' + data['sku'] + '/';
			this.uploadService.FOLDER = filePath;
			const file = this.selectedFiles;
			const optParam = {};
			// showing spinner on upload of image
			this.spinner.show();
			this.uploadService.uploadfile(file, optParam, res => {
			// hiding spinner on upload of image
				this.spinner.hide();
				if (res['success']) {
					this._communicationService.backendError = false;
					//console.log('call Submit Method')
					data['imageName'] = res["respArray"][0].fileName;
					data['imageSrc'] = res["respArray"][0].path;
					data['imgType'] = res["respArray"][0].contentType;
					data['actionType'] = 'submit';
					//console.log("data==", data)
					this._commonNodeCallService.SaveProduct(data).subscribe(resData => {
						// console.log(resData);
						// console.log(resData['success']);
						if (resData['success']) {
							this.edit = false;
							this.display_message_for_product_msg = true;
							this.message = resData['message'];
						} else {
							if(resData['statusCode'] === 500){
								this._communicationService.backendError = true;					
							}else{
								if(res['statusCode'] === 401){
									this.router.navigateByUrl('/login');
								}else{
									this.display_message_for_product_msg = false;
								//console.log('errors are present in data..')
								//show error msg on popup only...
								//this.edit = true;
								this.errorList = resData['message'];
								}
								
							}
						}
					});
				}else{
					this._communicationService.backendError = true;
				}
			});
		}
	}
	descriptionData(data) {
		//console.log(data);
		this._communicationService['Prodsku_previewDescriptionerror'] = false;
		this._communicationService.ProductDetailedData(data);
	}

	get category() {
		return this.form.get('category');
	}
	get subcategory() {
		return this.form.get('subcategory');
	}
	get productName() {
		return this.form.get('productName');
	}
	get sku() {
		return this.form.get('sku');
	}
	get type() {
		return this.form.get('type');
	}
	get image() {
		return this.form.get('image');
	}
	get initialQuantity() {
		return this.form.get('initialQuantity');
	}
	get price() {
		return this.form.get('price');
	}
	get costprice() {
		return this.form.get('costprice');
	}
	get saleprice() {
		return this.form.get('saleprice');
	}
	get weight() {
		return this.form.get('weight');
	}
	get width() {
		return this.form.get('width');
	}
	get height() {
		return this.form.get('height');
	}
	get dept() {
		return this.form.get('dept');
	}
	get retailprice() {
		return this.form.get('retailprice');
	}
	get item() {
		return this.form.get('item');
	}
	get description() {
		return this.form.get('description');
	}

	/**Added by Amol */
	onkeyup(evt, type) {
		evt.target.value = this.validationService.KeyUpValidation(type, evt.target.value);
	}

	readThis(inputValue: any): void {
		//console.log(inputValue);
		this.imageName = inputValue.files[0].name;
		//console.log(this.imageName);
		let file: File = inputValue.files[0];
		//console.log(file);
		let myReader: FileReader = new FileReader();
		myReader.onloadend = e => {
			this.imagedata = myReader.result;
		};
		myReader.readAsDataURL(file);
	}


	Update(data) {
		let date = new Date();
		let timestamp = date.getTime();
		data['actionType'] = "update";
		data['pId'] = this.pId;
		data['userId'] = this.UserDetails['user_id'];
		data.paramData = this._communicationService.paramDetails;
		//console.log("data", data);
		if (this.form.invalid) {
			this.formerror = true;
		} else {
			// to convert comma(,) seperated values to numeric values
			data.price = this._communicationService.removeCommas(data.price);
			data.costprice = this._communicationService.removeCommas(data.costprice);
			data.retailprice = this._communicationService.removeCommas(data.retailprice);
			data.saleprice = this._communicationService.removeCommas(data.saleprice);
			// 
			if (this.selectedFiles !== undefined && this.selectedFiles.length > 0) {
				const filePath = 'upload/product/' + data['sku'] + '/';
				this.uploadService.FOLDER = filePath;
				const file = this.selectedFiles;
				const optParam = {};
				// showing spinner on upload of image
				this.spinner.show();
				this.uploadService.uploadfile(file, optParam, res => {
				// hiding spinner on upload of image
				this.spinner.hide();
					if (res['success']) {
						data['imageName'] = res["respArray"][0].fileName;
						data['imageSrc'] = res["respArray"][0].path;
						data['imgType'] = res["respArray"][0].contentType;
						this._commonNodeCallService.SaveProduct(data).subscribe(resData => {
							//console.log(resData);
							//console.log(resData['success']);
							if (resData['success']) {
						this._communicationService.backendError = false;
								//console.log('Data Submitted Successfully')
								this.edit = false;
								this.display_message_for_product_msg = true;
								this.message = resData['message'];
							} else {
								if(resData['statusCode'] === 500){
									this._communicationService.backendError = true;								
								}else{
									if(res['statusCode'] === 401){
										this.router.navigateByUrl('/login');
									}else{
										//console.log('errors are present in data..')
									this.display_message_for_product_msg = false;
									this.edit = true;
									this.errorList = resData['message'];
									}
								}
							}
						});
					}else{
					this._communicationService.backendError = true;
					}
				});
			} else {
				data['imageName'] = this.imageArrayEdit['image_name'];
				data['imageSrc'] = this.imageArrayEdit['product_src'];
				data['imgType'] = this.imageArrayEdit['image_type'];
				
				this._commonNodeCallService.SaveProduct(data).subscribe(resData => {
					//console.log(resData);
					//console.log(resData['success']);
					if (resData['success']) {
						this._communicationService.backendError = false;
						//console.log('Data Submitted Successfully')
						this.edit = false;
						this.display_message_for_product_msg = true;
						this.message = resData['message'];
					} else {
						if(resData['statusCode'] === 500){
							this._communicationService.backendError = true;
						}else{
							if(resData['statusCode'] === 401){
								this.router.navigateByUrl('/login');
							}else{
								//console.log('errors are present in data..')
							this.display_message_for_product_msg = false;
							this.edit = true;
							this.errorList = resData['message'];
							}
							
						}
						
					}
				});
			}
		}
	}

	// *** category autocomplete dropdown ***

	catresults: labelid[] = [];
	filteredCatresults: labelid[] = [];

	searchCategory(event) {
		// console.log("checking event "+ event);
		this.filteredCatresults = this.catresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}

	catdropdown() {
		//console.log("this.filteredCatresults", this.filteredCatresults)
		this.filteredCatresults;
	}

	subCatresults: labelid[] = [];
	filteredSubCatresults: labelid[] = [];

	searchSubCategory(event) {
		// console.log("checking event "+ event);
		this.filteredSubCatresults = this.subCatresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}

	getsubCatDropdown(evt) {
		// getting sub category from databse using category
		var data = { "id": evt.id }
		this.form.patchValue({
			'subcategory': null,
			'item': null,
			'costprice': null,
			'retailprice': null,
			'description': null,
			'viewdescription': null,
		})
		this.paramList = [];
		this.subCatresults = [];
		this.itemresults = [];
		this.catId = data.id
		this._commonNodeCallService.GetSubCategory(data).subscribe(res => {
			if(res['success']){
				this._communicationService.backendError = false;
				if (res['results'].length > 0) {
					//this.subCatresults = []
					res['results'].forEach(element => {
						this.subCatresults.push({ label: element.name, id: element.id });
					});
				}
			}else{
				this._communicationService.backendError = true;
			}
		});
	}

	subCatdropdown() {
		this.form.patchValue({
			'subcategory': null,
			'item': null
		})
		this.subCatresults;
		//console.log(this.subCatresults)
	}

	paramList = [];
	stringDropValue = [];
	globalArr = [];
	currentmultiplier;
	getParamList(evt) {
		var data = { "itemId": evt.id }
		data['categoryId'] = this.catId;
		data['subCategoryId'] = this.subCatId;
		this.form.patchValue({
			'costprice': null,
			'retailprice': null,
			'description': null,
			'viewdescription': null,
		})
		this.paramList = [];
		this.stringDropValue = [{ label: "Select", value: null }];
		this.globalArr = [];
		this.currentmultiplier = this.multipler.find(item => { if (item.id === evt.id) { return item.multiplier } })
		// console.log("currentmultiplier");
		// console.log(this.currentmultiplier);
		this._commonNodeCallService.GetParameters(data).subscribe(res => {
			if(res['success']){
				this._communicationService.backendError = false;
				if (res['results'].length > 0) {
					//this.subCatresults = []
					this.globalArr = [];
					//console.log("res['results']==", res['results'])
					this._communicationService.paramList = [];
					this.paramList = []
					res['results'].forEach(element => {
						let paramCost = 0
						if (element.input != 'String Dropdown') {
							paramCost = element.cost
						}
						this.paramList.push({ "parameter": element.param_name, "options": element.param_option, "input": element.inputTypeName, "cost": paramCost, "id": element.id });
						if (element.paramArray.length > 0) {
							var obj = {}
							var valArr = [{ label: "Select", value: null, id: null }]
							obj['name'] = element.param_name;
	
							element.paramArray.forEach(item => {
								valArr.push({ label: item.addvaluesname, id: item.id, value: item.cost })
							})
							obj['value'] = valArr;
							this.globalArr.push(obj)
							//console.log("this.globalArr==", this.globalArr)
							this._communicationService.globalStrDropDown = this.globalArr;
						}
					});
					this._communicationService.paramList = this.paramList;
				} else {
					this.warning_popup = true;
				}
			}else{
				this._communicationService.backendError = true;
			}
		});
	}
	selectFile(event) {
		this.S3image = false;
		this.selectedFiles = event.target.files;
	}

	// *** category autocomplete dropdown ***

	typeresults: labelid[] = [{ label: 'Service', id: 1 }, { label: 'Product', id: 2 }];
	filteredTyperesults: labelid[] = [];

	searchType(event) {
		// console.log("checking event "+ event);
		this.filteredTyperesults = this.typeresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}

	typedropdown() {
		this.filteredTyperesults;
	}
	okMessageForProduct() {
		this.catresults = [];
		this.filteredCatresults = [];
		this.display_message_for_product_msg = false;
		window.location.reload();
	}

	// *** item autocomplete dropdown ***

	itemresults: labelid[] = [];
	filtereditemresults: labelid[] = [];

	searchfiltereditemresults(event) {
		// console.log("checking event "+ event);
		this.filtereditemresults = this.itemresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}

	filtereditemresultsdropdown() {
		//console.log("this.filteredCatresults", this.filteredCatresults)
		//console.log("this.filteredCatresults", this.filteredCatresults)
		this.filtereditemresults;
	}

	getItems(evt) {
		//var objdata = { id: evt.id }
		this.subCatId = evt.id;
		this.form.patchValue({
			'costprice': null,
			'retailprice': null,
			'description': null,
			'viewdescription': null,
		})
		var data = {}
		data['categoryId'] = this.catId;
		data['subCategoryId'] = this.subCatId;

		this._commonNodeCallService.GetItemListingBySubCatId(data).subscribe(res => {
			if(res['success']){
				this._communicationService.backendError = false;
				this.itemresults = []
			if (res['results'].length > 0) {
				console.log(res['results'])
				this.multipler = [];
				res['results'].forEach(element => {
					let tempObj = {};
					this.itemresults.push({ label: element.item_name, id: element.id })
					tempObj['id'] = element.id;
					tempObj['multiplier'] = element.multiplier;
					this.multipler.push(tempObj);
					// console.log("multiplier");
					// console.log(this.multipler);
				})
			}
			}else{
				this._communicationService.backendError = true;
			}
			//console.log("item", res)
			
		})
	}
	warning_popup: boolean = false;
	okMessageForWarning() {
		this.form.patchValue({
			item: '',
			costprice: '',
			retailprice: '',
			description: '',
			viewdescription: ''
		})
		this.warning_popup = false;
		// this.hidebuttons1 = true;
		//this._communicationService.CancelProduct(false);
	}
}
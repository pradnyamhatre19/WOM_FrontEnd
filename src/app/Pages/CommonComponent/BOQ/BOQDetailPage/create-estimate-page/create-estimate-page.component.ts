import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer, HostListener, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, Form } from '@angular/forms';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
export class Group {
	constructor(public name: String) {
	}
}

export class labelid {
	label: string
	id: number
}


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'create-estimate-page',
	templateUrl: './create-estimate-page.component.html',
	styleUrls: ['./create-estimate-page.component.css'],
	// encapsulation: ViewEncapsulation.None
})
export class CreateEstimatePageComponent implements OnInit {

	constructor(public _communicationService: CommunicateService, private router: Router, private el: ElementRef, private renderer: Renderer, private _commonNodeCallService: CommonCallService) {
	}


	month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	Querys = [];

	inputMsg = [];

	budget = 0; //Category budget
	variantbudget = 0;//varaint Budget
	containsCategories: Boolean = false;
	containsCategories2: Boolean = false;

	closerow: Boolean = false;
	closerow2: Boolean = false;

	compress: Boolean = false;

	workclick: Boolean = false;
	variantclick: Boolean = true;
	// remove tests later
	test1: Boolean = true;
	test2: Boolean = true;

	// showvariants:Boolean=false;
	show_specs_body_text: Boolean = false;

	showQueryForm = false;
	visibleSidebar5;
	previewDescription: boolean;
	formbuilder: any;
	variantForm: FormGroup;
	DescriptionForm: FormGroup;
	formControlArray = [];

	/**Description related Varaible */
	iseditVariantflag = true;
	/**Description related Varaible */
	variantDespdata2Display;

	/**Variant Listing*/
	variantListDispJson = [];
	variantDespdata2Store = []
	/**Add new Variant */
	// tslint:disable-next-line:member-ordering
	NewVariantAdded = false;

	projects: any[];
	project;
	filteredProjects: any[];
	filteredCitys: any[];
	variantImg;
	projectList;
	assigntoresults: labelid[];
	confirmationPopup: boolean = false;

	categoryselected() {
		this.containsCategories = true;
		this.containsCategories2 = false;
	}

	globalCategory;
	globalevent;
	globalDecider;
	categoryclosed(category, evt, DeciderName) {
		this.globalCategory = category;
		this.globalevent = evt;
		this.globalDecider = DeciderName
		this.confirmationPopup = true;
		// this.budget = 0;
		// for (let i = 0; i < this.CategoriesList.length; i++) {
		// 	if (this.CategoriesList[i].Categories === category.Categories) {
		// 		if (this.CategoriesList[i].Categories === this.selectedCategory) {
		// 			this.displayList = [];
		// 		}
		// 		const data = this.CategoriesList.splice(i, 1);
		// 		let temp: any = {};
		// 		console.log("data[0]['src']", data[0]['src'])
		// 		temp['categoryId'] = data[0]["id"];
		// 		temp['categoryImg'] = data[0]['src'];
		// 		temp['categoryName'] = data[0]['Categories'];
		// 		temp['SubTotal'] = data[0]['SubTotal'];
		// 		temp['subcategoryList'] = [];
		// 		this.removeCategoryList.push(temp);
		// 	} else {
		// 		if (typeof (this.CategoriesList[i].SubTotal) === 'string') {
		// 			this.budget += parseFloat(this.CategoriesList[i].SubTotal);
		// 		} else {
		// 			this.budget += this.CategoriesList[i].SubTotal;
		// 		}
		// 	}
		// }
		// console.log(category, evt);
	}

	categoryselected2() {
		this.containsCategories2 = true;
		this.containsCategories = false;
	}

	categoryclosed2() {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) { e.stopPropagation(); }
		this.containsCategories2 = false;
		this.closerow2 = true;
	}

	compressdiv() {
		this.compress = !this.compress;
		console.log('toogle');
	}

	close_content() {
		if (!e) { var e = window.event; }
		e.cancelBubble = true;
		if (e.stopPropagation) { e.stopPropagation(); }
		this.compress = false;
		console.log('toogle close');
	}


	specs_cancel_button() {
		this.variantToGetDetails = 0;
		this.currentIndex = undefined;
		this.projectList = []
		if (this.variantForm !== undefined) {
			this.variantForm.reset();
		}
		this.variantImg = "";
		this.formControlArray = [];
		this.DescriptionForm.reset();
		this.variantDespdata2Display = [];
		this.variantDespdata2Store = [];
		this.variantListDispJson = [];
		this.highLightSelectedVariant = 0;
		this.displayVariantDialog = false;
	}

	displayimports: boolean = false;
	varientData2Displayimport() {
		this.displayimports = true;
	}

	showvariants = true;
	selectedItem: any;

	listClick(event, newValue) {
		//console.log(newValue);
		this.selectedItem = newValue;  // don't forget to update the model here
		// ... do other stuff here ...
	}

	// onclick of workstations showing variants...
	yourMethod(i) {
		console.log(i);
		if (i === 0) {
			//.log('true value ' + i);
			this.showvariants = true;
		} else {
			//console.log('wrong value');
			this.showvariants = false;
			this.show_specs_body_text = false;
		}
	}
	// onlick of variant show specs
	show_specs_body() {
		this.show_specs_body_text = true;
	}

	// editable drop-down
	cars: any[];
	selectedCar1: string;

	BOQList = [];
	selectedBOQ: string = '';
	CategoriesList = [];
	Category = [];  // listing
	BOQDetailJson; // uncomment  before Production build
	removeCategoryList = []; // uncomment  before Production build
	UserDetail;//Userdetail for Query
	boqDetails;
	projectDetails;
	FinalBoQ = false;
	ngOnInit() {

		this._communicationService.loader = true;
		this.boqDetails = JSON.parse(sessionStorage.getItem('boqDetails'));
		this.projectDetails = JSON.parse(sessionStorage.getItem('projectDetails'));
		this.FinalBoQ = this.projectDetails['finalize'];
		console.log("FinalBoQ", this.FinalBoQ);
		console.log(this.projectDetails);
		this.UserDetail = JSON.parse(sessionStorage.getItem('userinfo'))[0];
		// console.log(this.UserDetail);
		// console.log(this.boqDetails);
		//console.log("this.projectDetails====", this.projectDetails);
		let tempboqimportjson = {}
		tempboqimportjson['projectId'] = this.projectDetails.id;
		tempboqimportjson['boqId'] = this.boqDetails.boqId;
		this._commonNodeCallService.ImportBOQListing(tempboqimportjson).subscribe(res => {
			if (res['success']) {
				//console.log(res);
				let importboqarr = [];
				for (let i = 0; i < res['results'].length; i++) {
					let tempObj = {}
					tempObj['label'] = res['results'][i].BOQ_name;
					tempObj['id'] = res['results'][i].id;
					importboqarr.push(tempObj);
				}
				this.BOQList = importboqarr;
			}
		});
		let tempObj = {};
		tempObj['projectId'] = this.projectDetails['id'];
		tempObj['projectName'] = this.projectDetails['Name'];
		tempObj['categoryId'] = 0;
		tempObj['subCategoryId'] = 0;
		tempObj['boqId'] = this.boqDetails['boqId'];
		tempObj['boqName'] = this.boqDetails['boqName'];
		tempObj['catID'] = 0
		tempObj['subCatID'] = 0
		tempObj['shortJson'] = 0

		this._commonNodeCallService.BoqDetailsProcCall(tempObj).subscribe(res => {
			if (res['statusCode'] === 200) {
				if (res['results'] != "") {
					//console.log(res);
					this._communicationService.loader = false;

					let jsonData;
					jsonData = this.dataConvertion(res['results']);

					if (this.BOQDetailJson !== undefined) {
						if (this.BOQDetailJson.hasOwnProperty('categoryList')) {
							for (let i = 0; i < this.BOQDetailJson.categoryList.length; i++) {
								const categorydata = this.BOQDetailJson.categoryList[i];
								console.log("categorydata", categorydata)
								const Obj = {};
								Obj['Categories'] = categorydata.categoryName;
								Obj['src'] = 'http://s3.amazonaws.com/wom-documents/' + categorydata.categoryImg;
								Obj['SubTotal'] = categorydata.SubTotal;
								Obj['id'] = categorydata.categoryId;
								this.CategoriesList.push(Obj);
							}
						}
						for (let y = 0; y < this.BOQDetailJson['categoryList'].length; y++) {
							let tempObj = {};
							var subCatObjList = this.BOQDetailJson['categoryList'][y].subcategoryList;
							for (var k = 0; k < subCatObjList.length; k++) {
								var subCatObj = subCatObjList[k]
								this.SubCategorystatus.map(item => {
									if (subCatObj.status) {
										if (item.label === subCatObj.status) {
											subCatObj.status = item
										}
									} else {
										subCatObj.status = { label: 'Incomplete', id: 2 }
									}

								})
							}
							tempObj[this.BOQDetailJson['categoryList'][y].categoryName] = subCatObjList;
							this.Category.push(tempObj);
						}
					}

					console.log("this.CategoriesList", this.CategoriesList)
					for (let h = 0; h < this.CategoriesList.length; h++) {
						if (typeof (this.CategoriesList[h].SubTotal) === 'string') {
							this.budget += parseFloat(this.CategoriesList[h].SubTotal);
						} else {
							this.budget += this.CategoriesList[h].SubTotal;
						}
					}
					console.log("this.budget", this.budget)
					this.hideIndex[0] = true;
					this.activeSize = 0;
					if (this.CategoriesList[0] !== undefined) {
						console.log(" this.CategoriesList", this.CategoriesList)
						this.selectedCategory = this.CategoriesList[0].Categories;
						this.productlisting[this.selectedCategory] = this.Category[0][this.selectedCategory]; // civil ,cooling/hov obj
						this.displayList = Array.from(this.productlisting[this.selectedCategory]);
					}
					console.log("this.displayList", this.displayList)
					console.log("BoqDetailjosn", this.BOQDetailJson);
				}
			} else {
				console.log("errors...")
			}

		});

		var data = { sbuId: this.projectDetails.sbuId, userId: this.UserDetail['user_id'] }
		this._commonNodeCallService.GetEmployees(data).subscribe(res => {
			var empList = []
			if (res['results'].length > 0) {
				res['results'].forEach(element => {
					var obj = {}
					obj['label'] = element.name
					obj['id'] = element.id
					empList.push(obj)
				})
				this.assigntoresults = empList
			}
		})

		this.filterSubCategory = [{ label: 'All', id: 1 },
		{ label: 'Complete', id: 2 },
		{ label: 'Incomplete', id: 3 },
		{ label: 'WIP', id: 4 }];

		this.SubCategorystatus = [
			{ label: 'Complete', id: 1 },
			{ label: 'Incomplete', id: 2 },
			{ label: 'WIP', id: 3 }
		];
	}

	dataConvertion(data) {
		let jsonData;
		for (let i = 0; i < data.length; i++) {
			jsonData = JSON.parse(data[i].jsonValue);
			if (jsonData["boqId"] !== undefined) {
				jsonData = this._communicationService.setJson(jsonData, ['categoryList'], ['childList1']);
				if (jsonData['categoryList'] !== null) {
					for (let i = 0; i < jsonData['categoryList'].length; i++) {
						if (jsonData['categoryList'][i]['categoryId'] !== 0) {
							jsonData['categoryList'][i] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i], ['SubTotal', 'subcategoryList'], ['categorySubTotal', 'childList2'])));
							if (jsonData['categoryList'][i]['subcategoryList'] !== null) {
								//var catSubTotal = 0;
								for (let j = 0; j < jsonData['categoryList'][i]['subcategoryList'].length; j++) {
									if (jsonData['categoryList'][i]['subcategoryList'][j]['subcategoryId'] !== 0) {
										jsonData['categoryList'][i]['subcategoryList'][j] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j], ['status', 'itemList'], ['scmstatus', 'childList3'])));
										jsonData['categoryList'][i]['subcategoryList'][j].boqId = jsonData["boqId"]
										if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] !== null) {
											// var subCatTotal = 0;
											// var SubcatQuantity = 0;
											// var catSubTotalWithDiscount = 0
											for (let k = 0; k < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].length; k++) {
												if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['itemId'] !== 0) {
													jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k], ['quantity', 'SubTotal', 'productList'], ['subCategoryQuantity', 'itemSubTotal', 'childList4'])));
													if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] === null) {
														jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] = [];
													}
													// var itemSubtotal = 0
													// var itemQuantity = 0;
													for (let prodnullCheck = 0; prodnullCheck < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].length; prodnullCheck++) {
														if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productId'] === 0) {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].splice(prodnullCheck, 1);
														} 
														// else {
														// 	itemSubtotal += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productSubTotal']
														// 	itemQuantity += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productQuantity']
														// }
													}

													// jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].quantity = itemQuantity
													// jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].SubTotal = itemSubtotal
													// let lineTotal = 0
													// var discount = jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].discount
													// if (discount > 0) {
													// 	lineTotal = itemSubtotal - (itemSubtotal * (discount / 100))
													// } else {
													// 	lineTotal = itemSubtotal
													// }
													// catSubTotalWithDiscount += lineTotal
													// jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].lineTotal = lineTotal
													// subCatTotal += itemSubtotal;
													// SubcatQuantity += itemQuantity;

												} else {
													jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].splice(k, 1);
												}
											}
											// console.log("catSubTotalWithDiscount", catSubTotalWithDiscount)
											// catSubTotal += catSubTotalWithDiscount

										} else {
											jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] = [];
											//catSubTotal += jsonData['categoryList'][i]['SubTotal']
										}
									} else {
										jsonData['categoryList'][i]['subcategoryList'].splice(j, 1);
									}
								}
								//console.log("catSubTotal==", catSubTotal)
								//jsonData['categoryList'][i].SubTotal = catSubTotal
							} else {
								jsonData['categoryList'][i]['subcategoryList'] = [];
							}
						}
					}
				} else {
					jsonData['categoryList'] = [];
				}
			}
			//console.log(jsonData);
			console.log("============", JSON.stringify(jsonData));
			if (this.boqDetails['BoqDetailAction'] === 'Edit') {
				if (jsonData["boqId"] !== -1) {
					this.BOQDetailJson = jsonData;
					//console.log("BOQ Detail JSON");
					//console.log(this.BOQDetailJson);
				} else {
					this.removeCategoryList = jsonData['categoryList'];
					//console.log("removeCategoryList Detail JSON");
					//console.log(this.removeCategoryList);
				}
			} else {
				this.BOQDetailJson = jsonData;
			}
		}
		return jsonData;
	}
	back_to_projects_page() {
		this.router.navigateByUrl('/Project/BOQ');
	}

	//  editable text
	editableText = '00';
	editableText1 = '00';
	editableText2 = '00';
	editableText3 = '00';

	editableSelect = 2;
	// tslint:disable-next-line:member-ordering
	editableSelectOptions = [
		{ value: 1, text: 'dropdown1' },
		{ value: 2, text: 'dropdown2' },
		{ value: 3, text: 'dropdown3' },
		{ value: 4, text: 'dropdown4' }
	];
	// add category popup
	displaycategory_dialog: boolean = false;

	addCategory() {
		this.displaycategory_dialog = true;
	}
	closeCatDialog() {
		this.displaycategory_dialog = false;
	}
	addCategoryjourney = false;/***created to skip importFromBoqId on add categoryJourney in categoryList Empty case */
	addRemainingCategory(cattoadd, evt) {
		let data;
		for (let i = 0; i < this.removeCategoryList.length; i++) {
			if (this.removeCategoryList[i].categoryName === cattoadd.categoryName) {
				console.log(cattoadd);
				let removeIndex = i;
				let tempObj = {};
				//tempObj['boqId'] = this.boqDetails['boqId'];
				//tempObj['boqId'] = 0;
				tempObj['boqId'] = -1;
				if (cattoadd.hasOwnProperty('importFromBoqId')) {
					tempObj['boqId'] = cattoadd['importFromBoqId'];
				}
				tempObj['categoryId'] = 0;
				tempObj['subCategoryId'] = 0;
				tempObj['catID'] = cattoadd.categoryId
				tempObj['subCatID'] = 0
				tempObj['shortJson'] = 0
				console.log(tempObj);
				this._commonNodeCallService.BoqDetailsProcCall(tempObj).subscribe(res => {
					if (res['results'] != "") {
						console.log(JSON.stringify(JSON.parse(res['results'][0]['jsonValue'])));
						/**child to required json conversion */
						//	let jsonData = res['results'][0]['jsonValue'].childList1
						//console.log(" JSON.parse(res['results'][0].jsonValue)", JSON.parse(res['results'][0].jsonValue))

						let jsonData = JSON.parse(res['results'][0].jsonValue);
						var chList = []
						jsonData.childList1.map(item => {
							if (item.categoryId === cattoadd.categoryId) {
								chList.push(item)
							}
						})
						console.log("chList", chList)
						jsonData.childList1 = chList
						console.log("jsonData", jsonData)
						jsonData = this._communicationService.setJson(jsonData, ['categoryList'], ['childList1']);
						if (jsonData['categoryList'] !== null) {
							for (let i = 0; i < jsonData['categoryList'].length; i++) {
								if (jsonData['categoryList'][i]['categoryId'] !== 0) {
									jsonData['categoryList'][i] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i], ['SubTotal', 'subcategoryList'], ['categorySubTotal', 'childList2'])));
									if (jsonData['categoryList'][i]['subcategoryList'] !== null) {
										var catSubTotal = 0;
										for (let j = 0; j < jsonData['categoryList'][i]['subcategoryList'].length; j++) {
											if (jsonData['categoryList'][i]['subcategoryList'][j]['subcategoryId'] !== 0) {
												jsonData['categoryList'][i]['subcategoryList'][j] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j], ['status', 'itemList'], ['scmstatus', 'childList3'])));
												jsonData['categoryList'][i]['subcategoryList'][j].boqId = jsonData['boqId']
												if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] !== null) {
													var subCatTotal = 0;
													var SubcatQuantity = 0;
													var catSubTotalWithDiscount = 0
													for (let k = 0; k < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].length; k++) {
														if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['itemId'] !== 0) {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k], ['quantity', 'SubTotal', 'productList'], ['subCategoryQuantity', 'itemSubTotal', 'childList4'])));
															if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] === null) {
																jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] = [];
															}
															var itemSubtotal = 0
															var itemQuantity = 0;
															for (let prodnullCheck = 0; prodnullCheck < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].length; prodnullCheck++) {
																if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productId'] === 0) {
																	jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].splice(prodnullCheck, 1);
																} else {
																	itemSubtotal += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productSubTotal']
																	itemQuantity += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productQuantity']
																}
															}

															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].quantity = itemQuantity
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].SubTotal = itemSubtotal
															let lineTotal = 0
															var discount = jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].discount
															if (discount > 0) {
																lineTotal = itemSubtotal - (itemSubtotal * (discount / 100))
															} else {
																lineTotal = itemSubtotal
															}
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].lineTotal = lineTotal
															subCatTotal += itemSubtotal;
															SubcatQuantity += itemQuantity;
															catSubTotalWithDiscount += lineTotal

														} else {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].splice(k, 1);
														}
													}
													catSubTotal += catSubTotalWithDiscount
												} else {
													jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] = [];
													catSubTotal += jsonData['categoryList'][i]['SubTotal']
												}
											} else {
												jsonData['categoryList'][i]['subcategoryList'].splice(j, 1);
											}
										}
										jsonData['categoryList'][i].SubTotal = catSubTotal
									} else {
										jsonData['categoryList'][i]['subcategoryList'] = [];
									}
								}
							}
						} else {
							jsonData['categoryList'] = [];
						}

						/**child to required json conversion End*/

						/**Merge Logic start*/
						let orgCat = this.BOQDetailJson;
						this.addCategoryjourney = true;
						this.BOQDetailJson = this.mergeCategoryJson(orgCat, jsonData);
						// console.log(tempref);

						/**Merge Logic Ends */
						console.log("****************************************************************************************************");
						console.log("BOQ Detail Json");
						console.log(this.BOQDetailJson);
						console.log("****************************************************************************************************");
						console.log("BOQ Categories List Json");
						console.log(this.CategoriesList);
						console.log("****************************************************************************************************");
						console.log("****************************************************************************************************");
						if (this.BOQDetailJson !== undefined) {
							if (this.BOQDetailJson.hasOwnProperty('categoryList')) {
								for (let i = 0; i < this.BOQDetailJson.categoryList.length; i++) {
									const categorydata = this.BOQDetailJson.categoryList[i];
									const Obj = {};
									Obj['Categories'] = categorydata.categoryName;
									Obj['src'] = 'http://s3.amazonaws.com/wom-documents/' + categorydata.categoryImg;
									Obj['SubTotal'] = categorydata.SubTotal;
									Obj['id'] = categorydata.categoryId;
									let cat2push = true;
									for (let catlist = 0; catlist < this.CategoriesList.length; catlist++) {
										if (categorydata.categoryId === this.CategoriesList[catlist]['id']) {
											cat2push = false;
										}
									}
									if (cat2push) {
										this.CategoriesList.push(Obj);
									}
								}
							}
							this.Category = [];
							for (let y = 0; y < this.BOQDetailJson['categoryList'].length; y++) {
								let tempObj = {};
								var subCatObjList = this.BOQDetailJson['categoryList'][y].subcategoryList;
								for (var k = 0; k < subCatObjList.length; k++) {
									var subCatObj = subCatObjList[k]
									this.SubCategorystatus.map(item => {
										if (subCatObj.status) {
											if (item.label === subCatObj.status) {
												subCatObj.status = item
											}
										} else {
											subCatObj.status = { label: 'Incomplete', id: 2 }
										}
									})
								}
								tempObj[this.BOQDetailJson['categoryList'][y].categoryName] = subCatObjList;
								this.Category.push(tempObj);
							}
						}

						var newBudget = 0
						for (let h = 0; h < this.CategoriesList.length; h++) {
							if (typeof (this.CategoriesList[h].SubTotal) === 'string') {
								newBudget += parseFloat(this.CategoriesList[h].SubTotal);
							} else {
								newBudget += this.CategoriesList[h].SubTotal;
							}
						}
						this.budget = newBudget
						console.log("busget==", this.budget)
						console.log("newBudget", newBudget)
						this.hideIndex[0] = true;
						this.activeSize = this.CategoriesList.length - 1;
						if (this.CategoriesList[this.CategoriesList.length - 1] !== undefined) {
							this.selectedCategory = this.CategoriesList[this.CategoriesList.length - 1].Categories;
							this.productlisting[this.selectedCategory] = this.Category[this.CategoriesList.length - 1][this.selectedCategory]; // civil ,cooling/hov obj
							this.displayList = Array.from(this.productlisting[this.selectedCategory]);
						}
						this.removeCategoryList.splice(removeIndex, 1);
						this.displaycategory_dialog = false;
					}
				});
				// let Obj = {};
				// Obj['Categories'] = data[0]['categoryName'];
				// Obj['src'] = data[0]['categoryImg'];
				// Obj['SubTotal'] = data[0]['SubTotal'];
				// Obj['id'] = data[0]['categoryId'];
				// this.CategoriesList.push(Obj);
				// if (typeof (data[0]['SubTotal']) === 'string') {
				// 	this.budget = this.budget + parseInt(data[0]['SubTotal']);
				// } else {
				// 	this.budget += data[0]['SubTotal'];
				// }
			}
		}
		// for (let y = 0; y < data.length; y++) {
		// 	let tempObj = {};
		// 	tempObj[data[y].categoryName] = data[y].subcategoryList;
		// 	this.Category.push(tempObj);
		// }
		// this.displaycategory_dialog = false;
	}
	norecords: boolean = false;


	BoqCategorylist; /**created to store category present in imported boq */
	BoqCategoryRemovelist; /**created to store category present in imported boq  Removelist*/
	importBOQ() {
		console.log("selectedcategorylvlBOQimp==========", this.selectedcategorylvlBOQimp)
		let tempObj = {};
		tempObj['categoryId'] = 0;
		tempObj['subCategoryId'] = 0;
		tempObj['boqId'] = this.selectedBOQ['id'];
		tempObj['catID'] = 0
		tempObj['subCatID'] = 0
		tempObj['shortJson'] = 0
		console.log(tempObj);
		this._commonNodeCallService.BoqDetailsProcCall(tempObj).subscribe(res => {
			if (res['results'] != "") {
				let jsonData;
				// for(let i=0; i < res['results'].length; i++) {
				//   jsonData = JSON.parse(res['results'][i].jsonValue);
				if (res['results'].length > 0) {
					for (let i = 0; i < res['results'].length; i++) {
						jsonData = JSON.parse(res['results'][i].jsonValue);
						jsonData = this._communicationService.setJson(jsonData, ['categoryList'], ['childList1']);
						if (jsonData['categoryList'] !== null) {
							var catSubTotal = 0;
							for (let i = 0; i < jsonData['categoryList'].length; i++) {
								if (jsonData['categoryList'][i]['categoryId'] !== 0) {
									jsonData['categoryList'][i] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i], ['SubTotal', 'subcategoryList'], ['categorySubTotal', 'childList2'])));
									if (jsonData['categoryList'][i]['subcategoryList'] !== null) {
										for (let j = 0; j < jsonData['categoryList'][i]['subcategoryList'].length; j++) {
											if (jsonData['categoryList'][i]['subcategoryList'][j]['subcategoryId'] !== 0) {
												jsonData['categoryList'][i]['subcategoryList'][j] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j], ['status', 'itemList'], ['scmstatus', 'childList3'])));
												jsonData['categoryList'][i]['subcategoryList'][j].boqId = jsonData.boqId
												if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] !== null) {
													var subCatTotal = 0;
													var SubcatQuantity = 0;
													var catSubTotalWithDiscount = 0
													for (let k = 0; k < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].length; k++) {
														if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['itemId'] !== 0) {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k], ['quantity', 'SubTotal', 'productList'], ['subCategoryQuantity', 'itemSubTotal', 'childList4'])));
															if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] === null) {
																jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] = [];
															}
															var itemSubtotal = 0
															var itemQuantity = 0;
															for (let prodnullCheck = 0; prodnullCheck < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].length; prodnullCheck++) {
																if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productId'] === 0) {
																	jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].splice(prodnullCheck, 1);
																} else {
																	itemSubtotal += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productSubTotal']
																	itemQuantity += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productQuantity']
																}
															}

															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].quantity = itemQuantity
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].SubTotal = itemSubtotal
															let lineTotal = 0
															var discount = jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].discount
															if (discount > 0) {
																lineTotal = itemSubtotal - (itemSubtotal * (discount / 100))
															} else {
																lineTotal = itemSubtotal
															}
															catSubTotalWithDiscount += lineTotal
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].lineTotal = lineTotal
															subCatTotal += itemSubtotal;
															SubcatQuantity += itemQuantity;

														} else {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].splice(k, 1);
														}
													}
												} else {
													jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] = [];
													//catSubTotal += jsonData['categoryList'][i]['SubTotal']
												}
											} else {
												jsonData['categoryList'][i]['subcategoryList'].splice(j, 1);
											}
										}
									} else {
										jsonData['categoryList'][i]['subcategoryList'] = [];
									}
								}
							}
						} else {
							jsonData['categoryList'] = [];
						}
						if (JSON.parse(res['results'][i].jsonValue)["boqId"] !== -1) {
							this.BoqCategorylist = jsonData;
						} else {
							this.BoqCategoryRemovelist = jsonData;
						}
					}
				}
				let categoryArr = ['BOQDetailJson', 'removeCategoryList'];
				let boqimport = ['BoqCategorylist', 'BoqCategoryRemovelist']
				for (let i = 0; i < categoryArr.length; i++) {
					let catOrgObj = this[categoryArr[i]];
					if (categoryArr[i] === 'removeCategoryList') {
						catOrgObj = {};
						catOrgObj['categoryList'] = this[categoryArr[i]];
					}
					let boqImpObj = this[boqimport[i]];
					catOrgObj = this.mergeCategoryJson(catOrgObj, boqImpObj)
					// if (catOrgObj !== undefined && catOrgObj.hasOwnProperty('categoryList')) {
					// 	for (let categoryListResArr = 0; categoryListResArr < boqImpObj['categoryList'].length; categoryListResArr++) {
					// 		for (let categoryListOrgArr = 0; categoryListOrgArr < catOrgObj['categoryList'].length; categoryListOrgArr++) {
					// 			if (boqImpObj['categoryList'][categoryListResArr].id === catOrgObj['categoryList'][categoryListOrgArr]['id']) {
					// 				catOrgObj['categoryList'][categoryListOrgArr]['importFromBoqId'] = this.selectedBOQ['id'];
					// 				for (let subcatresArr = 0; subcatresArr < boqImpObj['categoryList'][categoryListResArr]['subcategoryList'].length; subcatresArr++) {
					// 					for (let subcatorgArr = 0; subcatorgArr < catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList'].length; subcatorgArr++) {
					// 						if (boqImpObj['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr].id === catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList']['id']) {
					// 							for (let itemresArr = 0; itemresArr < boqImpObj['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'].length; itemresArr++) {
					// 								for (let itemorgArr = 0; itemorgArr < catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'].length; itemorgArr++) {
					// 									if (boqImpObj['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr].id === catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['id']) {
					// 										for (let prodresArr = 0; prodresArr < boqImpObj['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'].length; prodresArr++) {
					// 											for (let prodorgArr = 0; prodorgArr < catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['productList'].length; prodorgArr++) {
					// 												if (catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['productList'][prodresArr].id === boqImpObj['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'][prodorgArr].id) {
					// 													catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['productList'][prodresArr] = boqImpObj['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'][prodorgArr];
					// 												} else {
					// 													catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['productList'].push(boqImpObj['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'][prodresArr]);
					// 												}
					// 											}
					// 										}
					// 									} else {
					// 										catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'].push(catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]);
					// 									}
					// 								}
					// 							}
					// 						} else {
					// 							catOrgObj['categoryList'][categoryListOrgArr]['subcategoryList'].push(boqImpObj['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]);
					// 						}
					// 					}
					// 				}
					// 			} else {
					// 				catOrgObj['categoryList'].push(boqImpObj['categoryList'][categoryListResArr]);
					// 			}
					// 		}
					// 	}
					// } else {
					// 	catOrgObj = boqImpObj['categoryList'];
					// }
					if (i === 0) {
						if (this.BOQDetailJson === undefined) {
							this.BOQDetailJson = {};
						}
						this.BOQDetailJson['boqId'] = this.boqDetails['boqId'];
						this.BOQDetailJson['categoryList'] = catOrgObj['categoryList'];
						this.BOQDetailJson['importFromBoqId'] = this.selectedBOQ['id'];
					} else {
						if (categoryArr[i] === 'removeCategoryList') {
							this.removeCategoryList = catOrgObj['categoryList'];
						}
						if (this.removeCategoryList.hasOwnProperty('boqId')) {
							delete this.removeCategoryList['boqId'];
						}
						if (this.removeCategoryList.hasOwnProperty('importFromBoqId')) {
							delete this.removeCategoryList['importFromBoqId'];
						}
					}
				}
				this.BOQList = this.BOQList.filter(element => element.id !== this.selectedBOQ['id']);

				for (let o = 0; o < this.BOQDetailJson['categoryList'].length; o++) {
					for (let p = 0; p < this.removeCategoryList.length; p++) {
						if (this.BOQDetailJson['categoryList'][o].categoryId === this.removeCategoryList[p].categoryId) {
							this.removeCategoryList.splice(p, 1);
							break;
						}
					}
				}

				if (this.BOQDetailJson !== undefined) {
					if (this.BOQDetailJson.hasOwnProperty('categoryList')) {
						this.CategoriesList = []
						for (let i = 0; i < this.BOQDetailJson.categoryList.length; i++) {
							const categorydata = this.BOQDetailJson.categoryList[i];
							const Obj = {};
							Obj['Categories'] = categorydata.categoryName;
							Obj['src'] = 'http://s3.amazonaws.com/wom-documents/' + categorydata.categoryImg;
							Obj['SubTotal'] = categorydata.SubTotal;
							Obj['id'] = categorydata.categoryId;
							this.CategoriesList.push(Obj);
						}
					}
					this.Category = []
					for (let y = 0; y < this.BOQDetailJson['categoryList'].length; y++) {
						let tempObj = {};
						var subCatObjList = this.BOQDetailJson['categoryList'][y].subcategoryList;
						for (var k = 0; k < subCatObjList.length; k++) {
							var subCatObj = subCatObjList[k]
							this.SubCategorystatus.map(item => {
								if (subCatObj.status) {
									if (item.label === subCatObj.status) {
										subCatObj.status = item
									}
								} else {
									subCatObj.status = { label: 'Incomplete', id: 2 }
								}
							})
						}
						tempObj[this.BOQDetailJson['categoryList'][y].categoryName] = subCatObjList;

						this.Category.push(tempObj);
					}
				}

				this.budget = 0
				for (let h = 0; h < this.CategoriesList.length; h++) {
					if (typeof (this.CategoriesList[h].SubTotal) === 'string') {
						this.budget += parseFloat(this.CategoriesList[h].SubTotal);
					} else {
						this.budget += this.CategoriesList[h].SubTotal;
					}
				}
				console.log("this.budget", this.budget)
				this.hideIndex[0] = true;
				this.activeSize = 0;
				if (this.CategoriesList[0] !== undefined) {
					this.selectedCategory = this.CategoriesList[0].Categories;
					this.productlisting[this.selectedCategory] = this.Category[0][this.selectedCategory]; // civil ,cooling/hov obj
					this.displayList = Array.from(this.productlisting[this.selectedCategory]);
				}
			}
		});
	}
	ProdSubCat = [];
	activeSize;
	selectedCategory = '';
	productList = []
	productlisting = [];
	displayList = [];
	selectedList(data, index) {
		this.hideIndex[0] = true;
		this.activeSize = index;
		this.selectedCategory = data.Categories;
		this.productlisting[this.selectedCategory] = this.Category[index][this.selectedCategory]; // civil ,cooling/hov obj
		this.displayList = Array.from(this.productlisting[this.selectedCategory]);
		let tempObj = {};
		for (var cnt = 0; cnt < this.BOQDetailJson["categoryList"].length; cnt++) {
			if (this.BOQDetailJson["categoryList"][cnt].categoryId === data.id) {
				if (this.BOQDetailJson["categoryList"][cnt]['subcategoryList'][0].itemList.length === 0) {
					console.log("call procedure...")

					tempObj['projectId'] = this.projectDetails['id'];
					tempObj['projectName'] = this.projectDetails['Name'];
					tempObj['categoryId'] = data.id;
					tempObj['subCategoryId'] = 0;
					tempObj['boqId'] = this.boqDetails['boqId'];
					tempObj['boqName'] = this.boqDetails['boqName'];
					tempObj['catID'] = 0
					tempObj['subCatID'] = 0
					tempObj['shortJson'] = 1
					break;
				}
			}
		}
		console.log("tempObj", tempObj)
		this._commonNodeCallService.BoqDetailsProcCall(tempObj).subscribe(res => {
			if (res['results'] != "") {
				//console.log("proce response", res);
				this._communicationService.loader = false;
				let jsonData;

				for (let i = 0; i < res['results'].length; i++) {
					jsonData = JSON.parse(res['results'][i].jsonValue);
					if (jsonData["boqId"] !== -1) {
						var chList = []
						jsonData.childList1.map(item => {
							if (item.categoryId === data.id) {
								chList.push(item)
							}
						})
						jsonData.childList1 = chList

						jsonData = this._communicationService.setJson(jsonData, ['categoryList'], ['childList1']);

						if (jsonData['categoryList'] !== null) {
							for (let i = 0; i < jsonData['categoryList'].length; i++) {
								if (jsonData['categoryList'][i]['categoryId'] !== 0) {
									jsonData['categoryList'][i] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i], ['SubTotal', 'subcategoryList'], ['categorySubTotal', 'childList2'])));
									if (jsonData['categoryList'][i]['subcategoryList'] !== null) {
										var catSubTotal = 0;
										for (let j = 0; j < jsonData['categoryList'][i]['subcategoryList'].length; j++) {
											if (jsonData['categoryList'][i]['subcategoryList'][j]['subcategoryId'] !== 0) {
												jsonData['categoryList'][i]['subcategoryList'][j] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j], ['status', 'itemList'], ['scmstatus', 'childList3'])));
												jsonData['categoryList'][i]['subcategoryList'][j]['boqId'] = jsonData["boqId"]
												if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] !== null) {
													var subCatTotal = 0;
													var SubcatQuantity = 0;
													var catSubTotalWithDiscount = 0
													for (let k = 0; k < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].length; k++) {
														if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['itemId'] !== 0) {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k], ['quantity', 'SubTotal', 'productList'], ['subCategoryQuantity', 'itemSubTotal', 'childList4'])));
															if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] === null) {
																jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] = [];
															}
															var itemSubtotal = 0
															var itemQuantity = 0;
															for (let prodnullCheck = 0; prodnullCheck < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].length; prodnullCheck++) {
																if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productId'] === 0) {
																	jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].splice(prodnullCheck, 1);
																} else {
																	itemSubtotal += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productSubTotal']
																	itemQuantity += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productQuantity']
																}
															}

															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].quantity = itemQuantity
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].SubTotal = itemSubtotal
															let lineTotal = 0
															var discount = jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].discount
															if (discount > 0) {
																lineTotal = itemSubtotal - (itemSubtotal * (discount / 100))
															} else {
																lineTotal = itemSubtotal
															}
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].lineTotal = lineTotal
															subCatTotal += itemSubtotal;
															SubcatQuantity += itemQuantity;
															console.log("lineTotal", lineTotal)
															catSubTotalWithDiscount += lineTotal
														} else {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].splice(k, 1);
														}
													}
													console.log("catSubTotalWithDiscount", catSubTotalWithDiscount)
													catSubTotal += catSubTotalWithDiscount

												} else {
													jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] = [];
													catSubTotal += jsonData['categoryList'][i]['SubTotal']
												}
											} else {
												jsonData['categoryList'][i]['subcategoryList'].splice(j, 1);
											}
										}
										jsonData['categoryList'][i].SubTotal = catSubTotal
									} else {
										jsonData['categoryList'][i]['subcategoryList'] = [];
									}
								}
							}
						} else {
							jsonData['categoryList'] = [];
						}
						//console.log("jsonData===",jsonData)
					}
				}
				for (var j = 0; j < this.BOQDetailJson.categoryList.length; j++) {
					var item = this.BOQDetailJson.categoryList[j]
					if (item.categoryId === data.id) {
						this.BOQDetailJson.categoryList.splice(j, 1, jsonData['categoryList'][0])
					}
				}
				console.log("this.BOQDetailJson", this.BOQDetailJson)
				if (this.BOQDetailJson !== undefined) {
					if (this.BOQDetailJson.hasOwnProperty('categoryList')) {
						this.CategoriesList = []
						for (let i = 0; i < this.BOQDetailJson.categoryList.length; i++) {
							const categorydata = this.BOQDetailJson.categoryList[i];
							const Obj = {};
							Obj['Categories'] = categorydata.categoryName;
							Obj['src'] = 'http://s3.amazonaws.com/wom-documents/' + categorydata.categoryImg;
							Obj['SubTotal'] = categorydata.SubTotal;
							Obj['id'] = categorydata.categoryId;
							this.CategoriesList.push(Obj);
						}
					}
					this.Category = []
					for (let y = 0; y < this.BOQDetailJson['categoryList'].length; y++) {
						let tempObj = {};
						var subCatObjList = this.BOQDetailJson['categoryList'][y].subcategoryList;
						for (var k = 0; k < subCatObjList.length; k++) {
							var subCatObj = subCatObjList[k]
							this.SubCategorystatus.map(item => {
								if (subCatObj.status) {
									if (item.label === subCatObj.status) {
										subCatObj.status = item
									}
								} else {
									subCatObj.status = { label: 'Incomplete', id: 2 }
								}

							})
						}
						tempObj[this.BOQDetailJson['categoryList'][y].categoryName] = subCatObjList;
						this.Category.push(tempObj);
					}
				}
				this.budget = 0
				for (let h = 0; h < this.CategoriesList.length; h++) {
					if (typeof (this.CategoriesList[h].SubTotal) === 'string') {
						this.budget += parseFloat(this.CategoriesList[h].SubTotal);
					} else {
						this.budget += this.CategoriesList[h].SubTotal;
					}
				}
				console.log("this.budget", this.budget)
				this.hideIndex[0] = true;
				this.activeSize = index;
				if (this.CategoriesList.length > 0) {
					for (var k = 0; k < this.CategoriesList.length; k++) {
						if (this.CategoriesList[k].id === data.id) {
							this.selectedCategory = this.CategoriesList[k].Categories;
							this.productlisting[this.selectedCategory] = this.Category[k][this.selectedCategory]; // civil ,cooling/hov obj
							this.displayList = Array.from(this.productlisting[this.selectedCategory]);
						}
					}
				}
			}
		})
	}
	/**new Code using pipe OrderBy */
	onCheckBoxChange(subCategoryName, item, product, evt) {
		for (let i = 0; i < this.displayList.length; i++) {
			if (this.displayList[i].subcategoryName === subCategoryName.subcategoryName) {
				for (let j = 0; j < this.displayList[i].itemList.length; j++) {
					for (let k = 0; k < this.displayList[i].itemList[j].productList.length; k++) {
						if (this.displayList[i].itemList[j].productList[k].productName === item.productName) {
							this.displayList[i].itemList[j].productList[k].checked = evt.srcElement.checked;
							console.log('value Changed', this.displayList[i].itemList[j].productList[k].checked);
						}
					}
				}
			}
		}
		console.log("this.displayList", this.displayList);
	}
	removeArr = [];
	globalSubCategory;
	globalItem;
	globalProduct;
	globalvariantevt;
	deleteProjectFromList(subCategoryName, item, product, evt, displayname) {
		this.globalSubCategory = subCategoryName;
		this.globalItem = item;
		this.globalProduct = product;
		this.globalvariantevt = evt;
		this.globalDecider = displayname;
		this.confirmationPopup = true;
		// this.budget = 0;
		// let categorytotal = 0;
		// var subcategorytotal = 0;
		// for (let i = 0; i < this.displayList.length; i++) {
		// 	if (this.displayList[i].subcategoryName === subCategoryName.subcategoryName) {
		// 		for (let j = 0; j < this.displayList[i].itemList.length; j++) {
		// 			for (let k = 0; k < this.displayList[i].itemList[j].productList.length; k++) {
		// 				if (this.displayList[i].itemList[j].productList[k].productName === item.productName) {
		// 					this.displayList[i].itemList[j].quantity = this.displayList[i].itemList[j].quantity - this.displayList[i].itemList[j].productList[k].productQuantity;
		// 					//console.log("this.displayList[i].itemList[j].SubTotal", this.displayList[i].itemList[j].SubTotal)
		// 					this.displayList[i].itemList[j].SubTotal = this.displayList[i].itemList[j].SubTotal - this.displayList[i].itemList[j].productList[k].productSubTotal;
		// 					if (this.displayList[i].itemList[j].discount === '0') {
		// 						this.displayList[i].itemList[j].lineTotal = this.displayList[i].itemList[j].SubTotal;
		// 					} else {
		// 						const x = this.displayList[i].itemList[j].discount;
		// 						// const data = x.substring(0, x.search('%'));
		// 						// tslint:disable-next-line:prefer-const
		// 						let disountamt = (x / 100) * this.displayList[i].itemList[j].SubTotal;
		// 						this.displayList[i].itemList[j].lineTotal = this.displayList[i].itemList[j].SubTotal - disountamt;
		// 					}
		// 					this.displayList[i].itemList[j].productList.splice(k, 1);
		// 					if (this.displayList[i].itemList[j].productList.length === 0) {
		// 						this.displayList[i].itemList[j].discount = '0';
		// 					}
		// 				}
		// 			}
		// 			subcategorytotal += this.displayList[i].itemList[j].lineTotal;
		// 		}
		// 		this.displayList[i].lineTotal = subcategorytotal;
		// 	}
		// 	categorytotal += this.displayList[i].lineTotal;
		// }
		// for (let h = 0; h < this.CategoriesList.length; h++) {
		// 	if (this.CategoriesList[h].Categories === this.selectedCategory) {
		// 		this.CategoriesList[h].SubTotal = categorytotal.toString();
		// 	}
		// 	if (typeof (this.CategoriesList[h].SubTotal) === 'string') {
		// 		this.budget += parseFloat(this.CategoriesList[h].SubTotal);
		// 	} else {
		// 		this.budget += this.CategoriesList[h].SubTotal;
		// 	}
		// 	console.log("this.budget", this.budget)
		// }
	}
	// tslint:disable-next-line:member-ordering
	hideIndex = [];
	HideSubCatprojlist(index, subcategoryDetails, evt) {
		this.hideIndex[index] = !this.hideIndex[index];
		console.log(this.hideIndex);
		console.log(subcategoryDetails);
		console.log(evt)
		let tempObj = {};
		for (let i = 0; i < this.displayList.length; i++) {
			if (this.displayList[i].subcategoryName === subcategoryDetails.subcategoryName) {
				// if ((!this.displayList[0].hasOwnProperty('Project')) && this.displayList[i].Project.length < 0) {
				//       /**hit data base by 'subcategoryDetails.subCategoryName' and store data in displayList */
				// }
				//console.log('do Noting');
				var categoryId;
				this.CategoriesList.map(item => {
					if (item.Categories === this.selectedCategory) {
						categoryId = item.id;
					}
				})
				console.log('categoryId', categoryId);
				if (this.displayList[i].itemList.length === 0) {
				
					tempObj['projectId'] = this.projectDetails['id'];
					tempObj['projectName'] = this.projectDetails['Name'];
					tempObj['boqName'] = this.boqDetails['boqName'];
					tempObj['boqId'] = 0
					tempObj['catID'] = 0
					tempObj['subCatID'] = 0
					tempObj['categoryId'] = 0
					tempObj['subCategoryId'] = 0
					tempObj['shortJson'] = 1

					if (subcategoryDetails.boqId === -1) {
						tempObj['catID'] = categoryId
						tempObj['subCatID'] = subcategoryDetails.subcategoryId;
						tempObj['boqId'] = subcategoryDetails.boqId;
					} else {
						tempObj['categoryId'] = categoryId;
						tempObj['subCategoryId'] = subcategoryDetails.subcategoryId;
						tempObj['boqId'] = subcategoryDetails.boqId;
					}

					console.log("tempObj", tempObj)
					break;
					
				}
			}
		}

		if(Object.keys(tempObj).length>0){
			this._commonNodeCallService.BoqDetailsProcCall(tempObj).subscribe(res => {
				if (res['results'] != "") {
					console.log("proce response", res);
					console.log("tempObj==",tempObj)
					this._communicationService.loader = false;
					let jsonData;
					for (let i = 0; i < res['results'].length; i++) {
						jsonData = JSON.parse(res['results'][i].jsonValue);
						//if (jsonData["boqId"] !== 0) {
						jsonData = this._communicationService.setJson(jsonData, ['categoryList'], ['childList1']);
						if (jsonData['categoryList'] !== null) {
							for (let i = 0; i < jsonData['categoryList'].length; i++) {
								if (jsonData['categoryList'][i]['categoryId'] !== 0) {
									jsonData['categoryList'][i] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i], ['SubTotal', 'subcategoryList'], ['categorySubTotal', 'childList2'])));
									if (jsonData['categoryList'][i]['subcategoryList'] !== null) {
										var catSubTotal = 0;
										for (let j = 0; j < jsonData['categoryList'][i]['subcategoryList'].length; j++) {
											if (jsonData['categoryList'][i]['subcategoryList'][j]['subcategoryId'] !== 0) {
												jsonData['categoryList'][i]['subcategoryList'][j] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j], ['status', 'itemList'], ['scmstatus', 'childList3'])));
												if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] !== null) {
													var subCatTotal = 0;
													var SubcatQuantity = 0;
													var catSubTotalWithDiscount = 0
													for (let k = 0; k < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].length; k++) {
														if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['itemId'] !== 0) {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k], ['quantity', 'SubTotal', 'productList'], ['subCategoryQuantity', 'itemSubTotal', 'childList4'])));
															if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] === null) {
																jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] = [];
															}
															var itemSubtotal = 0
															var itemQuantity = 0;
															for (let prodnullCheck = 0; prodnullCheck < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].length; prodnullCheck++) {
																if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productId'] === 0) {
																	jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].splice(prodnullCheck, 1);
																} else {
																	itemSubtotal += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productSubTotal']
																	itemQuantity += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productQuantity']
																}
															}

															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].quantity = itemQuantity
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].SubTotal = itemSubtotal
															let lineTotal = 0
															var discount = jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].discount
															if (discount > 0) {
																lineTotal = itemSubtotal - (itemSubtotal * (discount / 100))
															} else {
																lineTotal = itemSubtotal
															}
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].lineTotal = lineTotal
															subCatTotal += itemSubtotal;
															SubcatQuantity += itemQuantity;
															catSubTotalWithDiscount += lineTotal

														} else {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].splice(k, 1);
														}
													}
													catSubTotal += catSubTotalWithDiscount

												} else {
													jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] = [];
													catSubTotal += jsonData['categoryList'][i]['SubTotal']
												}
											} else {
												jsonData['categoryList'][i]['subcategoryList'].splice(j, 1);
											}
										}
										jsonData['categoryList'][i].SubTotal = catSubTotal
									} else {
										jsonData['categoryList'][i]['subcategoryList'] = [];
									}
								}
							}
						} else {
							jsonData['categoryList'] = [];
						}
						console.log("jsonData", jsonData)

						var newSubCatData = [];
						for (var m = 0; m < jsonData.categoryList.length; m++) {
							if (jsonData.categoryList[m].categoryId === categoryId) {
								if (jsonData.categoryList[m].subcategoryList.length > 0) {
									for (var n = 0; n < jsonData.categoryList[m].subcategoryList.length; n++) {
										if (jsonData.categoryList[m].subcategoryList[n].subcategoryId === subcategoryDetails.subcategoryId) {
											newSubCatData = jsonData.categoryList[m].subcategoryList[n];
										}
									}
								}
							}
						}
						//console.log("newSubCatData",newSubCatData)

						if (this.BOQDetailJson.categoryList.length > 0) {
							for (var k = 0; k < this.BOQDetailJson.categoryList.length; k++) {
								var catItem = this.BOQDetailJson.categoryList[k]
								if (catItem.categoryId === categoryId) {
									for (var l = 0; l < catItem.subcategoryList.length; l++) {
										var subCatItem = catItem.subcategoryList[l]
										if (subCatItem.subcategoryId === subcategoryDetails.subcategoryId) {
											this.BOQDetailJson.categoryList[k].subcategoryList.splice(l, 1, newSubCatData)
										}
									}
								}
							}
						}

						console.log("this.BOQDetailJson", this.BOQDetailJson)

						if (this.BOQDetailJson !== undefined) {

							if (this.BOQDetailJson.hasOwnProperty('categoryList')) {
								this.CategoriesList = []
								for (let i = 0; i < this.BOQDetailJson.categoryList.length; i++) {
									const categorydata = this.BOQDetailJson.categoryList[i];
									const Obj = {};
									Obj['Categories'] = categorydata.categoryName;
									Obj['src'] = 'http://s3.amazonaws.com/wom-documents/' + categorydata.categoryImg;
									Obj['SubTotal'] = categorydata.SubTotal;
									Obj['id'] = categorydata.categoryId;
									this.CategoriesList.push(Obj);
								}
							}
							this.Category = []
							for (let y = 0; y < this.BOQDetailJson['categoryList'].length; y++) {
								let tempObj = {};
								var subCatObjList = this.BOQDetailJson['categoryList'][y].subcategoryList;
								for (var k = 0; k < subCatObjList.length; k++) {
									var subCatObj = subCatObjList[k]
									this.SubCategorystatus.map(item => {
										if (subCatObj.status) {
											if (item.label === subCatObj.status) {
												subCatObj.status = item
											}
										} else {
											subCatObj.status = { label: 'Incomplete', id: 2 }
										}

									})
								}
								tempObj[this.BOQDetailJson['categoryList'][y].categoryName] = subCatObjList;
								this.Category.push(tempObj);
							}
						}
						this.budget = 0;
						for (let h = 0; h < this.CategoriesList.length; h++) {
							if (typeof (this.CategoriesList[h].SubTotal) === 'string') {
								this.budget += parseFloat(this.CategoriesList[h].SubTotal);
							} else {
								this.budget += this.CategoriesList[h].SubTotal;
							}
						}
						console.log("this.budget", this.budget)

						if (this.CategoriesList.length > 0) {
							for (var k = 0; k < this.CategoriesList.length; k++) {
								if (this.CategoriesList[k].id === categoryId) {
									this.selectedCategory = this.CategoriesList[k].Categories;
									this.productlisting[this.selectedCategory] = this.Category[k][this.selectedCategory]; // civil ,cooling/hov obj
									this.displayList = Array.from(this.productlisting[this.selectedCategory]);
								}
							}
						}
						//}
					}
				}
			})
		}
	}

	// tslint:disable-next-line:member-ordering
	filterSubCategory: any[];
	// tslint:disable-next-line:member-ordering
	fltrselectedSubCatStatus: string;
	filterSubCatlist() {
		console.log(this.fltrselectedSubCatStatus);
	}
	filterList(evt) {
		this.displayList = Array.from(this.productlisting[this.selectedCategory]);
		if (evt.value.label !== 'All') {
			for (let i = 0; i < this.displayList.length; i++) {
				if (this.displayList[i].status.label !== evt.value.label) {
					this.displayList.splice(i, 1);
					i = i - 1;
				}
			}
		}
		console.log(evt);
	}

	// tslint:disable-next-line:member-ordering
	SubCategorystatus: any[];
	// tslint:disable-next-line:member-ordering
	selectedSubCatStatus: string;
	selectSubCatlist() {
		console.log(this.selectedSubCatStatus);
	}
	SetStatus(evt) {
		console.log(evt);
	}

	DiscountChange(subcategoryobj, item1obj, evt) {
		this.budget = 0;
		console.log(subcategoryobj);
		let categorytotal = 0;
		let subcategorytotal = 0; // for category budget
		for (let i = 0; i < this.displayList.length; i++) {
			if (this.displayList[i].subcategoryName === subcategoryobj.subcategoryName) {
				for (let j = 0; j < this.displayList[i].itemList.length; j++) {
					// console.log("this.displayList[i].itemList[j]", this.displayList[i].itemList[j].itemName)
					// console.log("item1obj.itemName", item1obj.itemName)
					// console.log("lineTotal", this.displayList[i].itemList[j].lineTotal)
					// console.log("discount", this.displayList[i].itemList[j].discount)
					if (this.displayList[i].itemList[j].itemName === item1obj.itemName) {
						const disountamt = (evt.target.value / 100) * this.displayList[i].itemList[j].SubTotal;
						this.displayList[i].itemList[j].lineTotal = this.displayList[i].itemList[j].SubTotal - disountamt;
						this.displayList[i].itemList[j].discount = evt.target.value;
					}
					subcategorytotal += this.displayList[i].itemList[j].lineTotal; // for category budget
				}
				this.displayList[i].lineTotal = subcategorytotal;
				categorytotal += this.displayList[i].lineTotal;
			}

		}
		for (let h = 0; h < this.CategoriesList.length; h++) {
			if (this.CategoriesList[h].Categories === this.selectedCategory) {
				this.CategoriesList[h].SubTotal = categorytotal.toString();
			}
			if (typeof (this.CategoriesList[h].SubTotal) === 'string') {
				this.budget += parseFloat(this.CategoriesList[h].SubTotal);
			} else {
				this.budget += this.CategoriesList[h].SubTotal;
			}
		}
		console.log("this.budget", this.budget)
	}

	/***Edit  */
	/**on Edit button click */
	displayVariantDialog: boolean = false;
	variantToGetDetails = 0;
	addnewVariantlinkflag = false;
	EditProduct(item, item2, item5, evt) {
		// console.log('item'); // subcategory Object
		// console.log('item2'); // variant Object
		// console.log(item5); // Item1 object

		let Obj2pass = {};
		// Obj2pass['sku_no'] = ;
		Obj2pass['boqId'] = this.boqDetails['boqId'];
		Obj2pass['skuNo'] = item2.skuNo;
		console.log(Obj2pass);
		this.variantListDispJson = [];
		this._commonNodeCallService.getVariantListing(Obj2pass).subscribe(resData => {
			console.log(resData);
			if (resData['success']) {
				this.variantListDispJson = resData['results'];

				for (let i = 0; i < this.variantListDispJson.length; i++) {
					console.log("variantDespdata2Store", this.variantListDispJson[i])
					if (this.variantListDispJson[i].isAddedToEstimate === true) {
						this.highLightSelectedVariant = i;
						this.variantToGetDetails = this.variantListDispJson[i].id;
						let variantDetail = {};
						variantDetail['skuNo'] = this.variantListDispJson[i]['sku_no'];
						variantDetail['variantId'] = this.variantListDispJson[i]['id'];
						variantDetail['boqId'] = this.boqDetails['boqId'];
						variantDetail['projectId'] = this.projectDetails.id

						console.log('*******************************Variant Detail********************************', variantDetail);
						console.log(variantDetail)
						console.log('*******************************Variant Detail********************************');
						this.getVariantDetails(i, variantDetail);
					}
				}
				console.log(this.variantListDispJson)

				console.log("variantToGetDetails", this.variantToGetDetails)
				if (this.variantToGetDetails === 0) {
					let variantDetail = {};
					this.highLightSelectedVariant = 0;
					this.variantToGetDetails = this.variantListDispJson[0].id;
					variantDetail['skuNo'] = this.variantListDispJson[0]['sku_no'];
					variantDetail['variantId'] = this.variantListDispJson[0]['id'];
					variantDetail['boqId'] = this.boqDetails['boqId'];
					variantDetail['projectId'] = this.projectDetails.id
					this.getVariantDetails(0, variantDetail)
				}
				console.log("variantToGetDetails", this.variantToGetDetails)

			}
		});
		this.displayVariantDialog = true;

		// this.variantListDispJson = Object.assign([], this.variantListStorageJson);
		// this.variantDespdata2Display = Object.assign([], this.variantDespdata2Store);

	}

	getVariantDetails(i, variantDetail) {
		// this.variantListDispJson = [];
		this._commonNodeCallService.getVariantDetails(variantDetail).subscribe(resData => {
			if (resData['success']) {
				console.log(resData['results'].img)
				this.variantImg = 'http://s3.amazonaws.com/wom-documents/' + resData['results'].img
				this.projectList = resData['results'].ProjectList;
				for (let i = 0; i < this.variantListDispJson.length; i++) {
					if (this.variantListDispJson[i].id === resData['results'].id) {
						this.variantListDispJson.splice(i, 1, resData['results']);
					}
				}
				this.variantDespdata2Display = Object.assign([], this.variantListDispJson);
				this._communicationService.globalStrDropDown = resData['results'].paramArray;
				this.globalDropdown = resData['results'].paramArray;
				this.SelectedVariant(i);
				this.addnewVariantlinkflag = true;
			}
		});
	}
	/**on Edit button click */
	/**Variant */
	defalutVariantname; // created to create variant name on addnewVariant
	variantName;
	setVariantJourney = 'default'; /**cerated to set Journey to set clone in selectedVariant */

	addNewVariantBox() {
		const var2AddinList = {};

		console.log("this.variantListDispJson", this.variantListDispJson)
		/**created to set default name that can be used to create "Variant_1 default variantname" */
		for (let i = 0; i < this.variantListDispJson.length; i++) {
			if (this.variantListDispJson[i].flag === 'D') {
				this.defalutVariantname = this.variantListDispJson[i].name
				break;
			}
		}



		if (this.variantListDispJson.length > 0) {
			this.variantListDispJson.map((item, index) => {
				if (index === this.highLightSelectedVariant) {
					this.variantName = 'Varient_' + this.variantListDispJson.length + ' ' + this.defalutVariantname;
					var2AddinList['name'] = this.variantName;
					var2AddinList['flag'] = 'V';
					return var2AddinList
				}
			})
			this.variantListDispJson.push(var2AddinList);
			this.highLightSelectedVariant = this.variantListDispJson.length - 1
		}
		this.setVariantJourney = 'addnewVariant';
		this.SelectedVariant(this.highLightSelectedVariant);
		this.NewVariantAdded = true;
	}
	/**Variant */
	/**Details */
	// tslint:disable-next-line:member-ordering
	highLightVariant(index, selectedvariant) {
		console.log(index, selectedvariant)
		this.highLightSelectedVariant = index;
		let callVariantDetailJson = true; /**variable use to distinguish to get data from variantDespdata2Display or from  getVariantDetails() api*/

		/** to match name present in variantDespdata2Display if present call selectedVariant */
		for (let i = 0; i < this.variantDespdata2Display.length; i++) {
			if (this.variantDespdata2Display[i].hasOwnProperty('decsription')) {
				if (this.variantDespdata2Display[i]['name'] === selectedvariant['name']) {
					this.SelectedVariant(index);
					callVariantDetailJson = false;
				}
			}
		}
		/**if name not present in variantDespdata2Display call getVariantDetails() and push result in 'variantDespdata2Display' JSON*/
		if (callVariantDetailJson) {
			let variantDetail = {};
			variantDetail['boqId'] = this.boqDetails['boqId'];
			variantDetail['projectId'] = this.projectDetails.id
			variantDetail['skuNo'] = selectedvariant['sku_no'];
			variantDetail['variantId'] = selectedvariant['id'];
			this._commonNodeCallService.getVariantDetails(variantDetail).subscribe(resData => {
				if (resData['success']) {

					console.log(resData['results'].img)
					this.variantImg = 'http://s3.amazonaws.com/wom-documents/' + resData['results'].img
					this.projectList = resData['results'].ProjectList;
					for (let i = 0; i < this.variantListDispJson.length; i++) {
						if (this.variantListDispJson[i].id === resData['results'].id) {
							this.variantListDispJson.splice(i, 1, resData['results']);
						}
					}
					this.variantDespdata2Display = Object.assign([], this.variantListDispJson);
					this._communicationService.globalStrDropDown = resData['results'].paramArray;
					this.globalDropdown = resData['results'].paramArray;
					this.SelectedVariant(index);
					this.addnewVariantlinkflag = true;


					// this.variantDespdata2Store.push(resData['results']);
					// for(let i = 0;i < this.variantListDispJson.length ;i++) {
					// 	if(this.variantListDispJson[i].id === resData['results'].id) {
					// 		this.variantListDispJson.splice(i,1,resData['results']);
					// 	}
					// }
					// this.variantDespdata2Display = Object.assign([], this.variantDespdata2Store);
					// this.highLightVariant = index;
					// this.SelectedVariant(index);
				}
			});
		}
	}
	currentIndex;
	PreviousIndex;
	highLightSelectedVariant: any;
	SelectedVariant(index) {
		if (this.currentIndex !== undefined) {
			let variantMasterArray = this.variantDespdata2Display[this.currentIndex];
			const data = this.variantForm.value.DescriptionForm;
			const datatodeleteArray = ['inputType', 'type', 'content'];

			for (let i = 0; i < this.formControlArray.length; i++) {
				const prwObj = {};
				if (this.formControlArray[i]['type'] !== 'text') {
					prwObj['paramName'] = this.formControlArray[i]['inputType'];
					prwObj['paramType'] = this.formControlArray[i]['type'];
					const iterateObject = Object.keys(data);
					for (let j = 0; j < iterateObject.length; j++) {
						let objtopush = JSON.parse(JSON.stringify(this.formControlArray[i]));

						for (let k = 0; k < datatodeleteArray.length; k++) {
							if (objtopush.hasOwnProperty(datatodeleteArray[k])) {
								const deleteKey = datatodeleteArray[k];
								delete objtopush[deleteKey];
							}
						}

						const multiValue = [];
						const iterateObject1 = Object.keys(objtopush);
						if (iterateObject1.length === 1) {
							if (objtopush.formControlName === iterateObject[j]) {
								prwObj['value'] = data[iterateObject[j]];
								for (let kn = 0; kn < variantMasterArray.paramArray.length; kn++) {
									if (variantMasterArray.paramArray[kn].paramName === prwObj['paramName']) {
										variantMasterArray.paramArray[kn].value = prwObj['value'];
										break;
									}
								}
							}
						} else {
							for (let m = 0; m < iterateObject1.length; m++) {
								const setFCN = m === 0 ? 'formControlName' : 'formControlName' + m;
								for (let n = 0; n < iterateObject.length; n++) {
									if (objtopush[setFCN] === iterateObject[n]) {
										multiValue.push(data[iterateObject[n]]);
									}
								}
							}
						}
						if (multiValue.length > 0) {
							prwObj['value'] = multiValue;
							for (let kn = 0; kn < variantMasterArray.paramArray.length; kn++) {
								if (variantMasterArray.paramArray[kn].paramName === prwObj['paramName']) {
									if (prwObj['paramType'] === 'String Dropdown') {
										variantMasterArray.paramArray[kn].value = prwObj['value'][0];
									} else {
										variantMasterArray.paramArray[kn].value = prwObj['value'];
									}
									break;
								}
							}
						}
					}
				}
			}

			this.variantDespdata2Display[this.currentIndex].paramArray = variantMasterArray.paramArray;
			let resultString = '';
			for (let i = 0; i < this.formControlArray.length; i++) {
				if (this.formControlArray[i]['type'] === 'String') {
					const fmn = this.formControlArray[i]['formControlName'];
					resultString += data[fmn];
				} else if (this.formControlArray[i]['type'] === '1 Dimension') {
					const fmn = this.formControlArray[i]['formControlName'];
					resultString += data[fmn];
				} else if (this.formControlArray[i]['type'] === '2 Dimension') {
					const fmn = this.formControlArray[i]['formControlName'];
					const fmn1 = this.formControlArray[i]['formControlName1'];
					resultString += data[fmn] + 'x' + data[fmn1];
				} else if (this.formControlArray[i]['type'] === '3 Dimension') {
					const fmn = this.formControlArray[i]['formControlName'];
					const fmn1 = this.formControlArray[i]['formControlName1'];
					const fmn2 = this.formControlArray[i]['formControlName2'];
					resultString += data[fmn] + 'x' + data[fmn1] + 'x' + data[fmn2];
				} else if (this.formControlArray[i]['type'] === 'String Dropdown') {
					const fmn = this.formControlArray[i]['formControlName'];
					console.log(fmn, fmn)
					resultString += data[fmn]['label'];
				} else {
					console.log('data');
					resultString += this.formControlArray[i]['content'];
				}
			}
			console.log('*********** Selected Variant result ***********');
			console.log(resultString);
			this.variantDespdata2Display[this.currentIndex].finalDescription = resultString;
			// tslint:disable-next-line:max-line-length
			this.variantDespdata2Display[this.currentIndex].budget = this.variantbudget === undefined ? this.variantDespdata2Display[this.currentIndex].budget : this.variantbudget;
			this.variantDespdata2Display[this.currentIndex].comments = this.comments.value;
			this.variantDespdata2Display[this.currentIndex].quantity = this.quantity.value === null ? this.variantDespdata2Display[this.currentIndex].quantity : this.quantity.value;
		}
		if (this.setVariantJourney === 'addnewVariant') {
			let var2AddinDespdata = {};
			var2AddinDespdata = JSON.parse(JSON.stringify(this.variantDespdata2Display[this.currentIndex])); // Object.assign({}, this.variantDespdata2Display[i]);
			var2AddinDespdata['name'] = this.variantName;
			var2AddinDespdata['id'] = null;
			var2AddinDespdata['flag'] = 'V';
			var2AddinDespdata['isaddedToEstimate'] = false;
			if (this.variantDespdata2Display[this.currentIndex].id !== null) {
				var2AddinDespdata['copiedFromId'] = this.variantDespdata2Display[this.currentIndex]["id"];
				var2AddinDespdata['id'] = null;
			} else {
				var2AddinDespdata['copiedFromId'] = this.variantDespdata2Display[this.currentIndex]["copiedFromId"];
				var2AddinDespdata['id'] = null;
			}
			console.log(var2AddinDespdata);
			this.variantDespdata2Display.push(var2AddinDespdata);
			this.setVariantJourney = 'default';
		}
		this.currentIndex = index;
		if (this.variantDespdata2Display[index].hasOwnProperty('id') && this.variantDespdata2Display[index].id !== null) {
			this.iseditVariantflag = false;
		} else if (this.variantDespdata2Display[index].hasOwnProperty('id') && this.variantDespdata2Display[index].id === null) {
			this.iseditVariantflag = true;
		}
		console.log(index);
		// let res = 'This is <Shape> of color <Color>. Dimension is <Table Top Dimension> of <Shape>';
		// tslint:disable-next-line:max-line-length
		// let res= 'Fabricating and fixing of <door> leaf fire rated door of size <doorDimension> with/without vision Panel with <estTime> hours fire rating as per details.Door jamb : Fire rated metal jamb in Galvanized steel finished with fire rated paint as per as per details Shutter : <shutter>      Hinges, Panic bar, Door closer, Lock and other hardware as per approval      Door Stopper : <doorStopper>      if visionpanel:      Vision panel : <vision>';
		let res = this.variantDespdata2Display[index].description;
		this.formControlArray = [];
		if (res === undefined) {
			res = this.variantDespdata2Display[this.currentIndex].decsription;
		}
		this.preview(res);
		this.variantForm = new FormGroup({
			budget: new FormControl(this.variantDespdata2Display[this.currentIndex].budget, [
				Validators.required
			]),
			comments: new FormControl(this.variantDespdata2Display[this.currentIndex].comments, [
				Validators.required
			]),
			quantity: new FormControl(this.variantDespdata2Display[this.currentIndex].quantity, [
				Validators.required
			]), DescriptionForm: this.DescriptionForm
		});
		this.variantbudget = this.variantForm['budget']
		this.highLightSelectedVariant = index;
	}
	/**Details */
	get comments() {
		return this.variantForm.get('comments');
	}
	get quantity() {
		return this.variantForm.get('quantity');
	}

	/**Decscription */
	// tslint:disable-next-line:member-ordering

	// productList = [
	//                 { 'parameter': 'vision', 'input': 'String' },
	//                 { 'parameter': 'shutter', 'input': 'String'},
	//                 { 'parameter': 'doorStopper', 'input': 'String'},
	//                 { 'parameter': 'door', 'input': 'String Dropdown'},
	//                 { 'parameter': 'estTime', 'input': '1 Dimension' },
	//                 { 'parameter': 'doorDimension', 'input': '2 Dimension' },
	//                 { 'parameter': 'parameter 5', 'input': '3 Dimension' }
	//               ];
	// tslint:disable-next-line:member-ordering
	globalDropdown
	// = [
	//   {
	//   name: 'door',
	//   value: [
	//             { label: 'Select Shape', value: null },
	//             { label: 'single', value: 1 },
	//             { label: 'double', value: 2 }
	//           ]
	//   },
	//   {
	//   name: 'Shape',
	//   value: [
	//             { label: 'Select Shape', value: null },
	//             { label: 'circle', value: 1 },
	//             { label: 'rectangle', value: 2 }
	//           ]
	//     },
	//     {
	//     name: 'Color',
	//     value: [
	//               { label: 'Select Color', value: null },
	//               { label: 'Red', value: 1 },
	//               { label: 'Blue', value: 2 },
	//               { label: 'Green', value: 3 }
	//       ]
	//     }
	//  ];
	/**Function Preview to create formObject*/

	// tslint:disable-next-line:member-ordering
	dropdownselect;

	preview(inputValue) {
		this.formControlArray = [];
		const data = inputValue; // string ex:('This is a <table> of Data')
		const dataObject = {};
		const b = data.split('<'); // ['This is a','table> of Data'];
		let d = [];
		const c = 0;
		const res = [];
		const DimensionNo = {}; // Toset the counter of Dimension to repeat
		let ParameterCounter = 0; // To set Parameter for form controlname
		DimensionNo['2 Dimension'] = 2;
		DimensionNo['3 Dimension'] = 3;
		this.productList = this.globalDropdown;
		const DimensionList = Object.keys(DimensionNo); // created to
		for (let i = 0; i < b.length; i++) { // divided string
			const formDataObj = {};
			if (b[i].match('>')) {
				d = b[i].split('>'); // contain based on closing ex.['table',' of Data']
				const param = d[0]; // will contain parameter name i.e. table
				for (let h = 0; h < this.productList.length; h++) { // itearte over productlist contain parameter and their action
					if (this.productList[h].paramName === param) { // { 'parameter': 'table', 'input': 'String' },
						formDataObj['type'] = this.productList[h].paramType;
						if (DimensionList.includes(this.productList[h].paramType)) { // written for n dimension array
							formDataObj['inputType'] = this.productList[h].paramName;
							if (this.formControlArray.length > 0) {
								let flag = false; //  flag to check  if formcontrolName is present in formcontrolarray or not
								for (let i = 0; i < this.formControlArray.length; i++) {
									if (this.formControlArray[i].inputType === param) {
										const FCAKeys = Object.keys(this.formControlArray[i]);
										FCAKeys.splice(FCAKeys.indexOf('type'), 1);
										FCAKeys.splice(FCAKeys.indexOf('inputType'), 1);
										for (let z = 0; z < FCAKeys.length; z++) {
											const setFCN =
												z === 0 ? 'formControlName' : 'formControlName' + z;
											formDataObj[setFCN] = this.formControlArray[i][setFCN];
										}
										flag = true;
									}
								}
								if (flag === false) {
									for (let k = 0; k < DimensionList.length; k++) {
										if (DimensionList[k] === this.productList[h].paramType) {
											const IterateCount = DimensionList[k];
											for (let l = 0; l < DimensionNo[IterateCount]; l++) {
												const tempFCN = 'parameter' + ParameterCounter++;
												const setFCN =
													l === 0 ? 'formControlName' : 'formControlName' + l;
												formDataObj[setFCN] = tempFCN;
												// tslint:disable-next-line:max-line-length
												const valueArr = this.variantDespdata2Display[this.currentIndex].paramArray.find(obj => obj.paramName === formDataObj['inputType']);
												const parametervalue = valueArr.value[l];
												if (formDataObj['selectedValue'] === undefined) {
													formDataObj['selectedValue'] = [];
												}
												formDataObj['selectedValue']['parameter' + l] = parametervalue;
												dataObject[tempFCN] = new FormControl(parametervalue);
											}
										}
									}
								}
							} else {
								for (let k = 0; k < DimensionList.length; k++) {
									if (DimensionList[k] === this.productList[h].paramType) {
										const IterateCount = DimensionList[k];
										for (let l = 0; l < DimensionNo[IterateCount]; l++) {
											const tempFCN = 'parameter' + ParameterCounter++;
											const setFCN =
												l === 0 ? 'formControlName' : 'formControlName' + l;
											formDataObj[setFCN] = tempFCN;
											// tslint:disable-next-line:max-line-length
											const valueArr = this.variantDespdata2Display[this.currentIndex].paramArray.find(obj => obj.paramName === formDataObj['inputType']);
											const parametervalue = valueArr.value[l];
											formDataObj[l] = parametervalue;
											if (formDataObj['selectedValue'] === undefined) {
												formDataObj['selectedValue'] = [];
											}
											formDataObj['selectedValue']['parameter' + l] = parametervalue;
											dataObject[tempFCN] = new FormControl(parametervalue);
										}
									}
								}
							}
							for (let gp = 0; gp < this.variantDespdata2Display[this.currentIndex].paramArray.length; gp++) {
								if (this.variantDespdata2Display[this.currentIndex].paramArray[gp].paramName === param) {
									if (this.variantDespdata2Display[this.currentIndex].paramArray[gp].hasOwnProperty('cost')) {
										formDataObj['cost'] = this.variantDespdata2Display[this.currentIndex].paramArray[gp].cost;
									}
									break;
								}
							}
							this.formControlArray.push(formDataObj);
						} else {
							/**new Code to set Parameter  */
							formDataObj['inputType'] = this.productList[h].paramName;
							if (this.formControlArray.length > 0) {
								let flag = false;
								this.globalDropdown = this._communicationService.globalStrDropDown;
								// tslint:disable-next-line:no-shadowed-variable
								for (let i = 0; i < this.formControlArray.length; i++) {
									if (this.formControlArray[i].inputType === param) {
										formDataObj['formControlName'] = this.formControlArray[i].formControlName;
										for (let i = 0; i < this.globalDropdown.length; i++) {
											if (this.globalDropdown[i].paramName === param) {
												this.dropdownselect = [];
												this.dropdownselect = this.globalDropdown[i].values;
												formDataObj['value'] = this.dropdownselect;
											}
										}
										flag = true;
									}
								}
								if (flag === false) {
									const tempFCN = 'parameter' + ParameterCounter++;
									formDataObj['formControlName'] = tempFCN;
									let parametervalue;
									for (let i = 0; i < this.variantDespdata2Display[this.currentIndex].paramArray.length; i++) {
										if (this.variantDespdata2Display[this.currentIndex].paramArray[i].paramName === formDataObj['inputType']) {
											parametervalue = this.variantDespdata2Display[this.currentIndex].paramArray[i].value
										}
									}
									for (let i = 0; i < this.globalDropdown.length; i++) {
										if (this.globalDropdown[i].paramName === param) {
											this.dropdownselect = this.globalDropdown[i].values;
											formDataObj['value'] = this.dropdownselect;
										}
									}
									formDataObj['selectedValue'] = parametervalue;
									dataObject[tempFCN] = new FormControl(parametervalue);
								}
							} else {
								const tempFCN = 'parameter' + ParameterCounter++;
								formDataObj['formControlName'] = tempFCN;
								let parametervalue;
								for (let i = 0; i < this.variantDespdata2Display[this.currentIndex].paramArray.length; i++) {
									if (this.variantDespdata2Display[this.currentIndex].paramArray[i].paramName === formDataObj['inputType']) {
										parametervalue = this.variantDespdata2Display[this.currentIndex].paramArray[i].value
									}
								}
								formDataObj['selectedValue'] = parametervalue;
								dataObject[tempFCN] = new FormControl(parametervalue);
							}
							for (let gp = 0; gp < this.variantDespdata2Display[this.currentIndex].paramArray.length; gp++) {
								if (this.variantDespdata2Display[this.currentIndex].paramArray[gp].paramName === param) {
									if (this.variantDespdata2Display[this.currentIndex].paramArray[gp].hasOwnProperty('cost')) {
										formDataObj['cost'] = this.variantDespdata2Display[this.currentIndex].paramArray[gp].cost;
									}
									break;
								}
							}
							this.formControlArray.push(formDataObj);
						}
					}
				}
				if (d[1] !== '' && d[1] !== null) {
					const dataobj = {};
					res.push(d[1]);
					dataobj['type'] = 'text';
					dataobj['content'] = d[1];
					dataobj['inputType'] = 'text';
					this.formControlArray.push(dataobj);
					console.log(dataobj);
				}
			} else {
				res.push(b[i]);
				formDataObj['type'] = 'text';
				formDataObj['content'] = b[i];
				formDataObj['inputType'] = 'text';
				console.log(formDataObj);
				this.formControlArray.push(formDataObj);
			}
		}
		console.log(typeof this.formControlArray);
		console.log(this.formControlArray);
		console.log(this.DescriptionForm);
		console.log(dataObject);
		this.DescriptionForm = new FormGroup(dataObject);
		//  this.quantity = this.variantDespdata2Display[this.currentIndex].quantity;
	}
	/**Preiew function End */

	/**SubmitDescription */
	submit(data) {
		const data1 = Object.keys(data);
		console.log(data);
		console.log(data1);
		console.log(this.formControlArray);
		let res = '';
		for (let i = 0; i < this.formControlArray.length; i++) {
			if (this.formControlArray[i]['type'] === 'String') {
				const fmn = this.formControlArray[i]['formControlName'];
				res += data[fmn];
			} else if (this.formControlArray[i]['type'] === '1 Dimension') {
				const fmn = this.formControlArray[i]['formControlName'];
				res += data[fmn];
			} else if (this.formControlArray[i]['type'] === '2 Dimension') {
				const fmn = this.formControlArray[i]['formControlName'];
				const fmn1 = this.formControlArray[i]['formControlName1'];
				res += data[fmn] + 'x' + data[fmn1];
			} else if (this.formControlArray[i]['type'] === '3 Dimension') {
				const fmn = this.formControlArray[i]['formControlName'];
				const fmn1 = this.formControlArray[i]['formControlName1'];
				const fmn2 = this.formControlArray[i]['formControlName2'];
				res += data[fmn] + 'x' + data[fmn1] + 'x' + data[fmn2];
			} else if (this.formControlArray[i]['type'] === 'String Dropdown') {
				const fmn = this.formControlArray[i]['formControlName'];
				console.log("data[fmn]", data[fmn])
				res += data[fmn]['label'] !== undefined ? data[fmn]['label'] : this.formControlArray[i]['selectedValue'].label;
			} else {
				console.log('data');
				res += this.formControlArray[i]['content'];
			}
		}
		const PreviewJson = [];
		const datatodeleteArray = ['inputType', 'type', 'content'];
		for (let i = 0; i < this.formControlArray.length; i++) {
			const prwObj = {};
			if (this.formControlArray[i]['type'] === 'text') {
				prwObj['paramName'] = this.formControlArray[i]['inputType'];
				prwObj['paramType'] = this.formControlArray[i]['type'];
				prwObj['value'] = this.formControlArray[i]['content'];
			} else if (this.formControlArray[i]['type'] !== 'text') {
				prwObj['paramName'] = this.formControlArray[i]['inputType'];
				prwObj['paramType'] = this.formControlArray[i]['type'];
				const iterateObject = Object.keys(data);
				for (let j = 0; j < iterateObject.length; j++) {
					const objtopush = this.formControlArray[i];
					for (let k = 0; k < datatodeleteArray.length; k++) {
						if (objtopush.hasOwnProperty(datatodeleteArray[k])) {
							const deleteKey = datatodeleteArray[k];
							delete objtopush[deleteKey];
						}
					}
					const multiValue = [];
					const iterateObject1 = Object.keys(objtopush);
					for (let m = 0; m < iterateObject1.length; m++) {
						if (iterateObject1.length === 1) {
							if (objtopush.formControlName === iterateObject[j]) {
								prwObj['value'] = data[iterateObject[j]];
							}
						} else {
							const setFCN = m === 0 ? 'formControlName' : 'formControlName' + m;
							for (let n = 0; n < iterateObject.length; n++) {
								if (objtopush[setFCN] === iterateObject[n]) {
									multiValue.push(data[iterateObject[n]]);
								}
							}
						}
					}
					if (multiValue.length > 0) {
						prwObj['value'] = multiValue;
					}
				}
				PreviewJson.push(prwObj);
			}
		}
		console.log(PreviewJson);
		this._communicationService.paramDetails = PreviewJson;
		this._communicationService.ProductDescriptionDate(res);
		this.previewDescription = false;
	}
	/**SubmitDescription */

	/***Label and input Coversion */
	displaynone = [];
	onFocusDispinputfield(index, evt, data) {
		if (this.iseditVariantflag === true) {
			this.displaynone[index] = true;
		}
	}

	onBlurDispLabel(index, evt, data, paramName, type) {
		console.log(type);
		console.log(index);
		console.log(evt);
		console.log(data);
		this.displaynone[index] = false;
		if (type === '2Dimension') {
			this.formControlArray[index].selectedValue[paramName] = evt.target.value;
		} else if (type === '3Dimension') {
			this.formControlArray[index].selectedValue[paramName] = evt.target.value;
		} else {
			this.formControlArray[index].selectedValue = this.DescriptionForm.controls[data].value;
		}
		console.log("this.formControlArray[index].selectedValue", this.formControlArray[index].selectedValue)
		this.calculateVariantBudget();
	}

	/***Edit  */


	/** Add to Estimate */
	AddtoEstimate() {
		let add2EstimateVar = {};
		if (this.iseditVariantflag === true) {
			if (this.currentIndex !== undefined) {
				let variantMasterArray = this.variantDespdata2Display[this.currentIndex];
				let data = this.variantForm.value.DescriptionForm;
				let datatodeleteArray = ['inputType', 'type', 'content'];
				for (let i = 0; i < this.formControlArray.length; i++) {
					let prwObj = {};
					if (this.formControlArray[i]['type'] !== 'text') {
						prwObj['paramName'] = this.formControlArray[i]['inputType'];
						prwObj['paramType'] = this.formControlArray[i]['type'];
						let iterateObject = Object.keys(data);
						for (let j = 0; j < iterateObject.length; j++) {
							let objtopush = JSON.parse(JSON.stringify(this.formControlArray[i]));
							for (let k = 0; k < datatodeleteArray.length; k++) {
								if (objtopush.hasOwnProperty(datatodeleteArray[k])) {
									let deleteKey = datatodeleteArray[k];
									delete objtopush[deleteKey];
								}
							}
							const multiValue = [];
							const iterateObject1 = Object.keys(objtopush);
							if (iterateObject1.length === 1) {
								if (objtopush.formControlName === iterateObject[j]) {
									prwObj['value'] = data[iterateObject[j]];
									for (let kn = 0; kn < variantMasterArray.paramArray.length; kn++) {
										if (variantMasterArray.paramArray[kn].paramName === prwObj['paramName']) {
											variantMasterArray.paramArray[kn].value = prwObj['value'];
											break;
										}
									}
								}
							} else {
								for (let m = 0; m < iterateObject1.length; m++) {
									const setFCN = m === 0 ? 'formControlName' : 'formControlName' + m;
									for (let n = 0; n < iterateObject.length; n++) {
										if (objtopush[setFCN] === iterateObject[n]) {
											multiValue.push(data[iterateObject[n]]);
										}
									}
								}
							}
							if (multiValue.length > 0) {
								prwObj['value'] = multiValue;
								for (let kn = 0; kn < variantMasterArray.paramArray.length; kn++) {
									if (variantMasterArray.paramArray[kn].paramName === prwObj['paramName']) {
										if (prwObj['paramType'] === 'String Dropdown') {
											variantMasterArray.paramArray[kn].value = prwObj['value'][0];
										} else {
											variantMasterArray.paramArray[kn].value = prwObj['value'];
										}
										break;
									}
								}
							}
						}
					}
				}
				this.variantDespdata2Display[this.currentIndex].paramArray = variantMasterArray.paramArray;
				let resultString = '';
				for (let i = 0; i < this.formControlArray.length; i++) {
					if (this.formControlArray[i]['type'] === 'String') {
						const fmn = this.formControlArray[i]['formControlName'];
						resultString += data[fmn];
					} else if (this.formControlArray[i]['type'] === '1 Dimension') {
						const fmn = this.formControlArray[i]['formControlName'];
						resultString += data[fmn];
					} else if (this.formControlArray[i]['type'] === '2 Dimension') {
						const fmn = this.formControlArray[i]['formControlName'];
						const fmn1 = this.formControlArray[i]['formControlName1'];
						resultString += data[fmn] + 'x' + data[fmn1];
					} else if (this.formControlArray[i]['type'] === '3 Dimension') {
						const fmn = this.formControlArray[i]['formControlName'];
						const fmn1 = this.formControlArray[i]['formControlName1'];
						const fmn2 = this.formControlArray[i]['formControlName2'];
						resultString += data[fmn] + 'x' + data[fmn1] + 'x' + data[fmn2];
					} else if (this.formControlArray[i]['type'] === 'String Dropdown') {
						const fmn = this.formControlArray[i]['formControlName'];
						resultString += data[fmn]['label'];
					} else {
						console.log('data');
						resultString += this.formControlArray[i]['content'];
					}
				}
				console.log(resultString);
				this.variantDespdata2Display[this.currentIndex].finalDescription = resultString;
				// this.variantDespdata2Display[this.currentIndex].isEditable = false;
			}
			for (let i = 0; i < this.variantDespdata2Display.length; i++) {
				this.variantDespdata2Display[i].isaddedToEstimate = false;
			}
			this.variantDespdata2Display[this.currentIndex].isaddedToEstimate = true;
			add2EstimateVar = JSON.parse(JSON.stringify(this.variantDespdata2Display[this.currentIndex]));
			// added by rohit
			add2EstimateVar['budget'] = this._communicationService.removeCommas(this.variantForm.controls["budget"].value);
			// add2EstimateVar['budget'] = this.variantForm.controls["budget"].value;
			add2EstimateVar['quantity'] = this.variantForm.controls['quantity'].value;
			add2EstimateVar['comments'] = this.variantForm.controls['comments'].value;
			delete add2EstimateVar['ProjectList'];
			for (let j = 0; j < add2EstimateVar['paramArray'].length; j++) {
				if (add2EstimateVar['paramArray'][j].paramType === 'String Dropdown') {
					delete add2EstimateVar['paramArray'][j].values
				}
			}
		} else {
			add2EstimateVar = JSON.parse(JSON.stringify(this.variantDespdata2Display[this.currentIndex]));
			// added by rohit
			add2EstimateVar['budget'] = this._communicationService.removeCommas(this.variantForm.controls["budget"].value);
			// add2EstimateVar['budget'] = this.variantForm.controls["budget"].value;
			add2EstimateVar['quantity'] = this.variantForm.controls['quantity'].value;
			add2EstimateVar['comments'] = this.variantForm.controls['comments'].value;
			add2EstimateVar['isaddedToEstimate'] = true;
			delete add2EstimateVar['ProjectList'];
			for (let j = 0; j < add2EstimateVar['paramArray'].length; j++) {
				if (add2EstimateVar['paramArray'][j].paramType === 'String Dropdown') {
					delete add2EstimateVar['paramArray'][j].values
				}
				if (add2EstimateVar['paramArray'][j].hasOwnProperty('cost')) {
					delete add2EstimateVar['paramArray'][j].cost;
				}
			}
		}

		add2EstimateVar['userId'] = this.UserDetail['user_id'];
		add2EstimateVar['boqId'] = this.boqDetails['boqId'];
		add2EstimateVar['projectId'] = this.projectDetails['id'];
		console.log("add2EstimateVar==>", JSON.stringify(add2EstimateVar));
		this._commonNodeCallService.AddVariantToEstimate(add2EstimateVar).subscribe(res => {
			console.log("res=====", res)
			//message: "variant added successfully"
			// statusCode: 200
			if (res['results'] != "") {
				console.log(res);
				this.addnewVariantlinkflag = false;
				this.displayVariantDialog = false;
				let newProd = {};
				newProd['checked'] = 1
				newProd['description'] = add2EstimateVar['finalDescription']
				newProd['imgPath'] = add2EstimateVar['img']
				newProd['productId'] = add2EstimateVar['id']
				newProd['productName'] = add2EstimateVar['name']
				newProd['productQuantity'] = (typeof (add2EstimateVar['quantity']) === "string") ? parseInt(add2EstimateVar['quantity']) : add2EstimateVar['quantity']
				newProd['productSubTotal'] = add2EstimateVar['budget']
				newProd['skuNo'] = add2EstimateVar['skuNo'];
				// if (this.BOQDetailJson !== undefined) {

				// }
				this.updateBoQList(newProd);
			}
		});
	}
	/**Add to Estimate */

	updateBoQList(variantData) {
		// if (this.BOQDetailJson !== undefined) {
		// 	if (this.BOQDetailJson.hasOwnProperty('categoryList')) {
		// for (let i = 0; i < this.BOQDetailJson.categoryList.length; i++) {
		// 	let catTotal = 0
		// 	let categorydata = JSON.parse(JSON.stringify(this.BOQDetailJson.categoryList[i]));
		// 	if (categorydata.subcategoryList.length !== 0) {
		// 		let subCatTotal = 0;
		// 		let SubcatQuantity = 0;
		// 		let catSubTotalWithDiscount = 0;
		// 		for (var v = 0; v < categorydata.subcategoryList.length; v++) {
		// 			if (categorydata.subcategoryList[v].itemList.length > 0) {
		// 				let itemQuantity = 0;
		// 				let itemSubtotal = 0;
		// 				for (var o = 0; o < categorydata.subcategoryList[v].itemList.length; o++) {
		// 					let  itemcount = 0;
		// 					let itemsubtotal = 0;
		// 					let itemDiscount = categorydata.subcategoryList[v].itemList[o].discount;
		// 					if (categorydata.subcategoryList[v].itemList[o].productList !== undefined && categorydata.subcategoryList[v].itemList[o].productList.length > 0) {
		// 						for (var l = 0; l < categorydata.subcategoryList[v].itemList[o].productList.length; l++) {
		// 							var prod = categorydata.subcategoryList[v].itemList[o].productList[l];
		// 							let lineTotal = 0
		// 							if (prod.skuNo === variantData.skuNo) {
		// 								categorydata.subcategoryList[v].itemList[o].productList.splice(l,1,variantData);
		// 								itemcount += variantData.productQuantity;
		// 								itemQuantity += variantData.productQuantity
		// 								itemSubtotal += variantData.productSubTotal
		// 								prod.productSubTotal = variantData.productSubTotal;
		// 								var discount = categorydata.subcategoryList[v].itemList[o].discount
		// 								if (discount > 0) {
		// 									lineTotal = itemSubtotal - (itemSubtotal * (discount / 100))
		// 								} else {
		// 									lineTotal = itemSubtotal
		// 								}
		// 								categorydata.subcategoryList[v].itemList[o].lineTotal = lineTotal
		// 							} else {
		// 								itemQuantity += prod.productQuantity
		// 								itemSubtotal += prod.productSubTotal
		// 								lineTotal = itemSubtotal;
		// 								itemcount +=  prod.productQuantity;
		// 							}

		// 							subCatTotal += itemSubtotal;
		// 							SubcatQuantity += itemQuantity;
		// 							catSubTotalWithDiscount += lineTotal;
		// 							itemsubtotal +=  prod.productSubTotal;
		// 						}
		// 					}
		// 					categorydata.subcategoryList[v].itemList[o].SubTotal = itemsubtotal;
		// 					categorydata.subcategoryList[v].itemList[o].quantity =itemcount;
		// 				}
		// 			} else {
		// 				subCatTotal += categorydata.SubTotal
		// 				categorydata.SubTotal = subCatTotal;
		// 			}
		// 		}

		// 	console.log("subCatTotal",subCatTotal)
		// 		//catTotal += subCatTotal
		// 	} 

		// 	this.BOQDetailJson.categoryList.splice(i,1,categorydata);
		// 	console.log("categorydata addto estimate",categorydata);
		// }


		if (this.BOQDetailJson !== undefined) {
			if (this.BOQDetailJson.hasOwnProperty('categoryList')) {

				for (let i = 0; i < this.BOQDetailJson.categoryList.length; i++) {

					let categorydata = JSON.parse(JSON.stringify(this.BOQDetailJson.categoryList[i]));

					let catsubTotal = 0; // will contain Category sutotal

					for (var v = 0; v < categorydata.subcategoryList.length; v++) {

						let subsubTotal = 0; // will contain Subcategory sutotal

						if (categorydata.subcategoryList[v].itemList.length !== 0) {
							for (var o = 0; o < categorydata.subcategoryList[v].itemList.length; o++) {

								let itemLevelQuantity = 0; //Will hold item level itemLevelQuantity
								let itemlevelsubtotal = 0; //will hold item level subtotal
								let itemlevelLinetotal = 0; // will hold item level linetotal

								if (categorydata.subcategoryList[v].itemList[o].productList !== undefined && categorydata.subcategoryList[v].itemList[o].productList.length > 0) {
									for (var l = 0; l < categorydata.subcategoryList[v].itemList[o].productList.length; l++) {
										var prod = categorydata.subcategoryList[v].itemList[o].productList[l];
										if (prod.skuNo === variantData.skuNo) {
											categorydata.subcategoryList[v].itemList[o].productList.splice(l, 1, variantData);
										}
										itemlevelsubtotal += categorydata.subcategoryList[v].itemList[o].productList[l].productSubTotal;
										itemLevelQuantity += categorydata.subcategoryList[v].itemList[o].productList[l].productQuantity;
									}
									let discount = categorydata.subcategoryList[v].itemList[o].discount;
									if (discount > 0) {
										itemlevelLinetotal = itemlevelsubtotal - (itemlevelsubtotal * (discount / 100))
									} else {
										itemlevelLinetotal = itemlevelsubtotal
									}
									categorydata.subcategoryList[v].itemList[o].lineTotal = itemlevelLinetotal;
									categorydata.subcategoryList[v].itemList[o].SubTotal = itemlevelsubtotal;
									categorydata.subcategoryList[v].itemList[o].quantity = itemLevelQuantity;
									subsubTotal += itemlevelLinetotal;

								}

							}

							catsubTotal += subsubTotal;
							categorydata['SubTotal'] = catsubTotal;
						} else {
							categorydata['SubTotal'] = categorydata['SubTotal'];
						}
					}
					this.BOQDetailJson.categoryList.splice(i, 1, categorydata);
				}
			}
		}



		if (this.BOQDetailJson !== undefined) {
			this.Category = [];
			this.CategoriesList = [];
			if (this.BOQDetailJson.hasOwnProperty('categoryList')) {
				this.budget = 0;
				for (let i = 0; i < this.BOQDetailJson.categoryList.length; i++) {
					const categorydata = this.BOQDetailJson.categoryList[i];
					console.log("categorydata", categorydata)
					const Obj = {};
					Obj['Categories'] = categorydata.categoryName;
					Obj['src'] = 'http://s3.amazonaws.com/wom-documents/' + categorydata.categoryImg;
					Obj['SubTotal'] = categorydata.SubTotal;
					Obj['id'] = categorydata.categoryId;
					this.CategoriesList.push(Obj);
				}

			}
			for (let i = 0; i < this.CategoriesList.length; i++) {

				if (typeof (this.CategoriesList[i].SubTotal) === 'string') {
					this.budget += parseFloat(this.CategoriesList[i].SubTotal);
				} else {
					this.budget += this.CategoriesList[i].SubTotal;
				}
			}
			for (let y = 0; y < this.BOQDetailJson['categoryList'].length; y++) {
				let tempObj = {};
				var subCatObjList = this.BOQDetailJson['categoryList'][y].subcategoryList;
				for (var k = 0; k < subCatObjList.length; k++) {
					var subCatObj = subCatObjList[k]
					this.SubCategorystatus.map(item => {
						if (subCatObj.status) {
							if (item.label === subCatObj.status) {
								subCatObj.status = item
							}
						} else {
							subCatObj.status = { label: 'Incomplete', id: 2 }
						}

					})
				}
				tempObj[this.BOQDetailJson['categoryList'][y].categoryName] = subCatObjList;
				this.Category.push(tempObj);
			}
			this.hideIndex[0] = true;
			this.activeSize = 0;
			if (this.CategoriesList[0] !== undefined) {
				console.log(" this.CategoriesList", this.CategoriesList)
				this.selectedCategory = this.CategoriesList[0].Categories;
				this.productlisting[this.selectedCategory] = this.Category[0][this.selectedCategory]; // civil ,cooling/hov obj
				this.displayList = Array.from(this.productlisting[this.selectedCategory]);
			}
		}
		// 	}
		// }

	}

	calculateVariantBudget() {
		let budget = 0;
		let cost;
		//    let  tempObj = JSON.parse(JSON.stringify(this.variantDespdata2Display[this.currentIndex].paramArray));
		for (let i = 0; i < this.formControlArray.length; i++) {
			if (this.formControlArray[i].type !== 'text' && this.formControlArray[i].type !== 'String') {
				if (this.formControlArray[i].type === 'String Dropdown') {
					if (typeof (this.formControlArray[i].selectedValue.value) === 'string') {
						// tslint:disable-next-line:radix
						budget += parseInt(this.formControlArray[i].selectedValue.value);
					} else {
						budget += this.formControlArray[i].selectedValue.value;
					}
					// tslint:disable-next-line:max-line-length
				} else if (this.formControlArray[i].type === '1 Dimension' || this.formControlArray[i].type === '2 Dimension' || this.formControlArray[i].type === '3 Dimension') {
					if (this.formControlArray[i].type === '2 Dimension' || this.formControlArray[i].type === '3 Dimension') {
						let calculateArea = 1;
						let count: any = Object.values(this.formControlArray[i].selectedValue);
						for (let n = 0; n < count.length; n++) {
							if (typeof (count[n]) === 'string') {
								calculateArea = calculateArea * parseInt(count[n]);
							} else {
								calculateArea = calculateArea * count[n];
							}
						}
						budget += calculateArea * this.formControlArray[i].cost;
					}
				}
			}
		}
		this.variantForm.patchValue({ budget: (budget * parseInt(this.quantity.value)) });
		this.variantbudget = budget * parseInt(this.quantity.value);
	}
	/**import Dialog box */

	/**Query Related  */
	addQuery(index, Object, evt) {
		//console.log("queryId",Object.queryId)
		if (this.inputMsg[index].trim() !== '') {
			console.log(this.inputMsg[index]);
			let Obj: any = {};
			Obj['queryResponseMessage'] = this.inputMsg[index];
			Obj['queryResponsetype'] = 'text';
			let d = new Date();
			let n = this.month[d.getMonth()];
			Obj['queryResponseRaisedBy'] = this.UserDetail.name;
			// Obj['timestamp'] = d.getHours() + d.getMinutes();
			Obj['queryResponseQueryTime'] = new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
			Obj['queryResponseQueryDate'] = n + ' ' + d.getDate();
			Obj['queryStatus'] = 'NULL';
			let obj2pass = {};
			obj2pass['queryFrom'] = this.raisedquryFm;
			obj2pass['queryFromid'] = this.raisedquryId;
			obj2pass['timestamp'] = Obj['queryResponseQueryTime']
			obj2pass['date'] = Obj['queryResponseQueryDate'];
			obj2pass['userId'] = this.UserDetail['user_id'];
			obj2pass['message'] = this.inputMsg[index];
			obj2pass['queryId'] = Object.queryId;
			console.log(obj2pass);
			this.inputMsg[index] = "";
			this._commonNodeCallService.SendQueryResponse(obj2pass).subscribe(res => {
				if (res['results'] != "") {
					console.log(res);
					this.Querys[index].childList1.push(Obj);
				}
			});

		}
	}

	queryStatusbtn(index, queryId, QueryStat, evt) {
		let Obj: any = {};
		let obj2pass = {};
		let d = new Date();
		let n = this.month[d.getMonth()];
		Obj['queryResponseQueryTime'] = new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
		Obj['queryResponseQueryDate'] = n + '  ' + d.getDate();
		if (QueryStat === 'Resolved') {
			Obj['queryStatus'] = 'Resolved';
			this.Querys[index].status = 'Resolved'
			obj2pass['status'] = 'Resolved';
		} else if (QueryStat === 'Reopened') {
			Obj['queryStatus'] = 'Reopened';
			this.Querys[index].status = 'Reopen';
			this.inputMsg[index] = '';
			this.Querys[index].raisedBy = this.UserDetail.email;
			obj2pass['status'] = 'Reopened';
		}
		Obj['queryResponseMessage'] = "NULL";
		Obj['queryResponsetype'] = 'text';
		Obj['queryResponseRaisedBy'] = this.UserDetail['name'];
		obj2pass['queryFrom'] = this.raisedquryFm;
		obj2pass['queryFromid'] = this.raisedquryId;
		obj2pass['timestamp'] = Obj['queryResponseQueryTime'];
		obj2pass['date'] = Obj['queryResponseQueryDate'];
		obj2pass['boqId'] = this.boqDetails['boqId'];
		obj2pass['userId'] = this.UserDetail['user_id'];
		obj2pass['queryId'] = queryId;
		console.log("UpdateQueryStatus==", obj2pass);
		this._commonNodeCallService.UpdateQueryStatus(obj2pass).subscribe(res => {
			if (res['results'] != "") {
				console.log(res);
				this.Querys[index].chatMessage.push(Obj);
				this.raiseQueryPopup = false;
			}
		});
	}
	/**Query Related  */

	/***Save Data */
	variantIdArray = [];
	globalClose;

	onFinalizenClose(closebtn, decidername) {
		this.globalClose = closebtn;
		this.globalDecider = decidername;
		this.confirmationPopup = true;

		let tempdata = JSON.parse(JSON.stringify(this.BOQDetailJson));
		if (!(tempdata.hasOwnProperty('importFromBoqId'))) {
			tempdata['importFromBoqId'] = "";
		}
		let tempdata2pass = {};
		tempdata2pass['actionType'] = this.boqDetails['BoqDetailAction'] === "Edit" ? 'update' : 'insert';
		tempdata2pass['boqId'] = this.boqDetails['boqId'];
		tempdata2pass['boqStatus'] = closebtn;
		tempdata2pass['userId'] = this.UserDetail['user_id'];
		tempdata2pass['boqStatus'] = closebtn;
		//	tempdata2pass['importFromBoqId'] = tempdata['importFromBoqId'];
		tempdata2pass['categoryList'] = [];
		for (let i = 0; i < tempdata['categoryList'].length; i++) {
			let cat1 = {}
			if (tempdata['categoryList'][i].hasOwnProperty('categoryId')) {
				cat1['categoryId'] = tempdata['categoryList'][i]['categoryId'];
			}
			if (tempdata['categoryList'][i].hasOwnProperty('importFromBoqId')) {
				cat1['importFromBoqId'] = tempdata['categoryList'][i]['importFromBoqId'];
			}
			if (tempdata['categoryList'][i]['subcategoryList'].length > 0) {
				cat1['pullFrom'] = "j";
				cat1['subcategoryList'] = [];
				cat1['importFromBoqId'] = cat1['importFromBoqId'] === undefined ? "" : cat1['importFromBoqId'];
				for (let Subcat = 0; Subcat < tempdata['categoryList'][i]['subcategoryList'].length; Subcat++) {
					cat1['subcategoryList'][Subcat] = {};
					cat1['subcategoryList'][Subcat]['importFromBoqId'] = cat1['importFromBoqId'] === undefined ? "" : cat1['importFromBoqId'];
					cat1['subcategoryList'][Subcat]['subcategoryId'] = tempdata['categoryList'][i]['subcategoryList'][Subcat].subcategoryId;
					cat1['subcategoryList'][Subcat]['status'] = tempdata['categoryList'][i]['subcategoryList'][Subcat].status.label;
					if (tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'].length > 0) {
						cat1['subcategoryList'][Subcat]['pullFrom'] = "j";
						cat1['subcategoryList'][Subcat]['itemList'] = [];
						for (let item = 0; item < tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'].length; item++) {
							cat1['subcategoryList'][Subcat]['itemList'][item] = {};
							cat1['subcategoryList'][Subcat]['itemList'][item]['itemId'] = tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['itemId'];
							cat1['subcategoryList'][Subcat]['itemList'][item]['itemDiscount'] = tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['discount'] === undefined ? 0 : tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['discount'];
							if (cat1['subcategoryList'][Subcat]['itemList'][item]['productList'] === undefined) {
								cat1['subcategoryList'][Subcat]['itemList'][item]['productList'] = [];
							}
							for (let prod = 0; prod < tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['productList'].length; prod++) {
								cat1['subcategoryList'][Subcat]['itemList'][item]['productList'][prod] = {};
								cat1['subcategoryList'][Subcat]['itemList'][item]['productList'][prod].productId = tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['productList'][prod]['productId'];
								cat1['subcategoryList'][Subcat]['itemList'][item]['productList'][prod].isDoneCheck = tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['productList'][prod]['checked'];
							}
						}
					} else {
						cat1['subcategoryList'][Subcat]['pullFrom'] = "d";
						cat1['subcategoryList'][Subcat]['itemList'] = []
					}
				}
			} else {
				cat1['pullFrom'] = "d";
			}
			tempdata2pass['categoryList'].push(cat1);
		}
		console.log("tempdata2pass==", JSON.stringify(tempdata2pass));
		//this.router.navigateByUrl("/Project/BOQ");
		this._commonNodeCallService.SaveAndFinalizeBoqDetails(tempdata2pass).subscribe(res => {
			if (res['success']) {
				console.log("success", res)
				this.router.navigateByUrl("/Project/BOQ")
			} else {
				console.log("error", res)
				this.router.navigateByUrl("/Project/BOQ")
			}
		})


		// this.variantIdArray = [];
		// let itemDiscountArr = [];
		// let checkedArr = [];
		// let itemIdArr = [];
		// let DataObj = {};
		// let subcatCompleteArr = [];
		// let subcatWIPArr = [];
		// let info = this.Category;
		// for (let i = 0; i < info.length; i++) {
		// 	let tempCatArr = Object.keys(info[i]);
		// 	let catName = tempCatArr[0];
		// 	for (let m = 0; m < info[i][catName].length; m++) {//loop on category 
		// 		let subCat = info[i][catName][m];
		// 		//for(let j = 0;j < subCat.length; j++ ) { //loop on subcategory
		// 		if (subCat.status.label === 'Complete') {
		// 			subcatCompleteArr.push(subCat.subcategoryId)
		// 		} else if (subCat.status.label === 'WIP') {
		// 			subcatWIPArr.push(subCat.subcategoryId)
		// 		}
		// 		let Item = subCat.itemList;
		// 		for (let k = 0; k < Item.length; k++) { //item level loop
		// 			// Add Code for Discount here
		// 			// ******************Discount******************
		// 			// Add Code for Discount here

		//             /* let itemdiscountObj = {};
		//             itemdiscountObj['itemId'] = Item[k].itemId;
		//             itemdiscountObj['discount'] = Item[k].Discount;
		//               itemDiscountArr.push(itemdiscountObj);*/
		// 			itemIdArr.push(Item[k].itemId);
		// 			itemDiscountArr.push(Item[k].discount);
		// 			for (let l = 0; l < Item[k].productList.length; l++) { //Product Level loop for id
		// 				this.variantIdArray.push(Item[k].productList[l].productId); // Replace SKUno with id As current temp json i.e.(Category Json Does not contain id)
		// 				if (Item[k].productList[l].checked) {
		// 					checkedArr.push(Item[k].productList[l].productId)
		// 				}
		// 			}
		// 		}
		// 		//}
		// 	}
		// }
		// DataObj['subcatCompleteArr'] = subcatCompleteArr;
		// DataObj['subcatCompleteCount'] = subcatCompleteArr.length;
		// DataObj['subcatWIPArr'] = subcatWIPArr;
		// DataObj['subcatWIPCount'] = subcatWIPArr.length;
		// DataObj['itemIdArr'] = itemIdArr;
		// DataObj['itemCount'] = itemIdArr.length;
		// DataObj['itemDiscountArr'] = itemDiscountArr;
		// DataObj['isDoneVariantId'] = checkedArr;
		// DataObj['variantIdArray'] = this.variantIdArray;
		// DataObj['variantIdCount'] = this.variantIdArray.length
		// DataObj['status'] = closebtn;
		// console.log(DataObj); // pass this dataObj to db for save
	}



	/**Raise New Query */
	raiseQueryPopup: boolean = false;
	raisedquryFm;
	raisedquryId;
	raiseForm: FormGroup;
	responseArray = [];
	resolvedArray = [];
	queryArray = ['responseById', 'resolveById'];
	showRaiseQueryPopup(level, data) {
		this.Querys = [];
		this.responseArray = [];
		this.resolvedArray = [];
		this.showQueryForm = false;
		console.log(level);
		console.log(data);
		this.raiseForm = new FormGroup({
			title: new FormControl('', [
				Validators.required, Validators.minLength(3)
			]),
			description: new FormControl('', [
				Validators.required, Validators.minLength(3)
			]),
			rspdate: new FormControl('', [
				Validators.required
			]),
			assignto: new FormControl('', [
				Validators.required
			])
		});
		let obj2pass = {};
		this.selectedRaiseQueryData = data;
		if (level === 'subCatlvl') {
			obj2pass['queryFrom'] = 's';
			obj2pass['queryFromid'] = data['subcategoryId'];
			this.raisedquryFm = 's';
			this.raisedquryId = data['subcategoryId'];
		} else if (level === 'prdlvl') {
			obj2pass['queryFrom'] = 'p';
			obj2pass['queryFromid'] = data['productId'];
			this.raisedquryFm = 'p';
			this.raisedquryId = data['productId'];
		}
		obj2pass['userId'] = this.UserDetail['user_id'];
		obj2pass['boqId'] = this.boqDetails['boqId'];
		//console.log("obj2pass", obj2pass)
		this._commonNodeCallService.DisplayQueryProcCall(obj2pass).subscribe(res => {
			if (res['results'] != "") {
				console.log(res);
				console.log("res['results']", res['results'].length)
				for (let l = 0; l < res['results'].length; l++) {
					console.log("JSON.parse(res['results'][l].jsonValue)", JSON.parse(res['results'][l].jsonValue))
					this.Querys.push(JSON.parse(res['results'][l].jsonValue));
				}
				console.log("this.Querys", this.Querys)
				for (let k = 0; k < this.Querys.length; k++) {
					for (let g = 0; g < this.queryArray.length; g++) {
						console.log("this.queryArray[g]", this.queryArray[g])
						var responseByIds = JSON.parse(this.Querys[k][this.queryArray[g]]);
						for (let l = 0; l < responseByIds.length; l++) {
							if (responseByIds[l] === this.UserDetail['user_id']) {
								if (this.queryArray[g] === 'responseById') {
									this.responseArray[k] = true;
								} else {
									this.resolvedArray[k] = true
								}
								break;
							} else {
								if (this.queryArray[g] === 'responseById') {
									this.responseArray[k] = false;
								} else {
									this.resolvedArray[k] = false
								}
							}
						}
					}
					console.log(this.resolvedArray);
					console.log(this.responseArray);
				}

				console.log(this.Querys);
			}
		});
		this.raiseQueryPopup = true;
	}
	closeRaiseQueryPopup() {
		this.raiseQueryPopup = false;
		this.showQueryForm = false;
	}

	selectedRaiseQueryData
	queryformerror: boolean = false;
	raiseNewQuery(formdata) {
		console.log("formdata.invalid===", formdata.invalid)
		if (formdata.invalid) {
			this.queryformerror = true
		} else {
			let obj2pass = {};
			// obj2pass[''] = 
			let date = formdata.rspdate.getDate() < 10 ? "0" + formdata.rspdate.getDate() : formdata.rspdate.getDate();
			let month = formdata.rspdate.getMonth() + 1 < 10 ? formdata.rspdate.getMonth() + 1 : formdata.rspdate.getMonth() + 1;
			let year = formdata.rspdate.getFullYear();
			//console.log("formdata.rspdate",formdata.rspdate)
			//console.log("month",month.length>2)
			if (month < 10) month = '0' + month;
			// if (date.length < 2) date = '0' + date;
			//let responsedate = date + "-" + month + "-" + year;
			let responsedate = year + "-" + month + "-" + date;
			//console.log("responsedate",responsedate)
			obj2pass['queryFrom'] = this.raisedquryFm;
			obj2pass['queryFromid'] = this.raisedquryId;
			obj2pass['title'] = formdata['title'];
			obj2pass['description'] = formdata['description'];
			obj2pass['responseDate'] = responsedate;
			obj2pass['assignedTo'] = formdata['assignto'].id;
			obj2pass['userId'] = this.UserDetail['user_id'];
			obj2pass['boqId'] = this.boqDetails['boqId'];
			let d = new Date();
			let n = this.month[d.getMonth()];
			// Obj['timestamp'] = d.getHours() + d.getMinutes();
			obj2pass['timestamp'] = new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
			obj2pass['date'] = n + ' ' + d.getDate();
			console.log("obj2pass==", obj2pass);
			this._commonNodeCallService.RaiseQuery(obj2pass).subscribe(res => {
				console.log(res);
				if (res['results'] != "") {

					this.raiseQueryPopup = false;
				}
			});
		}

	}

	//assigntoresults: labelid[] = [{ label: 'Amol', id: 1 }, { label: 'Aakash', id: 2 }, { label: 'Nitin', id: 3 }, { label: 'Gaurang', id: 4 }]; // assign  array from db 
	filteredassigntosresults: labelid[] = [];

	searchassignto(event) {
		// console.log("checking event "+ event);
		this.filteredassigntosresults = this.assigntoresults
			.filter(data => data.label.toString()
				.toLowerCase()
				.indexOf(event.query.toString().toLowerCase()) !== -1);
	}

	assigntodropdown() {
		this.filteredassigntosresults;
	}

	get title() {
		return this.raiseForm.get('title');
	}
	get description() {
		return this.raiseForm.get('description');
	}
	get rspdate() {
		return this.raiseForm.get('rspdate');
	}
	get assignto() {
		return this.raiseForm.get('assignto');
	}

	/**import project at category level */

	categorylvlBOQimp = [];
	selectedcategorylvlBOQimp;
	categorylvlBOQimplist = false;
	categoryIdforImport


	showDialogimport(categoryData, evt) {
		console.log(categoryData);
		this.categoryIdforImport = categoryData['id'];
		console.log(evt);
		this.categorylvlBOQimplist = false;
		this.project = {}
		this.selectedcategorylvlBOQimp = {};
		let temp = {};
		temp['projectId'] = this.projectDetails['id'];
		temp['project_name'] = this.projectDetails['Name'];
		temp['sbuId'] = this.projectDetails.sbuId;
		this._commonNodeCallService.GetActiveProjects(temp).subscribe(res => {
			if (res['success']) {
				console.log(res);
				let tempArr = [];
				for (let i = 0; i < res['results'].length; i++) {
					let tempObj = {};
					tempObj['label'] = res['results'][i].projectName;
					tempObj['id'] = res['results'][i].id;
					tempArr.push(tempObj);
				}
				console.log(tempArr);
				this.projects = tempArr;
				this.displayimports = true;
				console.log(this.projects);
			}
		});
	}
	import_cancel_button() {
		this.displayimports = false;
		this.categorylvlBOQimp = [];
		this.projects = [];
		this.categorylvlBOQimplist = false;
		this.NoBoQ2Imp = false;
	}
	NoBoQ2Imp = false;
	getBOQListfromDB() {
		console.log(this.project);
		let tempObj = {};
		tempObj['projectId'] = this.project['id'];
		tempObj['catId'] = this.categoryIdforImport;
		this._commonNodeCallService.GetBoqByCatIdAndProjectId(tempObj).subscribe(res => {
			if (res['success']) {
				console.log(res);
				this.categorylvlBOQimplist = true;
				this.categorylvlBOQimp = [];
				let tempArr = [];
				for (let i = 0; i < res['results'].length; i++) {
					let tempObj = {};
					tempObj['label'] = res['results'][i].BOQ_name;
					tempObj['id'] = res['results'][i].id;
					tempArr.push(tempObj);
				}
				this.categorylvlBOQimp = tempArr;
			} else {
				this.NoBoQ2Imp = true;
			}
		});
	}
	getCategoryData() {
		// console.log(this.project);
		// console.log(this.selectedcategorylvlBOQimp);
		// console.log(this.categoryIdforImport);
		let temp = {}
		//temp['catId'] = this.categoryIdforImport;
		temp['boqId'] = this.selectedcategorylvlBOQimp['id'];
		this.selectedBOQ = this.selectedcategorylvlBOQimp;
		temp['projectId'] = this.project['id'];
		temp['categoryId'] = this.categoryIdforImport;
		temp['subCategoryId'] = 0;
		temp['catID'] = 0
		temp['subCatID'] = 0
		temp['shortJson'] = 1
		this._commonNodeCallService.BoqDetailsProcCall(temp).subscribe(res => {
			//console.log("res=getCategoryData==", res)
			if (res['results'] != "") {
				//console.log(res['results']);

				var jsonData;
				for (let i = 0; i < res['results'].length; i++) {
					jsonData = JSON.parse(res['results'][i].jsonValue);
					if (jsonData["boqId"] !== -1) {
						console.log(jsonData)
						jsonData = this._communicationService.setJson(jsonData, ['categoryList'], ['childList1']);
						if (jsonData['categoryList'] !== null) {
							for (let i = 0; i < jsonData['categoryList'].length; i++) {
								if (jsonData['categoryList'][i]['categoryId'] !== 0 && (jsonData['categoryList'][i]['categoryId'] === this.categoryIdforImport)) {
									jsonData['categoryList'][i] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i], ['SubTotal', 'subcategoryList'], ['categorySubTotal', 'childList2'])));
									if (jsonData['categoryList'][i]['subcategoryList'] !== null) {
										var catSubTotal = 0;
										for (let j = 0; j < jsonData['categoryList'][i]['subcategoryList'].length; j++) {
											if (jsonData['categoryList'][i]['subcategoryList'][j]['subcategoryId'] !== 0) {
												jsonData['categoryList'][i]['subcategoryList'][j] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j], ['status', 'itemList'], ['scmstatus', 'childList3'])));
												jsonData['categoryList'][i]['subcategoryList'][j]['boqId'] = jsonData["boqId"]
												if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] !== null) {
													var subCatTotal = 0;
													var SubcatQuantity = 0;
													var catSubTotalWithDiscount = 0
													for (let k = 0; k < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].length; k++) {
														if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['itemId'] !== 0) {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k] = JSON.parse(JSON.stringify(this._communicationService.setJson(jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k], ['quantity', 'SubTotal', 'productList'], ['subCategoryQuantity', 'itemSubTotal', 'childList4'])));
															if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] === null) {
																jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'] = [];
															}
															var itemSubtotal = 0
															var itemQuantity = 0;
															for (let prodnullCheck = 0; prodnullCheck < jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].length; prodnullCheck++) {
																if (jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productId'] === 0) {
																	jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'].splice(prodnullCheck, 1);
																} else {
																	itemSubtotal += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productSubTotal']
																	itemQuantity += jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k]['productList'][prodnullCheck]['productQuantity']
																}
															}

															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].quantity = itemQuantity
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].SubTotal = itemSubtotal
															let lineTotal = 0
															var discount = jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].discount
															if (discount > 0) {
																lineTotal = itemSubtotal - (itemSubtotal * (discount / 100))
															} else {
																lineTotal = itemSubtotal
															}
															catSubTotalWithDiscount += lineTotal
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'][k].lineTotal = lineTotal
															subCatTotal += itemSubtotal;
															SubcatQuantity += itemQuantity;

														} else {
															jsonData['categoryList'][i]['subcategoryList'][j]['itemList'].splice(k, 1);
														}
													}
													console.log("catSubTotalWithDiscount", catSubTotalWithDiscount)
													catSubTotal += catSubTotalWithDiscount

												} else {
													jsonData['categoryList'][i]['subcategoryList'][j]['itemList'] = [];
													catSubTotal += jsonData['categoryList'][i]['SubTotal']
												}
											} else {
												jsonData['categoryList'][i]['subcategoryList'].splice(j, 1);
											}
										}
										console.log("catSubTotal==", catSubTotal)
										jsonData['categoryList'][i].SubTotal = catSubTotal
									} else {
										jsonData['categoryList'][i]['subcategoryList'] = [];
									}
								}
							}
						} else {
							jsonData['categoryList'] = [];
						}
					}
					console.log("jsonData==", jsonData)

				}
				let orgCat = this.BOQDetailJson;
				this.addCategoryjourney = true;
				this.BOQDetailJson = this.mergeCategoryJson(orgCat, jsonData);

				console.log("this.BOQDetailJson==", this.BOQDetailJson)

				if (this.BOQDetailJson !== undefined) {
					if (this.BOQDetailJson.hasOwnProperty('categoryList')) {
						this.CategoriesList = []
						for (let i = 0; i < this.BOQDetailJson.categoryList.length; i++) {
							const categorydata = this.BOQDetailJson.categoryList[i];
							const Obj = {};
							Obj['Categories'] = categorydata.categoryName;
							Obj['src'] = 'http://s3.amazonaws.com/wom-documents/' + categorydata.categoryImg;
							Obj['SubTotal'] = categorydata.SubTotal;
							Obj['id'] = categorydata.categoryId;
							this.CategoriesList.push(Obj);
						}
					}
					this.Category = []
					for (let y = 0; y < this.BOQDetailJson['categoryList'].length; y++) {
						let tempObj = {};
						var subCatObjList = this.BOQDetailJson['categoryList'][y].subcategoryList;
						for (var k = 0; k < subCatObjList.length; k++) {
							var subCatObj = subCatObjList[k]
							this.SubCategorystatus.map(item => {
								if (subCatObj.status) {
									if (item.label === subCatObj.status) {
										subCatObj.status = item
									}
								} else {
									subCatObj.status = { label: 'Incomplete', id: 2 }
								}
							})
						}
						tempObj[this.BOQDetailJson['categoryList'][y].categoryName] = subCatObjList;

						this.Category.push(tempObj);
					}
				}

				this.budget = 0
				for (let h = 0; h < this.CategoriesList.length; h++) {
					if (typeof (this.CategoriesList[h].SubTotal) === 'string') {
						this.budget += parseFloat(this.CategoriesList[h].SubTotal);
					} else {
						this.budget += this.CategoriesList[h].SubTotal;
					}
				}
				console.log("this.budget", this.budget)
				this.hideIndex[0] = true;
				this.activeSize = 0;
				if (this.CategoriesList[0] !== undefined) {
					this.selectedCategory = this.CategoriesList[0].Categories;
					this.productlisting[this.selectedCategory] = this.Category[0][this.selectedCategory]; // civil ,cooling/hov obj
					this.displayList = Array.from(this.productlisting[this.selectedCategory]);
				}


			}


		});
	}
	/**import project at category level */



	/**Merge BOQDetailJson*/
	mergeCategoryJson(orgJson, refJson) {
		let importfromboq = null
		if (this.selectedBOQ) {
			importfromboq = this.selectedBOQ['id']
		} else {
			importfromboq = null
		}
		if (orgJson !== undefined && orgJson.hasOwnProperty('categoryList')) {
			for (let categoryListResArr = 0; categoryListResArr < refJson['categoryList'].length; categoryListResArr++) {
				let cat2pushFound = false;
				for (let categoryListOrgArr = 0; categoryListOrgArr < orgJson['categoryList'].length; categoryListOrgArr++) {
					if (refJson['categoryList'][categoryListResArr].categoryId === orgJson['categoryList'][categoryListOrgArr]['categoryId']) {
						cat2pushFound = true;
						orgJson['categoryList'][categoryListOrgArr]['importFromBoqId'] = importfromboq;
						for (let subcatresArr = 0; subcatresArr < refJson['categoryList'][categoryListResArr]['subcategoryList'].length; subcatresArr++) {
							let subCat2pushFound = false;
							var catSubTotal = 0;
							for (let subcatorgArr = 0; subcatorgArr < orgJson['categoryList'][categoryListOrgArr]['subcategoryList'].length; subcatorgArr++) {
								if (refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr].subcategoryId === orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['subcategoryId']) {
									subCat2pushFound = true;
									for (let itemresArr = 0; itemresArr < refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'].length; itemresArr++) {
										let item2pushFound = false;
										var subCatTotal = 0;
										var SubcatQuantity = 0;
										var catSubTotalWithDiscount = 0
										for (let itemorgArr = 0; itemorgArr < orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'].length; itemorgArr++) {
											if (refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr].itemId === orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['itemId']) {
												item2pushFound = true;
												for (let prodresArr = 0; prodresArr < refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'].length; prodresArr++) {
													let Productnotfound = true;
													var productQuantity = 0
													var productSubtotal = 0
													for (let prodorgArr = 0; prodorgArr < orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['productList'].length; prodorgArr++) {
														if (orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['productList'][prodorgArr].skuNo === refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'][prodresArr].skuNo) {
															orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['productList'][prodorgArr] = refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'][prodresArr];
															productQuantity += refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'][prodresArr]['productQuantity'];
															productSubtotal += refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'][prodresArr]['productSubTotal']
															Productnotfound = false;
															//break;
														} else {
															productQuantity += refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'][prodresArr]['productQuantity'];
															productSubtotal += refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'][prodresArr]['productSubTotal']
														}
													}
													if (Productnotfound) {
														orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['productList'].push(refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]['productList'][prodresArr]);
													}

													orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['quantity'] = productQuantity;
													orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['SubTotal'] = productSubtotal;
													let lineTotal = 0
													var discount = refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr].discount
													if (discount > 0) {
														lineTotal = productSubtotal - (productSubtotal * (discount / 100))
													} else {
														lineTotal = productSubtotal
													}
													orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'][itemorgArr]['lineTotal'] = lineTotal;
													subCatTotal += productSubtotal
													SubcatQuantity += productQuantity
													catSubTotalWithDiscount += lineTotal
													catSubTotal += catSubTotalWithDiscount
												}
											} else {
												catSubTotal += orgJson['categoryList'][categoryListOrgArr]['SubTotal']
											}
										}
										if (!item2pushFound) {
											orgJson['categoryList'][categoryListOrgArr]['subcategoryList'][subcatorgArr]['itemList'].push(refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['itemList'][itemresArr]);
										}
										//catSubTotal += orgJson['categoryList'][categoryListOrgArr]['SubTotal']
									}
								}
							}
							if (!subCat2pushFound) {
								refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]['boqId'] = -1
								orgJson['categoryList'][categoryListOrgArr]['subcategoryList'].push(refJson['categoryList'][categoryListResArr]['subcategoryList'][subcatresArr]);
							}
							orgJson['categoryList'][categoryListOrgArr]['SubTotal'] = catSubTotal;
						}
					}
				}
				if (!cat2pushFound) {
					orgJson['categoryList'].push(refJson['categoryList'][categoryListResArr]);
				}
			}
		} else {
			orgJson = {};
			for (let imp = 0; imp < refJson['categoryList'].length; imp++) {
				refJson['categoryList'][imp]['importFromBoqId'] = this.addCategoryjourney ? null : refJson['boqId'];
			}
			this.addCategoryjourney = false;
			orgJson['categoryList'] = refJson['categoryList'];
			orgJson['boqId'] = this.boqDetails['boqId'];
			orgJson['importFromBoqId'] = refJson['boqId'];
		}
		console.log("orgJson==", orgJson)
		return orgJson;
	}
	/**Merge BOQDetailJson*/
	// popup
	confirmationYes() {
		if (this.globalDecider === 'delete this category') {
			this.categoryclosedOld(this.globalCategory, this.globalevent);
		} else if (this.globalDecider === 'delete this variant') {
			this.deleteProjectFromListOld(this.globalSubCategory, this.globalItem, this.globalProduct, this.globalvariantevt)
		} else {
			this.onFinalizenCloseOld(this.globalClose);
		}
	}
	confirmationNo() {
		this.confirmationPopup = false;
	}
	// delete category
	categoryclosedOld(category, evt) {

		this.budget = 0;
		for (let i = 0; i < this.CategoriesList.length; i++) {
			if (this.CategoriesList[i].Categories === category.Categories) {
				if (this.CategoriesList[i].Categories === this.selectedCategory) {
					this.displayList = [];
				}
				const data = this.CategoriesList.splice(i, 1);
				let temp: any = {};
				console.log("data[0]['src']", data[0]['src'])
				temp['categoryId'] = data[0]["id"];
				temp['categoryImg'] = data[0]['src'];
				temp['categoryName'] = data[0]['Categories'];
				temp['SubTotal'] = data[0]['SubTotal'];
				temp['subcategoryList'] = [];
				this.removeCategoryList.push(temp);
			} else {
				if (typeof (this.CategoriesList[i].SubTotal) === 'string') {
					this.budget += parseFloat(this.CategoriesList[i].SubTotal);
				} else {
					this.budget += this.CategoriesList[i].SubTotal;
				}
			}
		}
		console.log(category, evt);
		this.confirmationPopup = false;
	}
	// delete variant
	deleteProjectFromListOld(subCategoryName, item, product, evt) {
		this.budget = 0;
		let categorytotal = 0;
		var subcategorytotal = 0;
		for (let i = 0; i < this.displayList.length; i++) {
			if (this.displayList[i].subcategoryName === subCategoryName.subcategoryName) {
				for (let j = 0; j < this.displayList[i].itemList.length; j++) {
					for (let k = 0; k < this.displayList[i].itemList[j].productList.length; k++) {
						if (this.displayList[i].itemList[j].productList[k].productName === item.productName) {
							this.displayList[i].itemList[j].quantity = this.displayList[i].itemList[j].quantity - this.displayList[i].itemList[j].productList[k].productQuantity;
							//console.log("this.displayList[i].itemList[j].SubTotal", this.displayList[i].itemList[j].SubTotal)
							this.displayList[i].itemList[j].SubTotal = this.displayList[i].itemList[j].SubTotal - this.displayList[i].itemList[j].productList[k].productSubTotal;
							if (this.displayList[i].itemList[j].discount === '0') {
								this.displayList[i].itemList[j].lineTotal = this.displayList[i].itemList[j].SubTotal;
							} else {
								const x = this.displayList[i].itemList[j].discount;
								// const data = x.substring(0, x.search('%'));
								// tslint:disable-next-line:prefer-const
								let disountamt = (x / 100) * this.displayList[i].itemList[j].SubTotal;
								this.displayList[i].itemList[j].lineTotal = this.displayList[i].itemList[j].SubTotal - disountamt;
							}
							this.displayList[i].itemList[j].productList.splice(k, 1);
							if (this.displayList[i].itemList[j].productList.length === 0) {
								this.displayList[i].itemList[j].discount = '0';
							}
						}
					}
					subcategorytotal += this.displayList[i].itemList[j].lineTotal;
				}
				this.displayList[i].lineTotal = subcategorytotal;
			}
			categorytotal += this.displayList[i].lineTotal;
		}
		for (let h = 0; h < this.CategoriesList.length; h++) {
			if (this.CategoriesList[h].Categories === this.selectedCategory) {
				this.CategoriesList[h].SubTotal = categorytotal.toString();
			}
			if (typeof (this.CategoriesList[h].SubTotal) === 'string') {
				this.budget += parseFloat(this.CategoriesList[h].SubTotal);
			} else {
				this.budget += this.CategoriesList[h].SubTotal;
			}
			console.log("this.budget", this.budget)
		}
		this.confirmationPopup = false;
	}
	// finalise and save logic
	onFinalizenCloseOld(closebtn) {
		let tempdata = JSON.parse(JSON.stringify(this.BOQDetailJson));
		if (!(tempdata.hasOwnProperty('importFromBoqId'))) {
			tempdata['importFromBoqId'] = "";
		}
		let tempdata2pass = {};
		tempdata2pass['actionType'] = this.boqDetails['BoqDetailAction'] === "Edit" ? 'update' : 'insert';
		tempdata2pass['boqId'] = this.boqDetails['boqId'];
		tempdata2pass['boqStatus'] = closebtn;
		tempdata2pass['userId'] = this.UserDetail['user_id'];
		tempdata2pass['boqStatus'] = closebtn;
		//	tempdata2pass['importFromBoqId'] = tempdata['importFromBoqId'];
		tempdata2pass['categoryList'] = [];
		for (let i = 0; i < tempdata['categoryList'].length; i++) {
			let cat1 = {}
			if (tempdata['categoryList'][i].hasOwnProperty('categoryId')) {
				cat1['categoryId'] = tempdata['categoryList'][i]['categoryId'];
			}
			if (tempdata['categoryList'][i].hasOwnProperty('importFromBoqId')) {
				cat1['importFromBoqId'] = tempdata['categoryList'][i]['importFromBoqId'];
			}
			if (tempdata['categoryList'][i]['subcategoryList'].length > 0) {
				cat1['pullFrom'] = "j";
				cat1['subcategoryList'] = [];
				cat1['importFromBoqId'] = cat1['importFromBoqId'] === undefined ? "" : cat1['importFromBoqId'];
				for (let Subcat = 0; Subcat < tempdata['categoryList'][i]['subcategoryList'].length; Subcat++) {
					cat1['subcategoryList'][Subcat] = {};
					cat1['subcategoryList'][Subcat]['importFromBoqId'] = cat1['importFromBoqId'] === undefined ? "" : cat1['importFromBoqId'];
					cat1['subcategoryList'][Subcat]['subcategoryId'] = tempdata['categoryList'][i]['subcategoryList'][Subcat].subcategoryId;
					cat1['subcategoryList'][Subcat]['status'] = tempdata['categoryList'][i]['subcategoryList'][Subcat].status.label;
					if (tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'].length > 0) {
						cat1['subcategoryList'][Subcat]['pullFrom'] = "j";
						cat1['subcategoryList'][Subcat]['itemList'] = [];
						for (let item = 0; item < tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'].length; item++) {
							cat1['subcategoryList'][Subcat]['itemList'][item] = {};
							cat1['subcategoryList'][Subcat]['itemList'][item]['itemId'] = tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['itemId'];
							cat1['subcategoryList'][Subcat]['itemList'][item]['itemDiscount'] = tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['discount'] === undefined ? 0 : tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['discount'];
							if (cat1['subcategoryList'][Subcat]['itemList'][item]['productList'] === undefined) {
								cat1['subcategoryList'][Subcat]['itemList'][item]['productList'] = [];
							}
							for (let prod = 0; prod < tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['productList'].length; prod++) {
								cat1['subcategoryList'][Subcat]['itemList'][item]['productList'][prod] = {};
								cat1['subcategoryList'][Subcat]['itemList'][item]['productList'][prod].productId = tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['productList'][prod]['productId'];
								cat1['subcategoryList'][Subcat]['itemList'][item]['productList'][prod].isDoneCheck = tempdata['categoryList'][i]['subcategoryList'][Subcat]['itemList'][item]['productList'][prod]['checked'];
							}
						}
					} else {
						cat1['subcategoryList'][Subcat]['pullFrom'] = "d";
						cat1['subcategoryList'][Subcat]['itemList'] = []
					}
				}
			} else {
				cat1['pullFrom'] = "d";
			}
			tempdata2pass['categoryList'].push(cat1);
		}
		console.log("tempdata2pass==", JSON.stringify(tempdata2pass));
		this.router.navigateByUrl("/Project/BOQ");
		this._commonNodeCallService.SaveAndFinalizeBoqDetails(tempdata2pass).subscribe(res => {
			if (res['success']) {
				console.log("success", res)
				this.router.navigateByUrl("/Project/BOQ")
			} else {
				console.log("error", res)
				this.router.navigateByUrl("/Project/BOQ")
			}
		})
		this.confirmationPopup = false;

		// this.variantIdArray = [];
		// let itemDiscountArr = [];
		// let checkedArr = [];
		// let itemIdArr = [];
		// let DataObj = {};
		// let subcatCompleteArr = [];
		// let subcatWIPArr = [];
		// let info = this.Category;
		// for (let i = 0; i < info.length; i++) {
		// 	let tempCatArr = Object.keys(info[i]);
		// 	let catName = tempCatArr[0];
		// 	for (let m = 0; m < info[i][catName].length; m++) {//loop on category 
		// 		let subCat = info[i][catName][m];
		// 		//for(let j = 0;j < subCat.length; j++ ) { //loop on subcategory
		// 		if (subCat.status.label === 'Complete') {
		// 			subcatCompleteArr.push(subCat.subcategoryId)
		// 		} else if (subCat.status.label === 'WIP') {
		// 			subcatWIPArr.push(subCat.subcategoryId)
		// 		}
		// 		let Item = subCat.itemList;
		// 		for (let k = 0; k < Item.length; k++) { //item level loop
		// 			// Add Code for Discount here
		// 			// ******************Discount******************
		// 			// Add Code for Discount here

		//             /* let itemdiscountObj = {};
		//             itemdiscountObj['itemId'] = Item[k].itemId;
		//             itemdiscountObj['discount'] = Item[k].Discount;
		//               itemDiscountArr.push(itemdiscountObj);*/
		// 			itemIdArr.push(Item[k].itemId);
		// 			itemDiscountArr.push(Item[k].discount);
		// 			for (let l = 0; l < Item[k].productList.length; l++) { //Product Level loop for id
		// 				this.variantIdArray.push(Item[k].productList[l].productId); // Replace SKUno with id As current temp json i.e.(Category Json Does not contain id)
		// 				if (Item[k].productList[l].checked) {
		// 					checkedArr.push(Item[k].productList[l].productId)
		// 				}
		// 			}
		// 		}
		// 		//}
		// 	}
		// }
		// DataObj['subcatCompleteArr'] = subcatCompleteArr;
		// DataObj['subcatCompleteCount'] = subcatCompleteArr.length;
		// DataObj['subcatWIPArr'] = subcatWIPArr;
		// DataObj['subcatWIPCount'] = subcatWIPArr.length;
		// DataObj['itemIdArr'] = itemIdArr;
		// DataObj['itemCount'] = itemIdArr.length;
		// DataObj['itemDiscountArr'] = itemDiscountArr;
		// DataObj['isDoneVariantId'] = checkedArr;
		// DataObj['variantIdArray'] = this.variantIdArray;
		// DataObj['variantIdCount'] = this.variantIdArray.length
		// DataObj['status'] = closebtn;
		// console.log(DataObj); // pass this dataObj to db for save
	}
}

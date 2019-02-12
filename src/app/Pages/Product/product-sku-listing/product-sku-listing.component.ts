import { Component, OnInit } from "@angular/core";
import { CommunicateService } from "src/app/services/Communication/communicate.service";
import {
FormGroup,
FormControl,
Validators,
FormBuilder
} from "node_modules/@angular/forms";
import { CommonCallService } from "src/app/services/CommonNodeCall/common-call.service";
import { UploadfileService } from 'src/app/services/FileUpload/uploadfile.service'
import { SelectItem } from "primeng/api";
import { Router } from "@angular/router";

export class labelid {
label: string
id: number
}

@Component({
selector: "app-product-sku-listing",
templateUrl: "./product-sku-listing.component.html",
styleUrls: ["./product-sku-listing.component.css"]
})
export class ProductSkuListingComponent implements OnInit {
display_message_for_product_delete: boolean;
message;
previewarr;
globalDropdown = [];
dropdownselect: SelectItem[] = [];
filterCategory: labelid[] = [];
norecords:boolean =false;
productslength;
form: FormGroup;
constructor(
	public _communicationService: CommunicateService,
	private formbuilder: FormBuilder,
	private _commonNodeCallService: CommonCallService,
	private uploadService: UploadfileService,
	private router: Router
) {
	var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
	sessionStorage.setItem('selectedFunctionality', 'Products Master');
	if (!privillageArray) {
		this.router.navigateByUrl('/login');
	}

	//console.log("constructor call");
	this.form = new FormGroup({
		stringdata: new FormControl("", [
			Validators.required,
			Validators.pattern(this._communicationService.pattern.onlychar)
		]),
		dimension1: new FormControl("", [
			Validators.required
			// ,Validators.pattern("^[A-Za-z0-9_]*$")
		]),
		dimension21: new FormControl("", [
			Validators.required
			// ,Validators.pattern("^[A-Za-z0-9_]*$")
		]),
		dimension22: new FormControl("", [
			Validators.required
			// ,Validators.pattern("^[A-Za-z0-9_]*$")
		]),
		dimension31: new FormControl("", [
			Validators.required
			// ,Validators.pattern("^[A-Za-z0-9_]*$")
		]),
		dimension32: new FormControl("", [
			Validators.required
			// , Validators.pattern("^[A-Za-z0-9_]*$")
		]),
		dimension33: new FormControl("", [
			Validators.required
			// ,Validators.pattern("^\d+(\.\d{1,2})?$")
		]),
		dropdowndata: new FormControl("")
	});
	this.form = this.formbuilder.group({
		stringdata: "",
		dimension1: "",
		dimension21: "",
		dimension22: "",
		dimension31: "",
		dimension32: "",
		dimension33: "",
		dropdowndata: ""
	});
	this._communicationService.backendError = false;
}
cols: any[];
// categories:any[];
categories: any[] = [];
details;
details1;
details2;
previewDescription = false;
previewDescriptionerror;
type = "";
dimension_3 = false;
dimension_2 = false;
dimension_1 = false;
string = false;
dropdown = false;
productList = [];


isEdit = false;
isListing = false;
isDelete = false;
isAdd = false;

ngOnInit() {
	this._communicationService.loader = true;
	let tempObj = []
	this._commonNodeCallService.GetCategoryListing().subscribe(res => {
		if (res['results'] != "") {
			res['results'].forEach(element => {
				tempObj.push({ label: element.name, id: element.id });
			});
		this.filterCategory = tempObj;
		}
	})

	this.previewDescriptionerror = false;
	
	let data={}
	data['catId'] = 0;
	this._commonNodeCallService.GetProducts(data).subscribe(res => {
		this._communicationService.loader = false;
		if(res["success"]){
			if (res["results"].length > 0) {
				res["results"].forEach(element => {
					var productObj = {
						id: element.id,
						SKU: element.sku_no,
						ProductName: element.name,
						Image: 'http://s3.amazonaws.com/wom-documents/' + element.product_src,
						Category: element.categoryName
					};
					this.categories.push(productObj);
				});
				this.productslength = this.categories.length;
				//console.log("$$$$$$$$$$$" + JSON.stringify(this.categories));
			} else {
				console.log("No records to display here");
				this.norecords=true;
			}
		}else{
			if(res['statusCode'] === 401){
				this.router.navigateByUrl('/login');
			}else{
				this._communicationService.backendError = true;
			}
		}
		
	});


	this.cols = [
		{ field: "SKU", header: "SKU", width: "3%" },
		{ field: "ProductName", header: "Product Name", width: "8%" },
		{ field: "Category", header: "Category", width: "5%" },
		{ field: "Image", header: "Image", width: "4%" },
		{ field: "Action", header: "Action", width: "5%" }
	];

	this._communicationService.productcancel.subscribe(data => {
		if (data == false) {
			this.displayaddnewproduct = false;
			this.editproduct = false;
		}
	});

	this._communicationService.productdetaildata.subscribe(data => {
		this.productList = []
		this.productList = this._communicationService.paramList;
		this.dimension_1 = false;
		this.dimension_2 = false;
		this.dimension_3 = false;
		this.dropdown = false;
		this.string = false;
		// var count = (data.match(/<parameter/g) || []).length;
		this.details = data;
		if(data !== null){
			this.preview(this.details);
			this.previewDescription = true;
		}
	});
}
ngDoCheck() {
	var pageName = sessionStorage.getItem('selectedFunctionality')
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

displayaddnewproduct = false;
showDialogToAdd() {
	this._communicationService.UpdateProduct("");
	this.displayaddnewproduct = true;
}
editproduct = false;
editProductData(dt,index) {
	const prodData = dt.filteredValue ? dt.filteredValue : this.categories
	console.log("project id number", prodData[index]);
	console.log("PR id number",this.categories[index]);
	this._communicationService.UpdateProduct( prodData[index]);
	this._communicationService.loader = true;
	this.editproduct = true;
	console.log(index);
}

delete(dt, index) {

	this.displayopenclose = true;
	const prodData = dt.filteredValue ? dt.filteredValue : this.categories;
	this.objdelete = { id: prodData[index].id }
	console.log("checking obj to be deleted" + JSON.stringify(this.objdelete));
	this.displayopenclose = true;
	//console.log(this.categories[data].id);
}

Cancel() {
	this.previewDescription = false;
}


get stringdata() {
	return this.form.get("stringdata");
}

get dimension1() {
	return this.form.get("dimension1");
}

get dimension21() {
	return this.form.get("dimension21");
}

get dimension22() {
	return this.form.get("dimension22");
}

get dimension31() {
	return this.form.get("dimension31");
}

get dimension32() {
	return this.form.get("dimension32");
}

get dimension33() {
	return this.form.get("dimension33");
}

get dropdowndata() {
	return this.form.get("dropdowndata");
}

okMessageForDelete() {
	this._communicationService.backendError = false;
	this.display_message_for_product_delete = false;
	window.location.reload();
}
formControlArray = [];

submit(data) {
	const data1 = Object.keys(data);
	//console.log(data);
	//console.log(data1);
	//console.log(this.formControlArray);
	let CalObj = [];
	let res = "";
	for (let i = 0; i < this.formControlArray.length; i++) {
		let tempObj = {};
		tempObj['id'] = this.formControlArray[i]["id"];
		if (this.formControlArray[i]["type"] === "String") {
			const fmn = this.formControlArray[i]["formControlName"];
			res += data[fmn];
			tempObj = JSON.parse(JSON.stringify(this.formControlArray[i]));
			tempObj['cost'] = tempObj['value']
			tempObj['value'] = res;
			CalObj.push(tempObj);
		} else if (this.formControlArray[i]["type"] === "1 Dimension") {
			const fmn = this.formControlArray[i]["formControlName"];
			res += data[fmn];
			tempObj = JSON.parse(JSON.stringify(this.formControlArray[i]));
			tempObj['value'] = res;
			CalObj.push(tempObj);
		} else if (this.formControlArray[i]["type"] === "2 Dimension") {
			const fmn = this.formControlArray[i]["formControlName"];
			const fmn1 = this.formControlArray[i]["formControlName1"];
			res += data[fmn] + "x" + data[fmn1];
			tempObj = JSON.parse(JSON.stringify(this.formControlArray[i]));
			tempObj['value'] = [data[fmn],data[fmn1]];
			CalObj.push(tempObj);
		} else if (this.formControlArray[i]["type"] === "3 Dimension") {
			const fmn = this.formControlArray[i]["formControlName"];
			const fmn1 = this.formControlArray[i]["formControlName1"];
			const fmn2 = this.formControlArray[i]["formControlName2"];
			res += data[fmn] + "x" + data[fmn1] + "x" + data[fmn2];
			tempObj = JSON.parse(JSON.stringify(this.formControlArray[i]));
			tempObj['value'] = [data[fmn],data[fmn1], data[fmn2]];
			CalObj.push(tempObj);
		} else if (this.formControlArray[i]["type"] === "String Dropdown") {
			const fmn = this.formControlArray[i]["formControlName"];
			res += data[fmn]["label"];
			tempObj = JSON.parse(JSON.stringify(this.formControlArray[i]));
			tempObj['value'] = data[fmn];
			CalObj.push(tempObj);
		} else {
			console.log("data");
			res += this.formControlArray[i]["content"];
		}
	}
	//console.log(this._communicationService.paramList);
	//console.log('calObject');
	//console.log(CalObj);
	this.calculateCost(CalObj);
	let PreviewJson = [];
	let datatodeleteArray = ['inputType', 'type', 'content', 'id']

	for (let i = 0; i < this.formControlArray.length; i++) {
		let prwObj = {};
		prwObj['id'] = this.formControlArray[i]['id'];
		if (this.formControlArray[i]['type'] === 'text') {

			prwObj['paramName'] = this.formControlArray[i]['inputType'];
			prwObj['paramType'] = this.formControlArray[i]['type'];
			prwObj['value'] = this.formControlArray[i]['content'];

		} else if (this.formControlArray[i]['type'] !== 'text') {
			prwObj['paramName'] = this.formControlArray[i]['inputType'];
			prwObj['paramType'] = this.formControlArray[i]['type'];
			let iterateObject = Object.keys(data);
			for (let j = 0; j < iterateObject.length; j++) {
				let objtopush = this.formControlArray[i];

				for (let k = 0; k < datatodeleteArray.length; k++) {
					if (objtopush.hasOwnProperty(datatodeleteArray[k])) {
						let deleteKey = datatodeleteArray[k];
						delete objtopush[deleteKey];
					}
				}

				let multiValue = [];
				let iterateObject1 = Object.keys(objtopush)
				for (let m = 0; m < iterateObject1.length; m++) {
					if (iterateObject1.length === 1) {
						if (objtopush.formControlName === iterateObject[j]) {
							prwObj['value'] = data[iterateObject[j]];
						}
					} else {
						const setFCN = m === 0 ? "formControlName" : "formControlName" + m;
						for (let n = 0; n < iterateObject.length; n++) {
							if (objtopush[setFCN] === iterateObject[n]) {
								multiValue.push(data[iterateObject[n]])
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
	//console.log("Preview json");
	//console.log(PreviewJson);
	this._communicationService.paramDetails = PreviewJson;
	this._communicationService.ProductDescriptionDate(res);
	this.previewDescription = false;
}

preview(inputValue) {
	this.formControlArray = [];
	const data = inputValue;
	const dataObject = {};
	let b = data.split("<");
	let d = [];
	let c = 0;
	let res = [];
	const DimensionNo = {};
	let ParameterCounter = 0;
	DimensionNo["2 Dimension"] = 2;
	DimensionNo["3 Dimension"] = 3;
	const DimensionList = Object.keys(DimensionNo);
	for (let i = 0; i < b.length; i++) {
		const formDataObj = {};
		if (b[i].match(">")) {
			d = b[i].split(">");
			const param = d[0];
			for (let h = 0; h < this.productList.length; h++) {
				if (this.productList[h].parameter === param) {
					formDataObj["id"] = this.productList[h].id
					formDataObj["type"] = this.productList[h].input;
					if (DimensionList.includes(this.productList[h].input)) {
						formDataObj["inputType"] = this.productList[h].parameter;
						if (this.formControlArray.length > 0) {
							let flag = false;
							for (let i = 0; i < this.formControlArray.length; i++) {
								if (this.formControlArray[i].inputType === param) {
									const FCAKeys = Object.keys(this.formControlArray[i]);
									FCAKeys.splice(FCAKeys.indexOf("type"), 1);
									FCAKeys.splice(FCAKeys.indexOf("inputType"), 1);
									for (let z = 0; z < FCAKeys.length; z++) {
										const setFCN =
											z === 0 ? "formControlName" : "formControlName" + z;
										formDataObj[setFCN] = this.formControlArray[i][setFCN];
									}
									flag = true;
								}
							}
							if (flag === false) {
								for (let k = 0; k < DimensionList.length; k++) {
									if (DimensionList[k] === this.productList[h].input) {
										const IterateCount = DimensionList[k];
										for (let l = 0; l < DimensionNo[IterateCount]; l++) {
											const tempFCN = "parameter" + ParameterCounter++;
											const setFCN =
												l === 0 ? "formControlName" : "formControlName" + l;
											formDataObj[setFCN] = tempFCN;
											dataObject[tempFCN] = new FormControl();
										}
									}
								}
							}
						} else {
							for (let k = 0; k < DimensionList.length; k++) {
								if (DimensionList[k] === this.productList[h].input) {
									const IterateCount = DimensionList[k];
									for (let l = 0; l < DimensionNo[IterateCount]; l++) {
										const tempFCN = "parameter" + ParameterCounter++;
										const setFCN =
											l === 0 ? "formControlName" : "formControlName" + l;
										formDataObj[setFCN] = tempFCN;
										dataObject[tempFCN] = new FormControl();
									}
								}
							}
						}
						for (let gp = 0; gp < this.productList.length; gp++) {
							if (this.productList[gp].parameter === param) {
								if (this.productList[gp].hasOwnProperty('cost')) {
								  formDataObj['cost'] = this.productList[gp].cost;
								}
								break;
						  }
						}
						this.formControlArray.push(formDataObj);
					} else {
						/**new Code to set Parameter  */
						formDataObj["inputType"] = this.productList[h].parameter;
						if (this.formControlArray.length > 0) {
							let flag = false;
							this.globalDropdown = this._communicationService.globalStrDropDown;
							// tslint:disable-next-line:no-shadowed-variable
							for (let i = 0; i < this.formControlArray.length; i++) {
								if (this.formControlArray[i].inputType === param) {
									formDataObj["formControlName"] = this.formControlArray[i].formControlName;
									if(formDataObj['type'] === "String"){
										formDataObj['value'] = this.productList[h].cost;
									}else{
										for (let i = 0; i < this.globalDropdown.length; i++) {
											if (this.globalDropdown[i].name === param) {
												this.dropdownselect = [];
												this.dropdownselect = this.globalDropdown[i].value;
												formDataObj['value'] = this.dropdownselect;
											}
										}
									}
									flag = true;
								}
							}
							if (flag === false) {
								const tempFCN = "parameter" + ParameterCounter++;
								formDataObj["formControlName"] = tempFCN;
								if(formDataObj['type'] === "String"){
									formDataObj['value'] = this.productList[h].cost;
								}else{
									for (let i = 0; i < this.globalDropdown.length; i++) {
										if (this.globalDropdown[i].name === param) {
											this.dropdownselect = this.globalDropdown[i].value;
											formDataObj['value'] = this.dropdownselect;
										}
									}
								}
								dataObject[tempFCN] = new FormControl();
							}
						} else {
							const tempFCN = "parameter" + ParameterCounter++;
							formDataObj["formControlName"] = tempFCN;

							dataObject[tempFCN] = new FormControl();
						}
						this.formControlArray.push(formDataObj);
					}
				}
			}
			if (d[1] !== "" && d[1] !== null) {
				const dataobj = {};
				res.push(d[1]);
				dataobj["type"] = "text";
				dataobj["content"] = d[1];
				dataobj["inputType"] = "text";
				dataobj["id"] = null;
				this.formControlArray.push(dataobj);
			}
		} else {
			res.push(b[i]);
			formDataObj["type"] = "text";
			formDataObj["content"] = b[i];
			formDataObj["inputType"] = "text";
			formDataObj["id"] = null;
			this.formControlArray.push(formDataObj);
		}
	}
	this.form = new FormGroup(dataObject);
}

/***start - Added by Amol for delete Popup */
displayopenclose = false;
objdelete = {};
display_message_for_delete = false;


/**Delete Confirmation popup */
ConfirmDelete() {
	//console.log("deleting data  from Product List");
	this._commonNodeCallService
		.DeleteProduct(this.objdelete)
		.subscribe(res => {
			//console.log(res);
			if (res["success"]) {
				if (res['results'] !== "") {
					const filePath = res['results'];
					//console.log("filePath==>", filePath)
					const selectedFiles = [];
					const deleteOptParam = {};
					this.uploadService.deleteFile(selectedFiles, deleteOptParam, filePath, respDel => {
						if (respDel['success']) {
						this.display_message_for_product_delete = true;
							this.message = res["message"];
						} else {
							this._communicationService.backendError = true;
							// this.message = "Error Occured while Deleting image"
						}
						// this.display_message_for_product_delete = true;
					})
				} else {
					this._communicationService.backendError = true;
					// this.display_message_for_product_delete = true;
					// this.message = res["message"];
				}
			} else {
				//console.log("error in product deletion");
				// this.display_message_for_product_delete = true;
				// this.message = res["message"];
				this._communicationService.backendError = true;
			}
		});

	this.displayopenclose = false;
}

DeclineDelete() {
	this.displayopenclose = false;
}


/**Filter Category */
// tslint:disable-next-line:member-ordering
fltrselectedSubCatStatus: string;
filterSubCatlist() {
	//console.log(this.fltrselectedSubCatStatus);
}


filterList(evt) {
	//console.log("evt==", evt.value.id);
	let data={}
	data['catId'] = evt.value.id;
	this.categories=[]
	this._commonNodeCallService.GetProducts(data).subscribe(res => {
		if (res["results"].length > 0) {
			res["results"].forEach(element => {
				var productObj = {
					id: element.id,
					SKU: element.sku_no,
					ProductName: element.name,
					Image: 'http://s3.amazonaws.com/wom-documents/' + element.product_src,
					Category: element.categoryName
				};
				this.categories.push(productObj);
			});
			//console.log("$$$$$$$$$$$" + JSON.stringify(this.categories));
		} else {
			//console.log("No records to display here");
			// this.norecords=true;
		}
	});
}
/***End-- Added by Amol for delete Popup */
/** Calculation */

calculateCost(calculateObj) {
    let budget = 0;
    for(let i =0; i < calculateObj.length;i++) {
          if(calculateObj[i].type === 'String Dropdown') {
            if (typeof(calculateObj[i].value.value) === 'string') {
                // tslint:disable-next-line:radix
                budget += parseInt(calculateObj[i].selectedValue.value);
              } else {
              budget += calculateObj[i].value.value;
              }
          // tslint:disable-next-line:max-line-length
          } else if ( calculateObj[i].type === '1 Dimension' || calculateObj[i].type === '2 Dimension' || calculateObj[i].type === '3 Dimension') {
            if (calculateObj[i].type === '2 Dimension' || calculateObj[i].type === '3 Dimension') {
              let calculateArea = 1;
              let count:any = Object.values(calculateObj[i].value);
              for (let n = 0; n < count.length; n++) {
                  if (typeof(count[n]) === 'string') {
                    calculateArea = calculateArea *  parseInt(count[n]);
                  }else{ 
                    calculateArea = calculateArea * count[n];
                  }
              }
              budget += calculateArea * calculateObj[i].cost;
            }
          }else{
			if (typeof(calculateObj[i].cost) === 'string') {
                // tslint:disable-next-line:radix
                budget += parseInt(calculateObj[i].cost);
              } else {
              budget += calculateObj[i].cost;
              }
		}
	}
	//console.log(budget);
	this._communicationService.productCost = budget
  }
/**Cost Calculation */
}

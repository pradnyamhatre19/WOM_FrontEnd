import { Component, OnInit } from '@angular/core';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { FrontEndValidationService } from 'src/app/services/Validation/front-end-validation.service';
import { Router } from '@angular/router';

export class labelid {
  label: string
  id: number
}

@Component({
  selector: 'app-add-parameters',
  templateUrl: './add-parameters.component.html',
  styleUrls: ['./add-parameters.component.css']
})
export class AddParametersComponent implements OnInit {

  data = {
    Parameter: [
      {
        parameterId: '',
        configparameter: "",
        configparameteroption: "",
        inputtype: {},
        cost: "",
        unit: {},
        AddingValues: [],
        type: "d"
      }
    ]
  }

  catobj = {};
  objid = {};
  localCatId;
  showTable: Boolean = false;
  showMsg: boolean = false;
  showMsgDuplicate: boolean = false;
  displayopenclose: boolean = false;
  removeIndex;
  formerror: boolean = false;
  showAddParameterButton: boolean = true;
  showPlus: boolean = false;
  // add_values: boolean = false;
  dropdownvalue = [];
  ddvalue;
  unitsdropdown: labelid[] = [];
  stringunitsdropdown: labelid[] = [];
  viewmode = false;
  clkindex;
  togglebtn: boolean = false;
  ToggleIndex: number[] = [];
  plusminusIndex: number[] = [];
  InputActivateIndex: number[] = [];
  minusicon: boolean = false;
  messagefromdb;
  redmessagefromdb;
  successboolean: boolean = false;
  successbooleanred: boolean = false;
  hideitem: boolean = true;
  form: FormGroup;
  displaydeletedialog: boolean = false;
  deleteindex;
  isEditParam = false;
  isListingParam = false;
  isDeleteParam = false;
  isAddParam = false;
  Parameter1 = [];
  deletedparameterId;
  deleteArrayItems = [];
  edit: boolean = false;
  Parameter1Length;
  togglePlusMinus = [];
  deleteStringDropdownArray = [];
  deleteParameterArray = [];
  newObj = {}
  localitemId;
  parameterPop: boolean = false;
  stringDropdownPop:boolean = false;
  globalDeleteParam;

  constructor(public _communicationservice: CommunicateService,
    private _formbuilder: FormBuilder,
    private _commonNodeCallService: CommonCallService,
    private validationService: FrontEndValidationService,
    private router:Router
  ) {
    this._communicationservice.backendError = false;
  }


  ngOnInit() {
    this.form = this._formbuilder.group({
      category: [],
      items: ['',Validators.required],
      subcategory: ['', Validators.required],
      multiplier: ['', [Validators.required,Validators.pattern(this._communicationservice.pattern.numericWithDecimal)]],
      Parameter: this._formbuilder.array([], Validators.required)
    })

    this._communicationservice.parameterinfo.subscribe(data => {
      console.log("in add parameter screen id and catName", data.id, data.CategoryName);
      this.localCatId = data.id
      //console.log("local cat id", this.localCatId)
      this.catobj = { id: data.id, label: data.CategoryName }
      this.form.patchValue({
        category: this.catobj
      })
      this.objid = { id: data.id }
      this._commonNodeCallService.GetSubCategory(this.objid).subscribe(res => {
        //console.log("sub category list for ad parameter", res);
        if (res['success']) {
          if (res['results'].length > 0) {
            res['results'].forEach(element => {
              this.subcategoryresults.push({ label: element.name, id: element.id });
            })
          }
        } else {
          this._communicationservice.backendError = true;
        }
      })
    })

    // getting input values
    this._commonNodeCallService.GetInputType().subscribe(res => {
      console.log(res);
      if (res['results'] != "") {
        res['results'].forEach(element => {
          this.inputtyperesults.push({ label: element.input_type, id: element.id });
        });
      }
    });

    // getting units values
    this._commonNodeCallService.GetUnit().subscribe(res => {
      // console.log(res);
      if (res['success']) {
        if (res['results'].length > 0) {
          res['results'].forEach(element => {
            this.unitresults.push({ label: element.unit, id: element.id });
            this.Stringunitresults.push({ label: element.unit, id: element.id });
          });
        }
      } else {
        this._communicationservice.backendError = true;
      }
    });

  }

  addParameter() {
    this.showMsg = false;
    this.showMsgDuplicate = false;
    this.showTable = true;
    let control = <FormArray>this.form.controls.Parameter;
    control.push(
      this._formbuilder.group({
        parameterId: null,
        configparameter: ['', [Validators.required]],
        configparameteroption: ['', [Validators.required]],
        inputtype: ['', [Validators.required]],
        cost: ['0'],
        unit: [{ label: 'NA', id: 0 }],
        AddingValues: this._formbuilder.array([]),
        type: "n"
      })
    )

    var datalength = this.Parameter.length;
    console.log("this.togglePlusMinus", this.togglePlusMinus)
    console.log("datalength===", datalength)
    var obj = {}
    obj[datalength - 1] = false;
    this.togglePlusMinus.push(obj)
    console.log("this.togglePlusMinus", this.togglePlusMinus)

  }

  removeParameter(index, param) {
    console.log("parameter id", param.controls.parameterId.value)
    this.deletedparameterId = param.controls.parameterId.value;
    console.log("INPUT TYPE", param.controls.inputtype.value.id)
    this.displaydeletedialog = true;
    this.deleteindex = index;
    this.parameterPop = true;
    this.stringDropdownPop = false;
    this.globalDeleteParam = 'parameterDelete';

    console.log("remove parameter stored index which willl be send to pop-up yes button click method", this.deleteindex)
  }


  addNewValues(control) {
    control.push(
      this._formbuilder.group({
        StringDropdownId: null,
        addvaluesname: ['', [Validators.required]],
        stringDropdowncost: ['0'],
        stringDropdownunit: [{ label: 'NA', id: 0 }]
      }))
  }

  stringdrpControl;
  stringdrpIndex;
  stringdrpAddvalue;
  stringdrpParam;
  deleteNewValues(control, index, addvalue, param) {
    this.globalDeleteParam = 'strindDropdownDelete';
    this.parameterPop = false;
    this.stringDropdownPop = true;
    this.displaydeletedialog = true;

    this.stringdrpControl = control;
    this.stringdrpIndex = index;
    this.stringdrpAddvalue= addvalue;
    this.stringdrpParam = param;

    // // deleting the content to store 
    // if (this.edit == true) {
    //   if (addvalue.controls.StringDropdownId.value !== null) {
    //     if (this.deleteArrayItems.length > 0) {
    //       let Objtopush = {};
    //       for (var i = 0; i < this.Parameter1.length; i++) {
    //         for (var j = 0; j < this.Parameter1[i].ParamArray.length; j++) {
    //           if (this.Parameter1[i].ParamArray[j].parameterId === param.controls.parameterId.value) {
    //             let ItemnotPresent = true;
    //             Objtopush['id'] = this.Parameter1[i].ParamArray[j]['parameterId'];
    //             for (let q = 0; q < this.deleteArrayItems.length; q++) {
    //               if (this.deleteArrayItems[q]['id'] === this.Parameter1[i].ParamArray[j]['parameterId']) {
    //                 for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
    //                   if (this.Parameter1[i].StringDropdownArray[w].StringDropdownId === addvalue.controls.StringDropdownId.value) {
    //                     this.deleteArrayItems[q]['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
    //                     this.deleteArrayItems[q]['InitialCounter'] += 1;
    //                     break;
    //                   }
    //                 }
    //                 ItemnotPresent = false;
    //                 break;
    //               }
    //             }
    //             if (ItemnotPresent) {
    //               for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
    //                 if (this.Parameter1[i].StringDropdownArray[w].StringDropdownId === addvalue.controls.StringDropdownId.value) {
    //                   Objtopush['itemsArray'] = [];
    //                   Objtopush['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
    //                   Objtopush['InitialCounter'] = 1;
    //                   Objtopush['FinalCounter'] = this.Parameter1[i].StringDropdownArray.length;
    //                 }
    //               }
    //               this.deleteArrayItems.push(Objtopush);
    //             }
    //           }
    //         }
    //       }
    //     } else {
    //       this.deleteArrayItems = [];
    //       var Objtopush = {};
    //       for (var i = 0; i < this.Parameter1.length; i++) {
    //         for (var j = 0; j < this.Parameter1[i].ParamArray.length; j++) {
    //           if (this.Parameter1[i].ParamArray[j].parameterId === param.controls.parameterId.value) {
    //             Objtopush['id'] = this.Parameter1[i].ParamArray[j]['parameterId'];
    //             for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
    //               if (this.Parameter1[i].StringDropdownArray[w].StringDropdownId === addvalue.controls.StringDropdownId.value) {
    //                 Objtopush['itemsArray'] = [];
    //                 Objtopush['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
    //                 Objtopush['InitialCounter'] = 1;
    //                 Objtopush['FinalCounter'] = this.Parameter1[i].StringDropdownArray.length;
    //                 break;
    //               }
    //             }
    //             this.deleteArrayItems.push(Objtopush);
    //           }
    //         }
    //       }
    //     }
    //   }

    // }

    // console.log("this.deleteArrayItems==>", this.deleteArrayItems)
    // // 
    // control.removeAt(index)
  }


  setParameterValues() {
    let control = <FormArray>this.form.controls.Parameter;
    this.data.Parameter.forEach(x => {
      control.push(this._formbuilder.group({
        parameterId: x.parameterId,
        configparameter: x.configparameter,
        configparameteroption: x.configparameteroption,
        inputtype: x.inputtype,
        cost: x.cost,
        unit: x.unit,
        AddingValues: this.setAddingValues(x),
        type: x.type
      }))
    })
  }



  setAddingValues(x) {
    let arr = new FormArray([])
    x.AddingValues.forEach(y => {
      arr.push(this._formbuilder.group({
        StringDropdownId: y.StringDropdownId,
        addvaluesname: y.addvaluesname,
        stringDropdowncost: y.stringDropdowncost,
        stringDropdownunit: y.stringDropdownunit
      }))
    })
    return arr;
  }

  ActivateIndex: number[] = [];
  showPlusToAdd(evt, index) {
    console.log(evt);
    console.log("this.firm", this.form)
    // advance functionality
    if (evt.label == 'String Dropdown') {
      console.log("stringdropdown selected")
      this.form.controls.Parameter['controls'][index].removeControl('unit');
      this.form.controls.Parameter['controls'][index].removeControl('cost');
    }
    else {
      console.log("other than stringdropdown selected")
      this.form.controls.Parameter['controls'][index].addControl('unit', new FormControl({ label: "NA", id: 0 }, Validators.required));
      this.form.controls.Parameter['controls'][index].addControl('cost', new FormControl('0', Validators.required));
      while (this.form.controls.Parameter['controls'][index].controls.AddingValues.length !== 0) {
        this.form.controls.Parameter['controls'][index].controls.AddingValues.removeAt(0)
      }
    }
  }

  get Parameter(): FormArray {
    return this.form.get('Parameter') as FormArray;
  }

  get AddingValues(): FormArray {
    return this.form.get('AddingValues') as FormArray;
  }

  get addvaluesname() {
    return this.form.get('addvaluesname');
  }

  get multiplier(){
    return this.form.get('multiplier')
  }

  get cost(){
    return this.form.get('cost');
  }
  get stringDropdowncost(){
    return this.form.get('stringDropdowncost');
  }

  Cancel() {
    // this.formerrorforparam=false;
    this.showPlus = false;
    // making add param button disbaled
    this.showAddParameterButton = true;
    // hide header
    this.showTable = false;
    // hide showMSg
    this.showMsgDuplicate = false;
    this.showMsg = false;
    this.subcategoryresults = [];
    this.form.reset();
    this.successboolean = false;
    this.successbooleanred = false;
    while (this.Parameter.length !== 0) {
      this.Parameter.removeAt(0)
    }
    this.hideitem = true;
    // delete functionality data
    this.togglePlusMinus = [];
    this.edit = false;
    this.Parameter1 = [];
    this.deleteArrayItems = [];
    this.deleteStringDropdownArray = [];
    this.deleteParameterArray = [];
    this.newObj = {};
    this.isEditParam = false;
    this.isListingParam = false;
    this.isDeleteParam = false;
    this.isAddParam = false;
    this.displaydeletedialog = false;
    this.parameterPop = false;
    this.stringDropdownPop= false;
    this._communicationservice.ParameterCancel(false);
  }

  Submit(data) {

    this.showMsgDuplicate = false;
    this.showMsg = false;
    if (this.form.invalid) {
      this.formerror = true;
    }
    else if (data.Parameter.length == 0) {
      this.showMsg = true;
    }
    else {
      for (var i = 0; i < data.Parameter.length; i++) {
        // checking duplicates
        var valueArr1 = data.Parameter.map(function (item) { return item.configparameter });
        var isDuplicate1 = valueArr1.some(function (item, idx) {
          return valueArr1.indexOf(item) != idx
        });
        console.log("items contains duplicates while submit", isDuplicate1);
        if (isDuplicate1) {
          break;
        }
      }

      if (isDuplicate1) {
        this.showMsgDuplicate = true;
        console.log("in isduplicate block ")
      }
      else {
        console.log("go ahead ")
        //go ahead
        this._communicationservice.loader = true;
        // deleted param-stringrdropdown seperation into param and strinfdropdown
        this.deleteStringDropdownArray = [];
        this.deleteParameterArray = [];
        if (this.deleteArrayItems.length > 0) {
          for (var i = 0; i < this.deleteArrayItems.length; i++) {
            var delObj = this.deleteArrayItems[i];
            if (delObj.hasOwnProperty("FinalCounter")) {
              for (var j = 0; j < delObj.itemsArray.length; j++) {
                this.deleteStringDropdownArray.push(delObj.itemsArray[j]);
              }
            } else {
              this.deleteParameterArray.push(delObj.id);
            }
          }
        } else {
          this.deleteStringDropdownArray = this.deleteArrayItems;
          this.deleteParameterArray = this.deleteArrayItems;
          console.log("it should be EMPTY--this.deleteStringDropdownArray==>", this.deleteStringDropdownArray);
          console.log("it should be EMPTY--this.deleteParameterArray==>", this.deleteParameterArray);
        }
        data.deleteStringDropdownArray = this.deleteStringDropdownArray;
        data.deleteParameterArray = this.deleteParameterArray;
        console.log(data);
        data.user_id = sessionStorage.getItem('userid');
        console.log("data to be sent to API", data);
        var delStringDropdownCommaSeparated = [];
        var delParametersCommaSeparated = [];
        // comma separated subcat
        if (this.deleteStringDropdownArray.length > 0) {
          for (var k = 0; k < this.deleteStringDropdownArray.length; k++) {
            delStringDropdownCommaSeparated.push(this.deleteStringDropdownArray[k]);
          }
        } else {
          delStringDropdownCommaSeparated = [];
        }
        // comma separated items
        if (this.deleteParameterArray.length > 0) {
          for (var l = 0; l < this.deleteParameterArray.length; l++) {
            delParametersCommaSeparated.push(this.deleteParameterArray[l]);
          }
        } else {
          delParametersCommaSeparated = [];
        }
        // PRocedure type data
        this.newObj['actionType'] = "insert";
        this.newObj['status'] = "active";
        this.newObj['categoryId'] = data.category.id;
        this.newObj['subcategoryId'] = data.subcategory.id;
        this.newObj['itemId'] = data.items.id;
        this.newObj['itemMultiplier'] = data.multiplier;
        this.newObj['userId'] = data.user_id;
        this.newObj['deleteParameterArray'] = delParametersCommaSeparated;
        this.newObj['deleteStringDropdownArray'] = delStringDropdownCommaSeparated;
        this.newObj['childList1'] = [];
        for (var i = 0; i < data.Parameter.length; i++) {
          var dataOBj = data.Parameter[i];
          var obj = {}
          obj['parameterId'] = dataOBj.parameterId;
          obj['parameterName'] = dataOBj.configparameter;
          obj['parameterNameOption'] = dataOBj.configparameteroption;
          obj['parameterInputtypeId'] = dataOBj.inputtype.id;
          if (dataOBj.cost === undefined) {
            obj['parameterCost'] = 0;
          } else {
            obj['parameterCost'] = this._communicationservice.removeCommas(dataOBj.cost);
          }
          if (dataOBj.unit === undefined) {
            obj['parameterUnitId'] = 0;
          } else {
            obj['parameterUnitId'] = dataOBj.unit.id;
          }
          if (dataOBj.AddingValues.length > 0) {
            var childList2 = [];
            for (var j = 0; j < dataOBj.AddingValues.length; j++) {
              var data2Obj = dataOBj.AddingValues[j];
              var itemObj = {};
              itemObj['stringDropdownId'] = data2Obj.StringDropdownId
              itemObj['stringDropdownName'] = data2Obj.addvaluesname
              if (data2Obj.stringDropdowncost === undefined) {
                itemObj['stringDropdownCost'] = 0;
              } else {
                // itemObj['stringDropdownCost'] = data2Obj.stringDropdowncost
                itemObj['stringDropdownCost'] = this._communicationservice.removeCommas(data2Obj.stringDropdowncost);
              }
              if (data2Obj.stringDropdownunit === undefined) {
                itemObj['stringDropdownUnitId'] = 0;
              } else {
                itemObj['stringDropdownUnitId'] = data2Obj.stringDropdownunit.id
              }
              childList2.push(itemObj)
              obj['childList2'] = childList2;
            }
          } else {
            obj['childList2'] = [];
          }
          this.newObj['childList1'].push(obj)
        }
        console.log("Final data for PROCEDURE API with database image==>", this.newObj);
        this._commonNodeCallService.addParameterProcall(this.newObj).subscribe(res => {
          console.log("from db", res);
          if (res['success']) {
            this.successboolean = true;
            this.messagefromdb = res['message'];
            this.commonCancelWithAllMethod();
            this.commonCancelMethod();
            this._communicationservice.loader = false;
          } else {
            
            if (res['statusCode'] === 500) {
              this._communicationservice.backendError = true;
              setTimeout(()=>{    //<<<---    using ()=> syntax
            this.commonCancelMethod();
             }, 2000);
            } else {
              if(res['statusCode'] === 401){
                this.router.navigateByUrl('/login');
              }else{
                this.successbooleanred = true;
                this.redmessagefromdb = res['message'];
                this.commonCancelMethod();
              }
            }
            this.showAddParameterButton = false;
            this.hideitem = false;
            // call showParameter()
            var dataObj = {};
            dataObj['id'] =this.localitemId;
            setTimeout(()=>{    //<<<---    using ()=> syntax
            this.showParameters(dataObj)             
         }, 3000);
            this._communicationservice.loader = false;
          }
        })
      }
    }
  }

  // ***category autocomplete dropdown***

  categoryresults: labelid[] = [];
  filteredcategory: labelid[] = [];
  searchcategory(event) {
    // console.log("checking event "+ event);
    this.filteredcategory = this.categoryresults
      .filter(data => data.label.toString()
        .toLowerCase()
        .indexOf(event.query.toString().toLowerCase()) !== -1);
  }

  categoryDropdown() {
    this.filteredcategory;
  }

  // ***sub category autocomplete dropdown***
  subcategoryresults: labelid[] = [];
  filteredsubcategory: labelid[] = [];
  searchsubcategory(event) {
    this.filteredsubcategory = this.subcategoryresults
      .filter(data => data.label.toString()
        .toLowerCase()
        .indexOf(event.query.toString().toLowerCase()) !== -1);
  }

  subcategoryDropdown() {
    this.filteredsubcategory;
  }

  // ***input type autocomplete dropdown***
  inputtyperesults: labelid[] = [];

  filteredinputtype: labelid[] = [];
  searchinputtype(event) {
    this.filteredinputtype = this.inputtyperesults
      .filter(data => data.label.toString()
        .toLowerCase()
        .indexOf(event.query.toString().toLowerCase()) !== -1);
  }

  inputtypeDropdown() {
    this.filteredinputtype;
  }

  // ***units autocomplete dropdown***
  unitresults: labelid[] = [];

  filteredunits: labelid[] = [];
  searchunits(event) {
    this.filteredunits = this.unitresults
      .filter(data => data.label.toString()
        .toLowerCase()
        .indexOf(event.query.toString().toLowerCase()) !== -1);
  }

  unitDropdown() {
    this.filteredunits;
  }

  ngDoCheck() {
    var pageNameParam = sessionStorage.getItem('selectedFunctionality')
    var privillageArrayParam = JSON.parse(sessionStorage.getItem('privillageArray'))
    if (pageNameParam == "Add Parameter") {
      if (privillageArrayParam.length > 0) {
        for (var i = 0; i < privillageArrayParam.length; i++) {
          var funObjParam = privillageArrayParam[i];
          var funObjParam = privillageArrayParam[i];
          if (funObjParam.fname === pageNameParam) {
            if (funObjParam.pr_add === 1) {
              this.isAddParam = true;
            }
            if (funObjParam.pr_delete === 1) {
              this.isDeleteParam = true;
            }
            if (funObjParam.pr_edit === 1) {
              this.isEditParam = true;
            }
            if (funObjParam.pr_listing === 1) {
              // console.log("funObjParam.pr_listing paramaters",funObjParam.pr_listing);
              this.isListingParam = true;
            }
          }
        }
      }
    }
  }

  // ***Stringunits autocomplete dropdown***
  Stringunitresults: labelid[] = [];

  filteredStringunits: labelid[] = [];
  searchStringunits(event) {
    this.filteredStringunits = this.Stringunitresults
      .filter(data => data.label.toString()
        .toLowerCase()
        .indexOf(event.query.toString().toLowerCase()) !== -1);
  }

  unitStringDropdown() {
    this.filteredStringunits;
  }

  // ***items autocomplete dropdown***
  itemsresults: labelid[] = [];
  filtereditems: labelid[] = [];
  multiplierArra = [];
  searchitems(event) {
    this.filtereditems = this.itemsresults
      .filter(data => data.label.toString()
        .toLowerCase()
        .indexOf(event.query.toString().toLowerCase()) !== -1);
  }

  itemsDropdown() {
    this.filtereditems;
  }
  // on select of sub category
  localsubid;
  showItems(data) {
    // delete functionality data
    this.deleteStringDropdownArray = [];
    this.deleteParameterArray = [];
    this.togglePlusMinus = [];
    this.edit = false;
    this.Parameter1 = [];
    this.deleteArrayItems = [];
    // 
    this.form.patchValue({
      multiplier: ''
    })
    console.log("sub-cat clicked data", data.id)
    this.form.patchValue({
      items: ""
    })
    this.hideitem = true;
    this.itemsresults = [];
    this.showAddParameterButton = true;
    this.showTable = false;
    this.showMsg = false;
    this.showMsgDuplicate = false;
    this.successboolean = false;
    this.successbooleanred = false;
    while (this.Parameter.length !== 0) {
      this.Parameter.removeAt(0)
      console.log("in subcat while loop")
    }
    // }
    console.log("this.Parameter.length", this.Parameter)
    console.log("itemsarray lengt", this.itemsresults)
    console.log(data.id)
    this.localsubid = data.id
    var objdata1 = {};
    objdata1['subCategoryId'] = data.id;
    this.itemsresults = [];
    this.multiplierArra = [];
    this._commonNodeCallService.GetItemListingBySubCatId(objdata1).subscribe(res => {
      if (res['success']) {
        if (res['results'].length > 0) {
          this.hideitem = false;
          res['results'].forEach(element => {
            this.itemsresults.push({ label: element.item_name, id: element.id });
            var obj = {};
            obj['id'] = element.id;
            obj['value'] = element.multiplier;
            this.multiplierArra.push(obj);
          });
        }
      } else {
        this._communicationservice.backendError = true;
      }
    })

  }
  //  ONSELECT event of item dropdown
  showParameters(data) {
    this.localitemId =data.id;
    // delete functionality data
    this.deleteStringDropdownArray = [];
    this.deleteParameterArray = [];
    this.togglePlusMinus = [];
    this.edit = false;
    this.Parameter1 = [];
    this.deleteArrayItems = [];
    // 
    this.form.patchValue({
      multiplier: ''
    })
    var multiVal = this.multiplierArra.filter(item => {
      if (item.id === data.id) {
        return item
      }
    });
    console.log("multiVal", JSON.stringify(multiVal[0]['value']));
    if (multiVal[0]['value'] !== null) {
      this.form.patchValue({
        multiplier: multiVal[0]['value']
      })
    } else {
      this.form.patchValue({
        multiplier: ''
      })
    }

    console.log("multiVal==", multiVal)
    this.showAddParameterButton = true;
    this.showTable = false;
    this.showMsg = false;
    this.showMsgDuplicate = false;
    this.successboolean = false;
    this.successbooleanred = false;
    while (this.Parameter.length !== 0) {
      this.Parameter.removeAt(0)
      console.log("in items while loop")
    }
    // }
    console.log("this.Parameter.length", this.Parameter)
    // storing sub-category id
    var objdata = { itemId: data.id }
    // storing sub category id
    objdata['subCategoryId'] = this.localsubid;
    // storing category id
    objdata['categoryId'] = this.localCatId
    console.log("object to be sent to api", JSON.stringify(objdata))
    this._commonNodeCallService.GetParameters(objdata).subscribe(res => {
      console.log(res);
      if (res['results'].length > 0) {
        this.edit = true;
        this.showTable = true;
        this.showAddParameterButton = false;
        var icount = res['results'].length;
        for (var i = 0; i < res['results'].length; i++) {
          console.log("@@@@@@@@@", res['results'][i])
          var objinput = { label: res['results'][i].inputTypeName, id: res['results'][i].input_type }
          var objunit = null;
          //var objunit = { label: res['results'][i].unitName, id: res['results'][i].unit }
          var paramName = res['results'][i].param_name;
          var options = res['results'][i].param_option
          var cost = res['results'][i].cost
          var valueArray = []
          var jcount = res['results'][i].paramArray.length;
          // making inpu type readonly
          // console.log("InputActivateIndex",this.InputActivateIndex)
          if (res['results'][i].inputTypeName === "String Dropdown") {
            // this.ActivateIndex.push(i);
            console.log("matched with string dropdown in forloop");
            objunit = { label: res['results'][i].unitName, id: res['results'][i].unit }
          }
          else {
            if (res['results'][i].unit === null) {
              objunit = { label: 'NA', id: res['results'][i].unit }
            } else {
              objunit = { label: res['results'][i].unitName, id: res['results'][i].unit }
            }
            console.log("didnot match with string dropdown in forloop");
          }
          var obj = {}
          obj[i] = false;
          this.togglePlusMinus.push(obj)
          var obj1 = {};
          var obj2 = {};
          var paramater1Array = [];
          var stringDropdownArray = [];

          for (var j = 0; j < res['results'][i].paramArray.length; j++) {
            var paramObj = {};
            paramObj['StringDropdownId'] = res['results'][i].paramArray[j].id;
            paramObj['addvaluesname'] = res['results'][i].paramArray[j].addvaluesname;
            paramObj['stringDropdowncost'] = res['results'][i].paramArray[j].cost;
            if (res['results'][i].paramArray[j].stringDropdownunit === 0) {
              paramObj['stringDropdownunit'] = { label: 'NA', id: res['results'][i].paramArray[j].stringDropdownunit };
            } else {
              paramObj['stringDropdownunit'] = { label: res['results'][i].paramArray[j].unitTypeName, id: res['results'][i].paramArray[j].stringDropdownunit };
            }
            valueArray.push(paramObj)

            console.log("j====", j)
            console.log("jcount====", jcount)
            console.log("valueArray====j", i, j, valueArray)

            var obj3 = {};
            obj3['StringDropdownName'] = res['results'][i].paramArray[j].addvaluesname;
            obj3['StringDropdownId'] = res['results'][i].paramArray[j].id;
            stringDropdownArray.push(obj3)
            obj1['StringDropdownArray'] = stringDropdownArray;
          }
          this.data = {
            Parameter: [
              {
                parameterId: res['results'][i].id,
                configparameter: paramName,
                configparameteroption: options,
                inputtype: objinput,
                cost: cost,
                unit: objunit,
                AddingValues: valueArray,
                type: "d"
              }
            ]
          }
          console.log("======inside======data", this.data)
          this.setParameterValues();
          console.log("============data", this.data)
          obj2['parameterName'] = res['results'][i].param_name;
          obj2['parameterId'] = res['results'][i].id;
          paramater1Array.push(obj2)
          obj1['ParamArray'] = paramater1Array;
          this.Parameter1.push(obj1);
          console.log("COPY==this.Parameter1==>", this.Parameter1);
          this.Parameter1Length = this.Parameter1.length;
          console.log("Parameter1Length==>", this.Parameter1Length);
        }
        console.log("this.togglePlusMinus==", this.togglePlusMinus)
      } else {
        console.log("no param found block");
        this.showMsg = true;
        this.showMsgDuplicate = false;
        this.showAddParameterButton = false;
      }
    })
  }

  showOpenCloseDialog() {
    if(this.globalDeleteParam === 'strindDropdownDelete'){
      this.deleteNewValuesNewStringdropdown(this.stringdrpControl, this.stringdrpIndex, this.stringdrpAddvalue, this.stringdrpParam);
    }else if(this.globalDeleteParam === 'parameterDelete'){
      this.showOpenCloseDialogNewParameter();
    }
    // console.log("removing item of Parameter Array index", this.deleteindex);
    // this.showMsg = false;
    // this.showMsgDuplicate = false;
    // this.formerror = false;
    // this.successboolean = false;
    // this.successbooleanred = false;
    // let control = <FormArray>this.form.controls.Parameter;
    // control.removeAt(this.deleteindex)
    // this.togglePlusMinus = []

    // // adding new Activeindex after deleting previous as index changes
    // console.log("Parameter length", this.Parameter.length);
    // if (this.Parameter.length > 0) {
    //   for (var i = 0; i < this.Parameter.length; i++) {
    //     if (this.Parameter.controls[i]['controls'].inputtype.value.label == "String Dropdown") {
    //       // this.ActivateIndex.push(i);
    //     }
    //     var obj = {}
    //     obj[i] = false;
    //     this.togglePlusMinus.push(obj)
    //   }
    // }

    // // adding new InputActivateIndex as index changes which disales the input type from database
    // if (this.Parameter.length == 0) {
    //   console.log("parameter is empty")
    //   this.showTable = false;
    // }
    // // 
    // if (this.edit == true) {
    //   if (this.deletedparameterId !== null) {
    //     for (var i = 0; i < this.Parameter1.length; i++) {
    //       for (var j = 0; j < this.Parameter1[i].ParamArray.length; j++) {
    //         if (this.Parameter1[i].ParamArray[j].parameterId === this.deletedparameterId) {
    //           if (this.deleteArrayItems.length > 0) {
    //             let subcatpresent = false;
    //             Objtopush = {};
    //             Objtopush['itemsArray'] = [];
    //             Objtopush['id'] = this.Parameter1[i].ParamArray[j].parameterId;
    //             for (let e = 0; e < this.deleteArrayItems.length; e++) {
    //               if (this.deleteArrayItems[e].id === this.Parameter1[i].ParamArray[j].parameterId) {
    //                 for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
    //                   Objtopush['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
    //                 }
    //                 this.deleteArrayItems.splice(e, 1, Objtopush);
    //                 subcatpresent = true;
    //                 break;
    //               }
    //             }
    //             if (!subcatpresent) {
    //               if (this.Parameter1[i].StringDropdownArray !== undefined) {
    //                 for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
    //                   Objtopush['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
    //                 }
    //                 this.deleteArrayItems.push(Objtopush);
    //               } else {
    //                 this.deleteArrayItems.push(Objtopush);
    //               }
    //             }
    //           } else {
    //             this.deleteArrayItems = [];
    //             var Objtopush = {};
    //             Objtopush['itemsArray'] = [];
    //             Objtopush['id'] = this.Parameter1[i].ParamArray[j]['parameterId'];
    //             if (this.Parameter1[i].StringDropdownArray !== undefined) {
    //               for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
    //                 Objtopush['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
    //               }
    //               this.deleteArrayItems.push(Objtopush);
    //             } else {
    //               this.deleteArrayItems.push(Objtopush);
    //             }

    //           }
    //         }
    //       }
    //     }
    //   }

    // }
    // console.log("this.deleteArrayItems bottom=>", this.deleteArrayItems);
    // // 
    // this.displaydeletedialog = false;
  }
  closeOpenCloseDialog() {
    this.edit = false;
    this.displaydeletedialog = false;
    this.parameterPop = false;
    this.stringDropdownPop= false;
  }

  // adding values pop-up open close

  addParameterValue(index) {
    this.minusicon = !this.minusicon;
    this.clkindex = index;
    console.log("clk index", this.clkindex)
    // this.add_values = true;
    console.log(" index", index)

    console.log(" this.togglePlusMinus", this.togglePlusMinus)
    this.togglePlusMinus.map(item => { if (item.hasOwnProperty(index)) { console.log("matche==d", item); item[index] = !item[index] } })
    console.log("this.togglePlusMinus", this.togglePlusMinus)

  }
  closeAddValuesPopUp() {
    // this.add_values = false;
  }
  onkeyup(evt, type) {
    evt.target.value = this.validationService.KeyUpValidationfordecimal(type, evt.target.value);
  }

  onkeyDownAllFields() {
    this._communicationservice.backendError = false
    this.showMsg = false;
    this.showMsgDuplicate = false;
    this.formerror = false;
    this.successboolean = false;
    this.successbooleanred = false;
  }

  commonCancelMethod() {
    // this.form.reset();
    this._communicationservice.backendError = false;
    this.showAddParameterButton = true;
    while (this.Parameter.length !== 0) {
      this.Parameter.removeAt(0)
    }
    this.itemsresults = [];
    this.showTable = false;
    this.hideitem = true;
    this.togglePlusMinus = [];
    this.edit = false;
    this.Parameter1 = [];
    this.deleteArrayItems = [];
    this.deleteStringDropdownArray = [];
    this.deleteParameterArray = [];
    this.newObj = {};
    this.displaydeletedialog = false;
    this.parameterPop = false;
    this.stringDropdownPop= false;
  }
  commonCancelWithAllMethod() {
    this._communicationservice.backendError = false;
    this.form.controls['Parameter'].reset();
    this.form.controls['subcategory'].reset();
    this.form.controls['items'].reset();
    this.form.controls['multiplier'].reset();
  }

  showOpenCloseDialogNewParameter() {
    console.log("removing item of Parameter Array index", this.deleteindex);
    this.showMsg = false;
    this.showMsgDuplicate = false;
    this.formerror = false;
    this.successboolean = false;
    this.successbooleanred = false;
    let control = <FormArray>this.form.controls.Parameter;
    control.removeAt(this.deleteindex)
    this.togglePlusMinus = []

    // adding new Activeindex after deleting previous as index changes
    console.log("Parameter length", this.Parameter.length);
    if (this.Parameter.length > 0) {
      for (var i = 0; i < this.Parameter.length; i++) {
        if (this.Parameter.controls[i]['controls'].inputtype.value.label == "String Dropdown") {
          // this.ActivateIndex.push(i);
        }
        var obj = {}
        obj[i] = false;
        this.togglePlusMinus.push(obj)
      }
    }

    // adding new InputActivateIndex as index changes which disales the input type from database
    if (this.Parameter.length == 0) {
      console.log("parameter is empty")
      this.showTable = false;
    }
    // 
    if (this.edit == true) {
      if (this.deletedparameterId !== null) {
        for (var i = 0; i < this.Parameter1.length; i++) {
          for (var j = 0; j < this.Parameter1[i].ParamArray.length; j++) {
            if (this.Parameter1[i].ParamArray[j].parameterId === this.deletedparameterId) {
              if (this.deleteArrayItems.length > 0) {
                let subcatpresent = false;
                Objtopush = {};
                Objtopush['itemsArray'] = [];
                Objtopush['id'] = this.Parameter1[i].ParamArray[j].parameterId;
                for (let e = 0; e < this.deleteArrayItems.length; e++) {
                  if (this.deleteArrayItems[e].id === this.Parameter1[i].ParamArray[j].parameterId) {
                    for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
                      Objtopush['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
                    }
                    this.deleteArrayItems.splice(e, 1, Objtopush);
                    subcatpresent = true;
                    break;
                  }
                }
                if (!subcatpresent) {
                  if (this.Parameter1[i].StringDropdownArray !== undefined) {
                    for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
                      Objtopush['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
                    }
                    this.deleteArrayItems.push(Objtopush);
                  } else {
                    this.deleteArrayItems.push(Objtopush);
                  }
                }
              } else {
                this.deleteArrayItems = [];
                var Objtopush = {};
                Objtopush['itemsArray'] = [];
                Objtopush['id'] = this.Parameter1[i].ParamArray[j]['parameterId'];
                if (this.Parameter1[i].StringDropdownArray !== undefined) {
                  for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
                    Objtopush['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
                  }
                  this.deleteArrayItems.push(Objtopush);
                } else {
                  this.deleteArrayItems.push(Objtopush);
                }

              }
            }
          }
        }
      }

    }
    console.log("this.deleteArrayItems bottom=>", this.deleteArrayItems);
    // 
    this.displaydeletedialog = false;
    this.parameterPop = false;
    this.stringDropdownPop= false;
  }

  
  deleteNewValuesNewStringdropdown(control, index, addvalue, param) {
    // deleting the content to store 
    if (this.edit == true) {
      if (addvalue.controls.StringDropdownId.value !== null) {
        if (this.deleteArrayItems.length > 0) {
          let Objtopush = {};
          for (var i = 0; i < this.Parameter1.length; i++) {
            for (var j = 0; j < this.Parameter1[i].ParamArray.length; j++) {
              if (this.Parameter1[i].ParamArray[j].parameterId === param.controls.parameterId.value) {
                let ItemnotPresent = true;
                Objtopush['id'] = this.Parameter1[i].ParamArray[j]['parameterId'];
                for (let q = 0; q < this.deleteArrayItems.length; q++) {
                  if (this.deleteArrayItems[q]['id'] === this.Parameter1[i].ParamArray[j]['parameterId']) {
                    for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
                      if (this.Parameter1[i].StringDropdownArray[w].StringDropdownId === addvalue.controls.StringDropdownId.value) {
                        this.deleteArrayItems[q]['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
                        this.deleteArrayItems[q]['InitialCounter'] += 1;
                        break;
                      }
                    }
                    ItemnotPresent = false;
                    break;
                  }
                }
                if (ItemnotPresent) {
                  for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
                    if (this.Parameter1[i].StringDropdownArray[w].StringDropdownId === addvalue.controls.StringDropdownId.value) {
                      Objtopush['itemsArray'] = [];
                      Objtopush['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
                      Objtopush['InitialCounter'] = 1;
                      Objtopush['FinalCounter'] = this.Parameter1[i].StringDropdownArray.length;
                    }
                  }
                  this.deleteArrayItems.push(Objtopush);
                }
              }
            }
          }
        } else {
          this.deleteArrayItems = [];
          var Objtopush = {};
          for (var i = 0; i < this.Parameter1.length; i++) {
            for (var j = 0; j < this.Parameter1[i].ParamArray.length; j++) {
              if (this.Parameter1[i].ParamArray[j].parameterId === param.controls.parameterId.value) {
                Objtopush['id'] = this.Parameter1[i].ParamArray[j]['parameterId'];
                for (let w = 0; w < this.Parameter1[i].StringDropdownArray.length; w++) {
                  if (this.Parameter1[i].StringDropdownArray[w].StringDropdownId === addvalue.controls.StringDropdownId.value) {
                    Objtopush['itemsArray'] = [];
                    Objtopush['itemsArray'].push(this.Parameter1[i].StringDropdownArray[w].StringDropdownId);
                    Objtopush['InitialCounter'] = 1;
                    Objtopush['FinalCounter'] = this.Parameter1[i].StringDropdownArray.length;
                    break;
                  }
                }
                this.deleteArrayItems.push(Objtopush);
              }
            }
          }
        }
      }

    }

    console.log("this.deleteArrayItems==>", this.deleteArrayItems)
    // 
    control.removeAt(index);
    this.displaydeletedialog = false;
    this.parameterPop = false;
    this.stringDropdownPop= false;
  }
}

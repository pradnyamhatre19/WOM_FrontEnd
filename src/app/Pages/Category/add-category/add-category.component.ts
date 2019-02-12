import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from 'node_modules/@angular/forms';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { UploadfileService } from 'src/app/services/FileUpload/uploadfile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  data = {
    Parameter: [
      {
        subcatId: '',
        subcategory: "",
        AddingValues: []
      }
    ]
  }

  formerror: boolean;
  nosubCategories: boolean = false;
  subcategories: any[] = [];
  edit = false;
  catId;
  subCatDuplicate: boolean;
  subCatITemDuplicate: boolean;
  form: FormGroup;
  display_message_for_category_add: Boolean;
  display_message_for_category_add_message: Boolean;
  message;
  error_in_adding_category: boolean;
  selectedFiles: FileList; // created for fileUpload contain all files in array of Object format

  fileupload = {};
  localSubIndex;
  subCategoryPop: boolean = false;
  itemPop: boolean = false;
  displayAddNo: boolean = false;
  localItemControl;
  localItemIndex;
  Parameter1 = [];
  subcategory1 = [];
  AddingValues1 = [];
  deletedsubcategoryId;
  deletedSubCatArray = [];
  deletedOnlyItemArray = [];
  deleteArrayItems = [];
  imageArrayEdit: any;
  same_category: boolean = false;
  editBoolean: Boolean = false;
  S3image = false;
  S3imagename = '';
  newObj = {};
  checkItemsArray = [];
  globalItemsDuplicate: boolean = false;
  imgPathForErrorDelete = '';
  imgPathForErrorsubmitDelete = '';
  isEdit = false;
  isListing = false;
  isDelete = false;
  isAdd = false;

  constructor(public _communicationservice: CommunicateService,
    private _formbuilder: FormBuilder,
    private _commonNodeCallService: CommonCallService,
    private uploadService: UploadfileService,
    private router:Router) {
    this._communicationservice.backendError = false;
  }

  ngOnInit() {

    this.form = this._formbuilder.group({
      categoryName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      uploadfile: ['', Validators.required],
      Parameter: this._formbuilder.array([], Validators.required)
    })

    this._communicationservice.categorydata.subscribe(data => {
      //console.log(data);
      if (data == "") {
        this.edit = false;
        this.editBoolean = false;
        this.form.patchValue({
          categoryName: "",
          description: "",
          uploadfile: ""
          // description:bufferBase64
        })
        this.subcategories = [];
        const arr = <FormArray>this.form.controls.Parameter;
        arr.controls = [];
        while (this.Parameter.length !== 0) {
          this.Parameter.removeAt(0)
        }

      } else {
        this.reLoadFunction(data)
      }

    });
  }

  ngDoCheck() {
    var pageName = sessionStorage.getItem('selectedFunctionality')
    var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
    if(pageName == "Categories Master"){
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
  }

  addParameter() {
    this.checkItemsArray = [];
    this.globalItemsDuplicate = false;
    this.formerror = false;
    this.nosubCategories = false;
    this.subCatITemDuplicate = false;
    this.subCatDuplicate = false;
    this.error_in_adding_category = false;
    this.same_category = false;
    let control = <FormArray>this.form.controls.Parameter;
    control.push(
      this._formbuilder.group({
        subcatId: null,
        subcategory: ['', [Validators.required]],
        AddingValues: this._formbuilder.array([])
      })
    )
  }
  globalDelete;
  // subNewDeleteIndex;
  // subNewDeleteParam;
  removeParameter(index, param) {
    // this.subNewDeleteIndex = index;
    // this.subNewDeleteParam = param;
    this.globalDelete = 'subcategoryDelete';
    this.itemPop = false;
    console.log("subcategory -value", param.controls.subcategory.value)
    console.log("TESTING SUBCATEGORYID--====>", param.controls.subcatId.value)
    console.log("this.deletedsubcategoryNAME--====>", this.deletedsubcategoryId)
    this.globalItemsDuplicate = false;
    this.checkItemsArray = [];
    this.deletedsubcategoryId = param.controls.subcatId.value;
    this.localSubIndex = index;
    this.display_message_for_category_add = true;
    this.display_message_for_category_add_message = false;
    this.displayAddNo = true;
    this.subCategoryPop = true;
  }

  // sub pop up delete 
  deleteSubPop() {
    console.log("globaldelete==>",this.globalDelete)
    if(this.globalDelete === 'subcategoryDelete'){
      this.deleteSubPopNew();
    }else if(this.globalDelete === 'itemDelete'){
      this.deleteNewValuesNew(this.itemDeleteControl, this.itemDeleteIndex, this.itemAddValue, this.itemParam) 
    }
      }

  // close popup
  closeDialogClient() {
    console.log("close clicked")
    this.globalItemsDuplicate = false;
    this.checkItemsArray = [];
    this.displayAddNo = false;
    this.subCategoryPop = false;
    this.itemPop = false;
    this.display_message_for_category_add_message = false;
    this.display_message_for_category_add = false;    
  }

  addNewValues(control) {
    this.checkItemsArray = [];
    this.globalItemsDuplicate = false;
    this.formerror = false;
    this.nosubCategories = false;
    this.subCatITemDuplicate = false;
    this.subCatDuplicate = false;
    this.error_in_adding_category = false;
    this.same_category = false;
    control.push(
      this._formbuilder.group({
        itemID: null,
        addvaluesname: ['', [Validators.required]]
      }))
  }

  itemDeleteControl;
  itemDeleteIndex;
  itemAddValue;
  itemParam;
  deleteNewValues(control, index, addvalue, param) {
    this.subCategoryPop = false;
    this.itemDeleteControl = control;
    this.itemDeleteIndex = index;
    this.itemAddValue = addvalue;
    this.itemParam = param;
    this.display_message_for_category_add = true;
    this.displayAddNo = true;
  this.subCategoryPop =false;
this.itemPop = true;
this.globalDelete = 'itemDelete';
  }


  setCompanies() {
    let control = <FormArray>this.form.controls.Parameter;
    this.data.Parameter.forEach(x => {
      control.push(this._formbuilder.group({
        subcatId: x.subcatId,
        subcategory: [x.subcategory,[Validators.required]],
        AddingValues: this.setProjects(x)
      }))
    })
  }



  setProjects(x) {
    let arr = new FormArray([])
    x.AddingValues.forEach(y => {
      console.log("y=======", y)
      arr.push(this._formbuilder.group({
        itemID: y.itemID,
        addvaluesname: [y.addvaluesname,[Validators.required]]
      }))
    })
    console.log("array", arr)
    return arr;
  }

  get Parameter(): FormArray {
    return this.form.get('Parameter') as FormArray;
  }
  get categoryName() {
    return this.form.get('categoryName');
  }
  get description() {
    return this.form.get('description');
  }
  get subcategory() {
    return this.form.get('subcategory');
  }
  get uploadfile() {
    return this.form.get('uploadfile');
  }

  // cancel
  cancel() {
    this._communicationservice.backendError = false;
    // this.form.reset();    
    // const arr = <FormArray>this.form.controls.Parameter;
    // arr.controls = [];
    while (this.Parameter.length !== 0) {
      this.Parameter.removeAt(0)
    }
    this.form.reset();
    console.log("checking array on click of cancel" + JSON.stringify(this.Parameter.value));
    // this.formerror=false;
    // this.subCatDuplicate=false;   
    this.S3imagename = '';
    this.formerror = false;
    this.nosubCategories = false;
    this.subCatITemDuplicate = false;
    this.subCatDuplicate = false;
    this.error_in_adding_category = false;
    this.same_category = false;
    this.Parameter1 = [];
    this.deleteArrayItems = [];
    this.deletedOnlyItemArray = [];
    this.deletedSubCatArray = [];
    this.deletedOnlyItemArray = [];
    this.editBoolean = false;
    this.newObj = {};
    this.globalItemsDuplicate = false;
    this.checkItemsArray = [];
    this.display_message_for_category_add = false;
    this.subCategoryPop =false;
    this.itemPop =false;
    this.displayAddNo=false;
    this.display_message_for_category_add_message =false;
    console.log("this.deleteArrayItems===>", this.deleteArrayItems);
    console.log("this.Parameter1===>", this.Parameter1);
    this._communicationservice.CategoryCancel(false);
  }

  // submit
  submit(data) {
    console.log(data);
    if (this.form.invalid) {
      this.formerror = true;
    }
    else if (data.Parameter.length == 0) {
      console.log("checking sub cat length", data.Parameter.length)
      this.nosubCategories = true;
    }
    else {
      console.log(data);
      // checking duplicates
      var valueArr = data.Parameter.map(function (item) { return item.subcategory });
      var isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
      console.log("sub categories contains duplicates while submit", isDuplicate);
      if (isDuplicate) {
        this.subCatDuplicate = true;
        console.log("in isduplicate block")
      }
      else {
        for (var i = 0; i < data.Parameter.length; i++) {
          // checking duplicates
          var valueArr1 = data.Parameter[i].AddingValues.map(function (item) { return item.addvaluesname });
          var isDuplicate1 = valueArr1.some(function (item, idx) {
            return valueArr1.indexOf(item) != idx
          });
          console.log("items contains duplicates while submit", isDuplicate1);
          if (isDuplicate1) {
            break;
          }
        }

        if (isDuplicate1) {
          this.subCatITemDuplicate = true;
          console.log("in isduplicate block of item")
        }
        else {
          console.log(data);
          this.checkItems(data)
          if (this.globalItemsDuplicate === true) {
            this.subCatITemDuplicate = true;
          } else {
            this._communicationservice.loader = true;
            console.log("items are unique ")

            console.log("go to server")
            this.subCatDuplicate = false;

            data.user_id = sessionStorage.getItem('userid')
            console.log(data);

            data.actionType = "submit";
            if (data.uploadfile !== "") {
              const filePath = 'upload/Categories/';
              this.uploadService.FOLDER = filePath;
              const file = this.selectedFiles;
              const optParam = '';
              this.uploadService.uploadfile(file, optParam, res => {
                console.log("res", res);
                if (res['success']) {
                  this._communicationservice.backendError = false;
                  console.log('call Submit Method');
                  this.imgPathForErrorsubmitDelete = res.respArray[0].path;
                  data['imageName'] = res["respArray"][0].fileName
                  data['imageSrc'] = res.respArray[0].path;
                  data['image_type'] = res.respArray[0].contentType;
                  console.log("data to be sent to API==>", data);
                  // PRocedure type data
                  this.newObj['actionType'] = "insert";
                  this.newObj['status'] = "active";
                  this.newObj['categoryId'] = null;
                  this.newObj['categoryName'] = data.categoryName;
                  this.newObj['categoryDescription'] = data.description;
                  this.newObj['categoryImg'] = data.imageName;
                  this.newObj['categoryImgSrc'] = data.imageSrc;
                  this.newObj['categoryImgType'] = data.image_type;
                  this.newObj['categoryImgPath'] = data.imageSrc;
                  this.newObj['userId'] = data.user_id;
                  this.newObj['deletedSubCatArray'] = null;
                  this.newObj['deletedOnlyItemArray'] = null;
                  this.newObj['childList1'] = [];
                  for (var i = 0; i < data.Parameter.length; i++) {
                    var dataOBj = data.Parameter[i];
                    var obj = {}
                    obj['subcategoryId'] = dataOBj.subcatId;
                    obj['subcategoryName'] = dataOBj.subcategory;
                    if (dataOBj.AddingValues.length > 0) {
                      var childList2 = [];
                      for (var j = 0; j < dataOBj.AddingValues.length; j++) {
                        var data2Obj = dataOBj.AddingValues[j];
                        var itemObj = {};
                        itemObj['itemId'] = data2Obj.itemID
                        itemObj['itemName'] = data2Obj.addvaluesname
                        childList2.push(itemObj)
                        obj['childList2'] = childList2;
                      }
                    } else {
                      obj['childList2'] = [];
                    }
                    this.newObj['childList1'].push(obj)
                  }
                  console.log("Final data for PROCEDURE API on submit==>", this.newObj);
                  // call api
                  this._commonNodeCallService.SaveAndUpdateCategoryProcall(this.newObj).subscribe(res => {
                    this.globalItemsDuplicate = false;
                    this.checkItemsArray = [];
                    console.log(res);
                    if (res['success']) {
                      this._communicationservice.backendError = false;
                      this._communicationservice.CategoryCancel(false);
                      console.log("success in adding category");
                      while (this.Parameter.length !== 0) {
                        this.Parameter.removeAt(0)
                      }
                      this.form.reset();
                      console.log("checking array on successfull response" + JSON.stringify(this.Parameter.value));
                      this.display_message_for_category_add = true;
                      this.display_message_for_category_add_message = true;
                      this.message = res['message'];
                      this.error_in_adding_category = false;
                      this.same_category = false;
                    this._communicationservice.loader = false;
                    }
                    else {
                      if (res['samecategory']) {
                        this.same_category = true;
                        this.message = res['message'];
                      }
                      else {
                        if(res['statusCode'] === 401){
                          this.router.navigateByUrl('/login');
                        }else{
                          console.log("error in adding category");
                        // this._communicationservice.CategoryCancel(false);
                        // this.display_message_for_category_add = true;
                        // this.display_message_for_category_add_message = true;
                        // this.message = res['message'];
                        // this.error_in_adding_category = true;
                        this._communicationservice.backendError = true;
                        }
                        
                      }
                      this.uploadService.deleteFile([], {}, this.imgPathForErrorsubmitDelete, resp => {
                        console.log("deleted uploaded file on error in submit")                  
                      })
                    this._communicationservice.loader = false;
                    }
                  });
                  // api ends here
                } else {
                  this._communicationservice.backendError = true;
                }
              })
            }
          }
        }
      }
    }
  }


  // update
  // UPDATE
  update(data) {
    console.log(data);
    if (this.form.invalid) {
      this.formerror = true;
    }
    else {
      if (data.Parameter.length == 0) {
        console.log("checking sub cat length", data.Parameter.length)
        this.nosubCategories = true;
      }
      else {
        // checking duplicates
        var valueArr2 = data.Parameter.map(function (item) { return item.subcategory });
        var isDuplicate = valueArr2.some(function (item, idx) {
          return valueArr2.indexOf(item) != idx
        });
        console.log("sub categories contains duplicates while UPDATIN", isDuplicate);
        if (isDuplicate) {
          this.subCatDuplicate = true;
          console.log("UPDATE--in isduplicate block")
        }
        else {
          for (var i = 0; i < data.Parameter.length; i++) {
            // checking duplicates
            var valueArr1 = data.Parameter[i].AddingValues.map(function (item) { return item.addvaluesname });
            var isDuplicate1 = valueArr1.some(function (item, idx) {
              return valueArr1.indexOf(item) != idx
            });
            console.log("items contains duplicates while submit", isDuplicate1);
            if (isDuplicate1) {
              break;
            }
          }
          if (isDuplicate1) {
            this.subCatITemDuplicate = true;
            console.log("in isduplicate block of item")
          }
          else {
            this.checkItems(data);
            if (this.globalItemsDuplicate === true) {
              this.subCatITemDuplicate = true;
            } else {
              this._communicationservice.loader = true;
              // deleted subcat-items seperation into subcat and items
              // bewlo condtion for not allowing array to repeat when errors occurs
              this.deletedOnlyItemArray = [];
              this.deletedSubCatArray = [];
              if (this.deleteArrayItems.length > 0) {
                for (var i = 0; i < this.deleteArrayItems.length; i++) {
                  var delObj = this.deleteArrayItems[i];
                  if (delObj.hasOwnProperty("FinalCounter")) {
                    for (var j = 0; j < delObj.itemsArray.length; j++) {
                      this.deletedOnlyItemArray.push(delObj.itemsArray[j]);
                    }
                  } else {
                    this.deletedSubCatArray.push(delObj.id);
                  }
                }
              } else {
                this.deletedSubCatArray = this.deleteArrayItems;
                this.deletedOnlyItemArray = this.deleteArrayItems;
                console.log("it should be EMPTY--this.deletedSubCatArray on update==>", this.deletedSubCatArray);
                console.log("it should be EMPTY--this.deletedOnlyItemArray on update==>", this.deletedOnlyItemArray);
              }
              // ends here
              var delSubCatCommaSeparated = null;
              var delItemsCommaSeparated = null;

              // comma separated subcat
              if (this.deletedSubCatArray.length > 0) {
                for (var k = 0; k < this.deletedSubCatArray.length; k++) {
                  if (k === 0) {
                    delSubCatCommaSeparated = this.deletedSubCatArray[k];
                  } else {
                    delSubCatCommaSeparated += ',' + this.deletedSubCatArray[k];
                  }
                }
              } else {
                delSubCatCommaSeparated = null;
              }
              // comma separated items
              if (this.deletedOnlyItemArray.length > 0) {
                for (var l = 0; l < this.deletedOnlyItemArray.length; l++) {
                  if (l === 0) {
                    delItemsCommaSeparated = this.deletedOnlyItemArray[l];
                  } else {
                    delItemsCommaSeparated += ',' + this.deletedOnlyItemArray[l];
                  }
                }
              } else {
                delItemsCommaSeparated = null;
              }
              console.log("iitems are unique ")
              this.same_category = false;
              console.log("UPDATE--go to server")
              console.log(data);
              this.subCatDuplicate = false;

              data.actionType = "update";
              // cat id
              data.id = this.catId;
              // user id
              data.user_id = sessionStorage.getItem('userid');
              console.log(data.user_id);
              data.deletedSubCatArray = this.deletedSubCatArray;
              data.deletedOnlyItemArray = this.deletedOnlyItemArray;
              console.log("final data after adding ID,deletedSubCatArray,deletedOnlyItemArray", data);
              // FIle Upload
              if (this.selectedFiles !== undefined && this.selectedFiles.length > 0) {
                const filePath = 'upload/Categories/';
                this.uploadService.FOLDER = filePath;
                const file = this.selectedFiles;
                const optParam = '';
                this.uploadService.uploadfile(file, optParam, res => {
                  console.log("res", res);
                  if (res['success']) {
                    this._communicationservice.backendError = false;
                    console.log('call Submit Method');
                    this.imgPathForErrorDelete = res.respArray[0].path;
                    console.log("this.imgPathForErrorDelete==>",this.imgPathForErrorDelete);
                    data['imageName'] = res["respArray"][0].fileName
                    data['imageSrc'] = res.respArray[0].path;
                    data['image_type'] = res.respArray[0].contentType;
                    console.log("data to be sent to API==>", data);
                    // PRocedure type data
                    this.newObj['actionType'] = "update";
                    this.newObj['status'] = "active";
                    this.newObj['categoryId'] = data.id;
                    this.newObj['categoryName'] = data.categoryName;
                    this.newObj['categoryDescription'] = data.description;
                    this.newObj['categoryImg'] = data.imageName;
                    this.newObj['categoryImgSrc'] = data.imageSrc;
                    this.newObj['categoryImgType'] = data.image_type;
                    this.newObj['categoryImgPath'] = data.imageSrc;
                    this.newObj['userId'] = data.user_id;
                    this.newObj['deletedSubCatArray'] = delSubCatCommaSeparated;
                    this.newObj['deletedOnlyItemArray'] = delItemsCommaSeparated;
                    this.newObj['childList1'] = [];
                    for (var i = 0; i < data.Parameter.length; i++) {
                      var dataOBj = data.Parameter[i];
                      var obj = {}
                      obj['subcategoryId'] = dataOBj.subcatId;
                      obj['subcategoryName'] = dataOBj.subcategory;
                      if (dataOBj.AddingValues.length > 0) {
                        var childList2 = [];
                        for (var j = 0; j < dataOBj.AddingValues.length; j++) {
                          var data2Obj = dataOBj.AddingValues[j];
                          var itemObj = {};
                          itemObj['itemId'] = data2Obj.itemID
                          itemObj['itemName'] = data2Obj.addvaluesname
                          childList2.push(itemObj)
                          obj['childList2'] = childList2;
                        }
                      } else {
                        obj['childList2'] = [];
                      }
                      this.newObj['childList1'].push(obj)
                    }
                    console.log("Final data for PROCEDURE API with new image==>", this.newObj);
                    // call api
                    this._commonNodeCallService.SaveAndUpdateCategoryProcall(this.newObj).subscribe(res => {
                      this.globalItemsDuplicate = false;
                      this.checkItemsArray = [];
                      console.log(res);
                      if (res['success']) {
                        this._communicationservice.backendError = false;
                        this._communicationservice.CategoryCancel(false);
                        console.log("success in adding category");
                        // const arr = <FormArray>this.form.controls.Parameter;
                        // arr.controls = [];
                        while (this.Parameter.length !== 0) {
                          this.Parameter.removeAt(0)
                        }
                        this.form.reset();
                        console.log("checking array on successfull response" + JSON.stringify(this.Parameter.value));
                        this.uploadService.deleteFile([], {}, this.imageArrayEdit['category_src'], resp => {
                          if (resp["success"]) {
                          this._communicationservice.loader = false;
                            console.log("file Deleted Successfully");
                            this.display_message_for_category_add = true;
                            this.display_message_for_category_add_message = true;
                            this.message = res['message'];
                            this.error_in_adding_category = false;
                            this.same_category = false;
                          } else {
                            console.log("error in deleting from aws");
                            this._communicationservice.backendError = true;
                          this._communicationservice.loader = false;
                          }
                        });
                      }
                      else {
                        if (res['samecategory']) {
                          console.log("SAMECATEGORY ERROR-(with image upload)-this.catId==>",this.catId);
                          this.same_category = true;
                          this.message = res['message'];
                        }
                        else {
                          if(res['statusCode'] === 401){
                            this.router.navigateByUrl('/login');
                          }else{
                            console.log("error in adding category");
                          console.log("INTERNAL SERVER ERROR-(with image upload)-this.catId==>",this.catId);
                          this._communicationservice.backendError = true;
                          }
                        }
                     // delete uploaded image as error occured
                     this.uploadService.deleteFile([], {}, this.imgPathForErrorDelete, resp=>{
                      if(resp['success']){
                        setTimeout(()=>{    //<<<---    using ()=> syntax
                          this.commonCancel();
                          this.reLoadFunction(this.catId);
                     }, 3000);
                      }else{
                        console.log("error in deleting uploaded image as error occured")
                        this._communicationservice.backendError = true; 
                        setTimeout(()=>{    //<<<---    using ()=> syntax
                          this.commonCancel();
                          this.reLoadFunction(this.catId);
                     }, 3000);                         
                      }
                    });
                    this._communicationservice.loader = false;
                      }
                    });
                    // api ends here
                  } else {
                    console.log("error while uploading to aws")
                    console.log("INTERNAL SERVER ERROR aws upload failed-(with image upload)-this.catId==>",this.catId);
                    this._communicationservice.backendError = true;
                    setTimeout(()=>{    //<<<---    using ()=> syntax
                      this.commonCancel();
                      this.reLoadFunction(this.catId);
                 }, 3000);
                 this._communicationservice.loader = false;                    
                  }
                })
              } else {
                data['imageName'] = this.imageArrayEdit['image_name'];
                data['image_type'] = this.imageArrayEdit['image_type'];
                data['imageSrc'] = this.imageArrayEdit['category_src'];
                console.log("data to be sent to API==>", data);
                // PRocedure type data
                this.newObj['actionType'] = "update";
                this.newObj['status'] = "active";
                this.newObj['categoryId'] = data.id;
                this.newObj['categoryName'] = data.categoryName;
                this.newObj['categoryDescription'] = data.description;
                this.newObj['categoryImg'] = data.imageName;
                this.newObj['categoryImgSrc'] = data.imageSrc;
                this.newObj['categoryImgType'] = data.image_type;
                this.newObj['categoryImgPath'] = data.uploadfile.category_src;
                this.newObj['userId'] = data.user_id;
                this.newObj['deletedSubCatArray'] = delSubCatCommaSeparated;
                this.newObj['deletedOnlyItemArray'] = delItemsCommaSeparated;
                this.newObj['childList1'] = [];
                for (var i = 0; i < data.Parameter.length; i++) {
                  var dataOBj = data.Parameter[i];
                  var obj = {}
                  obj['subcategoryId'] = dataOBj.subcatId;
                  obj['subcategoryName'] = dataOBj.subcategory;
                  if (dataOBj.AddingValues.length > 0) {
                    var childList2 = [];
                    for (var j = 0; j < dataOBj.AddingValues.length; j++) {
                      var data2Obj = dataOBj.AddingValues[j];
                      var itemObj = {};
                      itemObj['itemId'] = data2Obj.itemID
                      itemObj['itemName'] = data2Obj.addvaluesname
                      childList2.push(itemObj)
                      obj['childList2'] = childList2;
                    }
                  } else {
                    obj['childList2'] = [];
                  }
                  this.newObj['childList1'].push(obj)
                }
                console.log("Final data for PROCEDURE API with database image==>", this.newObj);
                // call api
                this._commonNodeCallService.SaveAndUpdateCategoryProcall(this.newObj).subscribe(res => {
                  this.globalItemsDuplicate = false;
                  this.checkItemsArray = [];
                  console.log(res);
                  if (res['success']) {
                    this._communicationservice.backendError = false;
                    this._communicationservice.CategoryCancel(false);
                    console.log("success in adding category");
                    while (this.Parameter.length !== 0) {
                      this.Parameter.removeAt(0)
                    }
                    this.form.reset();
                    console.log("checking array on successfull response" + JSON.stringify(this.Parameter.value));
                    this.display_message_for_category_add = true;
                    this.display_message_for_category_add_message = true;
                    this.message = res['message'];
                    this.error_in_adding_category = false;
                    this.same_category = false;
                  this._communicationservice.loader = false;
                  }
                  else {
                    if (res['samecategory']) {
                      console.log("SAMECATEGORY ERROR(without image upload)-this.catId==>",this.catId);
                      this.same_category = true;
                      this.message = res['message'];
                    }
                    else {
                      if(res['statusCode'] === 401){
                        this.router.navigateByUrl('/login');
                      }else{
                        console.log("error in adding category");
                    this._communicationservice.backendError = true;
                      console.log("INTERNAL SERVER ERROR (without image upload)-this.catId==>",this.catId);
                      }
                    }
                    setTimeout(()=>{    //<<<---    using ()=> syntax
                      this.commonCancel();
                      this.reLoadFunction(this.catId);
                 }, 3000);
                 this._communicationservice.loader = false;
                  }
                });
              }
            }
          }
        }
      }
    }
  }

  onkeyDownAllFields() {
    this._communicationservice.backendError = false;
    this.formerror = false;
    this.nosubCategories = false;
    this.subCatITemDuplicate = false;
    this.subCatDuplicate = false;
    this.error_in_adding_category = false;
    this.same_category = false;
    this.globalItemsDuplicate = false;
    this.checkItemsArray = [];
  }
  okMessageForCategoryAdd() {
    this._communicationservice.backendError = false;
    this.globalItemsDuplicate = false;
    this.checkItemsArray = [];
    this.display_message_for_category_add = false;
    this.subCategoryPop =false;
    this.itemPop =false;
    this.displayAddNo =false;
    this.display_message_for_category_add_message =false;
    window.location.reload();

  }
  removeParam() {
    while (this.Parameter.length !== 0) {
      this.Parameter.removeAt(0)
    }
  }

  uploadfiledata(event) {
    this.S3image = false;
    this.selectedFiles = event.target.files;
  }
  checkItems(data) {
    for (var i = 0; i < data.Parameter.length; i++) {
      if (data.Parameter[i].AddingValues.length > 0) {
        for (var k = 0; k < data.Parameter[i].AddingValues.length; k++) {
          var obj = {};
          obj['addvaluesname'] = data.Parameter[i].AddingValues[k].addvaluesname;
          this.checkItemsArray.push(obj);
        }
      }
    }
    console.log("this.checkItemsArray", this.checkItemsArray);
    for (var i = 0; i < this.checkItemsArray.length; i++) {
      // checking duplicates
      var valueArr1 = this.checkItemsArray.map(function (item) { return item.addvaluesname });
      var isDuplicate1 = valueArr1.some(function (item, idx) {
        return valueArr1.indexOf(item) != idx
      });
      console.log("items contains duplicates inside checkItems", isDuplicate1);
      if (isDuplicate1) {
        break;
      }
    }
    if (isDuplicate1) {
      console.log("in isduplicate block of item inside checkItems")
      this.globalItemsDuplicate = true;
    } else {
      console.log("ino duplicates inside checkItems")
      this.globalItemsDuplicate = false;
    }
  }

  reLoadFunction(catId) {
    this.display_message_for_category_add = false;
    this.subCategoryPop =false;
    this.itemPop =false;
    this.displayAddNo=false;
    this.display_message_for_category_add_message =false;
    console.log("inside reLoadFunction", catId)
    this.edit = true;
    this.editBoolean = true;
    // var objdata = { "id": data.id };
    var objdata = { "id": catId };
    console.log("id came from category listing page", objdata)

    this.catId = catId;
    console.log("category id", this.catId)

    this._commonNodeCallService.GetCategoryById(objdata).subscribe(res => {
      console.log(res);
      if (res['success']) {
        this._communicationservice.backendError = false;
        console.log("results", res['results']);
        // console.log("results with 0", res['results'][0]);

        this.data = {
          Parameter: [
            {
              subcatId: '',
              subcategory: "",
              AddingValues: []
            }
          ]
        }
        const arr = <FormArray>this.form.controls.Parameter;
        arr.controls = [];
        while (this.Parameter.length !== 0) {
          this.Parameter.removeAt(0)
        }
        // THIS DATA WILL COME FROM DATABASE=======================
        let imageObj = {};
        imageObj['image_name'] = res["results"][0].image_name;
        imageObj['image_type'] = res["results"][0].image_type;
        imageObj['category_src'] = res["results"][0].category_src;
        imageObj = Object.assign([], imageObj);
        this.form.get('uploadfile').clearValidators();
        this.form.patchValue({
          categoryName: res['results'][0].name,
          description: res['results'][0].description,
          uploadfile: imageObj
        })

        this.imageArrayEdit = imageObj;
        console.log("=>", this.imageArrayEdit['category_src'])
        console.log(imageObj);
        this.S3imagename = imageObj['image_name'].substring(imageObj['image_name'].indexOf('_') + 1, imageObj['image_name'].length);
        this.form.get('uploadfile').setValidators([Validators.required]);
        this.S3image = true;
        // sub category starts here
        console.log("res['results'][0].subCatArray", res['results'][0].subCatArray[0].AddingValues)
        for (var i = 0; i < res['results'][0].subCatArray.length; i++) {
          var resObj = res['results'][0].subCatArray;
          var subCatName = resObj[i].name;
          var valueArray = [];

          var obj1 = {};
          var array1 = [];
          var obj2 = {};
          var array2 = [];
          var obj3 = {};
          for (var j = 0; j < resObj[i].AddingValues.length; j++) {
            var paramObj = {}
            paramObj['addvaluesname'] = resObj[i].AddingValues[j].addvaluesname;
            paramObj['itemID'] = resObj[i].AddingValues[j].id;
            valueArray.push(paramObj);
            var obj2 = {};
            obj2['itemName'] = resObj[i].AddingValues[j].addvaluesname;
            obj2['itemId'] = resObj[i].AddingValues[j].id;
            array1.push(obj2);
            obj1['itemsArray'] = array1;
          }
          this.data = {
            Parameter: [
              {
                subcatId: resObj[i].id,
                subcategory: subCatName,
                AddingValues: valueArray
              }
            ]
          }
          this.setCompanies();
          obj3['subCatName'] = resObj[i].name;
          obj3['subCatId'] = resObj[i].id;
          array2.push(obj3);
          obj1['SubcatArray'] = array2;
          this.Parameter1.push(obj1)
        }
        console.log("this.Parameter1===>", this.Parameter1)
        this._communicationservice.loader = false;
        // sub cat ends here
      } else {
	      if(res['statusCode'] === 401){
		      this.router.navigateByUrl('/login');
	      }else{
		    this._communicationservice.backendError = true;
	      }
      }
    })
  }

  commonCancel(){
    while (this.Parameter.length !== 0) {
      this.Parameter.removeAt(0)
    }
    this.form.reset();
    this.S3imagename = '';
    this.formerror = false;
    this.nosubCategories = false;
    this.subCatITemDuplicate = false;
    this.subCatDuplicate = false;
    this.error_in_adding_category = false;
    this.same_category = false;
    this.Parameter1 = [];
    this.deleteArrayItems = [];
    this.deletedOnlyItemArray = [];
    this.deletedSubCatArray = [];
    this.deletedOnlyItemArray = [];
    this.editBoolean = false;
    this.newObj = {};
    this.globalItemsDuplicate = false;
    this.checkItemsArray = [];
  }

  deleteSubPopNew() {
    this._communicationservice.backendError = false;
    console.log("subcat yes clicked")
    this.globalItemsDuplicate = false;
    this.checkItemsArray = [];
    this.formerror = false;
    this.nosubCategories = false;
    this.subCatITemDuplicate = false;
    this.subCatDuplicate = false;
    this.error_in_adding_category = false;
    this.same_category = false;
    // this.subCatDuplicate=false;
    let control = <FormArray>this.form.controls.Parameter;
    control.removeAt(this.localSubIndex);
    this.closeDialogClient();
    if (this.edit == true) {
      if (this.deletedsubcategoryId !== null) {
        for (var i = 0; i < this.Parameter1.length; i++) {
          for (var j = 0; j < this.Parameter1[i].SubcatArray.length; j++) {
            if (this.Parameter1[i].SubcatArray[j].subCatId === this.deletedsubcategoryId) {
              if (this.deleteArrayItems.length > 0) {
                let subcatpresent = false;
                Objtopush = {};
                Objtopush['itemsArray'] = [];
                Objtopush['id'] = this.Parameter1[i].SubcatArray[j].subCatId;
                for (let e = 0; e < this.deleteArrayItems.length; e++) {
                  if (this.deleteArrayItems[e].id === this.Parameter1[i].SubcatArray[j].subCatId) {
                    for (let w = 0; w < this.Parameter1[i].itemsArray.length; w++) {
                      Objtopush['itemsArray'].push(this.Parameter1[i].itemsArray[w].itemId);
                    }
                    this.deleteArrayItems.splice(e, 1, Objtopush);
                    subcatpresent = true;
                    break;
                  }
                }
                if (!subcatpresent) {
                  if (this.Parameter1[i].itemsArray !== undefined) {
                    for (let w = 0; w < this.Parameter1[i].itemsArray.length; w++) {
                      Objtopush['itemsArray'].push(this.Parameter1[i].itemsArray[w].itemId);
                    }
                  }
                  this.deleteArrayItems.push(Objtopush);
                }
              } else {
                this.deleteArrayItems = [];
                var Objtopush = {};
                Objtopush['itemsArray'] = [];
                Objtopush['id'] = this.Parameter1[i].SubcatArray[j]['subCatId'];
                if (this.Parameter1[i].itemsArray !== undefined) {
                  for (let w = 0; w < this.Parameter1[i].itemsArray.length; w++) {
                    Objtopush['itemsArray'].push(this.Parameter1[i].itemsArray[w].itemId);
                  }
                }
                this.deleteArrayItems.push(Objtopush);
              }
            }
          }
        }
      }

    }
    console.log("this.deleteArrayItems bottom=>", this.deleteArrayItems);
    // this.display_message_for_category_add = false;
    // this.displayAddNo = false;
    // this.subCategoryPop = false;
  }

  deleteNewValuesNew(control, index, addvalue, param) {
    console.log("TESTING ITEMID===-->", addvalue.controls.itemID.value);
    console.log("TESTIN SUBBCATEGORYID---r===--->", param.controls.subcatId.value);
    this.globalItemsDuplicate = false;
    this.checkItemsArray = [];
    this.formerror = false;
    this.nosubCategories = false;
    this.subCatITemDuplicate = false;
    this.subCatDuplicate = false;
    this.error_in_adding_category = false;
    this.same_category = false;
    control.removeAt(index);
    this.closeDialogClient();
    if (this.edit == true) {
      if (addvalue.controls.itemID.value !== null) {
        if (this.deleteArrayItems.length > 0) {
          let Objtopush = {};
          for (var i = 0; i < this.Parameter1.length; i++) {
            for (var j = 0; j < this.Parameter1[i].SubcatArray.length; j++) {
              if (this.Parameter1[i].SubcatArray[j].subCatId === param.controls.subcatId.value) {
                let ItemnotPresent = true;
                Objtopush['id'] = this.Parameter1[i].SubcatArray[j]['subCatId'];
                for (let q = 0; q < this.deleteArrayItems.length; q++) {
                  if (this.deleteArrayItems[q]['id'] === this.Parameter1[i].SubcatArray[j]['subCatId']) {
                    for (let w = 0; w < this.Parameter1[i].itemsArray.length; w++) {
                      if (this.Parameter1[i].itemsArray[w].itemId === addvalue.controls.itemID.value) {
                        this.deleteArrayItems[q]['itemsArray'].push(this.Parameter1[i].itemsArray[w].itemId);
                        this.deleteArrayItems[q]['InitialCounter'] += 1;
                        break;
                      }
                    }
                    ItemnotPresent = false;
                    break;
                  }
                }
                if (ItemnotPresent) {
                  for (let w = 0; w < this.Parameter1[i].itemsArray.length; w++) {
                    if (this.Parameter1[i].itemsArray[w].itemId === addvalue.controls.itemID.value) {
                      Objtopush['itemsArray'] = [];
                      Objtopush['itemsArray'].push(this.Parameter1[i].itemsArray[w].itemId);
                      Objtopush['InitialCounter'] = 1;
                      Objtopush['FinalCounter'] = this.Parameter1[i].itemsArray.length;
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
            for (var j = 0; j < this.Parameter1[i].SubcatArray.length; j++) {
              if (this.Parameter1[i].SubcatArray[j].subCatId === param.controls.subcatId.value) {
                Objtopush['id'] = this.Parameter1[i].SubcatArray[j]['subCatId'];
                for (let w = 0; w < this.Parameter1[i].itemsArray.length; w++) {
                  if (this.Parameter1[i].itemsArray[w].itemId === addvalue.controls.itemID.value) {
                    Objtopush['itemsArray'] = [];
                    Objtopush['itemsArray'].push(this.Parameter1[i].itemsArray[w].itemId);
                    Objtopush['InitialCounter'] = 1;
                    Objtopush['FinalCounter'] = this.Parameter1[i].itemsArray.length;
                    break;
                  }
                }
                this.deleteArrayItems.push(Objtopush);
              }
            }
          }
        }
      }
      console.log("this.deleteArrayItems==>", this.deleteArrayItems)
    }
    // this.display_message_for_category_add = false;
    // this.itemPop = false;
    // this.displayAddNo = false;
  }
}

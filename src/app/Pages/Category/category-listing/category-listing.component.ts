import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from 'node_modules/@angular/router';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { FormGroup, FormControl, Validators } from 'node_modules/@angular/forms';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { UploadfileService } from 'src/app/services/FileUpload/uploadfile.service';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.component.html',
  styleUrls: ['./category-listing.component.css']
})
export class CategoryListingComponent implements OnInit {
  @ViewChild('removeSubCategory') removeSubCategory: AddCategoryComponent;

  categorieslength;
  display_message_for_delete: boolean = false;
  displayopenclose: boolean = false;
  objdelete = {};

  cols: any[];
  categories: any[] = [];
  edit = false;
  displayDialog: boolean;
  Addparameteritem = false;
  dropdownvalue = [];
  ddvalue;
  isEdit = false;
  isListing = false;
  isDelete = false;
  isAdd = false;
  message;
  catpresent:boolean =false;
  norecords:boolean =false;

  constructor(private router: Router,
    public _communicationservice: CommunicateService,
    private _commonNodeCallService: CommonCallService,
    private uploadService: UploadfileService) { 
      var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
      sessionStorage.setItem('selectedFunctionality', 'Categories Master');
      if(!privillageArray){
        this.router.navigateByUrl('/login');
      }
      this._communicationservice.backendError = false;
    }

  ngOnInit() {
    
		this._communicationservice.loader =  true;
    this._commonNodeCallService.GetCategoryListing().subscribe(res => {
      this._communicationservice.loader =  false;
      //console.log(res);
      if(res['success']){
        if (res['results'].length > 0) {
          res['results'].forEach(element => {
            var categoryObj = {
              "id": element.id,
              "CategoryName": element.name,
              "Subcategory": element.subCatArray
            }
            this.categories.push(categoryObj);
          });
          this.categorieslength = this.categories.length;
        }
        else {
          this.norecords=true;
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
      { field: 'CategoryName', header: 'Category Name', width: '8%' },
      { field: 'Subcategory', header: 'Subcategory', width: '8%' },
      { field: 'Action', header: 'Action', width: '5%' },
      { field: 'AddItems', header: 'Add Parameters', width: '5%' },
    ];

    this._communicationservice.categorycancel.subscribe(data => {
      if (data == false) {
        this.displayaddnewvariant = false;
        this.edit = false;
      }
    });

    this._communicationservice.parametercancel.subscribe(data => {
      if (data == false) {
        this.parameter = false;
      }
    })

    this._communicationservice.addparameteritem.subscribe(data => {
      if (data == true) {
        this.Addparameteritem = true;
      }
    })
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
        if(!this.isDelete && !this.isEdit) {
          this.cols = [
            { field: 'CategoryName', header: 'Category Name', width: '10%' },
            { field: 'Subcategory', header: 'Subcategory', width: '8%' },
            { field: 'AddItems', header: 'Add Parameters', width: '8%' },
          ];
        }
      }
    }
  }


  addInputValue(data) {
    if (data != "" && data != null) {
      this.dropdownvalue.push(data);
      this.ddvalue = "";
    }
  }
  removeinputvalue(data) {
    var i = this.dropdownvalue.indexOf(data);
    this.dropdownvalue.splice(i, 1);
  }
  Cancelddvalue() {
    this.Addparameteritem = false;
  }
  Submitddvalue(data) {
    this.Addparameteritem = false;
  }
  editCategoryData(dt,index) {
    const catData=dt.filteredValue?dt.filteredValue:this.categories;     
    this._communicationservice.loader = true;
    this._communicationservice.CategoryData(catData[index].id);
    this.displayaddnewvariant = true;
  }
  onItemSelect(item: any) {
   // console.log(item);
  }
  onSelectAll(items: any) {
   // console.log(items);
  }
  Close() {
    this.displayDialog = false;
  }
  closeAdd() {
    this.displayaddnewvariant = false;
  }
  delete(dt,index) {
    const catData=dt.filteredValue?dt.filteredValue:this.categories;     
    this.objdelete = { id: catData[index].id }
    this.displayopenclose = true;
  }
  displayaddnewvariant: boolean;
  showDialogToAdd() {
    this._communicationservice.CategoryData("");
    this.displayaddnewvariant = true;
    this.removeSubCategory.removeParam();

  }
  parameter = false;
  Addparameter(dt,index) {
    const catData=dt.filteredValue?dt.filteredValue:this.categories;     
    var catobj={id:catData[index].id,CategoryName:catData[index].CategoryName}
    this._communicationservice.getParameterInfo(catobj)
    // session code
    var privillageArray = JSON.parse(sessionStorage.getItem('privillageArray'))
    sessionStorage.setItem('selectedFunctionality', 'Add Parameter');
    if(!privillageArray){
      this.router.navigateByUrl('/login');
    }
    this.parameter = true;
  }
  Viewparameter() {
    this.parameter = true;
    this._communicationservice.ViewParameter(true);
  }

  form = new FormGroup({
    DropDownvalue: new FormControl('', [
      Validators.required
    ])
  })

  get DropDownvalue() {
    return this.form.get('DropDownvalue');
  }

  okMessageForDelete() {
    this._communicationservice.backendError = false;
    this.display_message_for_delete = false;
    window.location.reload();
  }


  showOpenCloseDialog() {
    this.displayopenclose=false;
    this._communicationservice.loader =true;
    this._commonNodeCallService.DeleteCategory(this.objdelete).subscribe(res => {
      console.log(res);
      if(res['success']){
        // delete from s3
        console.log("res['results'] !==",res['results'] !== "")
        console.log("res['results'] !==",res['results'])
        if(res['results'] !== ""){
          const filePath = res['results'];
          console.log("filePath==>",filePath)
          const selectedFiles = [];
          const deleteOptParam ={};
        this.uploadService.deleteFile(selectedFiles, deleteOptParam, filePath, respDel => {
      this._communicationservice.loader =false;
          if (respDel['success']) {
          this.display_message_for_delete = true;
          this.message = res["message"];							
          }else{
          // this.message = "Error Occured while Deleting image" 
          this._communicationservice.backendError = true;
          }
        })
        }else{
          this.displayopenclose = false;
          this.display_message_for_delete = true;
          this.message = res['message'];
          // **KEPT FOR TESTING..REMOVE UPPER AND UNCOMMENT BELOW AFTER PROPER DATA TESTING**
          // this._communicationservice.backendError = true;
        }
        // 
      }
      else if(res['catpresent']){
      this._communicationservice.loader =false;
        this.displayopenclose = false;
        this.display_message_for_delete = true;
        this.message = res['message'];
        this.catpresent=true;
      }else{
        if(res['statusCode'] === 401){
          this.router.navigateByUrl('/login');
        }else{
          this._communicationservice.loader =false;
        // console.log("error in database");
        // this.display_message_for_delete = true;
        // this.message = res['message'];
        this._communicationservice.backendError = true;
        }
      
      }

    });

  }

  closeOpenCloseDialog() {
    this.displayopenclose = false;
  }
  closeDisplay_message_for_delete(){
    this._communicationservice.backendError = false;
    this.catpresent=false;
    this.display_message_for_delete=false;
  }
}

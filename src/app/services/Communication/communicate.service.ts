import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
@Injectable({
  providedIn: 'root'
})
export class CommunicateService {
  /**Common Error Popup */
  public commonErrorPopup ; // true or false to activate Popup 
  public commonErrorPopupMsg = 'Application Error Please Contact System Administrator'; // error msg 
  public reDirectionURL = ''; // url to redirect
  /**Common Error Popup */
  public productCost = 0; /*For Product Cost*/
  public ProjectJourney;
  public AddBOQSetHtml;
  public BOQAdd = false;
  public BOQEdit = false;
  public paramList = [];
  public projectSpecificBOQData = {};
  public Prodsku_previewDescriptionerror;
  public subjectobj = new Subject<any>();
  public clientData = new Subject<any>();
  public vendorData = new Subject<any>();
  public clientedit = new Subject<any>();
  public clientupdate = new Subject<any>();
  public employeecancel = new Subject<any>();
  public employeeupdate = new Subject<any>();
  public employeesubmit = new Subject<any>();
  public vendorcancel = new Subject<any>();
  public vendorUpdate = new Subject<any>();
  public vendorSubmit = new Subject<any>();
  public manageprivilage = new Subject<any>();
  public rolesdata = new Subject<any>();
  public categorycancel = new Subject<any>();
  public categorydata = new Subject<any>();
  public parametercancel = new Subject<any>();
  public addparameteritem = new Subject<any>();
  public purchaseitemdata = new Subject<any>();
  public viewparamter = new Subject<any>();
  public productcancel = new Subject<any>();
  public productupdate = new Subject<any>();
  public productdetaildata = new Subject<any>();
  public productdescdata = new Subject<any>();
  public email = new Subject<any>();
  public parameterinfo = new Subject<any>();
  public boqcancel = new Subject<any>();
  public boqinfo = new Subject<any>();
  public functionalities_to_display = [];
  public selected_Functionality = "";
  public privillageArray =[];
  public paramDetails = [];
  public globalStrDropDown =[];
  public functionalityArray=[];
  public backendError :boolean = false;
  public backendMsg = 'Internal Server Error.Please Contact Sytem Admin';

  addnewClientJourney = "clientJourney";
  /**Regular Expression */
  pattern = {
    alphanumericWithSpacehyphen:'^[A-Za-z0-9\\-\\s]*$',
    alphanumericWithSpace:'^[a-zA-Z0-9\\s]*$',
    alphanumericWithUnderscore:'^[A-Za-z0-9_]*$',
    alphanumeric:'^[a-zA-Z0-9]*$',
    pincode:'^[1-9][0-9]{5}$',
    onlychar:'a-zA-Z]*$',
    onlycharWithSpace:'^[a-zA-Z\\s\']*$',
    emailAddress:'^[A-Za-z0-9]+?[A-Za-z0-9._]*@{1}[a-zA-Z_]*.+[a-zA-Z]{2,3}$',
    mobileNo:'^[789][0-9]{9}$',
    numeric:'^[0-9]*$',
    decimal:'^[0-9]*.[0-9]*?$',
    unit:'^[0-9]+([.0-9]?)+\\s?[A-Za-z]*$',
    gstin:'[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9][Z]{1}[A-Z0-9]{1}',
    alphanumericWithSpaceApostrophe:'^[a-zA-Z0-9\\s\']*$',
    // numericWithDecimal:'[0-9]+(\.[0-9][0-9]?)?'
    // numericWithDecimal:'^[1-9]\d*$'
    numericWithDecimal:'[+-]?([0-9]*[.])?[0-9]+',
    decimalwithcommas:'^[0-9]+([\,][0-9]+)*([\.][0-9][0-9])?$'
    // decimalwithcommas:'^[0-9\,]*.[0-9]*?$'
    }
     /**Regular Expression */
  /**Loader */
  LoaderMsg = '';
  redirect = false
  loader = false;
  /**Loader */

  /**BOQ Detail page Json Variables */
  categoryDetailedJson = [];
  /**BOQ Detail page Json Variables */

  public projectid = new Subject<any>();  

  myMethod$: Observable<any>;
  subjectobjemp = new Subject<any>();
  clientSubject  = new Subject<any>();
  clientSubjectId ='';

  constructor() { 
    this.AddBOQSetHtml=false;
  }

  saveData(data) {
    this.subjectobj.next(data);
  }

  clientdata(data) {
    this.clientData.next(data);
  }

  vendordata(data) {
    this.vendorData.next(data);
  }

  ClientEdit(data) {
    this.clientedit.next(data);
  }

  ClientUpdate(data) {
    this.clientupdate.next(data);
  }

  EmployeeCancel(data) {
    this.employeecancel.next(data);
  }
  Employeeupdate(data) {
    this.employeeupdate.next(data);
  }
  EmployeeSubmit(data) {
    this.employeesubmit.next(data);
  }
  VendorCancel(data) {
    this.vendorcancel.next(data);
  }
  VendorUpdate(data) {
    this.vendorUpdate.next(data);
  }
  VendorSubmit(data) {
    this.vendorSubmit.next(data);
  }

  PrivilageCancel(data) {
    this.manageprivilage.next(data);
  }
  RoleasData(data) {
    this.rolesdata.next(data);
  }
  CategoryCancel(data) {
    this.categorycancel.next(data);
  }
  CategoryData(data) {
    this.categorydata.next(data);
  }

  ParameterCancel(data) {
    this.parametercancel.next(data);
  }

  AddParameterItem(data) {
    this.addparameteritem.next(data);
  }
  PurchaseItemData(data) {
    this.purchaseitemdata.next(data);
  }
  ViewParameter(data) {
    this.viewparamter.next(data);
  }
  CancelProduct(data) {
    this.productcancel.next(data);
  }
  UpdateProduct(data) {
    this.productupdate.next(data);
  }
  ProductDetailedData(data) {
    this.productdetaildata.next(data);
  }
  ProductDescriptionDate(res) {
    console.log(res)
    this.productdescdata.next(res);
  }

  /**Added by Amol for BoQ */
  BoQcancel(data) {
    this.boqcancel.next(data);
  }
  /**Added by Amol for BoQ */
  // getting percentage values
  //   export class User {
  // 	num3: number;
  // } 
  // createUser(user: User) {
  //   console.log('Number-3: ' + user.num3);
  // }
  commEmail;
  commPassword;
  saveEmail(data) {
    console.log("saved in communicationservice >>>" + data.username);
    // this.email.next(data.username);
    // console.log(this.email);	         
    this.commEmail = data.username;
    console.log("storing email in communication service >>>" + this.commEmail);
    this.commPassword = data.password;
    console.log("storing password communication service >>>" + this.commPassword);

  }

  getStatus() {
    // setTimeout(this.toggleView.bind(this));
    return this.email.asObservable();
  }
  user_id;
  getUserId(data) {
    this.user_id = data
    console.log("saving userid in com service" + this.user_id);
  }

  getBoqInfo(data) {
    this.boqinfo.next(data);
  }
  getParameterInfo(data) {
    this.parameterinfo.next(data);
  }

  saveProjectId(data){
    this.projectid.next(data);
  }

  /** Added by Amol */
  /**Convert procedure json into required format json */
  setJson(jsondata,replaceArray,deleteArray) {
    if(replaceArray.length === deleteArray.length){
      for(let i = 0;i < replaceArray.length;i++) {
        if(jsondata.hasOwnProperty([deleteArray[i]])) {
          jsondata[replaceArray[i]] = JSON.parse(JSON.stringify(jsondata[deleteArray[i]]));
          delete jsondata[deleteArray[i]];
        }
      }
    }
    return jsondata;
  }
  /** Added by Amol */

  saveDataEmp(data) {
    this.subjectobjemp.next(data);
  }
  checkClient(data){
    this.clientSubject.next(data)
  }
  // saveClientId(data){
  //   console.log(" client id in service",data);
  //   this.clientSubjectId.next(data);
  // }
  removeCommas(x){
    if(x !== null){
      // return x.toString().replace(/[$,]/g, "");
      var newnum = x.toString().replace(/[$,]/g, "");
      return Number(newnum);
    }else{
      return x;
    }
  }
}

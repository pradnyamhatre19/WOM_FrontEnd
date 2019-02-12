import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FrontEndValidationService {

  constructor() { }


  BlurValidation(type, value) {
    let ValidreturnArray = [];
    if ('Name' === type) {

    } else if ('Email' === type) {
      let letterRegx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!letterRegx.test(value)) {
        ValidreturnArray['msg'] = 'Please Enter Valid Email Address';
        ValidreturnArray['validationFlag'] = true;
        ValidreturnArray['type'] = 'other';
      } else if (letterRegx.test(value)) {
        ValidreturnArray['validationFlag'] = false;
        ValidreturnArray['type'] = 'other';
        ValidreturnArray['msg'] = '' ;
      }
      return ValidreturnArray;
    }  else if ('Mobile' === type) {
      if (value.length < 10) {
        ValidreturnArray['msg'] = 'Please Enter 10 Digit Mobile Number';
        ValidreturnArray['validationFlag'] = true;
      } 
      return ValidreturnArray;
    }
  }

  KeyUpValidation(type, value) {
    if ('number' === type) {
      value = value.replace(/[^0-9$]/g, '');
      return value;
    }
  }
 
  KeyUpValidationfordecimal(type, value) {
    if ('number' === type) {
      value = value.replace(/[^0-9.]/g, "");  
      return value;
    }
  }
  keyUpMultipleSpaceValidation(value){
    value = value.replace(/\s\s+/g, ' ');
    return value;
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { serviceUrls } from '../../../common/serviceUrl';
// import 'rxjs/add/operator/map';
import { map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router :Router,private http: HttpClient) { }

  // checkCredentials(credentials){
  //   if(credentials.username=='admin@gmail.com' && credentials.password=='1234')
  //   {
  //     return true;
  //   }else return false;
  // }

  validateLogin(body){
    // return this.http.post(serviceUrls.login,body)
    return this.http.post(serviceUrls.Login,body)    
  }
  
  changePassword(body){
    console.log("inside Login serviceUrls.ts");    
    return this.http.post(serviceUrls.ChangePassword,body)
  }
  
}

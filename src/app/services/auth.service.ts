import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  //for authentication
  loggedIn(){
  return !!localStorage.getItem('token')     // !! means it returns either true or false
  }
  
  //for interceptors
  getToken (){
    return localStorage.getItem('token')    // now go to tokeninterceptorsservice  
  }
}

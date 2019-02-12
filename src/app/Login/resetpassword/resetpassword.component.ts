import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {CommonCallService} from '../../services/CommonNodeCall/common-call.service';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})

export class ResetpasswordComponent implements OnInit {
 
  constructor(private router:Router,  private _commonNodeCallService: CommonCallService,public _communicationService:CommunicateService) {
    this._communicationService.backendError = false;
   }

  ngOnInit() {
  }

  form = new FormGroup({
		email: new FormControl('', [
      Validators.required,
      Validators.pattern(this._communicationService.pattern.emailAddress)
		])
  })
  
  reset(data){
   
    //this.router.navigate(['/login']);
    if(this.form.valid){
      console.log("data",data)
      this._commonNodeCallService.ForgotPassword(data).subscribe(res => {
        if(res['success']){
          this.router.navigate(['/login']);
        }else{
        this._communicationService.backendError = false;          
        }
      });

    }else{
      console.log("data invalid")
    }

  }
  cancel(){
    this._communicationService.backendError = false;
    this.form.reset();
    this.router.navigate(['/login']);
  }
  onkeyDownAllFields() {
    this._communicationService.backendError = false;
  }
}

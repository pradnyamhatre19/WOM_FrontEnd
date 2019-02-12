import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/Login/login.service';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
//import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	message;
	invalidate: Boolean = false;
	privilege: Boolean = false;

	constructor(private router: Router,
		private _loginservice: LoginService,
		public _communicationservice: CommunicateService,
		private _CommonCallService: CommonCallService,
		private _authservice :AuthService )
		 {
			this._communicationservice.backendError = false;
		 }

	ngOnInit() {
	}
	title = 'app';

	reset() {
		this.router.navigate(['/resetpassword']);
	}
	form = new FormGroup({
		username: new FormControl('', [
			Validators.required
		]),
		password: new FormControl('', [
			Validators.required
		])
	})

	get username() {
		return this.form.get('username');
	}
	get password() {
		return this.form.get('password');
	}

	formerror: boolean;
	functionalityName = [];
	validate(credentials) {
		if (this.form.invalid) {
			this.formerror = true;
		} else {
			this._communicationservice.loader = true;
			this._loginservice.validateLogin(credentials).subscribe(res => {
				this._communicationservice.loader = false;
				if (res['success']) {
					//  AUTHENTICATION CODE ***
					localStorage.setItem('token',res['results'][0].token)
					this._authservice.loggedIn();
					// AUTHENTICATION CODE ENDS HERE ***

					// storing data in session storage
					sessionStorage.setItem('userid', res['results'][0].user_id);
					sessionStorage.setItem('userinfo', JSON.stringify(res['results']));
					
					this._CommonCallService.GetPrivileges(res['results'][0].user_id).subscribe(res => {
						var functionalityArray =[] 
						if(res['success']){
							if(res['results'].length > 0){
								for (var i = 0; i < res['results'].length; i++) {
									var obj = {}
									obj['id'] = res['results'][i].functionality_id;
									obj['fname'] = res['results'][i].fname;
									obj['flag'] = res['results'][i].flag;
									this.functionalityName.push(obj)
									functionalityArray.push(obj)
									if(res['results'].length-1 === i) {
										this.router.navigate(['/Project']);
									}
								}
								sessionStorage.setItem('functionalityArray',JSON.stringify(functionalityArray))
								this._communicationservice.functionalityArray = this.functionalityName;
								sessionStorage.setItem('privillageArray', JSON.stringify(res['results']))
								this._communicationservice.privillageArray = res['results'];
								this._communicationservice.functionalities_to_display = this.functionalityName;
							}else{
								// msg for no previlege
								this.privilege = true;
							}
						}else{
							this._communicationservice.backendError = true;
						}
					})
					//saving logininformation in service          
					this._communicationservice.saveEmail(credentials);
					// saving userid in communication service
				} else {
					if(res['statusCode'] === 500){
						this._communicationservice.backendError = true;
					}else{
					this.invalidate = true;
					}
				}
				this.message = res['message'];

			});
		}



	}
	onkeyDownAllFields() {
		this._communicationservice.backendError = false;
		this.invalidate = false;
		this.formerror = false;
		this.privilege = false;
	}
}

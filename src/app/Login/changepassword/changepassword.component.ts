import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidators } from '../../../common/password.validators';
import { LoginService } from 'src/app/services/Login/login.service';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';


@Component({
	selector: 'app-changepassword',
	templateUrl: './changepassword.component.html',
	styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
	successfullpasswordchange: boolean = true;
	oldpasswordnotmatched: boolean = false;
	message : String;
	form: FormGroup;
	display_message_popup:boolean =false;

	constructor(fb: FormBuilder, private _loginservice: LoginService,
			public _communicationservice: CommunicateService,
				private router:Router) {
		this.form = fb.group({
			oldPassword: ['',
				Validators.required
			],
			newPassword: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		}, {
				validator: PasswordValidators.passwordsShouldMatch
			});

			this._communicationservice.backendError = false;
	}

	get oldPassword() { return this.form.get('oldPassword'); }
	get newPassword() { return this.form.get('newPassword'); }
	get confirmPassword() {
		return this.form.get('confirmPassword');

	}

	ngOnInit() {
		console.log("changepassword page opened");
	}

	formerror: boolean = false;


	changePassword(credentials) {
		
		if (this.form.invalid) {
			this.formerror = true;
		} else {
			this.formerror = false;
			credentials.userid = sessionStorage.getItem('userid');
			console.log(credentials);

			this._loginservice.changePassword(credentials).subscribe(res => {
				console.log(res);
				console.log("checking success => " + res['success']);

				if (res['success']) {
					// console.log("password changed successfully");
					if(res['oldpasswordmatched']){
						this.successfullpasswordchange = true;
						this.display_message_popup =true;
						this.message = res['message'];
					}else{
						this.successfullpasswordchange = false;
						this.message = res['message'];
					}
				}
				else {
				// Internal error
				// this.display_message_popup =true;
				// this.message = res['message'];
				if(res['statusCode'] === 401){
					this.router.navigateByUrl('/login');
				}else{
					this._communicationservice.backendError = true;
				}
				}
			});
		}
	}

	cancel(){
		this.successfullpasswordchange = true;
		this.oldpasswordnotmatched = false;
		this._communicationservice.backendError = false;
		this.formerror = false;
		this.form.reset();
		this.router.navigateByUrl('/dashboard');
	}
	okMsg(){
		this.form.reset();
		this.successfullpasswordchange = true;
		this.formerror = false;
		this.display_message_popup =false;
		this._communicationservice.backendError = false;
		this.router.navigateByUrl('/dashboard');
	}
	onkeyDownAllFields() {
		this._communicationservice.backendError = false;
		this.formerror =false;
		this.successfullpasswordchange = true;
		this.oldpasswordnotmatched = false;
	}
}

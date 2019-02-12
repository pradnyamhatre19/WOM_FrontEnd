import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';

@Component({
	selector: 'header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	constructor(private router: Router,
		private _communicationservice: CommunicateService) { }


	functionalityName = []
	userName; 
	ngOnInit() {
		var UserId = sessionStorage.getItem('userid')
		var userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
		//console.log("userinfo==",userinfo)
		if(userinfo){
			this.userName = userinfo[0]['name']
			var functionalityArray = JSON.parse(sessionStorage.getItem('functionalityArray'))
			for(var i=0; i<functionalityArray.length; i++){
				var obj = functionalityArray[i];
				//console.log("obj===",obj)
				if(obj.flag === 'm'){
					this.functionalityName.push(obj)
				}

			}
		}
		
	}
	ngDoCheck(){
		var userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
		// var functionalityArray = JSON.parse(sessionStorage.getItem('functionalityArray'))
		// for(var i=0; i<functionalityArray.length; i++){
		// 	var obj = functionalityArray[i];
		// 	console.log()
		// 	this.functionalityName.push(obj)
		// }
	}

	gotoDashboard() {
		this.router.navigateByUrl('/dashboard');
	}
	logout() {
		sessionStorage.clear();
		localStorage.removeItem('token');
		this.router.navigateByUrl('/login');
	}
	ClickedFunctionality(data) {
		//console.log("data==",data)
		this._communicationservice.selected_Functionality = data;
		sessionStorage.setItem('selectedFunctionality', data);

		if (data == 'Employees Master') {
			this.router.navigateByUrl('/employee');
		}
		else if (data == 'Clients Master') {
			this.router.navigateByUrl('/client');
		}
		else if (data == 'Vendors Master') {
			this.router.navigateByUrl('/vendor');
		}
		else if (data == 'Manage Roles') {
			this.router.navigateByUrl('/ManageRoles');
		}
		else if (data == 'Categories Master') {
			this.router.navigateByUrl('/category');
		}
		else if (data == 'Products Master') {
			this.router.navigateByUrl('/product');
		}
		else if (data == 'Project') {
			this.router.navigateByUrl('/Project');
		}
	}
	
}

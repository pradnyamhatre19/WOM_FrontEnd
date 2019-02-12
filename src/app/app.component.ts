import { CommunicateService } from './services/Communication/communicate.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LoaderComponent } from './Shared/Components/loader/loader.component';
import { Spinkit } from 'ng-http-loader';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
	showHead: boolean = false;
	public loader = LoaderComponent;
	public spinkit = Spinkit;
	ngOnInit() { }
	constructor(private router: Router,public communicationservice:CommunicateService) {
		// on route change to '/login', set the variable showHead to false
		// router.events.forEach((event) => {
		// 	if (event instanceof NavigationStart) {
		// 		console.log("event['url']==", event['url'])
		// 		if (event['url'] == '/login' || event['url'] == '/' || event['url'] == '/resetpassword') {
		// 			this.showHead = false;
		// 		} else {
		// 			// console.log("NU")
		// 			this.showHead = true;
		// 		}
		// 	}
		// });
	}

	ngDoCheck(){
		this.router.events.forEach((event) => {
			if (event instanceof NavigationStart) {
				console.log("event['url']==", event['url'])
				if (event['url'] == '/login' || event['url'] == '/' || event['url'] == '/resetpassword') {
					this.showHead = false;
				} else {
					// console.log("NU")
					this.showHead = true;
				}
			}
		});
	}
}

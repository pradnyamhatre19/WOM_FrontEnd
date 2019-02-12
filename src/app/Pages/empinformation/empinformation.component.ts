import { Component, OnInit } from '@angular/core';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { FormGroup, FormControl, Validators } from 'node_modules/@angular/forms';

@Component({
    selector: 'app-empinformation',
    templateUrl: './empinformation.component.html',
    styleUrls: ['./empinformation.component.css'],
})
export class EmpinformationComponent implements OnInit {

    constructor() { }

    userName;
    emailId;
    departmentname;
    designation;
    mobileno;
    phoneNum;
    sbuNo;


    ngOnInit() {
        var userInfoObj = JSON.parse(sessionStorage.getItem('userinfo'))
        console.log("userInfoObj", userInfoObj)
        //console.log("userInfoObj==",userInfoObj[0]['user_id'])
        this.userName = userInfoObj[0]['name'];
        this.emailId = userInfoObj[0]['email'];
        this.departmentname = userInfoObj[0]['dept_name'];
        this.designation = userInfoObj[0]['desg_name'];
        this.mobileno = userInfoObj[0]['mobile'];
        this.phoneNum = userInfoObj[0]['phone'];
        this.sbuNo = userInfoObj[0]['sbu_name'];
    }



}

import { Router } from '@angular/router';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css']
})
export class ErrorPopupComponent implements OnInit {

  constructor(public communicationservice:CommunicateService, private router:Router) { }

  ngOnInit() {
  }

  onclick() {
    this.communicationservice.commonErrorPopup = false;
      if(this.communicationservice.redirect){
       this.router.navigate([this.communicationservice.reDirectionURL])
      }else {
        window.location.reload();
      }
  }

}

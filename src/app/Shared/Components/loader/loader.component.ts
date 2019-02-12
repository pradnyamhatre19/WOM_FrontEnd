import { Component, OnInit } from '@angular/core';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor(public communicateService:CommunicateService) { }

  ngOnInit() {
  }

}

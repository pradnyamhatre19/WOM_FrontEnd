import { Component, OnInit } from '@angular/core';
import { CommonCallService } from 'src/app/services/CommonNodeCall/common-call.service';
import { CommunicateService } from 'src/app/services/Communication/communicate.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    myVariable = 0
    colsplanning: any[];
    dashboardtabledata: any[] = [];
    norecords: boolean = false;
    userId;
    chartOptions;
    dashboardtabledatalength;
    //pie 
    data: any;
    // graph
    databar: any;

    constructor(private _commonNodeCallService: CommonCallService,
        public commonService: CommunicateService,
        private router: Router) {
        this.commonService.loader = true;
        this.commonService.backendError = false;

        this.colsplanning = [
            { field: 'Sr.No', header: 'Sr.No', width: '10%' },
            { field: 'Project Name', header: 'Project Name', width: '20%' },
            { field: 'BOQName', header: 'BOQ Name', width: '20%' },
            { field: 'Query Title', header: 'Query Title', width: '20%' },
            { field: 'Response Date', header: 'Response Date', width: '20%' }
        ];

        var obj = {};
        obj['userId'] = sessionStorage.getItem('userid');

        this._commonNodeCallService.GetDashboardTable(obj).subscribe(res => {
            console.log("dashboard listing with data", res)
            this.commonService.loader = false;
            if (res['success']) {
                if (res['results'].length > 0) {
                    res['results'].forEach((element, index) => {
                        var newDate = new Date(element.responseDate);
                        var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
                        var curr_date = newDate.getDate();
                        var curr_year = newDate.getFullYear();
                        var curr_month = months[newDate.getMonth()];
                        var localDate = curr_date + "/" + curr_month + "/" + curr_year;

                        var dashObj = {
                            "Sr.No": index + 1,
                            "Project Name": element.projectName,
                            "BOQName": element.boqName,
                            "Query Title": element.queryTitle,
                            "Response Date": localDate,
                            "projectId": element.projectId,
                            "boqId": element.boqId,
                            "queryId": element.queryId
                        }
                        this.dashboardtabledata.push(dashObj);
                    });
                    console.log("this.dashboardtabledata" + JSON.stringify(this.dashboardtabledata))
                    this.dashboardtabledatalength = this.dashboardtabledata.length;
                    console.log("dashboard table length length", this.dashboardtabledatalength)
                }
                else {
                    console.log("No records to display here");
                    this.norecords = true;
                }
            } else {
                if(res['statusCode'] === 401){
                    this.router.navigateByUrl('/login');
                }else{
                    this.commonService.backendError = true;
                }
            }

        }, err => {
            if (err instanceof HttpErrorResponse) {
                console.log("rohit token interceptor error check",err);
            }
        })

        //   bar graph
        this._commonNodeCallService.GetBarGraphDetails().subscribe(res => {
            console.log("res", res);
            if(res['success']){
                this.databar = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'october', 'November', 'December'],
                    datasets: [
                        {
                            label: 'BOQ Drafts',
                            backgroundColor: '#42A5F5',
                            borderColor: '#1E88E5',
                            data: res['results'].draftArray
                        },
                        {
                            label: 'BOQ Final',
                            backgroundColor: '#9CCC65',
                            borderColor: '#7CB342',
                            data: res['results'].finalArray
                        }
                    ]
                };
            }else{
                if(res['statusCode'] === 401){
                    this.router.navigateByUrl('/login');
                }else{
                    this.commonService.backendError = true;
                }
            }
        })

        this.chartOptions = {
            scales: {
                yAxes: [{
                    ticks: {
                        stepSize: 5,
                        beginAtZero: true
                    }
                }]
            }
        }

        //   pie chart
        this.data = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
        };


    }
    ngOnInit() {
    }

    onRowSelect(event) {
        console.log(event);
        console.log("queryId", event.data.queryId);
        console.log("boqId", event.data.boqId);
        console.log("projectId", event.data.projectId);
    }

    linkClicked(dt, index) {
        console.log("dt,index", dt, index);
        console.log("this.dashboardtabledata", this.dashboardtabledata)
        let tempObj = {};
        tempObj['boqId'] = this.dashboardtabledata[index].boqId;
        tempObj['boqName'] = this.dashboardtabledata[index].BOQName;
        tempObj['BoqDetailAction'] = 'Edit';
        console.log("tempObj", tempObj)
        sessionStorage.setItem('boqDetails', JSON.stringify(tempObj));
        this.router.navigateByUrl('/Project/BOQ/BOQDetailPage/create_project_estimate');
    }
}

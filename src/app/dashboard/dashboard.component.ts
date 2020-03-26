import { Component, OnInit } from '@angular/core';
import { HopkinsDataService } from '../domain/hopkins-data.service';
import { CaseNumbers } from '../domain/caseNumbers';
import { Observable, from } from 'rxjs';
import * as moment from 'moment';
import { groupBy } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public CaseNumbers: Observable<Array<CaseNumbers>>;

  constructor(private hopkinsService: HopkinsDataService) { }

  ngOnInit(): void {

    this.CaseNumbers = this.hopkinsService.getByDay(moment().subtract(1, 'day'));
    this.CaseNumbers.subscribe(x => console.log(x.length));

  }

}

import { Component, OnInit } from '@angular/core';
import { HopkinsDataService } from '../domain/hopkins-data.service';
import { CaseNumbers } from '../domain/caseNumbers';
import { Observable, from, of, zip, concat } from 'rxjs';
import * as moment from 'moment';
import { groupBy, mergeAll, scan, flatMap, single, first, mergeMap, map, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public CaseNumbers: Array<CaseNumbers>;

  constructor(private hopkinsService: HopkinsDataService) { }

  ngOnInit(): void {

    this.CaseNumbers = new Array<CaseNumbers>();
    this.hopkinsService.getByDay(moment().subtract(1, 'day')).pipe(mergeAll(), groupBy(x => x.Country))
      .subscribe(group => {

        const aggregate = new CaseNumbers();
        group.forEach(x => {
          aggregate.Infected += x.Infected;
          if (!aggregate.Date) {
            aggregate.Date = x.Date;
          }
        });
        aggregate.Infected = 0;
        aggregate.Country = group.key;
        this.CaseNumbers.push(aggregate);
      });
  }

}

import { Component, OnInit } from '@angular/core';
import { HopkinsDataService } from '../domain/hopkins-data.service';
import { CaseNumbers } from '../domain/caseNumbers';
import { Observable, from, of, zip, concat, merge } from 'rxjs';
import * as moment from 'moment';
import { groupBy, mergeAll, scan, flatMap, single, first, mergeMap, map, toArray, filter } from 'rxjs/operators';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CaseAggregate } from '../domain/caseAggregate';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public dateA: moment.Moment;
  public dateB: moment.Moment;
  public aggregate: Array<CaseAggregate>;
  public countryFilter: string;

  constructor(private calendar: NgbCalendar,
    private hopkinsService: HopkinsDataService) {
  }

  ngOnInit(): void {
    this.countryFilter = 'Germany,US,China,United Kingdom,France';
    this.aggregate = [];
    this.addCaseNumbers(moment().subtract(1, 'day'), moment().subtract(2, 'day'));
  }

  public dateAChanged(selectedDate: NgbDateStruct) {
    this.dateA = this.toMoment(selectedDate);
    this.addCaseNumbers(this.dateA, this.dateB);
  }

  public dateBChanged(selectedDate: NgbDateStruct) {
    this.dateB = this.toMoment(selectedDate);
    this.addCaseNumbers(this.dateA, this.dateB);
  }

  private toMoment(ngDate: NgbDateStruct): moment.Moment {
    return moment(ngDate.day + '.' + ngDate.month + '.' + ngDate.year, 'DD.MM.YYYY');
  }

  private addCaseNumbers(targetDateA: moment.Moment, targetDateB: moment.Moment) {

    const queryA = this.hopkinsService.getByDay(targetDateA).pipe(map(x => { x.forEach(y => y.Date = targetDateA); return x; }));
    const queryB = this.hopkinsService.getByDay(targetDateB).pipe(map(x => { x.forEach(y => y.Date = targetDateB); return x; }));

    merge(queryA, queryB).pipe(mergeAll(), groupBy(x => x.Country))
      .subscribe(group => {

        const caseA = new CaseNumbers();
        const caseB = new CaseNumbers();
        const aggregate = new CaseAggregate();

        aggregate.a = caseA;
        aggregate.b = caseB;

        group.forEach(x => {

          aggregate.country = group.key;

          if (!caseA.Date) {
            caseA.Date = x.Date;
            caseA.Infected = 0;
            caseA.Country = group.key;
          }
          else if (caseA.Date === x.Date) {
            caseA.Infected += x.Infected;
          }
          else if (!caseB.Date) {
            caseB.Date = x.Date;
            caseB.Infected = 0;
            caseB.Country = group.key;
          }
          else if (caseB.Date === x.Date) {
            caseB.Infected += x.Infected;
          }
        });
        
        this.aggregate.push(aggregate);

      });
  }
}

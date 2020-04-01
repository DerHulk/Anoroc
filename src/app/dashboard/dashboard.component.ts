import { Component, OnInit } from '@angular/core';
import { HopkinsDataService } from '../domain/hopkins-data.service';
import { CaseNumbers } from '../domain/caseNumbers';
import { Observable, from, of, zip, concat } from 'rxjs';
import * as moment from 'moment';
import { groupBy, mergeAll, scan, flatMap, single, first, mergeMap, map, toArray, filter } from 'rxjs/operators';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public caseNumbersA: Array<CaseNumbers>;
  public caseNumbersB: Array<CaseNumbers>;

  public countryFilter: string;

  constructor(private calendar: NgbCalendar,
    private hopkinsService: HopkinsDataService) {
  }

  ngOnInit(): void {
    this.countryFilter = 'Germany,US,China,United Kingdom,France';
    this.addCaseNumbers('A', moment().subtract(1, 'day'));
    this.addCaseNumbers('B', moment().subtract(2, 'day'));
  }

  public dateAChanged(selectedDate: NgbDateStruct) {
    const targetDate = this.toMoment(selectedDate);
    this.addCaseNumbers('A', targetDate);
  }

  public dateBChanged(selectedDate: NgbDateStruct) {
    const targetDate = this.toMoment(selectedDate);
    this.addCaseNumbers('B', targetDate);
  }

  private toMoment(ngDate: NgbDateStruct): moment.Moment {
    return moment(ngDate.day + '.' + ngDate.month + '.' + ngDate.year, 'DD.MM.YYYY');
  }

  private addCaseNumbers(target: 'A' | 'B', targetDate: moment.Moment) {

    if (target === 'A') {
      this.caseNumbersA = [];
    }
    else {
      this.caseNumbersB = [];
    }


    this.hopkinsService.getByDay(targetDate).pipe(mergeAll(), groupBy(x => x.Country))
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

        if (target === 'A') {
          this.caseNumbersA.push(aggregate);
        }
        else {
          this.caseNumbersB.push(aggregate);
        }
      });
  }
}

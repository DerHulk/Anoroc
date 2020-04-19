import { Component, OnInit } from '@angular/core';
import { HopkinsDataService } from '../domain/hopkins-data.service';
import { CaseNumbers } from '../domain/caseNumbers';
import { Observable, from, of, zip, concat, merge } from 'rxjs';
import * as moment from 'moment';
import { groupBy, mergeAll, scan, flatMap, single, first, mergeMap, map, toArray, filter } from 'rxjs/operators';
import { NgbCalendar, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CaseAggregate } from '../domain/caseAggregate';
import { faCalendar, faGlobe } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public faCalendar = faCalendar;
  public faGloble = faGlobe;
  public dateA: NgbDateStruct;
  public dateB: NgbDateStruct;
  public aggregate: Array<CaseAggregate>;
  public countryFilter: string;
  public countrySearch: string;
  public countries: Array<string>;

  constructor(private calendar: NgbCalendar,
    private hopkinsService: HopkinsDataService) {
  }

  ngOnInit(): void {
    this.countries = this.hopkinsService.getCountrys();
    this.countryFilter = 'Germany,US,China,United Kingdom,France,';
    this.aggregate = [];

    const a = moment().subtract(1, 'day');
    const b = moment().subtract(2, 'day');

    this.dateA = new NgbDate(a.year(), a.month() + 1, Number.parseInt(a.format('DD'), 0));
    this.dateB = new NgbDate(b.year(), b.month() + 1, Number.parseInt(b.format('DD'), 0));

    this.dateChanged();
  }

  public dateChanged() {
    const mA = this.toMoment(this.dateA);
    const mB = this.toMoment(this.dateB);
    this.addCaseNumbers(mA, mB);
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
            caseA.Infected = x.Infected;
            caseA.Country = group.key;
          }
          else if (caseA.Date === x.Date) {
            caseA.Infected += x.Infected;
          }
          else if (!caseB.Date) {
            caseB.Date = x.Date;
            caseB.Infected = x.Infected;
            caseB.Country = group.key;
          }
          else if (caseB.Date === x.Date) {
            caseB.Infected += x.Infected;
          }

          if (caseA.Date > caseB.Date) {
            aggregate.diffInNumbers = caseA.Infected - caseB.Infected;
            aggregate.increaseInPercent = Math.round((caseA.Infected - caseB.Infected) / (caseB.Infected / 100));
          }
          else {
            aggregate.diffInNumbers = caseB.Infected - caseA.Infected;
            aggregate.increaseInPercent = Math.round((caseB.Infected - caseA.Infected) / (caseA.Infected / 100));
          }

        });

        this.aggregate.push(aggregate);

      });
  }

  public toogleCountryFilter(country: string) {

    const filtered = this.isFiltered(country);
    country = country + ',';

    if (filtered) {
      this.countryFilter = this.countryFilter.replace(country, '');
    }
    else {
      if (this.countryFilter.endsWith(',')) {
        this.countryFilter = this.countryFilter.concat(country);
      }
      else {
        this.countryFilter = country;
      }
    }
  }

  public isFiltered(country: string) {
    return this.countryFilter.includes(country);
  }
}

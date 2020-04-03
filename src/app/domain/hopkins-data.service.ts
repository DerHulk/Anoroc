import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { stringify } from 'querystring';
import { CaseNumbers } from './caseNumbers';
import { map, groupBy } from 'rxjs/operators';
import { Observable, from, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HopkinsDataService {

  constructor(private http: HttpClient) { }

  public getByDay(targetDate: moment.Moment): Observable<CaseNumbers[]> {

    const httpOptions: Object = { responseType: 'text' };
    const dateFormat = targetDate.format('MM-DD-YYYY');
    const url =
      `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${dateFormat}.csv`;

    return this.http.get<string>(url, httpOptions).pipe(map(x => this.FromCsvLines(x.split('\n'))));
  }

  private FromCsvLines(lines: Array<string>): Array<CaseNumbers> {

    const result = new Array<CaseNumbers>();
    lines.shift();
    lines.forEach(x => result.push(this.FromCsvLine(x)));

    return result;

  }

  private FromCsvLine(line: string): CaseNumbers {

    let item = new CaseNumbers();
    const fragments = line.split(',');

    // //FIPS,Admin2,Province_State,Country_Region,Last_Update,Lat,Long_,Confirmed,Deaths,Recovered,Active,Combined_Key

    item.Country = fragments[3];
    item.Infected = Number.parseInt(fragments[7]);

    return item;

  }
}

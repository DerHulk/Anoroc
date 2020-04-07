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

  public getCountrys(): Array<string> {
    return [
      'Canada',
      'United Kingdom',
      'China',
      'Netherlands',
      'Australia',
      'Sint Eustatius and Saba"',
      'Denmark',
      'France',
      'Afghanistan',
      'Albania',
      'Algeria',
      'Andorra',
      'Angola',
      'Antigua and Barbuda',
      'Argentina',
      'Armenia',
      'Austria',
      'Azerbaijan',
      'Bahamas',
      'Bahrain',
      'Bangladesh',
      'Barbados',
      'Belarus',
      'Belgium',
      'Belize',
      'Benin',
      'Bhutan',
      'Bolivia',
      'Bosnia and Herzegovina',
      'Botswana',
      'Brazil',
      'Brunei',
      'Bulgaria',
      'Burkina Faso',
      'Burma',
      'Burundi',
      'Cabo Verde',
      'Cambodia',
      'Cameroon',
      'Central African Republic',
      'Chad',
      'Chile',
      'Colombia',
      'Congo (Brazzaville)',
      'Congo (Kinshasa)',
      'Costa Rica',
      'Cote d Ivoire',
      'Croatia',
      'Cuba',
      'Cyprus',
      'Czechia',
      'Diamond Princess',
      'Djibouti',
      'Dominica',
      'Dominican Republic',
      'Ecuador',
      'Egypt',
      'El Salvador',
      'Equatorial Guinea',
      'Eritrea',
      'Estonia',
      'Eswatini',
      'Ethiopia',
      'Fiji',
      'Finland',
      'Gabon',
      'Gambia',
      'Georgia',
      'Germany',
      'Ghana',
      'Greece',
      'Grenada',
      'Guatemala',
      'Guinea',
      'Guinea-Bissau',
      'Guyana',
      'Haiti',
      'Holy See',
      'Honduras',
      'Hungary',
      'Iceland',
      'India',
      'Indonesia',
      'Iran',
      'Iraq',
      'Ireland',
      'Israel',
      'Italy',
      'Jamaica',
      'Japan',
      'Jordan',
      'Kazakhstan',
      'Kenya',
      'Korea',
      'Kosovo',
      'Kuwait',
      'Kyrgyzstan',
      'Laos',
      'Latvia',
      'Lebanon',
      'Liberia',
      'Libya',
      'Liechtenstein',
      'Lithuania',
      'Luxembourg',
      'MS Zaandam',
      'Madagascar',
      'Malawi',
      'Malaysia',
      'Maldives',
      'Mali',
      'Malta',
      'Mauritania',
      'Mauritius',
      'Mexico',
      'Moldova',
      'Monaco',
      'Mongolia',
      'Montenegro',
      'Morocco',
      'Mozambique',
      'Namibia',
      'Nepal',
      'New Zealand',
      'Nicaragua',
      'Niger',
      'Nigeria',
      'North Macedonia',
      'Norway',
      'Oman',
      'Pakistan',
      'Panama',
      'Papua New Guinea',
      'Paraguay',
      'Peru',
      'Philippines',
      'Poland',
      'Portugal',
      'Qatar',
      'Romania',
      'Russia',
      'Rwanda',
      'Saint Kitts and Nevis',
      'Saint Lucia',
      'Saint Vincent and the Grenadines',
      'San Marino',
      'Sao Tome and Principe',
      'Saudi Arabia',
      'Senegal',
      'Serbia',
      'Seychelles',
      'Sierra Leone',
      'Singapore',
      'Slovakia',
      'Slovenia',
      'Somalia',
      'South Africa',
      'South Sudan',
      'Spain',
      'Sri Lanka',
      'Sudan',
      'Suriname',
      'Sweden',
      'Switzerland',
      'Syria',
      'Taiwan*',
      'Tanzania',
      'Thailand',
      'Timor-Leste',
      'Togo',
      'Trinidad and Tobago',
      'Tunisia',
      'Turkey',
      'Uganda',
      'Ukraine',
      'United Arab Emirates',
      'Uruguay',
      'Uzbekistan',
      'Venezuela',
      'Vietnam',
      'West Bank and Gaza',
      'Western Sahara',
      'Zambia',
      'Zimbabwe'].sort();
  }

}

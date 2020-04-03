import { Pipe, PipeTransform } from '@angular/core';
import { CaseNumbers } from '../domain/caseNumbers';
import { CaseAggregate } from '../domain/caseAggregate';

@Pipe({
    name: 'countryFilter',
    pure: false
})
export class CountryFilterPipe implements PipeTransform {
    public transform(value: Array<CaseAggregate>, filter: string) {

        if (!filter) {
            return value;
        }

        return (value || []).filter(item => filter.split(',').some(country => item.country === country));
    }
}

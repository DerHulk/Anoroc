import { Pipe, PipeTransform } from '@angular/core';
import { CaseNumbers } from '../domain/caseNumbers';

@Pipe({
    name: 'countryFilter'
})
export class CountryFilterPipe implements PipeTransform {
    public transform(value: Array<CaseNumbers>, filter: string) {

        if (!filter) {
            return value;
        }

        return (value || []).filter(item => filter.split(',').some(country => item.Country === country));
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { CaseNumbers } from '../domain/caseNumbers';
import { CaseAggregate } from '../domain/caseAggregate';

@Pipe({
    name: 'stringFilter',
    pure: false
})
export class StringFilterPipe implements PipeTransform {
    public transform(value: Array<string>, filter: string) {

        if (!filter) {
            return value;
        }

        return (value || []).filter(item => item.toLowerCase().startsWith(filter));
    }
}

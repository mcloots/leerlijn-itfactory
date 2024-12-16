import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'semester'
})
export class SemesterPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    let returnValue = value.toString();
    if (value === 3) { returnValue = '1,2' }

    return returnValue;
  }

}

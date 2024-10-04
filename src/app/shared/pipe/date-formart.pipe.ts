import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormart'
})
export class DateFormartPipe implements PipeTransform {


  transform(value: string): string {
    if (!value) {
      return '';
    }

    const dateParts = value.split('-');

    if (dateParts.length !== 3) {
      return value;
    }

    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    return `${day}-${month}-${year}`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { HelperService } from '../service/helper.service';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  constructor(private helperService: HelperService) { }

  transform(value: number, currency: string): string {
    return this.helperService.formatCurrent(value, currency);
  }

}





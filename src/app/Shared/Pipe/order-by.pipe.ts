import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'OrderBy',
  pure: false
})
export class OrderByPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    const checked = value.filter(hero => hero.checked);
      const unchecked = value.filter(hero => !hero.checked);
      for (let i = 0; i < unchecked.length; i++) {
        checked.push(unchecked[i]);
      }
      return checked;
    }

}

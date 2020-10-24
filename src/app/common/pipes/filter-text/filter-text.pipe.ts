import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'filterText'
})
@Injectable({
  providedIn: 'root'
})

export class FilterTextPipe implements PipeTransform {

  transform(filterList, value, filterWith): any {
    if (!filterList) {
      return;
    }
    let search = value;
    if (!search) {
      return filterList;
    } else if (typeof search === 'string') {
      search = search.toLowerCase();
    }
    return filterList.filter(element => ((element[filterWith]) ? element[filterWith].toLowerCase().indexOf(search) > -1
    : element.toLowerCase().indexOf(search) > -1 ));
  }
}

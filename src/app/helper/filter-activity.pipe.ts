import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterpipe'
})
export class FilterPipe implements PipeTransform {
    transform(objects: any[]): any[] {
        if (objects) {
            return objects.filter(object => {
                return object.notifiable_type != 'NilClass';
            });
        }
    }
}

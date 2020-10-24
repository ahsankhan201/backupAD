import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

export function IsTaken(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        this.beneficiaryService.isBeneIbanExisits(control.value).pipe(map(res => {
            res ? control.setErrors({ ibanTaken: true }) : control.setErrors(undefined);
          }));
    };
}

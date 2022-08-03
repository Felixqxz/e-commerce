import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors {
        if (control.value?.trim().length === 0) {
            return {'notOnlyWhiteSpace': true};
        }

        return null as any;
    }
}

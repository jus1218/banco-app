import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl, FormArray, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {

  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";


  public cantBeStrider = (control: FormControl): ValidationErrors | null => {

    const value: string = control.value.trim().toLowerCase();

    if (value === 'strider') {
      return {
        noStrider: true,
      }
    }

    return null;
  }

  public isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  }
  public isValidFormControl(form: FormControl) {
    return form.errors && form.touched;
  }

  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors
      && formArray.controls[index].touched;
  }

  istouchedField(form: FormGroup, field: string): boolean {

    return form.controls[field].touched;
  }
  istouchedFieldInArray(formArray: FormArray, index: number): boolean {

    return formArray.controls[index].touched;
  }


  public isFieldOneEqualFieldTwo(field1: string, field2: string) {

    return (formGroup: AbstractControl): ValidationErrors | null => {

      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if (fieldValue1 !== fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        return { notEqual: true }
      }

      formGroup.get(field2)?.setErrors(null);
      return null;
    }

  }

  public phoneIsValid = [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.minLength(8), Validators.maxLength(15)];
  public cedulaIsValid = [Validators.required, Validators.pattern(/^[1-9][0-9]*$/), Validators.min(1), Validators.maxLength(9)];

  public mountIsValid = [Validators.required, Validators.pattern('^\\d+(\\.\\d{1,2})?$')];

  public offsetIsValid = [Validators.required, Validators.min(0)];
  public offsetIsLimit = [Validators.required, Validators.min(1)];

  // CUENTA CONTABLE
  public codigoCuentaContableIsValid = [Validators.required, Validators.minLength(1), Validators.maxLength(12)];
  public codigoBancoIsValid = [Validators.required, Validators.minLength(1), Validators.maxLength(3)];
  public codigoMonedaIsValid = [Validators.required, Validators.minLength(1), Validators.maxLength(3)];
  public descriptionIsValid = [Validators.required, Validators.minLength(1), Validators.maxLength(255)];
  public codigoTipoCuentaContableIsValid = [Validators.required, Validators.min(1), Validators.minLength(1)];


}
